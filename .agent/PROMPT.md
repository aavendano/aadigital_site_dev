<!-- @format -->

Prompt para la Generación del Sitio Web
Rol y Contexto: Actúa como un Principal Software Architect y UX/UI Engineer de "AA Digital Business". Tu tarea es desarrollar la estructura fundamental y los componentes clave para el sitio web oficial de "VibeBlocks", utilizando nuestra arquitectura híbrida "Zero-Gravity".

Stack Tecnológico Estricto:

Frontend Core: Astro (Static Site Generation, output: 'static').
Styling: Tailwind CSS (Utility-first).
Datos Dinámicos (Marketing/Blog): Strapi (Headless CMS) consultado en tiempo de compilación. No hardcodear posts.
Documentación: Starlight (MDX basado en Git en src/content/docs).
Búsqueda: Pagefind.
Despliegue: Cloudflare Pages.
Lenguaje: TypeScript (.ts) para toda la lógica, componentes en .astro. Todo el copy visible por el usuario DEBE estar en Inglés.
Sistema de Diseño ("Clinical Light Mode"):

Fondo Principal: #FFFFFF (Blanco puro).
Fondo Secundario: #F3F4F6 (Gris nube sutil).
Acento: #00FF41 (Verde señal para estados/resaltados).
Texto: #111827 (Alto contraste).
Bordes: #D1D5DB (Separaciones precisas de 1px).
Bloques de Código: Fondo oscuro obligatorio (#0B0E14) para contraste dramático.
Tipografía: Inter o Geist Sans (para UI), JetBrains Mono (para código).
Estilo Visual: Cero ilustraciones genéricas. Usa representaciones de datos abstractas o topologías precisas. "Engineered by AA Digital Business" debe estar presente.
Regla Crítica (No Data Fabrication): NUNCA inventes datos reales del negocio. Si falta información (URLs, emails), usa un placeholder semántico (ej. https://example.com) y un comentario en el código indicando el TODO, por ejemplo: // TODO: Replace this placeholder with the actual production URL before deployment. Igual para el JSON-LD Schema.

Entregables Requeridos:

Por favor, genera el código completo para los siguientes archivos, demostrando la integración de Astro, Tailwind y nuestro sistema de diseño:

1. Configuración Base:

tailwind.config.mjs: Configura los colores, fuentes y directrices del "Clinical Light Mode".
src/layouts/BaseLayout.astro: El layout principal que incluye la estructura HTML5 semántica y el componente <JsonLd /> corporativo. 2. Bloques de UI (Astro Components): Crea los siguientes componentes modulares en src/components/ui/ y src/components/blocks/:

BrandSignature.astro: Un pequeño badge o firma visual que diga "Engineered by AA Digital Business".
Hero.astro: Un hero section técnico y minimalista, optimizado para recibir propiedades estructurales y el botón verde señal de CTA.
CodeShowcase.astro: Un bloque visual que presente de un lado un texto explicativo y del otro un bloque de código impactante usando el fondo #0B0E14 y JetBrains Mono.
FeatureGrid.astro: Una cuadrícula con bordes de 1px (#D1D5DB) para mostrar características usando tipografía limpia en lugar de íconos saturados. 3. Ejemplos de Integración de Contenido:

Página de Inicio (Strapi Mock): Genera la estructura de src/pages/index.astro. En lugar de llamar a la API real, simula una respuesta de Strapi en el script del componente para demostrar cómo iterarás sobre la data y renderizarás los bloques (Hero, FeatureGrid, CodeShowcase).
Documentación MDX (Starlight): Crea un ejemplo de src/content/docs/index.mdx (landing page de Starlight para desarrolladores) utilizando la configuración template: splash, definiendo correctamente el hero de configuración de Astro Starlight y añadiendo un ejemplo de código en el contenido.
Utilidad de Fetching: Genera src/lib/strapi.ts con una función genérica strongly-typed en TypeScript para realizar fetch a los endpoints del CMS manejando errores elegantemente.
Asegúrate de que el código sea modular, DRY, con validación de tipos clara, y represente la máxima autoridad técnica sin uso de lenguaje de marketing exagerado. Todo el copy interno en las interfaces debe estar en Inglés.

Este prompt encapsula todas tus reglas establecidas en

.agent/RULES.md, ARCHITECTURE.md y DESIGN.md
. Le da al LLM un marco de trabajo rígido que le impedirá desviarse hacia diseños genéricos, forzará el esquema de colores/tipografías exacto y validará que la lógica se estructure de acuerdo a la separación SSG (Strapi) vs. Docs (Starlight).
