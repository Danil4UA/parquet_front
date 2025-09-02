declare global {
  interface Window {
    fbq: (action: string, eventName: string, parameters?: any) => void;
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export {};