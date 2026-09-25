import Head from "next/head";
import React from "react";

export interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: "website" | "article" | "product";
  keywords?: string[];
  noindex?: boolean;
  jsonLd?: Record<string, any> | Array<Record<string, any>>;
}

const DEFAULT_TITLE = "FutureNature | 100% Pure Raw Honey & Artisanal Botanical Harvests";
const DEFAULT_DESCRIPTION =
  "Discover 100% pure, unheated, single-origin raw honey and handcrafted botanical blends from the Western Ghats of Tamil Nadu. FSSAI certified ethical apiculture.";
const DEFAULT_OG_IMAGE = "https://futurenature.s3.ap-south-1.amazonaws.com/others/About+us.png";
const SITE_URL = "https://futurenature.in";

export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = "website",
  keywords = [
    "raw honey",
    "pure honey",
    "organic raw honey",
    "unpasteurized honey",
    "wild honey Tamil Nadu",
    "Western Ghats honey",
    "ethical beekeeping",
    "single origin honey",
    "FSSAI certified raw honey",
    "FutureNature",
  ],
  noindex = false,
  jsonLd,
}: SEOProps) {
  const fullTitle = title
    ? `${title} | FutureNature`
    : DEFAULT_TITLE;

  const currentUrl = canonical
    ? canonical.startsWith("http")
      ? canonical
      : `${SITE_URL}${canonical}`
    : SITE_URL;

  const imageUrl = ogImage.startsWith("http") ? ogImage : `${SITE_URL}${ogImage}`;

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      {keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(", ")} />
      )}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta name="theme-color" content="#FAF0E6" />
      <meta name="author" content="FutureNature Apiaries" />
      <meta name="language" content="English" />

      {/* Robots */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
      )}

      {/* Canonical Link */}
      <link rel="canonical" href={currentUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:site_name" content="FutureNature" />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:site" content="@FutureNature" />
      <meta name="twitter:creator" content="@FutureNature" />

      {/* Structured Data (JSON-LD) */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
      )}
    </Head>
  );
}
