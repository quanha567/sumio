# Frontend Authentication Architecture and Flow Specification

We decided to implement authentication in `sumio-fe` using an isolated `_auth` route layout (Auth Shell), Firebase Client Auth SDK synchronized with the backend `/api/auth/me` endpoint, `react-hook-form` with Zod validation, and dedicated Component Wrappers in `@/components/ui/`.

## Context
The Sumio application requires a secure, responsive, and aesthetically pleasing entry point for user authentication (Sign In, Sign Up, Password Reset) based on the brand design system and Mint Theme. The backend (`sumio-be`) already relies on Firebase Auth bearer tokens validated by `FirebaseAuthGuard` and provisions user records into PostgreSQL Just-In-Time (JIT). The frontend needs a structured, accessible, and robust authentication layer that protects private routes (`_app`) while avoiding UI layout bleeding.

## Decision
1. **Decoupled Auth Shell (`_auth.tsx`)**: Unauthenticated authentication routes (`/login`, `/register`, `/forgot-password`) are grouped under an isolated route layout (`_auth.tsx`). This layout manages the 2-column responsive presentation (artistic illustration, brand storytelling, security badges, and floating card container) without mounting the authenticated `AppShell` (sidebar, topbar).
2. **Firebase Client SDK & React Context (`AuthContext`)**: The frontend interacts directly with Firebase Auth (`signInWithEmailAndPassword`, `createUserWithEmailAndPassword`, `sendPasswordResetEmail`, `signInWithPopup(GoogleAuthProvider)`). Authentication state is exposed throughout the application via `AuthProvider` and `useAuth()`. Upon acquiring or refreshing the Firebase ID token, the client queries `/api/auth/me` via the shared contract (`@sumio/contract`) to populate the user profile and settings.
3. **Route Protection & Bidirectional Redirects**:
   - Private routes under `_app` inspect `useAuth()`. If unauthenticated or token expired, users are redirected to `/login` with a redirect query parameter.
   - Auth routes under `_auth` automatically redirect authenticated users back to the dashboard (`/`).
4. **Form Management & Validation**: Forms are built using `react-hook-form` paired with `@hookform/resolvers/zod` and strict Zod validation schemas, guaranteeing unified error messaging and accessible focus management.
5. **Component Wrapper Compliance**: All form controls strictly consume Design System primitives from `@/components/ui/` (`Input`, `Button`, `Typography`, and the new `Checkbox` wrapper), prohibiting ad-hoc Tailwind color utilities or unvetted external imports.
6. **Adaptive Mobile Layout**: On screens below 1024px/768px, the illustration adapts into a streamlined banner with a gentle gradient transition, ensuring ergonomic typing and optimal keyboard viewport management on mobile devices.

## Consequences
- Seamless alignment with the backend's JIT user provisioning and Firebase Auth guard.
- Clean separation of concerns: public auth pages and private application routes operate under distinct layout lifecycles without leaking states or layout chrome.
- Addition of `firebase`, `react-hook-form`, and `@hookform/resolvers` dependencies to `sumio-fe`.
