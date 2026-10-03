# Sumio

Front-end web application and CI/CD delivery infrastructure for the Sumio platform.

## Language

**Dev Environment**:
The pre-production Cloudflare Pages deployment (`sumio-dev`) deployed automatically from the `main` branch after CI checks pass, also hosting ephemeral PR previews.
_Avoid_: Staging, test bed, QA server

**Prod Environment**:
The live user-facing Cloudflare Pages deployment (`sumio`) deployed automatically upon merging into the `production` branch.
_Avoid_: Production server, live box

**Promotion PR**:
An automatically created Pull Request from `main` to `production` following successful Dev deployment, serving as the official release gate.
_Avoid_: Release ticket, manual sync

**Preview Deployment**:
An ephemeral Cloudflare Pages instance generated per Pull Request commit to inspect UI/UX changes before merging.
_Avoid_: Staging deploy, feature site

**Quality Gate**:
The automated barrier comprising linting, formatting, static type checking, and unit testing that must pass before any code is merged into `main` or `production`.
_Avoid_: Smoke check, sanity test

**Vite+ Toolchain**:
The unified web toolchain (`vp`) orchestrating package management, Oxlint, Oxfmt, Vitest, and bundling under a single deterministic CLI.
_Avoid_: Vite scripts, build helpers
