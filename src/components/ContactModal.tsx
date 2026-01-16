import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, CheckCircle2, ChevronRight, Send, Briefcase, Zap, Globe, Cpu } from 'lucide-react';
import content from '../data/content.json';

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface FormData {
    // Step 1: Identity
    name: string;
    email: string;
    company: string;
    // Step 2: Vision
    goal: string;
    brandEssence: string[];
    // Step 3: Project
    projectType: string;
    timeline: string;
    budget: string;
    // Step 4: Tech
    currentStack: string;
    integrations: string[];
    details: string;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<FormData>({
        name: '', email: '', company: '',
        goal: '', brandEssence: [],
        projectType: '', timeline: '', budget: '',
        currentStack: '', integrations: [], details: ''
    });

    if (!isOpen) return null;

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    const updateData = (key: keyof FormData, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const toggleArrayItem = (key: keyof FormData, item: string) => {
        setFormData(prev => {
            const arr = prev[key] as string[];
            return {
                ...prev,
                [key]: arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item]
            };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const message = `
*Nuevo Proyecto: ${formData.projectType}*

*Información General:*
- Nombre: ${formData.name}
- Email: ${formData.email}
- Empresa: ${formData.company}

*Visión:*
- Objetivo: ${formData.goal}
- Esencia: ${formData.brandEssence.join(', ')}

*Detalles del Proyecto:*
- Tipo: ${formData.projectType}
- Timeline: ${formData.timeline}
- Presupuesto: ${formData.budget}

*Contexto Técnico:*
- Stack Actual: ${formData.currentStack}
- Integraciones: ${formData.integrations.join(', ')}
- Detalles Adicionales: ${formData.details}
        `.trim();

        const whatsappNumber = content.contact.whatsapp.replace('+', '');
        const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

        window.open(url, '_blank');
        onClose();
    };

    // Step Components
    const renderStep1 = () => (
        <div className="space-y-6">
            <h3 className="text-2xl font-serif font-bold mb-6">Empecemos por ti.</h3>
            <div className="space-y-4">
                <input
                    type="text"
                    placeholder="Tu Nombre"
                    value={formData.name}
                    onChange={e => updateData('name', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white placeholder-stone-500 focus:border-terracotta focus:outline-none transition-colors"
                />
                <input
                    type="email"
                    placeholder="Tu Email"
                    value={formData.email}
                    onChange={e => updateData('email', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white placeholder-stone-500 focus:border-terracotta focus:outline-none transition-colors"
                />
                <input
                    type="text"
                    placeholder="Nombre de tu Marca / Empresa"
                    value={formData.company}
                    onChange={e => updateData('company', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white placeholder-stone-500 focus:border-terracotta focus:outline-none transition-colors"
                />
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-6">
            <h3 className="text-2xl font-serif font-bold mb-4">Tu Visión.</h3>

            <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-widest text-stone-400">Objetivo Principal</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {['Brand Awareness', 'Ventas / Conversión', 'Automatización', 'Lanzamiento Producto'].map(opt => (
                        <button
                            key={opt}
                            onClick={() => updateData('goal', opt)}
                            className={`p-3 rounded-lg border text-left text-sm transition-all ${formData.goal === opt ? 'bg-terracotta border-terracotta text-white' : 'bg-transparent border-white/10 text-stone-400 hover:bg-white/5'}`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-widest text-stone-400">Esencia de Marca</label>
                <div className="flex flex-wrap gap-2">
                    {['Minimalista', 'Disruptivo', 'Lujo', 'Futurista', 'Corporativo', 'Juguetón'].map(opt => (
                        <button
                            key={opt}
                            onClick={() => toggleArrayItem('brandEssence', opt)}
                            className={`px-4 py-2 rounded-full border text-xs transition-all ${formData.brandEssence.includes(opt) ? 'bg-white text-black border-white' : 'bg-transparent border-white/20 text-stone-400 hover:border-white'}`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-6">
            <h3 className="text-2xl font-serif font-bold mb-4">El Proyecto.</h3>

            <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-widest text-stone-400">Tipo de Proyecto</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                        { label: 'Web Development', icon: <Globe size={16} /> },
                        { label: 'Mobile App', icon: <Cpu size={16} /> },
                        { label: 'Branding', icon: <Zap size={16} /> },
                        { label: 'Consultoría', icon: <Briefcase size={16} /> }
                    ].map(opt => (
                        <button
                            key={opt.label}
                            onClick={() => updateData('projectType', opt.label)}
                            className={`p-4 rounded-lg border text-left flex items-center gap-3 transition-all ${formData.projectType === opt.label ? 'bg-terracotta/20 border-terracotta text-terracotta' : 'bg-transparent border-white/10 text-stone-400 hover:bg-white/5'}`}
                        >
                            {opt.icon}
                            <span>{opt.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-stone-500">Timeline</label>
                    <select
                        value={formData.timeline}
                        onChange={e => updateData('timeline', e.target.value)}
                        className="w-full bg-stone-900 border border-white/10 rounded p-2 text-sm text-white focus:outline-none"
                    >
                        <option value="">Selecciona...</option>
                        <option value="ASAP">ASAP (&lt; 1 mes)</option>
                        <option value="1-3 Meses">1-3 Meses</option>
                        <option value="Flexible">Flexible</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-stone-500">Presupuesto</label>
                    <select
                        value={formData.budget}
                        onChange={e => updateData('budget', e.target.value)}
                        className="w-full bg-stone-900 border border-white/10 rounded p-2 text-sm text-white focus:outline-none"
                    >
                        <option value="">Selecciona...</option>
                        <option value="< 1k">&lt; $1k</option>
                        <option value="1k-5k">$1k - $5k</option>
                        <option value="5k-10k">$5k - $10k</option>
                        <option value="+10k">+ $10k</option>
                    </select>
                </div>
            </div>
        </div>
    );

    const renderStep4 = () => (
        <div className="space-y-6">
            <h3 className="text-2xl font-serif font-bold mb-4">Detalles Técnicos.</h3>

            <div className="space-y-4">
                <input
                    type="text"
                    placeholder="Stack Actual (ej: WordPress, Shopify, React...)"
                    value={formData.currentStack}
                    onChange={e => updateData('currentStack', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white placeholder-stone-500 focus:border-terracotta focus:outline-none transition-colors"
                />

                <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-widest text-stone-400">Integraciones Clave</label>
                    <div className="flex flex-wrap gap-2">
                        {['Pasarela de Pagos', 'CRM / Marketing', 'AI / LLMs', 'APIs Externas', 'Auth', 'Database'].map(opt => (
                            <button
                                key={opt}
                                onClick={() => toggleArrayItem('integrations', opt)}
                                className={`px-4 py-2 rounded-full border text-xs transition-all ${formData.integrations.includes(opt) ? 'bg-terracotta border-terracotta text-white' : 'bg-transparent border-white/10 text-stone-400 hover:border-white/30'}`}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>

                <textarea
                    placeholder="Detalles adicionales o requerimientos específicos..."
                    value={formData.details}
                    onChange={e => updateData('details', e.target.value)}
                    className="w-full h-24 bg-white/5 border border-white/10 rounded-lg p-4 text-white placeholder-stone-500 focus:border-terracotta focus:outline-none transition-colors resize-none"
                />
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-stone-950/90 backdrop-blur-xl"
            />

            {/* Modal Container */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative w-full max-w-2xl bg-stone-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex justify-between items-center text-white">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-terracotta animate-pulse"></div>
                        <span className="text-xs font-mono uppercase tracking-widest text-stone-400">Project Configurator</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-xs font-mono text-stone-500">Step {step} / 4</span>
                        <button onClick={onClose} className="hover:text-white text-stone-500 transition-colors"><X size={20} /></button>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1 bg-white/5">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(step / 4) * 100}%` }}
                        className="h-full bg-terracotta"
                    />
                </div>

                {/* Body Content (Scrollable) */}
                <div className="p-6 md:p-10 flex-1 overflow-y-auto text-white">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {step === 1 && renderStep1()}
                            {step === 2 && renderStep2()}
                            {step === 3 && renderStep3()}
                            {step === 4 && renderStep4()}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Footer Controls */}
                <div className="p-6 border-t border-white/5 flex justify-between items-center bg-stone-900 z-10">
                    {step > 1 ? (
                        <button
                            onClick={handleBack}
                            className="flex items-center gap-2 text-stone-400 hover:text-white transition-colors text-sm uppercase tracking-wider font-bold"
                        >
                            <ArrowLeft size={16} /> Atrás
                        </button>
                    ) : (
                        <div></div>
                    )}

                    {step < 4 ? (
                        <button
                            onClick={handleNext}
                            className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-terracotta hover:text-white transition-all shadow-lg hover:shadow-terracotta/20"
                        >
                            Siguiente <ChevronRight size={16} />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            className="flex items-center gap-2 bg-terracotta text-white px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-terracotta/20"
                        >
                            Enviar Solicitud <Send size={16} />
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default ContactModal;
