import { ModelProviderCard } from '@/types/llm';

// ref :https://openrouter.ai/docs#models
const OpenRouter: ModelProviderCard = {
  chatModels: [
    {
      description:
        '根据上下文长度、主题和复杂性，你的请求将发送到 Llama 3 70B Instruct、Claude 3.5 Sonnet（自我调节）或 GPT-4o。',
      displayName: 'Auto (best for prompt)',
      enabled: true,
      functionCall: false,
      id: 'openrouter/auto',
      tokens: 128_000,
      vision: false,
    },
    {
      description:
        'o1-mini是一款针对编程、数学和科学应用场景而设计的快速、经济高效的推理模型。该模型具有128K上下文和2023年10月的知识截止日期。',
      displayName: 'OpenAI o1-mini',
      enabled: true,
      id: 'openai/o1-mini',
      maxOutput: 65_536,
      pricing: {
        input: 3,
        output: 12,
      },
      releasedAt: '2024-09-12',
      tokens: 128_000,
    },
    {
      description:
        'o1是OpenAI新的推理模型，适用于需要广泛通用知识的复杂任务。该模型具有128K上下文和2023年10月的知识截止日期。',
      displayName: 'OpenAI o1-preview',
      enabled: true,
      id: 'openai/o1-preview',
      maxOutput: 32_768,
      pricing: {
        input: 15,
        output: 60,
      },
      releasedAt: '2024-09-12',
      tokens: 128_000,
    },
    {
      description:
        'GPT-4o mini是OpenAI在GPT-4 Omni之后推出的最新模型，支持图文输入并输出文本。作为他们最先进的小型模型，它比其他近期的前沿模型便宜很多，并且比GPT-3.5 Turbo便宜超过60%。它保持了最先进的智能，同时具有显著的性价比。GPT-4o mini在MMLU测试中获得了 82% 的得分，目前在聊天偏好上排名高于 GPT-4。',
      displayName: 'GPT-4o mini',
      enabled: true,
      functionCall: true,
      id: 'openai/gpt-4o-mini',
      maxOutput: 16_385,
      pricing: {
        input: 0.15,
        output: 0.6,
      },
      tokens: 128_000,
      vision: true,
    },
    {
      description:
        'ChatGPT-4o 是一款动态模型，实时更新以保持当前最新版本。它结合了强大的语言理解与生成能力，适合于大规模应用场景，包括客户服务、教育和技术支持。',
      displayName: 'GPT-4o 0806',
      enabled: true,
      functionCall: true,
      id: 'openai/gpt-4o-2024-08-06',
      pricing: {
        input: 2.5,
        output: 10,
      },
      tokens: 128_000,
      vision: true,
    },
    {
      description:
        'Claude 3 Haiku 是 Anthropic 的最快且最紧凑的模型，旨在实现近乎即时的响应。它具有快速且准确的定向性能。',
      displayName: 'Claude 3 Haiku',
      enabled: true,
      functionCall: true,
      id: 'anthropic/claude-3-haiku',
      maxOutput: 4096,
      pricing: {
        input: 0.25,
        output: 1.25,
      },
      releasedAt: '2024-03-07',
      tokens: 200_000,
      vision: true,
    },
    {
      description:
        'Claude 3.5 Sonnet 提供了超越 Opus 的能力和比 Sonnet 更快的速度，同时保持与 Sonnet 相同的价格。Sonnet 特别擅长编程、数据科学、视觉处理、代理任务。',
      displayName: 'Claude 3.5 Sonnet',
      enabled: true,
      functionCall: true,
      id: 'anthropic/claude-3.5-sonnet',
      maxOutput: 8192,
      pricing: {
        cachedInput: 0.3,
        input: 3,
        output: 15,
        writeCacheInput: 3.75,
      },
      releasedAt: '2024-06-20',
      tokens: 200_000,
      vision: true,
    },
    {
      description:
        'Claude 3 Opus 是 Anthropic 用于处理高度复杂任务的最强大模型。它在性能、智能、流畅性和理解力方面表现卓越。',
      displayName: 'Claude 3 Opus',
      enabled: true,
      functionCall: true,
      id: 'anthropic/claude-3-opus',
      maxOutput: 4096,
      pricing: {
        input: 15,
        output: 75,
      },
      releasedAt: '2024-02-29',
      tokens: 200_000,
      vision: true,
    },
    {
      description: 'Gemini 1.5 Flash 0827 提供了优化后的多模态处理能力，适用多种复杂任务场景。',
      displayName: 'Gemini 1.5 Flash 0827',
      enabled: true,
      functionCall: true,
      id: 'google/gemini-flash-1.5-exp',
      maxOutput: 8192,
      pricing: {
        cachedInput: 0.018_75,
        input: 0.075,
        output: 0.3,
      },
      releasedAt: '2024-08-27',
      tokens: 1_048_576 + 8192,
      vision: true,
    },
    {
      description: 'Gemini 1.5 Pro 0827 结合最新优化技术，带来更高效的多模态数据处理能力。',
      displayName: 'Gemini 1.5 Pro 0827',
      enabled: true,
      functionCall: true,
      id: 'google/gemini-pro-1.5-exp',
      maxOutput: 8192,
      pricing: {
        cachedInput: 0.875,
        input: 3.5,
        output: 10.5,
      },
      releasedAt: '2024-08-27',
      tokens: 2_097_152 + 8192,
      vision: true,
    },
    {
      description:
        '融合通用与代码能力的全新开源模型, 不仅保留了原有 Chat 模型的通用对话能力和 Coder 模型的强大代码处理能力，还更好地对齐了人类偏好。此外，DeepSeek-V2.5 在写作任务、指令跟随等多个方面也实现了大幅提升。',
      displayName: 'DeepSeek V2.5',
      enabled: true,
      functionCall: true,
      id: 'deepseek/deepseek-chat',
      pricing: {
        cachedInput: 0.014,
        input: 0.14,
        output: 0.28,
      },
      releasedAt: '2024-09-05',
      tokens: 128_000,
    },
    {
      description: 'Qwen2 是全新的大型语言模型系列，具有更强的理解和生成能力。',
      displayName: 'Qwen2 7B (Free)',
      enabled: true,
      id: 'qwen/qwen-2-7b-instruct:free',
      tokens: 32_768,
    },
    {
      description: 'LLaMA 3.1 提供多语言支持，是业界领先的生成模型之一。',
      displayName: 'Llama 3.1 8B (Free)',
      enabled: true,
      id: 'meta-llama/llama-3.1-8b-instruct:free',
      tokens: 32_768,
    },
    {
      description: 'Gemma 2 是Google轻量化的开源文本模型系列。',
      displayName: 'Gemma 2 9B (Free)',
      enabled: true,
      id: 'google/gemma-2-9b-it:free',
      tokens: 8192,
    },
  ],
  checkModel: 'google/gemma-2-9b-it:free',
  description:
    'OpenRouter 是一个提供多种前沿大模型接口的服务平台，支持 OpenAI、Anthropic、LLaMA 及更多，适合多样化的开发和应用需求。用户可根据自身需求灵活选择最优的模型和价格，助力AI体验的提升。',
  id: 'openrouter',
  modelList: { showModelFetcher: true },
  modelsUrl: 'https://openrouter.ai/models',
  name: 'OpenRouter',
  url: 'https://openrouter.ai',
};

export default OpenRouter;
