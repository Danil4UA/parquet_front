"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import BeforeAfter from "@/components/BeforeAfter/BeforeAfter";
import { VISUALIZER_OPEN_PARAM } from "@/providers/VisualizerJobProvider";

export interface Showcase {
  _id: string;
  roomUrl: string;
  resultUrl: string;
  product: { _id: string; name: string; category: string } | null;
}

interface VisualizerShowcaseProps {
  showcase: Showcase;
}

/** Live before/after demo of the room visualizer on one of the shop's sample rooms. */
const VisualizerShowcase = ({ showcase }: VisualizerShowcaseProps) => {
  const t = useTranslations("HomePage");
  const tProduct = useTranslations("ProductPage");
  const product = showcase.product;
  const tryHref = product ? `/products/${product.category}/${product._id}?${VISUALIZER_OPEN_PARAM}=open` : "/products/all";

  return (
    <section id="visualizer" className="bg-[#F5F5F4] py-11 sm:py-[72px]">
      <div className="mx-auto grid max-w-[1180px] gap-[18px] px-4 sm:px-7 md:grid-cols-[1.3fr_1fr] md:items-center md:gap-10">
        <BeforeAfter
          before={showcase.roomUrl}
          after={showcase.resultUrl}
          style={{ aspectRatio: "3 / 2" }}
          beforeLabel={tProduct("visualizer_before")}
          afterLabel={tProduct("visualizer_after")}
          hint={tProduct("visualizer_drag")}
        />
        <div className="grid gap-3">
          <h2 className="m-0 text-[clamp(24px,5.6vw,36px)] font-light leading-[1.12] tracking-[-0.02em] text-[#171717] [text-wrap:balance] [&_strong]:font-semibold">
            {t.rich("demo_title", { strong: (chunks) => <strong>{chunks}</strong> })}
          </h2>
          <p className="m-0 text-[#4B4B4B]">{t("demo_lead")}</p>
          {product && <small className="text-[13px] text-[#6B6B6B]">{t("demo_note", { product: product.name })}</small>}
          <div>
            <Link
              href={tryHref}
              className="inline-flex h-[54px] items-center justify-center rounded-[14px] bg-[#171717] px-6 text-[15px] font-semibold text-white transition-colors hover:bg-[#2A2A2A]"
            >
              {t("demo_cta")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisualizerShowcase;
