import { defineConfig, passthroughImageService } from 'astro/config';
import { teuriaIntegrations } from './astro.config.all';

export default defineConfig({
    site: "https://terria-k.github.io",
    integrations: teuriaIntegrations(),
    image: {
        service: passthroughImageService()
    }
});
