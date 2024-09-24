import OpenAI from 'openai';

import { ILobeAgentRuntimeErrorType } from '../error';
import { ChatStreamPayload } from './chat';

export interface AgentInitErrorPayload {
  error: object;
  errorType: string | number;
}

export interface ChatCompletionErrorPayload {
  [key: string]: any;
  endpoint?: string;
  error: object;
  errorType: ILobeAgentRuntimeErrorType;
  provider: ModelProvider;
}

export interface CreateChatCompletionOptions {
  chatModel: OpenAI;
  payload: ChatStreamPayload;
}

export enum ModelProvider {
  Ai21 = 'ai21',
  Ai360 = 'ai360',
  Anthropic = 'anthropic',
  Azure = 'azure',
  Baichuan = 'baichuan',
  Bedrock = 'bedrock',
  DeepSeek = 'deepseek',
  FireworksAI = 'fireworksai',
  Github = 'github',
  Google = 'google',
  Groq = 'groq',
  Minimax = 'minimax',
  Mistral = 'mistral',
  Moonshot = 'moonshot',
  Novita = 'novita',
  Ollama = 'ollama',
  OpenAI = 'openai',
  OpenRouter = 'openrouter',
  Perplexity = 'perplexity',
  Qwen = 'qwen',
  SiliconCloud = 'siliconcloud',
  Spark = 'spark',
  Stepfun = 'stepfun',
  Taichu = 'taichu',
  TogetherAI = 'togetherai',
  Upstage = 'upstage',
  ZeroOne = 'zeroone',
  ZhiPu = 'zhipu',
}

export type ModelProviderKey = Lowercase<keyof typeof ModelProvider>;
