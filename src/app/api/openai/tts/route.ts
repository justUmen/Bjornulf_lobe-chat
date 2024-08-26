import { OpenAITTSPayload } from '@lobehub/tts';
import { createOpenaiAudioSpeech } from '@lobehub/tts/server';

// import OpenAI from 'openai';
import { createBizOpenAI } from '@/app/api/openai/createBizOpenAI';

import { createLocalXTTSAudioSpeech } from './createLocalXTTSAudioSpeech';

export const runtime = 'edge';

export const preferredRegion = [
  'arn1',
  'bom1',
  'cdg1',
  'cle1',
  'cpt1',
  'dub1',
  'fra1',
  'gru1',
  'hnd1',
  'iad1',
  'icn1',
  'kix1',
  'lhr1',
  'pdx1',
  'sfo1',
  'sin1',
  'syd1',
];

export const POST = async (req: Request) => {
  const openaiOrErrResponse = createBizOpenAI(req);

  if (openaiOrErrResponse instanceof Response) return openaiOrErrResponse;
  const payload = (await req.json()) as OpenAITTSPayload;
  console.log('TTS payload.input :', payload.input);

  if (payload.options.model === 'bjornulf_xtts') {
    return await createLocalXTTSAudioSpeech({ openai: openaiOrErrResponse, payload });
  }

  return await createOpenaiAudioSpeech({ openai: openaiOrErrResponse, payload });
};
