import React, { lazy, Suspense } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import LazyVisibleSection from "@/components/LazyVisibleSection";
import AdBanner from "@/components/AdBanner";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy-loaded post components
const MostRecentPost = lazy(() => import("@/components/FeaturedPosts"));
const CategorySection = lazy(() => import("@/components/CategorySection"));
const TrendingPosts = lazy(() => import("@/components/TrendingPosts"));

// Skeleton placeholder for loading state
const PostCardSkeleton = () => (
  <Card>
    <Skeleton className="w-full h-48 rounded-t-lg" />
    <CardContent className="p-4 space-y-2">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-1/3" />
    </CardContent>
  </Card>
);

const FallbackSkeletonGrid = ({ count = 3 }: { count?: number }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <PostCardSkeleton key={i} />
    ))}
  </div>
);

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Hero />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* === Main Content === */}
          <div className="lg:col-span-2 space-y-10">
            <LazyVisibleSection height={256}>
              <Suspense fallback={<FallbackSkeletonGrid count={1} />}>
                <MostRecentPost />
              </Suspense>
            </LazyVisibleSection>

            <AdBanner size="medium" position="content" />

            <LazyVisibleSection height={192}>
              <Suspense fallback={<FallbackSkeletonGrid count={2} />}>
                <CategorySection />
              </Suspense>
            </LazyVisibleSection>
          </div>

          {/* === Sidebar === */}
          <aside className="lg:col-span-1 space-y-6">
            <LazyVisibleSection height={384}>
              <Suspense fallback={<FallbackSkeletonGrid count={1} />}>
                <TrendingPosts />
              </Suspense>
            </LazyVisibleSection>

            <AdBanner size="sidebar" position="sidebar" />
            <Newsletter />
          </aside>
        </div>
      </main>

      <AdBanner size="large" position="bottom" />
      <Footer />
    </div>
  );
};

export default Index;
