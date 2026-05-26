"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search as SearchIcon,
  Calendar,
  User,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MainNav from "@/components/MainNav";

const API_BASE = "https://api.oyonews.com.ng/wp-json/wp/v2";

// Type Definitions
interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Post {
  id: number;
  slug: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  date: string;
  categories: number[];
  _embedded?: {
    author?: { name: string }[];
    "wp:featuredmedia"?: { source_url: string }[];
  };
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams?.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [category, setCategory] = useState("all-categories");
  const [sortBy, setSortBy] = useState("date");
  const [posts, setPosts] = useState<Post[]>([]);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/posts?_embed&per_page=100`);
        const data: Post[] = await res.json();
        setPosts(data);
      } catch (err) {
        console.error("Error fetching posts", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Fetch categories
  useEffect(() => {
    fetch(`${API_BASE}/categories`)
      .then((res) => res.json())
      .then((data: Category[]) => setCategoriesList(data))
      .catch(console.error);
  }, []);

  // Filter and sort posts based on UI state
  const filteredPosts = useMemo(() => {
    let results = [...posts];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (post) =>
          post.title.rendered.toLowerCase().includes(q) ||
          post.excerpt.rendered.toLowerCase().includes(q)
      );
    }

    if (category !== "all-categories") {
      const catId = categoriesList.find((cat) => cat.slug === category)?.id;
      if (catId) {
        results = results.filter((post) => post.categories.includes(catId));
      }
    }

    if (sortBy === "date") {
      results.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    }

    return results;
  }, [posts, searchQuery, category, sortBy, categoriesList]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <MainNav />

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search for posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-categories">All Categories</SelectItem>
                {categoriesList.map((cat) => (
                  <SelectItem key={cat.id} value={cat.slug}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Latest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white shadow rounded p-4 animate-pulse"
              >
                <div className="h-48 bg-gray-200 mb-4 rounded"></div>
                <div className="h-5 bg-gray-200 mb-2 w-3/4 rounded"></div>
                <div className="h-4 bg-gray-200 mb-1 w-full rounded"></div>
                <div className="h-4 bg-gray-200 mb-1 w-5/6 rounded"></div>
              </div>
            ))
          ) : filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white shadow rounded overflow-hidden"
              >
                <Link href={`/${post.slug}`}>
                  <img
  src={post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "https://via.placeholder.com/400x200"}
  alt={post.title.rendered}
  className="w-full h-48 object-cover"
  loading="lazy"
/>
                </Link>
                <div className="p-4">
                  <Badge className="bg-red-600 text-white">
                    {
                      categoriesList.find((cat) =>
                        post.categories.includes(cat.id)
                      )?.name || "Uncategorized"
                    }
                  </Badge>
                  <Link href={`/${post.slug}`}>
                    <h2
                      className="text-xl font-semibold mb-2 hover:text-red-600"
                      dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                    />
                  </Link>
                  <p
                    className="text-gray-600"
                    dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                  />
                  <div className="mt-2 text-sm text-gray-500 flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {post._embedded?.author?.[0]?.name || "Unknown"}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(post.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              No posts found for your search.
            </p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
