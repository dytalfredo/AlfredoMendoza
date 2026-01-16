import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import './styles/global.css';
import * as ReactRouterDOM from 'react-router-dom';
const RouterNamespace = (ReactRouterDOM as any).default ?? ReactRouterDOM;
const { BrowserRouter, Routes, Route, Link: RouterLink, useParams, useLocation } = RouterNamespace;
import { motion, useScroll, useTransform, Variants, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShoppingBag, MessageSquare, Ticket, ArrowUpRight, Database, Smartphone, Layers, CheckCircle2, ArrowLeft, MoveRight, Map as MapIcon, Bot, Share2, Twitter, Linkedin, Link } from 'lucide-react';
import Navigation from './components/Navigation';
import Chatbot from './components/Chatbot';
import AdminPanel from './components/AdminPanel';
import FloatingActions from './components/FloatingActions';
import ContactModal from './components/ContactModal';
import ContactFormPage from './components/ContactFormPage';
import Footer from './components/Footer';


// Import Data
import contentData from './data/content.json';
import { imageCache, extractImageUrls } from './utils/imageCache';

import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

// Register GSAP Plugin
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// --- DATA: Centralized Project Data ---
const projectsData = contentData.projects;


// --- UTILS: Scroll To Top ---
const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};

// --- Sub-components for the Landing Page ---

// 1. Hero Section (Parallax Text + Text Swapping)
const Hero = () => {
    const { scrollY } = useScroll();
    const { hero } = contentData;
    // Enhanced parallax
    const y1 = useTransform(scrollY, [0, 1000], [0, 600]);
    const y2 = useTransform(scrollY, [0, 1000], [0, -400]);

    // State to cycle through slides defined in content.json
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlideIndex((prev) => (prev + 1) % hero.slides.length);
        }, 4000); // Swap every 4 seconds
        return () => clearInterval(interval);
    }, [hero.slides.length]);

    // Safety check
    if (!hero.slides || hero.slides.length === 0) return null;

    // Current slide data
    const currentSlide = hero.slides[currentSlideIndex] || hero.slides[0];

    const bgTextVariants: Variants = {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1, transition: { duration: 1.5, ease: "easeOut" } },
        exit: { opacity: 0, scale: 1.1, transition: { duration: 0.8 } }
    };

    const fgTextVariants: Variants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.5 } }
    };

    return (
        <section id="home" className="h-screen w-full flex flex-col justify-center items-center relative overflow-hidden bg-stone-50">

            {/* Top Background Text */}
            <motion.div
                style={{ y: y1 }}
                className="absolute top-20 md:top-0 z-0 opacity-10 font-serif text-[18vw] md:text-[18rem] leading-none whitespace-nowrap text-terracotta select-none w-full text-center"
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide.bgTextTop}
                        variants={bgTextVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    >
                        {currentSlide.bgTextTop}
                    </motion.div>
                </AnimatePresence>
            </motion.div>

            {/* Foreground Content */}
            <div className="z-10 text-center px-4 mix-blend-multiply relative h-[300px] flex flex-col justify-center">
                <AnimatePresence mode="wait">
                    <motion.h1
                        key={currentSlide.fgLine1} // Triggers animation on change
                        variants={fgTextVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="text-5xl sm:text-6xl md:text-9xl font-serif font-bold tracking-tight text-stone-900 leading-none"
                    >
                        {currentSlide.fgLine1} <br />
                        <span className="italic font-light text-terracotta">{currentSlide.fgLine2}</span>
                    </motion.h1>
                </AnimatePresence>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 text-base sm:text-lg md:text-xl font-sans font-light max-w-xs sm:max-w-lg mx-auto text-stone-600"
                >
                    {hero.description.split('\n').map((line, i) => (
                        <React.Fragment key={i}>
                            {line} {i === 0 && <br className="hidden md:block" />}
                        </React.Fragment>
                    ))}
                </motion.p>
            </div>

            {/* Bottom Background Text */}
            <motion.div
                style={{ y: y2 }}
                className="absolute bottom-32 md:bottom-0 z-0 opacity-5 font-serif text-[18vw] md:text-[18rem] leading-none whitespace-nowrap text-stone-900 select-none w-full text-center"
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide.bgTextBottom}
                        variants={bgTextVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ delay: 0.2 }} // Slight delay for the bottom text
                    >
                        {currentSlide.bgTextBottom}
                    </motion.div>
                </AnimatePresence>
            </motion.div>
        </section>
    );
};

