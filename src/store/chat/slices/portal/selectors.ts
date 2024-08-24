import type { ChatStoreState } from '@/store/chat';

const artifactMessageId = (s: ChatStoreState) => s.portalToolMessage?.id;
const showPortal = (s: ChatStoreState) => s.showPortal;

const isArtifactMessageUIOpen = (id: string) => (s: ChatStoreState) =>
  artifactMessageId(s) === id && showPortal(s);

const showArtifactUI = (s: ChatStoreState) => !!s.portalToolMessage;
const showFilePreview = (s: ChatStoreState) => !!s.portalFile;
const previewFileId = (s: ChatStoreState) => s.portalFile?.fileId;

export const chatPortalSelectors = {
  artifactMessageId,
  isArtifactMessageUIOpen,
  previewFileId,
  showArtifactUI,
  showFilePreview,
  showPortal,
  toolUIIdentifier: (s: ChatStoreState) => s.portalToolMessage?.identifier,
};
