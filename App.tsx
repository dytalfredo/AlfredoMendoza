import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { HashRouter, Routes, Route, Link as RouterLink, useParams, useLocation } from 'react-router-dom';
import { motion, useScroll, useTransform, Variants, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShoppingBag, MessageSquare, Ticket, ArrowUpRight, Database, Smartphone, Layers, CheckCircle2, ArrowLeft, MoveRight } from 'lucide-react';
import Navigation from './components/Navigation';
import Chatbot from './components/Chatbot';
import AdminPanel from './components/AdminPanel';

// Register GSAP Plugin
gsap.registerPlugin(ScrollTrigger);

// --- DATA: Centralized Project Data ---
const projectsData = [
    { 
        id: 'lumina', 
        title: 'Lumina', 
        category: 'Comercio Electrónico', 
        year: '2023',
        img: 'https://picsum.photos/seed/lumina/1920/1080',
        shortDesc: 'Una solución a medida que resuelve problemas de retención de clientes a través de micro-interacciones intuitivas.',
        story: {
            conflict: "Lumina tenía un problema de identidad. Vendían lámparas de $500 en una web que parecía un almacén de $5. La tasa de rebote era del 70%. La gente no confiaba en la calidad porque la experiencia digital era barata.",
            strategy: "Destruimos el catálogo tradicional. Creamos una experiencia inmersiva donde el producto es el protagonista absoluto. Implementamos modelado 3D interactivo en React Three Fiber y una arquitectura Headless con Shopify para una velocidad brutal.",
            result: "La tasa de conversión se triplicó en 3 meses. El ticket promedio subió un 40%. No solo vendimos lámparas, vendimos estatus.",
            tech: ["React", "Shopify Hydrogen", "WebGL", "Tailwind"]
        },
        gallery: [
            'https://picsum.photos/seed/lumina1/800/600',
            'https://picsum.photos/seed/lumina2/800/600',
            'https://picsum.photos/seed/lumina3/800/600'
        ]
    },
    { 
        id: 'apex-logic', 
        title: 'Apex Logic', 
        category: 'Panel SaaS', 
        year: '2024',
        img: 'https://picsum.photos/seed/apex/1920/1080',
        shortDesc: 'Dashboard analítico para traders de alta frecuencia. Datos en tiempo real sin latencia visual.',
        story: {
            conflict: "Los traders odian esperar. La plataforma anterior tenía un retraso de 2 segundos en la carga de datos. En trading, 2 segundos es una eternidad. Apex estaba perdiendo usuarios frente a competidores más rápidos.",
            strategy: "Reescribimos el frontend usando WebSockets directos y optimización agresiva de renderizado. Diseñamos una interfaz oscura de alto contraste para reducir la fatiga visual en sesiones largas.",
            result: "Latencia visual reducida a <50ms. La retención de usuarios activos diarios aumentó un 85%.",
            tech: ["Next.js", "WebSockets", "D3.js", "Firebase"]
        },
        gallery: [
            'https://picsum.photos/seed/apex1/800/600',
            'https://picsum.photos/seed/apex2/800/600'
        ]
    },
    { 
        id: 'velvet', 
        title: 'Velvet', 
        category: 'Portafolio de Moda', 
        year: '2022',
        img: 'https://picsum.photos/seed/velvet/1920/1080',
        shortDesc: 'Editorial digital para una marca de ropa emergente. Minimalismo brutalista.',
        story: {
            conflict: "El mercado de la moda está saturado de 'estética segura'. Velvet quería gritar, no susurrar. Necesitaban una web que fuera tan audaz como su ropa, pero funcional para el e-commerce.",
            strategy: "Utilizamos una estética brutalista con tipografía gigante y grid asimétrico. La navegación es una exploración, no un mapa. Cada scroll es una sorpresa visual controlada.",
            result: "Mención honorífica en Awwwards. Sold-out de la colección de lanzamiento en 48 horas.",
            tech: ["Astro", "GSAP", "Sanity CMS"]
        },
        gallery: [
            'https://picsum.photos/seed/velvet1/800/600',
            'https://picsum.photos/seed/velvet2/800/600',
            'https://picsum.photos/seed/velvet3/800/600'
        ]
    },
];

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
  // Enhanced parallax
  const y1 = useTransform(scrollY, [0, 1000], [0, 600]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -400]);

  // State to toggle between "Alfredo Mendoza" and "Full Stack Visionary" in background
  const [showNameInBg, setShowNameInBg] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowNameInBg((prev) => !prev);
    }, 4000); // Swap every 4 seconds
    return () => clearInterval(interval);
  }, []);

  // Configuration based on state
  const topBgText = showNameInBg ? "ALFREDO" : "FULL STACK";
  const bottomBgText = showNameInBg ? "MENDOZA" : "VISIONARY";
  
  const fgLine1 = showNameInBg ? "Full Stack" : "Alfredo";
  const fgLine2 = showNameInBg ? "Visionary." : "Mendoza.";

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
    <section className="h-screen w-full flex flex-col justify-center items-center relative overflow-hidden bg-stone-50">
      
      {/* Top Background Text */}
      <motion.div 
        style={{ y: y1 }} 
        className="absolute top-20 md:top-0 z-0 opacity-10 font-serif text-[18vw] md:text-[18rem] leading-none whitespace-nowrap text-terracotta select-none w-full text-center"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={topBgText}
            variants={bgTextVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {topBgText}
          </motion.div>
        </AnimatePresence>
      </motion.div>
      
      {/* Foreground Content */}
      <div className="z-10 text-center px-4 mix-blend-multiply relative h-[300px] flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.h1 
            key={fgLine1} // Triggers animation on change
            variants={fgTextVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="text-5xl sm:text-6xl md:text-9xl font-serif font-bold tracking-tight text-stone-900 leading-none"
          >
            {fgLine1} <br/>
            <span className="italic font-light text-terracotta">{fgLine2}</span>
          </motion.h1>
        </AnimatePresence>

        <motion.p 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.5 }}
           className="mt-6 text-base sm:text-lg md:text-xl font-sans font-light max-w-xs sm:max-w-lg mx-auto text-stone-600"
        >
          No solo hago minimalismo. Soy Full Stack. <br className="hidden md:block"/>
          Descubro tu esencia y la traduzco en cualquier lenguaje visual necesario.
        </motion.p>
      </div>
      
      {/* Bottom Background Text */}
      <motion.div 
        style={{ y: y2 }} 
        className="absolute bottom-32 md:bottom-0 z-0 opacity-5 font-serif text-[18vw] md:text-[18rem] leading-none whitespace-nowrap text-stone-900 select-none w-full text-center"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={bottomBgText}
            variants={bgTextVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ delay: 0.2 }} // Slight delay for the bottom text
          >
            {bottomBgText}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

