"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";
import { Product } from "@/types/products";
import visualizerServices, { VisualizerResult, VisualizerRoom, roomPreviewUrl } from "@/services/visualizerServices";

/**
 * Site-wide state of the room visualizer.
 *
 * A generation takes 20–40 seconds, so it must survive the shopper closing the sheet
 * or navigating to another page. The chosen room (the shopper's photo lives only in
 * this browser's memory) and the running/finished job are kept here, above the pages.
 * When a job finishes while the sheet is not visible, a toast offers to jump back to
 * the product page, which opens the sheet on the result via `?visualizer=open`.
 */

export type VisualizerErrorKey = "visualizer_error" | "visualizer_limit" | "visualizer_ip_limit" | "visualizer_busy" | "visualizer_rejected";

/** Maps the backend's 429 reason codes to the shopper-facing message. */
const errorKeyFor = (err: unknown): VisualizerErrorKey => {
  const response = (err as { response?: { status?: number; data?: { code?: string } } })?.response;
  if (response?.status === 422) return "visualizer_rejected";
  if (response?.status !== 429) return "visualizer_error";
  if (response.data?.code === "busy") return "visualizer_busy";
  if (response.data?.code === "ip_limit") return "visualizer_ip_limit";
  return "visualizer_limit";
};
export type JobStatus = "processing" | "ready" | "error";

export interface VisualizerJob {
  seq: number;
  product: Product;
  language: string;
  status: JobStatus;
  result?: VisualizerResult;
  errorKey?: VisualizerErrorKey;
  startedAt: number;
}

interface VisualizerJobContextValue {
  room: VisualizerRoom | null;
  job: VisualizerJob | null;
  /** Replaces the room; a previous photo's object URL is released. */
  setRoom: (room: VisualizerRoom | null) => void;
  /** Starts a generation for `product` in `room`; the result is delivered through `job`. */
  startRender: (room: VisualizerRoom, product: Product, language: string) => void;
  /** Puts the sheet into its error state without a request (e.g. the photo could not be read). */
  reportError: (product: Product, language: string, errorKey: VisualizerErrorKey) => void;
  /** Forgets the finished/failed job but keeps the room. */
  clearJob: () => void;
  /** Forgets both the room and the job. */
  reset: () => void;
  /** The sheet reports whether it is on screen, so we know when a toast is needed. */
  setSheetOpen: (open: boolean) => void;
  /** Shows the "still working in the background" toast (the sheet calls it when closed mid-generation). */
  notifyBackground: () => void;
}

const VisualizerJobContext = createContext<VisualizerJobContextValue | null>(null);

export const VISUALIZER_OPEN_PARAM = "visualizer";

export const productPagePath = (language: string, product: Product) => `/${language}/products/${product.category}/${product._id}`;

export const trackVisualizer = (event: string, payload: Record<string, unknown> = {}) => {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...payload });
};

const releaseRoom = (room: VisualizerRoom | null) => {
  if (room?.kind === "photo") URL.revokeObjectURL(room.previewUrl);
};

/* ------------------------------ toast card ------------------------------ */

type ToastTone = "processing" | "ready" | "error";

interface VisualizerToastProps {
  tone: ToastTone;
  title: string;
  subtitle?: string;
  image?: string;
  actionLabel?: string;
  onAction?: () => void;
  onClose: () => void;
}

/** One card for every visualizer notification: thumbnail, text, primary action, close. Rendered through sonner. */
function VisualizerToast({ tone, title, subtitle, image, actionLabel, onAction, onClose }: VisualizerToastProps) {
  const accent = tone === "error" ? "border-[#F2C4C0]" : "border-[#E5E5E5]";
  return (
    <div className={`flex w-full items-center gap-3 rounded-2xl border ${accent} bg-white p-3 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.35)]`}>
      <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-[#EBEBEA]">
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" className={`size-full object-cover ${tone === "processing" ? "opacity-70" : ""}`} />
        )}
        {tone === "processing" && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/30">
            <Loader2 className="size-5 animate-spin text-[#171717]" strokeWidth={2} />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1 text-start">
        <div className={`text-sm font-semibold leading-tight ${tone === "error" ? "text-[#B3261E]" : "text-[#171717]"}`}>{title}</div>
        {subtitle && <div className="mt-0.5 truncate text-xs text-[#6B6B6B]">{subtitle}</div>}
      </div>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="h-9 shrink-0 rounded-xl bg-[#171717] px-3.5 text-xs font-semibold text-white transition-colors hover:bg-[#2A2A2A]"
        >
          {actionLabel}
        </button>
      )}
      <button type="button" onClick={onClose} aria-label="Close" className="-me-1 shrink-0 rounded-full p-1 text-[#9A9A9A] transition-colors hover:bg-[#F5F5F4] hover:text-[#171717]">
        <X className="size-4" />
      </button>
    </div>
  );
}

