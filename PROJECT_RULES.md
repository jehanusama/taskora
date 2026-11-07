# Taskora — Project Rules

Every AI session on this project must read this file first. It is the single source of truth for stack, structure, design and working rules.

## 1. Project

Taskora is a production-quality Project Management SaaS (workspaces, projects, Kanban, list view, tasks, comments, members, activity, notifications, analytics).

**Current phase: FRONTEND ONLY with mock data.** Do NOT add Supabase or any real backend yet. All data comes from mock async functions (simulated 400–800 ms delay) wrapped in TanStack Query hooks, so the data layer can be swapped later without touching the UI.

## 2. Stack (actual versions in this repo)

- Next.js 16 (App Router), React, TypeScript strict
- Tailwind CSS v4 — there is NO tailwind.config file. The theme lives in `src/app/globals.css` (`@theme inline` + CSS variables).
- shadcn/ui (new version) in `src/components/ui/` — do not edit these files
- TanStack Query, React Hook Form + Zod, @dnd-kit, next-themes, lucide-react, date-fns, recharts (if installed)
- Do not install new dependencies without saying so in your final report.

### Next.js 16 gotchas
- Route `params` and `searchParams` are **Promises**. In server components/pages: `await params`. In client components: `use(params)` from React.
- Any client component that calls `useSearchParams()` must be rendered inside `<Suspense>` (wrap it in the page), otherwise `next build` fails.
- Add `"use client"` only where needed (state, effects, event handlers, browser APIs).
- Avoid calling `setState` synchronously inside `useEffect` (the linter flags it). Prefer derived values, event handlers, `useSyncExternalStore`, or CSS.

### Base UI (the shadcn primitives in this repo use @base-ui/react, NOT Radix)
- There is NO `asChild` prop. To render a button/trigger as another element use the `render` prop: `<Button render={<Link href="/x" />} nativeButton={false}>Label</Button>`. Same for DialogTrigger, DropdownMenuTrigger, etc.
- Toasts: never call `toast.create`. Always use the helpers in `src/lib/notify.ts` (add helpers there if one is missing). Toaster is mounted in `src/app/layout.tsx`.
- Before using any primitive API from memory, open the file in `src/components/ui/` and check its real props.
- Forms with Zod 4 + @hookform/resolvers: no `as any`. Use `useForm<z.input<typeof schema>, unknown, z.output<typeof schema>>({ resolver: zodResolver(schema), ... })`.

## 3. Folder structure (follow strictly)

```
src/
├── app/                     routes only. Each page.tsx stays thin: it renders one `<XView />` from components/<screen>/ (existing pattern, keep it)
│   ├── (marketing)/page.tsx           landing page "/"
│   ├── (auth)/                        login, register, forgot-password, reset-password, verify-email
│   ├── onboarding/   invite/[token]/
│   ├── (dashboard)/[workspace]/       dashboard, members, settings (tabs: profile / workspace / appearance / notifications), notifications,
│   │                                  projects, projects/[projectId]/{page(overview), board, list, members, activity, settings}
│   └── not-found.tsx, error.tsx, loading.tsx files at the right levels
│   Hrefs are built with helpers from src/config/routes.ts, never hand-written strings (mock workspace slug: "acme").
├── components/
│   ├── ui/                  shadcn primitives (do not edit)
│   ├── shared/              used by 2+ screens (sidebar, navbar, empty-state, page-header, confirm-dialog, badges...)
│   ├── theme/  providers/
│   └── <screen-name>/       components used ONLY by that screen (login/, register/, kanban/, tasks/, projects/, members/, settings/, dashboard/, marketing/ ...)
├── hooks/                   shared hooks (use-auth, use-tasks, use-projects ...)
├── lib/                     utils.ts, validations/ (Zod), mock-data/ (temporary)
├── types/                   shared types (index.ts is accepted)
└── config/site.ts           siteConfig.name = "Taskora" — never hardcode the brand name
```

Rules: one component per file, kebab-case filenames, PascalCase components, typed props, no `any`, small focused components (split anything over ~150 lines). Reuse shared components; never duplicate them.

## 4. Design system

**Personality:** friendly and flexible (Trello-like) but polished and professional (Linear-level finish). Generous spacing, soft shadows, rounded corners, calm colors, obvious hierarchy.

### Colors — semantic tokens ONLY
Never write palette colors such as `bg-blue-500`, `text-gray-600`, `bg-white`, `text-black` or hex values in components. The only exception is the status/priority/label mapping below.

