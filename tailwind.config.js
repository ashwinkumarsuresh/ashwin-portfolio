/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: '#FAF7F2',   // background
        ink: '#1C1A17',     // text — 16.25:1 on paper
        ochre: '#8A5E1A',   // single accent — 5.32:1 on paper (WCAG AA for small text; re-verify if changed)
        'ink-soft': '#5a5650',
        'rule-soft': '#ded8cc',
      },
      fontFamily: {
        display: ['Fraunces', 'fraunces-fallback', 'Georgia', 'serif'],
        serif: ['Newsreader', 'newsreader-fallback', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
}