// 2. Philosophy Section: Fixed Center Slideshow
// Items appear and disappear in the EXACT SAME SPOT. No vertical movement.
const Philosophy = () => {
    const sectionRef = useRef<HTMLDivElement>(null);

    const principles = [
        {
            title: "Hiper Personalización",
            subtitle: "La Muerte de la Plantilla",
            desc: "Tu marca no es un template de $50. Usando IA y datos, creo experiencias que mutan según quien las mira.",
            img: "https://picsum.photos/seed/abstract_red/1920/1080"
        },
        {
            title: "Esencia Adaptativa",
            subtitle: "Forma sigue a Función",
            desc: "No impongo estilos. Descubro la verdad de tu negocio y la codifico. Brutalismo, Minimalismo o Caos Controlado.",
            img: "https://picsum.photos/seed/abstract_dark/1920/1080"
        },
        {
            title: "UX Aplicativo",
            subtitle: "Herramientas, No Adornos",
            desc: "Si es bonito pero no vende, es arte. Yo hago negocios. Interfaces que convierten dudas en depósitos.",
            img: "https://picsum.photos/seed/abstract_structure/1920/1080"
        }
    ];

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "+=3500", // Controls speed of sequence
                    scrub: 0.5,
                    pin: true,
                }
            });

            // Ensure clean starting state for all items
            principles.forEach((_, i) => {
                 gsap.set(`.phil-item-${i}`, { autoAlpha: 0, scale: 0.95 });
                 gsap.set(`.phil-bg-${i}`, { opacity: 0 });
                 gsap.set(`.phil-line-horiz-${i}`, { width: 0 });
            });

            principles.forEach((_, i) => {
                const isLast = i === principles.length - 1;
                
                // --- ENTER PHASE ---
                // We use fromTo to guarantee the start state in the timeline flow
                tl.to(`.phil-item-${i}`, { 
                    autoAlpha: 1, 
                    filter: "blur(0px)",
                    scale: 1,
                    duration: 0.5,
                    ease: "power2.out"
                })
                .to(`.phil-bg-${i}`, { opacity: 0.5, duration: 1 }, "<")
                .to(`.phil-line-horiz-${i}`, { width: 100, duration: 0.5 }, "<");

                // 2. Hold reading time (Static phase)
                tl.to({}, { duration: 1.5 });

                // --- EXIT PHASE (Strictly sequential: Fade out BEFORE next loop starts) ---
                if (!isLast) {
                    tl.to(`.phil-item-${i}`, { 
                        autoAlpha: 0, 
                        filter: "blur(10px)",
                        scale: 0.95,
                        duration: 0.5,
                        ease: "power2.in"
                    })
                    .to(`.phil-bg-${i}`, { opacity: 0, duration: 0.5 }, "<")
                    .set(`.phil-line-horiz-${i}`, { width: 0 }); // Reset line
                    
                    // Add a tiny buffer to ensure strict invisibility before next frame
                    tl.to({}, { duration: 0.1 });
                }
            });

        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="philosophy" className="relative h-screen w-full bg-stone-900 overflow-hidden text-stone-100 flex items-center justify-center">
            {/* Background Images Layer (Absolute Full Screen) */}
            {principles.map((p, i) => (
                <div 
                    key={`bg-${i}`} 
                    className={`phil-bg-${i} absolute inset-0 bg-cover bg-center transition-opacity opacity-0 pointer-events-none`}
                    style={{ backgroundImage: `url(${p.img})` }}
                >
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
                </div>
            ))}

            {/* Static Anchor Lines - Fixed position relative to container */}
            <div className="absolute left-6 md:left-20 top-0 bottom-0 w-px bg-stone-800 hidden md:block z-10">
                 <div className="absolute top-1/2 -translate-y-1/2 w-1 h-20 bg-terracotta/20"></div>
            </div>

            {/* Content Container - Items overlap perfectly here */}
            <div className="relative z-20 w-full max-w-6xl px-6 md:px-20 h-full">
                
                {principles.map((p, i) => (
                    <div 
                        key={i} 
                        // ABSOLUTE INSET-0 ensures they occupy full screen and stack on top of each other exactly
                        // Flexbox inside handles centering the text content
                        className={`phil-item-${i} absolute inset-0 w-full h-full flex flex-col md:flex-row items-center justify-center md:justify-start gap-8 opacity-0 blur-sm scale-95 will-change-transform pointer-events-none`}
                    >
                        {/* Number & Connecting Line */}
                        <div className="hidden md:flex items-center gap-6 min-w-[150px]">
                            <span className="font-mono text-xl text-stone-500">0{i+1}</span>
                            {/* The Horizontal Line animating out */}
                            <div className={`phil-line-horiz-${i} h-[2px] w-0 bg-terracotta`}></div>
                        </div>

                        {/* Text Content */}
                        <div className="max-w-3xl text-center md:text-left px-4">
                            <p className="text-terracotta text-xs md:text-sm font-bold uppercase tracking-[0.3em] mb-4">
                                {p.subtitle}
                            </p>
                            <h3 className="text-4xl sm:text-6xl md:text-8xl font-serif font-bold italic mb-6 leading-none text-white">
                                {p.title}
                            </h3>
                            <div className="w-10 h-1 bg-stone-700 mx-auto md:mx-0 mb-6"></div>
                            <p className="text-lg md:text-3xl font-light leading-relaxed text-stone-400">
                                {p.desc}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="absolute bottom-10 right-10 flex flex-col items-end gap-2 text-stone-600 animate-pulse">
                <span className="text-xs font-mono uppercase">Scroll Flow</span>
                <div className="w-px h-10 bg-stone-600"></div>
            </div>
        </section>
    );
};

// 2.5 Industries Section (One by One Reveal with Value Props)
const Industries = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const items = [
        { 
            label: "Estudios Tatuajes", 
            desc: "Sistemas de citas automatizados, cobro de depósitos y galerías que venden." 
        },
        { 
            label: "Estudios Foto", 
            desc: "Selección de pruebas en la nube y entrega digital instantánea." 
        },
        { 
            label: "Restaurantes", 
            desc: "Menús QR interactivos que cuentan historias, no PDFs aburridos." 
        },
        { 
            label: "Tiendas Concepto", 
            desc: "E-commerce inmersivo con sincronización de inventario real." 
        },
        { 
            label: "Consultorías", 
            desc: "Embudos de conversión que filtran curiosos y agendan clientes." 
        },
        { 
            label: "Manufactura", 
            desc: "Catálogos B2B dinámicos y cotizadores en tiempo real." 
        },
        { 
            label: "Servicios", 
            desc: "Autoridad digital instantánea. Convierte la duda en venta." 
        },
    ];

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    pin: true,
                    start: "top top",
                    end: `+=${items.length * 1500}`, // Increased scroll distance for breathing room
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

                // 2. Enter Description (Sequence after Name)
                tl.fromTo(`.industry-desc-${i}`,
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
                    "-=0.5" 
                );

                // 3. Hold phase (Allow user to read)
                tl.to({}, { duration: 2 }); 
                
                // 4. Exit Text (if not last)
                if (!isLast) {
                    // We append these to the END of the timeline sequence for this item.
                    tl.to(`.industry-title-${i}`, 
                        { y: -50, opacity: 0, filter: "blur(5px)", duration: 0.8, ease: "power3.in" }
                    )
                    .to(`.industry-desc-${i}`, 
                        { y: -20, opacity: 0, duration: 0.8, ease: "power3.in" },
                        "<" // Sync desc exit exactly with title exit
                    );
                }
            });

        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="h-screen w-full relative overflow-hidden text-stone-50 flex flex-col items-center justify-center bg-stone-900">
            {/* Background Texture/Noise */}
            <div className="absolute inset-0 z-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

            <div className="z-10 relative text-center w-full px-4 h-screen flex flex-col items-center justify-center">
                <p className="absolute top-20 text-xs md:text-base font-sans uppercase tracking-[0.5em] mb-10 opacity-70">
                    Transformo Industrias
                </p>

                {/* Container for text elements to overlap perfectly */}
                <div className="relative w-full max-w-5xl h-[40vh] flex flex-col items-center justify-center">
                    {items.map((item, i) => (
                        <div key={i} className="absolute inset-0 flex flex-col items-center justify-center">
                            <h2 
                                className={`industry-title-${i} text-4xl sm:text-5xl md:text-8xl lg:text-9xl font-serif font-bold italic leading-none whitespace-nowrap opacity-0`}
                            >
                                {item.label}
                            </h2>
                            <p 
                                className={`industry-desc-${i} mt-4 sm:mt-6 md:mt-10 text-base sm:text-lg md:text-2xl font-sans font-light max-w-xs sm:max-w-2xl text-center opacity-0 leading-relaxed text-stone-300`}
                            >
                                {item.desc}
                            </p>
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

// 3. Testimonials Section (Improved with Container Query style logic)
const Testimonials = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const reviews = [
    {
      id: 1,
      quote: "Odiaba su actitud hasta que vi las tasas de conversión. Es arrogante porque tiene razón.",
      author: "Sarah J.",
      role: "CEO, TechFlow",
    },
    {
      id: 2,
      quote: "Alfredo no construyó lo que quería. Construyó lo que necesitaba. Salvó mi compañía.",
      author: "Mark D.",
      role: "Fundador, Apex",
    },
    {
      id: 3,
      quote: "Finalmente, un desarrollador que entiende que los píxeles importan.",
      author: "Elena R.",
      role: "Directora de Arte",
    },
    {
      id: 4,
      quote: "Desearía que dejara de trabajar para que yo pudiera conseguir clientes.",
      author: "Anónimo",
      role: "Competidor",
    }
  ];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Horizontal Scroll Logic
      gsap.to(wrapperRef.current, {
        x: () => `-${(reviews.length - 1) * 85}vw`,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          snap: 1 / (reviews.length - 1),
          end: () => `+=${wrapperRef.current ? wrapperRef.current.offsetWidth : 3000}`
        }
      });
      
      // Parallax text
      gsap.to(".parallax-bg-text", {
         x: -400,
         scrollTrigger: {
             trigger: containerRef.current,
             scrub: 1,
             start: "top top",
             end: "bottom top"
         }
      });
    }, containerRef);
    return () => ctx.revert();
  }, [reviews.length]);

  return (
    <section ref={containerRef} className="relative h-screen bg-stone-200 overflow-hidden flex items-center">
      
      {/* Container Query Style Injection */}
      <style>{`
        .testimonial-card-container {
            container-type: inline-size;
        }
        @container (max-width: 500px) {
            .quote-text { font-size: 1.25rem; line-height: 1.3; }
        }
        @container (min-width: 501px) {
            .quote-text { font-size: 2.5rem; line-height: 1.1; }
        }
      `}</style>

      {/* Background Text Layer */}
      <div className="absolute top-1/2 -translate-y-1/2 w-full z-0 pointer-events-none select-none">
         <div className="parallax-bg-text whitespace-nowrap text-[25vw] font-serif font-bold text-stone-300 opacity-50 ml-20">
             VALIDACIÓN EGO VERDAD
         </div>
      </div>

      {/* Intro Text */}
      <div className="absolute left-6 md:left-20 top-1/2 -translate-y-1/2 z-10 w-[25vw]">
         <h2 className="text-3xl sm:text-4xl md:text-6xl font-serif text-stone-900 leading-tight">
           No confíes <br/> en mi <span className="text-terracotta italic">palabra</span>.
         </h2>
         <p className="mt-4 text-xs sm:text-sm text-stone-500 font-sans">Desliza para ver el daño &rarr;</p>
      </div>

      {/* Sliding Wrapper */}
      <div ref={wrapperRef} className="flex pl-[40vw] gap-6 md:gap-20 z-10 items-center will-change-transform h-full">
          {reviews.map((r) => (
            <div 
              key={r.id} 
              // Removed strict fixed height to avoid overflow, used min-h and flex
              className="testimonial-card-container w-[80vw] md:w-[60vw] min-h-[40vh] h-auto max-h-[70vh] bg-stone-900 text-stone-50 p-6 md:p-14 flex flex-col justify-between shrink-0 hover:scale-[1.01] transition-transform duration-500 shadow-2xl rounded-2xl border border-stone-800"
            >
              <div className="text-terracotta text-5xl md:text-8xl font-serif leading-none mb-4">“</div>
              
              <div className="flex-1 flex items-center my-4 md:my-6">
                <p className="quote-text font-light leading-tight">
                    {r.quote}
                </p>
              </div>

              <div className="border-t border-stone-700 pt-4 md:pt-6 flex justify-between items-end">
                <div>
                    <p className="font-bold text-base md:text-2xl uppercase tracking-wider">{r.author}</p>
                    <p className="text-stone-500 text-xs md:text-sm">{r.role}</p>
                </div>
                <div className="text-[10px] md:text-xs text-stone-600 font-mono border border-stone-700 px-2 py-1 rounded">VERIFIED HATER</div>
              </div>
            </div>
          ))}
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

    const products = [
        {
            id: 'erp',
            title: "Control Total",
            subtitle: "ERP / E-COMMERCE",
            desc: "Inventario, facturación y tienda online en un solo cerebro digital.",
            icon: <Database className="text-white w-8 h-8 md:w-12 md:h-12" />,
            colorClass: "bg-stone-800", // Dark Gray
            textColor: "text-stone-300",
            features: ["Sincronización en tiempo real", "Facturación Electrónica", "Panel Administrativo"]
        },
        {
            id: 'bot',
            title: "SensyBot",
            subtitle: "IA WHATSAPP",
            desc: "Atención 24/7 que aprende de tus clientes y vende por ti.",
            icon: <Smartphone className="text-white w-8 h-8 md:w-12 md:h-12" />,
            colorClass: "bg-stone-900", // Blacker
            textColor: "text-stone-200",
            features: ["Respuestas Humanizadas", "Agenda de Citas", "Seguimiento de Leads"]
        },
        {
            id: 'game',
            title: "GameFed",
            subtitle: "FIDELIZACIÓN",
            desc: "Convierte compras en juegos adictivos. Ruletas, puntos y premios.",
            icon: <Layers className="text-white w-8 h-8 md:w-12 md:h-12" />,
            colorClass: "bg-terracotta", // Brand Accent
            textColor: "text-stone-100",
            features: ["Gamificación", "Sistema de Puntos", "Sorteos Automáticos"]
        }
    ];

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "+=3000",
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
                tl.to(`.prod-card-${i-1}`, {
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
    }, []);

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
        <section ref={sectionRef} id="products" className="h-[100svh] w-full relative overflow-hidden flex bg-stone-900 text-white">
            {/* Dynamic Background Layer */}
            <div className="prod-bg-layer absolute inset-0 bg-stone-900"></div>
            
            {/* Noise Overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0"></div>

            <div className="relative z-10 w-full h-full grid grid-cols-1 md:grid-cols-12">
                
                {/* --- LEFT COLUMN: Info & Navigation --- */}
                <div className="col-span-1 md:col-span-5 flex flex-col justify-between p-6 md:p-12 md:pl-20 pt-20 md:pt-12 order-1 md:order-1 relative h-[30vh] md:h-full">
                    {/* Title & Description Area */}
                    <div className="mt-4 md:mt-20">
                        <div className="flex items-center gap-2 mb-2 md:mb-4">
                            <div className="w-2 h-2 rounded-full bg-terracotta animate-pulse"></div>
                            <span className="text-[10px] md:text-xs font-mono uppercase tracking-[0.2em] opacity-70">SaaS Ecosystem</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-6xl font-serif font-bold leading-tight mb-2 md:mb-6">
                            Productos <br className="hidden md:block"/> <span className="text-terracotta italic">Listos</span>.
                        </h2>
                        
                        <div className="space-y-2 md:space-y-4 max-w-md">
                            <p className="text-sm sm:text-base md:text-lg font-light text-stone-300 leading-relaxed border-l-2 border-terracotta pl-4 line-clamp-2 md:line-clamp-none">
                                Implementación inmediata. Sin tiempos muertos.
                            </p>
                            <p className="hidden sm:block text-xs md:text-sm text-stone-400">
                                Olvida los ciclos de desarrollo de 6 meses. Despliega infraestructura empresarial validada.
                            </p>
                        </div>
                    </div>

                    {/* Desktop Vertical Navigation */}
                    <div className="hidden md:flex flex-col gap-2 mt-auto">
                        {products.map((p, i) => (
                            <button
                                key={p.id}
                                onClick={() => handleNavClick(i)}
                                className={`text-left py-4 px-6 rounded-lg transition-all duration-300 flex items-center justify-between group ${
                                    activeIndex === i 
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

                {/* --- RIGHT COLUMN: Card Stack --- */}
                <div className="col-span-1 md:col-span-7 relative flex items-end md:items-center justify-center p-4 md:p-12 order-3 md:order-2 h-[60vh] md:h-full">
                    <div ref={contentRef} className="relative w-full max-w-md md:max-w-xl h-full md:h-auto aspect-[4/5] md:aspect-[16/12] flex items-center justify-center">
                        {products.map((p, i) => (
                            <div 
                                key={p.id}
                                className={`prod-card-${i} absolute w-full h-full bg-white/5 backdrop-blur-md border border-white/10 rounded-t-3xl md:rounded-3xl p-6 md:p-12 flex flex-col justify-between shadow-2xl origin-bottom`}
                                style={{ 
                                    y: i === 0 ? 0 : '100%', 
                                    zIndex: 10 + i 
                                }}
                            >
                                {/* Card Header */}
                                <div className="flex justify-between items-start">
                                    <div className="p-2 md:p-3 bg-white/10 rounded-xl ring-1 ring-white/20">
                                        {p.icon}
                                    </div>
                                    <span className="font-mono text-3xl md:text-6xl font-bold opacity-10 select-none">0{i+1}</span>
                                </div>

                                {/* Card Body */}
                                <div>
                                    <h3 className="text-2xl md:text-5xl font-serif font-bold mb-2 md:mb-4">{p.title}</h3>
                                    <p className={`text-sm md:text-lg font-light leading-relaxed mb-4 md:mb-6 ${p.textColor} line-clamp-3 md:line-clamp-none`}>
                                        {p.desc}
                                    </p>
                                    
                                    {/* Features List */}
                                    <ul className="space-y-1 md:space-y-2 mb-4 md:mb-6">
                                        {p.features.map((feat, idx) => (
                                            <li key={idx} className="flex items-center gap-2 text-xs md:text-sm text-stone-400">
                                                <CheckCircle2 size={14} className="text-terracotta shrink-0" />
                                                <span className="truncate">{feat}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Card Footer */}
                                <div className="pt-4 border-t border-white/10">
                                    <button className="w-full flex justify-between items-center group cursor-pointer hover:bg-white/10 p-2 rounded transition-colors">
                                        <span className="uppercase text-xs tracking-widest font-bold">Ver Demo Live</span>
                                        <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- MOBILE NAV (Middle Strip) --- */}
                <div className="col-span-1 md:hidden order-2 h-[10vh] flex items-center px-4 overflow-x-auto no-scrollbar border-b border-white/10 bg-stone-900/50 backdrop-blur-sm z-30 sticky top-0">
                    <div className="flex gap-4 min-w-full">
                        {products.map((p, i) => (
                            <button
                                key={p.id}
                                onClick={() => handleNavClick(i)}
                                className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap border ${
                                    activeIndex === i 
                                    ? 'bg-white text-stone-900 border-white' 
                                    : 'bg-transparent text-stone-400 border-stone-700'
                                }`}
                            >
                                {p.title}
                            </button>
                        ))}
                    </div>
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
                className="text-sm font-sans uppercase tracking-widest mb-10 md:mb-20 border-b border-stone-200 pb-4"
            >
                Trabajos Selectos
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
                                className="text-terracotta font-sans text-xs md:text-sm mb-2"
                            >
                                0{i+1} — {p.category}
                            </motion.span>
                            
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

// 4.5 NEW COMPONENT: Case Study Page (Storytelling Format)
const CaseStudy = () => {
    const { id } = useParams();
    const project = projectsData.find(p => p.id === id);

    if (!project) return <div className="h-screen flex items-center justify-center text-4xl font-serif">Proyecto no encontrado.</div>;

    return (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="bg-stone-50 min-h-screen text-stone-900"
        >
            {/* Nav Back */}
            <div className="fixed top-24 left-6 md:left-10 z-40 mix-blend-difference text-white">
                <RouterLink to="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
                    <ArrowLeft size={20} />
                    <span className="uppercase text-xs tracking-widest hidden md:inline">Volver</span>
                </RouterLink>
            </div>

            {/* Hero Header */}
            <header className="h-[70vh] md:h-[80vh] flex flex-col justify-end px-6 md:px-20 pb-20 border-b border-stone-200 relative overflow-hidden">
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

                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col md:flex-row gap-8 md:items-end"
                >
                    <p className="text-lg md:text-2xl font-light max-w-2xl text-stone-600">
                        {project.shortDesc}
                    </p>
                    <div className="flex gap-2 flex-wrap">
                        {project.story.tech.map(t => (
                            <span key={t} className="px-3 py-1 border border-stone-300 rounded-full text-[10px] md:text-xs uppercase tracking-wider">{t}</span>
                        ))}
                    </div>
                </motion.div>
            </header>

            {/* Story Arc Section */}
            <section className="py-20 px-6 md:px-20 max-w-7xl mx-auto">
                <div className="grid md:grid-cols-12 gap-10">
                    {/* Chapter 1: The Conflict */}
                    <div className="md:col-span-4 sticky top-20 h-fit">
                        <span className="text-4xl md:text-6xl font-serif text-terracotta opacity-20 block mb-4">01</span>
                        <h3 className="text-xl md:text-2xl font-bold mb-4 uppercase tracking-widest">El Conflicto</h3>
                        <p className="text-base md:text-lg leading-relaxed text-stone-600 font-light">
                            {project.story.conflict}
                        </p>
                    </div>

                    {/* Visual Break 1 */}
                    <div className="md:col-span-8">
                        <img src={project.gallery[0]} className="w-full h-auto rounded-lg shadow-xl mb-10 grayscale hover:grayscale-0 transition-all duration-700" alt="Conflict Visual" />
                    </div>

                    {/* Chapter 2: The Strategy */}
                    <div className="md:col-span-8 order-2 md:order-1">
                         <img src={project.gallery[1]} className="w-full h-auto rounded-lg shadow-xl mb-10 grayscale hover:grayscale-0 transition-all duration-700" alt="Strategy Visual" />
                    </div>
                    <div className="md:col-span-4 sticky top-20 h-fit order-1 md:order-2">
                        <span className="text-4xl md:text-6xl font-serif text-terracotta opacity-20 block mb-4">02</span>
                        <h3 className="text-xl md:text-2xl font-bold mb-4 uppercase tracking-widest">La Estrategia</h3>
                        <p className="text-base md:text-lg leading-relaxed text-stone-600 font-light">
                            {project.story.strategy}
                        </p>
                    </div>

                     {/* Chapter 3: The Resolution */}
                     <div className="md:col-span-4 sticky top-20 h-fit order-3">
                        <span className="text-4xl md:text-6xl font-serif text-terracotta opacity-20 block mb-4">03</span>
                        <h3 className="text-xl md:text-2xl font-bold mb-4 uppercase tracking-widest">Resolución</h3>
                        <p className="text-base md:text-lg leading-relaxed text-stone-600 font-light">
                            {project.story.result}
                        </p>
                        <div className="mt-8 p-6 bg-stone-900 text-stone-50 rounded-lg">
                            <p className="font-mono text-xs uppercase tracking-widest opacity-50 mb-2">Veredicto</p>
                            <p className="font-serif italic text-xl">"Un éxito absoluto."</p>
                        </div>
                    </div>

                    <div className="md:col-span-8 order-4">
                        {project.gallery[2] && (
                            <img src={project.gallery[2]} className="w-full h-auto rounded-lg shadow-xl mb-10 grayscale hover:grayscale-0 transition-all duration-700" alt="Result Visual" />
                        )}
                    </div>
                </div>
            </section>

            {/* Next Project Footer */}
            <div className="h-[50vh] bg-stone-900 flex items-center justify-center text-center text-white relative overflow-hidden group">
                 <div className="absolute inset-0 bg-terracotta opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                 <div className="relative z-10">
                    <p className="text-sm uppercase tracking-widest mb-4">Siguiente Historia</p>
                    <RouterLink to="/" className="text-4xl md:text-8xl font-serif font-bold italic hover:underline">
                        Volver al Inicio
                    </RouterLink>
                 </div>
            </div>
        </motion.div>
    );
};

// 5. Contact / Footer
const Contact = () => {
    return (
        <section id="contact" className="min-h-screen bg-stone-900 text-stone-100 flex flex-col justify-center items-center text-center p-10">
            <p className="text-terracotta font-sans uppercase tracking-widest mb-6">Suficiente Navegación</p>
            <h2 className="text-4xl md:text-8xl font-serif font-bold mb-10 leading-tight">
                ¿Listo para dejar de <br/> <i className="font-light text-stone-500">ser aburrido?</i>
            </h2>
            <a href="mailto:hello@alfredomendoza.com" className="text-lg md:text-4xl border-b-2 border-stone-500 pb-2 hover:border-terracotta hover:text-terracotta transition-colors">
                hello@alfredomendoza.com
            </a>
            <footer className="absolute bottom-10 text-stone-600 text-xs">
                © {new Date().getFullYear()} Alfredo Mendoza. Todos los derechos reservados. 
            </footer>
        </section>
    )
}

const Home = () => {
  return (
    <main className="w-full bg-stone-50">
      <Hero />
      <Philosophy />
      <Industries />
      <Testimonials />
      <Products />
      <Work />
      <Contact />
    </main>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <ScrollToTop />
      <div className="antialiased selection:bg-terracotta selection:text-white">
        <Navigation />
        <Chatbot />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work/:id" element={<CaseStudy />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default App;