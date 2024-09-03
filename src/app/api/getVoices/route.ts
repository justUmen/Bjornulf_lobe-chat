import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';

interface VoiceMap {
  [language: string]: string[];
}

interface Language {
  label: string;
  value: string;
}

const languages: Language[] = [
  { label: 'Arabic', value: 'ar' },
  { label: 'Chinese', value: 'zh-cn' },
  { label: 'Czech', value: 'cs' },
  { label: 'Dutch', value: 'nl' },
  { label: 'English', value: 'en' },
  { label: 'French', value: 'fr' },
  { label: 'German', value: 'de' },
  { label: 'Hindi', value: 'hi' },
  { label: 'Hungarian', value: 'hu' },
  { label: 'Italian', value: 'it' },
  { label: 'Japanese', value: 'ja' },
  { label: 'Korean', value: 'ko' },
  { label: 'Polish', value: 'pl' },
  { label: 'Portuguese', value: 'pt' },
  { label: 'Russian', value: 'ru' },
  { label: 'Spanish', value: 'es' },
  { label: 'Turkish', value: 'tr' },
];

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  console.log('GET request received:', request);
  const voicesDirectory = path.join(process.cwd(), 'public', 'bjornulf_voices');
  // console.log('Voices directory:', voicesDirectory);

  const voices: VoiceMap = {};

  try {
    const directoryContents = await fs.promises.readdir(voicesDirectory, { withFileTypes: true });

    for (const dirent of directoryContents) {
      if (dirent.isDirectory()) {
        const languageCode = dirent.name;
        const language = languages.find((lang) => lang.value === languageCode);

        if (language) {
          const languagePath = path.join(voicesDirectory, languageCode);
          // console.log(`Checking language: ${languageCode}, path: ${languagePath}`);

          const files = await fs.promises.readdir(languagePath);
          // console.log(`Files in ${languageCode}:`, files);

          const languageVoices = files
            .filter((file) => file.endsWith('.wav'))
            .map((file) => file.replace('.wav', ''));

          // console.log(`Filtered .wav files for ${languageCode}:`, languageVoices);

          if (languageVoices.length > 0) {
            voices[languageCode] = languageVoices;
            // console.log(`Added voices for ${languageCode}`);
          } else {
            // console.log(`No .wav files found for ${languageCode}`);
          }
        } else {
          console.log(`Unknown language folder: ${languageCode}`);
        }
      }
    }
  } catch (error) {
    console.error('Error reading voices directory:', error);
  }

  console.log('Final voices object:', voices);
  return NextResponse.json(
    { voices },
    {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    },
  );
}
