<!-- @format -->

# Monorepo Implementation Prompt

Este documento contiene las instrucciones detalladas paso a paso para ejecutar la migración del proyecto actual de Strapi hacia la nueva Arquitectura Monorepo ("Zero-Gravity" Hybrid Architecture) donde convivirán Strapi (Backend) y Astro (Frontend).

---

## CONTEXTO PARA EL AGENTE

Actualmente, el directorio raíz del proyecto (`aadigital_site_dev`) contiene un proyecto de Strapi inicializado y funcionando. Nuestro objetivo es convertir esta raíz en un Monorepo que contenga dos sub-proyectos: `/backend` (donde vivirá el Strapi actual) y `/frontend` (donde instalaremos Astro).

## INSTRUCCIONES DE EJECUCIÓN (PASO A PASO)

### Fase 1: Preparación y Limpieza

1. **Detener procesos:** Verifica si hay algún servidor de desarrollo de Strapi corriendo en la terminal (`npm run develop`) y detenlo utilizando el intérprete de comandos.
2. **Creación de directorios:** Crea los directorios `/backend` y `/frontend` en la raíz del proyecto.

### Fase 2: Migración del Backend (Strapi)

Debes mover todos los archivos y carpetas relacionados con Strapi hacia el nuevo directorio `/backend`.

1. **Mover carpetas:** Mueve las siguientes carpetas a `/backend`:
   - `src/` (incluye toda nuestra API, como `home-page`)
   - `config/`
   - `database/`
   - `public/` (asegúrate de no sobreescribir si ya moviste algo, aunque Astro usará su propio `public/` en frontend)
   - `types/`
   - `scripts/`
   - `.strapi/`
   - `node_modules/` (para evitar tener que reinstalar todo, aunque opcionalmente puedes regenerarlo).
2. **Mover archivos:** Mueve los siguientes archivos a `/backend`:
   - `package.json`
   - `package-lock.json`
   - `.env` y `.env.example`
   - `favicon.png`
   - `jsconfig.json`
   - `.strapi-updater.json`
3. **Verificación Backend:** Navega a `/backend` en la terminal y ejecuta `npm run build` seguido de `npm run develop` en un proceso en segundo plano para asegurarte de que Strapi sigue funcionando correctamente en su nueva ubicación.

### Fase 3: Inicialización del Frontend (Astro + Starlight)

1. **Inicializar Astro:** Navega a la carpeta `/frontend` y ejecuta el comando de creación de Astro. (Recomendado: `npx create-astro@latest . --template starlight --yes --install --no-git`).
2. **Dependencias Extra:** Instala Tailwind CSS en Astro `npx astro add tailwind --yes` y las integraciones necesarias como `@astrojs/sitemap`.
3. **Integración UI:** Hay dos archivos HTML en la raíz (`home.html` y `docs.html`) generados por Stitch. Debes migrar el diseño visual y el HTML de estos archivos hacia componentes de Astro (por ejemplo `src/pages/index.astro` para el home) dentro de la carpeta `/frontend`.
4. **Configuración de variables:** Crea un archivo `.env` en `/frontend` con `PUBLIC_STRAPI_URL=http://localhost:1337`.

### Fase 4: Configuración del Root Workspace (Opcional pero recomendado)

1. **Root `package.json`:** Crea un `package.json` muy básico en la raíz del proyecto configurando npm workspaces:

```json
{
  "name": "aadigital-monorepo",
  "private": true,
  "workspaces": ["backend", "frontend"]
}
```

### Fase 5: Validación Final

1. Arranca ambos servidores localmente.
   - Backend: `npm run develop` (puerto 1337)
   - Frontend: `npm run dev` (puerto 4321)
2. Verifica mediante un log general que la estructura quedó exactamente como está descrita en `.agents/ARCHITECTURE.md`.

---

**Nota al Agente:** Prioriza el uso de la terminal (`mv`, `mkdir`, etc.) para los movimientos masivos de archivos para evitar perder metadatos o romper permisos.
