import { ModelProvider } from '../types';
import { LobeOpenAICompatibleFactory } from '../utils/openaiCompatibleFactory';

export const LobeSiliconCloudAI = LobeOpenAICompatibleFactory({
  baseURL: 'https://api.siliconflow.cn/v1',
  debug: {
    chatCompletion: () => process.env.DEBUG_SILICONCLOUD_CHAT_COMPLETION === '1',
  },
  provider: ModelProvider.SiliconCloud,
});