// 2. Philosophy Section: Fixed Center Slideshow
// Items appear and disappear in the EXACT SAME SPOT. No vertical movement.
// 2. About Section: Who Am I
const About = () => {
    const { about } = contentData;

    return (
        <section id="about" className="min-h-screen w-full bg-stone-900 text-stone-100 flex items-center justify-center py-20 px-6 md:px-20 overflow-hidden">
            <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">

                {/* Image Side with Tech Stack Orbit */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    animate={{ y: [0, -10, 0] }} // Breathing animation
                    transition={{
                        duration: 0.8, // Entrance duration
                        y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 } // Floating duration
                    }}
                    viewport={{ once: true }}
                    className="relative w-full aspect-[3/4] md:aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl group"
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent opacity-60 z-10"></div>
                    <img src={about.image} alt="Retrato profesional de Alfredo Mendoza, Arquitecto Digital" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />

                    {/* Tech Stack Floating Tags - Vertical Right Stack */}
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-end gap-3 z-20">
                        {about.techStack && about.techStack.map((tech: string, i: number) => (
                            <motion.span
                                key={i}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + (i * 0.1) }}
                                viewport={{ once: true }}
                                className="px-3 py-1 text-[10px] md:text-xs font-mono font-bold uppercase tracking-wider bg-black/70 backdrop-blur-md border border-white/10 rounded-full text-terracotta shadow-lg hover:bg-terracotta hover:text-black transition-colors cursor-default"
                            >
                                {tech}
                            </motion.span>
                        ))}
                    </div>

                    {/* Principles Overlay - Glass/Gradient Card */}
                    {about.principles && (
                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent z-30 flex flex-col gap-4">
                            {about.principles.map((principle: any, idx: number) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.8 + (idx * 0.1) }}
                                    viewport={{ once: true }}
                                    className="border-l-2 border-terracotta pl-3"
                                >
                                    <h4 className="text-white font-serif text-lg italic leading-tight mb-1">{principle.title}</h4>
                                    <p className="text-stone-400 text-[10px] leading-tight max-w-[90%]">{principle.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Content Side */}
                <div className="flex flex-col justify-center space-y-8">
                    <motion.span
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        viewport={{ once: true }}
                        className="text-terracotta text-sm font-bold uppercase tracking-[0.3em]"
                    >
                        {about.title}
                    </motion.span>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-serif font-bold leading-tight"
                    >
                        {about.headline}
                    </motion.h2>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        viewport={{ once: true }}
                        className="text-stone-400 text-lg md:text-xl font-light leading-relaxed whitespace-pre-line"
                    >
                        {about.description}
                    </motion.div>

                    {/* Stats Grid */}
                    {about.stats && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            viewport={{ once: true }}
                            className="grid grid-cols-3 gap-6 pt-8 border-t border-stone-800"
                        >
                            {about.stats.map((stat, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 15 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 + (idx * 0.1) }}
                                    viewport={{ once: true }}
                                >
                                    <span className="block text-2xl md:text-4xl font-serif font-bold text-terracotta mb-1">{stat.value}</span>
                                    <span className="block text-xs uppercase tracking-widest text-stone-500">{stat.label}</span>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}


                </div>
            </div>
        </section>
    );
};

// 2.5 Industries Section (One by One Reveal with Value Props)
const Industries = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const { items, title } = contentData.industries;

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    pin: true,
                    start: "top top",
                    end: `+=${items.length * 1000}`, // Increased scroll distance for breathing room
                    scrub: 0.5,
                    // FORCE STANDARD HEADER ON ENTER and ENTER BACK
                    onEnter: () => window.dispatchEvent(new CustomEvent('toggle-header-name', { detail: false })),
                    onEnterBack: () => window.dispatchEvent(new CustomEvent('toggle-header-name', { detail: false })),
                }
            });

            items.forEach((item, i) => {
                const isLast = i === items.length - 1;

                // 1. Enter Name
                tl.fromTo(`.industry-title-${i}`,
                    { y: 50, opacity: 0, filter: "blur(10px)" },
                    { y: 0, opacity: 1, filter: "blur(0px)", duration: 1, ease: "power3.out" }
                )
                    // Update Counter
                    .to(`.industry-count`, { innerText: i + 1, snap: { innerText: 1 } }, "<");

                // 2. Enter Examples (Staggered Sequence after Name)
                tl.fromTo(`.industry-ex-${i}`,
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "back.out(1.7)" },
                    "-=0.5"
                );

                // 3. Hold phase (Allow user to read)
                tl.to({}, { duration: 2.5 });

                // 4. Exit Text (if not last)
                if (!isLast) {
                    tl.to(`.industry-title-${i}`,
                        { y: -50, opacity: 0, filter: "blur(5px)", duration: 0.8, ease: "power3.in" }
                    )
                        .to(`.industry-ex-${i}`,
                            { y: -20, opacity: 0, duration: 0.4, stagger: 0.05, ease: "power3.in" },
                            "<"
                        );
                }
            });

        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section id="industries" ref={sectionRef} className="h-screen w-full relative overflow-hidden text-stone-50 flex flex-col items-center justify-center bg-stone-900">
            {/* Background Texture/Noise */}
            <div className="absolute inset-0 z-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

            <div className="z-10 relative text-center w-full px-4 h-screen flex flex-col items-center justify-center">
                <p className="absolute top-20 text-xs md:text-base font-sans uppercase tracking-[0.5em] mb-10 opacity-70">
                    {title}
                </p>

                {/* Container for elements to overlap perfectly */}
                <div className="relative w-full max-w-6xl h-[50vh] flex flex-col items-center justify-center">
                    {items.map((item, i) => (
                        <div key={i} className="absolute inset-0 flex flex-col items-center justify-center">
                            <h2
                                className={`industry-title-${i} text-4xl sm:text-5xl md:text-8xl lg:text-9xl font-serif font-bold italic leading-none whitespace-nowrap opacity-0 mb-12`}
                            >
                                {item.label}
                            </h2>

                            {/* Animated Examples List */}
                            <div className="flex flex-wrap justify-center gap-4 max-w-4xl">
                                {item.examples && item.examples.map((ex: string, idx: number) => (
                                    <div
                                        key={idx}
                                        className={`industry-ex-${i} opacity-0 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 text-sm md:text-base font-medium text-stone-200 shadow-xl flex items-center gap-3`}
                                    >
                                        <div className="w-2 h-2 rounded-full bg-terracotta shadow-[0_0_10px_rgba(255,100,0,0.5)]"></div>
                                        {ex}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Counter */}
            <div className="absolute bottom-10 left-10 z-10 font-mono text-xl md:text-2xl opacity-50">
                <span className="industry-count">1</span> <span className="text-sm">/ {items.length}</span>
            </div>
        </section>
    );
};

// 3. Call to Action Section
const CallToAction = () => {
    return (
        <section id="cta" className="relative h-screen bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 overflow-hidden flex items-center justify-center">
            {/* Noise Overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0"></div>

            {/* Background Animated Circles */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.03, 0.05, 0.03]
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute w-[500px] h-[500px] rounded-full bg-terracotta blur-3xl"
                style={{ top: '10%', left: '15%' }}
            />
            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.03, 0.06, 0.03]
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                }}
                className="absolute w-[600px] h-[600px] rounded-full bg-white blur-3xl"
                style={{ bottom: '10%', right: '10%' }}
            />

            {/* Content */}
            <div className="relative z-10 text-center px-6 max-w-5xl">
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-terracotta text-sm md:text-base font-bold uppercase tracking-[0.3em] mb-8"
                >
                    Es momento de actuar
                </motion.p>

                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white leading-tight mb-12"
                >
                    ¿Alguna de estas industrias <br className="hidden md:block" />
                    te <span className="text-terracotta italic">resuenan?</span>
                </motion.h2>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    <a
                        href="/contacto"
                        className="group relative inline-flex items-center justify-center gap-4 px-12 py-6 bg-white text-stone-900 rounded-full font-sans font-bold text-lg md:text-2xl uppercase tracking-widest shadow-2xl hover:shadow-terracotta/20 transition-all duration-500 overflow-hidden"
                    >
                        {/* Background Animation */}
                        <motion.div
                            className="absolute inset-0 bg-terracotta"
                            initial={{ x: '-100%' }}
                            whileHover={{ x: 0 }}
                            transition={{ duration: 0.4 }}
                        />

                        <span className="relative z-10 group-hover:text-white transition-colors duration-400">
                            Charlemos
                        </span>

                        <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            className="relative z-10"
                        >
                            <ArrowUpRight className="w-6 h-6 md:w-8 md:h-8 group-hover:text-white transition-colors" />
                        </motion.div>
                    </a>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="mt-10 text-sm md:text-base text-stone-400 font-light"
                >
                    Ningún compromiso. Solo una conversación honesta sobre cómo multiplicar tu negocio.
                </motion.p>
            </div>
        </section>
    );
};

