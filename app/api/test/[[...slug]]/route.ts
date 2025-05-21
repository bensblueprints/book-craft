import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug?: string[] } }
) {
  const slug = params.slug || [];

  return NextResponse.json({
    slug,
    message: "This is a dynamic catch-all API route in App Router",
  });
}
