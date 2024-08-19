import { ActionIcon } from '@lobehub/ui';
import { Input, message } from 'antd';
import { Camera, Settings } from 'lucide-react';
import { memo, useCallback, useEffect, useState } from 'react';

import { useChatStore } from '@/store/chat';
import { chatSelectors } from '@/store/chat/selectors';

interface Inputs {
  [key: string]: any; // General property for additional keys
  clip?: (string | number)[];
  text?: string;
}

interface Node {
  _meta?: {
    title: string;
  };
  class_type?: string;
  inputs: Inputs;
}

interface PromptData {
  [key: string]: Node;
}

const pollForImage = async () => {
  const baseImageUrl = 'http://localhost:8188/view?filename=output/BJORNULF_API_LAST_IMAGE.png';
  let previousImageHash = null;
  let polling = true;
  let retries = 0;
  const maxRetries = 300; // Adjust as needed

  while (polling && retries < maxRetries) {
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
            // We've detected a change in the image
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

const Comfy = memo(() => {
  const [promptData, setPromptData] = useState<PromptData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [, inputMessage, updateInputMessage] = useChatStore((s) => [
    chatSelectors.isAIGenerating(s),
    s.inputMessage,
    s.updateInputMessage,
  ]);
  const addAIMessage = useChatStore((s) => s.addAIMessage);
  const [apiUrl, setApiUrl] = useState('sdxl');
  const [showApiInput, setShowApiInput] = useState(false);

  const fetchPromptData = useCallback(() => {
    console.log(apiUrl);
    fetch('Bjornulf_API/' + apiUrl + '.json')
      .then((response) => response.json())
      .then((data) => {
        setPromptData(data as PromptData);
        message.success('ComfyUI JSON is valid : ' + apiUrl);
        setShowApiInput(false);
      })
      .catch((error) => {
        console.error('ComfyUI JSON is NOT valid :', error);
        // message.error('Failed to load prompt data from the provided URL.');
      });
  }, [apiUrl]);

  useEffect(() => {
    fetchPromptData();
  }, [fetchPromptData]);

  useEffect(() => {
    if (promptData) {
      console.log('Prompt data:', promptData);
    }
  }, [promptData]);

  // const imageNameUrl = `http://localhost:8188/view?filename=output/api_next_image.txt&rand=${Math.random()}`;
  // if (apiUrl === 'flux_schnell' || apiUrl === 'flux_dev') {
  //   promptData['27:1'].inputs.noise_seed = seed; //for flux_schnell.json
  // }
  // else {
  //   promptData['48'].inputs.seed = seed; //for sd15.json, sdxl.json, sd3.json
  // }
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

  const toggleApiInput = () => {
    setShowApiInput(!showApiInput);
  };

  return (
    <div style={{ alignItems: 'center', display: 'flex' }}>
      <ActionIcon
        icon={Camera}
        loading={isLoading}
        onClick={sendToComfyUI}
        title={isLoading ? 'Sending...' : 'Send to Comfyui API'}
      />
      <ActionIcon
        icon={Settings}
        onClick={toggleApiInput}
        style={{ marginLeft: '10px' }}
        title="Set API URL"
      />
      {showApiInput && (
        <Input
          onBlur={fetchPromptData}
          onChange={(e) => setApiUrl(e.target.value)}
          placeholder="Enter API URL"
          style={{ marginLeft: '10px', width: '300px' }}
          value={apiUrl}
        />
      )}
    </div>
  );
});

export default Comfy;
