/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import "@/app/global.css"
import "@/app/tailwind.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { ReduxProvider } from "@/redux/ReduxProvider";
import { getLanguageMetadata } from "../metadata";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import Script from 'next/script';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return getLanguageMetadata(locale as "en" | "ru" | "he");
}

export default async function RootLayout({
  children,
  params,
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale)) {
    notFound();
  }
  
  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === "he" ? "rtl" : "ltr"}>
      <head>
        <Script id="utm-capture" strategy="beforeInteractive">
          {`
            (function() {
              if (typeof window !== 'undefined' && window.location.search) {
                const params = new URLSearchParams(window.location.search);
                const utmData = {};
                
                const trackingKeys = [
                  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
                  'fbclid',    // Facebook Click ID
                  'gclid',     // Google Click ID
                  'ttclid',    // TikTok Click ID  
                ];
                
                trackingKeys.forEach(key => {
                  const value = params.get(key);
                  if (value) utmData[key] = value;
                });
                
                if (Object.keys(utmData).length > 0) {
                  const data = {
                    params: utmData,
                    timestamp: Date.now(),
                    expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days
                    url: window.location.href,
                    referrer: document.referrer
                  };
                  
                  try {
                    localStorage.setItem('utm_params', JSON.stringify(data));
                    
                    if (window.location.hostname === 'localhost') {
                      console.log('UTM:', utmData);
                    }
                  } catch (e) {
                    console.warn('Could not save UTM:', e);
                  }
                }
              }
            })();
          `}
        </Script>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_TRACKING_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_TRACKING_ID}', {
              'campaign_content': true,
              'campaign_id': true,
              'campaign_medium': true,
              'campaign_name': true,
              'campaign_source': true,
              'campaign_term': true,
              'send_page_view': true,
              'anonymize_ip': true
            });
          `}
        </Script>

        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            
            fbq('init', '${process.env.NEXT_PUBLIC_FB_PIXEL_ID}');
            
            try {
              const stored = localStorage.getItem('utm_params');
              if (stored) {
                const data = JSON.parse(stored);
                const utmParams = data.params;
                
                fbq('track', 'PageView', {
                  utm_source: utmParams.utm_source,
                  utm_medium: utmParams.utm_medium,
                  utm_campaign: utmParams.utm_campaign,
                  fbclid: utmParams.fbclid
                });
              } else {
                fbq('track', 'PageView');
              }
            } catch (e) {
              fbq('track', 'PageView');
            }
          `}
        </Script>
        <Script 
          src="https://cdn.enable.co.il/licenses/enable-L48504psqgdw51ja-1025-74560/init.js"
          strategy="lazyOnload"
          id="enable-accessibility"
        />

        <noscript>
          <img 
            height="1" 
            width="1" 
            style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_FB_PIXEL_ID}&ev=PageView&noscript=1`}
          />
        </noscript>
      </head>
      <body>
        <ReactQueryProvider>
          <ReduxProvider>
              <NextIntlClientProvider messages={messages}>
                {children}
              </NextIntlClientProvider>
          </ReduxProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}