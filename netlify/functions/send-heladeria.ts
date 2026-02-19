import type { Handler, HandlerEvent } from "@netlify/functions";
import { Resend } from "resend";

interface HeladeriaData {
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
    zonasCoberturaDelivery: string;
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
    porcentaje: number;
    tasaDolar: number;
    montoAPagar: number;
    montoBolivares: number;
    totalUSD: number;
    metodoPago: "zelle" | "pagoMovil" | "";
    correoDesdeZelle: string;
    ultimosDigitos: string;
    telefonoDesde: string;
  };
}

const ADMIN_EMAIL = "hola@alfredomendoza.dev";

// Human-readable labels for each question
const questionLabels: Record<keyof HeladeriaData["respuestas"], { section: string; label: string; num: number }> = {
  dominioExistente: {
    section: "Dominio y Presencia Web",
    label: "¿Cuentas ya con un dominio web o nombre de marca registrado digitalmente?",
    num: 1,
  },
  opcionesDominio: {
    section: "Dominio y Presencia Web",
    label: "¿Tienes opciones en mente para el nombre de dominio o URL del sistema?",
    num: 2,
  },
  ubicacionPrincipal: {
    section: "Ubicación y Sucursales",
    label: "¿Cuál es la ubicación de tu local o tienda principal?",
    num: 3,
  },
  sucursalesPlaneadas: {
    section: "Ubicación y Sucursales",
    label: "¿Cuántas sucursales o socios franquiciados planeas habilitar a corto/mediano plazo?",
    num: 4,
  },
  saboresVariedades: {
    section: "Catálogo de Productos",
    label: "¿Cuántos sabores y variedades de helado ofreces? ¿Rotan por temporada?",
    num: 5,
  },
  presentacionesFormatos: {
    section: "Catálogo de Productos",
    label: "¿Qué presentaciones o formatos de venta manejas?",
    num: 6,
  },
  gestionStock: {
    section: "Gestión de Stock e Inventario",
    label: "¿Cómo manejas actualmente el control de ingredientes e insumos?",
    num: 7,
  },
  alertasVencimiento: {
    section: "Gestión de Stock e Inventario",
    label: "¿Necesitas alertas de reposición y/o control de fechas de vencimiento?",
    num: 8,
  },
  metodosEntregaActual: {
    section: "Métodos de Entrega",
    label: "¿Qué modalidades de entrega ofreces o planeas ofrecer?",
    num: 9,
  },
  zonasCoberturaDelivery: {
    section: "Métodos de Entrega",
    label: "¿Cuáles son las zonas geográficas cubiertas por cada sucursal para delivery?",
    num: 10,
  },
  enviosNacionales: {
    section: "Envíos Nacionales y Socios",
    label: "Para envíos nacionales: ¿utilizarás empresa de courier? ¿Quién asume el costo?",
    num: 11,
  },
  modeloSocios: {
    section: "Envíos Nacionales y Socios",
    label: "¿Cómo funcionará el modelo de socios o franquicias? ¿Necesitarán panel propio?",
    num: 12,
  },
  sistemaActual: {
    section: "Sistema Actual y Pagos",
    label: "¿Usas actualmente alguna plataforma de ventas online o punto de venta físico?",
    num: 13,
  },
  metodosPagoAceptados: {
    section: "Sistema Actual y Pagos",
    label: "¿Qué métodos de pago aceptas o planeas aceptar?",
    num: 14,
  },
  automatizacion: {
    section: "Sistema Actual y Pagos",
    label: "¿Qué procesos te gustaría automatizar? (notificaciones, reportes, sincronización de stock, etc.)",
    num: 15,
  },
};

