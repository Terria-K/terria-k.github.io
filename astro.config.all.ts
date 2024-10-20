import tailwind from '@astrojs/tailwind';
import icon from 'astro-icon'
import mdx from '@astrojs/mdx';
import metaTags from "astro-meta-tags";
import playformInline from "@playform/inline";
import svelte from "@astrojs/svelte";

export function teuriaIntegrations() {
    return [
        tailwind(), icon(), mdx(), metaTags(), svelte(), playformInline({
            Critters: true
        })
    ]
}