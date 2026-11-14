import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { atlasStats, earlierEntries } from './src/lib/atlas.js'

const SITE = 'https://ashwinkumars.com'

// Link previews (Slack, LinkedIn, iMessage) read the HTML the server sends and
// never run the app, so /atlas needs its own head. At build time this copies the
// built index.html to atlas.html with the atlas page's title, description and
// card image; firebase.json's cleanUrls serves it at /atlas. The counts come from
// src/data/trips.json, so the description stays right as trips are added.
function atlasLinkPreview() {
  const escape = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
  const setMeta = (html, attr, key, value) => {
    const re = new RegExp(`(<meta ${attr}="${key}" content=")[^"]*(")`)
    if (!re.test(html)) throw new Error(`atlas link preview: index.html has no ${attr}="${key}" tag`)
    return html.replace(re, `$1${escape(value)}$2`)
  }
  return {
    name: 'atlas-link-preview',
    apply: 'build',
    writeBundle(options) {
      const indexFile = path.join(options.dir, 'index.html')
      if (!fs.existsSync(indexFile)) return
      const data = JSON.parse(fs.readFileSync(new URL('./src/data/trips.json', import.meta.url), 'utf8'))
      const s = atlasStats(data.trips, earlierEntries(data.earlier))
      const title = 'Travel atlas — Ashwin Kumar Suresh'
      const description =
        `${s.trips} trips since ${s.firstYear}, ${s.parks} national parks and ${s.states} states, ` +
        'on one map. A family travel log with routes, a timeline and a parks passport.'
      const url = `${SITE}/atlas`
      const image = `${SITE}/assets/og-atlas.png`

      let html = fs.readFileSync(indexFile, 'utf8')
      html = html.replace(/<title>[^<]*<\/title>/, `<title>${escape(title)}</title>`)
      html = html.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
      html = setMeta(html, 'name', 'description', description)
      html = setMeta(html, 'property', 'og:url', url)
      html = setMeta(html, 'property', 'og:title', title)
      html = setMeta(html, 'property', 'og:description', description)
      html = setMeta(html, 'property', 'og:image', image)
      html = setMeta(html, 'name', 'twitter:title', title)
      html = setMeta(html, 'name', 'twitter:description', description)
      html = setMeta(html, 'name', 'twitter:image', image)
      html = html.replace(
        /(<meta name="twitter:image"[^>]*>)/,
        '$1\n    <meta property="og:image:alt" content="Map of the United States with a pin for each trip" />'
      )
      fs.writeFileSync(path.join(options.dir, 'atlas.html'), html)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), atlasLinkPreview()],
  server: {
    port: 3000
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test-setup.js'
  }
})
