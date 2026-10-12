# Backend Refactor: Bundler Resolution, Clean Paths, Decoupled Auth, and Domain Exceptions

We decided to migrate `sumio-be` from `nodenext` to `moduleResolution: "bundler"`, enforce root `@/*` path aliases without `.js` file extensions, decouple `AuthModule` from `UserModule` using an `AuthenticatedUser` principal, and introduce a global `DomainExceptionFilter`.

## Context

`sumio-be` initially used TypeScript `nodenext` module resolution, requiring explicit `.js` import extensions and deep relative import chains (`../../../../shared/...`). Furthermore, `FirebaseAuthGuard` and `@CurrentUser` were housed directly inside `modules/user`, coupling independent modules (`category`, `transaction`) to `user` domain internals. Controllers also contained repetitive `try/catch` boilerplate manually serializing HTTP error bodies.

## Decision

1. **Module Resolution & Path Aliases**: Configure `tsconfig.json` with `"moduleResolution": "bundler"`, `"module": "ESNext"`, and `"paths": { "@/*": ["./src/*"] }`. Remove all `.js` import extensions across backend source and test files.
2. **Decoupled Auth & Lightweight Principal**: Extract authentication (`FirebaseAuthGuard`, `@CurrentUser`, `ITokenVerifier`, `JoseFirebaseTokenVerifier`) into a standalone `src/modules/auth` (or `src/shared/auth`). The `@CurrentUser()` decorator provides a lightweight `AuthenticatedUser` principal (`{ id, email, firebaseUid, baseCurrency }`), ensuring consumer modules do not depend on the heavy `User` aggregate.
3. **Common Types & Contract Boundary**: `@sumio/contract` remains the sole owner of all network DTOs and API schemas. Backend internal abstractions (`IUseCase`, `Result`, `PaginatedResult`, `Entity`, `ValueObject`) reside in `@/shared`.
4. **Global Domain Exception Filter**: Replace manual controller-level `try/catch` blocks with custom domain exceptions extending `DomainException` (`NotFoundDomainException`, `ValidationDomainException`, `ForbiddenDomainException`) handled by a global NestJS `DomainExceptionFilter`.
5. **Pragmatic Clean Architecture**: Maintain decoupled application layers (Controller -> UseCase -> Port -> Infrastructure) without forcing unnecessary Value Objects or bi-directional mappers on simple CRUD modules.
