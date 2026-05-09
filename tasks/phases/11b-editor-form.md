# Phase 11b — Admin Project Editor: Form & Language Tabs

> **Prerequisite:** Phase 11a completed (shared components extracted).
> **Commit message suggestion:** `feat: build admin project editor form with language tabs`

---

## Objective

Build the core admin project editor form at `/admin/projects/new` (and later `/admin/projects/$projectId/edit`). This phase covers: text fields, language tabs (BG/EN), category/status dropdowns, featured toggle, slug auto-generation, awards and details sections. **Image upload zones and live preview are in later phases (11c, 11d).**

---

## Step-by-step

### 11b.1 — Define form state type

Create `src/types/project-form.ts`:

```ts
import type { ProjectCategory, ProjectStatus, ImageAR } from "./project";

export interface ProjectFormState {
  slug: string;
  title_bg: string;
  title_en: string;
  description_bg: string;
  description_en: string;
  location_bg: string;
  location_en: string;
  investor_bg: string;
  investor_en: string;
  category: ProjectCategory;
  area: string;        // string in form, parsed to number on save
  completionDate: string;  // ISO date string
  featured: boolean;
  status: ProjectStatus;
  awards: Array<{ text_bg: string; text_en: string }>;
  details: Array<{ name_bg: string; name_en: string; area: string }>;
  images: Array<{ storageId?: string; ar: ImageAR; url_legacy?: string }>;
}

export const emptyFormState: ProjectFormState = {
  slug: "",
  title_bg: "",
  title_en: "",
  description_bg: "",
  description_en: "",
  location_bg: "",
  location_en: "",
  investor_bg: "",
  investor_en: "",
  category: "Office",
  area: "",
  completionDate: "",
  featured: false,
  status: "done",
  awards: [],
  details: [],
  images: [],
};
```

### 11b.2 — Create `src/routes/admin/projects/new.tsx`

The editor page with language tabs and all text fields:

