import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  if (!filename) {
    return new NextResponse('Not Found', { status: 404 });
  }

  // Prevent path traversal attacks by using only the basename
  const safeFilename = require('path').basename(filename);
  const filepath = join(process.cwd(), 'public', 'uploads', safeFilename);

  if (!existsSync(filepath)) {
    return new NextResponse('Not Found', { status: 404 });
  }

  try {
    const fileBuffer = await readFile(filepath);

    // Determine content type based on extension
    let contentType = 'application/octet-stream';
    const lowerFilename = filename.toLowerCase();

    if (lowerFilename.endsWith('.jpg') || lowerFilename.endsWith('.jpeg')) {
      contentType = 'image/jpeg';
    } else if (lowerFilename.endsWith('.png')) {
      contentType = 'image/png';
    } else if (lowerFilename.endsWith('.gif')) {
      contentType = 'image/gif';
    } else if (lowerFilename.endsWith('.webp')) {
      contentType = 'image/webp';
    } else if (lowerFilename.endsWith('.svg')) {
      contentType = 'image/svg+xml';
    }

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error reading file:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
