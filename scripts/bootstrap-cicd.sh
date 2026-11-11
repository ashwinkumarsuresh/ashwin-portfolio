#!/usr/bin/env bash
# One-time CI/CD bootstrap for .github/workflows/deploy.yml: a Workload Identity
# Federation pool + provider, two service accounts and their IAM bindings, so
# GitHub Actions deploys with no service-account key stored in GitHub.
# Same pattern as alpaca-portfolio-dashboard/scripts/bootstrap-cicd.sh.
# Idempotent: safe to re-run. Run it from your laptop, signed in with gcloud.
#
#   CHAT_SECRET=<secret name> [CHAT_SECRET_PROJECT=<project>] scripts/bootstrap-cicd.sh
#
# CHAT_SECRET is the Secret Manager secret holding the chat backend key (the
# value in .env.local as VITE_CHAT_API_KEY). The script grants read access to
# that one secret; it never creates it or reads its value.
set -euo pipefail

PROJECT_ID="${PROJECT_ID:-ashwin-portfolio-dac5e}"
REPO="ashwinkumarsuresh/ashwin-portfolio"
POOL="github-actions-pool"
PROVIDER="github-actions-provider"
CHAT_SECRET="${CHAT_SECRET:?Set CHAT_SECRET to the Secret Manager secret name that holds the chat key}"
CHAT_SECRET_PROJECT="${CHAT_SECRET_PROJECT:-${PROJECT_ID}}"

PROJECT_NUMBER=$(gcloud projects describe "${PROJECT_ID}" --format='value(projectNumber)')
WIF_POOL="projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/${POOL}"
WIF_PROVIDER="${WIF_POOL}/providers/${PROVIDER}"
DEPLOY_SA="github-deploy-sa@${PROJECT_ID}.iam.gserviceaccount.com"
PREVIEW_SA="github-preview-sa@${PROJECT_ID}.iam.gserviceaccount.com"

echo "==> Checking the chat secret exists..."
if ! gcloud secrets describe "${CHAT_SECRET}" --project "${CHAT_SECRET_PROJECT}" &>/dev/null; then
  echo "ERROR: secret ${CHAT_SECRET} not found in project ${CHAT_SECRET_PROJECT}." >&2
  echo "Create it first (paste the key when prompted, then press Ctrl-D):" >&2
  echo "  gcloud secrets create ${CHAT_SECRET} --project ${CHAT_SECRET_PROJECT} --data-file=-" >&2
  exit 1
fi

echo "==> Enabling APIs..."
gcloud services enable \
  iamcredentials.googleapis.com iam.googleapis.com sts.googleapis.com \
  cloudresourcemanager.googleapis.com firebase.googleapis.com \
  firebasehosting.googleapis.com secretmanager.googleapis.com \
  --project "${PROJECT_ID}" --quiet

echo "==> Creating WIF pool (if missing)..."
if ! gcloud iam workload-identity-pools describe "${POOL}" --location=global --project "${PROJECT_ID}" &>/dev/null; then
  gcloud iam workload-identity-pools create "${POOL}" --location=global --project "${PROJECT_ID}" \
    --display-name="GitHub Actions" --description="OIDC federation for ${REPO}"
fi

# repo_and_ref pins the live-deploy account to main; repo_and_event pins the
# preview account to pull_request events. The provider condition only admits
# tokens from this repository.
ATTRIBUTE_MAPPING="google.subject=assertion.sub,attribute.repository=assertion.repository,attribute.ref=assertion.ref,attribute.event_name=assertion.event_name,attribute.repo_and_ref=assertion.repository+'@'+assertion.ref,attribute.repo_and_event=assertion.repository+'@'+assertion.event_name"

