import { useState, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
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
import { Plus, X, ArrowLeft, Save, Send, Image as ImageIcon } from "lucide-react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "#/components/ui/resizable";
import type { ProjectFormState } from "#/types/project-form";
import { emptyFormState } from "#/types/project-form";
import type { ProjectCategory, ImageAR, ProjectImage } from "#/types/project";
import type { Project } from "#/types/project";
import { projectToForm } from "#/lib/projectToForm";
import { ImageDropZone } from "#/components/admin/ImageDropZone";
import { ImageGalleryDialog } from "#/components/admin/ImageGalleryDialog";
import { ProjectPreview } from "#/components/admin/ProjectPreview";

const categories: { value: ProjectCategory; label: string }[] = [
  { value: "Office", label: "Офис" },
  { value: "Healthcare", label: "Здравеопазване" },
  { value: "Commercial", label: "Търговски" },
  { value: "Industrial", label: "Индустриален" },
  { value: "Residential", label: "Жилищен" },
  { value: "Interior", label: "Интериор" },
];

interface ProjectEditorProps {
  initialData?: Project | null;
  projectId?: Id<"projects">;
}

export function ProjectEditor({ initialData, projectId }: ProjectEditorProps) {
  const isEditing = !!initialData;

  const [form, setForm] = useState<ProjectFormState>(() => {
    if (initialData) {
      return projectToForm(initialData);
    }
    return emptyFormState;
  });
  const [locale, setLocale] = useState<"bg" | "en">("bg");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const navigate = useNavigate();

  const createProject = useMutation(api.projects.create);
  const updateProject = useMutation(api.projects.update);

  // Resolve image URLs for the grid thumbnails
  const currentImageIds = new Set(form.images.map((img) => img.storageId).filter((id): id is string => !!id));
  const storageIds = form.images
    .map((img) => img.storageId)
    .filter((id): id is string => !!id);
  const urlMap = useQuery(
    storageIds.length > 0
      ? api.images.getImageUrls
      : ("skip" as any),
    storageIds.length > 0
      ? { storageIds: storageIds as Id<"_storage">[] }
      : ("skip" as any),
  ) as Record<string, string | null> | undefined;

  // Auto-populate slug from BG title (only for new projects)
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

  // Image management helpers
  const addImage = (storageId: string, ar: ImageAR, url_legacy?: string) => {
    setForm((prev) => ({
      ...prev,
      images: [...prev.images, { storageId, ar, url_legacy }],
    }));
  };

  const removeImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const updateImageAr = (index: number, ar: ImageAR) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.map((img, i) => (i === index ? { ...img, ar } : img)),
    }));
  };

  const moveImage = (from: number, to: number) => {
    setForm((prev) => {
      const newImages = [...prev.images];
      const [moved] = newImages.splice(from, 1);
      newImages.splice(to, 0, moved);
      return { ...prev, images: newImages };
    });
    setDragIndex(null);
  };

  // Drag handlers for grid
  const handleDragStart = (index: number) => setDragIndex(index);
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    moveImage(dragIndex, index);
  };

  // Gallery select handler
  const handleGallerySelect = (image: { storageId: string; ar: ImageAR; url_legacy?: string }) => {
    addImage(image.storageId, image.ar, image.url_legacy);
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

  const handleSave = async () => {
    if (!form.title_bg || !form.slug || !form.location_bg) {
      alert("Please fill in all required fields (BG title, slug, location)");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        slug: form.slug,
        title_bg: form.title_bg,
        title_en: form.title_en,
        description_bg: form.description_bg || undefined,
        description_en: form.description_en || undefined,
        location_bg: form.location_bg,
        location_en: form.location_en,
        investor_bg: form.investor_bg || undefined,
        investor_en: form.investor_en || undefined,
        category: form.category,
        area: form.area ? parseFloat(form.area) : undefined,
        completionDate: form.completionDate || undefined,
        featuredOrder: form.featured ? (initialData?.featuredOrder ?? 0) : undefined,
        status: form.status,
        awards: form.awards,
        details: form.details.map((d) => ({
          name_bg: d.name_bg,
          name_en: d.name_en,
          area: parseFloat(d.area) || 0,
        })),
        images: form.images
          .filter((img) => img.storageId)
          .map((img) => ({
            storageId: img.storageId as any,
            ar: img.ar,
            url_legacy: img.url_legacy,
          })),
        order: initialData?.order ?? 0,
      };

      if (isEditing && projectId) {
        await updateProject({ id: projectId, ...payload });
      } else {
        await createProject(payload);
      }

      navigate({ to: "/admin/projects" });
    } catch (err) {
      console.error("Failed to save project:", err);
      alert("Failed to save project. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const isBg = locale === "bg";

  // Get resolved URL for a form image
  const getImageUrl = (img: ProjectImage): string => {
    if (img.storageId && urlMap) {
      return urlMap[img.storageId] ?? img.url_legacy ?? "";
    }
    return img.url_legacy ?? "";
  };

  return (
    <>
    <ResizablePanelGroup orientation="horizontal" className="h-full">
      {/* Left: Editor */}
      <ResizablePanel defaultSize={30} minSize={25}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="shrink-0 px-6 pt-6 pb-4 border-b border-stone-200">
            <div className="flex items-center gap-3">
              <Link to="/admin/projects">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-2xl font-display font-bold">
                {isEditing ? `Edit: ${initialData?.title_bg}` : "New Project"}
              </h1>
            </div>
          </div>

          {/* Scrollable form */}
          <div className="flex-1 overflow-y-auto p-6">

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

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* IMAGES: 2-column layout                                     */}
          {/* Left: Upload zone | Right: Current images grid + Gallery    */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">Images</Label>
            <p className="text-xs text-stone-400">
              Drag to upload on the left. Manage current images on the right. Open the gallery to reuse previously uploaded images.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* LEFT: Upload Zone */}
            <div className="space-y-2">
              <Label className="text-xs text-stone-500">Upload new image</Label>
              <ImageDropZone
                onUploadComplete={(storageId, ar) => addImage(storageId, ar)}
                label="Drop image here"
                className="h-full min-h-[200px] flex items-center justify-center"
              />
            </div>

            {/* RIGHT: Current images + Gallery opener */}
            <div className="space-y-2">
              <Label className="text-xs text-stone-500">
                Current images ({form.images.length})
              </Label>

              {form.images.length === 0 ? (
                <div className="border-2 border-dashed border-stone-200 rounded-xl h-[200px] flex items-center justify-center text-stone-400 text-sm">
                  No images yet
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-1.5 max-h-[360px] overflow-y-auto pr-1">
                  {form.images.map((img, i) => {
                    const url = getImageUrl(img);
                    const isFirst = i === 0;
                    return (
                      <div
                        key={img.storageId ?? `img-${i}`}
                        draggable
                        onDragStart={() => handleDragStart(i)}
                        onDragOver={(e) => handleDragOver(e, i)}
                        onDragEnd={() => setDragIndex(null)}
                        className={`
                          relative group rounded-lg overflow-hidden border-2 cursor-grab active:cursor-grabbing
                          ${isFirst ? "col-span-3 aspect-[16/8]" : "aspect-square"}
                          ${dragIndex === i ? "border-[#1a1916] opacity-50" : "border-stone-200"}
                        `}
                      >
                        {url ? (
                          <img
                            src={url}
                            alt={`Image ${i + 1}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-stone-100 flex items-center justify-center text-stone-400 text-xs">
                            #{i + 1}
                          </div>
                        )}

                        {/* Position number */}
                        <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-black/50 backdrop-blur-sm rounded text-[0.6rem] text-white font-medium">
                          {isFirst ? "Main" : `#${i + 1}`}
                        </div>

                        {/* AR badge selector */}
                        <div className="absolute bottom-1 left-1 flex gap-0.5">
                          {(["L", "S", "V"] as ImageAR[]).map((ratio) => (
                            <button
                              key={ratio}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                updateImageAr(i, ratio);
                              }}
                              className={`px-1 py-0.5 text-[0.55rem] font-bold rounded transition-colors ${
                                img.ar === ratio
                                  ? "bg-[#1a1916] text-white"
                                  : "bg-white/80 text-stone-500 hover:bg-white"
                              }`}
                            >
                              {ratio}
                            </button>
                          ))}
                        </div>

                        {/* Remove button */}
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}

                  {/* Gallery opener button — always at the end */}
                  <button
                    type="button"
                    onClick={() => setGalleryOpen(true)}
                    className="col-span-3 aspect-[16/6] border-2 border-dashed border-stone-200 rounded-lg flex flex-col items-center justify-center gap-1 text-stone-400 hover:border-stone-400 hover:text-stone-600 transition-colors"
                  >
                    <ImageIcon className="h-5 w-5" />
                    <span className="text-xs font-medium">Browse gallery</span>
                    <span className="text-[0.6rem]">Reuse previously uploaded images</span>
                  </button>
                </div>
              )}

              {/* If no images, still show the gallery button */}
              {form.images.length === 0 && (
                <button
                  type="button"
                  onClick={() => setGalleryOpen(true)}
                  className="w-full mt-2 py-2.5 border border-stone-200 rounded-lg flex items-center justify-center gap-2 text-sm text-stone-500 hover:border-stone-400 hover:text-stone-700 transition-colors"
                >
                  <ImageIcon className="h-4 w-4" />
                  Browse gallery — reuse uploaded images
                </button>
              )}
            </div>
          </div>
        </div>
          </div>
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle />

      {/* Right: Live Preview */}
      <ResizablePanel defaultSize={70} minSize={30}>
        <div className="h-full bg-stone-50 flex flex-col">
          <div className="shrink-0 px-4 pt-4 pb-2">
            <h3 className="text-sm font-medium text-stone-500">
              Live Preview ({locale === "bg" ? "БГ" : "EN"})
            </h3>
          </div>
          <div className="flex-1 min-h-0 overflow-auto px-4 pb-4">
            {form.title_bg ? (
              <ProjectPreview form={form} locale={locale} />
            ) : (
              <div className="flex items-center justify-center h-64 text-stone-400">
                Start filling in the form to see a preview
              </div>
            )}
          </div>
          <div className="shrink-0 px-4 pb-4 pt-2">
            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" onClick={handleSave} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving…" : "Save Draft"}
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                <Send className="h-4 w-4 mr-2" />
                {saving ? "Publishing…" : "Publish"}
              </Button>
            </div>
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>

      {/* Gallery Dialog */}
      <ImageGalleryDialog
        open={galleryOpen}
        onOpenChange={setGalleryOpen}
        onSelectImage={handleGallerySelect}
        currentImageIds={currentImageIds}
      />
    </>
  );
}