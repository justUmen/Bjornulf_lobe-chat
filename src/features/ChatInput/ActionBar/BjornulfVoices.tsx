import { ActionIcon, Modal } from '@lobehub/ui';
import { Select } from 'antd';
import { Pause, Play, Speaker } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import './BjornulfVoices.css';

interface BjornulfVoicesProps {
  isLoading?: boolean;
  onLanguageSelect?: (selected: string) => void;
  onVoiceSelect?: (selected: string) => void;
}

interface VoiceMap {
  [language: string]: string[];
}

const languageMap: { [key: string]: string } = {
  'ar': 'Arabic',
  'cs': 'Czech',
  'de': 'German',
  'en': 'English',
  'es': 'Spanish',
  'fr': 'French',
  'hi': 'Hindi',
  'hu': 'Hungarian',
  'it': 'Italian',
  'ja': 'Japanese',
  'ko': 'Korean',
  'nl': 'Dutch',
  'pl': 'Polish',
  'pt': 'Portuguese',
  'ru': 'Russian',
  'tr': 'Turkish',
  'zh-cn': 'Chinese',
};

const BjornulfVoices: React.FC<BjornulfVoicesProps> = ({
  isLoading = false,
  onLanguageSelect,
  onVoiceSelect,
}) => {
  const [voices, setVoices] = useState<VoiceMap>({});
  const [selectedVoice, setSelectedVoice] = useState<string>(
    () => localStorage.getItem('selectedVoice') || '',
  );
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    () => localStorage.getItem('selectedLanguage') || 'en',
  );
  const [isOpen, setIsOpen] = useState(false);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  useEffect(() => {
    const fetchVoices = async () => {
      try {
        const response = await fetch('/api/getVoices');
        const data = await response.json();
        setVoices(data.voices);
      } catch (error) {
        console.error('Error fetching voices:', error);
      }
    };
    fetchVoices();
  }, []);

  const handleVoiceSelect = (voice: string) => {
    setSelectedVoice(voice);
    localStorage.setItem('selectedVoice', voice);
    onVoiceSelect?.(voice);
  };

  const handleLanguageSelect = (language: string) => {
    if (playingAudio) {
      const currentAudio = document.querySelector(`#audio-${playingAudio}`) as HTMLAudioElement;
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setPlayingAudio(null);
    }

    setSelectedLanguage(language);
    localStorage.setItem('selectedLanguage', language);
    onLanguageSelect?.(language);
    setSelectedVoice('');
    localStorage.removeItem('selectedVoice');
  };

  const handleAudioPlay = (voice: string) => {
    const audio = document.querySelector(`#audio-${voice}`) as HTMLAudioElement;
    if (playingAudio === voice) {
      setPlayingAudio(null);
      audio.pause();
      audio.currentTime = 0;
    } else {
      if (playingAudio) {
        const currentAudio = document.querySelector(`#audio-${playingAudio}`) as HTMLAudioElement;
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
      setPlayingAudio(voice);
      audio.play();
    }
  };

  const handleModalClose = () => {
    setIsOpen(false);
    if (playingAudio) {
      const currentAudio = document.querySelector(`#audio-${playingAudio}`) as HTMLAudioElement;
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setPlayingAudio(null);
    }
  };

  const availableLanguages = Object.entries(voices)
    .filter(([, voiceList]) => voiceList.length > 0)
    .map(([langCode]) => ({
      label: languageMap[langCode] || langCode,
      value: langCode,
    }));

  return (
    <>
      <ActionIcon
        icon={Speaker}
        loading={isLoading}
        onClick={() => setIsOpen(true)}
        title={isLoading ? 'Loading voices...' : '[Bjornulf] Select a voice'}
      />
      <Modal
        footer={
          <div className="flex justify-end">
            <button className="px-4 py-2 rounded" onClick={handleModalClose} type="button">
              Close
            </button>
          </div>
        }
        onCancel={handleModalClose}
        open={isOpen}
        style={{ maxHeight: '90vh', overflow: 'hidden' }}
        title="[Bjornulf] Select a Voice"
        width={300}
      >
        <div className="language-select mb-4">
          <Select className="w-full" onChange={handleLanguageSelect} value={selectedLanguage}>
            {availableLanguages.map((lang) => (
              <Select.Option key={lang.value} value={lang.value}>
                {lang.label}
              </Select.Option>
            ))}
          </Select>
        </div>
        <div className="voice-list">
          {voices[selectedLanguage] && voices[selectedLanguage].length > 0 ? (
            voices[selectedLanguage].map((voice, index) => (
              <div
                className={`voice-item ${selectedVoice === voice ? 'selected' : ''}`}
                key={index}
                onClick={() => handleVoiceSelect(voice)}
              >
                <span className="voice-name">{voice}</span>
                <button
                  className="play-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAudioPlay(voice);
                  }}
                  type="button"
                >
                  {playingAudio === voice ? <Pause size={20} /> : <Play size={20} />}
                </button>
                <audio
                  id={`audio-${voice}`}
                  onEnded={() => setPlayingAudio(null)}
                  src={`/bjornulf_voices/${selectedLanguage}/${voice}.wav`}
                />
              </div>
            ))
          ) : (
            <div className="no-voices">No voices found for the selected language.</div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default BjornulfVoices;
