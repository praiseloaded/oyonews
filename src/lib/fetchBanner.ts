// lib/fetchBanner.ts
export async function fetchBanner() {
  const res = await fetch(
    "https://api.oyonews.com.ng/wp-json/wp/v2/pages?slug=site-settings&acf_format=standard"
  );
  const data = await res.json();
  return data[0]?.acf ?? null;
}
