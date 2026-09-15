"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Upload, Sparkles, Trash2, RefreshCw, ExternalLink, Eye, EyeOff, Wand2 } from "lucide-react";
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
import adminVisualizerServices, { AdminRender, AdminRoom } from "@/services/adminVisualizerServices";
import { allProducts } from "@/constants/queryInfo";

const PAGE_SIZE = 24;
const SAMPLE_PROMPT_HINT =
  "Photo of an empty modern living room in an Israeli apartment, taken with a phone, daylight, white walls, old grey ceramic tile floor clearly visible, a sofa against the wall, no people, no text.";

const formatDate = (iso: string) => new Date(iso).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
const seconds = (ms?: number) => (ms ? `${(ms / 1000).toFixed(1)}s` : "—");

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
  onToggle?: (room: AdminRoom, active: boolean) => Promise<void>;
  onRename?: (room: AdminRoom, title: string) => Promise<void>;
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
    <div className={`overflow-hidden rounded-lg border bg-white ${room.isSample && !room.isActive ? "opacity-60" : ""}`}>
      <div className="relative aspect-[3/2] bg-muted">
        <Image src={room.roomUrl} alt={room.title || room.roomKey} fill className="object-cover" sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw" />
        {busy && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40">
            <Loader2 className="size-6 animate-spin text-white" />
          </div>
        )}
        <div className="absolute left-2 top-2 flex gap-1">
          <Badge variant="secondary" className="bg-white/90 text-xs">{room.done}/{room.renders} renders</Badge>
          {room.isSample && !room.isActive && <Badge variant="secondary" className="bg-white/90 text-xs">hidden</Badge>}
        </div>
      </div>
      <div className="space-y-2 p-2.5">
        {room.isSample ? (
          <Input
            value={title}
            placeholder="Title (optional)"
            className="h-8 text-sm"
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => title !== (room.title || "") && onRename && run(() => onRename(room, title))}
          />
        ) : (
          <div className="text-xs text-muted-foreground">
            {formatDate(room.createdAt)} · {room.ip || "—"}
          </div>
        )}
        <div className="flex items-center justify-between gap-2">
          {room.isSample && onToggle ? (
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              <Switch checked={room.isActive} disabled={busy} onCheckedChange={(v) => run(() => onToggle(room, v))} />
              {room.isActive ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
              {room.isActive ? "Visible" : "Hidden"}
            </label>
          ) : <span />}
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

function RenderCard({ render, onRegenerate, onDelete }: { render: AdminRender; onRegenerate: (r: AdminRender) => Promise<void>; onDelete: (r: AdminRender) => Promise<void> }) {
  const [busy, setBusy] = useState(false);
  const run = async (fn: () => Promise<void>) => { setBusy(true); try { await fn(); } finally { setBusy(false); } };
  const statusVariant = render.status === "done" ? "default" : render.status === "failed" ? "destructive" : "secondary";

  return (
    <div className="overflow-hidden rounded-lg border bg-white">
      <div className="grid grid-cols-2 gap-px bg-border">
        <div className="relative aspect-[3/2] bg-muted">
          <Image src={render.roomUrl} alt="before" fill className="object-cover" sizes="25vw" />
          <span className="absolute left-1.5 top-1.5 rounded bg-black/60 px-1.5 text-[10px] text-white">before</span>
        </div>
        <div className="relative aspect-[3/2] bg-muted">
          {render.resultUrl ? (
            <Image src={render.resultUrl} alt="after" fill className="object-cover" sizes="25vw" />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-muted-foreground">{render.status === "pending" ? "pending…" : "no result"}</div>
          )}
          <span className="absolute left-1.5 top-1.5 rounded bg-black/60 px-1.5 text-[10px] text-white">after</span>
        </div>
        {busy && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40">
            <Loader2 className="size-6 animate-spin text-white" />
          </div>
        )}
      </div>
      <div className="space-y-1.5 p-2.5">
        <div className="flex items-center gap-2">
          {render.product?.image && (
            <div className="relative size-8 shrink-0 overflow-hidden rounded bg-muted">
              <Image src={render.product.image} alt="" fill className="object-cover" sizes="32px" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium">{render.product?.name || render.productId}</div>
            <div className="truncate text-xs text-muted-foreground">{render.product?.model} · {render.isSample ? "sample" : "customer"} · {formatDate(render.createdAt)}</div>
          </div>
          <Badge variant={statusVariant} className="text-[10px]">{render.status}</Badge>
        </div>
        {render.error && <p className="line-clamp-2 text-xs text-destructive" title={render.error}>{render.error}</p>}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{seconds(render.durationMs)} · {render.aiModel || "—"}</span>
          <div className="flex items-center gap-1">
            {render.resultUrl && (
              <Button asChild variant="ghost" size="icon" className="h-7 w-7" title="Open result">
                <a href={render.resultUrl} target="_blank" rel="noopener noreferrer"><ExternalLink className="size-4" /></a>
              </Button>
            )}
            <Button variant="outline" size="sm" className="h-7 gap-1 text-xs" disabled={busy} onClick={() => run(() => onRegenerate(render))}>
              <RefreshCw className="size-3.5" /> Regenerate
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" disabled={busy} title="Delete" onClick={() => { if (confirm("Delete this render?")) run(() => onDelete(render)); }}>
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------- page ----------------------------------- */

export default function AdminVisualizerPage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState("samples");
  const [samplePage, setSamplePage] = useState(1);
  const [customerPage, setCustomerPage] = useState(1);
  const [renderPage, setRenderPage] = useState(1);
  const [renderRoomKey, setRenderRoomKey] = useState<string>("");
  const [renderStatus, setRenderStatus] = useState<string>("");
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [renderTarget, setRenderTarget] = useState<AdminRoom | null>(null);
  const [renderProductId, setRenderProductId] = useState("");
  const [rendering, setRendering] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const enabled = !!session?.accessToken;
  const stats = useQuery({ queryKey: ["admin-visualizer-stats"], queryFn: () => adminVisualizerServices.stats(session), enabled });
  const samples = useQuery({ queryKey: ["admin-visualizer-rooms", "sample", samplePage], queryFn: () => adminVisualizerServices.rooms(session, "sample", samplePage, PAGE_SIZE), enabled });
  const customers = useQuery({ queryKey: ["admin-visualizer-rooms", "customer", customerPage], queryFn: () => adminVisualizerServices.rooms(session, "customer", customerPage, PAGE_SIZE), enabled });
  const renders = useQuery({
    queryKey: ["admin-visualizer-renders", renderRoomKey, renderStatus, renderPage],
    queryFn: () => adminVisualizerServices.renders(session, { roomKey: renderRoomKey || undefined, status: renderStatus || undefined, page: renderPage, limit: PAGE_SIZE }),
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

  const openRenders = (room: AdminRoom) => { setRenderRoomKey(room.roomKey); setRenderPage(1); setTab("renders"); };

  if (!session) {
    return <div className="flex h-[50vh] items-center justify-center"><LoadingSpinner /></div>;
  }

  const s = stats.data;

  return (
    <div className="flex w-full flex-col gap-6 pb-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Room visualizer</h1>
          <p className="text-sm text-muted-foreground">Sample rooms shoppers can try, customer photos, and every generated result.</p>
        </div>
        <Button variant="outline" size="sm" onClick={refresh}><RefreshCw className="size-4" /> Refresh</Button>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {[
          ["Sample rooms", s?.samples],
          ["Customer photos", s?.customerRooms],
          ["Results", s?.done],
          ["Failed", s?.failed],
          ["Today", s ? `${s.today} / ${s.dailyLimit}` : undefined],
          ["Avg time", s ? seconds(s.avgDurationMs) : undefined],
        ].map(([label, value]) => (
          <Card key={label as string}>
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground">{label}</div>
              <div className="mt-1 text-2xl font-bold tabular-nums">{value ?? "…"}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="samples">Sample rooms</TabsTrigger>
          <TabsTrigger value="customers">Customer photos</TabsTrigger>
          <TabsTrigger value="renders">Results</TabsTrigger>
        </TabsList>

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

        {/* -------- customer rooms -------- */}
        <TabsContent value="customers" className="space-y-4">
          {customers.isPending ? <LoadingSpinner /> : customers.data?.items.length === 0 ? (
            <p className="text-sm text-muted-foreground">No customer photos yet.</p>
          ) : (
            <>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {customers.data?.items.map((room) => (
                  <RoomCard
                    key={room._id}
                    room={room}
                    onDelete={(r) => handle(() => adminVisualizerServices.deleteRoom(session, r._id), "Room deleted", "Delete failed")}
                    onRender={(r) => { setRenderTarget(r); setRenderProductId(""); }}
                    onOpenRenders={openRenders}
                  />
                ))}
              </div>
              {customers.data && customers.data.pagination.pages > 1 && (
                <Pagination pageIndex={customerPage - 1} pageCount={customers.data.pagination.pages} pageSize={PAGE_SIZE} rowCount={customers.data.pagination.total}
                  gotoPage={(p) => setCustomerPage(p + 1)} nextPage={() => setCustomerPage((p) => p + 1)} previousPage={() => setCustomerPage((p) => p - 1)} setPageSize={() => undefined}
                  canPreviousPage={customerPage > 1} canNextPage={customerPage < customers.data.pagination.pages} />
              )}
            </>
          )}
        </TabsContent>

        {/* -------- renders -------- */}
        <TabsContent value="renders" className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {renderRoomKey && (
              <Badge variant="secondary" className="gap-1">
                room …{renderRoomKey.slice(-12)}
                <button type="button" className="ms-1 text-muted-foreground hover:text-foreground" onClick={() => { setRenderRoomKey(""); setRenderPage(1); }}>×</button>
              </Badge>
            )}
            {["", "done", "failed", "pending"].map((st) => (
              <Button key={st || "all"} variant={renderStatus === st ? "default" : "outline"} size="sm" className="h-7 text-xs" onClick={() => { setRenderStatus(st); setRenderPage(1); }}>
                {st || "all"}
              </Button>
            ))}
          </div>
          {renders.isPending ? <LoadingSpinner /> : renders.data?.items.length === 0 ? (
            <p className="text-sm text-muted-foreground">No results yet.</p>
          ) : (
            <>
              <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
                {renders.data?.items.map((r) => (
                  <RenderCard
                    key={r._id}
                    render={r}
                    onRegenerate={(x) => handle(() => adminVisualizerServices.regenerate(session, x._id), "Regenerated", "Regeneration failed")}
                    onDelete={(x) => handle(() => adminVisualizerServices.deleteRender(session, x._id), "Render deleted", "Delete failed")}
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
