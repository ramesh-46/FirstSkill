import { NextResponse } from 'next/server';
import { fetchMovieVideos } from '../../../../../lib/tmdb';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const videos = await fetchMovieVideos(id);
    return NextResponse.json({ results: videos });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to fetch' }, { status: 500 });
  }
}
