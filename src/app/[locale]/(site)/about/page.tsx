import { Truck } from "lucide-react";
import { useTranslations } from "next-intl";
import PageTitleSection from "@/components/Pages/PageTitleSection";

const POINTS = [1, 2, 3, 4];

export default function AboutPage() {
  const t = useTranslations("About");

  const bullets = (prefix: string, className = "") => (
    <ul className={`m-0 grid list-none gap-2.5 p-0 ${className}`}>
      {POINTS.map((n) => (
        <li key={n} className="flex items-baseline gap-3 text-[#4B4B4B]">
          <span className="size-1.5 shrink-0 -translate-y-0.5 rounded-full bg-[#171717]" />
          <span>{t(`${prefix}_${n}`)}</span>
        </li>
      ))}
    </ul>
  );

  const cardTitle = "mb-4 text-xl font-semibold text-[#171717]";
  const statValue = "flex h-12 items-center justify-center text-[clamp(30px,5vw,40px)] font-light tracking-[-0.02em] text-[#171717]";

  return (
    <div className="w-full bg-white">
      <PageTitleSection title={t("page_title")} lead={t("tagline")} />

      <div className="mx-auto max-w-[1180px] px-4 pb-11 pt-7 sm:px-7 sm:pb-[72px] sm:pt-10">
        <section className="grid gap-4 md:grid-cols-[220px_1fr] md:gap-10">
          <span className="text-[13px] font-semibold uppercase tracking-[.2em] text-[#6B6B6B] md:pt-1.5">{t("company_title")}</span>
          <div className="grid max-w-[44em] gap-4 text-base leading-relaxed text-[#4B4B4B] sm:text-lg">
            {POINTS.map((n) => (
              <p key={n} className={`m-0 ${n === 1 ? "text-[#171717]" : ""}`}>{t(`intro_${n}`)}</p>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-2xl bg-[#F5F5F4] p-7 sm:mt-14 sm:p-10">
          <h2 className={cardTitle}>{t("install_title")}</h2>
          {bullets("install", "sm:grid-cols-2 sm:gap-x-10")}
        </section>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <section className="rounded-2xl border border-[#E2DFDA] p-7 sm:p-10">
            <h2 className={cardTitle}>{t("values_title")}</h2>
            {bullets("values")}
          </section>
          <section className="rounded-2xl border border-[#E2DFDA] p-7 sm:p-10">
            <h2 className={cardTitle}>{t("mission_title")}</h2>
            <p className="m-0 leading-relaxed text-[#4B4B4B]">{t("mission_text")}</p>
          </section>
        </div>

        <div className="mt-10 grid gap-8 border-t border-[#E2DFDA] pt-10 text-center sm:mt-14 sm:grid-cols-3">
          <div>
            <div className={statValue} dir="ltr">300+</div>
            <div className="mt-1 text-sm text-[#6B6B6B]">{t("stats_clients")}</div>
          </div>
          <div>
            <div className={statValue} dir="ltr">5.0 ★</div>
            <div className="mt-1 text-sm text-[#6B6B6B]">{t("stats_google")}</div>
          </div>
          <div>
            <div className={statValue}>
              <Truck className="size-9" strokeWidth={1.25} />
            </div>
            <div className="mt-1 text-sm text-[#6B6B6B]">{t("stats_delivery")}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
