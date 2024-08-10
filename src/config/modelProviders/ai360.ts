import { ModelProviderCard } from '@/types/llm';

// ref https://ai.360.cn/platform/docs/overview
const Ai360: ModelProviderCard = {
  chatModels: [
    {
      displayName: '360GPT2 Pro',
      enabled: true,
      functionCall: false,
      id: '360gpt2-pro',
      maxOutput: 7000,
      tokens: 8192,
    },
    {
      displayName: '360GPT Pro',
      functionCall: false,
      id: '360gpt-pro',
      maxOutput: 7000,
      tokens: 8192,
    },
    {
      displayName: '360GPT Pro Perf',
      functionCall: false,
      id: '360gpt-pro-perf',
      maxOutput: 7000,
      tokens: 8192,
    },
    {
      displayName: '360GPT Pro sc202401v3',
      functionCall: false,
      id: '360gpt-pro-sc202401v3',
      maxOutput: 2048,
      tokens: 4096,
    },
    {
      displayName: '360GPT Pro sc202401v2',
      functionCall: false,
      id: '360gpt-pro-sc202401v2',
      maxOutput: 2048,
      tokens: 4096,
    },
    {
      displayName: '360GPT Pro sc202401v1',
      functionCall: false,
      id: '360gpt-pro-sc202401v1',
      maxOutput: 2048,
      tokens: 4096,
    },
    {
      displayName: '360GPT Pro v2.0.3',
      functionCall: false,
      id: '360gpt-pro-v2.0.3',
      maxOutput: 2048,
      tokens: 4096,
    },
    {
      displayName: '360GPT Turbo',
      enabled: true,
      functionCall: false,
      id: '360gpt-turbo',
      maxOutput: 8192,
      tokens: 8192,
    },
    {
      displayName: '360GPT Turbo Responsibility 8K',
      enabled: true,
      functionCall: false,
      id: '360gpt-turbo-responsibility-8k',
      maxOutput: 2048,
      tokens: 8192,
    },
    {
      displayName: '360GPT Turbo 32K Responsibility 240530',
      functionCall: false,
      id: '360gpt-turbo-32k-responsibility-240530',
      maxOutput: 32_000,
      tokens: 32_000,
    },
    {
      displayName: '360GPT Turbo 32K Responsibility 240516',
      functionCall: false,
      id: '360gpt-turbo-32k-responsibility-240516',
      maxOutput: 32_000,
      tokens: 32_000,
    },
    {
      displayName: '360GPT_S1_QIYUAN',
      functionCall: false,
      id: '360GPT_S1_QIYUAN',
      maxOutput: 2048,
      tokens: 4096,
    },
    {
      displayName: '360GPT_S2_V9',
      functionCall: false,
      id: '360GPT_S2_V9',
      maxOutput: 7000,
      tokens: 8192,
    },
  ],
  checkModel: '360gpt-turbo',
  disableBrowserRequest: true,
  id: 'ai360',
  modelList: { showModelFetcher: true },
  name: '360智脑',
};

export default Ai360;
