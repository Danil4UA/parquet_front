import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import PageTitleSection from "@/components/Pages/PageTitleSection";
import RouteConstants from "@/constants/RouteConstants";
import { Link } from "@/i18n/routing";

const SERVICES = [1, 2, 3, 4, 5];

export default function ServicesPage() {
  const t = useTranslations("Services");

  return (
    <div className="w-full bg-white">
      <PageTitleSection title={t("page_title")} />

      <div className="mx-auto max-w-[1180px] px-4 pb-11 sm:px-7 sm:pb-[72px]">
        <ol className="m-0 grid list-none p-0 md:grid-cols-2 md:gap-x-10">
          {SERVICES.map((n) => (
            <li key={n} className="grid grid-cols-[28px_1fr] gap-3.5 border-b border-[#E2DFDA] py-6 sm:py-7 md:last:odd:col-span-2">
              <span className="pt-0.5 text-base font-semibold tabular-nums text-[#9A9A9A]" aria-hidden="true">
                {String(n).padStart(2, "0")}
              </span>
              <div>
                <h2 className="mb-1.5 text-lg font-semibold text-[#171717] sm:text-xl">{t(`service_${n}_title`)}</h2>
                <p className="m-0 max-w-[46em] whitespace-pre-line text-[15px] text-[#4B4B4B] sm:text-base">{t(`service_${n}_description`)}</p>
              </div>
            </li>
          ))}
        </ol>

        <section className="mt-10 grid gap-5 rounded-2xl bg-[#F5F5F4] p-7 sm:mt-14 sm:p-12 md:grid-cols-[1fr_auto] md:items-center md:gap-10">
          <div className="grid gap-2.5">
            <h2 className="m-0 text-[clamp(24px,5.6vw,36px)] font-light leading-[1.12] tracking-[-0.02em] text-[#171717] [text-wrap:balance]">
              {t("cta_title")}
            </h2>
            <p className="m-0 max-w-[36em] text-[#4B4B4B]">{t("cta_description")}</p>
          </div>
          <Link
            href={RouteConstants.CONTACT_US_PAGE}
            className="flex h-[54px] items-center justify-center gap-2.5 rounded-[14px] bg-[#171717] px-6 text-[15px] font-semibold text-white transition-colors hover:bg-[#2A2A2A]"
          >
            {t("cta_button")}
            <ArrowRight className="size-[18px] rtl:rotate-180" strokeWidth={1.75} />
          </Link>
        </section>
      </div>
    </div>
  );
}
