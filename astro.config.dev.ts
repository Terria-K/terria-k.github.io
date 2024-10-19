import { defineConfig, passthroughImageService } from 'astro/config';
import { teuriaIntegrations } from './astro.config.all';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
    integrations: teuriaIntegrations(),
    output: 'hybrid',
    image: {
        service: passthroughImageService()
    },
    vite: {
        define: {
            "process.env.NODE_ENV": `'${process.env.NODE_ENV}'`,
        }
    },
    markdown: {
        shikiConfig: {
            theme: "tokyo-night",
            wrap: false
        }
    }
});
