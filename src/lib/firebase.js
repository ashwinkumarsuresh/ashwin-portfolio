import { initializeApp, getApps } from 'firebase/app';
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';

// Firebase web app for project ashwin-portfolio-dac5e, with App Check.
//
// No config or key lives in the repo. On Firebase Hosting the app's web config
// is served at /__/firebase/init.json; `npm run dev` has no such route, so it
// reads VITE_FIREBASE_CONFIG (the same JSON) from .env.local instead.
//
// App Check (reCAPTCHA Enterprise) proves requests come from this site, so the
// Gemini quota behind the chat can't be spent by scripts calling the API
// directly. The reCAPTCHA site key is a public identifier, not a secret.
export const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

async function loadConfig() {
    if (import.meta.env.VITE_FIREBASE_CONFIG) {
        return JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG);
    }
    const res = await fetch('/__/firebase/init.json');
    if (!res.ok) throw new Error(`Firebase config unavailable (${res.status})`);
    return res.json();
}

let appPromise;

export function getFirebaseApp() {
    if (!appPromise) {
        appPromise = (async () => {
            const existing = getApps()[0];
            if (existing) return existing;
            const app = initializeApp(await loadConfig());
            if (import.meta.env.DEV) {
                // Prints a debug token in the console; register it under
                // App Check > Apps > Manage debug tokens. Never allow localhost
                // in the reCAPTCHA key instead: anyone could then run the site locally.
                self.FIREBASE_APPCHECK_DEBUG_TOKEN = import.meta.env.VITE_APPCHECK_DEBUG_TOKEN || true;
            }
            if (RECAPTCHA_SITE_KEY) {
                initializeAppCheck(app, {
                    provider: new ReCaptchaEnterpriseProvider(RECAPTCHA_SITE_KEY),
                    isTokenAutoRefreshEnabled: true,
                });
            } else {
                console.warn('VITE_RECAPTCHA_SITE_KEY is not set; App Check is off and the chat will be refused once it is enforced.');
            }
            return app;
        })().catch((err) => {
            appPromise = undefined; // let the next message try again
            throw err;
        });
    }
    return appPromise;
}
