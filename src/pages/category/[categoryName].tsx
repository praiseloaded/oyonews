'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Clock } from "lucide-react";
import LazyVisibleSection from "@/components/LazyVisibleSection";
import { Skeleton } from "@/components/ui/skeleton";
import MainNav from "@/components/MainNav";

// Types
interface Comment {
  id: number;
  author_name: string;
  date: string;
  content: { rendered: string };
}

interface Embedded {
  "wp:featuredmedia"?: { source_url: string }[];
  replies?: Comment[][];
}

interface Post {
  id: number;
  slug: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  date: string;
  _embedded?: Embedded;
  featured_media_url?: string;
  comment_count?: number;
}

const SKELETON_COUNT = 8;

const CategoryPage = () => {
  const router = useRouter();
  const { categoryName } = router.query;
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!router.isReady || !categoryName) return;

    const fetchPosts = async () => {
      setLoading(true);
      try {
        const catRes = await fetch(
          `https://api.oyonews.com.ng/wp-json/wp/v2/categories?slug=${categoryName}`
        );
        const catData = await catRes.json();
        if (!catData.length) return;

        const catId = catData[0].id;
        const res = await fetch(
          `https://api.oyonews.com.ng/wp-json/wp/v2/posts?_embed&categories=${catId}`
        );
        const data = await res.json();

        const enrichedPosts = data.map((post: Post) => ({
          ...post,
          featured_media_url: post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "",
          comment_count: post._embedded?.replies?.[0]?.length || 0,
        }));

        setPosts(enrichedPosts);
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [router.isReady, categoryName]);

  const formatCategoryName = (name: string) =>
    name.charAt(0).toUpperCase() + name.slice(1);

  const stripHtml = (html: string) => {
    if (typeof window === "undefined") return html;
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  const truncateWords = (text: string, wordLimit: number) => {
    const words = text.trim().split(/\s+/);
    return words.slice(0, wordLimit).join(" ") + (words.length > wordLimit ? "..." : "");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <MainNav />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {formatCategoryName((categoryName as string) || "Category")}
          </h1>
          <p className="text-gray-600">
            Latest posts from {formatCategoryName((categoryName as string) || "this category")}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <Card key={i}>
                <Skeleton className="w-full h-48 rounded-t-lg" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 mb-2 rounded" />
                  <Skeleton className="h-4 mb-3 rounded" />
                  <Skeleton className="h-4 w-24 rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <p className="text-center text-gray-500">No posts found in this category.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {posts.map((post) => (
                <LazyVisibleSection key={post.id}>
                  <Link href={`/${post.slug}`}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="relative">
                        <img
                          src={post.featured_media_url || "/fallback.jpg"}
                          alt={post.title.rendered}
                          className="w-full h-48 object-cover rounded-t-lg"
                          loading="lazy"
                        />
                        <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm flex items-center">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          {post.comment_count}
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-bold text-gray-900 mb-2 hover:text-red-600 transition-colors">
  <span
    className="block text-ellipsis overflow-hidden leading-snug line-clamp-2 h-[3em]" // Ensures 2 lines height
    dangerouslySetInnerHTML={{ __html: post.title.rendered }}
  />
</h3>

                        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                          {truncateWords(stripHtml(post.excerpt.rendered), 100)}
                        </p>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(post.date).toLocaleDateString()}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </LazyVisibleSection>
              ))}
            </div>

            <div className="text-center mt-12">
              <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
                Load More Posts
              </button>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CategoryPage;
