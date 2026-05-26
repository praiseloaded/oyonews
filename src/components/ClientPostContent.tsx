// components/ClientPostContent.tsx
"use client";

import { useEffect, useState } from "react";

export default function ClientPostContent({ html }: { html: string }) {
  const [enhanced, setEnhanced] = useState<string>("");

  useEffect(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const paragraphs = doc.querySelectorAll("p");

    if (paragraphs.length > 2) {
      const ad = document.createElement("div");
      ad.innerHTML = `<div class="my-6 bg-yellow-100 p-4 text-center">Ad Placeholder</div>`;
      paragraphs[1].parentNode?.insertBefore(ad, paragraphs[2]);
    }

    setEnhanced(doc.body.innerHTML);
  }, [html]);

  return (
    <div
      className="prose"
      dangerouslySetInnerHTML={{ __html: enhanced || html }}
    />
  );
}
