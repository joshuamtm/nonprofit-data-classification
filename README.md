# Nonprofit Data Classification Guide

A free, practical web guide to classifying and handling sensitive information in a nonprofit — with a **policy wizard that generates a customized, board-ready Word document**, an interactive tier classifier, and implementation guides for Google Workspace and Microsoft 365.

A free public resource from **[Meet the Moment](https://mtm.now)**.

## What's inside

| Route | What it does |
|---|---|
| `/` | Landing: what data classification is and why nonprofits need it |
| `/guide/tiers` | The four-tier model (T1 Public → T4 Restricted) |
| `/guide/data-types` | Browsable taxonomy of nonprofit data types, pre-classified by tier and sector |
| `/guide/handling` | Handling controls matrix — requirements per tier, printable |
| `/guide/workspace` | Google Workspace implementation guide, mapped to license tiers |
| `/guide/m365` | Microsoft 365 implementation guide, mapped to license tiers |
| `/decision-tree` | "What tier is my data?" — interactive classifier |
| `/wizard` | 6-step policy wizard → downloads a customized `.docx` policy |

## How the policy wizard works

The wizard collects organization basics (name, staff size, sectors, state), platform and license tier, a data inventory (from the taxonomy, filtered by sector), and applicable regulations — then assembles an 11-section Data Classification & Handling Policy with `docx` **entirely in the browser**. Sections include tier definitions, the org's own data inventory, handling requirements, platform-specific controls for their actual license tier, roles, labeling procedures, incident reporting, an adoption & version-history block, and a staff acknowledgment page. Health-sector organizations get an explicit HIPAA/BAA callout.

**Privacy:** the entire app is client-side. No backend, no API calls, no analytics, no storage. Nothing entered ever leaves the browser.

## Content sources

Tier model and control mappings drawn from **NIST SP 800-60**, **CIS Controls v8.1**, and nonprofit sector practice. Not legal advice — the generated policy says so too, and includes a "consult qualified counsel" note.

## Tech stack

Vite + React 19 · react-router 7 · Tailwind CSS v4 (via `@tailwindcss/vite`) · `docx` + `file-saver` (lazy-loaded on the Generate step)

```bash
npm install
npm run dev      # local development
npm run build    # production build to dist/
npm run preview  # serve the build locally
```

All guide content lives in `src/data/*.json` (taxonomy, handling matrix, platform features); the policy text lives in `src/lib/generatePolicy.js`. Editing content rarely requires touching components.

> Note: this project uses **Tailwind v4** — a deliberate exception to the MTM Tailwind-v3 standard, configured via the `@tailwindcss/vite` plugin (no `tailwind.config.js`).

## Accessibility

Audited with axe-core (WCAG 2.1 A/AA) as of 2026-08-27: form fields are label-associated, text-bearing color fills meet AA contrast, keyboard focus is visible throughout.

---

*Built by Meet the Moment (Joshua Peskay & Kim Snyder) — [mtm.now](https://mtm.now). Proprietary.*
