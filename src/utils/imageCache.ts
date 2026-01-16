/**
 * Image Cache Utility
 * 
 * Provides efficient image preloading and caching using browser's native cache
 * and in-memory storage for optimal performance.
 */

import React from 'react';

interface ImageCacheEntry {
    url: string;
    loaded: boolean;
    timestamp: number;
    element?: HTMLImageElement;
}

class ImageCacheManager {
    private cache: Map<string, ImageCacheEntry>;
    private maxCacheSize: number;
    private maxCacheAge: number; // in milliseconds

    constructor(maxSize = 100, maxAge = 3600000) { // Default: 100 images, 1 hour
        this.cache = new Map();
        this.maxCacheSize = maxSize;
        this.maxCacheAge = maxAge;
    }

    /**
     * Preload a single image
     */
    async preloadImage(url: string): Promise<HTMLImageElement> {
        // Check if already in cache and still valid
        const cached = this.cache.get(url);
        if (cached && cached.loaded && cached.element) {
            const age = Date.now() - cached.timestamp;
            if (age < this.maxCacheAge) {
                return cached.element;
            }
        }

        // Load the image
        return new Promise((resolve, reject) => {
            const img = new Image();

            img.onload = () => {
                this.cache.set(url, {
                    url,
                    loaded: true,
                    timestamp: Date.now(),
                    element: img
                });

                // Cleanup old entries if cache is too large
                this.cleanupCache();
                resolve(img);
            };

            img.onerror = () => {
                reject(new Error(`Failed to load image: ${url}`));
            };

            // Start loading
            img.src = url;
        });
    }

    /**
     * Preload multiple images in parallel
     */
    async preloadImages(urls: string[]): Promise<HTMLImageElement[]> {
        const promises = urls.map(url => this.preloadImage(url));
        return Promise.all(promises);
    }

    /**
     * Preload images with priority (critical images first)
     */
    async preloadWithPriority(
        criticalUrls: string[],
        normalUrls: string[] = []
    ): Promise<void> {
        // Load critical images first
        await this.preloadImages(criticalUrls);

        // Then load normal images in background
        if (normalUrls.length > 0) {
            // Use requestIdleCallback if available, otherwise setTimeout
            if ('requestIdleCallback' in window) {
                requestIdleCallback(() => {
                    this.preloadImages(normalUrls);
                });
            } else {
                setTimeout(() => {
                    this.preloadImages(normalUrls);
                }, 100);
            }
        }
    }

    /**
     * Check if an image is cached
     */
    isCached(url: string): boolean {
        const cached = this.cache.get(url);
        if (!cached) return false;

        const age = Date.now() - cached.timestamp;
        return cached.loaded && age < this.maxCacheAge;
    }

    /**
     * Get cached image element
     */
    getCached(url: string): HTMLImageElement | null {
        const cached = this.cache.get(url);
        if (!cached || !cached.loaded || !cached.element) return null;

        const age = Date.now() - cached.timestamp;
        if (age >= this.maxCacheAge) {
            this.cache.delete(url);
            return null;
        }

        return cached.element;
    }

    /**
     * Clear entire cache
     */
    clearCache(): void {
        this.cache.clear();
    }

    /**
     * Remove a specific image from cache
     */
    remove(url: string): void {
        this.cache.delete(url);
    }

    /**
     * Cleanup old cache entries
     */
    private cleanupCache(): void {
        const now = Date.now();

        // Remove expired entries
        for (const [url, entry] of this.cache.entries()) {
            const age = now - entry.timestamp;
            if (age >= this.maxCacheAge) {
                this.cache.delete(url);
            }
        }

        // If still too large, remove oldest entries
        if (this.cache.size > this.maxCacheSize) {
            const entries = Array.from(this.cache.entries())
                .sort((a, b) => a[1].timestamp - b[1].timestamp);

            const toRemove = entries.slice(0, this.cache.size - this.maxCacheSize);
            toRemove.forEach(([url]) => this.cache.delete(url));
        }
    }

    /**
     * Get cache statistics
     */
    getStats() {
        return {
            size: this.cache.size,
            maxSize: this.maxCacheSize,
            entries: Array.from(this.cache.values()).map(entry => ({
                url: entry.url,
                loaded: entry.loaded,
                age: Date.now() - entry.timestamp
            }))
        };
    }
}

// Create and export singleton instance
export const imageCache = new ImageCacheManager();

/**
 * React Hook for image preloading
 */
export const useImagePreload = (urls: string | string[]) => {
    const [loaded, setLoaded] = React.useState(false);
    const [error, setError] = React.useState<Error | null>(null);

    React.useEffect(() => {
        const urlArray = Array.isArray(urls) ? urls : [urls];

        imageCache.preloadImages(urlArray)
            .then(() => setLoaded(true))
            .catch((err) => setError(err));
    }, [urls]);

    return { loaded, error };
};

/**
 * Utility function to extract all image URLs from content data
 */
export const extractImageUrls = (data: any): string[] => {
    const urls: string[] = [];

    const extract = (obj: any) => {
        if (typeof obj === 'string' && (obj.startsWith('http') || obj.startsWith('/'))) {
            if (obj.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
                urls.push(obj);
            }
        } else if (Array.isArray(obj)) {
            obj.forEach(item => extract(item));
        } else if (obj && typeof obj === 'object') {
            Object.values(obj).forEach(value => extract(value));
        }
    };

    extract(data);
    return [...new Set(urls)]; // Remove duplicates
};

export default imageCache;
