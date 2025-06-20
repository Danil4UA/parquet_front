"use client";

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageSquare } from 'lucide-react';
import { contactData, getGoogleMapsUrl, socialLinks } from '@/Utils/utils';
import ContactUsForm from './_components/contactUsForm';
import { useTranslations } from 'next-intl';
import { ContactFormType } from '@/lib/schemas/contactFormSchema';
import ErrorDialog from '@/components/ErrorDialog';
import contactServices from '@/services/contactServices';
import { usePathname, useRouter } from 'next/navigation';
import InstagramIcon from "@/app/assets/instagram.svg";
import FacebookIcon from "@/app/assets/facebook.svg";
import { Link } from "@/i18n/routing";
import SuccessDialog from '@/components/SuccessDialog';

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
              Object.entries(formData).map(([key, value]) => [
                  key,
                  typeof value === 'string' && value.trim() === '' ? undefined : value
              ])
          ) as ContactFormType;
          
            await contactServices.contactUs(cleanedFormData);
            setIsSuccessDialogOpen(true)
        } catch {
            setIsErrorDialogOpen(true);
        }
    };
    
    const handleSuccessDialogClose = () => {
      setIsSuccessDialogOpen(false);
      router.push(`/${lng}`);
    };
    return (
        <div className="min-h-screen w-full">
          <div className="bg-[#171717] text-white py-16">
            <div className="container mx-auto px-4">
              <h1 className="text-4xl font-bold text-center">{t("Contact.contactUs")}</h1>
              <p className="text-center text-gray-300 mt-4 max-w-2xl mx-auto">
                {t("Contact.contactUsAnyWay")}
              </p>
            </div>
          </div>
    
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="bg-[#171717] p-6">
                      <div className="flex items-center gap-3">
                        <div className="bg-white bg-opacity-20 p-3 rounded-full">
                          <MessageSquare className="h-6 w-6 text-white" />
                        </div>
                        <h2 className="text-xl font-semibold text-white">{t("Contact.contactInfo")}</h2>
                      </div>
                    </div>
                    
                    <div className="p-6 space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-start gap-4">
                          <div className="bg-gray-100 p-3 rounded-full">
                            <MapPin className="h-5 w-5 text-[#171717]" />
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">{t("Contact.addressText")}</h3>
                            <a 
                              href={getGoogleMapsUrl(contactData.address)} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-gray-700 hover:text-[#171717] transition-colors"
                            >
                              {contactData.address}
                            </a>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-4">
                          <div className="bg-gray-100 p-3 rounded-full">
                            <Phone className="h-5 w-5 text-[#171717]" />
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">{t("Contact.phoneText")}</h3>
                            <a 
                              href={`tel:${contactData.phone}`} 
                              className="text-gray-700 hover:text-[#171717] transition-colors"
                            >
                              {contactData.phone}
                            </a>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-4">
                          <div className="bg-gray-100 p-3 rounded-full">
                            <Mail className="h-5 w-5 text-[#171717]" />
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">{t("Contact.emailText")}</h3>
                            <a 
                              href={`mailto:${contactData.email}`} 
                              className="text-gray-700 hover:text-[#171717] transition-colors"
                            >
                              {contactData.email}
                            </a>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-6 border-t border-gray-100">
                        <h3 className="text-sm font-medium text-gray-500 mb-3">{t("Contact.followUsText")}</h3>
                        <div className="flex">
                          <span className="h-14 w-14 p-3 rounded-full hover:bg-gray-100 transition-all">
                            <Link href={socialLinks.facebook}>
                              <FacebookIcon />
                            </Link>
                          </span>
                          <span className="h-14 w-14 p-3 rounded-full hover:bg-gray-100 transition-all">
                            <Link href={socialLinks.instagram}>
                              <InstagramIcon />
                            </Link>
                          </span>
                        </div>
                      </div>
                      
                      <div className="pt-6 border-t border-gray-100">
                        <div className="flex items-center gap-2 mb-4">
                          <Clock className="h-5 w-5 text-[#171717]" />
                          <h3 className="text-sm font-medium text-gray-700">{t("Contact.workingHours")}</h3>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                              {t("Contact.weekdays")}
                            </h4>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600 text-sm">
                                {t("Utils.days.sunday")} - {t("Utils.days.thursday")}
                              </span>
                              <span className="text-gray-800 font-medium text-sm">10:00 - 18:00</span>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                              {t("Contact.weekends")}
                            </h4>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-gray-600 text-sm">{t("Utils.days.friday")}</span>
                              <span className="text-gray-800 font-medium text-sm">9:00 - 12:00</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600 text-sm">{t("Utils.days.saturday")}</span>
                              <span className="text-red-500 font-medium text-sm">{t("Utils.status.closed")}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-xl shadow-md overflow-hidden h-full flex flex-col">

                    <div className="bg-[#171717] p-6">
                      <div className="flex items-center gap-3">
                        <div className="bg-white bg-opacity-20 p-3 rounded-full">
                          <Mail className="h-6 w-6 text-white" />
                        </div>
                        <h2 className="text-xl font-semibold text-white">{t("Contact.sendMessage")}</h2>
                      </div>
                    </div>

                    <div className="p-6">
                      <p className="text-gray-500 mb-6">
                        {t("Contact.fillForm")}
                      </p>
                      <ContactUsForm onSubmit={handleFormSubmit} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                <div className="aspect-w-16 aspect-h-8 w-full h-96">
                  <iframe 
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(contactData.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`} 
                    className="w-full h-full" 
                    title="Google Maps"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <ErrorDialog
            isOpen={isErrorDialogOpen}
            onCloseDialog={() => setIsErrorDialogOpen(false)}
            title={""}
            message={t("Contact.errorMessage")}
          />
          <SuccessDialog
            isOpen={isSuccessDialogOpen}
            setIsOpen={setIsSuccessDialogOpen}
            onClose={handleSuccessDialogClose}
            title={t(`Contact.thankYou`)}
            text=""
          />
        </div>
      );
  };
  
  export default ContactPage;