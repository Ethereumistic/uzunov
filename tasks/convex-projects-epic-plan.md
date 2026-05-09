# Admin Panel — Technical Implementation Spec

**Stack:** TanStack Start · TypeScript · Tailwind CSS v4 · ShadCN-UI · Convex  
**Package manager:** `vp` (Vite-based — use `vp install`, `vp run dev`, `vp dlx`)  
**Goal:** Full admin CMS for projects, protected by Convex Auth (email+password), with WYSIWYG creation UI, bilingual fields, image upload → Sharp WebP conversion, and migration of all existing JSON projects into Convex.

---

## Phase 0 — Cleanup

### 0.1 Remove better-auth
- Uninstall the `better-auth` package: `vp remove better-auth` (and any related packages it pulled in).
- Delete any auth config files it created (e.g. `auth.ts`, `lib/auth.ts`, `lib/auth-client.ts`).
- Remove any better-auth route handlers if present.
- Remove its env vars from `.env.local`.

### 0.2 Nuke placeholder Convex tables
- Open `convex/schema.ts` and delete all existing table definitions (e.g. `products`, `todos`, and anything else that is not yours).
- Delete the corresponding Convex function files (e.g. `convex/products.ts`, `convex/todos.ts`).
- The schema file should be essentially blank (just the import) after this step — the real schema is defined in Phase 2.

---

## Phase 1 — Install & Configure Convex Auth

### 1.1 Install
```
vp install @convex-dev/auth @auth/core
```

### 1.2 Initialize
```
vp dlx convex dev
```
Run the interactive auth setup if prompted, or manually follow the steps below.

### 1.3 `convex/auth.ts`
```ts
import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [Password],
});
```

### 1.4 `convex/http.ts`
```ts
import { httpRouter } from "convex/server";
import { auth } from "./auth";

const http = httpRouter();
auth.addHttpRoutes(http);
export default http;
```

### 1.5 Environment variables
Add to `.env.local`:
```
CONVEX_SITE_URL=http://localhost:3000
AUTH_SECRET=<generate with: openssl rand -hex 32>
```
Also set `AUTH_SECRET` in your Convex deployment dashboard under Environment Variables. ( I will do that manually)

### 1.6 `convex/schema.ts` — auth tables
`@convex-dev/auth` requires specific tables. Add them using the helper:
```ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  // project tables added in Phase 2
});
```

### 1.7 Seed the single admin user
Create `convex/seed.ts` as an internal mutation (not exposed publicly):
```ts
import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

// Run once via the Convex dashboard: Functions > seed > Run
export const createAdmin = internalMutation({
  args: { email: v.string(), password: v.string() },
  handler: async (ctx, { email, password }) => {
    // Uses the Password provider's hashing internally — 
    // call signIn from the client once, or insert via the dashboard.
    // See note below.
  },
});
```
**Note for the implementing agent:** The simplest way to seed admin credentials with `@convex-dev/auth` + Password provider is to simply use the login form on `/admin` the first time — the Password provider will create the user on first sign-in if `allowExtraProviders` or a registration flow is enabled. Set up the form to handle both sign-in and sign-up, then after first use, remove the "register" path and only allow sign-in. Alternatively, call `signIn("password", { email, password, flow: "signUp" })` from the frontend once to bootstrap.

