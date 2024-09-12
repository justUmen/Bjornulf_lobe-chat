import { ModelProviderCard } from '@/types/llm';

// ref :https://platform.lingyiwanwu.com/docs#%E6%A8%A1%E5%9E%8B
const ZeroOne: ModelProviderCard = {
  chatModels: [
    {
      description: '全新千亿参数模型，提供超强问答及文本生成能力。',
      displayName: 'Yi Large',
      enabled: true,
      id: 'yi-large',
      tokens: 32_768,
    },
    {
      description:
        '在 yi-large 模型的基础上支持并强化了工具调用的能力，适用于各种需要搭建 agent 或 workflow 的业务场景。',
      displayName: 'Yi Large FC',
      enabled: true,
      functionCall: true,
      id: 'yi-large-fc',
      tokens: 32_768,
    },
    {
      description:
        '基于 yi-large 超强模型的高阶服务，结合检索与生成技术提供精准答案，实时全网检索信息服务。',
      displayName: 'Yi Large RAG',
      enabled: true,
      id: 'yi-large-rag',
      tokens: 16_384,
    },
    {
      description: '超高性价比、卓越性能。根据性能和推理速度、成本，进行平衡性高精度调优。',
      displayName: 'Yi Large Turbo',
      enabled: true,
      id: 'yi-large-turbo',
      tokens: 16_384,
    },
    {
      description: '中型尺寸模型升级微调，能力均衡，性价比高。深度优化指令遵循能力。',
      displayName: 'Yi Medium',
      enabled: true,
      id: 'yi-medium',
      tokens: 16_384,
    },
    {
      description: '200K 超长上下文窗口，提供长文本深度理解和生成能力。',
      displayName: 'Yi Medium 200K',
      enabled: true,
      id: 'yi-medium-200k',
      tokens: 200_000,
    },
    {
      description: '小而精悍，轻量极速模型。提供强化数学运算和代码编写能力。',
      displayName: 'Yi Spark',
      enabled: true,
      id: 'yi-spark',
      tokens: 16_384,
    },
    {
      description: '复杂视觉任务模型，提供高性能图片理解、分析能力。',
      displayName: 'Yi Vision',
      enabled: true,
      id: 'yi-vision',
      tokens: 16_384,
      vision: true,
    },
    {
      description: '初期版本，推荐使用 yi-large（新版本）',
      displayName: 'Yi Large Preview',
      id: 'yi-large-preview',
      tokens: 16_384,
    },
  ],
  checkModel: 'yi-spark',
  description:
    '01.AI 专注于AI 2.0时代的人工智能技术，大力推动“人+人工智能”的创新和应用，采用超强大模型和先进AI技术以提升人类生产力，实现技术赋能。',
  id: 'zeroone',
  modelsUrl: 'https://platform.lingyiwanwu.com/docs',
  name: '01.AI',
  url: 'https://01.ai',
};

export default ZeroOne;
