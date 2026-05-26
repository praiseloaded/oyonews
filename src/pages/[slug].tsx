// pages/[slug].tsx

import Head from "next/head";
import { GetServerSideProps } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MainNav from "@/components/MainNav";
import TrendingPosts from "@/components/TrendingPosts";
import AdBanner from "@/components/AdBanner";
import PostContent from "@/components/PostContent";
import { fetchPostBySlug, fetchRelatedPosts } from "@/lib/api";
import Skeleton from "@/components/SkeletonPost";

type WPPost = {
  id: number;
  slug: string;
  date: string;
  title: { rendered: string };
  excerpt?: { rendered: string };
  content: { rendered: string };
  _embedded?: {
    author?: { name: string }[];
    'wp:featuredmedia'?: { source_url: string }[];
    'wp:term'?: Array<Array<{ name: string }>>;
  };
};

type RelatedPost = {
  id: number;
  title: string;
  slug: string;
  date: string;
  image: string;
};

type Props = {
  post: WPPost | null;
  relatedPosts: RelatedPost[];
};

export default function SinglePostPage({ post, relatedPosts }: Props) {
  if (!post) return <Skeleton />;

  const title = post.title?.rendered || "Post";
  const excerpt =
    post.excerpt?.rendered?.replace(/<[^>]+>/g, "").slice(0, 140) ?? "";
  const image =
    post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ??
    "https://oyonews.com.ng/default-og-image.jpg";

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={excerpt} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={excerpt} />
        <meta property="og:image" content={image} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={excerpt} />
        <meta name="twitter:image" content={image} />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Header />
        <MainNav />

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <PostContent post={post} relatedPosts={relatedPosts} />
            </div>
            <div className="lg:col-span-1">
              <TrendingPosts />
              <div className="mt-8">
                <AdBanner size="sidebar" position="sidebar" />
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}


export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params as { slug: string };

  try {
    const post = await fetchPostBySlug(slug);
    if (!post) {
      return { notFound: true };
    }

    const relatedPosts = await fetchRelatedPosts(post);

    return {
      props: {
        post,
        relatedPosts,
      },
    };
  } catch (error) {
    console.error("Error fetching post:", error);
    return {
      props: {
        post: null,
        relatedPosts: [],
      },
    };
  }
};
