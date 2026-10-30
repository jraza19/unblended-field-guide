import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import remarkFieldGuide from './src/plugins/remark-field-guide.mjs';

// Site and base are set for GitHub Pages at jraza19.github.io/unblended-field-guide.
// Change them if the site moves to another host or a custom domain.
const base = '/unblended-field-guide';

export default defineConfig({
  site: 'https://jraza19.github.io',
  base,
  markdown: {
    remarkPlugins: [
      [remarkFieldGuide, { base, glossaryDir: fileURLToPath(new URL('./src/content/glossary', import.meta.url)), stagesFile: fileURLToPath(new URL('./src/lib/path-stages.json', import.meta.url)) }],
    ],
  },
});
