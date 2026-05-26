import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetch("https://api.oyonews.com.ng/wp-json/wp/v2/pages?slug=site-settings&acf_format=standard");
    if (!response.ok) throw new Error("Failed to fetch banner");

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching banner:", error);
    res.status(500).json({ message: "Server error" });
  }
}
