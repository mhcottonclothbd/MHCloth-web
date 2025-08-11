import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

// Facebook Catalog Feed (CSV)
// Fields: id,title,description,availability,condition,price,link,image_link,brand

export async function GET() {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL || "https://example.com";

    const { data: products, error } = await supabase
      .from("products")
      .select("id,slug,name,description,price,is_on_sale,sale_price,image_urls,image_url,brand,status,stock_quantity")
      .eq("status", "active");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const rows: string[] = [];
    // header
    rows.push([
      "id",
      "title",
      "description",
      "availability",
      "condition",
      "price",
      "link",
      "image_link",
      "brand",
    ].join(","));

    (products || []).forEach((p: any) => {
      const availability = (p.stock_quantity ?? 0) > 0 ? "in stock" : "out of stock";
      const price = (p.sale_price && p.sale_price > 0 ? p.sale_price : p.price) + " BDT";
      const link = `${base}/products/${p.slug || p.id}`;
      const image = Array.isArray(p.image_urls) && p.image_urls.length > 0 ? p.image_urls[0] : (p.image_url || "");
      const safe = (s: string | null | undefined) =>
        (s || "").replace(/"/g, '""').replace(/[\r\n]+/g, " ");
      const cells = [
        p.id,
        safe(p.name),
        safe(p.description),
        availability,
        "new",
        price,
        link,
        image,
        safe(p.brand),
      ];
      rows.push(cells.map((c) => (c?.toString().includes(",") ? `"${c}"` : c)).join(","));
    });

    const body = rows.join("\n");
    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to build feed" }, { status: 500 });
  }
}


