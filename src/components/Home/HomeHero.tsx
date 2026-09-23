"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowRight, MessageSquare, Star } from "lucide-react";
import { Link } from "@/i18n/routing";
import RouteConstants from "@/constants/RouteConstants";

interface HomeHeroProps {
  image?: string;
  rating?: number;
  totalReviews?: number;
  /** Background of the section that follows; the photo dissolves into it at the bottom. */
  fadeTo: string;
}

/**
 * First screen: the shop's name, rating, headline and both buttons in white over a photo of
 * a floor we laid, darkened so the wood reads as texture and the text stays crisp at any width.
 */
// "#F5F5F4" → "rgba(245,245,244,a)" for the eased dissolve stops.
const withAlpha = (hex: string, alpha: number) => {
  const n = parseInt(hex.replace("#", ""), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
};

// Ease-in curve: almost nothing for the first third, then a long soft ramp into the next section.
const dissolve = (color: string) =>
  `linear-gradient(to bottom, ${withAlpha(color, 0)} 0%, ${withAlpha(color, 0.04)} 30%, ${withAlpha(color, 0.16)} 50%, ${withAlpha(color, 0.42)} 70%, ${withAlpha(color, 0.8)} 88%, ${color} 100%)`;

const HomeHero = ({ image, rating, totalReviews, fadeTo }: HomeHeroProps) => {
  const t = useTranslations("HomePage");

  return (
    <section className="relative overflow-hidden bg-[#171717] text-white">
      {image && (
        <>
          <Image src={image} alt="" fill priority sizes="100vw" className="object-cover" />
          {/* Dark wash that thickens where the text sits, so the wood shows as texture and the type stays crisp. */}
          <div className="absolute inset-0 bg-[#171717]/60" />
          {/* Phones: darkest behind the text (upper half), lighter again towards the bottom so the dissolve starts from the photo, not from black. */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#171717]/15 via-[#171717]/75 via-45% to-[#171717]/35 md:bg-gradient-to-r md:from-[#171717]/90 md:via-[#171717]/55 md:to-[#171717]/10 rtl:md:bg-gradient-to-l" />
        </>
      )}
      {/* Long, eased dissolve into the next section: the photo fades out over the lower half of the hero. */}
      <div className="absolute inset-x-0 bottom-0 h-52 md:h-72" style={{ background: dissolve(fadeTo) }} />

      <div className="relative mx-auto grid max-w-[1180px] gap-3 px-4 pb-24 pt-9 sm:px-7 md:min-h-[620px] md:content-center md:pb-52 md:pt-20">
        <span className="text-[20px] font-semibold uppercase leading-none tracking-[.2em] text-white sm:text-[24px]">{t("effect_parquet")}</span>

        {/* Reserve the line so the layout doesn't shift when the rating arrives. */}
        <div className="mt-1 flex h-5 items-center gap-2 text-[13px] font-medium text-white/80">
          {rating !== undefined && totalReviews !== undefined && (
            <>
              <span className="flex text-[#E0B27A]" aria-hidden="true">
                {Array.from({ length: 5 }, (_, i) => <Star key={i} className="size-3.5 fill-current" strokeWidth={0} />)}
              </span>
              <span>{t("hero_rating", { rating: rating.toFixed(1), count: totalReviews })}</span>
            </>
          )}
        </div>

        <h1 className="m-0 max-w-[12em] text-[clamp(32px,8vw,60px)] font-light leading-[1.06] tracking-[-0.02em] text-white [text-wrap:balance] [&_strong]:font-semibold">
          {t.rich("hero_title", { strong: (chunks) => <strong>{chunks}</strong> })}
        </h1>
        <p className="m-0 max-w-[32em] text-base text-white/80 sm:text-lg">{t("hero_lead")}</p>

        <div className="mt-5 grid gap-2.5 sm:flex md:mt-2">
          <Link
            href={RouteConstants.ALL_PRODUCTS_PAGE}
            className="flex h-[54px] items-center justify-center gap-2.5 rounded-[14px] bg-white px-6 text-[15px] font-semibold text-[#171717] transition-colors hover:bg-[#F5F5F4]"
          >
            {t("cta_catalog")}
            <ArrowRight className="size-[18px] rtl:rotate-180" strokeWidth={1.75} />
          </Link>
          <Link
            href={RouteConstants.CONTACT_US_PAGE}
            className="flex h-[54px] items-center justify-center gap-2.5 rounded-[14px] border border-white/35 bg-white/5 px-6 text-[15px] font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/15"
          >
            <MessageSquare className="size-[18px]" strokeWidth={1.75} />
            {t("cta_contact")}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
