# i18n Implementation Guide — Remaining Components

> This guide covers how to update every remaining file to use Paraglide messages instead of hardcoded Bulgarian text.
> All Paraglide message keys are already defined in `messages/bg.json` and `messages/en.json`.
> Import pattern: `import { m } from "../../paraglide/messages"` (adjust relative path per file).
> Call pattern: `m["key.with.dots"]()` — bracket notation because keys contain dots.

## ✅ Already Completed

- `vite.config.ts` — Paraglide plugin added ✅
- `project.inlang/settings.json` — Created ✅
- `messages/bg.json` + `messages/en.json` — Created ✅
- `.gitignore` — Added `src/paraglide/` ✅
- `src/router.tsx` — Added `rewrite` with `deLocalizeUrl`/`localizeUrl` ✅
- `src/routes/__root.tsx` — `beforeLoad`, dynamic `<html lang>`, locale context ✅
- `src/hooks/useLocale.ts` — Created ✅
- `src/lib/localeField.ts` — Created ✅
- `src/components/LanguageSwitcher.tsx` — Created ✅
- `src/components/layout/Navbar.tsx` — Fully updated ✅
- `src/components/layout/Footer.tsx` — Fully updated ✅

---

## 📋 Remaining Components to Update

---

### 1. `src/components/layout/Logo.tsx`

**Import to add:**
```ts
import { m } from "../../paraglide/messages"
```

**Replace:**
```tsx
alt="Узунов Проект Лого"
```
**With:**
```tsx
alt={m["logo.alt"]()}
```

**Replace:**
```tsx
Узунов Проект
```
(in the Logotype `<div>`)
**With:**
```tsx
{m["logo.text"]()}
```

---

### 2. `src/components/layout/Hero.tsx`

**Import to add:**
```ts
import { m } from "../../paraglide/messages"
```

**Changes:**

| Line/Area | Old (BG) | New |
|-----------|----------|-----|
| `heroStats` array labels | `'години'` | `m["hero.stats.years.label"]()` — BUT this is a const array outside the component, so you need to **move `heroStats` inside the `HeroContent` function** so it can call `m.*()` at render time. Alternatively, keep the keys as strings and use `m[key]()`: |

**Best approach for heroStats — move inside component or use a function:**

Replace the static `heroStats` array with a function that returns localized data:

```tsx
function getHeroStats() {
  return [
    { value: '30+', label: m["hero.stats.years.label"](), position: 'top-left' },
    { value: '300+', label: m["hero.stats.projects.label"](), position: 'top-right' },
    { value: 'x1', label: m["hero.stats.facade.label"](), position: 'bottom-left' },
    { value: 'x2', label: m["hero.stats.building.label"](), position: 'bottom-right' },
  ]
}
```

Then inside `HeroContent`: replace `heroStats.map` with `getHeroStats().map`.

**Other Hero text replacements:**

| Old | New |
|-----|-----|
| `Пространства,` | `{m["hero.headline.line1"]()}` |
| `изградени с намерение` | `{m["hero.headline.line2"]()}` |
| `"Архитектура, ориентирана към хората."  Проектираме, създаваме, творим с внимание към детайла.` | `{m["hero.subtitle.line1"]()}  {m["hero.subtitle.line2"]()}` — note the quotes need changing |
| `Нашите проекти` | `{m["hero.cta.projects"]()}` |
| `Свържете се` | `{m["hero.cta.contact"]()}` |
| `aria-label="Слайдове"` | `aria-label={m["aria.slides"]()}` |
| `` aria-label={`Слайд ${i + 1}`} `` | `` aria-label={m["aria.slide"]({ number: String(i + 1) })} `` |

---

### 3. `src/components/layout/HeroSlider.tsx`

**Import to add:**
```ts
import { m } from "../../paraglide/messages"
```

**Replace:**
```tsx
aria-label="Архитектурен визуален панел"
```
**With:**
```tsx
aria-label={m["aria.visualPanel"]()}
```

---

### 4. `src/components/sections/AboutSection.tsx`

