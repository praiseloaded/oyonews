import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useEffect } from "react";
import { AuthProvider } from "@/context/AuthContext";
import RouteChangeLoader from "@/components/RouteChangeLoader";
import Layout from "@/components/Layout";

declare global {
  interface Window {
    _mgq?: unknown[]; 
  }
}

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window._mgq = window._mgq || [];
      window._mgq.push(["_mgc.load"]);
    }
  }, []);

  return (
    <AuthProvider>
      <Head>
        {/* ✅ AdsKeeper Loader Script */}
        <script
          src="https://jsc.adskeeper.com/site/1020213.js"
          async
        ></script>
      </Head>
      <RouteChangeLoader />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  );
}
