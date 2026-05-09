# Wiring Document — Admin Panel Implementation Plan

> **Purpose:** This document is the single source of truth for wiring the entire admin panel implementation. Another AI agent can read this document and safely implement the whole plan, phase by phase, following the specified order.

---

## Overview

| Item | Value |
|------|-------|
| **Project** | Uzunov Architecture — Admin CMS |
| **Stack** | TanStack Start, TypeScript, Tailwind CSS v4, ShadCN-UI, Convex |
| **Package Manager** | `vp` (Vite-based — use `vp install`, `vp run dev`, `vp dlx`) |
| **Goal** | Full admin CMS for projects, protected by Convex Auth (email+password), with WYSIWYG creation UI, bilingual fields, image upload → Sharp WebP conversion, and migration of all 16 existing JSON projects into Convex |

---

## Current State of the Codebase

Before starting, understand what already exists:

### Files to BE REMOVED (Phase 00)
| File | Reason |
|------|--------|
| `src/lib/auth.ts` | better-auth config — replaced by `@convex-dev/auth` |
| `src/lib/auth-client.ts` | better-auth client — replaced by `@convex-dev/auth/react` |
| `src/integrations/better-auth/` | Entire directory — better-auth integration |
| `src/routes/demo/better-auth.tsx` | Demo route for better-auth |
| `convex/todos.ts` | Placeholder Convex functions |
| `src/data/projects.jsony` | Backup file |
| `src/data/demo-table-data.ts` | Demo data |

### Files to BE MODIFIED
| File | What Changes |
|------|-------------|
| `convex/schema.ts` | Nuke placeholder tables → auth tables → full project schema |
| `.env.local` | Remove better-auth vars, add Convex Auth vars |
| `src/integrations/convex/provider.tsx` | Add `ConvexAuthProvider` wrapper |
| `src/routes/__root.tsx` | Auth provider already in the tree via `ConvexProvider` |
| `src/routes/projects/$projectId.tsx` | Rename to `$slug.tsx`, switch to Convex query |
| `src/routes/projects/index.tsx` | Switch from static JSON to Convex `useQuery` |
| `src/components/projects/ProjectCard.tsx` | Use slug links instead of ID links, use Convex types |
| `package.json` | Add/remove packages |

### Files to BE CREATED (in execution order)
| Phase | File | Purpose |
|-------|------|---------|
| 01 | `convex/auth.ts` | Convex Auth config with Password provider |
| 01 | `convex/http.ts` | HTTP router with auth routes |
| 03 | `convex/projects.ts` | Public queries + admin mutations |
| 03 | `convex/images.ts` | Image upload URL + Sharp WebP conversion action |
| 04 | `src/lib/slugify.ts` | BG Cyrillic → Latin slug generator |
| 05 | `convex/migrations.ts` | One-time seed from projects.json |
| 06 | `src/components/projects/ProjectImage.tsx` | Dual-source image renderer |
| 06 | `src/types/project.ts` | Shared TypeScript types |
| 07 | `src/routes/admin/_layout.tsx` | Admin layout with auth guard |
| 07 | `src/routes/admin/index.tsx` | Redirects to /admin/projects |
| 07 | `src/routes/admin/projects/index.tsx` | Projects table |
| 07 | `src/routes/admin/projects/new.tsx` | Create form |
| 07 | `src/routes/admin/projects/$projectId/edit.tsx` | Edit form |
| 07 | `src/components/admin/AdminSidebar.tsx` | Sidebar navigation |
| 08 | `src/routes/admin-login.tsx` (or `admin/login.tsx`) | Login page |
| 11a | `src/components/projects/ProjectDetailView.tsx` | Shared project layout |
| 11a | `src/components/projects/MainCarousel.tsx` | Extracted carousel |
| 11a | `src/components/projects/ProjectBentoGrid.tsx` | Extracted bento grid |
| 11a | `src/components/projects/ProjectDetailCard.tsx` | Right-side info card |
| 11a | `src/hooks/useProjectImages.ts` | Image URL resolution hook |
| 11b | `src/types/project-form.ts` | Form state types |
| 11c | `src/hooks/useImageUpload.ts` | Image upload hook |
| 11c | `src/components/admin/ImageDropZone.tsx` | Single image drop zone |
| 11c | `src/components/admin/MultiImageDropZone.tsx` | Multi-image drop zone |
| 11d | `src/lib/formToProject.ts` | Form → Project converter |
| 11d | `src/components/admin/ProjectPreview.tsx` | Live preview pane |
| 11f | `src/lib/projectToForm.ts` | Project → Form converter |
| 11f | `src/components/admin/ProjectEditor.tsx` | Shared editor component |

---

## Execution Order (STRICT)

Execute phases **in this exact order**. Each phase must be committed and tested before moving to the next.

