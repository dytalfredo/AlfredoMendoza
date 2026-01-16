import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Instagram, MessageCircle, Send, Hexagon } from 'lucide-react';
import contentData from '../data/content.json';

interface FloatingActionsProps {
    onOpenContact: () => void;
}

const FloatingActions: React.FC<FloatingActionsProps> = ({ onOpenContact }) => {
    const { contact } = contentData;

    // Custom TikTok Icon as it's not in Lucide by default in some versions or needs special handling
    const TikTokIcon = () => (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
        >
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
        </svg>
    );

    const handleScroll = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const headerOffset = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.5
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.8, y: 20 },
        visible: { opacity: 1, scale: 1, y: 0 }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="fixed bottom-0 left-0 w-full md:w-auto md:left-auto md:bottom-6 md:right-6 z-[9999] flex md:flex-col items-center md:items-end justify-evenly md:justify-end gap-3 p-4 md:p-0 bg-stone-900/90 md:bg-transparent backdrop-blur-md md:backdrop-blur-none border-t border-white/10 md:border-none"
        >
            {/* Social Links Loop */}
            <div className="flex md:flex-col items-center md:items-end gap-3 order-1 md:order-1">
                <motion.a
                    variants={itemVariants}
                    href={contact.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white text-black hover:bg-black hover:text-white transition-all duration-300 shadow-xl border border-stone-200 group pointer-events-auto"
                    aria-label="Instagram"
                >
                    <Instagram size={18} className="group-hover:scale-110 transition-transform md:w-[20px] md:h-[20px]" />
                </motion.a>

                <motion.a
                    variants={itemVariants}
                    href={contact.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white text-black hover:bg-black hover:text-white transition-all duration-300 shadow-xl border border-stone-200 group pointer-events-auto"
                    aria-label="TikTok"
                >
                    <TikTokIcon />
                </motion.a>
            </div>

            {/* CTA Button */}
            <motion.a
                variants={itemVariants}
                href="#contact"
                onClick={(e) => {
                    e.preventDefault();
                    onOpenContact();
                }}
                className="order-2 md:order-2 group relative flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 bg-black text-white rounded-full font-sans text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold shadow-2xl overflow-hidden hover:pr-14 transition-all duration-500 pointer-events-auto cursor-pointer"
            >
                <span className="relative z-10 whitespace-nowrap">Contactar</span>
                <Send size={14} className="absolute right-4 md:right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0" />
            </motion.a>

            {/* WhatsApp */}
            <motion.a
                variants={itemVariants}
                href={`https://wa.me/${contact.whatsapp.replace(/\+/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="order-3 md:order-3 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-full bg-white text-black hover:bg-black hover:text-white transition-all duration-500 shadow-2xl border-2 md:border-4 border-black group"
                aria-label="WhatsApp"
            >
                <MessageCircle size={24} className="group-hover:scale-110 transition-transform md:w-[32px] md:h-[32px]" />
            </motion.a>
        </motion.div>
    );
};

export default FloatingActions;
