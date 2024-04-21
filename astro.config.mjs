import { defineConfig, sharpImageService } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import icon from 'astro-icon'
import mdx from '@astrojs/mdx';
import sharp from 'sharp';

// https://astro.build/config
export default defineConfig({
    site: "https://terria-k.github.io",
    integrations: [tailwind(), icon(), mdx()],
    image: {
        service: sharpImageService()
    }
});
