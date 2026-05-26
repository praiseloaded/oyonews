"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const RouteChangeLoader = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleStop = () => setLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleStop);
    router.events.on("routeChangeError", handleStop);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleStop);
      router.events.off("routeChangeError", handleStop);
    };
  }, [router]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-white/80 z-[9999] flex items-center justify-center">
      <div className="animate-pulse space-y-4 p-6 rounded-xl shadow-lg bg-white w-[90%] max-w-2xl">
        <div className="bg-gray-300 h-48 rounded-md" />
        <div className="space-y-2">
          <div className="bg-gray-300 h-6 w-2/3 rounded" />
          <div className="bg-gray-200 h-4 w-full rounded" />
          <div className="bg-gray-200 h-4 w-5/6 rounded" />
          <div className="bg-gray-200 h-4 w-4/6 rounded" />
        </div>
      </div>
    </div>
  );
};

export default RouteChangeLoader;
