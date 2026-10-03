import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-500 to-sky-400 text-sm font-black text-white shadow-md shadow-indigo-500/20">
              S
            </div>
            <span className="text-lg font-bold tracking-tight text-white">sumio-fe</span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="rounded-full border border-slate-700/80 bg-slate-800 px-2.5 py-1 font-mono text-slate-300">
              React 19 &bull; TS 7
            </span>
            <span className="rounded-full border border-indigo-800/50 bg-indigo-950/60 px-2.5 py-1 font-mono text-indigo-300">
              TanStack Router
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <Outlet />
      </main>

      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        Built with Vite+, React 19, TypeScript 7, Tailwind CSS v4, and Oxlint.
      </footer>
    </div>
  );
}
