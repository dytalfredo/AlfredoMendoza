import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle2, ChevronRight, Send, Home, Shield, Loader2, Package, ShoppingCart } from 'lucide-react';

interface QuestionnaireFormData {
    nombre: string;
    email: string;
    empresa: string;
    respuestas: {
        tiposProductos: string;
        controlTrazabilidad: string;
        unidadesMedida: string;
        alertasStock: string;
        segmentacionClientes: string;
        validacionProfesional: string;
        estadosPedido: string;
        metodosEntrega: string;
        documentacionDespacho: string;
    };
}

type RespuestaKey = keyof QuestionnaireFormData['respuestas'];

interface QuestionConfig {
    key: RespuestaKey;
    label: string;
    placeholder: string;
}

const sections: { title: string; icon: React.ReactNode; questions: QuestionConfig[] }[] = [
    {
        title: 'Gestión de Productos e Inventario',
        icon: <Package size={16} />,
        questions: [
            {
                key: 'tiposProductos',
                label: 'Tipos de productos',
                placeholder: '¿Manejan productos simples, variables (por tamaño, color, modelo) o kits/combos preconfigurados?'
            },
            {
                key: 'controlTrazabilidad',
                label: 'Control de trazabilidad',
                placeholder: '¿Es necesario rastrear números de lote y fechas de vencimiento para los insumos médicos/odontológicos?'
            },
            {
                key: 'unidadesMedida',
                label: 'Unidades de medida',
                placeholder: '¿Existen productos que se vendan por fracciones (ej. metros de hilo, gramaje) o todos son por unidades cerradas?'
            },
            {
                key: 'alertasStock',
                label: 'Alertas de stock',
                placeholder: '¿Cuál es el umbral de stock mínimo deseado para recibir notificaciones de reposición por cada categoría?'
            }
        ]
    },
    {
        title: 'Proceso de Ventas y Pedidos',
        icon: <ShoppingCart size={16} />,
        questions: [
            {
                key: 'segmentacionClientes',
                label: 'Segmentación de clientes',
                placeholder: '¿Habrá una distinción de precios o catálogo entre odontólogos/clínicas (B2B) y pacientes/público general (B2C)?'
            },
            {
                key: 'validacionProfesional',
                label: 'Validación profesional',
                placeholder: '¿Se requiere que el cliente cargue algún número de colegiado o licencia para comprar ciertos productos restringidos?'
            },
            {
                key: 'estadosPedido',
                label: 'Estados del pedido',
                placeholder: 'Además de "Pendiente", "Pagado" y "Enviado", ¿requieren estados intermedios específicos (ej. "En esterilización", "Validando receta", "Listo para pickup")?'
            },
            {
                key: 'metodosEntrega',
                label: 'Métodos de entrega',
                placeholder: '¿Se habilitará la opción de "Pick-up" (retiro en tienda)? De ser así, ¿en qué horarios y sedes?'
            },
            {
                key: 'documentacionDespacho',
                label: 'Documentación de despacho',
                placeholder: '¿Qué documentos debe generar el sistema automáticamente (Guía de despacho, etiqueta de envío, lista de empaque)?'
            }
        ]
    }
];

const totalSteps = sections.length + 2; // identity + sections + success

