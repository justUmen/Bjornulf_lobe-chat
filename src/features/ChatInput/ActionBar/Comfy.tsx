import { ActionIcon, Modal } from '@lobehub/ui';
import { Select, message } from 'antd';
import { Camera, Settings } from 'lucide-react';
import { memo, useCallback, useEffect, useState } from 'react';

import { useChatStore } from '@/store/chat';
import { chatSelectors } from '@/store/chat/selectors';

import BjornulfVoices from './BjornulfVoices';

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

// Helper Functions
const pollForImage = async () => {
  const baseImageUrl = 'http://localhost:8188/view?filename=output/BJORNULF_API_LAST_IMAGE.png';
  let previousImageHash = null;
  let retries = 0;
  const maxRetries = 300;

  while (retries < maxRetries) {
    const imageUrl = `${baseImageUrl}&rand=${Math.random()}`;
    try {
      const response = await fetch(imageUrl);
      if (response.ok) {
        const imageBlob = await response.blob();
        const imageArrayBuffer = await imageBlob.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', imageArrayBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const currentImageHash = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

        if (previousImageHash !== currentImageHash) {
          if (previousImageHash !== null) {
            return imageUrl;
          }
          previousImageHash = currentImageHash;
        }
      }
    } catch (error) {
      console.log('Polling for image...', error);
    }

    retries++;
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });
  }

  throw new Error('Timeout waiting for new image');
};

// Main Component
const Comfy = memo(() => {
  // State
  const [promptData, setPromptData] = useState<PromptData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiUrl, setApiUrl] = useState(() => localStorage.getItem('selectedApi') || 'sdxl');
  const [showApiSelect, setShowApiSelect] = useState(false);
  const [availableApis, setAvailableApis] = useState<string[]>([]);

  // Chat Store
  const [, inputMessage, updateInputMessage] = useChatStore((s) => [
    chatSelectors.isAIGenerating(s),
    s.inputMessage,
    s.updateInputMessage,
  ]);
  const addAIMessage = useChatStore((s) => s.addAIMessage);

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
        const response = await fetch('http://127.0.0.1:8188/prompt', {
          body: requestBody,
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        });

        if (!response.ok) {
          throw new Error(`HTTP Error ${response.status}`);
        }

        await response.json();
        message.loading('Generating image... Please wait');

        const imageName = `generated_${Date.now()}.png`;
        const dynamicImageUrl = `/api/serve-image?name=${encodeURIComponent(imageName)}`;
        const markdownImage = `![Generated Image](${dynamicImageUrl})`;

        const imageUrl = await pollForImage();
        console.log('Success:', imageUrl);
        message.success('Image generated successfully!');

        const saveImageResponse = await fetch('/api/save-image', {
          body: JSON.stringify({ imageName, imageUrl }),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        });

        if (!saveImageResponse.ok) {
          throw new Error('Failed to save the image');
        }
        updateInputMessage(markdownImage);
        await addAIMessage();
        updateInputMessage('');
      } catch (error) {
        console.error('Error:', error);
        message.error('Failed to generate or save image.');
      } finally {
        setIsLoading(false);
      }
    }
  }, [promptData, inputMessage, addAIMessage, updateInputMessage, apiUrl]);

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
