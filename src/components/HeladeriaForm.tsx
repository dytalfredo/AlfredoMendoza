import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, CheckCircle2, ChevronRight, Send, Home,
    Shield, Loader2, IceCream2, Store, Package, Truck, Globe, CreditCard, DollarSign
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface HeladeriaFormData {
    nombre: string;
    email: string;
    empresa: string;
    telefono: string;
    respuestas: {
        dominioExistente: string;
        opcionesDominio: string;
        ubicacionPrincipal: string;
        sucursalesPlaneadas: string;
        saboresVariedades: string;
        presentacionesFormatos: string;
        gestionStock: string;
        alertasVencimiento: string;
        metodosEntregaActual: string;
        enviosNacionales: string;
        modeloSocios: string;
        sistemaActual: string;
        metodosPagoAceptados: string;
        automatizacion: string;
    };
    extras: {
        convertirApp: boolean;
        verificacionPagos: boolean;
    };
    pago: {
        porcentaje: 100 | 60;
        metodoPago: 'zelle' | 'pagoMovil' | '';
        correoDesdeZelle: string;
        ultimosDigitos: string;
        telefonoDesde: string;
    };
}

type RespuestaKey = keyof HeladeriaFormData['respuestas'];

interface QuestionConfig {
    key: RespuestaKey;
    label: string;
    description: string;
    type?: 'textarea' | 'radio';
    options?: string[];
}

interface SectionConfig {
    title: string;
    icon: React.ReactNode;
    questions: QuestionConfig[];
}

// ─── Sections & Questions ─────────────────────────────────────────────────────

