"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Clock, User, TrendingUp } from "lucide-react";
import Link from "next/link";

// Types
type WPAuthor = {
  name: string;
};

type WPFeaturedMedia = {
  source_url: string;
};

type WPPost = {
  id: number;
  slug: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  date: string;
  _embedded?: {
    author?: WPAuthor[];
    "wp:featuredmedia"?: WPFeaturedMedia[];
  };
};

type WPCategory = {
  id: number;
  name: string;
  count: number;
};

const BASE_URL = "https://api.oyonews.com.ng/wp-json/wp/v2";

const Spinner = () => (
  <div className="flex justify-center py-8">
    <svg
      className="animate-spin h-8 w-8 text-blue-600"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  </div>
);

const PostSkeleton = () => (
  <article className="flex bg-white rounded-xl shadow-lg p-4 animate-pulse space-x-4">
    <div className="w-1/3 bg-gray-300 rounded-md h-32"></div>
    <div className="w-2/3 space-y-3 py-1">
      <div className="h-6 bg-gray-300 rounded w-3/4"></div>
      <div className="h-4 bg-gray-300 rounded w-full"></div>
      <div className="h-4 bg-gray-300 rounded w-5/6"></div>
      <div className="flex space-x-3 mt-2">
        <div className="h-4 bg-gray-300 rounded w-20"></div>
        <div className="h-4 bg-gray-300 rounded w-20"></div>
      </div>
    </div>
  </article>
);

const deduplicatePosts = (posts: WPPost[]) => {
  const map = new Map<number, WPPost>();
  posts.forEach((post) => {
    map.set(post.id, post);
  });
  return Array.from(map.values());
};

const CategoryFeed = () => {
  const [categories, setCategories] = useState<WPCategory[]>([]);
  const [postsByCategory, setPostsByCategory] = useState<
    Record<number, WPPost[]>
  >({});
  const [pageByCategory, setPageByCategory] = useState<Record<number, number>>(
    {}
  );
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const observer = useRef<IntersectionObserver | null>(null);
  const fetchingRef = useRef(false);

  const loadPosts = useCallback(
    async (categoryList: WPCategory[], pages: Record<number, number>) => {
      if (fetchingRef.current) return;
      setLoadingPosts(true);
      fetchingRef.current = true;

      const fetchPromises = categoryList.map((cat, index) => {
        const perPage = index === 0 ? 10 : 2;
        const page = pages[cat.id] || 1;

        if ((postsByCategory[cat.id]?.length || 0) >= page * perPage) {
          return Promise.resolve();
        }

        return fetch(
          `${BASE_URL}/posts?categories=${cat.id}&per_page=${perPage}&page=${page}&_embed`
        )
          .then((res) => {
            if (!res.ok) throw new Error("Network response was not ok");
            return res.json();
          })
          .then((data: WPPost[]) => {
            setPostsByCategory((prev) => {
              const existing = prev[cat.id] || [];
              const combined = [...existing, ...data];
              return {
                ...prev,
                [cat.id]: deduplicatePosts(combined),
              };
            });
          });
      });

      Promise.all(fetchPromises)
        .catch((err) => {
          setError("Failed to load posts.");
          console.error(err);
        })
        .finally(() => {
          setLoadingPosts(false);
          fetchingRef.current = false;
        });
    },
    [postsByCategory]
  );

  useEffect(() => {
    setLoadingCategories(true);
    fetch(`${BASE_URL}/categories?per_page=100`)
      .then((res) => res.json())
      .then((data: WPCategory[]) => {
        const sorted = data.sort((a, b) => b.count - a.count);
        setCategories(sorted);

        const pages: Record<number, number> = {};
        sorted.forEach((cat) => {
          pages[cat.id] = 1;
        });
        setPageByCategory(pages);

        loadPosts(sorted, pages);
        setLoadingCategories(false);
      })
      .catch((err) => {
        setError("Failed to load categories.");
        setLoadingCategories(false);
        console.error(err);
      });
  }, [loadPosts]);

  const lastPostRef = useCallback(
    (node: Element | null) => {
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !fetchingRef.current) {
          const updatedPages = { ...pageByCategory };
          categories.forEach((cat) => {
            updatedPages[cat.id] = (updatedPages[cat.id] || 1) + 1;
          });
          setPageByCategory(updatedPages);
          loadPosts(categories, updatedPages);
        }
      });

      if (node) observer.current.observe(node);
    },
    [categories, pageByCategory, loadPosts]
  );

  useEffect(() => {
    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, []);

  const categoryColors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
  ];
  const getCategoryColor = (index: number) =>
    categoryColors[index % categoryColors.length] || "bg-gray-500";

  if (error) {
    return (
      <div className="text-center text-red-600 py-10">
        <p>{error}</p>
      </div>
    );
  }

  if (loadingCategories) {
    return <Spinner />;
  }

  return (
    <section className="mb-12">
      {categories.map((category, catIndex) => (
        <div key={category.id} className="mb-12">
          <div className="flex items-center mb-6">
            <Badge
              className={`${getCategoryColor(
                catIndex
              )} text-white mr-4 px-4 py-2 text-lg`}
            >
              {category.name}
            </Badge>
            <div className="h-1 bg-gradient-to-r from-gray-300 to-transparent rounded-full flex-1"></div>
            <TrendingUp className="h-5 w-5 text-gray-400 ml-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(postsByCategory[category.id] || []).map((post, i, arr) => {
              const isLastCategory = catIndex === categories.length - 1;
              const isLastPost = i === arr.length - 1;
              const ref = isLastCategory && isLastPost ? lastPostRef : null;

              const featuredMedia =
                post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
                "https://via.placeholder.com/300x200?text=No+Image";

              return (
                <Link href={`/${post.slug || ""}`} key={post.id}>
                  <article
                    ref={ref as React.Ref<HTMLDivElement>}
                    className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    <div className="flex">
                      <div className="w-1/3 relative h-32">
                         <img
  src={featuredMedia}
  alt={post.title.rendered.replace(/<[^>]+>/g, "")}
  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
  loading="lazy"
/>
                      </div>
                      <div className="w-2/3 p-4">
                        <h3
                          className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2"
                          dangerouslySetInnerHTML={{
                            __html: post.title.rendered || "",
                          }}
                        />
                        <p
                          className="text-gray-600 text-sm mb-3 line-clamp-2"
                          dangerouslySetInnerHTML={{
                            __html: post.excerpt.rendered || "",
                          }}
                        />
                        <div className="flex items-center text-xs text-gray-500 space-x-3">
                          <div className="flex items-center space-x-1">
                            <User className="h-3 w-3" />
                            <span>
                              {post._embedded?.author?.[0]?.name ||
                                "Unknown Author"}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>
                              {new Date(post.date).toLocaleDateString(
                                undefined,
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}

            {loadingPosts &&
              Array.from({ length: catIndex === 0 ? 10 : 2 }, (_, i) => (
                <PostSkeleton key={`skeleton-${category.id}-${i}`} />
              ))}
          </div>
        </div>
      ))}
    </section>
  );
};

export default CategoryFeed;
