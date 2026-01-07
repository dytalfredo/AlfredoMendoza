import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface LoadingScreenProps {
    onComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
    const [isExit, setIsExit] = useState(false);

    const handleEnter = () => {
        setIsExit(true);
        setTimeout(onComplete, 800); // Wait for exit animation
    };

    return (
        <AnimatePresence>
            {!isExit && (
                <motion.div
                    className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-stone-900 text-stone-50"
                    exit={{ y: "-100%", transition: { duration: 0.8, ease: "easeInOut" } }}
                >
                    {/* Animated Monogram */}
                    <div className="relative mb-12">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            className="font-serif text-9xl font-bold tracking-tighter relative z-10 select-none"
                        >
                            <span className="inline-block relative z-10 mix-blend-difference">A</span>
                            <span className="inline-block -ml-8 text-terracotta relative z-0">M</span>
                        </motion.div>

                        {/* Subtle glow effect */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.2 }}
                            transition={{ delay: 1, duration: 1 }}
                            className="absolute inset-0 blur-3xl bg-terracotta/50 -z-10"
                        />
                    </div>

                    {/* Enter Button */}
                    <motion.button
                        onClick={handleEnter}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.5, duration: 0.8 }}
                        className="group flex items-center gap-4 px-8 py-3 overflow-hidden rounded-full border border-stone-700 hover:border-terracotta hover:bg-white/5 transition-all duration-300"
                    >
                        <span className="text-sm font-sans uppercase tracking-[0.2em] group-hover:text-terracotta transition-colors">
                            Ingresar
                        </span>
                        <ArrowRight size={16} className="text-stone-500 group-hover:text-terracotta group-hover:translate-x-1 transition-all" />
                    </motion.button>

                    {/* Status Text - Optional loading flavor */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="absolute bottom-10 left-10 text-[10px] font-mono text-stone-600 uppercase tracking-widest"
                    >
                        System Ready
                    </motion.div>

                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LoadingScreen;
