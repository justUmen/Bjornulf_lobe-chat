import { ModelProviderCard } from '@/types/llm';

// ref: https://www.xfyun.cn/doc/spark/HTTP%E8%B0%83%E7%94%A8%E6%96%87%E6%A1%A3.html#_3-%E8%AF%B7%E6%B1%82%E8%AF%B4%E6%98%8E
// ref: https://www.xfyun.cn/doc/spark/Web.html#_1-%E6%8E%A5%E5%8F%A3%E8%AF%B4%E6%98%8E
const Spark: ModelProviderCard = {
  chatModels: [
    {
      description:
        'Spark Lite 是一款轻量级大语言模型，具备极低的延迟与高效的处理能力，完全免费开放，支持实时在线搜索功能。其快速响应的特性使其在低算力设备上的推理应用和模型微调中表现出色，为用户带来出色的成本效益和智能体验，尤其在知识问答、内容生成及搜索场景下表现不俗。',
      displayName: 'Spark Lite',
      enabled: true,
      functionCall: false,
      id: 'general',
      maxOutput: 4096,
      tokens: 8192,
    },
    {
      description:
        'Spark Pro 是一款为专业领域优化的高性能大语言模型，专注数学、编程、医疗、教育等多个领域，并支持联网搜索及内置天气、日期等插件。其优化后模型在复杂知识问答、语言理解及高层次文本创作中展现出色表现和高效性能，是适合专业应用场景的理想选择。',
      displayName: 'Spark Pro',
      enabled: true,
      functionCall: false,
      id: 'generalv3',
      maxOutput: 8192,
      tokens: 8192,
    },
    {
      description:
        'Spark Pro-128K 配置了特大上下文处理能力，能够处理多达128K的上下文信息，特别适合需通篇分析和长期逻辑关联处理的长文内容，可在复杂文本沟通中提供流畅一致的逻辑与多样的引用支持。',
      displayName: 'Spark Pro-128K',
      enabled: true,
      functionCall: false,
      id: 'Pro-128k',
      maxOutput: 4096,
      tokens: 128_000,
    },
    {
      description:
        'Spark3.5 Max 为功能最为全面的版本，支持联网搜索及众多内置插件。其全面优化的核心能力以及系统角色设定和函数调用功能，使其在各种复杂应用场景中的表现极为优异和出色。',
      displayName: 'Spark3.5 Max',
      enabled: true,
      functionCall: false,
      id: 'generalv3.5',
      maxOutput: 8192,
      tokens: 8192,
    },
    {
      description:
        'Spark4.0 Ultra 是星火大模型系列中最为强大的版本，在升级联网搜索链路同时，提升对文本内容的理解和总结能力。它是用于提升办公生产力和准确响应需求的全方位解决方案，是引领行业的智能产品。',
      displayName: 'Spark4.0 Ultra',
      enabled: true,
      functionCall: false,
      id: '4.0Ultra',
      maxOutput: 8192,
      tokens: 8192,
    },
  ],
  checkModel: 'general',
  description:
    '科大讯飞星火大模型提供多领域、多语言的强大 AI 能力，利用先进的自然语言处理技术，构建适用于智能硬件、智慧医疗、智慧金融等多种垂直场景的创新应用。',
  id: 'spark',
  modelList: { showModelFetcher: true },
  modelsUrl: 'https://xinghuo.xfyun.cn/spark',
  name: 'Spark',
  smoothing: {
    speed: 2,
    text: true,
  },
  url: 'https://www.xfyun.cn',
};

export default Spark;
