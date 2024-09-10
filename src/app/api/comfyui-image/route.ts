import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');
  const comfyUiUrl = `${process.env.NEXT_PUBLIC_COMFYUI_URL}/view?filename=${filename}`;

  const response = await fetch(comfyUiUrl);
  const blob = await response.blob();

  return new NextResponse(blob, {
    headers: { 'Content-Type': response.headers.get('Content-Type') || 'image/png' },
  });
}
