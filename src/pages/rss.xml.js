import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
    const posts = await getCollection('blog');
    return rss({
        title: 'Alfredo Mendoza | Blog',
        description: 'Pensamientos sobre arquitectura de software, desarrollo web y negocios digitales.',
        site: context.site || 'https://alfredomendoza.dev', // Fallback if site not set in astro.config
        items: posts.map((post) => ({
            title: post.data.technicalName,
            pubDate: post.data.pubDate,
            description: post.data.shortDesc,
            link: `/blog/${post.slug}/`,
        })),
        customData: `<language>es-ES</language>`,
    });
}
