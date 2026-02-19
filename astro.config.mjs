import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { readFileSync } from 'node:fs';
import { URL } from 'node:url';

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf-8'));

// https://astro.build/config
export default defineConfig({
    site: 'https://alfredomendoza.netlify.app',
    vite: {
        plugins: [tailwindcss()],
        define: {
            'import.meta.env.APP_VERSION': JSON.stringify(pkg.version),
        },
    },
    integrations: [react()],
});