| Use | Token classes |
|---|---|
| Page background | `bg-background text-foreground` |
| Cards, popovers | `bg-card text-card-foreground border border-border` |
| Primary action, links, active states (Sky) | `bg-primary text-primary-foreground`, `text-primary` |
| Soft hover / highlighted rows (light sky) | `bg-accent text-accent-foreground` |
| Success / Done (Emerald) | `bg-success text-success-foreground`, `text-success` |
| Secondary surfaces | `bg-secondary`, `bg-muted`, `bg-muted/40` |
| Secondary text | `text-muted-foreground` |
| Destructive | `bg-destructive text-white`, `bg-destructive/10 text-destructive` |
| Focus ring | `ring-ring` |
| Sidebar | `bg-sidebar text-sidebar-foreground border-sidebar-border`, active `bg-sidebar-accent text-sidebar-accent-foreground` |
| Charts | `var(--chart-1)` … `var(--chart-5)` |

Dark mode must look as good as light mode. It works automatically if only tokens are used — verify visually.

### Token values (src/app/globals.css must match; verify before any visual work)
Light: primary oklch(0.685 0.169 237.323) · accent oklch(0.951 0.026 236.824) / accent-fg oklch(0.4 0.1 237) · success oklch(0.696 0.17 162.48) · ring = primary · radius 0.75rem · charts: sky, emerald, amber oklch(0.769 0.188 70.08), red oklch(0.645 0.246 16.439), violet oklch(0.606 0.25 292.717) · sidebar-primary = primary, sidebar-accent = accent.
Dark: primary oklch(0.746 0.16 232.661) · accent oklch(0.28 0.05 237) / accent-fg oklch(0.9 0.05 236) · success oklch(0.65 0.15 162) · ring = primary · sidebar-primary = primary, sidebar-accent = accent.
Allowed hex exception: the project colour presets list in `create-project-dialog.tsx` (user-chosen data).

### Priority and status mapping (the only allowed palette colors)
```
Priority  low     → text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40
          medium  → text-amber-600   bg-amber-50   dark:text-amber-400   dark:bg-amber-950/40
          high    → text-orange-600  bg-orange-50  dark:text-orange-400  dark:bg-orange-950/40
          urgent  → text-red-600     bg-red-50     dark:text-red-400     dark:bg-red-950/40
Status    todo        → bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300
          in_progress → bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300
          review      → bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300
          done        → bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300
```
These live ONLY in `StatusBadge` / `PriorityBadge` (and the label chips). Everything else imports those components.

### Shape, spacing, type, motion
- Cards: `rounded-xl border border-border bg-card shadow-sm`, interactive cards add `hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`.
- Page padding `p-4 md:p-6`; vertical rhythm `space-y-6`; content max width `max-w-7xl` where relevant.
- Page title `text-2xl font-semibold tracking-tight`; description `text-sm text-muted-foreground`.
- Buttons: shadcn variants only; icon size `h-4 w-4`; icon-only buttons always have `aria-label`.
- Transitions `transition-colors duration-200`; respect `motion-reduce:`.
- Icons: lucide-react only.

### Required states on every screen
1. **Loading** — shadcn `Skeleton` shaped like the final layout (no bare spinners for page content).
2. **Empty** — the shared `EmptyState` (icon, title, helpful text, action button). Use a different message for "no results after filtering" vs "nothing created yet".
3. **Error** — inline message with a retry action.
4. **Responsive** — works at 375 px, 768 px and 1280 px; no horizontal page scroll (except the Kanban board's own scroll area).
5. **Accessible** — semantic HTML, labels tied to inputs, visible focus, keyboard operable, `aria-invalid` + error text on invalid fields.

## 5. Forms
React Hook Form + Zod (`zodResolver`). Schemas in `src/lib/validations/`. Inline error text under each field, submit button disabled + spinner while submitting, success/error feedback via toast or inline banner (never `alert()`).

## 6. Working rules for the AI
1. Work on ONE screen per task. Only touch files related to that screen (plus shared components it genuinely needs).
2. REFINE, do not rebuild: inspect existing files first, keep what works, fix what does not, remove duplicates you find.
3. Reuse existing shared components, hooks, validations and mock data. Do not create a second version of anything that exists.
4. Do not change `src/components/ui/*` or the token values in `globals.css` unless the task says so.
5. Before finishing run `npx tsc --noEmit` and `npm run lint`, and fix everything you introduced.
6. Final reply must be short: files changed, what you fixed, anything you could not do or want a decision on.
