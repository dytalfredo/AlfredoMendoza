import { defineCollection, z } from 'astro:content';

/**
 * Predefined Blog Categories
 * 
 * Use estas categorías para mantener consistencia en el blog:
 * - Desarrollo Web: Tutoriales, técnicas y mejores prácticas de desarrollo
 * - Negocios Digitales: Estrategias, casos de éxito y crecimiento empresarial
 * - Automatización: Procesos, herramientas y optimización de workflows
 * - IA & Machine Learning: Implementaciones prácticas y casos de uso
 * - Opinión: Reflexiones personales sobre tecnología y la industria
 * - Diseño: UX/UI, diseño de producto y experiencias digitales
 */
export const BLOG_CATEGORIES = [
    'Desarrollo Web',
    'Negocios Digitales',
    'Automatización',
    'IA & Machine Learning',
    'Opinión',
    'Diseño'
] as const;

const blog = defineCollection({
    schema: z.object({
        technicalName: z.string(), // Title of the post
        category: z.enum(BLOG_CATEGORIES), // Predefined categories
        year: z.string(),
        client: z.string().optional(),
        img: z.string(), // Local path to image
        shortDesc: z.string(),
        highlightQuote: z.string(),
        story: z.object({
            conflict: z.string(), // "Challenge"
            strategy: z.string(),
            result: z.string(),
            tech: z.array(z.string()).optional() // Can override general techStack
        }),
        techStack: z.array(z.string()),
        stats: z.array(z.object({
            label: z.string(),
            value: z.string()
        })).optional(),
        pubDate: z.date().optional(), // Metadata for sorting
    }),
});

export const collections = { blog };
