# Parisa Dehghan — Research & Engineering Portfolio

A dark, laboratory-instrument-styled portfolio for **GitHub Pages**, built with **React + TypeScript + Vite** (no heavy runtime dependencies).

> **Positioning:** an interdisciplinary R&D specialist combining physics, computational science, machine learning, IoT, and experimental micro/nano engineering.

## Sections

Hero (animated sensor→data→ML pipeline canvas) · technical profile panel · research identity · research & engineering domains · interactive experience timeline with expandable cards and IoT architecture diagram · education · filterable project explorer with SVG visualizations · skill matrix · certification wall · interactive **Research Landscape** network · GitHub integration (live API + fallback) · contact & footer.

## Local development

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-checks + builds to dist/
npm run preview    # serves the production build locally
```

## Deployment to GitHub Pages

1. Create a repository named **`portfolio`** under `Parisadghn` (or any name) and push this folder to its `main` branch.
2. In the repo: **Settings → Pages → Source → GitHub Actions**.
3. The included workflow (`.github/workflows/deploy.yml`) builds and deploys on every push.
4. Site will be served at `https://parisadghn.github.io/portfolio/`.

> If you instead use the **user site** repo `Parisadghn.github.io`, change `VITE_BASE: /portfolio/` to `VITE_BASE: /` in the workflow (and the `base` in `vite.config.ts`) so asset paths resolve.

## Updating content

All personal content is centralized — edit data files, not components:

| File | Contents |
|---|---|
| `src/data/content.ts` | Name, tagline, links, experience (IoT + instructor), hero panel |
| `src/data/experience.ts` | Lotus IMNS projects, education |
| `src/data/domains.ts` | Skill groups, research domains, certifications, about narrative |
| `src/data/projects.ts` | Full project database (flagship + compact), categories, verified GitHub repos |

### Adding a project

Append an entry to `projects` in `src/data/projects.ts`:

```ts
{
  title: 'My New Project',
  categories: ['Machine Learning'],   // any of the ProjectCategory values
  flagship: true,                     // optional: large card w/ visualization
  description: 'One-sentence summary.',
  detail: ['Optional expanded bullet points.'],
  tech: ['Python', 'PyTorch'],
  link: 'https://github.com/Parisadghn/...',  // or omit
  viz: 'graph',                       // optional: 'bubbles' | 'graph' | 'lattice' | 'chart'
                                      // | 'autoencoder' | 'persistence' | 'detector' | 'pipeline'
                                      // | 'equation' | 'twin' | 'band'
}
```

### Replacing the CV

Drop your real PDF at `public/cv/Parisa-Dehghan-CV.pdf` (a placeholder is there now — replace it). The Download CV buttons point there automatically. To use a different filename, update `cvPath` in `src/data/content.ts`.

### Replacing images

The IoT section shows `public/images/iot-architecture.png` (your real wristband architecture diagram). Replace it or add more images under `public/images/`. A professional portrait can later be added to the hero — the design does not depend on one.

### Editing personal information

All names, links, email, location, and languages live in `profile` in `src/data/content.ts`.

## Content accuracy policy

The site intentionally contains **no invented** publications, metrics, awards, or repositories. Placeholders such as `[ADD PAPER LINK]` / `[ADD PROJECT LINK]` mark items awaiting real URLs (e.g., the GCN paper, pisr, NeuroTwin, TFET simulator). Real links used: `github.com/Parisadghn/confusion-scheme` and `github.com/Parisadghn/laptop-price-ML` (verified via the GitHub API).

Project descriptions for **pisr** (physics-informed symbolic regression), **NeuroTwin** (predictive-maintenance platform), the **TFET simulator**, the **MEMS etch-process simulator**, and the **CareWatch** health-monitoring dashboard are drawn directly from the corresponding project repositories in this workspace.

## Accessibility & performance

- Semantic HTML, skip-link, keyboard-navigable interactive SVG map and accordions, visible focus states, `prefers-reduced-motion` respected.
- No external runtime dependencies beyond React; total payload ≈ 65 KB gzipped. Canvas and SVG animations are pure code — no large assets.
