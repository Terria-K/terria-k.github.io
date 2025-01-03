import { defineConfig, sharpImageService } from 'astro/config';
import { teuriaIntegrations } from './astro.config.all';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
    integrations: teuriaIntegrations(),
    output: 'static',
    image: {
        service: sharpImageService()
    },
    vite: {
        ssr: {
            external: ["assert", "buffer", "crypto", "child_process", "dns", "fs", "http", "https", "path", "tls", "net", "events", "util", "stream", "os", "zlib"]
        },
        define: {
            "process.env.NODE_ENV": `'${process.env.NODE_ENV}'`,
        }
    },
    adapter: cloudflare({
        imageService: "custom",
        platformProxy: {
            enabled: true,
            configPath: "wrangler.toml"
        }
    }),
    markdown: {
        shikiConfig: {
            theme: "tokyo-night",
            wrap: false
        }
    },
});

