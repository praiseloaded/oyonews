'use client';

import { useEffect, useRef } from 'react';

interface AdBannerProps {
  size: 'large' | 'medium' | 'sidebar';
  position: 'top' | 'content' | 'sidebar' | 'bottom' | 'mid-content';
}
declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}


const AdBanner = ({ size, position }: AdBannerProps) => {
  const adRef = useRef<HTMLElement | null>(null);

useEffect(() => {
  const adScriptId = 'adsbygoogle-init';

  if (!document.getElementById(adScriptId)) {
    const script = document.createElement('script');
    script.id = adScriptId;
    script.async = true;
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
    script.setAttribute('data-ad-client', 'ca-pub-4265599706896166');
    document.head.appendChild(script);
  }

  const interval = setInterval(() => {
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      if (window.adsbygoogle && adRef.current) {
        window.adsbygoogle.push({});
        clearInterval(interval);
      }
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, 500);

  return () => clearInterval(interval);
}, []);


  const getAdSlot = () => {
    switch (size) {
      case 'large':
        return '7440205382';
      case 'medium':
        return '3408033983';
      case 'sidebar':
        return '5485460070';
      default:
        return '9616541074';
    }
  };

  const getAdDimensions = () => {
    switch (size) {
      case 'large':
        return 'h-32 md:h-40';
      case 'medium':
        return 'h-24 md:h-32';
      case 'sidebar':
        return 'h-64';
      default:
        return 'h-32';
    }
  };

  const getMarginClasses = () => {
    switch (position) {
      case 'top':
        return 'mb-8';
      case 'content':
        return 'my-8';
      case 'sidebar':
        return 'mb-8';
      case 'bottom':
        return 'mt-8 mb-4';
      case 'mid-content':
        return 'my-6';
      default:
        return 'my-4';
    }
  };

  return (
    <div className={`w-full ${getMarginClasses()}`}>
      <div
        className={`
          ${getAdDimensions()}
          relative overflow-hidden rounded-lg
          border-2 border-dashed border-gray-300
          bg-gradient-to-r from-blue-100 to-purple-100
          flex items-center justify-center
          hover:from-blue-200 hover:to-purple-200
          transition-all duration-300
        `}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-gradient-to-r from-blue-400 to-purple-400 animate-pulse" />
        </div>

        <ins
          className="adsbygoogle z-10"
          style={{ display: 'block', width: '100%', height: '100%' }}
          data-ad-client="ca-pub-4265599706896166"
          data-ad-slot={getAdSlot()}
          data-ad-format="auto"
          data-full-width-responsive="true"
          ref={(el) => {
            if (el) adRef.current = el;
          }}
        />
      </div>
    </div>
  );
};

export default AdBanner;
