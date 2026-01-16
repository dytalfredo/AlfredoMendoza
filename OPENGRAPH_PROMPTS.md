# Kit de OpenGraph: Prompts + Metadatos

Este documento contiene la estrategia completa para tus tarjetas de OpenGraph (vistas previas en redes sociales). Para cada página, encontrarás los **Textos (Metadatos)** que debes poner en tu código y el **Prompt** para generar la imagen visual con IA.

---

## 1. Página Principal (Home)
**Objetivo:** Presentarte como el "Arquitecto Digital".

### 📝 Metadatos (Configurar en el `<head>`)
*   **Título (`og:title`):** Alfredo Mendoza | Arquitecto Digital & Full Stack Visionary
*   **Descripción (`og:description`):** Transformo problemas manuales en software autónomo. Ingeniería de valor para negocios que buscan escalar sin caos.
*   **Link / CTA (`og:url`):** `https://tudominio.com/`

### 🎨 Prompt para Imagen (Midjourney / DALL-E)
> **Prompt:**
> `Cinematic wide shot of a futuristic digital workspace, a matte black desk with a floating holographic blueprint of a software architecture, text "ALFREDO MENDOZA" displayed in elegant futuristic sans-serif typography on a glass screen, ambient terracotta and teal lighting, dark mode aesthetic, depth of field, 8k resolution, premium tech style --ar 1.91:1 --v 6.0`

---

## 2. Página de Contacto
**Objetivo:** Invitar a la acción directa y filtrar clientes premium.

### 📝 Metadatos (Configurar en el `<head>`)
*   **Título (`og:title`):** Agenda tu Consultoría | Deja de ser aburrido
*   **Descripción (`og:description`):** ¿Listo para una transformación digital real? Si tu negocio factura pero no escala, hablemos. Estrategia y código de alto nivel.
*   **Link / CTA (`og:url`):** `https://tudominio.com/contacto`

### 🎨 Prompt para Imagen (Midjourney / DALL-E)
> **Prompt:**
> `A sleek, high-end matte black smartphone lying on a dark stone surface, displaying a glowing "CONTACT" notification in terracotta orange light, surrounded by abstract connectivity lines, glassmorphism details, professional product photography, dramatic lighting, dark ambient atmosphere --ar 1.91:1 --v 6.0`

---

## 3. Blog (Índice)
**Objetivo:** Mostrar una biblioteca de conocimiento estratégico.

### 📝 Metadatos (Configurar en el `<head>`)
*   **Título (`og:title`):** El Blog | Estrategia, Código & Negocios
*   **Descripción (`og:description`):** Una colección de planos y estrategias para el mundo digital. Artículos sobre automatización, desarrollo web y crecimiento empresarial.
*   **Link / CTA (`og:url`):** `https://tudominio.com/blog`

### 🎨 Prompt para Imagen (Midjourney / DALL-E)
> **Prompt:**
> `Infinite library of digital monoliths, glowing vertical server racks in a dark foggy void, matrix-like data streams in terracotta and cyan, sleek architectural perspective, text "BLOG" floating in the center in 3D metallic letters, cinematic and mysterious, unreal engine 5 render style --ar 1.91:1 --v 6.0`

---

## 4. Artículos del Blog (Plantilla Dinámica)
**Objetivo:** Ilustrar el tema específico del artículo.

### 📝 Metadatos (Ejemplo para Plantilla)
*   **Título (`og:title`):** {Título del Artículo} | Por Alfredo Mendoza
*   **Descripción (`og:description`):** {Resumen corto e impactante del artículo, máx 150 caracteres}
*   **Link / CTA (`og:url`):** `https://tudominio.com/blog/{slug-del-articulo}`

### 🎨 Prompts por Categoría (Selecciona según el tema)

#### Para Artículos de: **IA & Automatización**
> **Prompt:**
> `Abstract 3D digital brain created from glowing terracotta optical fibers, darker background, data constellations, highly detailed, text "AI REVOLUTION" (replace with short article topic) integrated into the design, 8k render --ar 1.91:1 --v 6.0`

#### Para Artículos de: **Desarrollo & Código**
> **Prompt:**
> `Elegant 3D isometric composition of floating code blocks and glass abstract shapes, matte black and obsidian materials, soft orange glow, text "CLEAN CODE" (replace with short article topic), minimalist tech aesthetic --ar 1.91:1 --v 6.0`

#### Para Artículos de: **Negocios & Estrategia**
> **Prompt:**
> `A futuristic rising holographic financial graph on a dark boardroom table, depth of field, professional business atmosphere, text "STRATEGY" (replace with short article topic) glowing softly, cinematic lighting --ar 1.91:1 --v 6.0`

---

## Tips para Generar
*   Si usas **DALL-E 3**, puedes pedirle explícitamente: *"Incluye el texto 'TITULO' en el centro de la imagen de forma elegante"*. DALL-E 3 es muy bueno escribiendo.
*   Si usas **Midjourney**, el texto puede ser más experimental. A veces es mejor generar la imagen limpia y añadir el texto en Photoshop/Canva para máxima legibilidad.
