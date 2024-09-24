import { ModelProviderCard } from '@/types/llm';

// ref https://docs.ai21.com/reference/jamba-15-api-ref
const Ai21: ModelProviderCard = {
  chatModels: [
    {
      displayName: 'Jamba 1.5 Mini',
      enabled: true,
      functionCall: true,
      id: 'jamba-1.5-mini',
      pricing: {
        input: 0.2,
        output: 0.4,
      },
      tokens: 256_000,
    },
    {
      displayName: 'Jamba 1.5 Large',
      enabled: true,
      functionCall: true,
      id: 'jamba-1.5-large',
      pricing: {
        input: 2,
        output: 8,
      },
      tokens: 256_000,
    },
  ],
  checkModel: 'jamba-1.5-mini',
  id: 'ai21',
  modelList: { showModelFetcher: true },
  modelsUrl: 'https://docs.ai21.com/reference',
  name: 'Ai21Labs',
  url: 'https://studio.ai21.com',
};

export default Ai21;
