import { NextRequest, NextResponse } from "next/server";
import { fetchMovieVideos } from "../../../../../lib/tmdb";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Next.js may provide params as a Promise in some runtimes — await it defensively
    const params = await context.params;
    const { id } = params;
    const videos = await fetchMovieVideos(id);

    return NextResponse.json({ results: videos });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to fetch" },
      { status: 500 }
    );
  }
}
