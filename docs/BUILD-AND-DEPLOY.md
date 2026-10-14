# Build, Test, and Deploy NUDL-IDE

## Requirements

Use Node.js 22+ and npm compatible with the repository lockfile. Check the package scripts before changing build commands.

## Local development

```sh
npm install
npm run dev
```

Vite normally serves the app on port 3000.

## Verification

```sh
npm test
npm run lint
npm run build
npm run preview
```

If a command fails, fix the underlying source or dependency issue before describing the build as passing. Do not infer test success from a committed workflow file.

## GitHub Pages

The Pages workflow deploys the Vite `dist/` directory. Project-site builds need the base path `/NUDL-IDE/`; root-relative asset paths should be checked carefully. In GitHub repository settings, Pages source should be set to GitHub Actions.

Published project URL: https://arkansasio.github.io/NUDL-IDE/

## Release checklist

- [ ] `npm test` passes.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
- [ ] Workflow run is green.
- [ ] Live Pages URL loads assets without 404s.
- [ ] Interpreter example runs and displays expected output.
- [ ] Workspace export/import round-trips.
- [ ] Generated target samples are tested with corresponding toolchains where available.