const SECTIONS: SectionConfig[] = [
    {
        title: 'Dominio y Presencia Web',
        icon: <Globe size={16} />,
        questions: [
            {
                key: 'dominioExistente',
                label: '1. ¿Cuentas ya con un dominio web o nombre de marca registrado digitalmente?',
                description: 'Indica si ya posees un dominio (ej. tuheladeria.com) o si necesitas que te ayude a conseguir uno.',
                type: 'radio',
                options: [
                    'Sí, ya tengo un dominio',
                    'No tengo dominio, necesito uno',
                    'Tengo nombre pero aún no el dominio',
                ],
            },
            {
                key: 'opcionesDominio',
                label: '2. ¿Tienes opciones en mente para el nombre de dominio o URL del sistema?',
                description: 'Escribe hasta 3 opciones de dominio que te gusten. Evaluaremos disponibilidad y precios.',
            },
        ],
    },
    {
        title: 'Ubicación y Sucursales',
        icon: <Store size={16} />,
        questions: [
            {
                key: 'ubicacionPrincipal',
                label: '3. ¿Cuál es la ubicación de tu local o tienda principal?',
                description: 'Ciudad, municipio o dirección aproximada. Nos ayuda a configurar zonas de delivery y cobertura.',
            },
            {
                key: 'sucursalesPlaneadas',
                label: '4. ¿Cuántas sucursales o socios franquiciados planeas habilitar a corto o mediano plazo?',
                description: 'Ej: "2 sucursales propias + 3 socios en otras ciudades". Define la escala y complejidad del sistema multi-sede.',
            },
        ],
    },
    {
        title: 'Catálogo de Productos',
        icon: <IceCream2 size={16} />,
        questions: [
            {
                key: 'saboresVariedades',
                label: '5. ¿Cuántos sabores y variedades de helado ofreces actualmente? ¿Rotan por temporada?',
                description: 'Ej: "20 sabores permanentes + 5 de temporada". Esto define cómo gestionaremos el catálogo en el sistema.',
            },
            {
                key: 'presentacionesFormatos',
                label: '6. ¿Qué presentaciones o formatos de venta manejas? (bola, cono, vasito, pote 1L/2L, torta helada, etc.)',
                description: 'Cada presentación puede tener su propio precio. Cuéntanos todos los formatos disponibles.',
            },
        ],
    },
    {
        title: 'Gestión de Stock e Inventario',
        icon: <Package size={16} />,
        questions: [
            {
                key: 'gestionStock',
                label: '7. ¿Cómo manejas actualmente el control de ingredientes, insumos y stock de helados terminados?',
                description: 'Planilla, Excel, aplicación u otro método. Nos ayuda a diseñar el módulo de inventario correcto para tu operación.',
            },
            {
                key: 'alertasVencimiento',
                label: '8. ¿Necesitas alertas de reposición por stock mínimo y/o control de fechas de vencimiento de insumos?',
                description: 'Clave en heladería artesanal. Indica qué tan crítico es para tu negocio el control de insumos.',
                type: 'radio',
                options: [
                    'Sí, necesito ambas (stock mínimo + control de vencimientos)',
                    'Solo alertas de stock mínimo',
                    'Solo control de fechas de vencimiento',
                    'No es prioritario por ahora',
                ],
            },
        ],
    },
    {
        title: 'Métodos de Entrega y Cobertura',
        icon: <Truck size={16} />,
        questions: [
            {
                key: 'metodosEntregaActual',
                label: '9. ¿Qué modalidades de entrega ofreces o planeas ofrecer?',
                description: 'Cada modalidad tiene configuración distinta en el sistema (rutas, tarifas, horarios, zonas).',
                type: 'radio',
                options: [
                    'Solo Pick-up (el cliente retira en tienda)',
                    'Pick-up + Delivery en zonas cercanas',
                    'Pick-up + Delivery + Envíos nacionales',
                    'Solo Delivery local',
                    'Todas las opciones anteriores',
                ],
            },
        ],
    },
    {
        title: 'Envíos Nacionales y Modelo de Socios',
        icon: <Truck size={16} />,
        questions: [
            {
                key: 'enviosNacionales',
                label: '10. Para envíos nacionales: ¿utilizarás empresas de courier (MRW, Zoom, Tealca, etc.)? ¿Quién asume el costo?',
                description: 'Determina la lógica de tarifas de envío en el checkout. Indica si el flete lo paga el cliente o la empresa.',
            },
            {
                key: 'modeloSocios',
                label: '11. ¿Cómo funcionará el modelo de socios o franquicias? ¿Necesitarán acceso propio al sistema?',
                description: 'Describe si son distribuidores, franquicia formal o puntos autorizados, y qué nivel de acceso necesitan (su panel, su stock, sus pedidos, etc.).',
            },
        ],
    },
    {
        title: 'Sistema Actual, Pagos y Automatización',
        icon: <CreditCard size={16} />,
        questions: [
            {
                key: 'sistemaActual',
                label: '12. ¿Usas actualmente alguna plataforma de ventas online o punto de venta físico?',
                description: '¿Hay datos históricos de clientes o pedidos que deban migrarse al nuevo sistema? Cuéntanos tu flujo actual.',
            },
            {
                key: 'metodosPagoAceptados',
                label: '13. ¿Qué métodos de pago aceptas o planeas aceptar? (Efectivo, Pago Móvil, Zelle, Tarjeta, etc.)',
                description: 'Indica si necesitas conversión automática de divisas (Bs/USD) en el checkout y métodos por sucursal.',
            },
            {
                key: 'automatizacion',
                label: '14. ¿Qué procesos te gustaría automatizar? (notificaciones, reportes, sincronización de stock entre sucursales, etc.)',
                description: 'Descríbenos tareas repetitivas o manuales que quisieras que el sistema realice automáticamente. Ayuda a priorizar integraciones.',
            },
        ],
    },
];

// ─── Constants ────────────────────────────────────────────────────────────────

const BASE_PRICE = 350;
const APP_ADDON = 150;

