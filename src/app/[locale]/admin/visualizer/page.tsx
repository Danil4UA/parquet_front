"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Upload, Sparkles, Trash2, RefreshCw, ExternalLink, Eye, EyeOff, Wand2, AlertTriangle, ShieldCheck, X, ImageOff, Camera, LayoutTemplate } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import LoadingSpinner from "@/components/LoadingSpinner";
import Pagination from "../_components/Pagination/Pagination";
import adminVisualizerServices, { AdminRender, AdminRoom, RecentFailure, VisualizerStats } from "@/services/adminVisualizerServices";
import { allProducts } from "@/constants/queryInfo";

const PAGE_SIZE = 30;
const SAMPLE_PROMPT_HINT =
  "Photo of an empty modern living room in an Israeli apartment, taken with a phone, daylight, white walls, old grey ceramic tile floor clearly visible, a sofa against the wall, no people, no text.";

const formatDate = (iso: string) => new Date(iso).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
const seconds = (ms?: number) => (ms ? `${(ms / 1000).toFixed(1)}s` : "—");
const usd = (value?: number | null, digits = 2) => (value === undefined || value === null ? "—" : `$${value.toFixed(digits)}`);

const ERROR_KIND_LABEL: Record<string, string> = {
  provider: "AI provider error",
  timeout: "Timed out",
  image: "Bad image",
  rejected: "Rejected by safety filter",
  internal: "Internal error",
};

/* ---------------------------------- stats ---------------------------------- */

function StatCard({ label, value, hint, tone }: { label: string; value: React.ReactNode; hint?: string; tone?: "good" | "bad" }) {
  const color = tone === "good" ? "text-emerald-700" : tone === "bad" ? "text-red-700" : "";
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className={`mt-1 text-2xl font-bold tabular-nums ${color}`}>{value ?? "…"}</div>
        {hint && <div className="mt-0.5 text-[11px] text-muted-foreground">{hint}</div>}
      </CardContent>
    </Card>
  );
}

