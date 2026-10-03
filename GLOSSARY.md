# Sumio

Front-end web application and CI/CD delivery infrastructure for the Sumio platform.

## Language

**Dev Environment**:
The pre-production Cloudflare Pages deployment (`sumio-dev`) used for integration verification and ephemeral PR previews.
_Avoid_: Staging, test bed, QA server

**Prod Environment**:
The live user-facing Cloudflare Pages deployment (`sumio`) protected by required approvals on GitHub Environments.
_Avoid_: Production server, live box

**Preview Deployment**:
An ephemeral Cloudflare Pages instance generated per Pull Request commit to inspect UI/UX changes before merging.
_Avoid_: Staging deploy, feature site

**Quality Gate**:
The automated barrier comprising linting, formatting, static type checking, and unit testing that must pass before any code is merged into `main`.
_Avoid_: Smoke check, sanity test

**Vite+ Toolchain**:
The unified web toolchain (`vp`) orchestrating package management, Oxlint, Oxfmt, Vitest, and bundling under a single deterministic CLI.
_Avoid_: Vite scripts, build helpers
