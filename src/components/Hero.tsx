'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MainNav from './MainNav';
import AdBanner from './AdBanner';

type Post = {
  id: number;
  title: string;
  slug: string;
  image: string;
  category: string;
  comments: string | number;
  link: string;
};

const Hero = () => {
  const [trendingPosts, setTrendingPosts] = useState<Post[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const router = useRouter();


  type WPPost = {
  id: number;
  slug: string;
  title?: { rendered?: string };
  comment_count?: number;
  link: string;
  _embedded?: {
    'wp:featuredmedia'?: { source_url?: string }[];
    'wp:term'?: { name?: string }[][];
  };
};


  useEffect(() => {
    fetch('https://api.oyonews.com.ng/wp-json/wp/v2/posts?per_page=6&_embed')
      .then((res) => res.json())
      .then((data) => {
        const mapped: Post[] = (data as WPPost[]).map((post) => ({
          id: post.id,
          title: post.title?.rendered || 'Untitled',
          slug: post.slug,
          image:
            post._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
            'https://via.placeholder.com/400x300?text=No+Image',
          category:
            post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Uncategorized',
          comments: post.comment_count || '0',
          link: post.link,
        }));
        setTrendingPosts(mapped);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch trending posts', err);
        setError(true);
        setLoading(false);
      });
  }, []);

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <section className="bg-white">
      {/* Top Ad Banner */}
      <AdBanner size="large" position="top" />

      {/* Navigation */}
      <MainNav />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content with Ad */}
          <div className="lg:col-span-3">
            <AdBanner size="large" position="content" />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <AdBanner size="sidebar" position="sidebar" />

            {/* Search */}
            <div className="bg-black rounded-lg p-4">
              <div className="flex items-center text-white mb-3">
                <Search className="h-5 w-5 mr-2" />
                <span className="font-bold">SEARCH FOR POST</span>
              </div>
              <div className="flex">
                <Input
                  className="flex-1 bg-white"
                  placeholder="Search..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <Button
                  className="ml-2 bg-gray-700 hover:bg-gray-600 text-white"
                  onClick={handleSearch}
                >
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Trending Posts */}
        <div className="mt-8">
          <div className="flex space-x-4 mb-6">
            <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 font-bold">
              TRENDING POSTS
            </Button>
          </div>

          {loading ? (
            <p className="text-gray-500">Loading trending posts...</p>
          ) : error ? (
            <p className="text-red-500">Failed to load trending posts.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {trendingPosts.map((post) => (
                <Link
  key={post.id}
  href={`/${post.slug}`}
  className="block bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
>
  <div className="relative w-full h-48">
 <img
  src={post.image}
  alt={post.title}
  loading="lazy"
  className="absolute inset-0 w-full h-full object-cover"
/>
    <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-sm font-bold">
      {post.comments}
    </div>
  </div>
  <div className="p-4">
    <h3 className="font-bold text-gray-800 line-clamp-2">{post.title}</h3>
  </div>
</Link>

              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