```
Phase 00: Cleanup — Remove better-auth, nuke placeholder tables
   ↓
Phase 01: Auth Setup — Install & configure @convex-dev/auth
   ↓
Phase 02: Schema — Define full Convex schema (projects table)
   ↓
Phase 03: Convex Functions — Queries, mutations, Sharp action
   ↓
Phase 04: Slugify — BG Cyrillic → Latin slug utility
   ↓
Phase 05: Migration — Seed 16 projects from JSON into Convex
   ↓
Phase 06: Public Routes — Switch from JSON to Convex queries, slug routing
   ↓
Phase 07: Admin Routes — Create route file structure (placeholder pages)
   ↓
Phase 08: Login Page — Email+password login form
   ↓
Phase 09: Admin Sidebar — ShadCN sidebar with nav + sign-out
   ↓
Phase 10: Projects List — Admin table with edit/delete actions
   ↓
Phase 11a: Extract Components — Pull shared components from $projectId.tsx
   ↓
Phase 11b: Editor Form — Text fields, language tabs, slug auto-gen
   ↓
Phase 11c: Image Upload — Drop zones, Sharp WebP conversion pipeline
   ↓
Phase 11d: Live Preview — Split-pane with real-time ProjectDetailView
   ↓
Phase 11e: E2E Test — Manual verification of create → view flow
   ↓
Phase 11f: Edit Flow — Pre-populate form from existing project
   ↓
Phase 12: Documentation — i18n notes, future work, cleanup
```

---

## Key Dependencies Between Phases

```
00 (cleanup) ← standalone, no deps
01 (auth) ← depends on 00 (better-auth removed first)
02 (schema) ← depends on 01 (needs authTables)
03 (functions) ← depends on 02 (schema must exist)
04 (slugify) ← standalone, no deps (can run in parallel with 02-03)
05 (migration) ← depends on 02, 04 (schema + slugify)
06 (public routes) ← depends on 03, 05 (queries working + data seeded)
07 (admin routes) ← depends on 01 (auth must work)
08 (login) ← depends on 01, 07 (auth + route structure)
09 (sidebar) ← depends on 08 (login must work)
10 (projects list) ← depends on 03, 09 (queries + sidebar)
11a (extract) ← depends on 06 (public routes using Convex)
11b (editor form) ← depends on 10, 04, 07 (list page + slugify + routes)
11c (image upload) ← depends on 03, 11b (Sharp action + form)
11d (live preview) ← depends on 11a, 11b (shared components + form)
11e (e2e test) ← depends on 11c, 11d (images + preview)
11f (edit flow) ← depends on 11b, 11e (form + verified flow)
12 (docs) ← depends on all above
```

---

## Packages to Install/Remove

### Remove (Phase 00)
```bash
vp remove better-auth
```

### Install (Phase 01)
```bash
vp install @convex-dev/auth
```

### Install (Phase 03)
```bash
vp install sharp
```

### Install (Phase 09 — I've already ran these commands, so we have the shadcn components)
```bash
vp dlx shadcn@latest add sidebar
vp dlx shadcn@latest add table
vp dlx shadcn@latest add dialog
vp dlx shadcn@latest add dropdown-menu
vp dlx shadcn@latest add badge
```

---

## Environment Variables

### Remove from `.env.local`
```
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=57d51dd70452049caea39e8c2d8bc49f752c16c14b12bcb25ef05cb21b67355f
```

### Add to `.env.local`
```
CONVEX_SITE_URL=http://localhost:3000
AUTH_SECRET=<generate with: openssl rand -hex 32>
```

### Add to Convex Dashboard (Environment Variables)
```
AUTH_SECRET=<same value as .env.local>
```

---

## Convex Dashboard Steps

After pushing schema and function changes (`vp dlx convex dev`):

1. **Phase 01:** Verify auth tables appear (`users`, `sessions`, `accounts`, `verificationCodes`)
2. **Phase 02:** Verify `projects` table appears with indexes
3. **Phase 03:** Verify all functions appear (7 functions across 2 modules)
4. **Phase 05:** Run `migrations:seedFromJson` manually with the projects JSON data
5. **Phase 08:** Create the admin user via the sign-up flow

---

## Schema Design Summary

```
projects
├── slug: string (indexed, unique by application logic)
├── title_bg, title_en: string
├── description_bg, description_en: optional string
├── location_bg, location_en: string
├── investor_bg, investor_en: string
├── category: union("Office" | "Healthcare" | "Commercial" | "Industrial" | "Residential" | "Interior")
├── area: optional number
├── completionDate: optional string (ISO date)
├── featured: boolean
├── status: union("done" | "in-progress")
├── awards: array of { text_bg, text_en }
├── images: array of { storageId?, ar, url_legacy? }
├── details: optional array of { name_bg, name_en, area }
├── order: number
├── createdAt, updatedAt: number
└── Indexes: by_slug, by_category, by_featured
```

---

## Image Upload Pipeline

```
Frontend                              Convex
────────                              ──────
1. generateUploadUrl()  ──────────►  Returns one-time PUT URL
2. PUT raw image to URL  ──────────►  Stores raw file, returns storageId
3. convertToWebp(storageId)  ─────►  Sharp converts in Node.js
                                       Stores WebP, deletes raw
                                       Returns webpStorageId
4. Store { storageId, ar } in project images array
```

---

## Authentication Flow

