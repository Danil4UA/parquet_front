"use client";

import { FC, useCallback, useRef, useState } from "react";

interface BeforeAfterProps {
  before: string;
  after: string;
  beforeLabel: string;
  afterLabel: string;
  hint?: string;
  className?: string;
}

/** Drag-to-compare slider. Always LTR so the handle math is direction independent. */
const BeforeAfter: FC<BeforeAfterProps> = ({ before, after, beforeLabel, afterLabel, hint, className }) => {
  const [pos, setPos] = useState(50);
  const [touched, setTouched] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const dragging = useRef(false);

  const update = useCallback((clientX: number) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(2, Math.min(98, next)));
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    setTouched(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    update(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => { if (dragging.current) update(e.clientX); };
  const onPointerUp = () => { dragging.current = false; };

  return (
    <div
      ref={ref}
      dir="ltr"
      className={`relative select-none overflow-hidden rounded-xl bg-[#F5F5F4] touch-none ${className ?? ""}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={after} alt={afterLabel} className="block h-auto w-full" draggable={false} />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={before} alt={beforeLabel} className="block h-full w-full object-cover" draggable={false} />
      </div>

      <span className="pointer-events-none absolute left-3 top-3 rounded-md bg-black/60 px-2 py-0.5 text-xs font-medium text-white">{beforeLabel}</span>
      <span className="pointer-events-none absolute right-3 top-3 rounded-md bg-black/60 px-2 py-0.5 text-xs font-medium text-white">{afterLabel}</span>

      <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.15)]" style={{ left: `${pos}%` }} />
      <div
        className="pointer-events-none absolute top-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg"
        style={{ left: `${pos}%` }}
      >
        <svg width="18" height="12" viewBox="0 0 18 12" fill="none" className="text-[#171717]"><path d="M6 1L1 6l5 5M12 1l5 5-5 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
      {hint && !touched && (
        <span className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs text-white">{hint}</span>
      )}
      <input
        type="range"
        min={2}
        max={98}
        value={pos}
        onChange={(e) => { setTouched(true); setPos(Number(e.target.value)); }}
        aria-label={hint || afterLabel}
        className="absolute inset-x-0 bottom-0 h-8 w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
};

export default BeforeAfter;