echo "==> Creating OIDC provider (if missing)..."
if ! gcloud iam workload-identity-pools providers describe "${PROVIDER}" \
    --location=global --workload-identity-pool="${POOL}" --project "${PROJECT_ID}" &>/dev/null; then
  gcloud iam workload-identity-pools providers create-oidc "${PROVIDER}" \
    --location=global --workload-identity-pool="${POOL}" --project "${PROJECT_ID}" \
    --issuer-uri="https://token.actions.githubusercontent.com" \
    --attribute-mapping="${ATTRIBUTE_MAPPING}" \
    --attribute-condition="assertion.repository == '${REPO}'"
else
  gcloud iam workload-identity-pools providers update-oidc "${PROVIDER}" \
    --location=global --workload-identity-pool="${POOL}" --project "${PROJECT_ID}" \
    --attribute-mapping="${ATTRIBUTE_MAPPING}" --quiet >/dev/null
fi

create_sa() {
  local NAME="$1" DISPLAY="$2" EMAIL="$1@${PROJECT_ID}.iam.gserviceaccount.com" TRIES=0
  if ! gcloud iam service-accounts describe "${EMAIL}" --project "${PROJECT_ID}" &>/dev/null; then
    echo "==> Creating service account ${NAME}..."
    gcloud iam service-accounts create "${NAME}" --display-name="${DISPLAY}" --project "${PROJECT_ID}"
    until gcloud iam service-accounts describe "${EMAIL}" --project "${PROJECT_ID}" &>/dev/null; do
      sleep 2; TRIES=$((TRIES + 1))
      [ "${TRIES}" -lt 20 ] || { echo "ERROR: ${EMAIL} did not propagate within 40s" >&2; exit 1; }
    done
  fi
}

grant() {
  local SA="$1" ROLE="$2"
  echo "==> Granting ${ROLE} to ${SA}..."
  gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
    --member="serviceAccount:${SA}" --role="${ROLE}" --condition=None --quiet >/dev/null
  gcloud secrets add-iam-policy-binding "${CHAT_SECRET}" --project "${CHAT_SECRET_PROJECT}" \
    --member="serviceAccount:${SA}" --role="roles/secretmanager.secretAccessor" --quiet >/dev/null
}

bind_wif() {
  echo "==> Letting $2 act as $1..."
  gcloud iam service-accounts add-iam-policy-binding "$1" --project "${PROJECT_ID}" \
    --role="roles/iam.workloadIdentityUser" --member="$2" --quiet >/dev/null
}

# Firebase Hosting has no channel-only role: firebasehosting.admin on the preview
# account can also release to the live channel. Its binding to pull_request
# events is what bounds it, and opening a same-repo PR needs write access.
for SA_NAME in github-deploy-sa github-preview-sa; do
  create_sa "${SA_NAME}" "GitHub CI: Firebase Hosting (${SA_NAME})"
done
for SA in "${DEPLOY_SA}" "${PREVIEW_SA}"; do
  grant "${SA}" "roles/firebasehosting.admin"
  gcloud projects add-iam-policy-binding "${PROJECT_ID}" --member="serviceAccount:${SA}" \
    --role="roles/serviceusage.serviceUsageConsumer" --condition=None --quiet >/dev/null
done
bind_wif "${DEPLOY_SA}" "principalSet://iam.googleapis.com/${WIF_POOL}/attribute.repo_and_ref/${REPO}@refs/heads/main"
bind_wif "${PREVIEW_SA}" "principalSet://iam.googleapis.com/${WIF_POOL}/attribute.repo_and_event/${REPO}@pull_request"

cat <<VARS

Bootstrap complete. Set these repository variables (not secrets; none is sensitive):

gh variable set GCP_PROJECT_ID      --repo ${REPO} --body "${PROJECT_ID}"
gh variable set WIF_PROVIDER        --repo ${REPO} --body "${WIF_PROVIDER}"
gh variable set GH_DEPLOY_SA        --repo ${REPO} --body "${DEPLOY_SA}"
gh variable set GH_PREVIEW_SA       --repo ${REPO} --body "${PREVIEW_SA}"
gh variable set CHAT_API_KEY_SECRET --repo ${REPO} --body "${CHAT_SECRET_PROJECT}/${CHAT_SECRET}"
VARS
