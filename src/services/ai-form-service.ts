import { GoogleGenerativeAI } from "@google/generative-ai";
import type { FormSchema } from "../types/form-types";

export class AIFormService {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor(apiKey: string) {
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: {
                responseMimeType: "application/json",
            }
        });
    }

    async generateForm(prompt: string): Promise<FormSchema> {
        const fullPrompt = `
            Eres un experto Arquitecto Digital y Diseñador de UX/UI. 
            Tu objetivo es generar un esquema de formulario JSON para un cliente basado en su necesidad: "${prompt}".

            El formulario debe seguir este esquema exacto:
            {
                "id": "string único",
                "title": "Título atractivo",
                "subtitle": "Subtítulo descriptivo",
                "basePrice": número estimado en USD,
                "currency": "USD",
                "sections": [
                    {
                        "id": "seccion_1",
                        "title": "Nombre de la sección",
                        "icon": "nombre de icono Lucide (ej: IceCream2, Store, Truck, Globe, CreditCard)",
                        "questions": [
                            {
                                "id": "q1",
                                "label": "La pregunta clara",
                                "description": "Breve explicación de por qué es importante",
                                "type": "textarea" | "radio" | "text" | "email" | "tel",
                                "options": ["opcion 1", "opcion 2"] (solo si es radio),
                                "required": true
                            }
                        ]
                    }
                ],
                "extras": [
                    {
                        "id": "extra1",
                        "title": "Nombre del extra",
                        "description": "Qué incluye",
                        "price": precio en USD,
                        "negotiable": boolean
                    }
                ],
                "paymentMethods": [
                    {
                        "id": "zelle",
                        "label": "Zelle (USD)",
                        "details": ["DATOS PARA ZELLE", "Nombre: Alfredo Mendoza", "Email: issglobalca@gmail.com"],
                        "fields": [
                            { "id": "correoZelle", "label": "Tu correo de Zelle", "type": "email", "placeholder": "ejemplo@correo.com" }
                        ]
                    },
                    {
                        "id": "pagoMovil",
                        "label": "Pago Móvil (Bs)",
                        "details": ["DATOS PARA PAGO MÓVIL", "Banco: Provincial", "Cédula: 19431163", "Teléfono: 04129157564"],
                        "fields": [
                            { "id": "ultimos6", "label": "Últimos 6 dígitos", "type": "text", "placeholder": "123456", "maxLength": 6 },
                            { "id": "telefonoDesde", "label": "Teléfono desde donde pagaste", "type": "tel", "placeholder": "0412..." }
                        ]
                    }
                ]
            }

            Reglas:
            1. Genera entre 4 y 7 secciones con 2-3 preguntas cada una.
            2. El tono debe ser profesional y consultivo.
            3. Usa iconos de Lucide-React realistas.
            4. El basePrice suele rondar los $300-$600 dependiendo de la complejidad.
            5. Responde SOLO con el JSON.
        `;

        const result = await this.model.generateContent(fullPrompt);
        const response = await result.response;
        return JSON.parse(response.text()) as FormSchema;
    }
}
