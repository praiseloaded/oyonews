'use client';

import {
  Music,
  Video,
  Play,
  Tv,
  Newspaper,
  List,
  Headphones,
  MessageSquare,
  Trophy,
  Folder,
  Menu,
  X,
  Home,
} from 'lucide-react';
import { useState, useEffect, ReactNode } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

type Category = {
  id: number;
  name: string;
  slug: string;
  count: number;
};

const iconMap: Record<string, ReactNode> = {
  Home: <Home className="h-4 w-4 mr-2" />,
  Music: <Music className="h-4 w-4 mr-2" />,
  Video: <Video className="h-4 w-4 mr-2" />,
  Entertainment: <Play className="h-4 w-4 mr-2" />,
  'NL TV': <Tv className="h-4 w-4 mr-2" />,
  News: <Newspaper className="h-4 w-4 mr-2" />,
  'NL Lists': <List className="h-4 w-4 mr-2" />,
  'DJ Mix': <Headphones className="h-4 w-4 mr-2" />,
  'Talk Zone': <MessageSquare className="h-4 w-4 mr-2" />,
  Sports: <Trophy className="h-4 w-4 mr-2" />,
};

const MainNav = () => {
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const toggleCategoryMenu = () => {
    setIsCategoryMenuOpen(!isCategoryMenuOpen);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          'https://api.oyonews.com.ng/wp-json/wp/v2/categories?per_page=100'
        );
        const data: Category[] = await res.json();
        const sorted = data
          .filter((cat) => cat.count > 0)
          .sort((a, b) => b.count - a.count);
        setCategories(sorted);
        setLoading(false);
      } catch (e) {
        console.error('Failed to load categories', e);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const renderCategoryLink = (category: Category) => {
    const icon = iconMap[category.name] || <Folder className="h-4 w-4 mr-2" />;
    return (
      <Link
        key={category.id}
        href={`/category/${category.slug}`}
        className="flex items-center text-white hover:text-red-200 font-medium transition-colors"
      >
        {icon}
        {category.name}
      </Link>
    );
  };

  return (
    <div className="bg-red-600 shadow-lg sticky top-16 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          {/* Mobile Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden text-white hover:text-red-200"
            onClick={toggleCategoryMenu}
          >
            {isCategoryMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="ml-2">Categories</span>
          </Button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center justify-center space-x-8 w-full">
            <Link
              href="/"
              className="flex items-center text-white hover:text-red-200 font-medium transition-colors"
            >
              {iconMap['Home']}
              Home
            </Link>

            {loading
              ? [...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-4 w-24 bg-red-400 rounded animate-pulse"
                  />
                ))
              : categories.map((category) => renderCategoryLink(category))}
          </nav>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isCategoryMenuOpen
              ? 'max-h-96 opacity-100 border-t border-red-500'
              : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <nav className="py-4 space-y-1 text-left">
            <Link
              href="/"
              className="flex items-center px-4 py-3 text-white hover:text-red-200 hover:bg-red-700 transition-colors rounded-md mx-2"
            >
              {iconMap['Home']} Home
            </Link>

            {loading
              ? [...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-4 bg-red-400 rounded animate-pulse w-3/4 mx-4"
                  />
                ))
              : categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/category/${category.slug}`}
                    className="flex items-center px-4 py-3 text-white hover:text-red-200 hover:bg-red-700 transition-colors rounded-md mx-2"
                  >
                    {iconMap[category.name] || <Folder className="h-4 w-4 mr-2" />}
                    {category.name}
                  </Link>
                ))}

            {!loading && (
              <div className="px-4 py-2 mx-2">
                <Button
                  variant="outline"
                  className="w-full text-red-600 border-white hover:bg-red-50"
                >
                  MORE
                </Button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default MainNav;
