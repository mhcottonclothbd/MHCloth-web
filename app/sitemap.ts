import { supabase } from "@/lib/supabase";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "https://example.com";

  const staticUrls: MetadataRoute.Sitemap = [
    "/",
    "/home",
    "/shop",
    "/products",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
    "/new-arrivals",
    "/on-sale",
    "/mens",
    "/womens",
    "/kids",
  ].map((p) => ({ url: `${base}${p}`, changeFrequency: "weekly", priority: 0.7 }));

  let productUrls: MetadataRoute.Sitemap = [];
  try {
    const { data: products } = await supabase
      .from("products")
      .select("slug,updated_at,status")
      .eq("status", "active");
    productUrls = (products || []).map((p: any) => ({
      url: `${base}/products/${p.slug}`,
      lastModified: p.updated_at,
      changeFrequency: "daily",
      priority: 0.9,
    }));
  } catch {}

  return [...staticUrls, ...productUrls];
}


