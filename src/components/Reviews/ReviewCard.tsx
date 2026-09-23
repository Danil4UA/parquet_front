import { Review } from "@/types/reviews";
import { useTranslations } from "next-intl";
import { Star } from "lucide-react";

const MAX_LENGTH = 220;

const truncate = (text: string) => (text.length <= MAX_LENGTH ? text : `${text.slice(0, MAX_LENGTH).trim()}…`);

/** One Google review: name and time, stars, text in its own writing direction. */
export default function ReviewCard({ review }: { review: Review }) {
  const t = useTranslations("HomePage");

  return (
    <article className="flex h-full flex-col gap-2.5 rounded-[14px] border border-[#E2DFDA] bg-white p-[18px]">
      <div className="flex items-baseline justify-between gap-3 text-[13px] text-[#6B6B6B]">
        <b className="truncate font-medium text-[#171717]">{review.author_name}</b>
        <span className="shrink-0">{review.relative_time_description}</span>
      </div>
      <div className="flex text-[#7A4B2A]" aria-label={`${review.rating} / 5`}>
        {Array.from({ length: 5 }, (_, i) => (
          <Star key={i} className={`size-3.5 ${i < review.rating ? "fill-current" : "fill-transparent"}`} strokeWidth={i < review.rating ? 0 : 1.5} />
        ))}
      </div>
      <p className="m-0 text-sm leading-[1.55] text-[#4B4B4B]" dir="auto">{truncate(review.text)}</p>
      {review.translated && <span className="mt-auto text-[11px] text-[#9A9A9A]">{t("translated_automatically")}</span>}
    </article>
  );
}
