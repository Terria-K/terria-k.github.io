import { defineConfig, sharpImageService } from 'astro/config';
import { teuriaIntegrations } from './astro.config.all';

export default defineConfig({
    site: "https://terria-k.github.io",
    integrations: teuriaIntegrations(),
    image: {
        service: sharpImageService()
    }
});

