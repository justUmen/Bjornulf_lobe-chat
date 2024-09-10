import { useOpenChatSettings } from '@/hooks/useInterceptingRoutes';
import { useGlobalStore } from '@/store/global';
import { useSessionStore } from '@/store/session';
import { sessionSelectors } from '@/store/session/selectors';

import { MarkdownCustomRender, OnAvatarsClick, RenderBelowMessage, RenderMessage } from '../types';
import { AssistantMessage } from './Assistant';
import { DefaultBelowMessage, DefaultMessage } from './Default';
import { ToolMessage } from './Tool';
import { UserBelowMessage, UserMarkdownRender, UserMessage } from './User';

export const renderMessages: Record<string, RenderMessage> = {
  assistant: AssistantMessage,
  default: DefaultMessage,
  function: DefaultMessage,
  tool: ToolMessage,
  user: UserMessage,
};

export const renderBelowMessages: Record<string, RenderBelowMessage> = {
  default: DefaultBelowMessage,
  user: UserBelowMessage,
};

export const markdownCustomRenders: Record<string, MarkdownCustomRender> = {
  user: UserMarkdownRender,
};

export const useAvatarsClick = (): OnAvatarsClick => {
  const [isInbox] = useSessionStore((s) => [sessionSelectors.isInboxSession(s)]);
  const [toggleSystemRole] = useGlobalStore((s) => [s.toggleSystemRole]);
  const openChatSettings = useOpenChatSettings();

  return (role) => {
    switch (role) {
      case 'assistant': {
        return () => {
          if (!isInbox) {
            toggleSystemRole(true);
          } else {
            openChatSettings();
          }
        };
      }
    }
  };
};
