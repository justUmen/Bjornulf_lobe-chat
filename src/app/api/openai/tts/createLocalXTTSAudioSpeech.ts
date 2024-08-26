import type { OpenAITTSPayload } from '@lobehub/tts';
import OpenAI from 'openai';

export interface CreateLocalXTTSAudioSpeechCompletionOptions {
  openai: OpenAI;
  payload: OpenAITTSPayload;
}

export const createLocalXTTSAudioSpeech = async ({
  payload,
}: CreateLocalXTTSAudioSpeechCompletionOptions): Promise<Response> => {
  const xttsUrl = 'http://localhost:8020/tts_to_audio/';

  try {
    const xttsPayload = {
      language: 'en',
      speaker_wav: 'MaryB',
      text: payload.input,
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
    return new Response(
      `Error fetching XTTS audio for text: ${payload.input}. Error: ${error.message}`,
      { status: 500 },
    );
  }
};