**Import to add:**
```ts
import { m } from "../../paraglide/messages"
```

Replace all hardcoded BG text:

| Old | New |
|-----|-----|
| `"За УЗУНОВ ПРОЕКТ"` or similar title | `m["about.title"]()` |
| `"Философия"` | `m["about.philosophy"]()` |
| `"Мисия"` | `m["about.mission"]()` |
| `"Визия"` | `m["about.vision"]()` |
| Any description paragraphs | `m["about.philosophy.text"]()`, etc. — may need to add keys to messages if not present |

> **Note:** Check the actual file content for the exact BG strings. The `about.*.text` keys are in messages but currently empty strings `""`. Fill them with the actual BG and EN content before using.

---

### 5. `src/components/sections/ContactSection.tsx`

**Import to add:**
```ts
import { m } from "../../paraglide/messages"
```

| Old | New |
|-----|-----|
| `"Да създадем нещо значимо"` | `m["contact.title"]()` |
| Description paragraph text | `m["contact.description"]()` |
| `"Пишете ни"` | `m["contact.writeUs"]()` |
| `"Посетете ни"` | `m["contact.visitUs"]()` |
| `"гр. Габрово, бул. \"Васил Априлов\" 46, етаж 7, офис 18"` | `m["contact.address"]()` |
| `"Габрово, България"` (map) | `m["contact.addressCity"]()` |
| `"Вашето име"` | `m["contact.nameLabel"]()` |
| `"Име и фамилия"` (placeholder) | `m["contact.namePlaceholder"]()` |
| `"Имейл адрес"` | `m["contact.emailLabel"]()` |
| `"Телефон"` | `m["contact.phoneLabel"]()` |
| `"Вашето съобщение"` | `m["contact.messageLabel"]()` |
| `"Изпратено ✓"` | `m["contact.sent"]()` |
| `"Изпрати запитване"` | `m["contact.send"]()` |
| `"Отвори картата"` | `m["contact.openMap"]()` |

---

### 6. `src/components/sections/ServicesSection.tsx`

**Import to add:**
```ts
import { m } from "../../paraglide/messages"
```

Replace the hardcoded services array with message calls. Same pattern as Navbar — use `titleKey` and `descKey` entries pointing to Paraglide keys, then call `m[key]()`.

| Old | New |
|-----|-----|
| Section title `"Нашите Услуги"` | `m["services.sectionTitle"]()` |
| Each service title/description | `m["services.architecture.title"]()`, `m["services.architecture.description"]()`, etc. |

---

### 7. `src/components/sections/FeaturedProjects.tsx`

**Import:** `import { m } from "../../paraglide/messages"`

| Old | New |
|-----|-----|
| `"Работа, която говори"` | `m["projects.featuredTitle"]()` |
| Description | `m["projects.featuredDescription"]()` |
| `"Виж всички проекти"` | `m["projects.viewAll"]()` |

---

### 8. `src/components/sections/NumbersSection.tsx`

**Import:** `import { m } from "../../paraglide/messages"`

| Old | New |
|-----|-----|
| `"Студиото в цифри"` | `m["numbers.title"]()` |
| Description | `m["numbers.description"]()` |
| `"Години опит"` | `m["numbers.years"]()` |
| `"Реализирани проекта"` | `m["numbers.projectsCount"]()` |
| `"Доволни клиенти"` | `m["numbers.clients"]()` |

---

### 9. `src/components/sections/OtherProjectsSection.tsx`

**Import:** `import { m } from "../../paraglide/messages"`

| Old | New |
|-----|-----|
| `"Други проекти"` | `m["projects.otherProjects"]()` |
| `"Виж всички проекти"` | `m["projects.viewAll"]()` |

---

### 10. `src/components/sections/OtherServicesSection.tsx`

**Import:** `import { m } from "../../paraglide/messages"`

| Old | New |
|-----|-----|
| `"Други услуги"` | `m["services.otherServices"]()` |

---

### 11. `src/components/projects/ProjectCard.tsx`

