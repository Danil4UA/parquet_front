import BackButton from "./BackButton";

interface PageTitleSectionProps {
  title: string;
  lead?: string;
}

/** Inner-page header in the home page's voice: back arrow and light display title on one line, optional lead, hairline below. */
export default function PageTitleSection({ title, lead }: PageTitleSectionProps) {
  return (
    <header className="bg-white">
      <div className="mx-auto max-w-[1180px] px-4 pt-7 sm:px-7 sm:pt-12">
        <div className="grid gap-3 border-b border-[#E2DFDA] pb-6 sm:pb-8">
          {/* Back arrow on the same line as the title, so it does not take a row of its own. */}
          <div className="flex items-center gap-3 sm:gap-4">
            <BackButton />
            <h1 className="m-0 text-[clamp(28px,6vw,48px)] font-light leading-[1.08] tracking-[-0.02em] text-[#171717] [text-wrap:balance]">
              {title}
            </h1>
          </div>
          {lead && <p className="m-0 max-w-[40em] text-base text-[#6B6B6B] sm:text-lg">{lead}</p>}
        </div>
      </div>
    </header>
  );
}
