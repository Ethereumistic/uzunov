# Phase 04 — Slug Generation Utility

> **Prerequisite:** None (pure utility, no Convex dependency).
> **Commit message suggestion:** `feat: add BG Cyrillic → Latin slugify utility`

---

## Objective

Create a `slugify` utility function that transliterates Bulgarian Cyrillic characters to Latin and produces URL-safe slugs. This is used in the admin form (Phase 11) to auto-populate the slug field from `title_bg`.

---

## Step-by-step

### 4.1 — Create `src/lib/slugify.ts`

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

### 4.2 — Verify behavior with test cases

The slugify function should produce these results:

| Input | Expected Output |
|-------|----------------|
| `"Офис сграда - гр. ГАБРОВО (КРЕМИ)"` | `"ofis-sgrada-gr-gabrovo-kremi"` |
| `"МОЛ ГАБРОВО"` | `"mol-gabrovo"` |
| `"Търговско-административен комплекс СИЕНТИА"` | `"targovsko-administrativen-kompleks-sientia"` |
| `"Здравеопазване"` | `"zdraveopazvane"` |
| `"Hello World 123"` | `"hello-world-123"` |

You can verify quickly in the browser console or a test file. No formal test required, but confirm transliteration works correctly for Bulgarian text.

---

## Files Touched

| Action | Path |
|--------|------|
| CREATE | `src/lib/slugify.ts` |

---

## Validation Checklist

- [ ] `src/lib/slugify.ts` exists with the `slugify` export
- [ ] Bulgarian Cyrillic input produces correct Latin transliteration
- [ ] Special characters are replaced with hyphens
- [ ] Leading/trailing hyphens are stripped
- [ ] Slug length is capped at 80 characters