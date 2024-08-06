//hack to bypass static serving of public for generated image
import { NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const imageName = url.searchParams.get('name');

  if (!imageName) {
    return NextResponse.json({ error: 'Image name is required' }, { status: 400 });
  }

  const publicDir = path.join(process.cwd(), 'public');
  const imagePath = path.join(publicDir, 'generated', imageName);

  try {
    const imageBuffer = await fs.readFile(imagePath);
    const headers = new Headers();
    headers.set('Content-Type', 'image/png');
    headers.set('Cache-Control', 'no-store');

    return new NextResponse(imageBuffer, { headers });
  } catch (error) {
    console.error('Error serving image:', error);
    return NextResponse.json({ error: 'Image not found' }, { status: 404 });
  }
}
