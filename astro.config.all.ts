import icon from 'astro-icon'
import mdx from '@astrojs/mdx';
import metaTags from "astro-meta-tags";
import removeOriginalImages from './src/hooks/removeOriginalImages';

export function teuriaIntegrations() {
    return [
        icon(), mdx(), metaTags(), 
        removeOriginalImages()
    ]
}