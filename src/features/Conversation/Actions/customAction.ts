import { ActionIconGroupItems } from '@lobehub/ui/es/ActionIconGroup';
import { css, cx } from 'antd-style';
import { Camera, LanguagesIcon, Play } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { localeOptions } from '@/locales/resources';

const translateStyle = css`
  .ant-dropdown-menu-sub {
    overflow-y: scroll;
    max-height: 400px;
  }
`;

export const useCustomActions = () => {
  const { t } = useTranslation('chat');

  const translate = {
    children: localeOptions.map((i) => ({
      key: i.value,
      label: t(`lang.${i.value}`, { ns: 'common' }),
    })),
    icon: LanguagesIcon,
    key: 'translate',
    label: t('translate.action'),
    popupClassName: cx(translateStyle),
  } as ActionIconGroupItems;

  const tts = {
    icon: Play,
    key: 'tts',
    label: t('tts.action'),
  } as ActionIconGroupItems;

  const comfy = {
    icon: Camera,
    key: 'comfy',
    label: 'Comfy',
  } as ActionIconGroupItems;

  return useMemo(() => ({ comfy, translate, tts }), [comfy, translate, tts]);
};
