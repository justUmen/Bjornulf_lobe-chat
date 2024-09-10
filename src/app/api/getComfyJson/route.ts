import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  console.log('GET request received:', request);
  const apiDirectory = path.join(process.cwd(), 'public', 'Bjornulf_API');
  let jsonFiles: string[] = [];

  try {
    if (fs.existsSync(apiDirectory)) {
      const stats = await fs.promises.stat(apiDirectory);
      if (stats.isDirectory()) {
        const files = await fs.promises.readdir(apiDirectory);
        jsonFiles = files.filter((file) => file.endsWith('.json'));
      }
    }
  } catch (error) {
    console.error('Error reading API directory:', error);
  }

  return NextResponse.json(
    { jsonFiles },
    {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    },
  );
}
