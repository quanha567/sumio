# Branch-Based Promotion via Automated Pull Requests to Production

We decided that `main` serves as the Dev environment deployment source, and promoting to Production (`sumio`) occurs via an automatically opened Pull Request from `main` to `production`.

## Context
The repository hosts the frontend (`sumio-fe`) built with Vite+ and deployed to Cloudflare Pages. To ensure safe releases without manual branch drift, we needed a seamless promotion mechanism between Dev (`sumio-dev`) and Production (`sumio`). We evaluated an in-run GitHub Environment approval gate versus an explicit `production` branch gated by an automated Pull Request.

## Decision
1. **`main` as Dev Environment**: Merging feature branches into `main` executes the CI Quality Gate. Once CI succeeds (`workflow_run`), code is deployed directly to `sumio-dev` (Cloudflare Pages Dev).
2. **Automated Promotion PR**: Upon successful deployment to `sumio-dev`, the pipeline automatically creates (or updates) an official Pull Request from `main` to `production`.
3. **`production` as Production Release**: Reviewers merge the Promotion PR into `production` when ready to release. Pushing to `production` triggers the Production CD workflow, deploying to `sumio` and generating a GitHub Release with automated changelog notes.
4. **Isolated Cloudflare Pages Projects**: We maintain two discrete projects in Cloudflare Pages: `sumio-dev` and `sumio`, keeping secrets and environments strictly isolated.

## Consequences
- Every release to Production is documented and auditable through an explicit PR merge and a generated GitHub Release.
- Code cannot reach Production without first running and passing on `main` and `sumio-dev`.
- Requires GitHub repository permissions: "Allow GitHub Actions to create and approve pull requests".
