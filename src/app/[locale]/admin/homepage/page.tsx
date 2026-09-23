"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { getSession, useSession } from "next-auth/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Upload, RotateCcw, ImageOff, Search, X, ArrowUp, ArrowDown, Check, Wand2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import LoadingSpinner from "@/components/LoadingSpinner";
import contentServices, { SiteContent, SiteContentKey } from "@/services/contentServices";
import photosServices from "@/services/photosServices";
import adminVisualizerServices from "@/services/adminVisualizerServices";
import useSiteContent, { siteContentQueryKey } from "@/hooks/useSiteContent";
import { CATEGORY_MEDIA_SLOTS, DEFAULT_HERO_IMAGE } from "@/constants/siteMedia";
import { allProducts } from "@/constants/queryInfo";
import { Product } from "@/types/products";
import { calculateDiscountedPrice, formatPrice } from "@/Utils/productsUtils";
import RouteConstants from "@/constants/RouteConstants";
import { Link } from "@/i18n/routing";

const MAX_PICKED = 12;
const POPULAR_AUTO = 8;
const WORKS_AUTO = 6;

/* ------------------------------- image slot ------------------------------- */

function ImageSlot({
  label,
  currentUrl,
  fallbackUrl,
  aspect = "aspect-[4/5]",
  onUpload,
  onReset,
}: {
  label: string;
  currentUrl?: string | null;
  /** Shown (dimmed) when nothing is set, so the admin sees what the site falls back to. */
  fallbackUrl?: string;
  aspect?: string;
  onUpload: (file: File) => Promise<void>;
  onReset: () => Promise<void>;
}) {
  const [isBusy, setIsBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const shown = currentUrl || fallbackUrl;

  const run = async (fn: () => Promise<void>) => {
    setIsBusy(true);
    try { await fn(); } finally { setIsBusy(false); }
  };

  return (
    <div className="overflow-hidden rounded-lg border bg-white">
      <div className={`relative ${aspect} bg-muted`}>
        {shown ? (
          <Image src={shown} alt={label} fill className={`object-cover ${currentUrl ? "" : "opacity-60"}`} sizes="(max-width: 640px) 100vw, 50vw" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-muted-foreground">
            <ImageOff className="size-6" />
            <span className="text-xs">No image</span>
          </div>
        )}
        {!currentUrl && fallbackUrl && (
          <span className="absolute left-2 top-2 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">default</span>
        )}
        {isBusy && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40">
            <Loader2 className="size-6 animate-spin text-white" />
          </div>
        )}
      </div>
      <div className="flex items-center justify-between gap-2 p-2">
        <span className="truncate text-sm font-medium">{label}</span>
        <div className="flex items-center gap-1">
          {currentUrl && (
            <Button variant="ghost" size="icon" className="h-7 w-7" title="Remove (back to default)" disabled={isBusy} onClick={() => run(onReset)}>
              <RotateCcw className="size-4" />
            </Button>
          )}
          <Button variant="outline" size="sm" className="h-7 gap-1 text-xs" disabled={isBusy} onClick={() => inputRef.current?.click()}>
            <Upload className="size-3.5" />
            {currentUrl ? "Replace" : "Upload"}
          </Button>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) run(() => onUpload(file));
          e.target.value = "";
        }}
      />
    </div>
  );
}

/* ------------------------------ product picker ----------------------------- */

