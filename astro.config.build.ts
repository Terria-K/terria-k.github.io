import { defineConfig, sharpImageService } from 'astro/config';
import { teuriaIntegrations } from './astro.config.all';
import vercel from "@astrojs/vercel/serverless";

export default defineConfig({
    integrations: teuriaIntegrations(),
    output: 'hybrid',
    image: {
        service: sharpImageService()
    },
    vite: {
        define: {
            "process.env.NODE_ENV": `'${process.env.NODE_ENV}'`,
        }
    },
    adapter: vercel()
});

