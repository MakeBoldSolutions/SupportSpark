# SupportSpark build and deployment

The full build invokes Tailwind CLI for CSS and esbuild for client JavaScript and the CommonJS server bundle at dist/index.cjs. It copies IIS web.config when available and initializes deployment data directories (ref: `script/build.ts`).

A separate Vite configuration builds the static preview. GitHub Pages deployment runs npm ci and the static Vite build on configured branch pushes (ref: `package.json`, `.github/workflows/deploy-preview.yml`).

Builds and deployments were not run during knowledge initialization. Existing IIS guidance is retained as documentation, not evidence of a verified deployment (ref: `.documentation/domain/deployment-iis.md`).
