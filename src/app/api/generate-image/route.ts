import { NextResponse } from 'next/server';
import fetch from 'node-fetch';
import fs from 'node:fs/promises';
import path from 'node:path';

export const runtime = 'nodejs';

const COMFYUI_URL = process.env.COMFYUI_URL || 'http://127.0.0.1:8188';

async function pollForImage(timeout = 60_000) {
  const startTime = Date.now();
  const baseImageUrl = `${COMFYUI_URL}/view?filename=output/BJORNULF_API_LAST_IMAGE.png`;
  let previousImageHash = null;

  while (Date.now() - startTime < timeout) {
    const imageUrl = `${baseImageUrl}&rand=${Math.random()}`;
    try {
      const response = await fetch(imageUrl);
      if (response.ok) {
        const imageBuffer = await response.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', imageBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const currentImageHash = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

        if (previousImageHash !== currentImageHash) {
          if (previousImageHash !== null) {
            return imageUrl;
          }
          previousImageHash = currentImageHash;
        }
      }
    } catch (error) {
      console.log('Polling for image...', error);
    }

    await new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });
  }

  throw new Error('Timeout waiting for new image');
}

async function saveImage(imageUrl: string, imageName: string) {
  const imageResponse = await fetch(imageUrl);
  if (!imageResponse.ok) {
    throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
  }

  const arrayBuffer = await imageResponse.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const publicDir = path.join(process.cwd(), 'public');
  const imagePath = path.join(publicDir, 'generated', imageName);

  await fs.mkdir(path.dirname(imagePath), { recursive: true });
  await fs.writeFile(imagePath, buffer);

  return `/api/serve-image?name=${imageName}`;
}

export async function POST(req: Request) {
  try {
    const requestBody = await req.json();

    // Main request to generate image
    const response = await fetch(`${COMFYUI_URL}/prompt`, {
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}`);
    }

    await response.json();

    const imageUrl = await pollForImage();
    console.log('Success:', imageUrl);

    const imageName = `generated_${Date.now()}.png`;

    const savedImageUrl = await saveImage(imageUrl, imageName);

    return NextResponse.json({
      imageName,
      imageUrl: savedImageUrl,
      success: true,
    });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message, success: false }, { status: 500 });
  }
}