function ProductPicker({
  title,
  description,
  autoHint,
  value,
  products,
  onSave,
}: {
  title: string;
  description: string;
  autoHint: string;
  value: string[];
  products: Product[];
  onSave: (ids: string[]) => Promise<void>;
}) {
  const [ids, setIds] = useState<string[]>(value);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("");
  const [interiorOnly, setInteriorOnly] = useState(false);
  const [saving, setSaving] = useState(false);
  useEffect(() => setIds(value), [value]);

  const byId = useMemo(() => new Map(products.map((p) => [p._id, p])), [products]);
  const categories = useMemo(() => Array.from(new Set(products.map((p) => p.category))).sort(), [products]);
  const dirty = ids.join(",") !== value.join(",");
  const full = ids.length >= MAX_PICKED;
  const q = query.trim().toLowerCase();
  const visible = products.filter(
    (p) =>
      (!category || p.category === category) &&
      (!interiorOnly || p.hasInteriorPhoto) &&
      (!q || `${p.name} ${p.model || ""}`.toLowerCase().includes(q))
  );

  const toggle = (id: string) => {
    if (ids.includes(id)) setIds(ids.filter((x) => x !== id));
    else if (!full) setIds([...ids, id]);
  };
  const move = (index: number, delta: number) => {
    const next = [...ids];
    const target = index + delta;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setIds(next);
  };
  const save = async () => {
    setSaving(true);
    try { await onSave(ids); } finally { setSaving(false); }
  };

  const chip = (active: boolean) =>
    `h-7 rounded-full border px-3 text-xs transition-colors ${active ? "border-[#171717] bg-[#171717] text-white" : "border-[#DCDCDB] bg-white text-[#4B4B4B] hover:bg-[#F5F5F4]"}`;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Badge variant={ids.length ? "default" : "secondary"}>{ids.length ? `${ids.length} of ${MAX_PICKED} picked` : "automatic"}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* the order shoppers will see */}
        {ids.length === 0 ? (
          <p className="rounded-md bg-muted/60 px-3 py-2 text-xs text-muted-foreground">{autoHint} Tick products below to choose them yourself.</p>
        ) : (
          <div className="space-y-1.5">
            <div className="text-xs font-medium text-muted-foreground">Order on the site (use the arrows):</div>
            <ol className="grid gap-1.5 sm:grid-cols-2 xl:grid-cols-3">
              {ids.map((id, index) => {
                const p = byId.get(id);
                return (
                  <li key={id} className="flex items-center gap-2 rounded-md border bg-white p-1.5 pe-2">
                    <span className="w-5 text-center text-xs font-semibold tabular-nums">{index + 1}</span>
                    <div className="relative size-10 shrink-0 overflow-hidden rounded bg-muted">
                      {p?.images?.[0] && <Image src={p.images[0]} alt="" fill className="object-cover" sizes="40px" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{p?.name || id}</div>
                      <div className="truncate text-xs text-muted-foreground">{p ? `${p.model || ""} · ${p.category} · ${formatPrice(calculateDiscountedPrice(p))}` : "product not found"}</div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7" title="Move up" disabled={index === 0} onClick={() => move(index, -1)}><ArrowUp className="size-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" title="Move down" disabled={index === ids.length - 1} onClick={() => move(index, 1)}><ArrowDown className="size-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" title="Remove" onClick={() => toggle(id)}><X className="size-3.5" /></Button>
                  </li>
                );
              })}
            </ol>
          </div>
        )}

        {/* visual picker */}
        <div className="space-y-2 rounded-lg border bg-muted/30 p-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input id={`${title}-search`} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name or model" className="h-8 w-56 pl-8 text-sm" />
            </div>
            <button type="button" className={chip(!category)} onClick={() => setCategory("")}>All</button>
            {categories.map((c) => (
              <button key={c} type="button" className={chip(category === c)} onClick={() => setCategory(category === c ? "" : c)}>{c}</button>
            ))}
            <label className="ms-auto flex items-center gap-1.5 text-xs text-muted-foreground">
              <input type="checkbox" id={`${title}-interior`} checked={interiorOnly} onChange={(e) => setInteriorOnly(e.target.checked)} className="size-3.5 accent-[#171717]" />
              only with interior photo
            </label>
          </div>

          <div className="max-h-[440px] overflow-y-auto pr-1">
            {visible.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">No products match.</p>
            ) : (
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
                {visible.map((p) => {
                  const order = ids.indexOf(p._id);
                  const selected = order >= 0;
                  return (
                    <button
                      key={p._id}
                      type="button"
                      onClick={() => toggle(p._id)}
                      disabled={!selected && full}
                      title={p.name}
                      className={`group overflow-hidden rounded-lg border-2 bg-white text-left transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${selected ? "border-[#171717]" : "border-transparent hover:border-[#C6C6C4]"}`}
                    >
                      <div className="relative aspect-square bg-muted">
                        {p.images?.[0] && <Image src={p.images[0]} alt="" fill className="object-cover" sizes="(max-width: 640px) 33vw, 12vw" loading="lazy" />}
                        {selected && (
                          <span className="absolute left-1.5 top-1.5 grid size-6 place-items-center rounded-full bg-[#171717] text-xs font-semibold text-white">{order + 1}</span>
                        )}
                        {!selected && p.hasInteriorPhoto && (
                          <span className="absolute left-1.5 top-1.5 rounded bg-black/55 px-1 py-0.5 text-[9px] text-white">interior</span>
                        )}
                      </div>
                      <div className="p-1.5">
                        <div className="line-clamp-2 text-[11px] font-medium leading-tight">{p.name}</div>
                        <div className="truncate text-[10px] text-muted-foreground">{p.model} · {p.category}</div>
                        <div className="text-[11px] font-semibold tabular-nums">
                          {formatPrice(calculateDiscountedPrice(p))}
                          {p.discount > 0 && <span className="ms-1 font-normal text-muted-foreground line-through">{formatPrice(Number(p.price))}</span>}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          {ids.length > 0 && (
            <Button variant="ghost" size="sm" disabled={saving} onClick={() => setIds([])}>Clear (automatic)</Button>
          )}
          <Button size="sm" disabled={!dirty || saving} onClick={save}>
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />} Save
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/* ----------------------------------- page ----------------------------------- */

export default function HomepageAdminPage() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const { data, isPending } = useSiteContent();
  const content: SiteContent = useMemo(() => data?.data || {}, [data?.data]);

  const enabled = !!session?.accessToken;
  const products = useQuery({ ...allProducts(), enabled });
  const renders = useQuery({
    queryKey: ["admin-visualizer-renders", "showcase-picker"],
    queryFn: () => adminVisualizerServices.renders(session, { kind: "sample", status: "done", limit: 30 }),
    enabled,
  });

  const save = async <K extends SiteContentKey>(key: K, value: SiteContent[K], ok: string) => {
    try {
      const fresh = await getSession();
      await contentServices.updateContent(fresh, key, value);
      await queryClient.invalidateQueries({ queryKey: [siteContentQueryKey] });
      toast.success(ok);
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
      toast.error("Could not save. Try again.");
      throw error;
    }
  };

  const upload = async (file: File) => {
    const fresh = await getSession();
    const formData = new FormData();
    formData.append("photo", file);
    formData.append("preset", "hero");
    const response = await photosServices.uploadSinglePhoto(fresh, formData);
    if (!response.data?.success) throw new Error("Upload failed");
    return response.data.fileUrl as string;
  };

  const categoryImages = content.category_images || {};

  if (isPending || !session) {
    return <div className="flex h-[50vh] items-center justify-center"><LoadingSpinner /></div>;
  }

  return (
    <div className="flex w-full flex-col gap-6 pb-10">
      <div>
        <h1 className="text-2xl font-bold">Homepage</h1>
        <p className="text-sm text-muted-foreground">
          Everything on the home page that can be customised, top to bottom in the order visitors see it.
          Changes reach the live site within about 5 minutes.
        </p>
      </div>

      {/* 1. hero */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">1 · Photo behind the headline</CardTitle>
          <CardDescription>
            Shown darkened with white text on top, so bright, textured floors work best. Landscape, at least 1600px wide;
            on phones the middle of the photo stays visible. Without your own photo the site uses our default installation photo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-w-xl">
            <ImageSlot
              label="Homepage photo"
              aspect="aspect-[16/9]"
              currentUrl={content.hero_image}
              fallbackUrl={DEFAULT_HERO_IMAGE}
              onUpload={async (file) => { await save("hero_image", await upload(file), "Homepage photo updated"); }}
              onReset={() => save("hero_image", null, "Back to the default photo")}
            />
          </div>
        </CardContent>
      </Card>

      {/* 2. before / after */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <CardTitle className="text-base">2 · Before / after demo</CardTitle>
              <CardDescription>
                Pick the sample-room result shoppers can drag on the home page. Nothing picked = the block is not shown on the site.
                New results are made on the <Link href={RouteConstants.ADMIN_VISUALIZER} className="underline">Visualizer</Link> page (Sample rooms → Render).
              </CardDescription>
            </div>
            <Badge variant={content.home_showcase ? "default" : "destructive"}>{content.home_showcase ? "shown on the site" : "not picked: block hidden"}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {renders.isPending ? <LoadingSpinner /> : (renders.data?.items.length ?? 0) === 0 ? (
            <p className="text-sm text-muted-foreground">No sample-room results yet. Render a product into a sample room on the Visualizer page first.</p>
          ) : (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
              {renders.data?.items.map((r) => {
                const selected = content.home_showcase === r._id;
                return (
                  <button
                    key={r._id}
                    type="button"
                    onClick={() => save("home_showcase", selected ? null : r._id, selected ? "Demo removed from the home page" : "Before / after demo updated")}
                    className={`group overflow-hidden rounded-lg border-2 bg-white text-left transition-colors ${selected ? "border-[#171717]" : "border-transparent hover:border-[#C6C6C4]"}`}
                  >
                    <div className="grid grid-cols-2 gap-px bg-border">
                      <div className="relative aspect-[3/2] bg-muted">{r.roomUrl && <Image src={r.roomUrl} alt="before" fill className="object-cover" sizes="20vw" />}</div>
                      <div className="relative aspect-[3/2] bg-muted">{r.resultUrl && <Image src={r.resultUrl} alt="after" fill className="object-cover" sizes="20vw" />}</div>
                    </div>
                    <div className="flex items-center gap-2 p-2">
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium">{r.product?.name || r.productId}</div>
                        <div className="truncate text-xs text-muted-foreground">{r.product?.model}</div>
                      </div>
                      {selected ? <Badge className="gap-1 text-[10px]"><Check className="size-3" /> shown</Badge> : <Wand2 className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 3. category tiles */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">3 · Category tiles</CardTitle>
          <CardDescription>
            Photos of the category tiles (wood, laminate, SPC, panels &amp; cladding, sale). A tile without a photo takes the first
            product photo of that category. Portrait 4:5 looks best; the preview shows the crop.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {CATEGORY_MEDIA_SLOTS.map((slot) => (
              <ImageSlot
                key={slot.slug}
                label={slot.label}
                currentUrl={categoryImages[slot.slug]}
                onUpload={async (file) => { await save("category_images", { ...categoryImages, [slot.slug]: await upload(file) }, `${slot.label} photo updated`); }}
                onReset={() => { const next = { ...categoryImages }; delete next[slot.slug]; return save("category_images", next, `${slot.label} photo removed`); }}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 4 + 5. product sections */}
      {products.isPending ? <LoadingSpinner /> : (
        <>
          <ProductPicker
            title='4 · "Most chosen" products'
            description="The horizontal row of product cards. Pick and order them yourself, or leave it automatic."
            autoHint={`Automatic: the first ${POPULAR_AUTO} in-stock products that have an interior photo, in the catalog's daily order.`}
            value={content.home_popular || []}
            products={products.data?.data || []}
            onSave={(ids) => save("home_popular", ids, ids.length ? '"Most chosen" updated' : '"Most chosen" is automatic again')}
          />
          <ProductPicker
            title='5 · "Our work" photos'
            description="Square photos of real installations; each links to its product. Products should have a photo of the finished room as their first image."
            autoHint={`Automatic: the next ${WORKS_AUTO} in-stock products with an interior photo after the "Most chosen" row.`}
            value={content.home_works || []}
            products={products.data?.data || []}
            onSave={(ids) => save("home_works", ids, ids.length ? '"Our work" updated' : '"Our work" is automatic again')}
          />
        </>
      )}
    </div>
  );
}
