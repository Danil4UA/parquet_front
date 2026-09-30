import BackButton from "./BackButton";

interface PageTitleSectionProps {
  title: string;
  lead?: string;
}

/** Inner-page header in the home page's voice: back link, light display title on white, optional lead, hairline below. */
export default function PageTitleSection({ title, lead }: PageTitleSectionProps) {
  return (
    <header className="bg-white">
      <div className="mx-auto max-w-[1180px] px-4 pt-5 sm:px-7 sm:pt-8">
        <BackButton />
        <div className="mt-3 grid gap-3 border-b border-[#E2DFDA] pb-6 sm:mt-5 sm:pb-8">
          <h1 className="m-0 text-[clamp(30px,6.4vw,48px)] font-light leading-[1.08] tracking-[-0.02em] text-[#171717] [text-wrap:balance]">
            {title}
          </h1>
          {lead && <p className="m-0 max-w-[40em] text-base text-[#6B6B6B] sm:text-lg">{lead}</p>}
        </div>
      </div>
    </header>
  );
}
