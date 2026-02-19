import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import {
    ArrowLeft, CheckCircle2, ChevronRight, Send, Home,
    Shield, Loader2, DollarSign
} from 'lucide-react';
import type { FormSchema } from '../types/form-types';

interface Props {
    schema: FormSchema;
    onSuccess?: () => void;
}

const DynamicFormRenderer: React.FC<Props> = ({ schema, onSuccess }) => {
    const [step, setStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [dolarRate, setDolarRate] = useState<number | null>(null);
    const [loadingRate, setLoadingRate] = useState(false);

    // Dynamic State initialization
    const [formData, setFormData] = useState<any>(() => {
        const initialRespuestas: any = {};
        schema.sections.forEach(s => s.questions.forEach(q => { initialRespuestas[q.id] = ''; }));

        const initialExtras: any = {};
        schema.extras?.forEach(e => { initialExtras[e.id] = false; });

        return {
            nombre: '',
            email: '',
            empresa: '',
            telefono: '',
            respuestas: initialRespuestas,
            extras: initialExtras,
            pago: {
                porcentaje: 100,
                metodoPago: '',
                respuestas: {}, // Payment method specific fields
            }
        };
    });

    useEffect(() => {
        const fetchRate = async () => {
            setLoadingRate(true);
            try {
                const res = await fetch('https://pydolarve.org/api/v1/dollar?page=bcv');
                const json = await res.json();
                const rate = json?.monitors?.usd?.price ?? json?.price ?? null;
                if (rate) setDolarRate(parseFloat(rate));
            } catch { /* Fail silently */ } finally { setLoadingRate(false); }
        };
        fetchRate();
    }, []);

    const totalUSD = schema.basePrice + (schema.extras?.reduce((acc, e) => acc + (formData.extras[e.id] ? e.price : 0), 0) || 0);
    const montoAPagar = totalUSD * (formData.pago.porcentaje / 100);
    const montoBolivares = dolarRate ? montoAPagar * dolarRate : 0;

    const updateField = (key: string, value: any) => setFormData((p: any) => ({ ...p, [key]: value }));
    const updateRespuesta = (id: string, value: string) => setFormData((p: any) => ({ ...p, respuestas: { ...p.respuestas, [id]: value } }));
    const updateExtra = (id: string, value: boolean) => setFormData((p: any) => ({ ...p, extras: { ...p.extras, [id]: value } }));
    const updatePagoField = (id: string, value: any) => setFormData((p: any) => ({ ...p, pago: { ...p.pago, respuestas: { ...p.pago.respuestas, [id]: value } } }));

    const TOTAL_SECTIONS = schema.sections.length;
    const STEP_EXTRAS = TOTAL_SECTIONS + 1;
    const STEP_PAYMENT = TOTAL_SECTIONS + 2;
    const STEP_SUCCESS = TOTAL_SECTIONS + 3;
    const TOTAL_STEPS = schema.extras && schema.extras.length > 0 ? STEP_SUCCESS + 1 : STEP_SUCCESS;

    const Icon = (name: string) => {
        const LucideIcon = (LucideIcons as any)[name] || LucideIcons.HelpCircle;
        return <LucideIcon size={16} />;
    };

    const renderIdentity = () => (
        <div className="space-y-6">
            <h3 className="text-2xl font-serif font-bold mb-6">Empecemos por ti.</h3>
            <div className="space-y-4">
                <input type="text" placeholder="Tu Nombre *" value={formData.nombre} onChange={e => updateField('nombre', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white placeholder-stone-500 focus:border-terracotta focus:outline-none transition-colors" />
                <input type="email" placeholder="Tu Email *" value={formData.email} onChange={e => updateField('email', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white placeholder-stone-500 focus:border-terracotta focus:outline-none transition-colors" />
                <input type="tel" placeholder="Tu Teléfono / WhatsApp *" value={formData.telefono} onChange={e => updateField('telefono', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white placeholder-stone-500 focus:border-terracotta focus:outline-none transition-colors" />
                <input type="text" placeholder="Nombre de tu Empresa / Marca" value={formData.empresa} onChange={e => updateField('empresa', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white placeholder-stone-500 focus:border-terracotta focus:outline-none transition-colors" />
            </div>
        </div>
    );

    const renderSection = (idx: number) => {
        const section = schema.sections[idx];
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-terracotta/20 flex items-center justify-center text-terracotta">
                        {section.icon ? Icon(section.icon) : <LucideIcons.HelpCircle size={16} />}
                    </div>
                    <h3 className="text-2xl font-serif font-bold">{section.title}</h3>
                </div>
                <div className="space-y-6">
                    {section.questions.map(q => (
                        <div key={q.id} className="space-y-2">
                            <label className="block text-sm font-bold uppercase tracking-widest text-stone-400">{q.label}</label>
                            {q.description && <p className="text-sm text-stone-300 leading-relaxed">{q.description}</p>}
                            {q.type === 'radio' && q.options ? (
                                <div className="space-y-2 mt-2">
                                    {q.options.map(opt => (
                                        <label key={opt} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${formData.respuestas[q.id] === opt ? 'border-terracotta bg-terracotta/10 text-white' : 'border-white/10 bg-white/5 text-stone-300 hover:border-white/30'}`}>
                                            <input type="radio" checked={formData.respuestas[q.id] === opt} onChange={() => updateRespuesta(q.id, opt)} className="accent-terracotta" />
                                            <span className="text-sm">{opt}</span>
                                        </label>
                                    ))}
                                </div>
                            ) : (
                                <textarea placeholder={q.placeholder || "Escribe tu respuesta..."} value={formData.respuestas[q.id]} onChange={e => updateRespuesta(q.id, e.target.value)} className="w-full h-24 bg-white/5 border border-white/10 rounded-lg p-4 text-white placeholder-stone-500 focus:border-terracotta focus:outline-none transition-colors resize-none text-sm leading-relaxed" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderExtras = () => (
        <div className="space-y-6">
            <h3 className="text-2xl font-serif font-bold">Extras y Complementos</h3>
            {schema.extras?.map(e => (
                <label key={e.id} className={`flex items-start gap-4 p-5 rounded-xl border cursor-pointer transition-all ${formData.extras[e.id] ? 'border-terracotta bg-terracotta/10' : 'border-white/10 bg-white/5 hover:border-white/30'}`}>
                    <input type="checkbox" checked={formData.extras[e.id]} onChange={ev => updateExtra(e.id, ev.target.checked)} className="mt-1 accent-terracotta" />
                    <div className="flex-1">
                        <div className="flex justify-between font-bold text-white"><span>{e.title}</span><span className={e.negotiable ? "text-amber-400" : "text-terracotta"}>{e.negotiable ? 'A negociar' : `+$${e.price}`}</span></div>
                        <p className="text-stone-400 text-sm mt-1">{e.description}</p>
                    </div>
                </label>
            ))}
        </div>
    );

    const renderPayment = () => {
        const selectedMethod = schema.paymentMethods.find(m => m.id === formData.pago.metodoPago);
        return (
            <div className="space-y-6">
                <h3 className="text-2xl font-serif font-bold">Información de Pago</h3>
                <div className="grid grid-cols-2 gap-3">
                    {([100, 60] as const).map(pct => (
                        <label key={pct} className={`flex flex-col items-center gap-2 p-5 rounded-xl border cursor-pointer transition-all ${formData.pago.porcentaje === pct ? 'border-terracotta bg-terracotta/10' : 'border-white/10 bg-white/5 hover:border-white/30'}`}>
                            <input type="radio" checked={formData.pago.porcentaje === pct} onChange={() => setFormData((p: any) => ({ ...p, pago: { ...p.pago, porcentaje: pct } }))} className="hidden" />
                            <span className="text-2xl font-bold text-white">{pct}%</span>
                            <span className="text-terracotta font-bold text-lg">${(totalUSD * pct / 100).toFixed(2)}</span>
                        </label>
                    ))}
                </div>
                <div className="bg-stone-900 p-5 rounded-xl border border-amber-500/30">
                    <p className="text-3xl font-bold text-amber-400">{dolarRate ? `Bs. ${montoBolivares.toLocaleString('es-VE', { minimumFractionDigits: 2 })}` : 'Cargando tasa...'}</p>
                </div>
                <div className="flex gap-3">
                    {schema.paymentMethods.map(m => (
                        <label key={m.id} className={`flex-1 flex items-center justify-center p-4 rounded-xl border cursor-pointer transition-all font-bold ${formData.pago.metodoPago === m.id ? 'border-terracotta bg-terracotta/10 text-white' : 'border-white/10 bg-white/5 text-stone-300'}`}>
                            <input type="radio" checked={formData.pago.metodoPago === m.id} onChange={() => setFormData((p: any) => ({ ...p, pago: { ...p.pago, metodoPago: m.id, respuestas: {} } }))} className="hidden" />
                            {m.label}
                        </label>
                    ))}
                </div>
                {selectedMethod && (
                    <div className="bg-white/5 p-5 rounded-xl border border-white/10 space-y-4">
                        <div className="bg-stone-900 p-4 rounded-lg border border-white/10">
                            {selectedMethod.details.map((line, i) => <p key={i} className={`text-sm ${i === 0 ? 'text-stone-500 font-bold uppercase tracking-wider' : 'text-stone-300'}`}>{line}</p>)}
                        </div>
                        {selectedMethod.fields.map(f => (
                            <input key={f.id} type={f.type} placeholder={f.placeholder} value={formData.pago.respuestas[f.id] || ''} onChange={e => updatePagoField(f.id, e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white placeholder-stone-500 focus:border-terracotta outline-none" />
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const res = await fetch('/.netlify/functions/send-dynamic-form', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, schemaId: schema.id, totalUSD, montoAPagar, montoBolivares, dolarRate })
            });
            if (!res.ok) throw new Error('Error al enviar');
            setStep(STEP_SUCCESS);
            onSuccess?.();
        } catch (e: any) { setSubmitError(e.message); } finally { setIsSubmitting(false); }
    };

    if (step === STEP_SUCCESS) return (
        <div className="text-center space-y-6 py-8">
            <CheckCircle2 size={64} className="text-terracotta mx-auto" />
            <h3 className="text-3xl font-serif font-bold">¡Solicitud Enviada!</h3>
            <p className="text-stone-400">Gracias, hemos recibido tu cuestionario.</p>
            <button onClick={() => window.location.href = '/'} className="bg-white text-black px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs">Volver</button>
        </div>
    );

    return (
        <div className="w-full">
            <div className="bg-stone-900 border border-white/10 rounded-2xl shadow-2xl p-8 md:p-12 overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div key={step} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} transition={{ duration: 0.2 }}>
                        {step === 0 && renderIdentity()}
                        {step >= 1 && step <= TOTAL_SECTIONS && renderSection(step - 1)}
                        {step === STEP_EXTRAS && renderExtras()}
                        {step === STEP_PAYMENT && renderPayment()}
                    </motion.div>
                </AnimatePresence>

                <div className="mt-8 flex justify-between items-center border-t border-white/5 pt-8">
                    {step > 0 ? (
                        <button onClick={() => setStep(p => p - 1)} className="text-stone-400 hover:text-white flex items-center gap-2 font-bold uppercase text-xs tracking-widest transition-colors"><ArrowLeft size={16} /> Atrás</button>
                    ) : <div />}
                    <div className="flex flex-col items-end gap-3">
                        {step === STEP_PAYMENT ? (
                            <button onClick={handleSubmit} disabled={isSubmitting} className="bg-terracotta text-white px-8 py-3 rounded-full font-bold uppercase text-xs tracking-widest flex items-center gap-2 transition-all hover:brightness-110 disabled:opacity-50">
                                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <>Confirmar <Send size={16} /></>}
                            </button>
                        ) : (
                            <button onClick={() => setStep(p => p + 1)} className="bg-white text-black px-8 py-3 rounded-full font-bold uppercase text-xs tracking-widest flex items-center gap-2 transition-all hover:bg-terracotta hover:text-white">
                                Siguiente <ChevronRight size={16} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DynamicFormRenderer;
