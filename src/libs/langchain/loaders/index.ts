import {
  SupportedTextSplitterLanguage,
  SupportedTextSplitterLanguages,
} from 'langchain/text_splitter';

import { LANGCHAIN_SUPPORT_TEXT_LIST } from '@/libs/langchain/file';
import { LangChainLoaderType } from '@/libs/langchain/types';

import { CodeLoader } from './code';
import { DocxLoader } from './docx';
import { MarkdownLoader } from './markdown';
import { PdfLoader } from './pdf';
import { PPTXLoader } from './pptx';
import { TextLoader } from './txt';

class LangChainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LangChainChunkingError';
  }
}

export class ChunkingLoader {
  partitionContent = async (filename: string, content: Uint8Array) => {
    try {
      const fileBlob = new Blob([Buffer.from(content)]);
      const txt = this.uint8ArrayToString(content);

      const type = this.getType(filename);

      switch (type) {
        case 'code': {
          const ext = filename.split('.').pop();
          return await CodeLoader(txt, ext!);
        }

        case 'ppt': {
          return await PPTXLoader(fileBlob);
        }

        case 'pdf': {
          return await PdfLoader(fileBlob);
        }

        case 'markdown': {
          return await MarkdownLoader(txt);
        }

        case 'doc': {
          return await DocxLoader(fileBlob);
        }

        case 'text': {
          return await TextLoader(txt);
        }

        default: {
          throw new Error(
            'Unsupported file type, please check your file is a supported type, or just create an issue.',
          );
        }
      }
    } catch (e) {
      throw new LangChainError((e as Error).message);
    }
  };

  private getType = (filename: string): LangChainLoaderType | undefined => {
    if (filename.endsWith('pptx')) {
      return 'ppt';
    }

    if (filename.endsWith('docx') || filename.endsWith('doc')) {
      return 'doc';
    }

    if (filename.endsWith('pdf')) {
      return 'pdf';
    }

    if (filename.endsWith('md') || filename.endsWith('mdx')) {
      return 'markdown';
    }

    const ext = filename.split('.').pop();

    if (ext && SupportedTextSplitterLanguages.includes(ext as SupportedTextSplitterLanguage)) {
      return 'code';
    }

    if (ext && LANGCHAIN_SUPPORT_TEXT_LIST.includes(ext)) return 'text';
  };

  private uint8ArrayToString(uint8Array: Uint8Array) {
    const decoder = new TextDecoder();
    return decoder.decode(uint8Array);
  }
}
