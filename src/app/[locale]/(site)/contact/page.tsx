"use client";

import { ReactNode, useState } from "react";
import { Clock, Mail, MapPin, MessageSquare, Phone, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { contactData, getGoogleMapsUrl, socialLinks } from "@/Utils/utils";
import { ContactFormType } from "@/lib/schemas/contactFormSchema";
import contactServices from "@/services/contactServices";
import ErrorDialog from "@/components/ErrorDialog";
import SuccessDialog from "@/components/SuccessDialog";
import PageTitleSection from "@/components/Pages/PageTitleSection";
import InstagramIcon from "@/app/assets/instagram.svg";
import FacebookIcon from "@/app/assets/facebook.svg";
import ContactUsForm from "./_components/contactUsForm";

const phoneHref = `tel:${contactData.phone.replace(/[^\d+]/g, "")}`;
const textLink = "font-medium text-[#171717] underline decoration-[#C9C5BE] underline-offset-4 transition-colors hover:decoration-[#171717]";
const outlineButton =
  "flex h-[46px] items-center justify-center gap-2 rounded-[14px] border border-[#DCDCDB] px-[18px] text-sm font-semibold text-[#171717] transition-colors hover:bg-[#F5F5F4]";

/** One line of the contact list: icon, small label, then the value. */
const InfoRow = ({ icon: Icon, label, children }: { icon: LucideIcon; label: string; children: ReactNode }) => (
  <div className="grid grid-cols-[24px_1fr] gap-3.5 border-b border-[#E2DFDA] py-[18px]">
    <Icon className="mt-0.5 size-5 text-[#171717]" strokeWidth={1.5} />
    <div className="min-w-0">
      <div className="mb-1 text-[13px] text-[#6B6B6B]">{label}</div>
      {children}
    </div>
  </div>
);

/** Contact page: the direct ways to reach the shop on one side, the message form on the other, the map below. */
const ContactPage = () => {
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState<boolean>(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState<boolean>(false);

  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const lng = pathname.split("/")[1];

  const handleFormSubmit = async (formData: ContactFormType) => {
    try {
      const cleanedFormData = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [key, typeof value === "string" && value.trim() === "" ? undefined : value])
      ) as ContactFormType;

      await contactServices.contactUs(cleanedFormData);
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: "lead", form_name: "contact_us" });
      setIsSuccessDialogOpen(true);
    } catch {
      setIsErrorDialogOpen(true);
    }
  };

  const handleSuccessDialogClose = () => {
    setIsSuccessDialogOpen(false);
    router.push(`/${lng}`);
  };

  const hours = [
    { days: `${t("Utils.days.sunday")} – ${t("Utils.days.thursday")}`, time: "10:00 – 18:00" },
    { days: t("Utils.days.friday"), time: "9:00 – 12:00" },
    { days: t("Utils.days.saturday"), time: null },
  ];

  return (
    <div className="w-full bg-white">
      <PageTitleSection title={t("Contact.contactUs")} lead={t("Contact.contactUsAnyWay")} />

      <div className="mx-auto grid max-w-[1180px] gap-10 px-4 pb-11 pt-7 sm:px-7 sm:pb-[72px] sm:pt-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
        <section aria-label={t("Contact.contactInfo")}>
          <a href={phoneHref} dir="ltr" className="block w-fit text-[clamp(30px,6vw,44px)] font-light leading-none tracking-[-0.01em] text-[#171717] tabular-nums rtl:ms-auto rtl:me-0">
            {contactData.phone}
          </a>
          <div className="mt-5 flex flex-wrap gap-2.5">
            <a
              href={socialLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-[46px] items-center justify-center gap-2 rounded-[14px] bg-[#171717] px-[18px] text-sm font-semibold text-white transition-colors hover:bg-[#2A2A2A]"
            >
              <MessageSquare className="size-[18px]" strokeWidth={1.75} />
              {t("HomePage.whatsapp_cta")}
            </a>
            <a href={phoneHref} className={outlineButton}>
              <Phone className="size-[18px]" strokeWidth={1.75} />
              {t("Footer.call_us")}
            </a>
          </div>

          <div className="mt-8 border-t border-[#E2DFDA]">
            <InfoRow icon={MapPin} label={t("Contact.addressText")}>
              <div className="text-[#171717]">{t("ContactContent.address")}</div>
              <div className="mt-1.5 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                <a href={getGoogleMapsUrl(contactData.address)} target="_blank" rel="noopener noreferrer" className={textLink}>
                  Google Maps
                </a>
                <a href={socialLinks.waze} target="_blank" rel="noopener noreferrer" className={textLink}>
                  Waze
                </a>
              </div>
            </InfoRow>

            <InfoRow icon={Mail} label={t("Contact.emailText")}>
              <a href={`mailto:${contactData.email}`} className="break-all text-[#171717] transition-colors hover:text-[#6B6B6B]">
                {contactData.email}
              </a>
            </InfoRow>

            <InfoRow icon={Clock} label={t("Contact.workingHours")}>
              <dl className="m-0 grid gap-1.5">
                {hours.map(({ days, time }) => (
                  <div key={days} className="flex items-baseline justify-between gap-4">
                    <dt className="text-[#4B4B4B]">{days}</dt>
                    <dd className={`m-0 tabular-nums ${time ? "font-medium text-[#171717]" : "text-[#6B6B6B]"}`} dir={time ? "ltr" : undefined}>
                      {time ?? t("Utils.status.closed")}
                    </dd>
                  </div>
                ))}
              </dl>
            </InfoRow>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <span className="text-sm text-[#6B6B6B]">{t("Contact.followUsText")}</span>
            <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex size-10 items-center justify-center rounded-full border border-[#DCDCDB] transition-colors hover:bg-[#F5F5F4]">
              <InstagramIcon className="size-[18px]" />
            </a>
            <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="flex size-10 items-center justify-center rounded-full border border-[#DCDCDB] transition-colors hover:bg-[#F5F5F4]">
              <FacebookIcon className="size-[18px]" />
            </a>
          </div>
        </section>

        <section className="h-fit rounded-2xl bg-[#F5F5F4] p-6 sm:p-10">
          <h2 className="m-0 text-2xl font-semibold text-[#171717]">{t("Contact.sendMessage")}</h2>
          <p className="mb-6 mt-2 text-[#4B4B4B]">{t("Contact.fillForm")}</p>
          <ContactUsForm onSubmit={handleFormSubmit} />
        </section>
      </div>

      <section className="bg-[#F5F5F4] py-11 sm:py-[72px]">
        <div className="mx-auto max-w-[1180px] px-4 sm:px-7">
          <div className="mb-5 grid gap-2 sm:mb-6">
            <h2 className="m-0 text-[clamp(24px,5.6vw,36px)] font-light leading-[1.12] tracking-[-0.02em] text-[#171717]">{t("Contact.findUs")}</h2>
            <p className="m-0 max-w-[40em] text-[#6B6B6B]">{t("Contact.visitUsText")}</p>
          </div>
          <div className="h-72 w-full overflow-hidden rounded-2xl border border-[#E2DFDA] bg-white sm:h-[440px]">
            <iframe
              src={`https://maps.google.com/maps?q=${encodeURIComponent(contactData.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
              className="h-full w-full border-0"
              title="Google Maps"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <ErrorDialog isOpen={isErrorDialogOpen} onCloseDialog={() => setIsErrorDialogOpen(false)} title={""} message={t("Contact.errorMessage")} />
      <SuccessDialog isOpen={isSuccessDialogOpen} setIsOpen={setIsSuccessDialogOpen} onClose={handleSuccessDialogClose} title={t(`Contact.thankYou`)} text="" />
    </div>
  );
};

export default ContactPage;