**Import to add:**
```ts
import { useLocale } from "../../hooks/useLocale"
import { getLocalizedValue } from "../../lib/localeField"
```

**Changes:**
- Get locale: `const locale = useLocale()` (or receive it as a prop from parent)
- Replace `project.title_bg` → `getLocalizedValue(project, "title", locale)` for display and alt text
- Replace `project.description_bg` → localized if shown

---

### 12. `src/components/projects/ProjectDetailView.tsx`

**Import:** `import { m } from "../../paraglide/messages"`

Already has a `locale` prop. Replace all hardcoded BG/EN text:

| Old | New |
|-----|-----|
| `"Обратно към проекти"` / `"Back to projects"` | `m["projects.backToProjects"]()` |
| `"Имате идея?"` / `"Have an idea?"` | `m["cta.haveIdea"]()` |
| `"Свържете се с нас за консултация..."` / `"Contact us..."` | `m["cta.contactConsultation"]()` |
| `"Свържете се с нас"` / `"Contact Us"` | `m["cta.contactUs"]()` |
| All field label strings using `isBg ? "Местоположение" : "Location"` pattern | Replace with `m["project.location"]()`, etc. |

---

### 13. `src/components/projects/ProjectDetailCard.tsx`

**Import:** `import { m } from "../../paraglide/messages"`

Replace the BG/EN labels object with Paraglide calls:

| Old | New |
|-----|-----|
| `isBg ? "Местоположение" : "Location"` | `m["project.location"]()` |
| `isBg ? "Разгърната площ" : "Total Floor Area"` | `m["project.area"]()` |
| `isBg ? "Инвеститор" : "Investor"` | `m["project.investor"]()` |
| `isBg ? "Завършен" : "Completed"` | `m["project.status.completed"]()` |
| `isBg ? "В процес" : "In Progress"` | `m["project.status.inProgress"]()` |
| `isBg ? "Година" : "Year"` | `m["project.year"]()` |
| `isBg ? "Сгради в комплекса" : "Buildings"` | `m["project.buildings"]()` |
| `isBg ? "Отличия" : "Awards"` | `m["project.awards"]()` |
| `"Награда"` / `"Award"` | `m["project.award"]()` |

For field selection, use `getLocalizedValue(project, "title", locale)` etc.

---

### 14. `src/components/projects/ProjectBentoGrid.tsx`

**Import:** `import { m } from "../../paraglide/messages"`

| Old | New |
|-----|-----|
| `alt="Изображение ${i + 2}"` | `` alt={m["aria.image"]({ number: String(i + 2) })} `` |
| `"снимки"` (overflow text) | `m["project.photos"]()` |

---

### 15. `src/components/projects/MainCarousel.tsx`

**Import:** `import { m } from "../../paraglide/messages"`

| Old | New |
|-----|-----|
| `alt="Изображение ${idx + 1}"` | `` alt={m["aria.image"]({ number: String(idx + 1) })} `` |
| `aria-label="Предишна"` | `aria-label={m["aria.previous"]()}` |
| `aria-label="Следваща"` | `aria-label={m["aria.next"]()}` |

---

### 16. `src/components/services/ServiceLayout.tsx`

**Import:** `import { m } from "../../paraglide/messages"`

| Old | New |
|-----|-----|
| `"Имате идея?"` | `m["cta.haveIdea"]()` |
| `"Свържете се с нас за консултация..."` | `m["cta.contactConsultation"]()` |
| `"Свържете се с нас"` | `m["cta.contactUs"]()` |

---

### 17. Route Files

#### `src/routes/projects/index.tsx`

**Import:** `import { m } from "../../paraglide/messages"` and `import { useLocale } from "../../hooks/useLocale"`

| Old | New |
|-----|-----|
| `"Нашите проекти"` | `m["projects.title"]()` |
| Subtitle text | `m["projects.subtitle"]()` |
| `"Няма намерени проекти."` | `m["projects.empty"]()` |
| CTA text `"Имате идея?"` etc. | `m["cta.haveIdea"]()`, `m["cta.contactConsultation"]()`, `m["cta.contactUs"]()` |
| Category labels import | Replace with `m["categories.all"]()`, `m["categories.office"]()`, etc. from `categoryLabels` in `types/project.ts` |

