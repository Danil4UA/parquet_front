"use client";

import { FC, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Camera, Images, Sparkles, Share2, ShoppingCart, RefreshCw, Calculator, Download, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Product } from "@/types/products";
import visualizerServices, { SampleRoom, VisualizerRoom, roomPreviewUrl } from "@/services/visualizerServices";
import { trackVisualizer as track, useVisualizerJob } from "@/providers/VisualizerJobProvider";
import { allProductsByCategory } from "@/constants/queryInfo";
import { addToCart, setCollapsedСart } from "@/components/Cart/model/slice/cartSlice";
import { formatPrice, calculateDiscountedPrice } from "@/Utils/productsUtils";
import BeforeAfter from "./BeforeAfter";
import { isFlooring } from "./productPageUtils";

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

// The room (the shopper's photo lives only in this browser's memory) and the running or
// finished generation are kept in VisualizerJobProvider, so they survive closing this
// sheet and navigating to other pages. This component is only the UI.

const RoomVisualizerSheet: FC<RoomVisualizerSheetProps> = ({ product, language, open, onOpenChange, onStatusChange }) => {
  const t = useTranslations("ProductPage");
  const dispatch = useDispatch();
  const router = useRouter();

  const { room, job, setRoom, startRender, clearJob, reset, setSheetOpen, notifyBackground } = useVisualizerJob();
  const [samples, setSamples] = useState<SampleRoom[]>([]);
  const cameraRef = useRef<HTMLInputElement | null>(null);
  const galleryRef = useRef<HTMLInputElement | null>(null);

  // Everything about the current generation is derived from the shared job.
  const step: Step = !job ? "pick" : job.status === "processing" ? "processing" : job.status === "ready" ? "result" : "error";
  const active: Product = job?.product ?? product;
  const result = job?.result ?? null;
  const errorKey = job?.errorKey ?? "visualizer_error";

  useEffect(() => {
    onStatusChange?.(step === "processing" ? "processing" : step === "result" ? "ready" : "idle");
  }, [step, onStatusChange]);

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
    visualizerServices.getSamples().then(setSamples).catch(() => setSamples([]));
    // A finished job for another product is stale on this page: keep the room, start from "pick".
    if (job && job.status !== "processing" && job.product._id !== product._id) clearJob();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, product._id]);

  const handleOpenChange = (next: boolean) => {
    if (!next && step === "processing") notifyBackground();
    onOpenChange(next);
  };

  const renderFor = (targetRoom: VisualizerRoom, targetProduct: Product) => startRender(targetRoom, targetProduct, language);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    const photoRoom: VisualizerRoom = { kind: "photo", file, previewUrl: URL.createObjectURL(file) };
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

  const handleCheckout = () => {
    addActiveToCart();
    onOpenChange(false);
    router.push(`/${language}/order`);
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
        className="z-[200] mx-auto flex max-h-[92dvh] w-full max-w-lg flex-col rounded-t-2xl border-0 p-0 shadow-[0_-12px_40px_-12px_rgba(0,0,0,0.35)] sm:inset-y-0 sm:my-auto sm:h-fit sm:max-h-[88vh] sm:rounded-2xl sm:shadow-2xl"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
        <input ref={galleryRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />

        <div className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-[#D6D6D4] sm:hidden" />
        <div className="overflow-y-auto p-5">
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
                    className="flex h-14 w-full items-center justify-center gap-2.5 rounded-xl bg-[#171717] text-base font-semibold text-white transition-colors hover:bg-[#2A2A2A]"
                  >
                    <Camera className="size-5" strokeWidth={1.75} />
                    {t("visualizer_take_photo")}
                  </button>
                  <button
                    type="button"
                    onClick={() => galleryRef.current?.click()}
                    className="flex h-12 w-full items-center justify-center gap-2.5 rounded-xl border border-[#DCDCDB] bg-white text-[15px] font-medium text-[#171717] transition-colors hover:bg-[#F5F5F4]"
                  >
                    <Images className="size-5" strokeWidth={1.75} />
                    {t("visualizer_upload")}
                  </button>
                </div>
              )}

              {samples.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-[#6B6B6B]">{t("visualizer_samples_title")}</div>
                  <div className="-mx-5 flex gap-2 overflow-x-auto px-5 scroll-px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {samples.map((s) => (
                      <button
                        key={s.roomKey}
                        type="button"
                        onClick={() => applySample(s)}
                        className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-[#EBEBEA] ring-offset-2 transition-shadow hover:ring-2 hover:ring-[#171717]"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={s.roomUrl} alt="" className="size-full object-cover" loading="lazy" />
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

          {/* ---------- processing ---------- */}
          {step === "processing" && (
            <div className="space-y-4">
              <SheetHeader className="text-start space-y-1.5">
                <SheetTitle className="text-xl font-semibold tracking-[-0.01em] text-[#171717]">{t("visualizer_processing_title")}</SheetTitle>
                <SheetDescription className="text-[15px] leading-relaxed text-[#4B4B4B]">{t("visualizer_processing_hint")}</SheetDescription>
              </SheetHeader>
              <div className="relative overflow-hidden rounded-xl bg-[#F5F5F4]">
                {room ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={roomPreviewUrl(room)} alt="" className="block w-full opacity-80" />
                ) : (
                  <div className="aspect-[3/2] w-full" />
                )}
                <div className="visualizer-sweep absolute inset-0" />
                <div className="absolute inset-x-0 bottom-0 h-1 overflow-hidden bg-white/40">
                  <div className="visualizer-progress h-full w-1/3 bg-[#171717]" />
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-[#E5E5E5] p-3">
                <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-[#EBEBEA]">
                  {active.images[0] && <Image src={active.images[0]} alt="" fill sizes="48px" className="object-cover" />}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-[#171717]">{active.name}</div>
                  <div className="text-xs text-[#6B6B6B]">{active.model}</div>
                </div>
              </div>
            </div>
          )}

          {/* ---------- result ---------- */}
          {step === "result" && result && room && (
            <div className="space-y-4">
              <SheetHeader className="text-start">
                <SheetTitle className="text-xl font-semibold tracking-[-0.01em] text-[#171717]">{active.name}</SheetTitle>
                <SheetDescription className="text-sm text-[#6B6B6B]">
                  {active.model} · <span className="font-semibold text-[#171717]">{formatPrice(price)}</span> {isFlooring(active.category) ? t("per_sqm") : ""}
                </SheetDescription>
              </SheetHeader>

              <BeforeAfter before={roomPreviewUrl(room)} after={result.src} beforeLabel={t("visualizer_before")} afterLabel={t("visualizer_after")} hint={t("visualizer_drag")} />

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

              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={handleAddToCart} className="flex h-12 items-center justify-center gap-2 rounded-xl border border-[#DCDCDB] bg-white text-[15px] font-semibold text-[#171717] transition-colors hover:bg-[#F5F5F4]">
                    <ShoppingCart className="size-5" strokeWidth={1.75} />
                    {t("add_to_cart")}
                  </button>
                  <button type="button" onClick={handleCheckout} className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#171717] text-[15px] font-semibold text-white transition-colors hover:bg-[#2A2A2A]">
                    {t("visualizer_checkout")}
                    <ArrowRight className="size-4 rtl:rotate-180" strokeWidth={2} />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button type="button" onClick={handleDownload} aria-label={t("visualizer_download")} className="flex h-11 flex-col items-center justify-center gap-0.5 rounded-xl border border-[#DCDCDB] bg-white text-[11px] font-medium text-[#171717] transition-colors hover:bg-[#F5F5F4]">
                    <Download className="size-[18px]" strokeWidth={1.75} />
                    {t("visualizer_download")}
                  </button>
                  <button type="button" onClick={handleShare} aria-label={t("visualizer_share")} className="flex h-11 flex-col items-center justify-center gap-0.5 rounded-xl border border-[#DCDCDB] bg-white text-[11px] font-medium text-[#171717] transition-colors hover:bg-[#F5F5F4]">
                    <Share2 className="size-[18px]" strokeWidth={1.75} />
                    {t("visualizer_share")}
                  </button>
                  <button type="button" onClick={handleQuote} aria-label={t("visualizer_get_quote")} className="flex h-11 flex-col items-center justify-center gap-0.5 rounded-xl border border-[#DCDCDB] bg-white text-[11px] font-medium text-[#171717] transition-colors hover:bg-[#F5F5F4]">
                    <Calculator className="size-[18px]" strokeWidth={1.75} />
                    {t("visualizer_get_quote")}
                  </button>
                </div>
              </div>

              <button type="button" onClick={clearRoom} className="w-full text-center text-sm text-[#6B6B6B] underline underline-offset-2 hover:text-[#171717]">
                {t("visualizer_change_photo")}
              </button>
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