// 3.1 Digital Sovereignty Section
const DigitalSovereignty = () => {
    return (
        <section className="relative bg-stone-50 py-24 md:py-32 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-terracotta via-transparent to-transparent"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-20">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16 md:mb-20"
                >
                    <p className="text-terracotta text-xs md:text-sm font-bold uppercase tracking-[0.3em] mb-4">
                        Ventaja Local
                    </p>
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-stone-900 leading-tight mb-6">
                        Soberanía <span className="text-terracotta italic">Digital</span>
                    </h2>
                    <p className="text-lg md:text-xl text-stone-600 max-w-3xl mx-auto font-light">
                        Tecnología de clase mundial sin la complejidad cambiaria.
                    </p>
                </motion.div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
                    {/* Left: The Problem */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="bg-gradient-to-br from-stone-900 to-stone-800 text-white p-8 md:p-10 rounded-2xl border border-white/10 relative overflow-hidden">
                            {/* Decorative element */}
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-terracotta/10 rounded-full blur-3xl"></div>

                            <div className="relative z-10">
                                <h3 className="text-2xl md:text-3xl font-serif font-bold mb-6 flex items-center gap-3">
                                    <span className="inline-block w-3 h-3 rounded-full bg-red-500 shadow-lg shadow-red-500/50"></span>
                                    La Realidad Cambiaria
                                </h3>
                                <div className="space-y-4 text-stone-300 leading-relaxed">
                                    <p>
                                        <strong className="text-white">El problema:</strong> Pagar en dólares por servicios digitales importados implica:
                                    </p>
                                    <ul className="space-y-3 ml-4">
                                        <li className="flex items-start gap-3">
                                            <span className="inline-block w-2 h-2 rounded-full bg-terracotta mt-2 shadow-md shadow-terracotta/50"></span>
                                            <span>Volatilidad cambiaria que dispara costos de un día para otro</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="inline-block w-2 h-2 rounded-full bg-terracotta mt-2 shadow-md shadow-terracotta/50"></span>
                                            <span>Inflación galopante que devalúa tu inversión en tiempo real</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="inline-block w-2 h-2 rounded-full bg-terracotta mt-2 shadow-md shadow-terracotta/50"></span>
                                            <span>Comisiones bancarias múltiples y tipos de cambio desfavorables</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="inline-block w-2 h-2 rounded-full bg-terracotta mt-2 shadow-md shadow-terracotta/50"></span>
                                            <span>Dependencia de plataformas extranjeras con soporte en inglés</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: The Solution */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="bg-white p-8 md:p-10 rounded-2xl border-2 border-terracotta/20 shadow-xl relative overflow-hidden">
                            {/* Decorative element */}
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-terracotta/5 rounded-full blur-3xl"></div>

                            <div className="relative z-10">
                                <h3 className="text-2xl md:text-3xl font-serif font-bold mb-6 flex items-center gap-3 text-stone-900">
                                    <span className="inline-block w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/50"></span>
                                    La Ventaja Local
                                </h3>
                                <div className="space-y-4 text-stone-700 leading-relaxed">
                                    <p>
                                        <strong className="text-stone-900">Mi propuesta:</strong> Trabajo en bolívares, con empresas venezolanas que entienden el mercado local:
                                    </p>
                                    <ul className="space-y-3 ml-4">
                                        <li className="flex items-start gap-3">
                                            <span className="inline-block w-2.5 h-2.5 rounded-full bg-terracotta mt-2 shadow-lg shadow-terracotta/60 animate-pulse"></span>
                                            <span><strong>Sin riesgo cambiario.</strong> Presupuestos y pagos en moneda local estables</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="inline-block w-2.5 h-2.5 rounded-full bg-terracotta mt-2 shadow-lg shadow-terracotta/60 animate-pulse"></span>
                                            <span><strong>Zona horaria Venezuela.</strong> Reuniones en horario laboral, sin desajustes</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="inline-block w-2.5 h-2.5 rounded-full bg-terracotta mt-2 shadow-lg shadow-terracotta/60 animate-pulse"></span>
                                            <span><strong>Soporte en español.</strong> Comunicación directa sin intermediarios</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="inline-block w-2.5 h-2.5 rounded-full bg-terracotta mt-2 shadow-lg shadow-terracotta/60 animate-pulse"></span>
                                            <span><strong>Entiendo tu realidad.</strong> Conozco las restricciones, oportunidades y necesidades del mercado venezolano</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="inline-block w-2.5 h-2.5 rounded-full bg-terracotta mt-2 shadow-lg shadow-terracotta/60 animate-pulse"></span>
                                            <span><strong>Tecnología internacional.</strong> Calidad global a precios justos para el contexto local</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="mt-16 text-center"
                >
                    <div className="inline-block bg-stone-100 px-8 py-6 rounded-xl border border-stone-200">
                        <p className="text-stone-900 text-lg md:text-xl font-serif mb-2">
                            <span className="font-bold">Tu inversión protegida.</span> Tu proyecto escalable.
                        </p>
                        <p className="text-stone-600 text-sm md:text-base">
                            Desarrollo de clase mundial sin expatriar capital.
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

// 3.5 Ready-to-Use Products (Updated Layout & Navigation)
const Products = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<ScrollTrigger | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const { products: productsInfo } = contentData;

    // Helper to map icon names to components
    const getIcon = (iconName: string) => {
        switch (iconName) {
            case 'Database': return <Database className="text-white w-8 h-8 md:w-12 md:h-12" />;
            case 'Smartphone': return <Smartphone className="text-white w-8 h-8 md:w-12 md:h-12" />;
            case 'Layers': return <Layers className="text-white w-8 h-8 md:w-12 md:h-12" />;
            default: return <Database className="text-white w-8 h-8 md:w-12 md:h-12" />;
        }
    };

    const products = productsInfo.items.map(p => ({
        ...p,
        icon: getIcon(p.icon)
    }));

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "+=4000",
                    scrub: 0.8,
                    pin: true,
                    anticipatePin: 1,
                    onUpdate: (self) => {
                        // Sync Active State
                        const idx = Math.min(Math.round(self.progress * (products.length - 1)), products.length - 1);
                        setActiveIndex(idx);
                    }
                }
            });

            // Store trigger instance for click-to-scroll logic
            triggerRef.current = tl.scrollTrigger;

            // Iterate through products to create stacking effect
            products.forEach((_, i) => {
                if (i === 0) return; // First card is already visible

                // 1. Previous card gets pushed back and darkens
                tl.to(`.prod-card-${i - 1}`, {
                    scale: 0.85,
                    opacity: 0.4,
                    filter: "blur(5px)",
                    y: -50,
                    duration: 1,
                    ease: "power2.inOut"
                }, `slide${i}`);

                // 2. Current card slides up from bottom
                tl.fromTo(`.prod-card-${i}`,
                    { yPercent: 110, scale: 0.9, opacity: 1 },
                    { yPercent: 0, scale: 1, opacity: 1, duration: 1, ease: "power2.out" },
                    `slide${i}`);
            });

        }, sectionRef);
        return () => ctx.revert();
    }, [products.length]);

    const handleNavClick = (index: number) => {
        if (!sectionRef.current) return;

        // Calculate the scroll position based on the pinned section's timeline
        const st = triggerRef.current;
        if (st) {
            const start = st.start;
            const end = st.end;
            const totalDistance = end - start;
            // Approximate target position
            const target = start + (index / (products.length - 1)) * totalDistance;

            window.scrollTo({
                top: target,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section id="products" ref={sectionRef} className="min-h-screen w-full relative overflow-hidden flex flex-col md:grid md:grid-cols-12 bg-stone-900 text-white py-4 md:py-0 md:pb-64">
            {/* Dynamic Background Layer */}
            <div className="prod-bg-layer absolute inset-0 bg-stone-900"></div>

            {/* Noise Overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0"></div>

            {/* --- LEFT COLUMN: Info & Navigation --- */}
            <div className="col-span-1 md:col-span-5 flex flex-col justify-between p-4 md:p-12 md:pl-20 pt-16 md:pt-12 order-1 md:order-1 relative h-auto md:h-full z-20">
                {/* Title & Description Area */}
                <div className="mt-0 md:mt-20">
                    <div className="flex items-center gap-2 mb-2 md:mb-4">
                        <div className="w-2 h-2 rounded-full bg-terracotta animate-pulse"></div>
                        <span className="text-[10px] md:text-xs font-mono uppercase tracking-[0.2em] opacity-70">{productsInfo.eyebrow}</span>
                    </div>
                    <h2 className="text-2xl sm:text-4xl md:text-6xl font-serif font-bold leading-none mb-2 md:mb-6">
                        {productsInfo.title} <br className="hidden md:block" /> <span className="text-terracotta italic">{productsInfo.italicTitle}</span>
                    </h2>

                    <div className="space-y-2 md:space-y-4 max-w-md hidden md:block">
                        <p className="text-sm sm:text-base md:text-lg font-light text-stone-300 leading-relaxed border-l-2 border-terracotta pl-4 line-clamp-2 md:line-clamp-none">
                            {productsInfo.description}
                        </p>
                        <p className="hidden sm:block text-xs md:text-sm text-stone-400">
                            {productsInfo.subDescription}
                        </p>
                    </div>
                </div>

                {/* Desktop Vertical Navigation */}
                <div className="hidden md:flex flex-col gap-2 mt-auto">
                    {products.map((p, i) => (
                        <button
                            key={p.id}
                            onClick={() => handleNavClick(i)}
                            className={`text-left py-4 px-6 rounded-lg transition-all duration-300 flex items-center justify-between group ${activeIndex === i
                                ? 'bg-white/10 border-l-4 border-terracotta translate-x-2'
                                : 'hover:bg-white/5 border-l-4 border-transparent opacity-50 hover:opacity-100'
                                }`}
                        >
                            <div>
                                <span className="text-xs uppercase tracking-widest block mb-1 opacity-70">{p.subtitle}</span>
                                <span className="text-xl font-serif font-bold">{p.title}</span>
                            </div>
                            {activeIndex === i && <ArrowUpRight size={20} className="text-terracotta" />}
                        </button>
                    ))}
                </div>
            </div>

            {/* --- MOBILE NAV (Middle Strip) --- */}
            <div className="col-span-1 md:hidden order-2 py-2 flex items-center px-4 overflow-x-auto no-scrollbar border-b border-white/10 bg-stone-900/50 backdrop-blur-sm z-30 sticky top-16 mb-4">
                <div className="flex gap-4 min-w-full">
                    {products.map((p, i) => (
                        <button
                            key={p.id}
                            onClick={() => handleNavClick(i)}
                            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap border ${activeIndex === i
                                ? 'bg-white text-stone-900 border-white'
                                : 'bg-transparent text-stone-400 border-stone-700'
                                }`}
                        >
                            {p.title}
                        </button>
                    ))}
                </div>
            </div>

            {/* --- RIGHT COLUMN: Card Stack --- */}
            <div className="col-span-1 md:col-span-7 relative flex items-start md:items-center justify-center px-4 order-3 md:order-2 h-[55vh] md:h-full overflow-visible">
                <div ref={contentRef} className="relative w-full max-w-sm md:max-w-xl h-full md:h-auto flex items-center justify-center">
                    {products.map((p, i) => (
                        <div
                            key={p.id}
                            className={`prod-card-${i} absolute w-full h-full md:h-auto md:aspect-[16/12] bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl md:rounded-3xl p-5 md:p-12 flex flex-col justify-between shadow-2xl origin-bottom`}
                            style={{
                                y: i === 0 ? 0 : '100%',
                                zIndex: 10 + i
                            }}
                        >
                            {/* Card Header */}
                            <div className="flex justify-between items-start mb-2 md:mb-0">
                                <div className="p-2 md:p-3 bg-white/10 rounded-xl ring-1 ring-white/20 scale-75 md:scale-100 origin-top-left">
                                    {p.icon}
                                </div>
                                <span className="font-mono text-xl md:text-6xl font-bold opacity-10 select-none">0{i + 1}</span>
                            </div>

                            {/* Card Body */}
                            <div>
                                <h3 className="text-xl md:text-5xl font-serif font-bold mb-1 md:mb-4">{p.title}</h3>
                                <p className={`text-xs md:text-lg font-light leading-relaxed mb-3 md:mb-6 ${p.textColor} line-clamp-3 md:line-clamp-none`}>
                                    {p.desc}
                                </p>

                                {/* Features List */}
                                <ul className="space-y-1 md:space-y-2 mb-3 md:mb-6">
                                    {p.features.map((feat, idx) => (
                                        <li key={idx} className="flex items-center gap-2 text-[10px] md:text-sm text-stone-400">
                                            <CheckCircle2 size={12} className="text-terracotta shrink-0" />
                                            <span className="truncate">{feat}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Card Footer */}
                            <div className="pt-3 md:pt-4 border-t border-white/10">
                                <a
                                    href={`https://wa.me/584126305645?text=${encodeURIComponent(`Hola, quisiera solicitar una Demo Live de: ${p.title}`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex justify-between items-center group cursor-pointer hover:bg-white/10 p-2 rounded transition-colors"
                                >
                                    <span className="uppercase text-[10px] md:text-xs tracking-widest font-bold">{productsInfo.ctaLabel}</span>
                                    <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// 4. Work Section (Animated List with Links)
const Work = () => {
    return (
        <section id="work" className="py-24 md:py-40 px-6 md:px-20 bg-stone-50">
            <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-5xl md:text-8xl font-serif font-bold text-stone-900 mb-20 text-center"
            >
                Mis Proyectos
            </motion.h2>

            <div className="flex flex-col gap-16 md:gap-32">
                {projectsData.map((p, i) => (
                    <motion.div
                        key={p.id}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-10%" }}
                        variants={{
                            hidden: { opacity: 0, y: 100 },
                            visible: {
                                opacity: 1,
                                y: 0,
                                transition: { duration: 0.8, ease: "easeOut" }
                            }
                        }}
                        className={`flex flex-col md:flex-row gap-6 md:gap-10 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
                    >
                        {/* Image Container with Reveal Effect */}
                        <div className="w-full md:w-3/5 overflow-hidden group rounded-xl relative cursor-pointer">
                            <RouterLink to={`/work/${p.id}`}>
                                <div className="absolute inset-0 bg-stone-900/20 group-hover:bg-transparent transition-colors z-10 duration-500"></div>
                                <motion.img
                                    src={p.img}
                                    alt={p.title}
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.7 }}
                                    className="w-full h-[40vh] md:h-[60vh] object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out"
                                />
                                <div className="absolute bottom-6 left-6 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center gap-2 text-white bg-black/50 backdrop-blur-md px-4 py-2 rounded-full">
                                    <span className="text-xs uppercase tracking-wider">Explorar Caso</span>
                                    <ArrowUpRight size={14} />
                                </div>
                            </RouterLink>
                        </div>

                        {/* Text Container with Staggered Reveal */}
                        <div className="w-full md:w-2/5 flex flex-col justify-center">
                            <motion.span
                                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delay: 0.2 } } }}
                                className="text-terracotta font-sans text-xs md:text-sm mb-1 block uppercase tracking-widest"
                            >
                                0{i + 1} — {p.category}
                            </motion.span>

                            {p.technicalName && (
                                <motion.h4
                                    variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delay: 0.25 } } }}
                                    className="text-stone-400 font-serif italic text-lg md:text-2xl mb-2"
                                >
                                    {p.technicalName}
                                </motion.h4>
                            )}

                            <motion.h3
                                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: 0.3 } } }}
                                className="text-4xl md:text-6xl font-serif font-bold mb-4 md:mb-6"
                            >
                                {p.title}
                            </motion.h3>

                            <motion.p
                                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delay: 0.4 } } }}
                                className="text-stone-600 font-light text-sm md:text-base max-w-xs mb-6 md:mb-8"
                            >
                                {p.shortDesc}
                            </motion.p>

                            <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delay: 0.5 } } }}>
                                <RouterLink to={`/work/${p.id}`} className="inline-flex items-center gap-2 group text-stone-900 font-bold border-b border-stone-900 pb-1 hover:text-terracotta hover:border-terracotta transition-colors uppercase tracking-widest text-xs">
                                    Leer Historia
                                    <MoveRight className="group-hover:translate-x-2 transition-transform" size={16} />
                                </RouterLink>
                            </motion.div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}

// 4.5 NEW COMPONENT:// 4. Case Study Page (Dynamic)
const CaseStudy = ({ onOpenContact }: { onOpenContact: () => void }) => {
    const { id } = useParams();
    const project = projectsData.find(p => p.id === id);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

    // Consolidated images for lightbox navigation
    const allImages = project ? [
        // Add devices if they exist
        ...(project.devices?.desktop ? [{ src: project.devices.desktop, title: 'Desktop View' }] : []),
        ...(project.devices?.tablet ? [{ src: project.devices.tablet, title: 'Tablet View' }] : []),
        ...(project.devices?.mobile ? [{ src: project.devices.mobile, title: 'Mobile View' }] : []),
        // Add gallery items 
        ...project.gallery.map(item => typeof item === 'string' ? { src: item, title: '' } : item)
    ] : [];

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedImageIndex !== null) {
            setSelectedImageIndex((selectedImageIndex + 1) % allImages.length);
        }
    };

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedImageIndex !== null) {
            setSelectedImageIndex((selectedImageIndex - 1 + allImages.length) % allImages.length);
        }
    };

    // Update meta tags for OpenGraph when project loads
    useEffect(() => {
        if (project && project.og) {
            // Update title
            document.title = `${project.og.title} | Alfredo Mendoza`;

            // Helper function to set or update meta tag
            const setMetaTag = (property: string, content: string, isName = false) => {
                const attr = isName ? 'name' : 'property';
                let meta = document.querySelector(`meta[${attr}="${property}"]`);
                if (!meta) {
                    meta = document.createElement('meta');
                    meta.setAttribute(attr, property);
                    document.head.appendChild(meta);
                }
                meta.setAttribute('content', content);
            };

            // OpenGraph tags
            setMetaTag('og:title', project.og.title);
            setMetaTag('og:description', project.og.description);
            setMetaTag('og:image', window.location.origin + project.og.image);
            setMetaTag('og:type', project.og.type);
            setMetaTag('og:url', window.location.href);

            // Twitter Card tags
            setMetaTag('twitter:card', 'summary_large_image', true);
            setMetaTag('twitter:title', project.og.title, true);
            setMetaTag('twitter:description', project.og.description, true);
            setMetaTag('twitter:image', window.location.origin + project.og.image, true);

            // Standard meta description
            setMetaTag('description', project.og.description, true);
        }

        // Cleanup function to reset to default meta tags
        return () => {
            document.title = 'Alfredo Mendoza | Arquitecto Digital & Desarrollador Full Stack';
        };
    }, [project]);

    if (!project) return <div className="h-screen flex items-center justify-center text-4xl font-serif">Proyecto no encontrado.</div>;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-stone-50 min-h-screen text-stone-900"
        >
            {/* Nav Back */}
            <div className="absolute top-24 left-6 md:left-10 z-40 mix-blend-difference text-white">
                <RouterLink to="/" state={{ scrollTo: 'work' }} className="flex items-center gap-2 hover:opacity-70 transition-opacity">
                    <ArrowLeft size={20} />
                    <span className="uppercase text-xs tracking-widest hidden md:inline">Volver</span>
                </RouterLink>
            </div>

            {/* Hero Header */}
            <header className="h-[70vh] md:min-h-screen flex flex-col justify-end md:justify-center px-6 md:px-20 pb-20 md:pt-40 border-b border-stone-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 md:p-20 opacity-10">
                    <span className="text-[8rem] md:text-[15rem] font-serif leading-none">{project.year.slice(2)}</span>
                </div>

                <motion.span
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-terracotta uppercase tracking-[0.3em] text-xs md:text-sm mb-4"
                >
                    Caso de Estudio
                </motion.span>

                <motion.h1
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-5xl md:text-9xl font-serif font-bold mb-6"
                >
                    {project.title}
                </motion.h1>

                {project.liveUrl && (
                    <motion.a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="block text-xl md:text-2xl font-serif italic text-stone-400 mb-6 hover:text-terracotta transition-colors underline decoration-stone-300 underline-offset-4"
                    >
                        {project.liveUrl}
                    </motion.a>
                )}

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-lg md:text-2xl font-light text-stone-600 max-w-2xl"
                >
                    {project.shortDesc}
                </motion.p>
            </header>

            {/* Case Details */}
            <div className="px-6 md:px-20 py-20 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-20">
                {/* Story: Conflict, Strategy, Result */}
                <div className="col-span-1 md:col-span-8 space-y-16">
                    <div>
                        <h3 className="text-xl font-serif font-bold mb-4 text-stone-400">El Conflicto</h3>
                        <p className="text-xl md:text-3xl font-light leading-relaxed">{project.story.conflict}</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-serif font-bold mb-4 text-stone-400">La Estrategia</h3>
                        <p className="text-xl md:text-3xl font-light leading-relaxed mb-12">
                            {project.story.strategy.split('\n').map((paragraph, index) => (
                                <span key={index} className="block mb-6 last:mb-0">
                                    {paragraph}
                                </span>
                            ))}
                        </p>

                        {/* Key Features Cards */}
                        {project.keyFeatures && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                                {project.keyFeatures.map((feature, idx) => {
                                    // Icon mapping
                                    const IconComponent =
                                        feature.icon === 'Database' ? Database :
                                            feature.icon === 'Map' ? MapIcon :
                                                feature.icon === 'MessageSquare' ? MessageSquare :
                                                    feature.icon === 'Bot' ? Bot :
                                                        Layers; // Default

                                    return (
                                        <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 hover:shadow-md transition-all group">
                                            <div className="w-12 h-12 bg-terracotta/10 text-terracotta rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                                <IconComponent size={24} />
                                            </div>
                                            <h4 className="font-bold text-stone-800 mb-2 text-lg">{feature.title}</h4>
                                            <p className="text-sm text-stone-600 leading-relaxed font-sans">{feature.desc}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                    <div>
                        <h3 className="text-xl font-serif font-bold mb-4 text-terracotta">El Resultado</h3>
                        <p className="text-xl md:text-3xl font-light leading-relaxed">{project.story.result}</p>
                    </div>
                </div>

                {/* Tech Stack */}
                <div className="col-span-1 md:col-span-4">
                    <div className="bg-stone-100 p-8 rounded-xl sticky top-24">
                        <h3 className="text-sm font-bold uppercase tracking-widest mb-6 border-b border-stone-200 pb-2">Tech Stack</h3>
                        <ul className="space-y-4 mb-10">
                            {project.story.tech.map((t, i) => (
                                <li key={i} className="flex items-center gap-2 font-mono text-sm text-stone-600">
                                    <div className="w-1.5 h-1.5 bg-terracotta rounded-full"></div>
                                    {t}
                                </li>
                            ))}
                        </ul>

                        {/* Desktop-only Social/Feedback (Hidden on mobile) */}
                        <div className="hidden md:block">
                            {/* Social Share */}
                            <div className="border-t border-stone-200 pt-6 mb-8">
                                <h3 className="text-xs font-bold uppercase tracking-widest mb-4 text-stone-400">Compartir</h3>
                                <div className="flex gap-4">
                                    <button className="w-10 h-10 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-all">
                                        <Linkedin size={18} />
                                    </button>
                                    <button className="w-10 h-10 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-all">
                                        <Twitter size={18} />
                                    </button>
                                    <button className="w-10 h-10 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-terracotta hover:text-white hover:border-terracotta transition-all" onClick={() => navigator.clipboard.writeText(window.location.href)}>
                                        <Link size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Feedback CTA */}
                            <div className="border-t border-stone-200 pt-6 mb-8">
                                <h3 className="text-xs font-bold uppercase tracking-widest mb-4 text-stone-400">Feedback</h3>
                                <button className="w-full py-3 border border-stone-300 rounded-lg text-sm font-bold text-stone-600 hover:border-stone-900 hover:text-stone-900 transition-colors flex items-center justify-center gap-2">
                                    <MessageSquare size={16} />
                                    Sugerir Mejora
                                </button>
                            </div>

                            {/* Recent Comments Preview */}
                            <div className="border-t border-stone-200 pt-6">
                                <div className="flex justify-between items-baseline mb-4">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400">Comentarios</h3>
                                    <span className="text-xs text-terracotta font-mono">12 Nuevos</span>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-stone-300 overflow-hidden flex-shrink-0">
                                            <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="User" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-stone-800">Sarah J.</p>
                                            <p className="text-xs text-stone-500 leading-tight">Brutal integración con WhatsApp. ¿Usaron la API oficial?</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-stone-300 overflow-hidden flex-shrink-0">
                                            <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-stone-800">DevMike</p>
                                            <p className="text-xs text-stone-500 leading-tight">El manejo de estado con Zustand quedó muy limpio.</p>
                                        </div>
                                    </div>
                                    <button className="text-xs text-terracotta hover:underline mt-2 font-mono block w-full text-left">
                                        Ver todos los comentarios &rarr;
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Device Previews (Responsive System) */}
            {project.devices && (
                <div className="px-6 md:px-20 py-20 bg-stone-100 mb-20">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-12">
                            <h3 className="text-xl font-serif font-bold mb-2 text-stone-400">El Sistema</h3>
                            <h2 className="text-3xl md:text-5xl font-serif font-bold">Respuesta Multidispositivo</h2>
                        </div>

                        <div className="flex flex-col items-center gap-20">
                            {/* Desktop View */}
                            {project.devices.desktop && (
                                <div
                                    className="w-full relative group cursor-zoom-in"
                                    onClick={() => setSelectedImageIndex(allImages.findIndex(img => img.src === project.devices.desktop))}
                                >
                                    <div className="absolute -inset-1 bg-gradient-to-r from-stone-200 to-stone-300 rounded-2xl blur opacity-25"></div>
                                    <div className="relative bg-stone-900 rounded-xl p-2 md:p-4 shadow-2xl border-4 border-stone-800">
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-stone-800 rounded-b-lg z-10"></div>
                                        <div className="w-full h-auto bg-stone-800 rounded overflow-hidden">
                                            <img src={project.devices.desktop} alt="Desktop View" className="w-full h-auto" />
                                        </div>
                                    </div>
                                    <span className="block text-center mt-4 font-mono text-xs uppercase tracking-widest text-stone-400">Desktop View</span>
                                </div>
                            )}

                            {/* Highlight Quote (Desktop Only Space Filler) */}
                            {project.highlightQuote && (
                                <div className="hidden md:flex justify-center items-center py-20 px-10">
                                    <div className="max-w-4xl text-center relative">
                                        <span className="absolute -top-10 -left-10 text-9xl text-stone-200 font-serif leading-none select-none">“</span>
                                        <p className="text-3xl md:text-5xl font-serif font-bold text-stone-800 leading-tight relative z-10">
                                            {project.highlightQuote}
                                        </p>
                                        <span className="absolute -bottom-20 -right-10 text-9xl text-stone-200 font-serif leading-none select-none">”</span>
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col md:flex-row gap-10 md:gap-20 w-full justify-center items-center">
                                {/* Tablet View */}
                                {project.devices.tablet && (
                                    <div
                                        className="w-full md:w-2/3 relative group cursor-zoom-in"
                                        onClick={() => setSelectedImageIndex(allImages.findIndex(img => img.src === project.devices.tablet))}
                                    >
                                        <div className="relative bg-stone-900 rounded-xl p-2 md:p-3 shadow-2xl border-4 border-stone-800">
                                            <div className="w-full h-auto bg-stone-800 rounded overflow-hidden">
                                                <img src={project.devices.tablet} alt="Tablet View" className="w-full h-auto" />
                                            </div>
                                        </div>
                                        <span className="block text-center mt-4 font-mono text-xs uppercase tracking-widest text-stone-400">Tablet / iPad</span>
                                    </div>
                                )}

                                {/* Mobile View */}
                                {project.devices.mobile && (
                                    <div
                                        className="w-full md:w-1/3 relative group cursor-zoom-in"
                                        onClick={() => setSelectedImageIndex(allImages.findIndex(img => img.src === project.devices.mobile))}
                                    >
                                        <div className="relative bg-stone-900 rounded-[2rem] p-2 md:p-3 shadow-2xl border-4 border-stone-800">
                                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-stone-800 rounded-b-xl z-10"></div>
                                            <div className="w-full h-auto bg-stone-800 rounded-[1.5rem] overflow-hidden">
                                                <img src={project.devices.mobile} alt="Mobile View" className="w-full h-auto" />
                                            </div>
                                        </div>
                                        <span className="block text-center mt-4 font-mono text-xs uppercase tracking-widest text-stone-400">Mobile View</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Gallery */}
            <div className="px-6 md:px-20 pb-20">
                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                    {project.gallery.map((item, i) => {
                        const src = typeof item === 'string' ? item : item.src;
                        const title = typeof item === 'string' ? null : item.title;

                        return (
                            <div
                                key={i}
                                className="group relative break-inside-avoid overflow-hidden rounded-xl cursor-zoom-in"
                                onClick={() => setSelectedImageIndex(allImages.findIndex(img => img.src === src))}
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 z-10 flex items-end p-6">
                                    {title && (
                                        <span className="text-white font-serif italic text-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                            {title}
                                        </span>
                                    )}
                                </div>
                                <img
                                    src={src}
                                    alt={title || `Gallery ${i}`}
                                    className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                                />
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {selectedImageIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImageIndex(null)}
                        className="fixed inset-0 z-[9999] bg-stone-900/95 backdrop-blur-md flex items-center justify-center p-6 cursor-zoom-out"
                    >
                        <div
                            className="max-w-7xl w-full max-h-[90vh] flex flex-col items-center justify-center relative pointer-events-none"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Image Container */}
                            <motion.div
                                key={selectedImageIndex}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="relative pointer-events-auto"
                            >
                                <img
                                    src={allImages[selectedImageIndex].src}
                                    alt="Full Screen View"
                                    className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
                                />
                                {allImages[selectedImageIndex].title && (
                                    <div className="text-center mt-6">
                                        <p className="text-white text-xl md:text-2xl font-serif italic">
                                            {allImages[selectedImageIndex].title}
                                        </p>
                                        <p className="text-stone-500 text-sm mt-2 font-mono">
                                            {selectedImageIndex + 1} / {allImages.length}
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        </div>

                        {/* Navigation Buttons (Bottom) */}
                        <div className="absolute bottom-10 flex gap-20 z-50 pointer-events-auto">
                            <button
                                className="text-white/50 hover:text-white transition-colors p-2 hover:scale-110 transform duration-200"
                                onClick={handlePrev}
                            >
                                <ArrowLeft size={40} />
                            </button>
                            <button
                                className="text-white/50 hover:text-white transition-colors p-2 hover:scale-110 transform duration-200"
                                onClick={handleNext}
                            >
                                <MoveRight size={40} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile-only Sharing & Feedback Section (Bottom) */}
            <div className="px-6 pb-20 md:hidden space-y-12">
                <div className="border-t border-stone-200 pt-10">
                    <h3 className="text-sm font-bold uppercase tracking-widest mb-6 text-stone-400">Compartir</h3>
                    <div className="flex gap-4 justify-between">
                        <button className="flex-1 py-4 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-600 active:bg-stone-900 active:text-white transition-all">
                            <Linkedin size={24} />
                        </button>
                        <button className="flex-1 py-4 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-600 active:bg-stone-900 active:text-white transition-all">
                            <Twitter size={24} />
                        </button>
                        <button className="flex-1 py-4 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-600 active:bg-terracotta active:text-white transition-all" onClick={() => navigator.clipboard.writeText(window.location.href)}>
                            <Link size={24} />
                        </button>
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest mb-6 text-stone-400">Feedback</h3>
                    <button className="w-full py-4 bg-white border border-stone-300 rounded-xl text-base font-bold text-stone-600 active:bg-stone-900 active:text-white transition-colors flex items-center justify-center gap-3">
                        <MessageSquare size={20} />
                        Sugerir Mejora
                    </button>
                </div>
            </div>

            {/* Footer Actions: New Project & Next Project */}
            <div className="px-6 md:px-20 py-20 border-t border-stone-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                    {/* New Project (Contact) */}
                    <button
                        onClick={onOpenContact}
                        className="group p-10 bg-stone-100 rounded-2xl hover:bg-stone-900 transition-all duration-500 ease-in-out text-left relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Ticket size={100} className="text-stone-500 group-hover:text-white" />
                        </div>
                        <span className="block text-stone-500 text-xs font-mono uppercase tracking-widest mb-4 group-hover:text-stone-400">¿Tienes una idea?</span>
                        <span className="block text-3xl md:text-4xl font-serif font-bold text-stone-900 group-hover:text-white transition-colors relative z-10">
                            Iniciar Nuevo Proyecto
                        </span>
                        <span className="inline-flex items-center gap-2 mt-8 text-sm font-bold uppercase tracking-widest text-stone-600 group-hover:text-terracotta transition-colors">
                            Hablemos <MessageSquare size={16} />
                        </span>
                    </button>

                    {/* Next Project (Link) */}
                    {(() => {
                        const currentIndex = projectsData.findIndex(p => p.id === id);
                        const nextProject = projectsData[(currentIndex + 1) % projectsData.length];
                        return (
                            <RouterLink
                                to={`/work/${nextProject.id}`}
                                className="group p-10 bg-stone-100 rounded-2xl hover:bg-terracotta transition-all duration-500 ease-in-out text-left relative overflow-hidden"
                                onClick={() => window.scrollTo(0, 0)}
                            >
                                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Layers size={100} className="text-stone-500 group-hover:text-white" />
                                </div>
                                <span className="block text-stone-500 text-xs font-mono uppercase tracking-widest mb-4 group-hover:text-terracotta-100">Siguiente Caso</span>
                                <span className="block text-3xl md:text-4xl font-serif font-bold text-stone-900 group-hover:text-white transition-colors relative z-10">
                                    {nextProject.title}
                                </span>
                                <span className="inline-flex items-center gap-2 mt-8 text-sm font-bold uppercase tracking-widest text-stone-600 group-hover:text-white transition-colors">
                                    Ver Proyecto <MoveRight size={16} />
                                </span>
                            </RouterLink>
                        );
                    })()}
                </div>

                {/* Footer Navigation: Back & Scroll Top */}
                <div className="flex justify-between items-center border-t border-stone-100 pt-10">
                    <RouterLink to="/" state={{ scrollTo: 'work' }} className="flex items-center gap-2 text-stone-400 hover:text-stone-900 transition-colors uppercase text-xs tracking-widest font-bold">
                        <ArrowLeft size={16} /> Volver al Inicio
                    </RouterLink>

                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="flex items-center gap-2 text-stone-400 hover:text-terracotta transition-colors uppercase text-xs tracking-widest font-bold"
                    >
                        Subir <ArrowUpRight size={16} className="-rotate-45" />
                    </button>
                </div>
            </div>

        </motion.div>
    );
};

// 5. Contact / Footer
const Contact = () => {
    const { contact } = contentData;
    return (
        <section id="contact" className="min-h-screen bg-stone-900 text-stone-100 flex flex-col justify-center items-center text-center p-10 relative">
            <p className="text-terracotta font-sans uppercase tracking-widest mb-6">{contact.eyebrow}</p>
            <h2 className="text-4xl md:text-8xl font-serif font-bold mb-10 leading-tight">
                {contact.title} <br /> <i className="font-light text-stone-500">{contact.italicTitle}</i>
            </h2>
            <a href={`mailto:${contact.email}`} className="text-lg md:text-4xl border-b-2 border-stone-500 pb-2 hover:border-terracotta hover:text-terracotta transition-colors">
                {contact.email}
            </a>
            <footer className="absolute bottom-10 text-stone-600 text-xs">
                © {new Date().getFullYear()} {contact.copyright}
            </footer>
        </section>
    )
}

const Home = () => {
    const location = useLocation();

    useEffect(() => {
        if (location.state && location.state.scrollTo === 'work') {
            const workSection = document.getElementById('work');
            if (workSection) {
                workSection.scrollIntoView({ behavior: 'smooth' });
                // Optional: Clear state to avoid scrolling on refresh (complex with React Router history, maybe not needed for this simple case)
            }
        }
    }, [location]);

    return (
        <main className="w-full bg-stone-50">
            <Hero />
            <About />
            <Industries />
            <CallToAction />
            <DigitalSovereignty />
            <Products />
            <Work />
            <Contact />
        </main>
    );
};

const App: React.FC = () => {
    const [isContactOpen, setIsContactOpen] = useState(false);

    // Preload critical images on mount
    useEffect(() => {
        // Extract all image URLs from content data
        const allImageUrls = extractImageUrls(contentData);

        // Define critical images (hero, about, first project)
        const criticalImages = [
            contentData.about.image,
            ...projectsData.slice(0, 2).map(p => p.img) // First 2 projects
        ].filter(Boolean);

        // Define normal priority images
        const normalImages = allImageUrls.filter(url => !criticalImages.includes(url));

        // Preload with priority
        imageCache.preloadWithPriority(criticalImages, normalImages);

        // Optional: Log cache stats in development
        if (import.meta.env.DEV) {
            setTimeout(() => {
                console.log('Image Cache Stats:', imageCache.getStats());
            }, 3000);
        }
    }, []);

    return (
        <BrowserRouter>
            <ScrollToTop />
            <div className="antialiased selection:bg-terracotta selection:text-white">
                <Navigation />
                {/* <Chatbot /> */}
                <FloatingActions onOpenContact={() => setIsContactOpen(true)} />
                <AnimatePresence>
                    {isContactOpen && <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />}
                </AnimatePresence>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/contacto" element={<ContactFormPage />} />
                    <Route path="/work/:id" element={<CaseStudy onOpenContact={() => setIsContactOpen(true)} />} />
                    <Route path="/admin" element={<AdminPanel />} />
                </Routes>
                {/* 6. Footer */}
                <Footer />
            </div>
        </BrowserRouter>
    );
};

export default App;