### 1.8 Frontend auth provider
Wrap the app root (TanStack Start's `__root.tsx`) with `ConvexAuthProvider`:
```tsx
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

// In the root component:
<ConvexAuthProvider client={convex}>
  <Outlet />
</ConvexAuthProvider>
```

---

## Phase 2 — Convex Schema (Projects)

Replace the nuked schema with this full definition in `convex/schema.ts`:

```ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,

  projects: defineTable({
    // ── Slug (URL-friendly, unique, auto-generated from BG title) ──
    slug: v.string(),

    // ── Bilingual fields ──
    title_bg: v.string(),
    title_en: v.string(),
    description_bg: v.optional(v.string()),
    description_en: v.optional(v.string()),
    location_bg: v.string(),
    location_en: v.string(),
    investor_bg: v.string(),
    investor_en: v.string(),

    // ── Language-neutral fields ──
    category: v.union(
      v.literal("Office"),
      v.literal("Healthcare"),
      v.literal("Commercial"),
      v.literal("Industrial"),
      v.literal("Residential"),
      v.literal("Interior"),
    ),
    area: v.optional(v.number()),
    completionDate: v.optional(v.string()),  // ISO date string "YYYY-MM-DD"
    featured: v.boolean(),
    status: v.union(v.literal("done"), v.literal("in-progress")),

    // ── Awards (bilingual array) ──
    awards: v.array(v.object({
      text_bg: v.string(),
      text_en: v.string(),
    })),

    // ── Images (stored in Convex File Storage) ──
    images: v.array(v.object({
      storageId: v.id("_storage"),
      ar: v.union(v.literal("L"), v.literal("S"), v.literal("V")),
    })),

    // ── Sub-buildings / details (bilingual name) ──
    details: v.optional(v.array(v.object({
      name_bg: v.string(),
      name_en: v.string(),
      area: v.number(),
    }))),

    // ── Ordering ──
    order: v.number(),  // for manual reordering later

    // ── Timestamps ──
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_category", ["category"])
    .index("by_featured", ["featured"]),
});
```

---

## Phase 3 — Convex Functions

### 3.1 `convex/projects.ts` — queries & mutations

```ts
// Public queries (used by the public-facing website)
export const list = query(...)           // all projects, ordered by `order`
export const listByCategory = query(...) // filtered by category
export const getBySlug = query(...)      // single project by slug — replaces getProjectById

// Admin mutations (require auth check: ctx.auth.getUserIdentity())
export const create = mutation(...)      // insert new project
export const update = mutation(...)      // update existing project by id
export const remove = mutation(...)      // delete project + delete all its storage files
export const reorder = mutation(...)     // update `order` field for drag-reorder
```

Every admin mutation must start with:
```ts
const identity = await ctx.auth.getUserIdentity();
if (!identity) throw new Error("Unauthorized");
```

### 3.2 `convex/images.ts` — Sharp WebP conversion action

```ts
"use node";  // REQUIRED — Sharp needs Node.js runtime

import { action } from "./_generated/server";
import { v } from "convex/values";
import sharp from "sharp";

// Step 1: get an upload URL (called from frontend before uploading)
export const generateUploadUrl = mutation(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthorized");
  return await ctx.storage.generateUploadUrl();
});

// Step 2: after raw PNG is PUT to the upload URL, call this action
// It reads the raw file from storage, converts to WebP, stores the WebP,
// deletes the original raw file, and returns the new storageId.
export const convertToWebp = action({
  args: {
    rawStorageId: v.id("_storage"),
    quality: v.optional(v.number()),  // default 82
  },
  handler: async (ctx, { rawStorageId, quality = 82 }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // Read raw bytes from storage
    const blob = await ctx.storage.get(rawStorageId);
    if (!blob) throw new Error("File not found in storage");
    const arrayBuffer = await blob.arrayBuffer();

    // Convert to WebP
    const webpBuffer = await sharp(Buffer.from(arrayBuffer))
      .webp({ quality })
      .toBuffer();

    // Store WebP
    const webpBlob = new Blob([webpBuffer], { type: "image/webp" });
    const webpStorageId = await ctx.storage.store(webpBlob);

    // Delete the raw original to save storage
    await ctx.storage.delete(rawStorageId);

    return { storageId: webpStorageId };
  },
});

// Helper: get a public URL for a storageId
export const getImageUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, { storageId }) => {
    return await ctx.storage.getUrl(storageId);
  },
});
```

Install Sharp: `vp install sharp`

### 3.3 Upload flow (large file strategy — bypasses 8MB arg limit)

```
1. Frontend calls generateUploadUrl mutation → gets a one-time PUT URL
2. Frontend PUT's the raw PNG directly to that URL (fetch with method: "POST", body: file)
   → Convex returns a storageId for the raw file
3. Frontend calls convertToWebp action with that rawStorageId
   → Action converts PNG → WebP in Node.js, stores WebP, deletes raw, returns webpStorageId
4. Frontend stores { storageId: webpStorageId, ar: selectedAR } in the images array
```

---

## Phase 4 — Slug Generation Utility

Create `src/lib/slugify.ts`:

```ts
// Transliteration map: Bulgarian Cyrillic → Latin
const CYRILLIC_MAP: Record<string, string> = {
  'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ж':'zh','з':'z',
  'и':'i','й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p',
  'р':'r','с':'s','т':'t','у':'u','ф':'f','х':'h','ц':'ts','ч':'ch',
  'ш':'sh','щ':'sht','ъ':'a','ь':'','ю':'yu','я':'ya',
  'А':'A','Б':'B','В':'V','Г':'G','Д':'D','Е':'E','Ж':'Zh','З':'Z',
  'И':'I','Й':'Y','К':'K','Л':'L','М':'M','Н':'N','О':'O','П':'P',
  'Р':'R','С':'S','Т':'T','У':'U','Ф':'F','Х':'H','Ц':'Ts','Ч':'Ch',
  'Ш':'Sh','Щ':'Sht','Ъ':'A','Ь':'','Ю':'Yu','Я':'Ya',
};

export function slugify(bgTitle: string): string {
  return bgTitle
    .split('')
    .map(char => CYRILLIC_MAP[char] ?? char)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);  // max slug length
}
```

This is used in the admin form: as the user types `title_bg`, the slug field auto-populates live but remains editable for manual overrides.

---

## Phase 5 — Migration Script

Create `convex/migrations.ts` as an internal mutation:

```ts
import { internalMutation } from "./_generated/server";
import { slugify } from "../src/lib/slugify";  // adjust path
// Import the raw JSON — Convex functions can import from the project
import projectsJson from "../src/data/projects.json";

export const seedFromJson = internalMutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    // This is an internal mutation so no auth check needed,
    // but run it ONCE from the Convex dashboard only.

    for (let i = 0; i < projectsJson.length; i++) {
      const p = projectsJson[i];
      await ctx.db.insert("projects", {
        slug: slugify(p.title),  // auto-generate slug from BG title
        title_bg: p.title,
        title_en: p.title,  // placeholder — admin can update EN fields later
        description_bg: p.description ?? undefined,
        description_en: p.description ?? undefined,
        location_bg: p.location,
        location_en: p.location,  // placeholder
        investor_bg: p.investor,
        investor_en: p.investor,  // placeholder
        category: p.category as any,
        area: p.area ?? undefined,
        completionDate: p.completionDate ?? undefined,
        featured: p.featured,
        status: p.status as any,
        awards: p.awards.map(a => ({ text_bg: a, text_en: a })),
        // For existing projects, images have external URLs (jsdelivr CDN).
        // Store them differently: extend schema with a legacy URL fallback,
        // OR store as empty array and let admin re-upload.
        // Recommended: add an optional `url` field alongside `storageId` for migration:
        images: [],  // existing project images remain on CDN — see note below
        details: p.details?.map(d => ({
          name_bg: d.name,
          name_en: d.name,
          area: d.area,
        })),
        order: i,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
  },
});
```

**Migration image note:** Existing project images live on `cdn.jsdelivr.net`. Two options:
- **Option A (recommended):** Add `url_legacy: v.optional(v.string())` to the images array schema. Migration stores the CDN URL there. The public-facing image component checks `storageId` first, falls back to `url_legacy`. New uploads always use `storageId`.
- **Option B:** Leave images empty for migrated projects. Admin re-uploads them through the new UI.

The spec recommends Option A since it preserves all existing images without any re-upload work.

**Run the migration:** In the Convex dashboard → Functions → `migrations:seedFromJson` → Run (once). After confirming all 16 projects are in the DB, you may delete or archive `projects.json` and `projects.ts` data files.

---

## Phase 6 — Public Website: Switch from JSON to Convex

### 6.1 Update route param to slug
Rename (or update) the route file from `routes/projects/$projectId.tsx` to `routes/projects/$slug.tsx`.

```ts
export const Route = createFileRoute("/projects/$slug")({
  component: ProjectDetailPage,
});

function ProjectDetailPage() {
  const { slug } = Route.useParams();
  const project = useQuery(api.projects.getBySlug, { slug });
  // ...
}
```

### 6.2 Update projects index page
Replace static import of `projects` array with:
```ts
const projects = useQuery(api.projects.list) ?? [];
```

### 6.3 Update ProjectCard links
Change `to="/projects/$projectId"` → `to="/projects/$slug"` with `params={{ slug: project.slug }}`.

### 6.4 Image rendering helper
Create `src/components/ui/ProjectImage.tsx` — renders Convex storage images OR legacy CDN URLs:
```tsx
function ProjectImage({ image, ...props }) {
  // if storageId exists, use Convex URL via useQuery(api.images.getImageUrl)
  // else fall back to image.url_legacy
}
```

---

## Phase 7 — Route Structure

```
src/routes/
├── admin/
│   ├── _layout.tsx          ← admin layout with ShadCN Sidebar, auth guard
│   ├── index.tsx            ← redirects to /admin/projects
│   └── projects/
│       ├── index.tsx        ← projects list table
│       ├── new.tsx          ← WYSIWYG create form
│       └── $projectId/
│           └── edit.tsx     ← same form pre-populated for editing
├── projects/
│   ├── index.tsx            ← public projects list (updated to use Convex)
│   └── $slug.tsx            ← public project detail (updated to use slug + Convex)
└── login.tsx (or admin/login.tsx)  ← email+password login form
```

### Auth guard in `_layout.tsx`
```tsx
import { useConvexAuth } from "convex/react";
import { Navigate } from "@tanstack/react-router";

function AdminLayout() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  if (isLoading) return <div>Loading…</div>;
  if (!isAuthenticated) return <Navigate to="/admin/login" />;
  return (
    <SidebarProvider>
      <AdminSidebar />
      <main><Outlet /></main>
    </SidebarProvider>
  );
}
```

---

## Phase 8 — Admin Login Page (`/admin/login`)

Simple centered card, no sidebar:

```
┌─────────────────────────────────┐
│                                 │
│         [Logo / wordmark]       │
│                                 │
│   Email ________________________│
│   Password _____________________│
│                                 │
│         [Sign In  →]            │
│                                 │
│   (error message if any)        │
└─────────────────────────────────┘
```

```tsx
import { useAuthActions } from "@convex-dev/auth/react";

function AdminLogin() {
  const { signIn } = useAuthActions();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signIn("password", { email, password, flow: "signIn" });
    // TanStack Router will redirect to /admin via the auth guard
  };
}
```

On first-ever use (bootstrapping admin), temporarily allow `flow: "signUp"` then revert to `"signIn"` only.

---

## Phase 9 — Admin Sidebar

Use ShadCN `Sidebar` component you already have installed.

```
┌──────────────────┐
│  [Logo]  Узунов  │
├──────────────────┤
│                  │
│ 📁 Projects      │  ← SidebarMenuItem, links to /admin/projects
│                  │
│ ── future items  │
│                  │
├──────────────────┤
│ [Sign Out]       │  ← calls signOut() from useAuthActions()
└──────────────────┘
```

```tsx
import { useAuthActions } from "@convex-dev/auth/react";
import {
  Sidebar, SidebarContent, SidebarHeader,
  SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter,
} from "#/components/ui/sidebar";

export function AdminSidebar() {
  const { signOut } = useAuthActions();
  return (
    <Sidebar>
      <SidebarHeader>...</SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/admin/projects">
                <FolderOpen /> Projects
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <Button variant="ghost" onClick={() => signOut()}>Sign Out</Button>
      </SidebarFooter>
    </Sidebar>
  );
}
```

---

## Phase 10 — Admin Projects List (`/admin/projects`)

A clean data table showing all projects:

```
┌──────────────────────────────────────────────────────────────────┐
│  Projects                                    [+ New Project]     │
├──────┬─────────────────────────────┬──────────┬─────────┬───────┤
│ Img  │ Title (BG)                  │ Category │ Status  │       │
├──────┼─────────────────────────────┼──────────┼─────────┼───────┤
│ 🖼   │ Офис сграда - ГАБРОВО       │ Office   │ ✓ Done  │ ✏ 🗑  │
│ 🖼   │ МОЛ ГАБРОВО                 │ Commerce │ ✓ Done  │ ✏ 🗑  │
└──────┴─────────────────────────────┴──────────┴─────────┴───────┘
```

- "New Project" button → navigates to `/admin/projects/new`
- Edit icon → navigates to `/admin/projects/$projectId/edit`
- Delete icon → confirm dialog → calls `api.projects.remove`
- Use ShadCN `Table` component

---

## Phase 11 — WYSIWYG Project Editor (`/admin/projects/new` and `.../edit`)

This is the most complex piece. The form is a **split-pane live preview** that mirrors the public `$slug.tsx` layout exactly.

### 11.1 Overall layout

```
┌─────────────────────────────────────────────────────────────────────┐
│  ← Projects    New Project                     [Save Draft] [Publish]│
├──────────────────────────────┬──────────────────────────────────────┤
│  EDITOR PANEL (left)         │  LIVE PREVIEW (right, read-only)     │
│  50% width                   │  50% width, matches public page      │
│                              │                                      │
│  [BG] [EN]  ← language tabs  │  (renders exactly like $slug.tsx)   │
│                              │                                      │
│  Title _____________________ │                                      │
│  Slug  _____________________ │  [PageHeader with title]             │
│  (auto from BG, editable)    │                                      │
│                              │  ┌──────────────┐  ┌─────────────┐  │
│  Category [dropdown]         │  │ Main Carousel │  │ Details     │  │
│  Status   [dropdown]         │  │              │  │ Card        │  │
│  Featured [toggle]           │  │              │  │             │  │
│                              │  └──────────────┘  └─────────────┘  │
│  ── Images ─────────────────│  ┌──────────────────────────────┐   │
│  [Drop zone — main image]    │  │ Bento Grid                   │   │
│                              │  └──────────────────────────────┘   │
│  [Drop zone — extra images]  │                                      │
│  (drag to reorder, AR badge) │                                      │
│                              │                                      │
│  ── Details ─────────────── │                                      │
│  Location __________________ │                                      │
│  Area     __________________ │                                      │
│  Investor __________________ │                                      │
│  Completion date [picker]    │                                      │
│                              │                                      │
│  ── Awards ──────────────── │                                      │
│  [+ Add award]               │                                      │
│  • award text ____________ ✕ │                                      │
│                              │                                      │
│  ── Sub-buildings ────────── │                                      │
│  [+ Add building]            │                                      │
│  name _______ area ______ ✕  │                                      │
│                              │                                      │
│  ── Description ──────────── │                                      │
│  [textarea]                  │                                      │
└──────────────────────────────┴──────────────────────────────────────┘
```

### 11.2 Language tab behavior
- Two tabs at the top of the editor panel: **[BG]** and **[EN]**
- When **BG** is active: show `title_bg`, `description_bg`, `location_bg`, `investor_bg`, `awards[i].text_bg`, `details[i].name_bg`
- When **EN** is active: show the `_en` counterparts
- Language-neutral fields (category, area, status, featured, completionDate, images, slug) are always visible regardless of tab
- The live preview on the right always shows the **currently active language tab**

### 11.3 Image drop zones

#### Main image (carousel position 0)
```
┌─────────────────────────────────────┐
│                                     │
│   Drag main image here              │
│   or click to select                │
│                                     │
│   [AR: L / S / V]  ← select badge  │
└─────────────────────────────────────┘
```
- Aspect ratio `ar` selector: three clickable badges `L` `S` `V`, default `L`
- On drop: triggers the upload flow (Phase 3.3 three-step process)
- Shows upload progress spinner
- Once uploaded: shows thumbnail with `×` remove button

#### Extra images (positions 1+)
- A multi-drop zone that accepts multiple files
- Each uploaded image shows as a thumbnail card with:
  - `ar` selector (L/S/V)
  - drag handle for reordering
  - `×` remove button
- The bento grid in the preview updates live as images are added/reordered/removed

### 11.4 Slug field behavior
```tsx
// Auto-populate from BG title as user types
useEffect(() => {
  if (!slugManuallyEdited) {
    setSlug(slugify(formState.title_bg));
  }
}, [formState.title_bg]);
```
- Slug field is editable — once user manually changes it, auto-population stops
- Show the full URL preview: `projekti.uzunov.bg/projects/[slug]` (greyed out)

### 11.5 Form state shape (TypeScript)
```ts
interface ProjectFormState {
  slug: string;
  title_bg: string; title_en: string;
  description_bg: string; description_en: string;
  location_bg: string; location_en: string;
  investor_bg: string; investor_en: string;
  category: ProjectCategory;
  area: string;  // string in form, parsed to number on save
  completionDate: string;
  featured: boolean;
  status: "done" | "in-progress";
  awards: Array<{ text_bg: string; text_en: string }>;
  details: Array<{ name_bg: string; name_en: string; area: string }>;
  images: Array<{ storageId: string; ar: "L" | "S" | "V"; url_legacy?: string }>;
}
```

### 11.6 Save / Publish flow
- **Save Draft:** saves with `status` unchanged, no navigation
- **Publish:** saves and navigates back to `/admin/projects`
- On create: calls `api.projects.create`
- On edit: calls `api.projects.update`
- Validation: `title_bg`, `slug`, `category`, `location_bg`, `investor_bg` are required
- Show inline validation errors below fields using ShadCN `FormMessage`

### 11.7 Live preview implementation
The right pane renders a **scaled-down replica** of `$slug.tsx` using the same components (`MainCarousel`, `ProjectBentoGrid`, detail rows, awards section) but fed from `formState` instead of a Convex query. Extract these components from `$projectId.tsx` into shared components so both the public page and the preview can use them.

Suggested extraction:
```
src/components/projects/
├── ProjectDetailView.tsx    ← the full layout, accepts a Project prop
├── MainCarousel.tsx         ← extracted from $slug.tsx
├── ProjectBentoGrid.tsx     ← extracted from $slug.tsx
├── ProjectDetailCard.tsx    ← right-side info card
└── ProjectImage.tsx         ← storageId + url_legacy fallback renderer
```

The public `$slug.tsx` then becomes:
```tsx
function ProjectDetailPage() {
  const { slug } = Route.useParams();
  const project = useQuery(api.projects.getBySlug, { slug });
  const locale = useLocale();  // BG or EN
  return <ProjectDetailView project={project} locale={locale} />;
}
```

The admin preview:
```tsx
<div className="scale-[0.6] origin-top-left w-[166%]">
  <ProjectDetailView project={formStateAsProject} locale={activeTab} />
</div>
```
(CSS scale trick to fit the full-width layout into the 50% preview pane)

---

## Phase 12 — i18n Compatibility Notes

The project schema is i18n-ready from day one. When you add internationalization:
- The router/locale context provides the current language (`bg` | `en`)
- `ProjectDetailView` accepts a `locale` prop and picks `title_bg` vs `title_en` etc.
- The Convex `getBySlug` query returns the full document — the component does the field selection, not the query
- Slugs are language-neutral (always generated from BG title), so URLs don't change between languages

---

## Implementation Order for the Agent

Execute phases strictly in this order. Each phase should be committed and tested before moving to the next.

1. **Phase 0** — Remove better-auth, nuke placeholder tables
2. **Phase 1** — Install + configure @convex-dev/auth, test login works
3. **Phase 2** — Define full Convex schema, run `vp dlx convex dev` to push
4. **Phase 3** — Write Convex functions (queries, mutations, Sharp action), install Sharp with `vp install sharp`
5. **Phase 4** — Write slugify utility
6. **Phase 5** — Write and run migration script, verify all 16 projects appear in Convex dashboard
7. **Phase 6** — Update public routes to use Convex queries + slug param
8. **Phase 7** — Create route structure (files only, no logic yet)
9. **Phase 8** — Build login page, test full auth flow
10. **Phase 9** — Build admin sidebar + layout with auth guard
11. **Phase 10** — Build projects list table
12. **Phase 11a** — Extract shared components from `$projectId.tsx`
13. **Phase 11b** — Build project editor form (text fields + language tabs)
14. **Phase 11c** — Build image upload zones + Sharp conversion flow
15. **Phase 11d** — Wire up live preview with form state
16. **Phase 11e** — Test create → view on public site end-to-end
17. **Phase 11f** — Build edit flow (pre-populate form from existing project)

---

## Key Files Summary

| File | Purpose |
|---|---|
| `convex/auth.ts` | Convex Auth config with Password provider |
| `convex/http.ts` | HTTP router with auth routes |
| `convex/schema.ts` | Full schema: authTables + projects |
| `convex/projects.ts` | Public queries + admin mutations |
| `convex/images.ts` | generateUploadUrl mutation + convertToWebp action |
| `convex/migrations.ts` | One-time seed from projects.json |
| `src/lib/slugify.ts` | BG Cyrillic → Latin slug generator |
| `src/routes/admin/_layout.tsx` | Sidebar layout + auth guard |
| `src/routes/admin/login.tsx` | Email+password login form |
| `src/routes/admin/projects/index.tsx` | Projects table |
| `src/routes/admin/projects/new.tsx` | WYSIWYG create form |
| `src/routes/admin/projects/$projectId/edit.tsx` | WYSIWYG edit form |
| `src/routes/projects/$slug.tsx` | Updated public detail page |
| `src/components/projects/ProjectDetailView.tsx` | Shared layout component |
| `src/components/projects/MainCarousel.tsx` | Extracted carousel |
| `src/components/projects/ProjectBentoGrid.tsx` | Extracted bento grid |
| `src/components/projects/ProjectImage.tsx` | storageId + legacy URL renderer |