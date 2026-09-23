"use client";

import { FC, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Camera, Images, Sparkles, Share2, ShoppingCart, RefreshCw, Download, Loader2 } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Product } from "@/types/products";
import visualizerServices, { SampleRoom, VisualizerRoom, roomPreviewUrl } from "@/services/visualizerServices";
import { trackVisualizer as track, useVisualizerJob } from "@/providers/VisualizerJobProvider";
import { allProductsByCategory } from "@/constants/queryInfo";
import { addToCart, setCollapsedСart } from "@/components/Cart/model/slice/cartSlice";
import { formatPrice, calculateDiscountedPrice } from "@/Utils/productsUtils";
import BeforeAfter from "@/components/BeforeAfter/BeforeAfter";
import { isFlooring } from "./productPageUtils";
import { downscaleImage, ImageDecodeError } from "@/Utils/imageUtils";

export type VisualizerStatus = "idle" | "processing" | "ready";

interface RoomVisualizerSheetProps {
  product: Product;
  language: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Lets the page reflect the state outside the sheet (gallery pill, toast). */
  onStatusChange?: (status: VisualizerStatus) => void;
}

type Step = "pick" | "processing" | "result" | "error";

// The result comes back in the photo's own aspect ratio (the server pads and crops around the
// provider's fixed canvases), so the stage simply takes the photo's ratio. Knowing it up front
// means nothing jumps when the preview or the result loads.
type Aspect = number; // width / height
const measureAspect = (w: number, h: number): Aspect => Math.round((w / h) * 1000) / 1000;
const DEFAULT_ASPECT: Aspect = 4 / 3;

// Aspect per image source, filled before an image is ever shown at full width
// (from the sample thumbnails, or by measuring the shopper's photo before the render starts).
const aspectCache = new Map<string, Aspect>();

const loadAspect = (src: string): Promise<Aspect> =>
  new Promise((resolve) => {
    const cached = aspectCache.get(src);
    if (cached) { resolve(cached); return; }
    const img = new window.Image();
    img.onload = () => { const a = measureAspect(img.naturalWidth, img.naturalHeight); aspectCache.set(src, a); resolve(a); };
    img.onerror = () => resolve(DEFAULT_ASPECT);
    img.src = src;
  });

const useSnappedAspect = (src: string | null): Aspect => {
  const [measured, setMeasured] = useState<Aspect>(DEFAULT_ASPECT);
  useEffect(() => {
    if (!src || aspectCache.has(src)) return;
    let cancelled = false;
    loadAspect(src).then((a) => { if (!cancelled) setMeasured(a); });
    return () => { cancelled = true; };
  }, [src]);
  // Synchronous cache hit wins, so a known image never renders at the wrong height even for one frame.
  return (src && aspectCache.get(src)) || measured;
};

const SAMPLE_SKELETON_COUNT = 4;

// The stage never grows taller than --stage-max (set per breakpoint on the wrapper below), so a
// portrait photo shrinks and centres instead of pushing the rest of the sheet below the fold.
const stageStyle = (aspect: Aspect) => ({ aspectRatio: String(aspect), width: `min(100%, calc(var(--stage-max) * ${aspect}))` });

// The room (the shopper's photo lives only in this browser's memory) and the running or
// finished generation are kept in VisualizerJobProvider, so they survive closing this
// sheet and navigating to other pages. This component is only the UI.

