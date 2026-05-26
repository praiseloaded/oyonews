// src/types.ts

export type User = {
  name: string;
  email: string;
  role: string;
};

export type WPPost = {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  slug: string;
  date: string;
  featured_media?: number;
  categories?: number[];

  _embedded?: {
    author?: { name: string }[];
    'wp:featuredmedia'?: { source_url: string }[];
    'wp:term'?: { name: string }[][];
  };
};


export type RelatedPost = {
  id: number;
  title: string;
  slug: string;
  date: string;
  image: string;
};