```
1. User visits /admin/* → auth guard checks useConvexAuth()
2. If not authenticated → redirect to /admin-login
3. User enters email + password → signIn("password", { email, password, flow: "signIn" })
4. Convex Auth validates credentials → creates session
5. useConvexAuth() returns isAuthenticated: true → admin layout renders
6. Sign out → signOut() → redirect to /admin-login
```

**Bootstrap:** First-ever admin account is created using `flow: "signUp"` (temporarily enabled), then reverted to `"signIn"` only.

---

## Known Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| `storageId` required but legacy images don't have one | Made `storageId` optional in schema; rendering component falls back to `url_legacy` |
| Image upload pipeline has 3 steps (may fail at any) | Show progress spinner; handle errors with retry UI |
| Slug collision (two projects with same BG title) | Application-level check before save; manual override available |
| Sharp needs Node.js runtime in Convex | `"use node";` directive at top of images.ts |
| Convex 8MB argument limit for file uploads | Bypassed by using `generateUploadUrl` + direct PUT (files never pass as function args) |
| better-auth removal may leave stale imports | Phase 00 explicitly lists all files to delete; grep for `better-auth` after cleanup |
| `vp` package manager is non-standard | All commands documented use `vp`; same as Vite's built-in package manager |

---

## File Location Map

```
convex/
├── _generated/           ← Auto-generated by Convex
├── auth.ts               ← Phase 01: Convex Auth config
├── http.ts               ← Phase 01: HTTP routes for auth
├── schema.ts             ← Phase 02: Full schema (auth + projects)
├── projects.ts           ← Phase 03: Queries + mutations
├── images.ts             ← Phase 03: Upload URL + Sharp conversion
├── migrations.ts         ← Phase 05: One-time seed script
└── tsconfig.json

src/
├── components/
│   ├── admin/
│   │   ├── AdminSidebar.tsx        ← Phase 09
│   │   ├── ImageDropZone.tsx       ← Phase 11c
│   │   ├── MultiImageDropZone.tsx  ← Phase 11c
│   │   └── ProjectEditor.tsx       ← Phase 11f
│   ├── projects/
│   │   ├── ProjectDetailView.tsx   ← Phase 11a
│   │   ├── MainCarousel.tsx        ← Phase 11a
│   │   ├── ProjectBentoGrid.tsx    ← Phase 11a
│   │   ├── ProjectDetailCard.tsx   ← Phase 11a
│   │   ├── ProjectImage.tsx        ← Phase 06
│   │   └── ProjectCard.tsx         ← Phase 06 (modified)
│   ├── layout/                     ← Existing (unchanged)
│   ├── sections/                   ← Existing (unchanged)
│   ├── ui/                         ← ShadCN components (extended)
│   └── ...
├── hooks/
│   ├── useImageUpload.ts           ← Phase 11c
│   └── useProjectImages.ts         ← Phase 11a
├── lib/
│   ├── slugify.ts                  ← Phase 04
│   ├── utils.ts                    ← Existing
│   ├── formToProject.ts            ← Phase 11d
│   └── projectToForm.ts            ← Phase 11f
├── types/
│   ├── project.ts                  ← Phase 06
│   └── project-form.ts             ← Phase 11b
├── routes/
│   ├── __root.tsx                  ← Phase 01 (ConvexAuthProvider)
│   ├── index.tsx                   ← Existing
│   ├── projects/
│   │   ├── index.tsx               ← Phase 06 (modified)
│   │   └── $slug.tsx               ← Phase 06 (renamed from $projectId)
│   ├── admin/
│   │   ├── _layout.tsx             ← Phase 07
│   │   ├── index.tsx               ← Phase 07
│   │   └── projects/
│   │       ├── index.tsx           ← Phase 10
│   │       ├── new.tsx             ← Phase 11b/11c/11d/11f
│   │       └── $projectId/
│   │           └── edit.tsx        ← Phase 11f
│   ├── admin-login.tsx             ← Phase 08
│   └── ...                         ← Other existing routes
├── integrations/
│   └── convex/
│       └── provider.tsx            ← Phase 01 (add ConvexAuthProvider)
└── data/
    ├── projects.json               ← Phase 05 (can delete after migration)
    └── projects.ts                 ← Phase 06 (can delete after migration)
```

---

## Quick-Start for Implementing Agent

1. **Read Phase 00** (`tasks/phases/00-cleanup.md`) — start here
2. **After each phase**, run `vp run dev` and verify no errors
3. **Commit after each phase** with the suggested commit message
4. **After Phase 05**, run the migration from the Convex dashboard
5. **After Phase 08**, create the admin user via sign-up, then revert to sign-in only
6. **After Phase 11e**, do a full manual test of the create → view flow
7. **After Phase 12**, clean up dead code (`projects.json`, `projects.ts`, demo routes)

**Total phases:** 17 (00 through 12, with 11 split into a-f)  
**Estimated total:** ~2-3 days of focused implementation  
**Key risk points:** Phase 01 (auth setup), Phase 03 (Sharp in Convex), Phase 05 (data migration), Phase 11c (upload pipeline)