// Steps: 0=identity, 1..7=sections, 8=extras, 9=payment, 10=success
const TOTAL_SECTIONS = SECTIONS.length; // 7
const STEP_EXTRAS = TOTAL_SECTIONS + 1;   // 8
const STEP_PAYMENT = TOTAL_SECTIONS + 2;  // 9
const STEP_SUCCESS = TOTAL_SECTIONS + 3;  // 10
const TOTAL_STEPS = STEP_SUCCESS + 1;     // 11 (for progress bar)

// ─── Component ────────────────────────────────────────────────────────────────

const HeladeriaForm: React.FC = () => {
    const [step, setStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [dolarRate, setDolarRate] = useState<number | null>(null);
    const [loadingRate, setLoadingRate] = useState(false);

    const [formData, setFormData] = useState<HeladeriaFormData>({
        nombre: '',
        email: '',
        empresa: '',
        telefono: '',
        respuestas: {
            dominioExistente: '',
            opcionesDominio: '',
            ubicacionPrincipal: '',
            sucursalesPlaneadas: '',
            saboresVariedades: '',
            presentacionesFormatos: '',
            gestionStock: '',
            alertasVencimiento: '',
            metodosEntregaActual: '',
            enviosNacionales: '',
            modeloSocios: '',
            sistemaActual: '',
            metodosPagoAceptados: '',
            automatizacion: '',
        },
        extras: { convertirApp: false, verificacionPagos: false },
        pago: {
            porcentaje: 100,
            metodoPago: '',
            correoDesdeZelle: '',
            ultimosDigitos: '',
            telefonoDesde: '',
        },
    });

    // Fetch exchange rate from pydolarve API
    useEffect(() => {
        const fetchRate = async () => {
            setLoadingRate(true);
            try {
                const res = await fetch('https://pydolarve.org/api/v1/dollar?page=bcv');
                const json = await res.json();
                const rate = json?.monitors?.usd?.price ?? json?.price ?? null;
                if (rate) setDolarRate(parseFloat(rate));
            } catch {
                // silently fail — bolivar amount will show as unavailable
            } finally {
                setLoadingRate(false);
            }
        };
        fetchRate();
    }, []);

    // Computed values
    const totalUSD = BASE_PRICE + (formData.extras.convertirApp ? APP_ADDON : 0);
    const montoAPagar = totalUSD * (formData.pago.porcentaje / 100);
    const montoBolivares = dolarRate ? montoAPagar * dolarRate : 0;

    const updateField = (key: 'nombre' | 'email' | 'empresa' | 'telefono', value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const updateRespuesta = (key: RespuestaKey, value: string) => {
        setFormData(prev => ({
            ...prev,
            respuestas: { ...prev.respuestas, [key]: value },
        }));
    };

    const updateExtras = (key: keyof HeladeriaFormData['extras'], value: boolean) => {
        setFormData(prev => ({ ...prev, extras: { ...prev.extras, [key]: value } }));
    };

    const updatePago = (key: keyof HeladeriaFormData['pago'], value: any) => {
        setFormData(prev => ({ ...prev, pago: { ...prev.pago, [key]: value } }));
    };

    const canProceedFromIdentity =
        formData.nombre.trim() !== '' &&
        formData.email.trim() !== '' &&
        formData.telefono.trim() !== '';

    const canSubmit = () => {
        if (!formData.pago.metodoPago) return false;
        if (formData.pago.metodoPago === 'zelle') return formData.pago.correoDesdeZelle.trim() !== '';
        if (formData.pago.metodoPago === 'pagoMovil') {
            return formData.pago.ultimosDigitos.trim().length === 6 && formData.pago.telefonoDesde.trim() !== '';
        }
        return false;
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setSubmitError(null);
        try {
            const payload = {
                ...formData,
                pago: {
                    ...formData.pago,
                    tasaDolar: dolarRate ?? 0,
                    montoAPagar,
                    montoBolivares,
                    totalUSD,
                },
            };
            const res = await fetch('/.netlify/functions/send-heladeria', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Error al enviar');
            }
            setStep(STEP_SUCCESS);
        } catch (error: any) {
            setSubmitError(error.message || 'Error inesperado. Inténtalo de nuevo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const progressPercent = Math.min(((step + 1) / TOTAL_STEPS) * 100, 100);
    const isSuccess = step === STEP_SUCCESS;
    const isLastStep = step === STEP_PAYMENT;

    // ─── Step renderers ───────────────────────────────────────────────────────

    const renderIdentity = () => (
        <div className="space-y-6">
            <h3 className="text-2xl font-serif font-bold mb-6">Empecemos por ti.</h3>
            <div className="space-y-4">
                {[
                    { key: 'nombre' as const, placeholder: 'Tu Nombre *', type: 'text' },
                    { key: 'email' as const, placeholder: 'Tu Email *', type: 'email' },
                    { key: 'telefono' as const, placeholder: 'Tu Teléfono / WhatsApp *', type: 'tel' },
                    { key: 'empresa' as const, placeholder: 'Nombre de tu Heladería / Marca', type: 'text' },
                ].map(({ key, placeholder, type }) => (
                    <input
                        key={key}
                        type={type}
                        placeholder={placeholder}
                        value={formData[key]}
                        onChange={e => updateField(key, e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white placeholder-stone-500 focus:border-terracotta focus:outline-none transition-colors"
                    />
                ))}
            </div>
        </div>
    );

    const renderSection = (idx: number) => {
        const section = SECTIONS[idx];
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-terracotta/20 flex items-center justify-center text-terracotta">
                        {section.icon}
                    </div>
                    <h3 className="text-2xl font-serif font-bold">{section.title}</h3>
                </div>
                <div className="space-y-6">
                    {section.questions.map(q => (
                        <div key={q.key} className="space-y-2">
                            <label className="block text-sm font-bold uppercase tracking-widest text-stone-400">
                                {q.label}
                            </label>
                            <p className="text-sm text-stone-300 leading-relaxed">{q.description}</p>
                            {q.type === 'radio' && q.options ? (
                                <div className="space-y-2 mt-2">
                                    {q.options.map(opt => (
                                        <label
                                            key={opt}
                                            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${formData.respuestas[q.key] === opt
                                                ? 'border-terracotta bg-terracotta/10 text-white'
                                                : 'border-white/10 bg-white/5 text-stone-300 hover:border-white/30'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name={q.key}
                                                value={opt}
                                                checked={formData.respuestas[q.key] === opt}
                                                onChange={() => updateRespuesta(q.key, opt)}
                                                className="accent-terracotta"
                                            />
                                            <span className="text-sm">{opt}</span>
                                        </label>
                                    ))}
                                </div>
                            ) : (
                                <textarea
                                    placeholder="Escribe tu respuesta..."
                                    value={formData.respuestas[q.key]}
                                    onChange={e => updateRespuesta(q.key, e.target.value)}
                                    className="w-full h-24 bg-white/5 border border-white/10 rounded-lg p-4 text-white placeholder-stone-500 focus:border-terracotta focus:outline-none transition-colors resize-none text-sm leading-relaxed"
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderExtras = () => (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-terracotta/20 flex items-center justify-center text-terracotta">
                    <Globe size={16} />
                </div>
                <h3 className="text-2xl font-serif font-bold">Funcionalidades Adicionales</h3>
            </div>
            <p className="text-stone-400 text-sm leading-relaxed">
                Selecciona los extras que deseas incluir en tu proyecto:
            </p>

            {[
                {
                    key: 'convertirApp' as const,
                    title: 'App Móvil (Google Play + App Store)',
                    price: `+$${APP_ADDON}`,
                    priceClass: 'text-terracotta',
                    desc: 'Convierte tu sistema web en una aplicación nativa disponible en Android e iOS. Tus clientes podrán descargar la app, hacer pedidos y recibir notificaciones push.',
                },
                {
                    key: 'verificacionPagos' as const,
                    title: 'Verificaciones Automáticas de Pagos',
                    price: 'A negociar',
                    priceClass: 'text-amber-400',
                    desc: 'Sistema automatizado para confirmar pagos sin revisión manual: integración con bancos, validación de comprobantes y actualización automática del estado del pedido.',
                },
            ].map(({ key, title, price, priceClass, desc }) => (
                <label
                    key={key}
                    className={`flex items-start gap-4 p-5 rounded-xl border cursor-pointer transition-all ${formData.extras[key]
                        ? 'border-terracotta bg-terracotta/10'
                        : 'border-white/10 bg-white/5 hover:border-white/30'
                        }`}
                >
                    <input
                        type="checkbox"
                        checked={formData.extras[key]}
                        onChange={e => updateExtras(key, e.target.checked)}
                        className="mt-1 accent-terracotta"
                    />
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <span className="font-bold text-white text-base">{title}</span>
                            <span className={`${priceClass} font-bold text-base ml-4`}>{price}</span>
                        </div>
                        <p className="text-stone-400 text-sm mt-1">{desc}</p>
                    </div>
                </label>
            ))}

            {/* Investment summary */}
            <div className="bg-stone-900 border border-white/10 rounded-xl p-5 space-y-2 mt-2">
                <p className="text-xs uppercase tracking-widest text-stone-500 font-bold">Resumen estimado</p>
                <div className="flex justify-between text-sm text-stone-300">
                    <span>Sistema base (Tienda + Sucursales)</span>
                    <span>${BASE_PRICE}</span>
                </div>
                {formData.extras.convertirApp && (
                    <div className="flex justify-between text-sm text-stone-300">
                        <span>App Móvil (Android + iOS)</span>
                        <span>+${APP_ADDON}</span>
                    </div>
                )}
                {formData.extras.verificacionPagos && (
                    <div className="flex justify-between text-sm text-stone-300">
                        <span>Verificaciones Automáticas de Pagos</span>
                        <span className="text-amber-400">A negociar</span>
                    </div>
                )}
                <div className="border-t border-white/10 pt-2 flex justify-between font-bold text-white">
                    <span>Total estimado</span>
                    <span className="text-terracotta">${totalUSD}</span>
                </div>
            </div>
        </div>
    );

    const renderPayment = () => (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-terracotta/20 flex items-center justify-center text-terracotta">
                    <DollarSign size={16} />
                </div>
                <h3 className="text-2xl font-serif font-bold">Zona de Pago</h3>
            </div>
            <p className="text-stone-400 text-sm leading-relaxed">
                Monto base del proyecto: <strong className="text-white">${BASE_PRICE} USD</strong>
                {formData.extras.convertirApp ? ` + $${APP_ADDON} (app)` : ''}. Elige cuánto abonas ahora:
            </p>

            {/* Porcentaje */}
            <div className="grid grid-cols-2 gap-3">
                {([100, 60] as const).map(pct => (
                    <label
                        key={pct}
                        className={`flex flex-col items-center gap-2 p-5 rounded-xl border cursor-pointer transition-all text-center ${formData.pago.porcentaje === pct
                            ? 'border-terracotta bg-terracotta/10'
                            : 'border-white/10 bg-white/5 hover:border-white/30'
                            }`}
                    >
                        <input
                            type="radio"
                            name="porcentaje"
                            checked={formData.pago.porcentaje === pct}
                            onChange={() => updatePago('porcentaje', pct)}
                            className="hidden"
                        />
                        <span className="text-2xl font-bold text-white">{pct}%</span>
                        <span className="text-terracotta font-bold text-lg">${(totalUSD * pct / 100).toFixed(2)} USD</span>
                        <span className="text-xs text-stone-400">
                            {pct === 100 ? 'Pago completo' : 'Resto al finalizar el proyecto'}
                        </span>
                    </label>
                ))}
            </div>

            {/* Bolivares */}
            <div className="bg-stone-900 border border-amber-500/30 rounded-xl p-5 space-y-1">
                <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-widest text-stone-400">Equivalente en Bolívares</span>
                    {loadingRate && <span className="text-xs text-stone-500 animate-pulse">Cargando tasa...</span>}
                    {dolarRate && !loadingRate && (
                        <span className="text-xs text-stone-500">Tasa BCV: Bs. {dolarRate.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</span>
                    )}
                </div>
                <p className="text-3xl font-bold text-amber-400">
                    {dolarRate
                        ? `Bs. ${montoBolivares.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        : loadingRate ? 'Cargando...' : 'Tasa no disponible'}
                </p>
                <p className="text-xs text-stone-500">
                    Calculado con la tasa promedio del día. El tipo de cambio puede variar al momento del pago.
                </p>
            </div>

            {/* Método de pago */}
            <div>
                <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-3">Método de pago</p>
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { value: 'zelle' as const, label: 'Zelle (USD)' },
                        { value: 'pagoMovil' as const, label: 'Pago Móvil (Bs)' },
                    ].map(m => (
                        <label
                            key={m.value}
                            className={`flex items-center justify-center p-4 rounded-xl border cursor-pointer transition-all text-center font-bold ${formData.pago.metodoPago === m.value
                                ? 'border-terracotta bg-terracotta/10 text-white'
                                : 'border-white/10 bg-white/5 text-stone-300 hover:border-white/30'
                                }`}
                        >
                            <input
                                type="radio"
                                name="metodoPago"
                                checked={formData.pago.metodoPago === m.value}
                                onChange={() => updatePago('metodoPago', m.value)}
                                className="hidden"
                            />
                            {m.label}
                        </label>
                    ))}
                </div>
            </div>

            {/* Zelle details */}
            {formData.pago.metodoPago === 'zelle' && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4"
                >
                    <div className="bg-stone-900 rounded-lg p-4 border border-white/10">
                        <p className="text-xs uppercase tracking-widest text-stone-500 font-bold mb-2">Datos para Zelle</p>
                        <p className="text-white font-semibold">Alfredo Mendoza</p>
                        <p className="text-terracotta">issglobalca@gmail.com</p>
                    </div>
                    <input
                        type="email"
                        placeholder="Tu correo de Zelle desde donde se realizó el pago *"
                        value={formData.pago.correoDesdeZelle}
                        onChange={e => updatePago('correoDesdeZelle', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white placeholder-stone-500 focus:border-terracotta focus:outline-none transition-colors"
                    />
                </motion.div>
            )}

            {/* Pago Móvil details */}
            {formData.pago.metodoPago === 'pagoMovil' && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4"
                >
                    <div className="bg-stone-900 rounded-lg p-4 border border-white/10">
                        <p className="text-xs uppercase tracking-widest text-stone-500 font-bold mb-2">Datos para Pago Móvil</p>
                        <p className="text-white">Banco: <span className="text-terracotta font-semibold">Provincial</span></p>
                        <p className="text-white">Cédula: <span className="text-stone-300">19431163</span></p>
                        <p className="text-white">Teléfono: <span className="text-stone-300">04129157564</span></p>
                    </div>
                    <input
                        type="text"
                        placeholder="Últimos 6 dígitos del pago móvil *"
                        maxLength={6}
                        value={formData.pago.ultimosDigitos}
                        onChange={e => updatePago('ultimosDigitos', e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white placeholder-stone-500 focus:border-terracotta focus:outline-none transition-colors font-mono tracking-[0.3em] text-center text-lg"
                    />
                    <input
                        type="tel"
                        placeholder="Número de teléfono desde donde se hizo el pago *"
                        value={formData.pago.telefonoDesde}
                        onChange={e => updatePago('telefonoDesde', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white placeholder-stone-500 focus:border-terracotta focus:outline-none transition-colors"
                    />
                </motion.div>
            )}
        </div>
    );

    const renderSuccess = () => (
        <div className="text-center space-y-6 py-8">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
                <CheckCircle2 size={64} className="text-terracotta mx-auto" />
            </motion.div>
            <h3 className="text-3xl font-serif font-bold">🍦 ¡Solicitud Enviada!</h3>
            <p className="text-stone-400 text-lg max-w-md mx-auto leading-relaxed">
                Gracias, <span className="text-white font-semibold">{formData.nombre}</span>.
                Hemos recibido tu cuestionario y comprobante de pago. Te enviamos confirmación a{' '}
                <span className="text-terracotta">{formData.email}</span> y te contactaremos muy pronto.
            </p>
            <p className="text-stone-500 text-sm">
                ¡Pronto comenzaremos a construir el sistema digital de tu heladería! 🚀
            </p>
            <a
                href="/"
                className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-terracotta hover:text-white transition-all mt-4"
            >
                <Home size={16} /> Volver al Inicio
            </a>
        </div>
    );

    // ─── Layout ───────────────────────────────────────────────────────────────

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
                            <IceCream2 size={16} className="text-terracotta" />
                            <span className="text-xs font-mono uppercase tracking-widest text-stone-400 hidden sm:block">
                                Heladería Digital
                            </span>
                        </div>
                        <span className="text-xs font-mono text-stone-500">
                            Paso {step + 1} / {TOTAL_STEPS - 1}
                        </span>
                    </div>
                </div>
            )}

            {/* Progress Bar */}
            {!isSuccess && (
                <div className="w-full h-1 bg-white/5">
                    <motion.div
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 0.3 }}
                        className="h-full bg-terracotta"
                    />
                </div>
            )}

            {/* Welcome header (only on step 0) */}
            {!isSuccess && step === 0 && (
                <div className="w-full max-w-4xl mx-auto px-4 pt-12 pb-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center space-y-4"
                    >
                        <span className="text-xs font-mono uppercase tracking-[0.3em] text-terracotta">
                            Arquitecto Digital
                        </span>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold">
                            Sistema para tu{' '}
                            <span className="bg-gradient-to-r from-terracotta via-amber-500 to-terracotta bg-clip-text text-transparent">
                                Heladería
                            </span>
                        </h1>
                        <p className="text-base md:text-lg text-stone-400 max-w-2xl mx-auto leading-relaxed">
                            Responde estas preguntas para que pueda diseñar tu tienda online, gestión de sucursales y delivery{' '}
                            <span className="text-terracotta font-semibold">a la medida de tu negocio</span>.
                        </p>
                    </motion.div>
                </div>
            )}

            {/* Main content */}
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
                            {step >= 1 && step <= TOTAL_SECTIONS && renderSection(step - 1)}
                            {step === STEP_EXTRAS && renderExtras()}
                            {step === STEP_PAYMENT && renderPayment()}
                            {isSuccess && renderSuccess()}
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation */}
                    {!isSuccess && (
                        <div className="mt-8 flex justify-between items-center">
                            {step > 0 ? (
                                <button
                                    onClick={() => setStep(p => p - 1)}
                                    className="flex items-center gap-2 text-stone-400 hover:text-white transition-colors text-sm uppercase tracking-wider font-bold"
                                >
                                    <ArrowLeft size={16} /> Atrás
                                </button>
                            ) : (
                                <div />
                            )}

                            {submitError && (
                                <p className="text-red-400 text-xs text-center flex-1 mx-4">{submitError}</p>
                            )}

                            {!isLastStep ? (
                                <button
                                    onClick={() => setStep(p => p + 1)}
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
                                        disabled={isSubmitting || !canSubmit()}
                                        className="flex items-center gap-2 bg-terracotta text-white px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-terracotta/20 disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? (
                                            <><Loader2 size={16} className="animate-spin" /> Enviando...</>
                                        ) : (
                                            <>Confirmar Pedido <Send size={16} /></>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
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

export default HeladeriaForm;
