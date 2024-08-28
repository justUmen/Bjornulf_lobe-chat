export const xtts_tts_to_audio = async (input: string): Promise<Response> => {
  const xttsUrl = 'http://localhost:8020/tts_to_audio/';

  try {
    const xttsPayload = {
      language: 'en',
      speaker_wav: 'default',
      text: input,
    };

    console.log('Sending request to XTTS server:', xttsUrl);
    console.log('Payload:', xttsPayload);

    const response = await fetch(xttsUrl, {
      body: JSON.stringify(xttsPayload),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('XTTS server response:', response.status, errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const audioBuffer = await response.arrayBuffer();

    return new Response(audioBuffer, {
      headers: {
        'Content-Type': 'audio/wav',
      },
    });
  } catch (error: any) {
    console.error('Error fetching XTTS audio:', error);
    return new Response(`Error fetching XTTS audio for text: ${input}. Error: ${error.message}`, {
      status: 500,
    });
  }
};

export const xtts_tts_stream = async (input: string): Promise<Response> => {
  const xttsBaseUrl = 'http://localhost:8020/tts_stream';

  try {
    // Prepare query parameters
    const params = new URLSearchParams({
      language: 'en',
      speaker_wav: 'default',
      text: input,
    });

    const xttsUrl = `${xttsBaseUrl}?${params.toString()}`;

    console.log('Sending request to XTTS server:', xttsUrl);

    const response = await fetch(xttsUrl, {
      headers: {
        accept: 'application/json',
      },
      method: 'GET',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('XTTS server response:', response.status, errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    // Create a ReadableStream to pipe the chunks
    const reader = response.body?.getReader();

    if (!reader) {
      throw new Error('Response body is not readable');
    }

    const stream = new ReadableStream({
      async start(controller) {
        const fu = true;
        while (fu) {
          console.log('...');
          const { done, value } = await reader.read();
          if (done) break;
          controller.enqueue(value);
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'audio/wav',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error: any) {
    console.error('Error streaming XTTS audio:', error);
    return new Response(`Error streaming XTTS audio for text: ${input}. Error: ${error.message}`, {
      status: 500,
    });
  }
};
