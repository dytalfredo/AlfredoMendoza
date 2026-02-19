import React, { useState } from 'react';
import { Sparkles, Loader2, Play } from 'lucide-react';
import { AIFormService } from '../services/ai-form-service';
import DynamicFormRenderer from './DynamicFormRenderer';
import type { FormSchema } from '../types/form-types';

interface Props {
    apiKey: string;
}

const GeneratorUI: React.FC<Props> = ({ apiKey }) => {
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [schema, setSchema] = useState<FormSchema | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setIsGenerating(true);
        setError(null);
        try {
            const service = new AIFormService(apiKey);
            const generatedSchema = await service.generateForm(prompt);
            setSchema(generatedSchema);
        } catch (e: any) {
            setError('Error al generar el formulario. Revisa tu API Key o conexión.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-stone-950 text-white p-6 md:p-20">
            <div className="max-w-4xl mx-auto space-y-12">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-terracotta/10 border border-terracotta/20 text-terracotta text-xs font-mono uppercase tracking-widest">
                        <Sparkles size={14} /> AI Powered
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold italic">Generador de Formularios.</h1>
                    <p className="text-stone-400 max-w-xl mx-auto">Describe el negocio o proyecto y la IA diseñará un cuestionario premium con secciones, preguntas y pasarela de pago.</p>
                </div>

                {/* Input Area */}
                <div className="bg-stone-900/50 border border-white/10 rounded-2xl p-6 md:p-10 space-y-6 backdrop-blur-xl">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-stone-500">¿Qué necesitas construir?</label>
                        <textarea
                            value={prompt}
                            onChange={e => setPrompt(e.target.value)}
                            placeholder="Ej: Necesito un formulario para una clínica dental que incluya preguntas sobre su historial médico, seguro y cita previa..."
                            className="w-full h-32 bg-stone-950 border border-white/10 rounded-xl p-4 text-white placeholder-stone-600 focus:border-terracotta focus:outline-none transition-all resize-none shadow-inner"
                        />
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating || !prompt.trim()}
                        className="w-full bg-white text-black hover:bg-terracotta hover:text-white transition-all py-4 rounded-full font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 disabled:opacity-30"
                    >
                        {isGenerating ? <><Loader2 size={18} className="animate-spin" /> Generando Estructura...</> : <><Sparkles size={18} /> Diseñar Formulario con IA</>}
                    </button>
                    {error && <p className="text-red-400 text-center text-xs">{error}</p>}
                </div>

                {/* Preview Area */}
                <AnimatePresence>
                    {schema && (
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                        >
                            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                <h2 className="text-xl font-serif font-bold italic text-stone-300">Vista Previa Registrada: {schema.title}</h2>
                                <div className="flex items-center gap-2 text-xs font-mono text-terracotta">
                                    <Play size={14} /> LIVE PREVIEW
                                </div>
                            </div>
                            <DynamicFormRenderer schema={schema} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default GeneratorUI;
