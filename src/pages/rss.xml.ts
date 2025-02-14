import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getPosts } from '../utils/posts';

export const GET: APIRoute = async ({ }) => {
  const posts = await getPosts();
  return rss({
    title: 'Teuria’s Blog',
    description: 'A blog contains devlog and life from Teuria.',
    site: import.meta.env.SITE,
    stylesheet: "/rss/styles.xsl",
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: `/posts/${post.id}/`,
    })),
  });
}