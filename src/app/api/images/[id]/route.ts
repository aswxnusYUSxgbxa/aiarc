import { NextResponse, NextRequest } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const image = await db.collection('images').findOne({ _id: new ObjectId(id) });

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    const headers = new Headers();
    headers.set('Content-Type', image.type || 'image/jpeg');
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');

    return new NextResponse(image.data.buffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Error fetching image:', error);
    return NextResponse.json({ error: 'Failed to fetch image' }, { status: 500 });
  }
}
