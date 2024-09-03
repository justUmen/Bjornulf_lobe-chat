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

export async function GET(request: Request) {
  console.log(request);
  const voicesDirectory = path.join(process.cwd(), 'public', 'bjornulf_voices');
  const voices: VoiceMap = {};

  for (const language of languages) {
    const languagePath = path.join(voicesDirectory, language.value);

    // Check if directory exists before proceeding
    if (fs.existsSync(languagePath)) {
      const stats = await fs.promises.stat(languagePath);
      if (stats.isDirectory()) {
        const files = await fs.promises.readdir(languagePath);
        const languageVoices = files
          .filter((file) => file.endsWith('.wav'))
          .map((file) => file.replace('.wav', ''));

        if (languageVoices.length > 0) {
          voices[language.value] = languageVoices;
        }
      }
    }
  }

  return Response.json({ voices });
}
