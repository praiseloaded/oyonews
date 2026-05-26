"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Clock, User, Eye } from "lucide-react";

const SkeletonPost = ({ featured = false }: { featured?: boolean }) => (
  <article
    className={`animate-pulse bg-white rounded-2xl overflow-hidden shadow-lg ${featured ? "md:col-span-2" : ""}`}
  >
    <div className={`bg-gray-300 w-full ${featured ? "h-64 md:h-80" : "h-48"}`} />
    <div className="p-6 space-y-4">
      <div className={`bg-gray-300 rounded h-6 ${featured ? "w-3/4" : "w-5/6"}`} />
      <div className="space-y-2">
        <div className="bg-gray-300 rounded h-4 w-full" />
        <div className="bg-gray-300 rounded h-4 w-5/6" />
        {!featured && <div className="bg-gray-300 rounded h-4 w-4/6" />}
      </div>
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <div className="bg-gray-300 rounded h-4 w-20" />
          <div className="bg-gray-300 rounded h-4 w-20" />
        </div>
        <div className="bg-gray-300 rounded h-4 w-12" />
      </div>
    </div>
  </article>
);

interface Post {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  author: string;
  publishedAt: string;
  views: string;
  featured: boolean;
}

const FeaturedPosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          "https://api.oyonews.com.ng/wp-json/wp/v2/posts?per_page=5&orderby=date&order=desc&_embed"
        );

        console.log("Fetching posts...");
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || "Failed to fetch posts");
        }

        const data = await res.json();
        console.log("Fetched data:", data); // 🔍 log raw API response

        type WPPost = {
          id: number;
          slug: string;
          title: { rendered: string };
          excerpt: { rendered: string };
          date: string;
          meta?: { post_views_count?: string };
          _embedded?: {
            author?: { name?: string }[];
            "wp:term"?: { name?: string }[][];
            "wp:featuredmedia"?: { source_url?: string }[];
          };
        };

        const mappedPosts: Post[] = data.map((post: WPPost, i: number) => ({
          id: post.id,
          slug: post.slug,
          title: post.title.rendered,
          excerpt:
            post.excerpt.rendered.replace(/<\/?[^>]+(>|$)/g, "").slice(0, 160).trim() + "…",
          image:
            post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
            "https://via.placeholder.com/400x300?text=No+Image",
          category: post._embedded?.["wp:term"]?.[0]?.[0]?.name || "Uncategorized",
          author: post._embedded?.author?.[0]?.name || "Unknown",
          publishedAt: new Date(post.date).toLocaleDateString(undefined, {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          views: post.meta?.post_views_count
            ? Number(post.meta.post_views_count).toLocaleString()
            : "0",
          featured: i === 0,
        }));

        console.log("Mapped posts:", mappedPosts); // ✅ log the transformed posts
        setPosts(mappedPosts);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || "Error fetching posts");
        } else {
          setError("Error fetching posts");
        }
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (!posts.length && !loading) return <p>No posts found.</p>;

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Featured Stories</h2>
        <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex-1 ml-6 max-w-32" />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <SkeletonPost featured />
          <SkeletonPost />
          <SkeletonPost />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post, index) => (
            <article
              key={post.id}
              className={`group transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${index === 0 ? "md:col-span-2" : ""}`}
            >
              <Link
                href={`/${post.slug}`}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 block"
              >
                <div className="relative overflow-hidden">
                  <img
  src={post.image}
  alt={post.title}
  loading="lazy"
  className={`w-full object-cover transition-transform duration-300 group-hover:scale-110 ${index === 0 ? "h-64 md:h-80" : "h-48"}`}
/>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <Badge className="absolute top-4 left-4 bg-red-500 hover:bg-red-600 text-white">
                    {post.category}
                  </Badge>
                  {post.featured && (
                    <Badge className="absolute top-4 right-4 bg-yellow-500 hover:bg-yellow-600 text-black">
                      Featured
                    </Badge>
                  )}
                </div>

                <div className="p-6">
                  <h3 className={`font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 ${index === 0 ? "text-2xl" : "text-xl"}`}>
                    {post.title}
                  </h3>

                  <p className="text-gray-600 mb-4 leading-relaxed">{post.excerpt}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{post.publishedAt}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>{post.views}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default FeaturedPosts;
