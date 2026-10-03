# Trunk-Based Continuous Delivery to Isolated Cloudflare Pages Environments

We decided to use Trunk-Based Continuous Delivery deploying to two isolated Cloudflare Pages projects (`sumio-dev` and `sumio`), gated by GitHub Environment approval for production.

## Context
The repository hosts the frontend (`sumio-fe`) powered by Vite+ and Bun. We need a reliable CI/CD pipeline compliant with the production-grade standards outlined in `ci-cd-config.md`. A key architectural choice was deciding whether to use dual long-lived Git branches (`develop` vs `main`) or trunk-based promotion, and whether to share a single Cloudflare Pages project across branches or isolate environments into separate Cloudflare projects.

## Decision
1. **Trunk-Based with GitHub Environments**: All developers integrate directly into `main` via short-lived Pull Requests. Merging to `main` immediately deploys to the Dev environment (`sumio-dev`). Production deployment (`sumio`) uses the same workflow run behind a GitHub Environment approval gate with required reviewers, eliminating the drift and merge debt of long-lived release branches.
2. **Isolated Cloudflare Pages Projects**: We maintain two discrete projects in Cloudflare Pages: `sumio-dev` (for Dev and PR preview deployments) and `sumio` (for production traffic). This provides strict isolation of API tokens, secrets, custom domains, and edge limits.
3. **Dedicated PR Previews with Feedback**: PRs automatically trigger ephemeral preview deployments to `sumio-dev`, followed by a sticky PR comment containing the preview link for rapid stakeholder review.
4. **Vite+ Native Toolchain**: The CI pipeline leverages `voidzero-dev/setup-vp@v1` with Vite Task caching to guarantee sub-minute feedback for typecheck, lint (`oxlint`), formatting (`oxfmt`), and tests (`vitest`).

## Considered Options
- **Git Flow (develop / main)**: Rejected because dual branches create semantic divergence, big-bang merge conflicts, and violate DORA elite continuous delivery recommendations.
- **Single Cloudflare Pages Project**: Rejected to prevent configuration leakage and accidental production overrides between staging previews and customer traffic.
