"use client";

import { useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  height?: number;
  children: React.ReactNode;
}

const LazyVisibleSection = ({ children, height = 300 }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current || visible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100px" }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [visible]);

  return (
    <div ref={ref}>
      {visible ? (
        children
      ) : (
        <Skeleton
          className="w-full rounded-lg"
          style={{ height: `${height}px` }}
        />
      )}
    </div>
  );
};

export default LazyVisibleSection;