**Also:** Remove dependency on `categoryLabels` from `types/project.ts` or update it to use `m.*()`.

#### `src/routes/projects/$slug.tsx`

**Import:** `import { m } from "../../paraglide/messages"`, `import { useLocale } from "../../hooks/useLocale"`, `import { getLocalizedValue } from "../../lib/localeField"`

| Old | New |
|-----|-----|
| hardcoded `locale="bg"` | `const locale = useLocale()` |
| `"Проектът не е найден"` | `m["projects.notFound"]()` |
| `"Обратно към проекти"` | `m["projects.backToProjects"]()` |
| `<ProjectDetailView project={project} locale="bg" />` | `<ProjectDetailView project={project} locale={locale} />` |

#### `src/routes/blog/index.tsx`

**Import:** `import { m } from "../../paraglide/messages"`, `import { useLocale } from "../../hooks/useLocale"`, `import { getLocalizedValue } from "../../lib/localeField"`

| Old | New |
|-----|-----|
| Title text | `m["blog.title"]()` |
| Subtitle text | `m["blog.subtitle"]()` |
| Empty state text | `m["blog.empty"]()` |
| `"Прочети"` | `m["blog.readMore"]()` |
| `post.title_bg` | `getLocalizedValue(post, "title", locale)` |
| `post.excerpt_bg` | `getLocalizedValue(post, "excerpt", locale)` |

**Add fallback notice** for missing EN content:
```tsx
{locale === "en" && !post.title_en && (
  <p className="text-sm text-muted-foreground">{m["blog.onlyBulgarian"]()}</p>
)}
```

#### `src/routes/blog/$slug.tsx`

**Same import pattern.** Replace all `_bg` field access with `getLocalizedValue()`. Replace hardcoded BG strings with `m.*()` calls.

#### `src/routes/privacy.tsx` and `src/routes/terms.tsx`

**Decision D1 (user chose B):** Show BG legal text on both locales with an EN notice.

Pattern:
```tsx
const locale = useLocale()

return (
  <div>
    {locale === "en" && (
      <div className="mb-6 p-4 bg-muted rounded-lg text-sm text-muted-foreground">
        {m["legal.onlyBulgarian"]()}
      </div>
    )}
    {/* ... existing BG legal text unchanged ... */}
  </div>
)
```

Replace the page title:
- `"Политика за поверителност"` → `m["legal.privacy.title"]()`
- `"Общи условия"` → `m["legal.terms.title"]()`

#### `src/routes/services/*.tsx` (6 files)

Each file has hardcoded BG text for titles, subtitles, descriptions, CTAs. Replace each with `m.*()` calls using keys like `services.architecture.title`, etc.

The CTA card at the bottom uses ServiceLayout which we've already updated.

---

### 18. Data Files

#### `src/data/hero-slides.ts`

**Import:** `import { m } from "../../paraglide/messages"` — BUT this is a static data file, not a component. Messages can only be called inside React components (they depend on current locale).

**Solution:** Convert `heroSlides` from a static array to a function:

```ts
// Before: export const heroSlides = [...]
// After:
export function getHeroSlides(): SlideData[] {
  return [
    { id: 1, src: "...", alt: m["heroSlides.slide1.alt"](), caption: m["heroSlides.slide1.caption"]() },
    // ... etc
  ]
}
```

Add corresponding keys to `messages/bg.json` and `messages/en.json`:
```json
"heroSlides.slide1.alt": "...",
"heroSlides.slide1.caption": "...",
```

Then update `HeroSlider.tsx` to call `getHeroSlides()` instead of using the static array.

#### `src/types/project.ts`

**Replace the hardcoded `categoryLabels`:**