```tsx
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { slugify } from "#/lib/slugify";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { Textarea } from "#/components/ui/textarea";
import { Switch } from "#/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "#/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select";
import { Plus, X, ArrowLeft, Save, Send } from "lucide-react";
import type { ProjectFormState } from "#/types/project-form";
import { emptyFormState } from "#/types/project-form";
import type { ProjectCategory } from "#/types/project";

export const Route = createFileRoute("/admin/projects/new")({
  component: NewProjectPage,
});

const categories: { value: ProjectCategory; label: string }[] = [
  { value: "Office", label: "Офис" },
  { value: "Healthcare", label: "Здравеопазване" },
  { value: "Commercial", label: "Търговски" },
  { value: "Industrial", label: "Индустриален" },
  { value: "Residential", label: "Жилищен" },
  { value: "Interior", label: "Интериор" },
];

function NewProjectPage() {
  const [form, setForm] = useState<ProjectFormState>(emptyFormState);
  const [locale, setLocale] = useState<"bg" | "en">("bg");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const navigate = useNavigate();
  const createProject = useMutation(api.projects.create);

  // Auto-populate slug from BG title
  useEffect(() => {
    if (!slugManuallyEdited) {
      setForm((prev) => ({ ...prev, slug: slugify(prev.title_bg) }));
    }
  }, [form.title_bg, slugManuallyEdited]);

  const handleChange = (field: keyof ProjectFormState, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSlugChange = (value: string) => {
    setSlugManuallyEdited(true);
    setForm((prev) => ({ ...prev, slug: value }));
  };

  const addAward = () => {
    setForm((prev) => ({
      ...prev,
      awards: [...prev.awards, { text_bg: "", text_en: "" }],
    }));
  };

  const removeAward = (index: number) => {
    setForm((prev) => ({
      ...prev,
      awards: prev.awards.filter((_, i) => i !== index),
    }));
  };

  const updateAward = (index: number, field: "text_bg" | "text_en", value: string) => {
    setForm((prev) => ({
      ...prev,
      awards: prev.awards.map((a, i) => (i === index ? { ...a, [field]: value } : a)),
    }));
  };

  const addDetail = () => {
    setForm((prev) => ({
      ...prev,
      details: [...prev.details, { name_bg: "", name_en: "", area: "" }],
    }));
  };

  const removeDetail = (index: number) => {
    setForm((prev) => ({
      ...prev,
      details: prev.details.filter((_, i) => i !== index),
    }));
  };

  const updateDetail = (index: number, field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      details: prev.details.map((d, i) => (i === index ? { ...d, [field]: value } : d)),
    }));
  };

  const handleSave = async (publish: boolean) => {
    // Validate required fields
    if (!form.title_bg || !form.slug || !form.location_bg || !form.investor_bg) {
      // Show validation errors (simplified for now)
      alert("Please fill in all required fields");
      return;
    }

    await createProject({
      ...form,
      area: form.area ? parseFloat(form.area) : undefined,
      completionDate: form.completionDate || undefined,
      images: form.images.filter((img) => img.storageId),  // only images with storageId
      details: form.details.map((d) => ({
        ...d,
        area: parseFloat(d.area),
      })),
    });

    navigate({ to: "/admin/projects" });
  };

  // Language-agnostic fields are always visible
  // Language-specific fields change based on the locale tab
  const isBg = locale === "bg";

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link to="/admin/projects">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-display font-bold">New Project</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleSave(false)}>
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button onClick={() => handleSave(true)}>
            <Send className="h-4 w-4 mr-2" />
            Publish
          </Button>
        </div>
      </div>

      {/* Language Tabs */}
      <Tabs value={locale} onValueChange={(v) => setLocale(v as "bg" | "en")}>
        <TabsList>
          <TabsTrigger value="bg">БГ</TabsTrigger>
          <TabsTrigger value="en">EN</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Form Fields */}
      <div className="mt-6 space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Title {isBg ? "(БГ)" : "(EN)"}</Label>
          <Input
            id="title"
            value={isBg ? form.title_bg : form.title_en}
            onChange={(e) => handleChange(isBg ? "title_bg" : "title_en", e.target.value)}
            placeholder={isBg ? "Заглавие на проект" : "Project title"}
          />
        </div>

        {/* Slug */}
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={form.slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            placeholder="auto-generated-from-title"
          />
          <p className="text-xs text-stone-400">
            projekti.uzunov.bg/projects/{form.slug || "..."}
          </p>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description {isBg ? "(БГ)" : "(EN)"}</Label>
          <Textarea
            id="description"
            value={isBg ? form.description_bg : form.description_en}
            onChange={(e) => handleChange(isBg ? "description_bg" : "description_en", e.target.value)}
            rows={4}
          />
        </div>

        {/* Category + Status row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={form.category} onValueChange={(v) => handleChange("category", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => handleChange("status", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="done">Завършен</SelectItem>
                <SelectItem value="in-progress">В процес</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Featured toggle */}
        <div className="flex items-center gap-3">
          <Switch checked={form.featured} onCheckedChange={(v) => handleChange("featured", v)} />
          <Label>Featured project</Label>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label>Location {isBg ? "(БГ)" : "(EN)"}</Label>
          <Input
            value={isBg ? form.location_bg : form.location_en}
            onChange={(e) => handleChange(isBg ? "location_bg" : "location_en", e.target.value)}
          />
        </div>

        {/* Area */}
        <div className="space-y-2">
          <Label>Area (m²)</Label>
          <Input
            type="number"
            value={form.area}
            onChange={(e) => handleChange("area", e.target.value)}
          />
        </div>

        {/* Investor */}
        <div className="space-y-2">
          <Label>Investor {isBg ? "(БГ)" : "(EN)"}</Label>
          <Input
            value={isBg ? form.investor_bg : form.investor_en}
            onChange={(e) => handleChange(isBg ? "investor_bg" : "investor_en", e.target.value)}
          />
        </div>

        {/* Completion Date */}
        <div className="space-y-2">
          <Label>Completion Date</Label>
          <Input
            type="date"
            value={form.completionDate}
            onChange={(e) => handleChange("completionDate", e.target.value)}
          />
        </div>

        {/* Awards */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Awards</Label>
            <Button variant="outline" size="sm" onClick={addAward}>
              <Plus className="h-3 w-3 mr-1" /> Add
            </Button>
          </div>
          {form.awards.map((award, i) => (
            <div key={i} className="flex gap-2">
              <Input
                value={isBg ? award.text_bg : award.text_en}
                onChange={(e) => updateAward(i, isBg ? "text_bg" : "text_en", e.target.value)}
                placeholder={isBg ? "Награда (БГ)" : "Award (EN)"}
                className="flex-1"
              />
              <Button variant="ghost" size="icon" onClick={() => removeAward(i)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Sub-buildings / Details */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Sub-buildings</Label>
            <Button variant="outline" size="sm" onClick={addDetail}>
              <Plus className="h-3 w-3 mr-1" /> Add
            </Button>
          </div>
          {form.details.map((detail, i) => (
            <div key={i} className="flex gap-2">
              <Input
                value={isBg ? detail.name_bg : detail.name_en}
                onChange={(e) => updateDetail(i, isBg ? "name_bg" : "name_en", e.target.value)}
                placeholder={isBg ? "Име (БГ)" : "Name (EN)"}
                className="flex-1"
              />
              <Input
                value={detail.area}
                onChange={(e) => updateDetail(i, "area", e.target.value)}
                placeholder="m²"
                className="w-24"
                type="number"
              />
              <Button variant="ghost" size="icon" onClick={() => removeDetail(i)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Images placeholder — built in Phase 11c */}
        <div className="space-y-2">
          <Label>Images</Label>
          <div className="border-2 border-dashed border-stone-200 rounded-xl p-8 text-center text-stone-400">
            Image upload zones — coming in Phase 11c
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 11b.3 — Wire up the `create` mutation

The `handleSave` function calls `api.projects.create`. Make sure the mutation args match what the form produces. The form uses strings for `area` and parses to `number` on save.

---

## Files Touched

| Action | Path |
|--------|------|
| CREATE | `src/types/project-form.ts` |
| EDIT | `src/routes/admin/projects/new.tsx` (full form implementation) |

---

## Validation Checklist

- [ ] `/admin/projects/new` shows the full editor form
- [ ] Language tabs (BG/EN) switch the visible fields
- [ ] Slug auto-populates from BG title, stops auto-populating when manually edited
- [ ] Category and status dropdowns work
- [ ] Featured toggle works
- [ ] Awards can be added/removed
- [ ] Sub-buildings can be added/removed
- [ ] Required field validation works
- [ ] "Save Draft" and "Publish" buttons call the correct mutation