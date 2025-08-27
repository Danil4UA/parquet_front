"use client";

import { cn } from "@/lib/utils";
import { contactData, socialLinks } from "@/Utils/utils";
import { Mail, MessageCircle, MessageSquare, Phone } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

const ContactButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  
  const isHebrew = pathname.split("/")[1] === "he";

  const contacts = [
    {
      icon: MessageSquare,
      label: 'WhatsApp',
      color: 'text-green-600',
      bgHover: 'hover:bg-green-50',
      action: () =>  window.open(socialLinks.whatsapp, '_blank', 'noopener,noreferrer')
    },
    {
      icon: Phone,
      label: 'Call',
      color: 'text-blue-600',
      bgHover: 'hover:bg-blue-50',
      action: () => window.location.href = `tel:${contactData.phone.replace(/\s+/g, "")}`
    },
    {
      icon: Mail,
      label: 'Email',
      color: 'text-purple-600',
      bgHover: 'hover:bg-purple-50',
      action: () => window.location.href = `mailto:${contactData.email}`
    }
  ];

    return (
    <div className={cn(
        "fixed bottom-4 sm:bottom-6 sm:right-6 z-50",
        isHebrew ? "left-4" : "right-4"
    )}>
        {isOpen && (
        <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm sm:hidden -z-10"
            onClick={() => setIsOpen(false)}
        />
        )}
        
        <div className={cn(
            "absolute bottom-16 mb-2 space-y-2 transition-all duration-300 ease-out",
            isOpen ? "opacity-100 visible" : "opacity-0 invisible",
            isHebrew ? "left-0" : "right-0",
        )}>
            {contacts.map((contact, index) => {
                const Icon = contact.icon;
                return (
                    <div
                        key={contact.label}
                        className={`
                            flex items-center justify-end gap-3 cursor-pointer group
                            transition-all duration-300 ease-out
                            ${isOpen 
                                ? 'translate-y-0 opacity-100' 
                                : 'translate-y-2 opacity-0'
                            }
                        `}
                        style={{
                            transitionDelay: isOpen ? `${index * 80}ms` : '0ms'
                        }}
                        onClick={() => {
                            contact.action();
                            setIsOpen(false);
                        }}
                    >
                        <button className="w-12 h-12 rounded-full bg-white/95 backdrop-blur-md shadow-lg border border-gray-200/50 hover:bg-white hover:shadow-xl transition-all duration-200 flex items-center justify-center group-hover:scale-105">
                            <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${contact.color}`} />
                        </button>
                        
                        <div className="bg-white/95 backdrop-blur-md rounded-full px-4 py-2.5 shadow-lg border border-gray-200/50 hover:bg-white hover:shadow-xl transition-all duration-200 group-hover:scale-105">
                            <span className="text-sm font-semibold text-gray-800 whitespace-nowrap">
                                {contact.label}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>

        <button
            onClick={() => setIsOpen(!isOpen)}
            className={`
                w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-xl
                flex items-center justify-center text-white
                transition-all duration-300 ease-out
                ${isOpen 
                    ? 'bg-gray-700 hover:bg-gray-800 rotate-45' 
                    : 'bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 hover:shadow-2xl hover:scale-105'
                }
            `}
            aria-label={isOpen ? 'Close Contacts' : 'Open Contacts'}
        >
            <MessageCircle className={`w-6 h-6 sm:w-7 sm:h-7 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`} />
        </button>
    </div>
);
};

export default ContactButton;