```ts
// Remove or deprecate this:
export const categoryLabels: Record<ProjectCategoryFilter, string> = {
  All: "Всички",
  Office: "Офиси",
  // ...
}

// Add this instead:
import { m } from "../paraglide/messages"

export function getCategoryLabel(category: ProjectCategoryFilter): string {
  const map: Record<ProjectCategoryFilter, string> = {
    All: m["categories.all"](),
    Office: m["categories.office"](),
    Healthcare: m["categories.healthcare"](),
    Commercial: m["categories.commercial"](),
    Industrial: m["categories.industrial"](),
    Residential: m["categories.residential"](),
    Interior: m["categories.interior"](),
  }
  return map[category]
}
```

Update all call sites (projects index page, admin) to use `getCategoryLabel(cat)` instead of `categoryLabels[cat]`.

#### `src/data/projects.ts` (legacy)

Remove duplicate `categoryLabels` if it exists.

---

## 📝 Message Keys Still Needed (not yet in messages/*.json)

The following keys are referenced in this guide but need content added to `messages/bg.json` and `messages/en.json`:

```json
{
  "heroSlides.slide1.alt": "...BG...",
  "heroSlides.slide1.caption": "...BG...",
  "heroSlides.slide2.alt": "...",
  "heroSlides.slide2.caption": "...",
  "... (one for each slide)",
  "about.philosophy.text": "...full BG text...",
  "about.mission.text": "...",
  "about.vision.text": "...",
  "services.architecture.pageTitle": "Архитектура",
  "services.architecture.pageSubtitle": "...",
  "services.architecture.pageDescription": "...",
  "... (similar for each service page)",
  "services.urban.pageTitle": "Градоустройство",
  "services.urban.pageSubtitle": "...",
  "... etc for engineering, consulting, 3d, projects",
  "privacy.content": "... (keep BG text or use separate approach)",
  "terms.content": "... (keep BG text or use separate approach)"
}
```

For **service pages** (`services/architecture.tsx` etc.), each file has unique content (titles, paragraphs, lists). You'll need to:
1. Open each service route file
2. Extract all BG text into new message keys like `services.architecture.pageSection1Title`, etc.
3. Add BG and EN translations to the message files
4. Replace the hardcoded text with `m["key"]()` calls

For **privacy/terms pages**, the approach is simpler since user chose D1-B (BG text + EN notice). Just add the notice component at the top and keep the existing BG text.

---

## 🔧 Important Technical Notes

1. **`m["key.with.dots"]()`** — Always use bracket notation for Paraglide message keys since they contain dots.

2. **Message keys with parameters** — e.g., `m["aria.slide"]({ number: "1" })`. Check the generated `src/paraglide/messages/` files for parameter signatures.

3. **`useLocale()` hook** — Returns `"bg" | "en"`. Use in components that need to select `_bg`/`_en` fields from Convex data.

4. **`getLocalizedValue(doc, "fieldBase", locale)`** — Returns `doc.field_en` if locale is "en" and the value exists, otherwise falls back to `doc.field_bg`. Use for all database field selection.

5. **`getLocale()` vs `useLocale()`** — `getLocale()` from `../paraglide/runtime` is the raw function (not reactive in React). `useLocale()` from `../../hooks/useLocale` is the React-friendly version. Use `useLocale()` in components.

6. **After editing message files** — Rebuild/regenerate: `vp run build` or just start the dev server. The Vite plugin will regenerate `src/paraglide/messages/` on change.

7. **Build check** — Run `vp run build` after updating each component to catch TypeScript errors early.

---

## 📁 Files That DON'T Need Changes

- `src/components/admin/*` — All admin components stay as-is
- `src/routes/admin*` — Admin routes stay as-is
- `src/routes/admin-login.tsx` — Stays as-is
- `convex/schema.ts` — No schema changes
- `convex/projects.ts`, `convex/posts.ts` — No query changes needed yet
- `src/integrations/*` — No changes
- `src/hooks/useImageUpload.ts`, `useProjectImages.ts`, `use-mobile.ts` — No changes
- `src/components/ui/*` — No changes (shadcn primitives)