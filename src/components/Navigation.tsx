import React from 'react';
import { Menu, X, Lock } from 'lucide-react';
import * as ReactRouterDOM from 'react-router-dom';
// Handle Vite/CJS interop: check if the module has a default export containing the named exports
const RouterNamespace = (ReactRouterDOM as any).default ?? ReactRouterDOM;
const { Link, useLocation, useNavigate, BrowserRouter } = RouterNamespace;
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import contentData from '../data/content.json';

gsap.registerPlugin(ScrollToPlugin);

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
        console.log('--- handleScroll triggered ---', { id, currentPath: location.pathname });
        setIsOpen(false);

        const scrollToElement = () => {
            console.log('Attempting to scroll to:', id);
            if (id === 'home') {
                gsap.to(window, { duration: 1, scrollTo: { y: 0 }, ease: "power2.out" });
            } else {
                // Determine offset based on section and direction
                // Get approximate target position to determine direction
                const targetElem = document.getElementById(id);
                const currentScroll = window.scrollY;
                let targetY = currentScroll; // Default fallback

                if (targetElem) {
                    const rect = targetElem.getBoundingClientRect();
                    targetY = rect.top + currentScroll;
                }

                // Default offset logic
                let offset = 80;

                if (id === 'philosophy') {
                    // Philosophy Special Logic:
                    // Down: Scroll deeper (-400) to show first item immediately.
                    // Up: Scroll to top (0) to show the start of the section properly (user said "lacks going up").
                    if (targetY > currentScroll) {
                        offset = -400; // Going Down
                    } else {
                        offset = 0; // Going Up
                    }
                }
                else if (['industries', 'products'].includes(id)) {
                    offset = 0;
                }

                // GSAP ScrollToPlugin handles the offset and element lookup automatically with the selector
                // We use a slight delay or retry if the element isn't immediately available after route change
                gsap.to(window, {
                    duration: 1.5,
                    scrollTo: { y: `#${id}`, offsetY: offset },
                    ease: "power2.inOut"
                });
            }
        };

        if (location.pathname !== '/') {
            console.log('Navigating to root before scrolling...');
            navigate('/');
            // Wait a bit longer for the substantial homepage to load/hydrate
            setTimeout(scrollToElement, 500);
        } else {
            scrollToElement();
        }
    };

    const { links } = contentData.navigation;

    return (
        <nav
            // Remove mix-blend-difference when menu is open to prevent color inversion issues on the overlay
            className={`fixed top-0 left-0 w-full z-50 flex items-center p-6 md:p-10 text-white transition-all duration-500 ease-in-out ${isOpen ? '' : 'mix-blend-difference'} ${showFullName ? 'justify-center' : 'justify-between'}`}
        >
            <motion.div
                layout
                transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
                className="relative z-50 flex items-center justify-center h-[30px]"
            >
                <a
                    href={location.pathname !== '/' ? '/' : undefined}
                    onClick={(e) => {
                        if (location.pathname === '/') {
                            e.preventDefault();
                            handleScroll('home');
                        }
                    }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className="flex items-center justify-center min-w-[50px] bg-transparent border-none cursor-pointer no-underline"
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
                </a>
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
                                link.id === 'blog' ? (
                                    <a
                                        key={link.name}
                                        href="/blog"
                                        className="relative text-sm uppercase tracking-widest font-sans font-light bg-transparent border-none cursor-pointer text-white after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-stone-500 after:transition-all after:duration-300 hover:after:w-full"
                                    >
                                        {link.name}
                                    </a>
                                ) : link.id === 'contact' ? (
                                    <a
                                        key={link.name}
                                        href="/contacto"
                                        className="relative text-sm uppercase tracking-widest font-sans font-light bg-transparent border-none cursor-pointer text-white after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-stone-500 after:transition-all after:duration-300 hover:after:w-full"
                                    >
                                        {link.name}
                                    </a>
                                ) : link.id === 'home' ? (
                                    <a
                                        key={link.name}
                                        href={location.pathname !== '/' ? '/' : `#${link.id}`}
                                        onClick={(e) => {
                                            if (location.pathname === '/') {
                                                e.preventDefault();
                                                handleScroll(link.id);
                                            }
                                        }}
                                        className="relative text-sm uppercase tracking-widest font-sans font-light bg-transparent border-none cursor-pointer text-white after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-stone-500 after:transition-all after:duration-300 hover:after:w-full"
                                    >
                                        {link.name}
                                    </a>
                                ) : (
                                    <a
                                        key={link.name}
                                        href={location.pathname !== '/' ? `/?section=${link.id}` : `#${link.id}`}
                                        onClick={(e) => {
                                            if (location.pathname === '/') {
                                                e.preventDefault();
                                                handleScroll(link.id);
                                            }
                                        }}
                                        className="relative text-sm uppercase tracking-widest font-sans font-light bg-transparent border-none cursor-pointer text-white after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-stone-500 after:transition-all after:duration-300 hover:after:w-full"
                                    >
                                        {link.name}
                                    </a>
                                )
                            ))}
                            <Link to="/admin" className="ml-4 opacity-50 hover:opacity-100 transition-opacity">
                                <Lock size={16} />
                            </Link>
                        </div>

                        <button className="md:hidden relative z-50 text-white" onClick={toggleMenu}>
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && !showFullName && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed inset-0 bg-stone-900 text-stone-50 flex flex-col justify-center items-center gap-8 z-40 md:hidden"
                    >
                        {links.map((link) => (
                            link.id === 'blog' ? (
                                <a
                                    key={link.name}
                                    href="/blog"
                                    className="text-4xl font-serif italic hover:text-terracotta transition-colors bg-transparent border-none cursor-pointer"
                                >
                                    {link.name}
                                </a>
                            ) : link.id === 'contact' ? (
                                <a
                                    key={link.name}
                                    href="/contacto"
                                    className="text-4xl font-serif italic hover:text-terracotta transition-colors bg-transparent border-none cursor-pointer"
                                >
                                    {link.name}
                                </a>
                            ) : link.id === 'home' ? (
                                <a
                                    key={link.name}
                                    href={location.pathname !== '/' ? '/' : `#${link.id}`}
                                    onClick={(e) => {
                                        if (location.pathname === '/') {
                                            e.preventDefault();
                                            setIsOpen(false);
                                            handleScroll(link.id);
                                        }
                                    }}
                                    className="text-4xl font-serif italic hover:text-terracotta transition-colors bg-transparent border-none cursor-pointer"
                                >
                                    {link.name}
                                </a>
                            ) : (
                                <a
                                    key={link.name}
                                    href={location.pathname !== '/' ? `/?section=${link.id}` : `#${link.id}`}
                                    onClick={(e) => {
                                        if (location.pathname === '/') {
                                            e.preventDefault();
                                            setIsOpen(false);
                                            handleScroll(link.id);
                                        }
                                    }}
                                    className="text-4xl font-serif italic hover:text-terracotta transition-colors bg-transparent border-none cursor-pointer"
                                >
                                    {link.name}
                                </a>
                            )
                        ))}
                        <Link to="/admin" onClick={() => setIsOpen(false)} className="mt-8 text-sm uppercase opacity-50">
                            Área Admin
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export const StandaloneNavigation = () => {
    return (
        <BrowserRouter>
            <Navigation />
        </BrowserRouter>
    );
};

export default Navigation;