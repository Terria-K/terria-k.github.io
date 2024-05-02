import tailwind from '@astrojs/tailwind';
import icon from 'astro-icon'
import mdx from '@astrojs/mdx';
import metaTags from "astro-meta-tags";
import qwikdev from "@qwikdev/astro"

export function teuriaIntegrations() {
    return [
        tailwind(), icon(), mdx(), metaTags(), qwikdev()
    ]
}