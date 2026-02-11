import type { Handler, HandlerEvent } from "@netlify/functions";
import { Resend } from "resend";

interface QuestionnaireData {
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

const ADMIN_EMAIL = "hola@alfredomendoza.dev";

// Human-readable labels for each question
const questionLabels: Record<string, { section: string; label: string }> = {
    tiposProductos: {
        section: "Gestión de Productos e Inventario",
        label:
            "¿Manejan productos simples, variables (por tamaño, color, modelo) o kits/combos preconfigurados?",
    },
    controlTrazabilidad: {
        section: "Gestión de Productos e Inventario",
        label:
            "¿Es necesario rastrear números de lote y fechas de vencimiento para los insumos médicos/odontológicos?",
    },
    unidadesMedida: {
        section: "Gestión de Productos e Inventario",
        label:
            "¿Existen productos que se vendan por fracciones (ej. metros de hilo, gramaje) o todos son por unidades cerradas?",
    },
    alertasStock: {
        section: "Gestión de Productos e Inventario",
        label:
            "¿Cuál es el umbral de stock mínimo deseado para recibir notificaciones de reposición por cada categoría?",
    },
    segmentacionClientes: {
        section: "Proceso de Ventas y Pedidos",
        label:
            "¿Habrá una distinción de precios o catálogo entre odontólogos/clínicas (B2B) y pacientes/público general (B2C)?",
    },
    validacionProfesional: {
        section: "Proceso de Ventas y Pedidos",
        label:
            "¿Se requiere que el cliente cargue algún número de colegiado o licencia para comprar ciertos productos restringidos?",
    },
    estadosPedido: {
        section: "Proceso de Ventas y Pedidos",
        label:
            'Además de "Pendiente", "Pagado" y "Enviado", ¿requieren estados intermedios específicos (ej. "En esterilización", "Validando receta", "Listo para pickup")?',
    },
    metodosEntrega: {
        section: "Proceso de Ventas y Pedidos",
        label:
            '¿Se habilitará la opción de "Pick-up" (retiro en tienda)? De ser así, ¿en qué horarios y sedes?',
    },
    documentacionDespacho: {
        section: "Proceso de Ventas y Pedidos",
        label:
            "¿Qué documentos debe generar el sistema automáticamente (Guía de despacho, etiqueta de envío, lista de empaque)?",
    },
};

function buildAdminEmailHtml(data: QuestionnaireData): string {
    const now = new Date().toLocaleString("es-VE", {
        timeZone: "America/Caracas",
    });

    let questionsHtml = "";
    let currentSection = "";

    for (const [key, meta] of Object.entries(questionLabels)) {
        if (meta.section !== currentSection) {
            currentSection = meta.section;
            questionsHtml += `
        <tr>
          <td colspan="2" style="padding: 20px 24px 8px; background: #1a1a1a; border-bottom: 2px solid #c2703e;">
            <h3 style="margin: 0; color: #c2703e; font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">${currentSection}</h3>
          </td>
        </tr>`;
        }
        const answer =
            data.respuestas[key as keyof QuestionnaireData["respuestas"]] ||
            "<em>Sin respuesta</em>";
        questionsHtml += `
      <tr>
        <td style="padding: 16px 24px; border-bottom: 1px solid #2a2a2a;">
          <p style="margin: 0 0 6px; color: #a8a29e; font-size: 13px; font-weight: 600;">${meta.label}</p>
          <p style="margin: 0; color: #ffffff; font-size: 15px; line-height: 1.6;">${answer}</p>
        </td>
      </tr>`;
    }

    return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin: 0; padding: 0; background: #0c0a09; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background: #0c0a09; padding: 40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background: #1c1917; border-radius: 16px; overflow: hidden; border: 1px solid #292524;">
        <!-- Header -->
        <tr>
          <td style="padding: 32px 24px; background: linear-gradient(135deg, #1c1917 0%, #292524 100%); border-bottom: 2px solid #c2703e;">
            <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 700;">📋 Nuevo Cuestionario Recibido</h1>
            <p style="margin: 8px 0 0; color: #a8a29e; font-size: 13px;">${now}</p>
          </td>
        </tr>
        <!-- Client Info -->
        <tr>
          <td style="padding: 24px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background: #292524; border-radius: 12px; overflow: hidden;">
              <tr>
                <td style="padding: 16px 20px; border-bottom: 1px solid #3a3530;">
                  <span style="color: #a8a29e; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Cliente</span>
                  <p style="margin: 4px 0 0; color: #ffffff; font-size: 16px; font-weight: 600;">${data.nombre}</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 16px 20px; border-bottom: 1px solid #3a3530;">
                  <span style="color: #a8a29e; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Email</span>
                  <p style="margin: 4px 0 0; color: #c2703e; font-size: 16px;"><a href="mailto:${data.email}" style="color: #c2703e; text-decoration: none;">${data.email}</a></p>
                </td>
              </tr>
              <tr>
                <td style="padding: 16px 20px;">
                  <span style="color: #a8a29e; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Empresa</span>
                  <p style="margin: 4px 0 0; color: #ffffff; font-size: 16px;">${data.empresa || "No especificada"}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- Answers -->
        ${questionsHtml}
        <!-- Footer -->
        <tr>
          <td style="padding: 24px; background: #0c0a09; text-align: center;">
            <p style="margin: 0; color: #57534e; font-size: 12px;">Alfredo Mendoza — Arquitecto Digital</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function buildClientEmailHtml(data: QuestionnaireData): string {
    return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin: 0; padding: 0; background: #0c0a09; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background: #0c0a09; padding: 40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background: #1c1917; border-radius: 16px; overflow: hidden; border: 1px solid #292524;">
        <!-- Header -->
        <tr>
          <td style="padding: 40px 32px; background: linear-gradient(135deg, #1c1917 0%, #292524 100%); text-align: center; border-bottom: 2px solid #c2703e;">
            <p style="margin: 0 0 8px; color: #c2703e; font-size: 12px; text-transform: uppercase; letter-spacing: 3px;">Arquitecto Digital</p>
            <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 700;">¡Gracias, ${data.nombre}!</h1>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding: 32px;">
            <p style="color: #d6d3d1; font-size: 15px; line-height: 1.8; margin: 0 0 16px;">
              He recibido tu cuestionario correctamente. Estoy revisando tus respuestas para entender a fondo las necesidades de <strong style="color: #ffffff;">${data.empresa || "tu proyecto"}</strong>.
            </p>
            <p style="color: #d6d3d1; font-size: 15px; line-height: 1.8; margin: 0 0 24px;">
              Me pondré en contacto contigo pronto para discutir los próximos pasos y presentarte una propuesta <span style="color: #c2703e; font-weight: 600;">personalizada</span>.
            </p>
            <!-- Summary card -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background: #292524; border-radius: 12px; overflow: hidden; margin-bottom: 24px;">
              <tr>
                <td style="padding: 20px; border-bottom: 1px solid #3a3530;">
                  <span style="color: #c2703e; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; font-weight: 700;">Resumen de tu envío</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 16px 20px;">
                  <p style="margin: 0 0 8px; color: #a8a29e; font-size: 13px;">📧 <strong style="color: #ffffff;">${data.email}</strong></p>
                  <p style="margin: 0 0 8px; color: #a8a29e; font-size: 13px;">🏢 <strong style="color: #ffffff;">${data.empresa || "No especificada"}</strong></p>
                  <p style="margin: 0; color: #a8a29e; font-size: 13px;">📋 <strong style="color: #ffffff;">9 preguntas respondidas</strong></p>
                </td>
              </tr>
            </table>
            <p style="color: #78716c; font-size: 13px; line-height: 1.6; margin: 0;">
              Si tienes alguna pregunta adicional, no dudes en responder directamente a este correo.
            </p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding: 24px 32px; background: #0c0a09; text-align: center; border-top: 1px solid #292524;">
            <p style="margin: 0 0 4px; color: #57534e; font-size: 12px;">Alfredo Mendoza — Arquitecto Digital</p>
            <p style="margin: 0; color: #44403c; font-size: 11px;">alfredomendoza.dev</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

const handler: Handler = async (event: HandlerEvent) => {
    // CORS headers
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Content-Type": "application/json",
    };

    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 200, headers, body: "" };
    }

    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: "Method not allowed" }),
        };
    }

    try {
        const data: QuestionnaireData = JSON.parse(event.body || "{}");

        // Validate required fields
        if (!data.nombre || !data.email) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    error: "Nombre y email son requeridos",
                }),
            };
        }

        const resendApiKey = process.env.RESEND_API_KEY;
        if (!resendApiKey) {
            console.error("RESEND_API_KEY not configured");
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: "Email service not configured" }),
            };
        }

        const resend = new Resend(resendApiKey);

        // Send email to admin
        await resend.emails.send({
            from: "Cuestionario <hola@alfredomendoza.dev>",
            to: [ADMIN_EMAIL],
            subject: `📋 Nuevo Cuestionario — ${data.nombre} (${data.empresa || "Sin empresa"})`,
            html: buildAdminEmailHtml(data),
            replyTo: data.email,
        });

        // Send confirmation email to client
        await resend.emails.send({
            from: "Alfredo Mendoza <hola@alfredomendoza.dev>",
            to: [data.email],
            subject: "✅ Recibimos tu cuestionario — Alfredo Mendoza",
            html: buildClientEmailHtml(data),
            replyTo: ADMIN_EMAIL,
        });

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true }),
        };
    } catch (error) {
        console.error("Error sending questionnaire emails:", error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: "Error al enviar el cuestionario. Inténtalo de nuevo.",
            }),
        };
    }
};

export { handler };
