# Parisa Dehghan — Research & Engineering Portfolio

A dark portfolio for **GitHub Pages** whose palette and hero come from the thin-film interference colours of a silicon wafer, built with **React + TypeScript + Vite** (no heavy runtime dependencies).

> **Positioning:** an interdisciplinary R&D specialist combining physics, computational science, machine learning, IoT, and experimental micro/nano engineering.

## Sections

Hero (live WebGL wafer with physically computed thin-film colours) · tool ticker · research identity · featured **MEMS Simulation Application** (write-up with an interactive KOH V-groove demo) · research & engineering domains · interactive experience timeline with expandable cards and IoT architecture diagram · education · filterable project explorer with SVG visualizations · skill matrix · certification wall · interactive **Research Landscape** network · GitHub integration (live API + fallback) · contact & footer.

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
| `src/data/mems.ts` | MEMS Simulation Application: features, process steps, results, model |

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
                                      // | 'equation' | 'twin' | 'band' | 'rotor' | 'etch'
}
```

### Replacing the CV

Drop your PDF at `public/cv/Parisa-Dehghan-CV.pdf`. The Download CV buttons point there automatically. To use a different filename, update `cvPath` in `src/data/content.ts`.

> `generate_cv_pdf.py` holds an old copy of the CV data: running it overwrites the current PDF with outdated content.

### The MEMS app

For licensing reasons, the compiled MEMS Simulation Application and its screenshots are not part of this site. The section only describes the work, and its KOH V-groove demo is this site's own code. Don't add a hosted build, a link to one, or screenshots of the app to the site or the CV.

### Replacing images

The IoT section shows `public/images/iot-architecture.png` (your real wristband architecture diagram). Replace it or add more images under `public/images/`. A professional portrait can later be added to the hero — the design does not depend on one.

### Editing personal information

All names, links, email, location, and languages live in `profile` in `src/data/content.ts`.

## Content accuracy policy

The site intentionally contains **no invented** publications, metrics, awards, or repositories. Placeholders such as `[ADD PAPER LINK]` / `[ADD PROJECT LINK]` in the data mark items awaiting real URLs (e.g., the GCN paper, pisr, NeuroTwin, TFET simulator); they are not shown to visitors. Real links used: `github.com/Parisadghn/confusion-scheme` and `github.com/Parisadghn/laptop-price-ML` (verified via the GitHub API).

Project descriptions for **pisr** (physics-informed symbolic regression), **NeuroTwin** (predictive-maintenance platform), the **TFET simulator**, the **MEMS Simulation Application**, and the **CareWatch** health-monitoring dashboard are drawn directly from the corresponding project repositories in this workspace.

## Accessibility & performance

- Semantic HTML, skip-link, keyboard-navigable interactive SVG map and accordions, visible focus states, `prefers-reduced-motion` respected.
- No external runtime dependencies beyond React, and fonts are self-hosted. WebGL, canvas and SVG animations are pure code, pause off-screen, and fall back to a static wafer without WebGL.
