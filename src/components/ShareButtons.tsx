"use client";

import { Button } from "@/components/ui/button";
import { Facebook, Twitter } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useRef } from "react";

type Props = {
  title: string;
  url: string;
};

export default function ShareButtons({ title, url }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  const handleSelect = () => {
    inputRef.current?.select();
  };

  return (
    <div className="flex items-center gap-2 mb-6 pb-6  flex-wrap">
      <span className="text-gray-600 mr-2">Share:</span>

      <Button
        size="icon"
        className="bg-green-500 text-white"
        onClick={() =>
          window.open(
            `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
            "_blank"
          )
        }
      >
        <FaWhatsapp className="h-4 w-4" />
      </Button>

      <Button
        size="icon"
        className="bg-blue-600 text-white"
        onClick={() =>
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            "_blank"
          )
        }
      >
        <Facebook className="h-4 w-4" />
      </Button>

      <Button
        size="icon"
        className="bg-blue-400 text-white"
        onClick={() =>
          window.open(
            `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
            "_blank"
          )
        }
      >
        <Twitter className="h-4 w-4" />
      </Button>

      <input
        ref={inputRef}
        className="w-full md:w-auto border rounded px-3 py-2 text-sm text-gray-600"
        value={url}
        readOnly
        onClick={handleSelect}
      />
    </div>
  );
}
