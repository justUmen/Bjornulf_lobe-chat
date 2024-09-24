import { ActionIcon, Modal } from '@lobehub/ui';
import { Select, message } from 'antd';
import { Camera, Settings, Trash } from 'lucide-react';
import { memo, useCallback, useEffect, useState } from 'react';

import { useAgentStore } from '@/store/agent';
import { agentSelectors } from '@/store/agent/selectors';
import { useChatStore } from '@/store/chat';
import { chatSelectors } from '@/store/chat/selectors';
import { useUserStore } from '@/store/user';
import { keyVaultsConfigSelectors } from '@/store/user/selectors';

import BjornulfVoices from './BjornulfVoices';

// import { Ollama as OllamaBrowser } from 'ollama/browser';
// import { ollamaService } from '@/services/ollama';
// import ollama from 'ollama'

// Types
interface Inputs {
  [key: string]: any;
  clip?: (string | number)[];
  text?: string;
}

interface Node {
  _meta?: { title: string };
  class_type?: string;
  inputs: Inputs;
}

interface PromptData {
  [key: string]: Node;
}

// const COMFYUI_URL = process.env.NEXT_PUBLIC_COMFYUI_URL || 'http://127.0.0.1:8188';

// Helper Functions
// const pollForImage = async () => {
//   const baseImageUrl = COMFYUI_URL + '/view?filename=output/BJORNULF_API_LAST_IMAGE.png';
//   let previousImageHash = null;
//   let retries = 0;
//   const maxRetries = 300;

//   while (retries < maxRetries) {
//     const imageUrl = `${baseImageUrl}&rand=${Math.random()}`;
//     try {
//       const response = await fetch(imageUrl);
//       if (response.ok) {
//         const imageBlob = await response.blob();
//         const imageArrayBuffer = await imageBlob.arrayBuffer();
//         const hashBuffer = await crypto.subtle.digest('SHA-256', imageArrayBuffer);
//         const hashArray = Array.from(new Uint8Array(hashBuffer));
//         const currentImageHash = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

//         if (previousImageHash !== currentImageHash) {
//           if (previousImageHash !== null) {
//             return imageUrl;
//           }
//           previousImageHash = currentImageHash;
//         }
//       }
//     } catch (error) {
//       console.log('Polling for image...', error);
//     }

//     retries++;
//     await new Promise<void>((resolve) => {
//       setTimeout(() => {
//         resolve();
//       }, 2000);
//     });
//   }

//   throw new Error('Timeout waiting for new image');
// };

