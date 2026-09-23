"use client";

import { Review, ReviewsResponse } from "@/types/reviews";
import { UseQueryResult } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { useTranslations } from "next-intl";
import { Star } from "lucide-react";
import Utils from "@/Utils/utils";
import ReviewCard from "./ReviewCard";
import SectionHead from "@/components/Home/SectionHead";

type IReviewsSection = {
  reviewsData: UseQueryResult<AxiosResponse<ReviewsResponse>, Error>;
};

const SHOWN = 3;

/** Google rating and the three latest reviews: stacked on phones, three columns on wider screens. */
export default function ReviewsSection({ reviewsData }: IReviewsSection) {
  const t = useTranslations("HomePage");
  const data = reviewsData?.data?.data;
  const reviews = (data?.reviews || []).slice(0, SHOWN);
  const total = data?.total_reviews || 0;
  const rating = (data?.rating ?? 5).toFixed(1);

  if (reviews.length === 0) return null;

  return (
    <section className="py-11 sm:py-[72px]">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-7">
        <SectionHead title={t("customer_reviews")} />
        <div className="flex items-baseline gap-2.5">
          <span className="text-[44px] font-light leading-none tracking-[-0.03em] text-[#171717]">{rating}</span>
          <span className="flex text-[#7A4B2A]" aria-hidden="true">
            {Array.from({ length: 5 }, (_, i) => <Star key={i} className="size-[18px] fill-current" strokeWidth={0} />)}
          </span>
          <small className="text-[13px] text-[#6B6B6B]">{t("reviews_on_google", { count: total })}</small>
        </div>

        <div className="mt-[18px] grid gap-2.5 md:grid-cols-3">
          {reviews.map((review: Review, index: number) => (
            <ReviewCard key={`${review.author_name}-${index}`} review={review} />
          ))}
        </div>

        <p className="mb-0 mt-[18px]">
          <a
            href={Utils.moreReviewsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold underline decoration-[#C9C5BE] underline-offset-4 hover:decoration-[#171717]"
          >
            {t("get_more_reviews")}
          </a>
        </p>
      </div>
    </section>
  );
}