function StatsHeader({ stats, isPending }: { stats?: VisualizerStats; isPending: boolean }) {
  const s = stats;
  const todayFailedTone = s && s.today.failed > 0 ? "bad" : undefined;
  return (
    <div className="space-y-3">
      {s && s.warnings.length > 0 && (
        <div className="space-y-2">
          {s.warnings.map((w) => (
            <div key={w} className="flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              <span>{w}</span>
            </div>
          ))}
        </div>
      )}
      {s && s.warnings.length === 0 && !isPending && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          <ShieldCheck className="size-4 shrink-0" />
          <span>
            No problems detected. Last successful generation: {s.lastSuccessAt ? formatDate(s.lastSuccessAt) : "never"}.
          </span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Successful today" value={s?.today.done} tone="good" hint={s ? `${s.today.used} / ${s.today.limit} of daily budget used` : undefined} />
        <StatCard label="Failed today" value={s?.today.failed} tone={todayFailedTone} hint={s?.lastFailureAt ? `last failure ${formatDate(s.lastFailureAt)}` : "no failures yet"} />
        <StatCard label="Failed, all time" value={s?.allTime.failed} hint={s ? `${s.allTime.done} successful all time` : undefined} />
        <StatCard label="Success rate, 7 days" value={s ? (s.last7d.successRate === null ? "—" : `${s.last7d.successRate}%`) : undefined} hint={s ? `${s.last7d.done + s.last7d.failed} attempts` : undefined} />
        <StatCard label="Cost today" value={s ? usd(s.today.costUsd) : undefined} hint={s ? `30 days: ${usd(s.last30d.costUsd)} · all time: ${usd(s.allTime.costUsd)}` : undefined} />
        <StatCard label="Avg per generation" value={s ? usd(s.allTime.avgCostUsd, 3) : undefined} hint={s ? `avg time ${seconds(s.avgDurationMs)}` : undefined} />
      </div>
    </div>
  );
}

function RecentFailures({ items, onDismiss, onDismissAll }: { items: RecentFailure[]; onDismiss: (id: string) => Promise<void>; onDismissAll: () => Promise<void> }) {
  const [busy, setBusy] = useState<string | null>(null);
  if (items.length === 0) return null;
  const run = async (key: string, fn: () => Promise<void>) => { setBusy(key); try { await fn(); } finally { setBusy(null); } };

  return (
    <Card className="border-red-200">
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 pb-2">
        <div>
          <CardTitle className="text-base">Recent errors</CardTitle>
          <CardDescription>Newest first. Dismissing hides an error here; the counters above and the records in the list are kept.</CardDescription>
        </div>
        <Button variant="outline" size="sm" className="h-7 shrink-0 gap-1 text-xs" disabled={busy !== null} onClick={() => run("all", onDismissAll)}>
          {busy === "all" ? <Loader2 className="size-3.5 animate-spin" /> : <X className="size-3.5" />} Dismiss all
        </Button>
      </CardHeader>
      <CardContent className="divide-y">
        {items.map((f) => (
          <div key={f._id} className="flex items-start gap-3 py-2 text-sm">
            <div className="w-24 shrink-0 text-xs text-muted-foreground">{formatDate(f.createdAt)}</div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="destructive" className="text-[10px]">{ERROR_KIND_LABEL[f.errorKind || ""] || "Error"}</Badge>
                <span className="truncate font-medium">{f.product?.name || f.productId || "—"}</span>
                <span className="text-xs text-muted-foreground">{f.isSample ? "sample room" : "customer photo"} · {seconds(f.durationMs)}</span>
              </div>
              {f.error && <p className="mt-0.5 line-clamp-2 break-words text-xs text-muted-foreground" title={f.error}>{f.error}</p>}
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" title="Dismiss" disabled={busy !== null} onClick={() => run(f._id, () => onDismiss(f._id))}>
              {busy === f._id ? <Loader2 className="size-4 animate-spin" /> : <X className="size-4" />}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

/* ---------------------------------- rooms ---------------------------------- */

function RoomCard({
  room,
  onToggle,
  onRename,
  onDelete,
  onRender,
  onOpenRenders,
}: {
  room: AdminRoom;
  onToggle: (room: AdminRoom, active: boolean) => Promise<void>;
  onRename: (room: AdminRoom, title: string) => Promise<void>;
  onDelete: (room: AdminRoom) => Promise<void>;
  onRender: (room: AdminRoom) => void;
  onOpenRenders: (room: AdminRoom) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [title, setTitle] = useState(room.title || "");
  useEffect(() => setTitle(room.title || ""), [room.title]);

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    try { await fn(); } finally { setBusy(false); }
  };

  return (
    <div className={`overflow-hidden rounded-lg border bg-white ${!room.isActive ? "opacity-60" : ""}`}>
      <div className="relative aspect-[3/2] bg-muted">
        <Image src={room.roomUrl} alt={room.title || room.roomKey} fill className="object-cover" sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw" />
        {busy && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40">
            <Loader2 className="size-6 animate-spin text-white" />
          </div>
        )}
        <div className="absolute left-2 top-2 flex gap-1">
          <Badge variant="secondary" className="bg-white/90 text-xs">{room.done}/{room.renders} renders</Badge>
          {!room.isActive && <Badge variant="secondary" className="bg-white/90 text-xs">hidden</Badge>}
        </div>
      </div>
      <div className="space-y-2 p-2.5">
        <Input
          value={title}
          placeholder="Title (optional)"
          className="h-8 text-sm"
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => title !== (room.title || "") && run(() => onRename(room, title))}
        />
        <div className="flex items-center justify-between gap-2">
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <Switch checked={room.isActive} disabled={busy} onCheckedChange={(v) => run(() => onToggle(room, v))} />
            {room.isActive ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
            {room.isActive ? "Visible" : "Hidden"}
          </label>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" className="h-7 gap-1 text-xs" disabled={busy} onClick={() => onRender(room)} title="Render a product into this room">
              <Wand2 className="size-3.5" /> Render
            </Button>
            <Button variant="ghost" size="sm" className="h-7 text-xs" disabled={busy} onClick={() => onOpenRenders(room)}>
              Results
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" disabled={busy} title="Delete room and its renders" onClick={() => { if (confirm("Delete this room and all its renders?")) run(() => onDelete(room)); }}>
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------- renders --------------------------------- */

/**
 * One uniform card per generation, whatever its outcome:
 * image (the result, or the product photo when there is no stored result),
 * status, cost, product, date, time, model.
 */
function RenderCard({ render, onRegenerate, onDelete }: { render: AdminRender; onRegenerate: (r: AdminRender) => Promise<void>; onDelete: (r: AdminRender) => Promise<void> }) {
  const [busy, setBusy] = useState(false);
  const run = async (fn: () => Promise<void>) => { setBusy(true); try { await fn(); } finally { setBusy(false); } };

  const failed = render.status === "failed";
  const pending = render.status === "pending";
  const image = render.resultUrl || render.product?.image;
  const cost = render.estimatedCostUsd === undefined || render.estimatedCostUsd === null ? null : `$${render.estimatedCostUsd.toFixed(3)}`;
  const errorLabel = failed ? ERROR_KIND_LABEL[render.errorKind || ""] || "Failed" : null;

  return (
    <div className={`relative flex flex-col overflow-hidden rounded-lg border bg-white ${failed ? "border-red-200" : ""}`}>
      <div className="relative aspect-[4/3] bg-muted">
        {image ? (
          <Image src={image} alt="" fill className={`object-cover ${failed || !render.resultUrl ? "opacity-60" : ""}`} sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 20vw" />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground"><ImageOff className="size-6" /></div>
        )}
        {!render.resultUrl && !failed && !pending && (
          <span className="absolute inset-x-0 bottom-0 bg-black/55 px-1.5 py-0.5 text-center text-[10px] text-white">result not stored (customer photo)</span>
        )}
        <div className="absolute left-1.5 top-1.5 flex gap-1">
          {failed ? (
            <span className="rounded bg-red-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">{errorLabel}</span>
          ) : pending ? (
            <span className="rounded bg-slate-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">pending</span>
          ) : (
            <span className="rounded bg-emerald-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">done</span>
          )}
        </div>
        {cost && <span className="absolute right-1.5 top-1.5 rounded bg-black/70 px-1.5 py-0.5 text-[11px] font-semibold text-white">{cost}</span>}
        <span className="absolute bottom-1.5 right-1.5 flex items-center gap-1 rounded bg-black/55 px-1.5 py-0.5 text-[10px] text-white" title={render.isSample ? "Rendered into a sample room" : "Rendered into a customer's own photo"}>
          {render.isSample ? <LayoutTemplate className="size-3" /> : <Camera className="size-3" />}
          {render.isSample ? "sample room" : "customer photo"}
        </span>
        {busy && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40">
            <Loader2 className="size-6 animate-spin text-white" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-2">
        <div className="truncate text-sm font-medium" title={render.product?.name}>{render.product?.name || render.productId || "—"}</div>
        <div className="truncate text-[11px] text-muted-foreground">
          {render.product?.model ? `${render.product.model} · ` : ""}{formatDate(render.createdAt)}
        </div>
        <div className="truncate text-[11px] text-muted-foreground">
          {seconds(render.durationMs)} · {render.aiModel || "—"}{render.quality ? ` · ${render.quality}` : ""}
        </div>
        {failed && render.error && (
          <p className="line-clamp-2 text-[11px] text-red-700" title={render.error}>{render.error}</p>
        )}
        <div className="mt-auto flex items-center justify-end gap-0.5 pt-1">
          {render.resultUrl && (
            <Button asChild variant="ghost" size="icon" className="h-7 w-7" title="Open result">
              <a href={render.resultUrl} target="_blank" rel="noopener noreferrer"><ExternalLink className="size-4" /></a>
            </Button>
          )}
          {render.isSample && render.roomKey && (
            <Button variant="ghost" size="icon" className="h-7 w-7" title="Regenerate (one paid request)" disabled={busy} onClick={() => run(() => onRegenerate(render))}>
              <RefreshCw className="size-4" />
            </Button>
          )}
          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" title="Delete record" disabled={busy} onClick={() => { if (confirm("Delete this record?")) run(() => onDelete(render)); }}>
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------- page ----------------------------------- */

export default function AdminVisualizerPage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState("renders");
  const [samplePage, setSamplePage] = useState(1);
  const [renderPage, setRenderPage] = useState(1);
  const [renderRoomKey, setRenderRoomKey] = useState<string>("");
  const [renderStatus, setRenderStatus] = useState<string>("");
  const [renderKind, setRenderKind] = useState<"" | "customer" | "sample">("");
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [purging, setPurging] = useState(false);
  const [renderTarget, setRenderTarget] = useState<AdminRoom | null>(null);
  const [renderProductId, setRenderProductId] = useState("");
  const [rendering, setRendering] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const enabled = !!session?.accessToken;
  const stats = useQuery({ queryKey: ["admin-visualizer-stats"], queryFn: () => adminVisualizerServices.stats(session), enabled, refetchInterval: 60000 });
  const samples = useQuery({ queryKey: ["admin-visualizer-rooms", samplePage], queryFn: () => adminVisualizerServices.rooms(session, samplePage, PAGE_SIZE), enabled });
  const renders = useQuery({
    queryKey: ["admin-visualizer-renders", renderRoomKey, renderStatus, renderKind, renderPage],
    queryFn: () => adminVisualizerServices.renders(session, { roomKey: renderRoomKey || undefined, status: renderStatus || undefined, kind: renderKind || undefined, page: renderPage, limit: PAGE_SIZE }),
    enabled,
  });
  const products = useQuery({ ...allProducts(), enabled });
  const productOptions = useMemo(() => (products.data?.data || []).map((p) => ({ id: p._id, label: `${p.name}${p.model ? ` (${p.model})` : ""}` })), [products.data]);

  const refresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["admin-visualizer-stats"] });
    queryClient.invalidateQueries({ queryKey: ["admin-visualizer-rooms"] });
    queryClient.invalidateQueries({ queryKey: ["admin-visualizer-renders"] });
  }, [queryClient]);

  const handle = async (fn: () => Promise<unknown>, ok: string, fail: string) => {
    try { await fn(); refresh(); if (ok) toast.success(ok); } catch (e) { console.error(e); toast.error(fail); }
  };

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    await handle(() => adminVisualizerServices.uploadSample(session, file), "Sample room added", "Upload failed");
    setUploading(false);
    e.target.value = "";
  };

  const onGenerate = async () => {
    setGenerating(true);
    await handle(() => adminVisualizerServices.generateSample(session, prompt.trim() || undefined), "Sample room generated", "Generation failed (check OPENAI_API_KEY)");
    setGenerating(false);
  };

  const onRenderConfirm = async () => {
    if (!renderTarget || !renderProductId) return;
    setRendering(true);
    await handle(() => adminVisualizerServices.render(session, renderTarget.roomKey, renderProductId, true), "Rendered", "Render failed");
    setRendering(false);
    setRenderTarget(null);
    setRenderRoomKey(renderTarget.roomKey);
    setRenderPage(1);
    setTab("renders");
  };

  const onPurge = async () => {
    if (!confirm("Delete every stored customer photo and customer result from S3? Statistics are kept. This cannot be undone.")) return;
    setPurging(true);
    await handle(
      async () => {
        const r = await adminVisualizerServices.purgeCustomerImages(session);
        toast.success(`Deleted ${r.files} file(s): ${r.rooms} photo(s), ${r.renders} result(s) stripped`);
      },
      "",
      "Cleanup failed"
    );
    setPurging(false);
  };

  const openRenders = (room: AdminRoom) => { setRenderRoomKey(room.roomKey); setRenderKind(""); setRenderPage(1); setTab("renders"); };

  if (!session) {
    return <div className="flex h-[50vh] items-center justify-center"><LoadingSpinner /></div>;
  }

  const s = stats.data;

  return (
    <div className="flex w-full flex-col gap-6 pb-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Room visualizer</h1>
          <p className="text-sm text-muted-foreground">
            Customer photos are processed in memory and never stored. Sample rooms and their results are kept.
            {s && <> Current setup: {s.config.model}, quality {s.config.quality}, {s.config.referenceImages} reference photo(s). Limits: {s.limits.perIp} per IP per {s.limits.perIpWindowHours}h, {s.limits.daily} per day.</>}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={refresh}><RefreshCw className="size-4" /> Refresh</Button>
      </div>

      <StatsHeader stats={s} isPending={stats.isPending} />
      {s && (
        <RecentFailures
          items={s.recentFailures}
          onDismiss={(id) => handle(() => adminVisualizerServices.acknowledgeFailures(session, [id]), "", "Could not dismiss")}
          onDismissAll={() => handle(() => adminVisualizerServices.acknowledgeFailures(session), "Errors dismissed", "Could not dismiss")}
        />
      )}

      {s && s.storedCustomerImages > 0 && (
        <Card className="border-amber-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Stored customer photos from before the privacy change</CardTitle>
            <CardDescription>
              {s.storedCustomerImages} record(s) still reference customer photos or results in S3. Deleting them removes the files; the statistics stay.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" size="sm" disabled={purging} onClick={onPurge}>
              {purging ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />} Delete stored customer photos
            </Button>
          </CardContent>
        </Card>
      )}

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="renders">Generations</TabsTrigger>
          <TabsTrigger value="samples">Sample rooms</TabsTrigger>
        </TabsList>

        {/* -------- renders -------- */}
        <TabsContent value="renders" className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {renderRoomKey && (
              <Badge variant="secondary" className="gap-1">
                room …{renderRoomKey.slice(-12)}
                <button type="button" className="ms-1 text-muted-foreground hover:text-foreground" onClick={() => { setRenderRoomKey(""); setRenderPage(1); }}>×</button>
              </Badge>
            )}
            <div className="flex overflow-hidden rounded-md border">
              {([["", "All"], ["done", "Successful"], ["failed", "Failed"]] as const).map(([st, label]) => (
                <button key={st || "all"} type="button" className={`px-3 py-1 text-xs ${renderStatus === st ? "bg-primary text-white" : "bg-white hover:bg-muted"}`} onClick={() => { setRenderStatus(st); setRenderPage(1); }}>
                  {label}
                </button>
              ))}
            </div>
            <div className="flex overflow-hidden rounded-md border">
              {([["", "Any source"], ["customer", "Customer photos"], ["sample", "Sample rooms"]] as const).map(([kind, label]) => (
                <button key={kind || "any"} type="button" className={`px-3 py-1 text-xs ${renderKind === kind ? "bg-primary text-white" : "bg-white hover:bg-muted"}`} onClick={() => { setRenderKind(kind); setRenderPage(1); }}>
                  {label}
                </button>
              ))}
            </div>
            {renders.data && <span className="text-xs text-muted-foreground">{renders.data.pagination.total} generation(s)</span>}
          </div>
          {renders.isPending ? <LoadingSpinner /> : renders.data?.items.length === 0 ? (
            <p className="text-sm text-muted-foreground">No generations yet.</p>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {renders.data?.items.map((r) => (
                  <RenderCard
                    key={r._id}
                    render={r}
                    onRegenerate={(x) => handle(() => adminVisualizerServices.regenerate(session, x._id), "Regenerated", "Regeneration failed")}
                    onDelete={(x) => handle(() => adminVisualizerServices.deleteRender(session, x._id), "Record deleted", "Delete failed")}
                  />
                ))}
              </div>
              {renders.data && renders.data.pagination.pages > 1 && (
                <Pagination pageIndex={renderPage - 1} pageCount={renders.data.pagination.pages} pageSize={PAGE_SIZE} rowCount={renders.data.pagination.total}
                  gotoPage={(p) => setRenderPage(p + 1)} nextPage={() => setRenderPage((p) => p + 1)} previousPage={() => setRenderPage((p) => p - 1)} setPageSize={() => undefined}
                  canPreviousPage={renderPage > 1} canNextPage={renderPage < renders.data.pagination.pages} />
              )}
            </>
          )}
        </TabsContent>

        {/* -------- samples -------- */}
        <TabsContent value="samples" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Add a sample room</CardTitle>
              <CardDescription>Upload a real photo or generate one. Hidden samples stay in the system but are not offered to shoppers.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 md:flex-row md:items-start">
              <div className="flex-1 space-y-2">
                <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder={SAMPLE_PROMPT_HINT} className="min-h-20 text-sm" />
                <Button size="sm" disabled={generating} onClick={onGenerate}>
                  {generating ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />} Generate with AI
                </Button>
              </div>
              <div className="flex flex-col items-start gap-2 md:w-56">
                <Button variant="outline" size="sm" disabled={uploading} onClick={() => fileRef.current?.click()}>
                  {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />} Upload photo
                </Button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onUpload} />
                <p className="text-xs text-muted-foreground">JPG/PNG, floor clearly visible, no people. The photo is resized to 1536px.</p>
              </div>
            </CardContent>
          </Card>

          {samples.isPending ? <LoadingSpinner /> : (
            <>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {samples.data?.items.map((room) => (
                  <RoomCard
                    key={room._id}
                    room={room}
                    onToggle={(r, active) => handle(() => adminVisualizerServices.updateRoom(session, r._id, { isActive: active }), active ? "Sample is visible" : "Sample hidden", "Update failed")}
                    onRename={(r, title) => handle(() => adminVisualizerServices.updateRoom(session, r._id, { title }), "", "Update failed")}
                    onDelete={(r) => handle(() => adminVisualizerServices.deleteRoom(session, r._id), "Room deleted", "Delete failed")}
                    onRender={(r) => { setRenderTarget(r); setRenderProductId(""); }}
                    onOpenRenders={openRenders}
                  />
                ))}
              </div>
              {samples.data && samples.data.pagination.pages > 1 && (
                <Pagination pageIndex={samplePage - 1} pageCount={samples.data.pagination.pages} pageSize={PAGE_SIZE} rowCount={samples.data.pagination.total}
                  gotoPage={(p) => setSamplePage(p + 1)} nextPage={() => setSamplePage((p) => p + 1)} previousPage={() => setSamplePage((p) => p - 1)} setPageSize={() => undefined}
                  canPreviousPage={samplePage > 1} canNextPage={samplePage < samples.data.pagination.pages} />
              )}
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* -------- render dialog -------- */}
      <Dialog open={!!renderTarget} onOpenChange={(o) => !o && !rendering && setRenderTarget(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Render a product into this room</DialogTitle>
            <DialogDescription>Runs the generator (about 25 seconds, one paid request) and stores the result for shoppers.</DialogDescription>
          </DialogHeader>
          {renderTarget && (
            <div className="relative aspect-[3/2] overflow-hidden rounded-md bg-muted">
              <Image src={renderTarget.roomUrl} alt="" fill className="object-cover" sizes="400px" />
            </div>
          )}
          <select
            value={renderProductId}
            onChange={(e) => setRenderProductId(e.target.value)}
            className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm"
          >
            <option value="">Choose a product…</option>
            {productOptions.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
          <div className="flex justify-end gap-2">
            <Button variant="outline" disabled={rendering} onClick={() => setRenderTarget(null)}>Cancel</Button>
            <Button disabled={!renderProductId || rendering} onClick={onRenderConfirm}>
              {rendering ? <Loader2 className="size-4 animate-spin" /> : <Wand2 className="size-4" />} Render
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
