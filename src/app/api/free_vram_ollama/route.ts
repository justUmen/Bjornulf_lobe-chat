// app/api/free_vram_ollama/route.ts
import { NextRequest, NextResponse } from 'next/server';

const DEFAULT_BASE_URL = 'http://127.0.0.1:11434';

export async function POST(request: NextRequest) {
  console.log('POST request received'); // Log the POST request

  try {
    // Extract baseURL and model from the request body
    const { baseURL = DEFAULT_BASE_URL, model } = await request.json();
    console.log('Using baseURL:', baseURL); // Log the baseURL
    console.log('Using model:', model); // Log the model name being used

    // Make the request to the external Ollama API using the provided model
    const response = await fetch(`${baseURL}/api/generate`, {
      body: JSON.stringify({
        keep_alive: 0,
        model: model, // Use the model from the request body
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    console.log('Ollama response status:', response.status); // Log the response status

    // If the response is not okay, throw an error
    if (!response.ok) {
      throw new Error(`Ollama HTTP error! status: ${response.status}`);
    }

    // Parse the response from the Ollama API
    const data = await response.json();
    console.log('Ollama response data:', data); // Log the response data

    // Return the successful response
    return NextResponse.json({ data, message: 'VRAM freed successfully' });
  } catch (error) {
    console.error('Error freeing VRAM:', error); // Log the error

    // Return a 500 response in case of failure
    return NextResponse.json({ error: 'Failed to free VRAM' }, { status: 500 });
  }
}
