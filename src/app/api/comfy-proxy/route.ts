import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const comfyUiUrl = process.env.NEXT_PUBLIC_COMFYUI_URL + '/prompt';
  const response = await fetch(comfyUiUrl, {
    body: JSON.stringify(await request.json()),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });

  return NextResponse.json(await response.json());
}
