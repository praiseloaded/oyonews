// src/lib/api.ts

import { RelatedPost, WPPost } from "@/lib/types";

const API_BASE =
  process.env.WORDPRESS_API_URL ||
  "https://api.oyonews.com.ng/wp-json/wp/v2";

// Get all slugs for static generation
export async function fetchAllSlugs(): Promise<string[]> {
  const res = await fetch(`${API_BASE}/posts?per_page=100&_fields=slug`);
  const posts: { slug: string }[] = await res.json();
  return posts.map((post) => post.slug);
}

// Get a single post by slug
export async function fetchPostBySlug(slug: string): Promise<WPPost | null> {
  const controller = new AbortController();
  // const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

  try {
    const res = await fetch(
      `https://api.oyonews.com.ng/wp-json/wp/v2/posts?slug=${slug}&_embed`,
      { signal: controller.signal }
    );

    if (!res.ok) throw new Error(`Failed to fetch post: ${res.status}`);

    const posts: WPPost[] = await res.json();

    if (!posts.length) return null;

    return posts[0];
} catch (err) {
  if (err instanceof Error) {
    console.error("fetchPostBySlug failed:", err.message);
  } else {
    console.error("fetchPostBySlug failed with unknown error");
  }
  return null;
}

}




// Get related posts by category
export async function fetchRelatedPosts(post: WPPost): Promise<RelatedPost[]> {
  const categoryId = post.categories?.[0];
  if (!categoryId) return [];

  const res = await fetch(
    `${API_BASE}/posts?categories=${categoryId}&exclude=${post.id}&per_page=4&_embed`
  );
  const posts: WPPost[] = await res.json();

  return posts.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title.rendered,
    date: new Date(p.date).toLocaleDateString(),
    image:
      p._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
      "https://via.placeholder.com/150",
  }));
}
