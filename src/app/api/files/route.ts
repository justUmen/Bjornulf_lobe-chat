import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';

export const runtime = 'nodejs';

const NOT_S3_FOLDER = path.join(process.cwd(), 'public', 'NOT_S3');

async function ensureDirectoryExists(dirPath: string) {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, content, fileType } = await req.json();
    const id = Date.now().toString();
    const filePath = path.join(NOT_S3_FOLDER, id);

    await ensureDirectoryExists(NOT_S3_FOLDER);
    await fs.writeFile(filePath, content);

    return NextResponse.json({
      fileType,
      id,
      name,
      success: true,
      url: `/NOT_S3/${id}`,
    });
  } catch (error) {
    console.error('Error creating file:', error);
    return NextResponse.json({ error: 'Failed to create file', success: false }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'File ID is required', success: false }, { status: 400 });
    }

    const filePath = path.join(NOT_S3_FOLDER, id);
    const stats = await fs.stat(filePath);
    const name = path.basename(filePath);

    return NextResponse.json({
      fileType: path.extname(name).slice(1),
      id,
      name,
      saveMode: 'url',
      size: stats.size,
      success: true,
      url: `/NOT_S3/${id}`,
    });
  } catch (error) {
    console.error('Error retrieving file:', error);
    return NextResponse.json({ error: 'File not found', success: false }, { status: 404 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'File ID is required', success: false }, { status: 400 });
    }

    const filePath = path.join(NOT_S3_FOLDER, id);
    await fs.unlink(filePath);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json({ error: 'Failed to delete file', success: false }, { status: 500 });
  }
}