// Main Component
const Comfy = memo(() => {
  // State
  const [promptData, setPromptData] = useState<PromptData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiUrl, setApiUrl] = useState(
    () => localStorage.getItem('selectedApi') || 'sd1.5_picxReal_10',
  );
  const [showApiSelect, setShowApiSelect] = useState(false);
  const [availableApis, setAvailableApis] = useState<string[]>([]);

  // Chat Store
  const [, inputMessage, updateInputMessage] = useChatStore((s) => [
    chatSelectors.isAIGenerating(s),
    s.inputMessage,
    s.updateInputMessage,
  ]);
  const addAIMessage = useChatStore((s) => s.addAIMessage);

  // Function to abort the Ollama request and free VRAM
  // const freeVramOllama = useCallback(() => {
  //   try {
  //     // Initialize OllamaBrowser only when the button is clicked
  //     const config = keyVaultsConfigSelectors.ollamaConfig(useUserStore.getState());
  //     const ollamaClient = new OllamaBrowser({ host: config.baseURL });

  //     // Call abort to free VRAM
  //     ollamaClient.abort();
  //     console.log('Ollama request aborted, VRAM freed.');
  //     message.success('Ollama VRAM successfully cleared!');
  //   } catch (error) {
  //     console.error('Failed to free Ollama VRAM:', error);
  //     message.error('Failed to clear Ollama VRAM.');
  //   }
  // }, []);

  const freeVramOllama = useCallback(() => {
    console.log('freeVramOllama called');

    async function freeVram() {
      try {
        const model = agentSelectors.currentAgentModel(useAgentStore.getState());
        console.log('freeVram function started');
        const config = keyVaultsConfigSelectors.ollamaConfig(useUserStore.getState());
        const baseURL = config.baseURL || 'http://127.0.0.1:11434';

        // Get the current model from the agent store

        console.log('Using baseURL:', baseURL);
        console.log('Using model:', model);

        const response = await fetch('/api/free_vram_ollama', {
          body: JSON.stringify({ baseURL, model }),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        });

        console.log('Response received:', response.status);

        const data = await response.json();
        if (!response.ok) {
          throw new Error(
            `HTTP error! status: ${response.status}, message: ${JSON.stringify(data)}`,
          );
        }
        console.log('VRAM freed successfully:', data);
      } catch (error) {
        console.error('Error freeing Ollama VRAM:', error);
      }
    }

    freeVram();
  }, []);

  // API Functions
  const fetchAvailableApis = useCallback(async () => {
    const response = await fetch('/api/getComfyJson');
    const data = await response.json();
    setAvailableApis(data.jsonFiles.map((file: string) => file.replace('.json', '')));
  }, []);

  const fetchPromptData = useCallback(() => {
    console.log(apiUrl);
    fetch('Bjornulf_API/' + apiUrl + '.json')
      .then((response) => response.json())
      .then((data) => {
        setPromptData(data as PromptData);
        // message.success('ComfyUI JSON is valid : ' + apiUrl);
        // setShowApiInput(false);
      });
  }, [apiUrl]);

  // Effects
  useEffect(() => {
    fetchAvailableApis();
  }, [fetchAvailableApis]);

  useEffect(() => {
    fetchPromptData();
  }, [fetchPromptData]);

  // Handlers
  const sendToComfyUI = useCallback(async () => {
    if (promptData && inputMessage.trim() !== '') {
      const seed = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);

      // Create a deep copy of promptData using structuredClone
      const updatedPromptData = structuredClone(promptData);

      if (apiUrl.startsWith('flux_')) {
        // Find the key that contains 'noise_seed' in its inputs
        const noiseInputKey = Object.keys(updatedPromptData).find(
          (key) => updatedPromptData[key].inputs && 'noise_seed' in updatedPromptData[key].inputs,
        );

        if (noiseInputKey) {
          updatedPromptData[noiseInputKey].inputs.noise_seed = seed;
        }
      } else {
        // Replace all occurrences of 'seed' in inputs with the new random seed
        Object.keys(updatedPromptData).forEach((key) => {
          if (updatedPromptData[key].inputs && 'seed' in updatedPromptData[key].inputs) {
            updatedPromptData[key].inputs.seed = seed;
          }
        });
      }

      // Set the text input by finding the object with "BJORNULF_LOBECHAT_PROMPT"
      const textInputKey = Object.keys(updatedPromptData).find(
        (key) =>
          updatedPromptData[key].inputs &&
          updatedPromptData[key].inputs.text === 'BJORNULF_LOBECHAT_PROMPT',
      );

      if (textInputKey) {
        updatedPromptData[textInputKey].inputs.text = inputMessage;
      }

      const requestBody = JSON.stringify({ prompt: updatedPromptData });
      console.log('requestBody (sendToComfyUI) :', requestBody);

      setIsLoading(true);
      try {
        message.loading('Generating image... Please wait');

        const response = await fetch('/api/generate-image', {
          body: requestBody,
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        });

        if (!response.ok) {
          throw new Error('Failed to generate image');
        }

        const data = await response.json();

        if (data.success) {
          // const text_of_image = "Image : " + inputMessage;
          const text_of_image = inputMessage;
          const markdownImage = `![Generated Image](${data.imageUrl})\n${text_of_image}`;

          // updateInputMessage("New image : " + inputMessage);
          message.success('Image generated successfully!');
          updateInputMessage(markdownImage);
          // await addAIMessage();
          // updateInputMessage(text_of_image);
          await addAIMessage();
          updateInputMessage('');
        } else {
          throw new Error(data.error || 'Unknown error occurred');
        }
      } catch (error) {
        console.error('Error:', error);
        message.error('Failed to generate or save image.');
      } finally {
        setIsLoading(false);
      }
    }
  }, [promptData, inputMessage, addAIMessage, updateInputMessage]);

  const handleApiChange = (value: string) => {
    setApiUrl(value);
    localStorage.setItem('selectedApi', value);
    fetchPromptData();
  };

  // Render
  return (
    <div style={{ alignItems: 'center', display: 'flex' }}>
      <BjornulfVoices
        isLoading={false}
        onLanguageSelect={(language) => console.log('Selected language:', language)}
        onVoiceSelect={(voice) => console.log('Selected voice:', voice)}
      />
      <ActionIcon
        icon={Trash}
        onClick={() => freeVramOllama()}
        style={{ marginLeft: '10px' }}
        title={`[Bjornulf] Free Ollama VRAM (${agentSelectors.currentAgentModel(useAgentStore.getState())})`}
      />
      <ActionIcon
        icon={Camera}
        loading={isLoading}
        onClick={sendToComfyUI}
        title={isLoading ? 'Sending...' : '[Bjornulf] Send to Comfyui API'}
      />
      <ActionIcon
        icon={Settings}
        onClick={() => setShowApiSelect(true)}
        style={{ marginLeft: '10px' }}
        title="[Bjornulf] Comfyui : Select workflow JSON"
      />
      <Modal
        footer={null}
        onCancel={() => setShowApiSelect(false)}
        open={showApiSelect}
        title="[Bjornulf] workflows in public/Bjornulf_API"
        width={400}
      >
        <Select
          onChange={handleApiChange}
          options={availableApis.map((api) => ({ label: api + '.json', value: api }))}
          placeholder="[Bjornulf] Select workflow JSON"
          style={{ width: '100%' }}
          value={apiUrl}
        />
      </Modal>
    </div>
  );
});

export default Comfy;

//GIVE UP ON THAT... USE THIS HACK IN NODE INSTEAD (included in lobechat save image)
// const freeVramHackPromptBody = '{ prompt: {"3":{"inputs":{"text":"free VRAM hack"},"class_type":"Bjornulf_WriteText","_meta":{"title":"✒ Write Text"}},"4":{"inputs":{"text_value":["3",0],"text":"free VRAM hack"},"class_type":"Bjornulf_ShowText","_meta":{"title":"👁 Show (Text)"}}} }';
// await fetch(COMFYUI_URL + '/prompt', {
//   body: freeVramHackPromptBody,
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   method: 'POST',
// });
//Free ram hack :
// curl -X POST http://localhost:8188/prompt -H "Content-Type: application/json" -d '{"prompt":{"3":{"inputs":{"text":"free VRAM hack"},"class_type":"Bjornulf_WriteText","_meta":{"title":"✒ Write Text"}},"4":{"inputs":{"text_value":["3",0],"text":"free VRAM hack"},"class_type":"Bjornulf_ShowText","_meta":{"title":"👁 Show (Text)"}}}}'
