import { NextResponse } from "next/server";
import { getManifest, getItem } from "@/lib/registry";

export async function generateStaticParams() {
  const manifest = await getManifest();
  return manifest.items.map((item) => ({ id: item.id }));
}

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const item = await getItem(id);
  if (!item) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(item, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

