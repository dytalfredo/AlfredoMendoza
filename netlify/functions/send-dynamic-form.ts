import type { Handler, HandlerEvent } from "@netlify/functions";
import { Resend } from "resend";

interface DynamicFormData {
    nombre: string;
    email: string;
    empresa: string;
    telefono: string;
    respuestas: Record<string, string>;
    extras: Record<string, boolean>;
    pago: {
        porcentaje: number;
        metodoPago: string;
        respuestas: Record<string, string>;
    };
    schemaId: string;
    totalUSD: number;
    montoAPagar: number;
    montoBolivares: number;
    dolarRate: number;
}

const ADMIN_EMAIL = "hola@alfredomendoza.dev";

function buildAdminEmailHtml(data: DynamicFormData): string {
    const now = new Date().toLocaleString("es-VE", { timeZone: "America/Caracas" });

    let respuestasHtml = "";
    for (const [key, value] of Object.entries(data.respuestas)) {
        respuestasHtml += `
            <div style="margin-bottom: 20px; border-bottom: 1px solid #2a2a2a; padding-bottom: 10px;">
                <p style="margin: 0; color: #a8a29e; font-size: 11px; text-transform: uppercase;">ID: ${key}</p>
                <p style="margin: 4px 0; color: #ffffff; font-size: 15px; line-height: 1.6;">${value || "<em>Sin respuesta</em>"}</p>
            </div>
        `;
    }

    let extrasHtml = "";
    for (const [key, selected] of Object.entries(data.extras)) {
        if (selected) {
            extrasHtml += `<li style="color: #ffffff; font-size: 14px; margin-bottom: 4px;">✅ ${key}</li>`;
        }
    }

    let pagoDetalles = "";
    for (const [key, val] of Object.entries(data.pago.respuestas)) {
        pagoDetalles += `<p style="margin: 4px 0; color: #ffffff; font-size: 14px;"><strong>${key}:</strong> ${val}</p>`;
    }

    return `<!DOCTYPE html>
<html>
<body style="background: #0c0a09; color: #ffffff; font-family: sans-serif; padding: 40px 20px;">
    <div style="max-width: 600px; margin: 0 auto; background: #1c1917; border-radius: 16px; border: 1px solid #292524; overflow: hidden;">
        <div style="padding: 32px; background: #c2703e;">
            <h1 style="margin: 0; font-size: 22px;">📋 Nuevo Formulario Dinámico</h1>
            <p style="margin: 4px 0 0; opacity: 0.8; font-size: 13px;">Schema: ${data.schemaId} | ${now}</p>
        </div>
        <div style="padding: 32px;">
            <h3 style="color: #c2703e; text-transform: uppercase; letter-spacing: 1px; font-size: 12px;">Datos del Cliente</h3>
            <p><strong>Nombre:</strong> ${data.nombre}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Teléfono:</strong> ${data.telefono}</p>
            <p><strong>Empresa:</strong> ${data.empresa || "N/A"}</p>

            <h3 style="color: #c2703e; text-transform: uppercase; letter-spacing: 1px; font-size: 12px; margin-top: 32px;">Respuestas</h3>
            ${respuestasHtml}

            ${extrasHtml ? `<h3 style="color: #c2703e; text-transform: uppercase; letter-spacing: 1px; font-size: 12px; margin-top: 32px;">Extras</h3><ul>${extrasHtml}</ul>` : ""}

            <h3 style="color: #c2703e; text-transform: uppercase; letter-spacing: 1px; font-size: 12px; margin-top: 32px;">Información de Pago</h3>
            <p style="font-size: 20px; color: #c2703e; font-weight: bold;">$${data.montoAPagar.toFixed(2)} USD (${data.pago.porcentaje}%)</p>
            <p style="color: #f59e0b;">Bs. ${data.montoBolivares.toLocaleString("es-VE", { minimumFractionDigits: 2 })}</p>
            <p><strong>Método:</strong> ${data.pago.metodoPago}</p>
            ${pagoDetalles}
        </div>
    </div>
</body>
</html>`;
}

export const handler: Handler = async (event: HandlerEvent) => {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Content-Type": "application/json",
    };

    if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };

    try {
        const data: DynamicFormData = JSON.parse(event.body || "{}");
        const resendApiKey = process.env.RESEND_API_KEY;
        if (!resendApiKey) throw new Error("RESEND_API_KEY missing");

        const resend = new Resend(resendApiKey);

        await resend.emails.send({
            from: "Dynamic Form <hola@alfredomendoza.dev>",
            to: [ADMIN_EMAIL],
            subject: `📋 Form Dinámico — ${data.nombre} (${data.schemaId})`,
            html: buildAdminEmailHtml(data),
            replyTo: data.email,
        });

        return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
    } catch (error: any) {
        return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
    }
};
