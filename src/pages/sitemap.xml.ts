import { GetServerSideProps } from "next";
import axios from "axios";

const BASE_URL = "https://futurenature.in";
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081/api";

function generateSiteMap(productIds: string[]) {
  const currentDate = new Date().toISOString();

  const staticPages = [
    { url: "", changefreq: "daily", priority: "1.0" },
    { url: "/products", changefreq: "daily", priority: "0.9" },
    { url: "/about", changefreq: "monthly", priority: "0.8" },
    { url: "/blog", changefreq: "weekly", priority: "0.8" },
    { url: "/contact", changefreq: "monthly", priority: "0.7" },
    { url: "/privacy-policy", changefreq: "yearly", priority: "0.3" },
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Static Pages -->
  ${staticPages
    .map(({ url, changefreq, priority }) => {
      return `
    <url>
      <loc>${BASE_URL}${url}</loc>
      <lastmod>${currentDate}</lastmod>
      <changefreq>${changefreq}</changefreq>
      <priority>${priority}</priority>
    </url>
  `;
    })
    .join("")}

  <!-- Dynamic Product Pages -->
  ${productIds
    .map((id) => {
      return `
    <url>
      <loc>${BASE_URL}/details/${id}</loc>
      <lastmod>${currentDate}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.85</priority>
    </url>
  `;
    })
    .join("")}
</urlset>`;
}

export default function SiteMap() {
  // getServerSideProps handles the response
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  let productIds: string[] = [];

  try {
    const response = await axios.get(`${BACKEND_URL}/product/products`, {
      timeout: 3000,
    });
    if (response.data && response.data.status && Array.isArray(response.data.data)) {
      productIds = response.data.data
        .filter((p: any) => !p.isDeleted)
        .map((p: any) => p.id);
    }
  } catch (e) {
    console.error("Sitemap failed to fetch dynamic products:", e);
  }

  const sitemap = generateSiteMap(productIds);

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};
