import { ReactNode } from "react";
import { Link } from "@/i18n/routing";

interface SectionHeadProps {
  title: ReactNode;
  lead?: ReactNode;
  moreHref?: string;
  moreLabel?: string;
}

/** Section title row: light display heading, optional lead, optional "see all" link. */
const SectionHead = ({ title, lead, moreHref, moreLabel }: SectionHeadProps) => (
  <div className="mb-5 grid gap-2 sm:mb-6 sm:grid-cols-[1fr_auto] sm:items-end">
    <div className="grid gap-2">
      <h2 className="m-0 text-[clamp(24px,5.6vw,36px)] font-light leading-[1.12] tracking-[-0.02em] text-[#171717] [text-wrap:balance] [&_strong]:font-semibold">
        {title}
      </h2>
      {lead && <p className="m-0 max-w-[40em] text-[#6B6B6B]">{lead}</p>}
    </div>
    {moreHref && moreLabel && (
      <Link href={moreHref} className="text-sm font-semibold underline decoration-[#C9C5BE] underline-offset-4 hover:decoration-[#171717]">
        {moreLabel}
      </Link>
    )}
  </div>
);

export default SectionHead;
