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
import { ArrowLeft, Save, Send, Image as ImageIcon } from "lucide-react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "#/components/ui/resizable";
import type { PostFormState } from "#/types/post-form";
import { emptyPostFormState } from "#/types/post-form";
import type { PostImage } from "#/types/post";
import type { Doc } from "../../../convex/_generated/dataModel";
import { postToForm } from "#/lib/postToForm";
import { ImageDropZone } from "#/components/admin/ImageDropZone";
import { ImageGalleryDialog } from "#/components/admin/ImageGalleryDialog";
import { BlogRichTextEditor } from "#/components/admin/BlogRichTextEditor";

type PostDoc = Doc<"posts">;

interface BlogEditorProps {
  initialData?: PostDoc | null;
  postId?: Id<"posts">;
}

export function BlogEditor({ initialData, postId }: BlogEditorProps) {
  const isEditing = !!initialData;

  const [form, setForm] = useState<PostFormState>(() => {
    if (initialData) {
      return postToForm(initialData as any);
    }
    return { ...emptyPostFormState, displayDate: new Date().toISOString().split("T")[0] };
  });
  const [locale, setLocale] = useState<"bg" | "en">("bg");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [coverGalleryOpen, setCoverGalleryOpen] = useState(false);
  const navigate = useNavigate();

  const createPost = useMutation(api.posts.create);
  const updatePost = useMutation(api.posts.update);

  // Resolve cover image URL
  const coverUrl = useQuery(
    form.coverImage
      ? api.images.getImageUrl
      : ("skip" as any),
    form.coverImage
      ? { storageId: form.coverImage as Id<"_storage"> }
      : ("skip" as any),
  ) as string | null | undefined;

  // Resolve gallery image URLs
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

  // Auto-populate slug from BG title
  useEffect(() => {
    if (!slugManuallyEdited) {
      setForm((prev) => ({ ...prev, slug: slugify(prev.title_bg) }));
    }
  }, [form.title_bg, slugManuallyEdited]);

  const handleChange = (field: keyof PostFormState, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSlugChange = (value: string) => {
    setSlugManuallyEdited(true);
    setForm((prev) => ({ ...prev, slug: value }));
  };

  // Cover image handlers
  const handleCoverUpload = (storageId: string, _ar: string) => {
    setForm((prev) => ({ ...prev, coverImage: storageId }));
  };

  // Gallery image handlers
  const addImage = (storageId: string, url_legacy?: string) => {
    setForm((prev) => ({
      ...prev,
      images: [...prev.images, { storageId, url_legacy }],
    }));
  };

  const removeImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleGallerySelect = (image: { storageId: string; url_legacy?: string }) => {
    addImage(image.storageId, image.url_legacy);
  };

  const currentImageIds = new Set(form.images.map((img) => img.storageId).filter(Boolean) as string[]);

  const getImageUrl = (img: PostImage): string => {
    if (img.storageId && urlMap) {
      return urlMap[img.storageId] ?? img.url_legacy ?? "";
    }
    return img.url_legacy ?? "";
  };

  const handleSave = async () => {
    if (!form.title_bg || !form.slug) {
      alert("Please fill in all required fields (BG title, slug)");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        slug: form.slug,
        title_bg: form.title_bg,
        title_en: form.title_en || undefined,
        body_bg: form.body_bg,
        body_en: form.body_en || undefined,
        excerpt_bg: form.excerpt_bg || undefined,
        excerpt_en: form.excerpt_en || undefined,
        coverImage: form.coverImage ? (form.coverImage as Id<"_storage">) : undefined,
        images: form.images
          .filter((img) => img.storageId)
          .map((img) => ({
            storageId: img.storageId as Id<"_storage">,
            url_legacy: img.url_legacy,
          })),
        published: form.published,
        displayDate: form.displayDate,
        order: initialData?.order ?? 0,
      };

      if (isEditing && postId) {
        await updatePost({ id: postId, ...payload });
      } else {
        await createPost(payload);
      }

      navigate({ to: "/admin/blog" });
    } catch (err) {
      console.error("Failed to save post:", err);
      alert("Failed to save post. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const isBg = locale === "bg";

  return (
    <>
      <ResizablePanelGroup orientation="horizontal" className="h-full">
        {/* Left: Editor */}
        <ResizablePanel defaultSize={45} minSize={30}>
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="shrink-0 px-6 pt-6 pb-4 border-b border-stone-200">
              <div className="flex items-center gap-3">
                <Link to="/admin/blog">
                  <Button variant="ghost" size="icon">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Link>
                <h1 className="text-2xl font-display font-bold">
                  {isEditing ? `Edit: ${initialData?.title_bg}` : "New Blog Post"}
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
                    placeholder={isBg ? "Заглавие на статията" : "Article title"}
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
                    projekti.uzunov.bg/blog/{form.slug || "..."}
                  </p>
                </div>

                {/* Display Date */}
                <div className="space-y-2">
                  <Label htmlFor="displayDate">Display Date</Label>
                  <Input
                    id="displayDate"
                    type="date"
                    value={form.displayDate}
                    onChange={(e) => handleChange("displayDate", e.target.value)}
                  />
                  <p className="text-xs text-stone-400">
                    The date shown to visitors as the post date
                  </p>
                </div>

                {/* Published toggle */}
                <div className="flex items-center gap-3">
                  <Switch
                    checked={form.published}
                    onCheckedChange={(v) => handleChange("published", v)}
                  />
                  <Label>Published</Label>
                </div>

                {/* Excerpt */}
                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt {isBg ? "(БГ)" : "(EN)"}</Label>
                  <Textarea
                    id="excerpt"
                    value={isBg ? form.excerpt_bg : form.excerpt_en}
                    onChange={(e) => handleChange(isBg ? "excerpt_bg" : "excerpt_en", e.target.value)}
                    rows={3}
                    placeholder={isBg ? "Кратко резюме на статията" : "Short summary of the article"}
                  />
                </div>

                {/* ── Cover Image ── */}
                <div className="space-y-2">
                  <Label className="text-base font-semibold">Cover Image</Label>
                  <p className="text-xs text-stone-400">
                    Main image displayed at the top of the blog post
                  </p>

                  {form.coverImage && coverUrl ? (
                    <div className="relative group rounded-xl overflow-hidden border-2 border-stone-200">
                      <img
                        src={coverUrl}
                        alt="Cover"
                        className="w-full aspect-video object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleChange("coverImage", "")}
                        className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full text-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-stone-500">Upload new</Label>
                        <ImageDropZone
                          onUploadComplete={handleCoverUpload}
                          label="Drop cover image"
                          className="min-h-[160px]"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-stone-500">From gallery</Label>
                        <button
                          type="button"
                          onClick={() => setCoverGalleryOpen(true)}
                          className="w-full min-h-[160px] border-2 border-dashed border-stone-200 rounded-xl flex flex-col items-center justify-center gap-1 text-stone-400 hover:border-stone-400 hover:text-stone-600 transition-colors"
                        >
                          <ImageIcon className="h-5 w-5" />
                          <span className="text-xs font-medium">Browse gallery</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* ── Gallery Images ── */}
                <div className="space-y-2">
                  <Label className="text-base font-semibold">Gallery Images</Label>
                  <p className="text-xs text-stone-400">
                    Additional images shown in the post gallery
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Upload Zone */}
                    <div className="space-y-1">
                      <Label className="text-xs text-stone-500">Upload new image</Label>
                      <ImageDropZone
                        onUploadComplete={(storageId, _ar) => addImage(storageId)}
                        label="Drop image here"
                        className="min-h-[160px]"
                      />
                    </div>

                    {/* Current images grid */}
                    <div className="space-y-1">
                      <Label className="text-xs text-stone-500">
                        Current images ({form.images.length})
                      </Label>

                      {form.images.length === 0 ? (
                        <div className="border-2 border-dashed border-stone-200 rounded-xl h-[160px] flex items-center justify-center text-stone-400 text-sm">
                          No images yet
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-1.5 max-h-[240px] overflow-y-auto pr-1">
                          {form.images.map((img, i) => {
                            const url = getImageUrl(img);
                            return (
                              <div
                                key={img.storageId ?? `img-${i}`}
                                className="relative group rounded-lg overflow-hidden border-2 border-stone-200 aspect-square"
                              >
                                {url ? (
                                  <img
                                    src={url}
                                    alt={`Gallery ${i + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-stone-100 flex items-center justify-center text-stone-400 text-xs">
                                    #{i + 1}
                                  </div>
                                )}
                                <button
                                  type="button"
                                  onClick={() => removeImage(i)}
                                  className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                >
                                  ×
                                </button>
                              </div>
                            );
                          })}

                          <button
                            type="button"
                            onClick={() => setGalleryOpen(true)}
                            className="col-span-3 aspect-[16/6] border-2 border-dashed border-stone-200 rounded-lg flex flex-col items-center justify-center gap-1 text-stone-400 hover:border-stone-400 hover:text-stone-600 transition-colors"
                          >
                            <ImageIcon className="h-5 w-5" />
                            <span className="text-xs font-medium">Browse gallery</span>
                          </button>
                        </div>
                      )}

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

                {/* ── Rich Text Body ── */}
                <div className="space-y-2">
                  <Label className="text-base font-semibold">
                    Body {isBg ? "(БГ)" : "(EN)"}
                  </Label>
                  <BlogRichTextEditor
                    value={isBg ? form.body_bg : form.body_en}
                    onChange={(html) =>
                      handleChange(isBg ? "body_bg" : "body_en", html)
                    }
                    placeholder={
                      isBg
                        ? "Започнете да пишете съдържанието на статията..."
                        : "Start writing the article content..."
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Right: Live Preview */}
        <ResizablePanel defaultSize={55} minSize={30}>
          <div className="h-full bg-background flex flex-col">
            <div className="shrink-0 px-4 pt-4 pb-2">
              <h3 className="text-sm font-medium text-stone-500">
                Live Preview ({locale === "bg" ? "БГ" : "EN"})
              </h3>
            </div>
            <div className="flex-1 min-h-0 overflow-auto px-4 pb-4">
              {form.title_bg ? (
                <BlogPreview form={form} locale={locale} />
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
                <Button onClick={() => { handleChange("published", true); handleSave(); }} disabled={saving}>
                  <Send className="h-4 w-4 mr-2" />
                  {saving ? "Publishing…" : "Publish"}
                </Button>
              </div>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* Gallery Dialogs */}
      <ImageGalleryDialog
        open={galleryOpen}
        onOpenChange={setGalleryOpen}
        onSelectImage={handleGallerySelect}
        currentImageIds={currentImageIds}
      />

      <ImageGalleryDialog
        open={coverGalleryOpen}
        onOpenChange={setCoverGalleryOpen}
        onSelectImage={(image) => {
          handleChange("coverImage", image.storageId);
          setCoverGalleryOpen(false);
        }}
        currentImageIds={form.coverImage ? new Set([form.coverImage]) : new Set()}
      />
    </>
  );
}

// ──────────────────────────────────────────────
// Inline Blog Preview (simplified public view)
// ──────────────────────────────────────────────
function BlogPreview({ form, locale }: { form: PostFormState; locale: "bg" | "en" }) {
  const isBg = locale === "bg";
  const title = isBg ? form.title_bg : (form.title_en || form.title_bg);
  const excerpt = isBg ? form.excerpt_bg : form.excerpt_en;
  const body = isBg ? form.body_bg : form.body_en;

  // Resolve cover image URL
  const coverStorageIds = form.coverImage ? [form.coverImage as Id<"_storage">] : [];
  const galleryStorageIds = form.images
    .map((img) => img.storageId)
    .filter((id): id is string => !!id) as Id<"_storage">[];
  const allStorageIds = [...coverStorageIds, ...galleryStorageIds];

  const urlMap = useQuery(
    allStorageIds.length > 0
      ? api.images.getImageUrls
      : ("skip" as any),
    allStorageIds.length > 0
      ? { storageIds: allStorageIds }
      : ("skip" as any),
  ) as Record<string, string | null> | undefined;

  const coverUrl = form.coverImage && urlMap ? urlMap[form.coverImage] : null;
  const galleryUrls = form.images
    .map((img) => {
      if (img.storageId && urlMap) return urlMap[img.storageId] ?? img.url_legacy ?? "";
      return img.url_legacy ?? "";
    })
    .filter(Boolean);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString(isBg ? "bg-BG" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border">
      {/* Cover image */}
      {coverUrl && (
        <div className="aspect-video overflow-hidden">
          <img src={coverUrl} alt={title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="p-6">
        {/* Date */}
        {form.displayDate && (
          <p className="text-xs text-stone-400 mb-2">{formatDate(form.displayDate)}</p>
        )}

        {/* Title */}
        <h1 className="font-display text-2xl font-bold text-[#1a1916] mb-3">
          {title || "Untitled Post"}
        </h1>

        {/* Excerpt */}
        {excerpt && (
          <p className="text-sm text-stone-500 mb-4 leading-relaxed">{excerpt}</p>
        )}

        {/* Gallery thumbnails */}
        {galleryUrls.length > 0 && (
          <div className="grid grid-cols-3 gap-1.5 mb-4">
            {galleryUrls.slice(0, 6).map((url, i) => (
              <div key={i} className="aspect-square rounded-lg overflow-hidden">
                <img src={url} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}

        {/* Rich text body */}
        {body ? (
          <div
            className="prose prose-stone max-w-none text-sm prose-headings:text-foreground prose-body:text-foreground"
            dangerouslySetInnerHTML={{ __html: body }}
          />
        ) : (
          <p className="text-foreground/30 italic">No content yet</p>
        )}
      </div>
    </div>
  );
}