function buildAdminEmailHtml(data: HeladeriaData): string {
  const now = new Date().toLocaleString("es-VE", { timeZone: "America/Caracas" });

  // Build questions HTML grouped by section
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
      data.respuestas[key as keyof HeladeriaData["respuestas"]] ||
      "<em>Sin respuesta</em>";
    questionsHtml += `
      <tr>
        <td style="padding: 16px 24px; border-bottom: 1px solid #2a2a2a;">
          <p style="margin: 0 0 4px; color: #a8a29e; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">P${meta.num}</p>
          <p style="margin: 0 0 6px; color: #a8a29e; font-size: 13px; font-weight: 600;">${meta.label}</p>
          <p style="margin: 0; color: #ffffff; font-size: 15px; line-height: 1.6;">${answer}</p>
        </td>
      </tr>`;
  }

  // Extras section
  let extrasHtml = `
      <tr>
        <td colspan="2" style="padding: 20px 24px 8px; background: #1a1a1a; border-bottom: 2px solid #c2703e;">
          <h3 style="margin: 0; color: #c2703e; font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">Extras Seleccionados</h3>
        </td>
      </tr>
      <tr>
        <td style="padding: 16px 24px; border-bottom: 1px solid #2a2a2a;">
          <p style="margin: 0 0 6px; color: #a8a29e; font-size: 13px;">App Móvil (iOS + Android) — +$150</p>
          <p style="margin: 0; color: #ffffff; font-size: 15px; font-weight: 600;">${data.extras.convertirApp ? "✅ Sí, solicitado" : "❌ No seleccionado"}</p>
        </td>
      </tr>
      <tr>
        <td style="padding: 16px 24px; border-bottom: 1px solid #2a2a2a;">
          <p style="margin: 0 0 6px; color: #a8a29e; font-size: 13px;">Verificaciones Automáticas de Pagos — A negociar</p>
          <p style="margin: 0; color: #ffffff; font-size: 15px; font-weight: 600;">${data.extras.verificacionPagos ? "✅ Sí, interesado" : "❌ No seleccionado"}</p>
        </td>
      </tr>`;

  // Payment section
  let pagoDetalles = "";
  if (data.pago.metodoPago === "zelle") {
    pagoDetalles = `
          <p style="margin: 6px 0 0; color: #ffffff; font-size: 14px;">💳 <strong>Método:</strong> Zelle</p>
          <p style="margin: 4px 0; color: #ffffff; font-size: 14px;">📧 <strong>Correo desde:</strong> ${data.pago.correoDesdeZelle}</p>`;
  } else if (data.pago.metodoPago === "pagoMovil") {
    pagoDetalles = `
          <p style="margin: 6px 0 0; color: #ffffff; font-size: 14px;">📱 <strong>Método:</strong> Pago Móvil</p>
          <p style="margin: 4px 0; color: #ffffff; font-size: 14px;">🔢 <strong>Últimos 6 dígitos:</strong> ${data.pago.ultimosDigitos}</p>
          <p style="margin: 4px 0; color: #ffffff; font-size: 14px;">📞 <strong>Teléfono desde:</strong> ${data.pago.telefonoDesde}</p>`;
  }

  const pagoHtml = `
      <tr>
        <td colspan="2" style="padding: 20px 24px 8px; background: #1a1a1a; border-bottom: 2px solid #c2703e;">
          <h3 style="margin: 0; color: #c2703e; font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">💰 Información de Pago</h3>
        </td>
      </tr>
      <tr>
        <td style="padding: 16px 24px; border-bottom: 1px solid #2a2a2a;">
          <p style="margin: 0; color: #c2703e; font-size: 20px; font-weight: 700;">$${data.pago.montoAPagar?.toFixed(2)} USD (${data.pago.porcentaje}%)</p>
          <p style="margin: 4px 0; color: #f59e0b; font-size: 16px; font-weight: 600;">Bs. ${data.pago.montoBolivares?.toLocaleString("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <p style="margin: 4px 0; color: #78716c; font-size: 13px;">Tasa BCV del día: Bs. ${data.pago.tasaDolar?.toFixed(2)} / $1</p>
          ${pagoDetalles}
        </td>
      </tr>`;

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin: 0; padding: 0; background: #0c0a09; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background: #0c0a09; padding: 40px 20px;">
    <tr><td align="center">
      <table width="620" cellpadding="0" cellspacing="0" style="background: #1c1917; border-radius: 16px; overflow: hidden; border: 1px solid #292524;">
        <!-- Header -->
        <tr>
          <td style="padding: 32px 24px; background: linear-gradient(135deg, #1c1917 0%, #292524 100%); border-bottom: 2px solid #c2703e;">
            <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 700;">🍦 Nuevo Cuestionario — Heladería</h1>
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
                <td style="padding: 16px 20px; border-bottom: 1px solid #3a3530;">
                  <span style="color: #a8a29e; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Teléfono / WhatsApp</span>
                  <p style="margin: 4px 0 0; color: #ffffff; font-size: 16px;">${data.telefono}</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 16px 20px;">
                  <span style="color: #a8a29e; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Heladería / Empresa</span>
                  <p style="margin: 4px 0 0; color: #ffffff; font-size: 16px;">${data.empresa || "No especificada"}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- Questions -->
        ${questionsHtml}
        <!-- Extras -->
        ${extrasHtml}
        <!-- Payment -->
        ${pagoHtml}
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

function buildClientEmailHtml(data: HeladeriaData): string {
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
            <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 700;">🍦 ¡Gracias, ${data.nombre}!</h1>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding: 32px;">
            <p style="color: #d6d3d1; font-size: 15px; line-height: 1.8; margin: 0 0 16px;">
              He recibido tu cuestionario y comprobante de pago para el sistema de <strong style="color: #ffffff;">${data.empresa || "tu heladería"}</strong> correctamente. Estoy revisando tus respuestas para entender a fondo las necesidades de tu negocio.
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
                  <p style="margin: 0 0 8px; color: #a8a29e; font-size: 13px;">📱 <strong style="color: #ffffff;">${data.telefono}</strong></p>
                  <p style="margin: 0 0 8px; color: #a8a29e; font-size: 13px;">🍦 <strong style="color: #ffffff;">${data.empresa || "Tu heladería"}</strong></p>
                  <p style="margin: 0 0 8px; color: #a8a29e; font-size: 13px;">💵 <strong style="color: #c2703e;">$${data.pago.montoAPagar?.toFixed(2)} USD (${data.pago.porcentaje}%)</strong> — ${data.pago.metodoPago === "zelle" ? "Zelle" : "Pago Móvil"}</p>
                  <p style="margin: 0; color: #a8a29e; font-size: 13px;">📋 <strong style="color: #ffffff;">15 preguntas respondidas</strong></p>
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
    const data: HeladeriaData = JSON.parse(event.body || "{}");

    // Validate required fields
    if (!data.nombre || !data.email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Nombre y email son requeridos" }),
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
      from: "Heladería Form <hola@alfredomendoza.dev>",
      to: [ADMIN_EMAIL],
      subject: `🍦 Nuevo Cuestionario — ${data.nombre} (${data.empresa || "Sin empresa"}) · $${data.pago.montoAPagar?.toFixed(2)}`,
      html: buildAdminEmailHtml(data),
      replyTo: data.email,
    });

    // Send confirmation email to client
    await resend.emails.send({
      from: "Alfredo Mendoza <hola@alfredomendoza.dev>",
      to: [data.email],
      subject: "✅ Recibimos tu solicitud — Sistema Digital para tu Heladería",
      html: buildClientEmailHtml(data),
      replyTo: ADMIN_EMAIL,
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error("Error sending heladeria emails:", error);
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
