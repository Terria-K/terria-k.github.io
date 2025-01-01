import tailwind from '@astrojs/tailwind';
import icon from 'astro-icon'
import mdx from '@astrojs/mdx';
import metaTags from "astro-meta-tags";
import playformInline from "@playform/inline";
import removeOriginalImages from './src/hooks/removeOriginalImages';

export function teuriaIntegrations() {
    return [
        tailwind(), icon(), mdx(), metaTags(), 
        removeOriginalImages()
    ]
}