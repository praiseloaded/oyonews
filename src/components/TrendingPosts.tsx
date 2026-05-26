'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Clock, Eye } from "lucide-react";

const Skeleton = ({ className }: { className: string }) => (
  <div className={`bg-gray-300 rounded ${className} animate-pulse`}></div>
);

const TrendingPostSkeleton = () => (
  <div className="flex items-start space-x-3 p-3 rounded-lg animate-pulse bg-gray-100">
    <div className="flex-shrink-0 relative">
      <Skeleton className="w-6 h-6 rounded-full mb-1" />
      <Skeleton className="w-16 h-16 rounded-lg" />
    </div>
    <div className="flex-1 min-w-0">
      <Skeleton className="w-12 h-4 mb-2 rounded" />
      <Skeleton className="w-full h-5 mb-2 rounded" />
      <Skeleton className="w-20 h-4 rounded" />
    </div>
  </div>
);

interface Post {
  id: number;
  slug: string;
  title: { rendered: string };
  featured_media_src: string;
  categories_names: string[];
  post_views_count: number;
  date: string;
}

interface RawPost {
  id: number;
  slug: string;
  title: { rendered: string };
  date: string;
  meta?: { post_views_count?: string | number };
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url: string }>;
    "wp:term"?: Array<Array<{ name: string }>>;
  };
}

const TrendingPosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatViews = (views?: number) =>
    !views ? "0" : views >= 1000 ? `${(views / 1000).toFixed(1)}k` : views.toString();

  const formatPublishedAt = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins} min ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days !== 1 ? "s" : ""} ago`;
  };

  useEffect(() => {
    const fetchTrendingPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          "https://api.oyonews.com.ng/wp-json/wp/v2/posts?per_page=5&orderby=post_views_count&order=desc&meta_key=post_views_count&_embed"
        );
        if (!res.ok) throw new Error("Failed to fetch trending posts");

        const data = await res.json();

        const processedPosts: Post[] = (data as RawPost[]).map((post) => ({
          id: post.id,
          slug: post.slug,
          title: post.title,
          featured_media_src:
            post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ??
            "https://via.placeholder.com/300x200?text=No+Image",
          categories_names:
            post._embedded?.["wp:term"]?.[0]?.map((cat) => cat.name) || [],
          post_views_count: Number(post.meta?.post_views_count) || 0,
          date: post.date,
        }));

        setPosts(processedPosts);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || "Error fetching posts");
        } else {
          setError("Error fetching posts");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingPosts();
  }, []);

  if (error) return <p className="text-red-600 font-semibold">Error: {error}</p>;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
      <div className="flex items-center mb-6">
        <TrendingUp className="h-6 w-6 text-red-500 mr-3" />
        <h3 className="text-xl font-bold text-gray-900">Trending Now</h3>
      </div>

      <div className="space-y-4">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => <TrendingPostSkeleton key={i} />)
          : posts.map((post) => (
              <Link
                key={post.id}
                href={`/${post.slug}`}
                className="group block cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 relative">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                       <img
  src={post.featured_media_src}
  alt={post.title.rendered}
  loading="lazy"
  className="w-full h-full object-cover"
/>

                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    {post.categories_names[0] && (
                      <Badge variant="outline" className="text-xs mb-2">
                        {post.categories_names[0]}
                      </Badge>
                    )}
                    <h4 className="font-semibold text-sm text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                      {post.title.rendered}
                    </h4>
                    <div className="flex items-center text-xs text-gray-500 space-x-3">
                      <div className="flex items-center space-x-1">
                        <Eye className="h-3 w-3" />
                        <span>{formatViews(post.post_views_count)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatPublishedAt(post.date)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
      </div>
    </div>
  );
};

export default TrendingPosts;