const RoomVisualizerSheet: FC<RoomVisualizerSheetProps> = ({ product, language, open, onOpenChange, onStatusChange }) => {
  const t = useTranslations("ProductPage");
  const dispatch = useDispatch();

  const { room, job, setRoom, startRender, reportError, clearJob, reset, setSheetOpen, notifyBackground } = useVisualizerJob();
  const [samples, setSamples] = useState<SampleRoom[] | null>(null); // null = still loading
  const [preparing, setPreparing] = useState(false); // photo being converted before the render starts
  const cameraRef = useRef<HTMLInputElement | null>(null);
  const galleryRef = useRef<HTMLInputElement | null>(null);

  // Everything about the current generation is derived from the shared job.
  const step: Step = !job ? "pick" : job.status === "processing" ? "processing" : job.status === "ready" ? "result" : "error";
  const active: Product = job?.product ?? product;
  const result = job?.result ?? null;
  const errorKey = job?.errorKey ?? "visualizer_error";
  const roomSrc = room ? roomPreviewUrl(room) : null;
  const aspect = useSnappedAspect(roomSrc);

  // The gallery pill reflects a generation for *this* product only; a job for another product is invisible here.
  useEffect(() => {
    const mine = job?.product._id === product._id;
    onStatusChange?.(mine && step === "processing" ? "processing" : mine && step === "result" ? "ready" : "idle");
  }, [step, job, product._id, onStatusChange]);

  // Let the provider know whether we are on screen: it only toasts when we are not.
  useEffect(() => {
    setSheetOpen(open);
    return () => setSheetOpen(false);
  }, [open, setSheetOpen]);

  const { data: similar } = useQuery({
    ...allProductsByCategory({ category: product.category, language, limit: 12, availability: "in_stock" }),
    enabled: open && isFlooring(product.category),
  });
  const alternatives = [product, ...(similar?.data?.products || []).filter((p) => p._id !== product._id)].slice(0, 10);

  useEffect(() => {
    if (!open) return;
    track("visualizer_open", { item_id: product._id });
    if (samples === null) visualizerServices.getSamples().then(setSamples).catch(() => setSamples([]));
    // A finished job for another product is stale on this page: keep the room, start from "pick".
    if (job && job.status !== "processing" && job.product._id !== product._id) clearJob();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, product._id]);

  const handleOpenChange = (next: boolean) => {
    if (!next && step === "processing") notifyBackground();
    onOpenChange(next);
  };

  const renderFor = (targetRoom: VisualizerRoom, targetProduct: Product) => startRender(targetRoom, targetProduct, language);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    // Shrink on the device: a 10 MB camera photo becomes a ~400 KB upright JPEG. A format the
    // browser cannot decode (HEIC on a desktop) is converted by the server instead, so the
    // preview and the "before" picture are always displayable.
    let prepared: File;
    setPreparing(true);
    try {
      try {
        prepared = await downscaleImage(file);
      } catch (err) {
        if (!(err instanceof ImageDecodeError)) throw err;
        prepared = await visualizerServices.prepareOnServer(file);
      }
    } catch {
      reportError(product, language, "visualizer_error");
      return;
    } finally {
      setPreparing(false);
    }
    const photoRoom: VisualizerRoom = { kind: "photo", file: prepared, previewUrl: URL.createObjectURL(prepared) };
    await loadAspect(photoRoom.previewUrl); // know the stage height before anything is shown
    setRoom(photoRoom);
    track("visualizer_upload", { item_id: product._id });
    renderFor(photoRoom, product);
  };

  const applySample = (sample: SampleRoom) => {
    setRoom(sample);
    track("visualizer_sample", { item_id: product._id });
    renderFor(sample, product);
  };

  const clearRoom = () => reset();

  const addActiveToCart = () => {
    const quantity = isFlooring(active.category) && active.boxCoverage ? Number(active.boxCoverage) : 1;
    dispatch(addToCart({ ...active, quantity }));
    track("visualizer_add_to_cart", { item_id: active._id });
  };

  const handleAddToCart = () => {
    addActiveToCart();
    onOpenChange(false);
    dispatch(setCollapsedСart(false));
  };

  const resultFileName = () => `${(active.model || active.name || "floor").replace(/[^\w.-]+/g, "_")}.jpg`;

  const handleDownload = async () => {
    if (!result) return;
    track("visualizer_download", { item_id: active._id });
    if (result.resultKey) {
      // Stored sample result: top-level navigation to an attachment response, the page stays.
      window.location.href = visualizerServices.downloadUrl(result.resultKey, resultFileName());
      return;
    }
    // Customer photo: the result exists only in this browser, save it from memory.
    try {
      const blob = await visualizerServices.resultBlob(result, resultFileName());
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = resultFileName();
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch {
      window.open(result.src, "_blank", "noopener,noreferrer");
    }
  };

  const handleShare = async () => {
    if (!result) return;
    try {
      const blob = await visualizerServices.resultBlob(result, resultFileName());
      const file = new File([blob], resultFileName(), { type: blob.type || "image/jpeg" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: active.name });
        track("visualizer_share", { item_id: active._id });
        return;
      }
    } catch {
      /* fall through to opening the image */
    }
    window.open(result.src, "_blank", "noopener,noreferrer");
  };

  const handleQuote = () => {
    onOpenChange(false);
    setTimeout(() => document.querySelector("[data-contact-form]")?.scrollIntoView({ behavior: "smooth", block: "center" }), 250);
  };

  const price = calculateDiscountedPrice(active);

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="bottom"
        className="z-[200] mx-auto flex h-[88dvh] w-full max-w-lg flex-col rounded-t-2xl border-0 p-0 shadow-[0_-12px_40px_-12px_rgba(0,0,0,0.35)] sm:inset-y-0 sm:my-auto sm:h-fit sm:max-h-[88vh] sm:rounded-2xl sm:shadow-2xl"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
        <input ref={galleryRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />

        <div className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-[#D6D6D4] sm:hidden" />
        <div className="flex-1 overflow-y-auto p-5">
          {/* ---------- pick ---------- */}
          {step === "pick" && (
            <div className="space-y-5">
              <SheetHeader className="text-start space-y-1.5">
                <SheetTitle className="text-xl font-semibold tracking-[-0.01em] text-[#171717]">{t("visualizer_title")}</SheetTitle>
                <SheetDescription className="text-[15px] leading-relaxed text-[#4B4B4B]">{t("visualizer_intro")}</SheetDescription>
              </SheetHeader>

              {room ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 rounded-xl bg-[#F5F5F4] p-3">
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-[#EBEBEA]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={roomPreviewUrl(room)} alt="" className="size-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-[#171717]">{t("visualizer_your_room")}</div>
                      <button type="button" onClick={clearRoom} className="text-sm text-[#6B6B6B] underline underline-offset-2 hover:text-[#171717]">
                        {t("visualizer_change_photo")}
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => renderFor(room, product)}
                    className="flex h-14 w-full items-center justify-center gap-2.5 rounded-xl bg-[#171717] text-base font-semibold text-white transition-colors hover:bg-[#2A2A2A]"
                  >
                    <Sparkles className="size-5" strokeWidth={1.75} />
                    {t("visualizer_render")}
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => cameraRef.current?.click()}
                    disabled={preparing}
                    className="flex h-14 w-full items-center justify-center gap-2.5 rounded-xl bg-[#171717] text-base font-semibold text-white transition-colors hover:bg-[#2A2A2A] disabled:opacity-70"
                  >
                    {preparing ? <Loader2 className="size-5 animate-spin" strokeWidth={1.75} /> : <Camera className="size-5" strokeWidth={1.75} />}
                    {preparing ? t("visualizer_processing_pill") : t("visualizer_take_photo")}
                  </button>
                  <button
                    type="button"
                    onClick={() => galleryRef.current?.click()}
                    disabled={preparing}
                    className="flex h-12 w-full items-center justify-center gap-2.5 rounded-xl border border-[#DCDCDB] bg-white text-[15px] font-medium text-[#171717] transition-colors hover:bg-[#F5F5F4] disabled:opacity-50"
                  >
                    <Images className="size-5" strokeWidth={1.75} />
                    {t("visualizer_upload")}
                  </button>
                </div>
              )}

              {(samples === null || samples.length > 0) && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-[#6B6B6B]">{t("visualizer_samples_title")}</div>
                  <div className="-mx-5 flex gap-2 overflow-x-auto px-5 scroll-px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {samples === null && Array.from({ length: SAMPLE_SKELETON_COUNT }, (_, i) => (
                      <div key={i} className="h-20 w-28 shrink-0 animate-pulse rounded-lg bg-[#EBEBEA]" aria-hidden />
                    ))}
                    {samples?.map((s) => (
                      <button
                        key={s.roomKey}
                        type="button"
                        onClick={() => applySample(s)}
                        className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-[#EBEBEA] transition-shadow hover:ring-2 hover:ring-inset hover:ring-[#171717] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#171717]"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={s.roomUrl}
                          alt=""
                          className="size-full object-cover"
                          loading="lazy"
                          onLoad={(e) => aspectCache.set(s.roomUrl, measureAspect(e.currentTarget.naturalWidth, e.currentTarget.naturalHeight))}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-1 text-xs leading-relaxed text-[#6B6B6B]">
                <p>{t("visualizer_tip")}</p>
                <p>{t("visualizer_privacy")}</p>
              </div>
            </div>
          )}

          {/* ---------- stage: processing and result share one layout, so nothing moves when the result arrives ---------- */}
          {(step === "processing" || step === "result") && room && (
            <div className="space-y-4">
              <SheetHeader className="text-start space-y-1">
                <SheetTitle className="truncate text-xl font-semibold tracking-[-0.01em] text-[#171717]">
                  {step === "processing" ? t("visualizer_processing_title") : active.name}
                </SheetTitle>
                <SheetDescription className="truncate text-sm text-[#6B6B6B]">
                  {step === "processing" ? (
                    t("visualizer_processing_hint")
                  ) : (
                    <>
                      {active.model} · <span className="font-semibold text-[#171717]">{formatPrice(price)}</span> {isFlooring(active.category) ? t("per_sqm") : ""}
                    </>
                  )}
                </SheetDescription>
              </SheetHeader>

              <div className="flex w-full justify-center overflow-hidden rounded-xl bg-[#F5F5F4] [--stage-max:44dvh] sm:[--stage-max:400px]">
              {step === "result" && result ? (
                <BeforeAfter
                  before={roomSrc!}
                  after={result.src}
                  style={stageStyle(aspect)}
                  beforeLabel={t("visualizer_before")}
                  afterLabel={t("visualizer_after")}
                  hint={t("visualizer_drag")}
                  actions={
                    <>
                      <button type="button" onClick={handleDownload} aria-label={t("visualizer_download")} title={t("visualizer_download")} className="flex size-11 items-center justify-center rounded-full bg-black/65 text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-black/80 active:bg-black">
                        <Download className="size-5" strokeWidth={1.75} />
                      </button>
                      <button type="button" onClick={handleShare} aria-label={t("visualizer_share")} title={t("visualizer_share")} className="flex size-11 items-center justify-center rounded-full bg-black/65 text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-black/80 active:bg-black">
                        <Share2 className="size-5" strokeWidth={1.75} />
                      </button>
                    </>
                  }
                />
              ) : (
                <div className="relative overflow-hidden rounded-xl bg-[#F5F5F4]" style={stageStyle(aspect)}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={roomSrc!} alt="" className="absolute inset-0 h-full w-full object-cover opacity-80" />
                  <div className="visualizer-sweep absolute inset-0" />
                  <div className="absolute inset-x-0 bottom-0 h-1 overflow-hidden bg-white/40">
                    <div className="visualizer-progress h-full w-1/3 bg-[#171717]" />
                  </div>
                </div>
              )}
              </div>

              {alternatives.length > 1 && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-[#6B6B6B]">{t("visualizer_try_other")}</div>
                  <div className="-mx-5 flex gap-2 overflow-x-auto px-5 scroll-px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {alternatives.map((p) => (
                      <button
                        key={p._id}
                        type="button"
                        onClick={() => p._id !== active._id && renderFor(room, p)}
                        aria-pressed={p._id === active._id}
                        title={p.name}
                        className={`relative size-16 shrink-0 overflow-hidden rounded-lg bg-[#EBEBEA] border-2 transition-colors ${p._id === active._id ? "border-[#171717]" : "border-transparent hover:border-[#C6C6C4]"}`}
                      >
                        {p.images[0] && <Image src={p.images[0]} alt={p.name} fill sizes="64px" className="object-cover" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* One primary action. Present in both states, disabled while processing, so the height never changes. */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={step === "processing"}
                  className="flex h-14 w-full items-center justify-center gap-2.5 rounded-xl bg-[#171717] text-base font-semibold text-white transition-colors hover:bg-[#2A2A2A] disabled:cursor-default disabled:opacity-40"
                >
                  <ShoppingCart className="size-5" strokeWidth={1.75} />
                  {t("add_to_cart")}
                </button>
                <div className={`flex items-center justify-center gap-5 text-sm text-[#6B6B6B] transition-opacity ${step === "processing" ? "pointer-events-none opacity-40" : ""}`}>
                  <button type="button" onClick={handleQuote} disabled={step === "processing"} className="underline underline-offset-4 hover:text-[#171717]">
                    {t("visualizer_get_quote")}
                  </button>
                  <button type="button" onClick={clearRoom} disabled={step === "processing"} className="underline underline-offset-4 hover:text-[#171717]">
                    {t("visualizer_change_photo")}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ---------- error ---------- */}
          {step === "error" && (
            <div className="space-y-4">
              <SheetHeader className="text-start">
                <SheetTitle className="text-xl font-semibold tracking-[-0.01em] text-[#171717]">{t("visualizer_title")}</SheetTitle>
                <SheetDescription className="text-[15px] leading-relaxed text-[#B3261E]">{t(errorKey)}</SheetDescription>
              </SheetHeader>
              <div className="grid grid-cols-2 gap-2">
                {room && errorKey === "visualizer_error" && (
                  <button type="button" onClick={() => renderFor(room, active)} className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#171717] text-[15px] font-semibold text-white hover:bg-[#2A2A2A]">
                    <RefreshCw className="size-4" />
                    {t("visualizer_retry")}
                  </button>
                )}
                <button type="button" onClick={clearRoom} className="flex h-12 items-center justify-center rounded-xl border border-[#DCDCDB] bg-white text-[15px] font-medium text-[#171717] hover:bg-[#F5F5F4]">
                  {t("visualizer_change_photo")}
                </button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default RoomVisualizerSheet;
