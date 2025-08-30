"use client";
import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageSquare, MessageCircle, Map } from 'lucide-react';
import { motion } from 'framer-motion';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const fadeInVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

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

    const handleWhatsAppClick = () => {
        const message = encodeURIComponent(`Hello!`);
        window.open(`https://wa.me/+972584455478?text=${message}`, '_blank');
    };

    const handleGoogleMapsClick = () => {
        const googleMapsUrl = getGoogleMapsUrl(contactData.address);
        window.open(googleMapsUrl, '_blank');
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-gray-100">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeInVariants}
            transition={{ duration: 0.8 }}
            className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-4 sm:py-10 overflow-hidden"
          >
            <div className="container mx-auto px-4 sm:px-6 relative">
              <div className="text-center max-w-4xl mx-auto">
                <motion.h1 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 leading-tight"
                >
                  {t("Contact.contactUs")}
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-base sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed px-2"
                >
                  {t("Contact.contactUsAnyWay")}
                </motion.p>
              </div>
            </div>
          </motion.div>
    
          <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-12">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="max-w-5xl mx-auto"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
                <motion.div variants={fadeInVariants} className="lg:col-span-1">
                  <Card className="h-full shadow-lg border-0 bg-white">
                    <CardHeader className="bg-gray-900 text-white rounded-t-lg p-4">
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        <span className="text-lg">{t("Contact.contactInfo")}</span>
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="p-0">
                      <div className="divide-y divide-gray-100">
                        <div className="p-2 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-3">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <div className="flex-1">
                              <p className="text-xs text-gray-500 mb-1">{t("Contact.addressText")}</p>
                              <div className="flex gap-2 mt-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={handleGoogleMapsClick}
                                  className="h-7 px-2 text-xs hover:bg-blue-50 hover:border-blue-200 border font-bold"
                                >
                                  <Map className="h-5 w-5" />
                                  {contactData.address}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* Phone */}
                        <div className="p-2 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-3">
                            <Phone className="h-4 w-4 text-gray-500" />
                            <div className="flex-1">
                              <p className="text-xs text-gray-500 mb-1">{t("Contact.phoneText")}</p>
                              <a 
                                href={`tel:${contactData.phone}`} 
                                className="text-gray-900 hover:text-blue-600 transition-colors text-sm font-medium"
                              >
                                {contactData.phone}
                              </a>
                            </div>
                          </div>
                        </div>
                        
                        {/* Email */}
                        <div className="p-2 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-3">
                            <Mail className="h-4 w-4 text-gray-500" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-gray-500 mb-1">{t("Contact.emailText")}</p>
                              <a 
                                href={`mailto:${contactData.email}`} 
                                className="text-gray-900 hover:text-blue-600 transition-colors text-sm font-medium break-all"
                              >
                                {contactData.email}
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Social Media */}
                      <div className="p-4 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">{t("Contact.followUsText")}</p>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-blue-50 hover:border-blue-200"
                              asChild
                            >
                              <Link href={socialLinks.facebook}>
                                <FacebookIcon className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-pink-50 hover:border-pink-200"
                              asChild
                            >
                              <Link href={socialLinks.instagram}>
                                <InstagramIcon className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleWhatsAppClick}
                              className="h-8 w-8 p-0 hover:bg-green-50 hover:border-green-200"
                            >
                              <MessageCircle className="h-4 w-4 text-green-600" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Working Hours */}
                      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                        <div className="flex items-center gap-2 mb-3">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <p className="text-sm font-medium text-gray-900">{t("Contact.workingHours")}</p>
                        </div>
                        
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">
                              {t("Utils.days.sunday")} - {t("Utils.days.thursday")}
                            </span>
                            <span className="font-medium text-gray-900">10:00 - 18:00</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">{t("Utils.days.friday")}</span>
                            <span className="font-medium text-gray-900">9:00 - 12:00</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">{t("Utils.days.saturday")}</span>
                            <span className="font-medium text-red-600">{t("Utils.status.closed")}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
      
                {/* Contact Form Card */}
                <motion.div variants={fadeInVariants} className="lg:col-span-2">
                  <Card className="h-full shadow-xl border-0 bg-white/70 backdrop-blur-sm">
                    <CardHeader className="bg-gray-900 text-white rounded-t-lg p-4">
                      <CardTitle className="flex items-center gap-3">
                        <div className="bg-white/20 rounded-full">
                          <Mail className="h-5 w-5" />
                        </div>
                        <span className="text-lg sm:text-xl">{t("Contact.sendMessage")}</span>
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="p-4 sm:p-6">
                      <div className="mb-6">
                        <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                          {t("Contact.fillForm")}
                        </p>
                      </div>
                      <ContactUsForm onSubmit={handleFormSubmit} />
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </motion.div>
          </div>
          
          {/* Map Section */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="py-4 sm:py-12 bg-gradient-to-b from-gray-100 to-gray-200"
          >
            <div className="container mx-auto px-3 sm:px-4">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-6 sm:mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">{t("Contact.findUs")}</h2>
                  <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base px-4 sm:px-0">
                    {t("Contact.visitUsText")}
                  </p>
                </div>
                <Card className="overflow-hidden shadow-2xl border-0">
                  <div className="aspect-w-16 aspect-h-8 w-full h-64 sm:h-96 lg:h-[500px]">
                    <iframe 
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(contactData.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`} 
                      className="w-full h-full rounded-lg" 
                      title="Google Maps"
                      loading="lazy"
                    />
                  </div>
                </Card>
              </div>
            </div>
          </motion.div>
          
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