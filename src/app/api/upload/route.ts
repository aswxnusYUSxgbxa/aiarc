import { NextResponse, NextRequest } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { auth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const client = await clientPromise;
    const db = client.db();

    // Store in MongoDB
    const result = await db.collection('images').insertOne({
      name: file.name,
      type: file.type,
      data: buffer,
      createdAt: new Date(),
    });

    // Return the URL for the frontend to use
    const url = `/api/images/${result.insertedId}`;

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
