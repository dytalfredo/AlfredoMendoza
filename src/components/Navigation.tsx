import React from 'react';
import { Menu, X, Lock } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import contentData from '../data/content.json';

const Navigation = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [showFullName, setShowFullName] = React.useState(false); // Controlled by Scroll Events
    const [isHovered, setIsHovered] = React.useState(false); // Controlled by Mouse Hover
    const location = useLocation();
    const navigate = useNavigate();

    // Logic: Show full name if triggered by scroll section OR if user is hovering the logo
    const shouldShowLogoText = showFullName || isHovered;

    const toggleMenu = () => setIsOpen(!isOpen);

    React.useEffect(() => {
        const handleToggle = (e: any) => {
            setShowFullName(e.detail);
            // Close mobile menu if we enter the specialized section
            if (e.detail) setIsOpen(false);
        };

        window.addEventListener('toggle-header-name', handleToggle);
        return () => {
            window.removeEventListener('toggle-header-name', handleToggle);
        };
    }, []);

    const handleScroll = (id: string) => {
        setIsOpen(false);

        // Helper to perform the scroll
        const scrollToElement = () => {
            if (id === 'home') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }
        };

        // Logic for Route switching
        if (location.pathname !== '/') {
            navigate('/');
            // Wait for React to render the Home page before looking for elements
            setTimeout(scrollToElement, 100);
        } else {
            scrollToElement();
        }
    };

    const { links } = contentData.navigation;

    return (
        <nav
            // Layout logic remains bound to showFullName (scroll) to prevent menu jumping on hover
            className={`fixed top-0 left-0 w-full z-50 flex items-center p-6 md:p-10 mix-blend-difference text-white transition-all duration-500 ease-in-out ${showFullName ? 'justify-center' : 'justify-between'}`}
        >
            <motion.div
                layout
                transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
                className="relative z-50 flex items-center justify-center h-[30px]"
            >
                <button
                    onClick={() => handleScroll('home')}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className="flex items-center justify-center min-w-[50px] bg-transparent border-none cursor-pointer"
                >
                    <AnimatePresence mode="wait">
                        {shouldShowLogoText ? (
                            <motion.span
                                key="full"
                                initial={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
                                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                                exit={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
                                transition={{ duration: 0.4 }}
                                className="text-2xl md:text-3xl font-serif italic font-bold tracking-tight whitespace-nowrap"
                            >
                                Alfredo Mendoza
                            </motion.span>
                        ) : (
                            <motion.span
                                key="short"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="text-2xl font-serif italic font-bold tracking-tighter"
                            >
                                AM.
                            </motion.span>
                        )}
                    </AnimatePresence>
                </button>
            </motion.div>

            <AnimatePresence>
                {/* Navigation links are hidden only when scroll triggers the "Full Screen Header" mode, NOT on hover */}
                {!showFullName && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20, transition: { duration: 0.3 } }}
                        className="flex items-center gap-8"
                    >
                        <div className="hidden md:flex gap-8 items-center">
                            {links.map((link) => (
                                <button
                                    key={link.name}
                                    onClick={() => handleScroll(link.id)}
                                    className="relative text-sm uppercase tracking-widest font-sans font-light bg-transparent border-none cursor-pointer text-white after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-stone-500 after:transition-all after:duration-300 hover:after:w-full"
                                >
                                    {link.name}
                                </button>
                            ))}
                            <Link to="/admin" className="ml-4 opacity-50 hover:opacity-100 transition-opacity">
                                <Lock size={16} />
                            </Link>
                        </div>

                        <button className="md:hidden" onClick={toggleMenu}>
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && !showFullName && (
                    <motion.div
                        initial={{ opacity: 0, y: "-100%" }}
                        animate={{ opacity: 1, y: "0%" }}
                        exit={{ opacity: 0, y: "-100%" }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed inset-0 bg-stone-900 text-stone-50 flex flex-col justify-center items-center gap-8 z-40 md:hidden"
                    >
                        {links.map((link) => (
                            <button
                                key={link.name}
                                onClick={() => handleScroll(link.id)}
                                className="text-4xl font-serif italic hover:text-terracotta transition-colors bg-transparent border-none cursor-pointer"
                            >
                                {link.name}
                            </button>
                        ))}
                        <Link to="/admin" onClick={() => setIsOpen(false)} className="mt-8 text-sm uppercase opacity-50">
                            Área Admin
                        </Link>

                        {/* Close button for mobile menu specifically */}
                        <button onClick={() => setIsOpen(false)} className="absolute top-6 right-6 p-2">
                            <X size={24} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navigation;