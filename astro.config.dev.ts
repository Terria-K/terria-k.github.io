import { defineConfig, passthroughImageService } from 'astro/config';
import { teuriaIntegrations } from './astro.config.all';

export default defineConfig({
    integrations: teuriaIntegrations(),
    output: 'static',
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