const QuestionnaireForm: React.FC = () => {
    const [step, setStep] = useState(0); // 0 = identity, 1..N = sections, N+1 = success
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const [formData, setFormData] = useState<QuestionnaireFormData>({
        nombre: '',
        email: '',
        empresa: '',
        respuestas: {
            tiposProductos: '',
            controlTrazabilidad: '',
            unidadesMedida: '',
            alertasStock: '',
            segmentacionClientes: '',
            validacionProfesional: '',
            estadosPedido: '',
            metodosEntrega: '',
            documentacionDespacho: '',
        }
    });

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    const updateField = (key: 'nombre' | 'email' | 'empresa', value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const updateRespuesta = (key: RespuestaKey, value: string) => {
        setFormData(prev => ({
            ...prev,
            respuestas: { ...prev.respuestas, [key]: value }
        }));
    };

    const canProceedFromIdentity = formData.nombre.trim() !== '' && formData.email.trim() !== '';

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const res = await fetch('/.netlify/functions/send-questionnaire', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Error al enviar');
            }

            setStep(sections.length + 1); // Go to success screen
        } catch (error: any) {
            setSubmitError(error.message || 'Error inesperado. Inténtalo de nuevo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const progressPercent = Math.min(((step + 1) / totalSteps) * 100, 100);

    // --- RENDER IDENTITY STEP ---
    const renderIdentity = () => (
        <div className="space-y-6">
            <h3 className="text-2xl font-serif font-bold mb-6">Empecemos por ti.</h3>
            <div className="space-y-4">
                <input
                    type="text"
                    placeholder="Tu Nombre *"
                    value={formData.nombre}
                    onChange={e => updateField('nombre', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white placeholder-stone-500 focus:border-terracotta focus:outline-none transition-colors"
                />
                <input
                    type="email"
                    placeholder="Tu Email *"
                    value={formData.email}
                    onChange={e => updateField('email', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white placeholder-stone-500 focus:border-terracotta focus:outline-none transition-colors"
                />
                <input
                    type="text"
                    placeholder="Nombre de tu Empresa / Marca"
                    value={formData.empresa}
                    onChange={e => updateField('empresa', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white placeholder-stone-500 focus:border-terracotta focus:outline-none transition-colors"
                />
            </div>
        </div>
    );

    // --- RENDER SECTION STEP ---
    const renderSection = (sectionIndex: number) => {
        const section = sections[sectionIndex];
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-terracotta/20 flex items-center justify-center text-terracotta">
                        {section.icon}
                    </div>
                    <h3 className="text-2xl font-serif font-bold">{section.title}</h3>
                </div>
                <div className="space-y-5">
                    {section.questions.map(q => (
                        <div key={q.key} className="space-y-2">
                            <label className="text-sm font-bold uppercase tracking-widest text-stone-400">
                                {q.label}
                            </label>
                            <p className="text-sm text-stone-300 leading-relaxed">
                                {q.placeholder}
                            </p>
                            <textarea
                                placeholder="Escribe tu respuesta..."
                                value={formData.respuestas[q.key]}
                                onChange={e => updateRespuesta(q.key, e.target.value)}
                                className="w-full h-24 bg-white/5 border border-white/10 rounded-lg p-4 text-white placeholder-stone-500 focus:border-terracotta focus:outline-none transition-colors resize-none text-sm leading-relaxed"
                            />
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // --- RENDER SUCCESS ---
    const renderSuccess = () => (
        <div className="text-center space-y-6 py-8">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
                <CheckCircle2 size={64} className="text-terracotta mx-auto" />
            </motion.div>
            <h3 className="text-3xl font-serif font-bold">¡Cuestionario Enviado!</h3>
            <p className="text-stone-400 text-lg max-w-md mx-auto leading-relaxed">
                Gracias, <span className="text-white font-semibold">{formData.nombre}</span>.
                Hemos enviado una confirmación a <span className="text-terracotta">{formData.email}</span>.
            </p>
            <p className="text-stone-500 text-sm">
                Me pondré en contacto contigo pronto para discutir tu proyecto.
            </p>
            <a
                href="/"
                className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-terracotta hover:text-white transition-all mt-4"
            >
                <Home size={16} /> Volver al Inicio
            </a>
        </div>
    );

    const isLastSection = step === sections.length;
    const isSuccess = step === sections.length + 1;

    return (
        <div className="min-h-screen w-full bg-stone-950 text-white flex flex-col">
            {/* Header */}
            {!isSuccess && (
                <div className="w-full border-b border-white/5 bg-stone-900/50 backdrop-blur-xl sticky top-0 z-50">
                    <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
                        <a
                            href="/"
                            className="flex items-center gap-2 text-stone-400 hover:text-white transition-colors text-sm uppercase tracking-wider font-bold group"
                        >
                            <Home size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Volver
                        </a>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-terracotta animate-pulse"></div>
                            <span className="text-xs font-mono uppercase tracking-widest text-stone-400">Cuestionario</span>
                        </div>
                        <span className="text-xs font-mono text-stone-500">
                            Paso {step + 1} / {totalSteps - 1}
                        </span>
                    </div>
                </div>
            )}

            {/* Progress Bar */}
            {!isSuccess && (
                <div className="w-full h-1 bg-white/5">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        className="h-full bg-terracotta"
                    />
                </div>
            )}

            {/* Welcome Section */}
            {!isSuccess && (
                <div className="w-full max-w-4xl mx-auto px-4 pt-12 pb-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center space-y-4"
                    >
                        <div className="inline-block">
                            <span className="text-xs font-mono uppercase tracking-[0.3em] text-terracotta">
                                Arquitecto Digital
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold">
                            Cuestionario de{' '}
                            <span className="bg-gradient-to-r from-terracotta via-amber-500 to-terracotta bg-clip-text text-transparent">
                                Proyecto
                            </span>
                        </h1>
                        <p className="text-base md:text-lg text-stone-400 max-w-2xl mx-auto leading-relaxed">
                            Responde estas preguntas para que pueda entender a fondo las necesidades de tu negocio.
                            Cada respuesta me ayuda a diseñar una solución{' '}
                            <span className="text-terracotta font-semibold">a tu medida</span>.
                        </p>
                    </motion.div>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center py-6 px-4">
                <div className="w-full max-w-2xl">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className={isSuccess ? '' : 'bg-stone-900 border border-white/10 rounded-2xl shadow-2xl p-8 md:p-12'}
                        >
                            {step === 0 && renderIdentity()}
                            {step > 0 && step <= sections.length && renderSection(step - 1)}
                            {isSuccess && renderSuccess()}
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Controls */}
                    {!isSuccess && (
                        <div className="mt-8 flex justify-between items-center">
                            {step > 0 ? (
                                <button
                                    onClick={handleBack}
                                    className="flex items-center gap-2 text-stone-400 hover:text-white transition-colors text-sm uppercase tracking-wider font-bold"
                                >
                                    <ArrowLeft size={16} /> Atrás
                                </button>
                            ) : (
                                <div></div>
                            )}

                            {/* Error message */}
                            {submitError && (
                                <p className="text-red-400 text-xs text-center flex-1 mx-4">{submitError}</p>
                            )}

                            {!isLastSection ? (
                                <button
                                    onClick={handleNext}
                                    disabled={step === 0 && !canProceedFromIdentity}
                                    className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-terracotta hover:text-white transition-all shadow-lg hover:shadow-terracotta/20 disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    Siguiente <ChevronRight size={16} />
                                </button>
                            ) : (
                                <div className="flex flex-col items-end gap-3">
                                    <div className="flex items-center gap-2 text-xs text-stone-500">
                                        <Shield size={14} className="text-terracotta" />
                                        <span>Tus datos están protegidos.</span>
                                    </div>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        className="flex items-center gap-2 bg-terracotta text-white px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-terracotta/20 disabled:opacity-60"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 size={16} className="animate-spin" /> Enviando...
                                            </>
                                        ) : (
                                            <>
                                                Enviar Cuestionario <Send size={16} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Note */}
            {!isSuccess && (
                <div className="w-full border-t border-white/5 bg-stone-900/30 py-8">
                    <div className="max-w-2xl mx-auto px-4 text-center">
                        <p className="text-xs text-stone-500">
                            Todos tus datos son tratados con{' '}
                            <span className="text-stone-400 font-semibold">máxima confidencialidad</span>.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuestionnaireForm;
