export type STTServer = 'openai' | 'browser';

export interface UserTTSConfig {
  openAI: {
    sttModel: 'whisper-1';
    ttsModel: 'tts-1' | 'tts-1-hd' | 'bjornulf_xtts';
  };
  sttAutoStop: boolean;
  sttServer: STTServer;
}
