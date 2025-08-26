import { Review } from "@/types/reviews";
import StarRating from "./StarRating";
import { useTranslations } from "next-intl";
import { Quote } from "lucide-react";

export default function ReviewCard({ review }: { review: Review }) {
  const t = useTranslations("HomePage");

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const truncateText = (text: string, maxLength: number = 200) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  return (
    <div className="group relative bg-gray-800/40 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-gray-700/30 h-full flex flex-col w-full transition-all duration-300 hover:bg-gray-800/60 hover:scale-[1.02] hover:shadow-2xl hover:shadow-gray-900/30">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-700/10 to-gray-900/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Quote icon */}
      <div className="absolute top-4 right-4 text-gray-600/30 group-hover:text-gray-500/50 transition-colors duration-300">
        <Quote className="w-6 h-6" />
      </div>

      <div className="relative z-10">
        {/* Header with user info and Google logo */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                {getInitials(review.author_name)}
              </div>
              {/* Online indicator */}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800"></div>
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-white text-base truncate">
                {review.author_name}
              </h4>
              <p className="text-sm text-gray-400">
                {review.relative_time_description}
              </p>
            </div>
          </div>
          
          {/* Google logo with glassmorphism */}
          <div className="flex-shrink-0 p-2 bg-white/10 backdrop-blur-sm rounded-lg border border-gray-600/30">
            <svg width="20" height="20" viewBox="0 0 24 24" className="text-gray-300">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          </div>
        </div>

        {/* Star rating with custom styling */}
        <div className="mb-4">
          <StarRating rating={review.rating} />
        </div>

        {/* Review text */}
        <div className="flex-1 mb-4">
          <p className="text-gray-300 text-base leading-relaxed line-clamp-4">
            {truncateText(review.text, 180)}
          </p>
        </div>

        {/* Translation notice */}
        {review.translated && (
          <div className="flex items-center gap-2 text-xs text-gray-500 italic bg-gray-700/30 px-3 py-2 rounded-lg border border-gray-600/30">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span>{t("translated_automatically")}</span>
          </div>
        )}

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-600/50 to-transparent"></div>
      </div>
    </div>
  );
};