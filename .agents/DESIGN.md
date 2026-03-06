<!-- @format -->

# **Design and Architecture Specifications: AA Digital Business / VibeBlocks**

This document details the technical and visual architecture for the official **VibeBlocks** website, developed by **AA Digital Business**. The site utilizes a "Zero-Gravity" architecture (fully static) to reflect the lightweight nature of the framework.

## **1\. Visual Identity (Technical Branding)**

### **Color Palette**

| Usage                          | Color (HEX) | Strategic Rationale                                     |
| :----------------------------- | :---------- | :------------------------------------------------------ |
| **Primary Background (Light)** | \#FFFFFF    | Clinical light UI baseline for maximum clarity.         |
| **Secondary Background**       | \#F3F4F6    | Subtle cloud gray surfaces for hierarchy without noise. |
| **Accent (Signal Green)**      | \#00FF41    | Controlled technical signal for states and highlights.  |
| **Text (High Contrast)**       | \#111827    | High legibility on light backgrounds.                   |
| **Borders/Dividers**           | \#D1D5DB    | Precise 1px separation aligned with clinical design.    |
| **Code Block Background**      | \#0B0E14    | Mandatory dark contrast for code snippets on light UI.  |

### **Typography**

- **Interface & Headings:** Inter or Geist Sans (Sans-serif). Modern software tool aesthetic.
- **Technical Data & Code:** JetBrains Mono (Monospace). Projects engineering authority.

### **UX/UI Compliance Notes**

- **Theme Policy:** Global UI follows **Clinical Light Mode** (white + cloud grays + 1px borders).
- **Code Policy:** All `<pre>` and `<code>` blocks use a dedicated dark theme for contrast.
- **Language Policy:** All user-facing copy, CTAs, and documentation are written in English.
- **Visual Policy:** Avoid generic illustrations; prefer abstract data representations, topology motifs, and typography.
- **A11y & SEO Policy:** Use semantic HTML5, accessibility-first components, and JSON-LD where relevant.

## **2\. Folder Structure**

/  
├── src/  
│ ├── content/  
│ │ ├── blog/ \# Technical articles and "Recipes"  
│ │ │ └── config.ts \# Zod schemas  
│ │ └── docs/ \# Starlight documentation  
│ ├── components/  
│ │ ├── seo/  
│ │ │ └── JsonLd.astro \# Structured data injection  
│ │ ├── ui/  
│ │ │ ├── BrandSignature.astro \# "Engineered by AA Digital Business"  
│ │ │ └── TechProof.astro \# Build status/coverage components  
│ └── layouts/  
│ └── BaseLayout.astro \# Layout with SEO injection  
├── public/  
│ ├── robots.txt  
│ └── og-default.png  
├── astro.config.mjs \# Central configuration  
└── tailwind.config.mjs \# Palette and font definitions
