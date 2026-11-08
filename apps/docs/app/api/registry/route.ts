import { NextResponse } from "next/server";
import { getManifest } from "@/lib/registry";

export async function GET() {
  const manifest = await getManifest();
  return NextResponse.json(manifest, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

