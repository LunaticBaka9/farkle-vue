# Repository Guidelines

## Project Structure

This Vue 3 and Vite browser game has no backend. `src/main.js` starts the app, and `src/App.vue` composes page-level components. `src/components/` groups mode-specific views (`normal/`, `adventure/`, `kingdom/`) and shared UI (`framework/`). `src/composables/` coordinates page workflows, `src/stores/` owns shared Pinia state, and `src/game/` contains scoring, turn rules, persistence, audio, AI automation, and Kingdom data. Keep mode-specific UI beside its mode; use `framework/` for shared views. Global styles are in `src/style.css`, and imported audio is in `src/assets/`. `docs/` is generated Pages output; do not edit build artifacts by hand.

## Development Commands

- `npm install --include=dev` installs dependencies and build tools.
- `npm run dev` starts the local Vite server at `http://localhost:5173`.
- `npm test` runs `tests/*.test.js` with Node's built-in test runner.
- `npm run build` creates a production build in `dist/`.
- `npm run build:pages` builds for the `/farkle-vue/` Pages path into `docs/`.
- `npm run preview` serves the production build locally.

## Style and Module Boundaries

Follow nearby Vue SFC and JavaScript ES module patterns: four-space indentation, double quotes, and semicolons. Use PascalCase for Vue components, camelCase for functions and variables, and descriptive lower-case module names such as `persistence.js`. Keep game rules pure where practical, and route shared reactive state through the Pinia store. There is no configured lint or formatter script.

When adding a module or meaningful handler, add a concise Chinese comment stating who calls it and where its inputs or data originate. Keep component data flow explicit through props and emits; avoid directly mutating a parent's state from child views.

## Testing

Name tests `*.test.js` and place them in `tests/`. There is no coverage threshold. Add focused coverage for scoring, turn transitions, AI decisions, and storage validation when changing those behaviors. Run `npm test` and `npm run build` before submitting behavior or UI changes.

## Commits and Pull Requests

Recent commits use short imperative subjects, sometimes with prefixes such as `feat:`, `fix`, `update:`, or `style:`; Chinese subjects also appear. Keep commits focused. Pull requests should describe user-visible behavior, list validation commands, link related issues when relevant, and include screenshots for visual changes, especially mobile layouts.

## Security and Configuration

The game runs in the browser and needs no API keys. Keep secrets out of the repository and preserve the static client-side deployment model unless a backend is explicitly introduced.