export function VisualizerJobProvider({ children }: { children: React.ReactNode }) {
  const t = useTranslations("ProductPage");
  const router = useRouter();
  const [room, setRoomState] = useState<VisualizerRoom | null>(null);
  const [job, setJob] = useState<VisualizerJob | null>(null);
  const roomRef = useRef<VisualizerRoom | null>(null);
  const seqRef = useRef(0);
  const sheetOpenRef = useRef(false);

  const setRoom = useCallback((next: VisualizerRoom | null) => {
    if (roomRef.current !== next) releaseRoom(roomRef.current);
    roomRef.current = next;
    setRoomState(next);
  }, []);

  const setSheetOpen = useCallback((open: boolean) => {
    sheetOpenRef.current = open;
  }, []);

  const clearJob = useCallback(() => setJob(null), []);

  const reportError = useCallback((product: Product, language: string, errorKey: VisualizerErrorKey) => {
    const seq = ++seqRef.current;
    setJob({ seq, product, language, status: "error", errorKey, startedAt: Date.now() });
  }, []);

  const reset = useCallback(() => {
    seqRef.current += 1; // any in-flight result is ignored
    setRoom(null);
    setJob(null);
  }, [setRoom]);

  const BACKGROUND_TOAST_ID = "visualizer-background";

  const notify = useCallback(
    (finished: VisualizerJob) => {
      toast.dismiss(BACKGROUND_TOAST_ID);
      if (sheetOpenRef.current) return;
      const open = () => router.push(`${productPagePath(finished.language, finished.product)}?${VISUALIZER_OPEN_PARAM}=open`);
      const ready = finished.status === "ready";
      toast.custom(
        (id) => (
          <VisualizerToast
            tone={ready ? "ready" : "error"}
            title={ready ? t("visualizer_ready_toast") : t(finished.errorKey || "visualizer_error")}
            subtitle={finished.product.name}
            image={ready ? finished.result?.src : finished.product.images?.[0]}
            actionLabel={t("visualizer_view")}
            onAction={() => { toast.dismiss(id); open(); }}
            onClose={() => toast.dismiss(id)}
          />
        ),
        { duration: ready ? 20000 : 15000, unstyled: true }
      );
    },
    [router, t]
  );

  const notifyBackground = useCallback(() => {
    const current = roomRef.current;
    toast.custom(
      (id) => (
        <VisualizerToast
          tone="processing"
          title={t("visualizer_processing_title")}
          subtitle={t("visualizer_background_toast")}
          image={current ? roomPreviewUrl(current) : undefined}
          onClose={() => toast.dismiss(id)}
        />
      ),
      { id: BACKGROUND_TOAST_ID, duration: 6000, unstyled: true }
    );
  }, [t]);

  const startRender = useCallback(
    (targetRoom: VisualizerRoom, product: Product, language: string) => {
      const seq = ++seqRef.current;
      const startedAt = Date.now();
      setJob({ seq, product, language, status: "processing", startedAt });

      visualizerServices
        .render(targetRoom, product._id)
        .then((result) => {
          if (seq !== seqRef.current) return;
          const finished: VisualizerJob = { seq, product, language, status: "ready", result, startedAt };
          setJob(finished);
          trackVisualizer("visualizer_result", { item_id: product._id, duration_ms: Date.now() - startedAt, cached: result.cached });
          notify(finished);
        })
        .catch((err: unknown) => {
          if (seq !== seqRef.current) return;
          const status = (err as { response?: { status?: number } })?.response?.status;
          const errorKey = errorKeyFor(err);
          const finished: VisualizerJob = { seq, product, language, status: "error", errorKey, startedAt };
          setJob(finished);
          trackVisualizer("visualizer_error", { item_id: product._id, status });
          notify(finished);
        });
    },
    [notify]
  );

  // Release the photo's object URL when the whole app unmounts.
  useEffect(() => () => releaseRoom(roomRef.current), []);

  const value = useMemo<VisualizerJobContextValue>(
    () => ({ room, job, setRoom, startRender, reportError, clearJob, reset, setSheetOpen, notifyBackground }),
    [room, job, setRoom, startRender, reportError, clearJob, reset, setSheetOpen, notifyBackground]
  );

  return <VisualizerJobContext.Provider value={value}>{children}</VisualizerJobContext.Provider>;
}

export const useVisualizerJob = () => {
  const ctx = useContext(VisualizerJobContext);
  if (!ctx) throw new Error("useVisualizerJob must be used inside VisualizerJobProvider");
  return ctx;
};
