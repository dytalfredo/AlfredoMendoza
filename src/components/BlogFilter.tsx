import React, { useState, useMemo } from 'react';
import { ArrowUpRight } from 'lucide-react';

import type { CollectionEntry } from 'astro:content';

type BlogPost = CollectionEntry<'blog'>;

const BlogFilter = ({ posts }: { posts: BlogPost[] }) => {
    // Extract unique categories
    const categories = useMemo(() => {
        const unique = Array.from(new Set(posts.map(p => p.data.category)));
        return ['Todos', ...unique.sort()];
    }, [posts]);

    const [activeCategory, setActiveCategory] = useState('Todos');

    const filteredPosts = useMemo(() => {
        if (activeCategory === 'Todos') return posts;
        return posts.filter(p => p.data.category === activeCategory);
    }, [posts, activeCategory]);

    return (
        <div className="space-y-12">
            {/* Filter Chips */}
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-5 py-2 rounded-full text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-300 border ${activeCategory === cat
                            ? 'bg-stone-900 text-white border-stone-900'
                            : 'bg-transparent text-stone-500 border-stone-300 hover:border-stone-900 hover:text-stone-900'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16 min-h-[50vh]">
                {filteredPosts.map((post) => (
                    <a key={post.slug} href={`/blog/${post.slug}`} className="group flex flex-col h-full">
                        <article className="flex-1 flex flex-col">
                            <div className="overflow-hidden rounded-md bg-stone-200 aspect-[4/3] relative mb-6">
                                <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                                <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/20 transition-colors duration-500 z-10 pointer-events-none"></div>

                                <img
                                    src={post.data.img}
                                    alt={post.data.technicalName}
                                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0 grayscale"
                                />
                                <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-stone-900 shadow-sm">
                                    {post.data.category}
                                </div>
                                <div className="absolute bottom-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white p-2 rounded-full shadow-lg">
                                    <ArrowUpRight size={16} className="text-stone-900" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-xs font-mono text-stone-400 border-b border-stone-200 pb-3 mb-3">
                                    <span>{post.data.year}</span>
                                    <span className="group-hover:text-terracotta transition-colors">Leer Artículo</span>
                                </div>
                                <h2 className="text-2xl md:text-3xl font-serif font-bold group-hover:text-terracotta transition-colors leading-tight">
                                    {post.data.technicalName}
                                </h2>
                                <p className="text-stone-600 text-sm md:text-base leading-relaxed line-clamp-3 font-light">
                                    {post.data.shortDesc}
                                </p>
                            </div>
                        </article>
                    </a>
                ))}
            </div>

            {filteredPosts.length === 0 && (
                <div className="py-20 text-center text-stone-400 font-light italic">
                    No hay artículos en esta categoría aún.
                </div>
            )}
        </div>
    );
};

export default BlogFilter;
