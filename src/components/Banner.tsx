"use client";

import { useEffect, useState } from "react";

export default function Banner() {
  const [bannerUrl, setBannerUrl] = useState("");

  useEffect(() => {
    fetch("/api/banner")
      .then((res) => res.json())
      .then((data) => {
        setBannerUrl(data?.acf?.top_banner?.url);
      })
      .catch((err) => console.error("Failed to load banner", err));
  }, []);

  if (!bannerUrl) return null;

  return (
    <div className="w-full bg-white text-center py-2 border-gray-200">
      <div className="relative w-full h-[80px] sm:h-[100px]">
        <a href="https://oyonews.com.ng" target="_blank" rel="noopener noreferrer">
          <img
            src={bannerUrl}
            alt="Top Advert Banner"
            className="object-contain w-full h-full"
            style={{ objectFit: "contain" }}
            loading="lazy"
          />
        </a>
      </div>
    </div>
  );
}
