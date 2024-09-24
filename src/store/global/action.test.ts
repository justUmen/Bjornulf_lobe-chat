import { act, renderHook, waitFor } from '@testing-library/react';
import { major, minor } from 'semver';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { withSWR } from '~test-utils';

import { CURRENT_VERSION } from '@/const/version';
import { globalService } from '@/services/global';
import { useGlobalStore } from '@/store/global/index';
import { initialState } from '@/store/global/initialState';

vi.mock('zustand/traditional');

vi.mock('@/utils/client/switchLang', () => ({
  switchLang: vi.fn(),
}));

vi.mock('swr', async (importOriginal) => {
  const modules = await importOriginal();
  return {
    ...(modules as any),
    mutate: vi.fn(),
  };
});

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('createPreferenceSlice', () => {
  describe('toggleChatSideBar', () => {
    it('should toggle chat sidebar', () => {
      const { result } = renderHook(() => useGlobalStore());

      act(() => {
        useGlobalStore.getState().updateSystemStatus({ showChatSideBar: false });
        result.current.toggleChatSideBar();
      });

      expect(result.current.status.showChatSideBar).toBe(true);
    });
  });

  describe('toggleExpandSessionGroup', () => {
    it('should toggle expand session group', () => {
      const { result } = renderHook(() => useGlobalStore());
      const groupId = 'group-id';

      act(() => {
        useGlobalStore.setState({ isStatusInit: true });
        result.current.toggleExpandSessionGroup(groupId, true);
      });

      expect(result.current.status.expandSessionGroupKeys).toContain(groupId);
    });
  });

  describe('toggleMobileTopic', () => {
    it('should toggle mobile topic', () => {
      const { result } = renderHook(() => useGlobalStore());

      act(() => {
        useGlobalStore.setState({ isStatusInit: true });
        result.current.toggleMobileTopic();
      });

      expect(result.current.status.mobileShowTopic).toBe(true);
    });
  });

  describe('toggleMobilePortal', () => {
    it('should toggle mobile topic', () => {
      const { result } = renderHook(() => useGlobalStore());

      act(() => {
        useGlobalStore.setState({ isStatusInit: true });
        result.current.toggleMobilePortal();
      });

      expect(result.current.status.mobileShowPortal).toBe(true);
    });
  });

  describe('toggleSystemRole', () => {
    it('should toggle system role', () => {
      const { result } = renderHook(() => useGlobalStore());

      act(() => {
        useGlobalStore.setState({ isStatusInit: true });
        result.current.toggleSystemRole(true);
      });

      expect(result.current.status.showSystemRole).toBe(true);
    });
  });

  describe('updatePreference', () => {
    it('should update status', () => {
      const { result } = renderHook(() => useGlobalStore());
      const status = { inputHeight: 200 };

      act(() => {
        result.current.updateSystemStatus(status);
      });

      expect(result.current.status.inputHeight).toEqual(200);
    });
  });

  describe('switchBackToChat', () => {
    it('should switch back to chat', () => {
      const { result } = renderHook(() => useGlobalStore());
      const sessionId = 'session-id';
      const router = { push: vi.fn() } as any;

      act(() => {
        useGlobalStore.setState({ router });
        result.current.switchBackToChat(sessionId);
      });

      expect(router.push).toHaveBeenCalledWith('/chat?session=session-id');
    });
  });

  describe('useCheckLatestVersion', () => {
    it('should set hasNewVersion to false if there is no new version', async () => {
      const latestVersion = '0.0.1';

      vi.spyOn(globalService, 'getLatestVersion').mockResolvedValueOnce(latestVersion);

      const { result } = renderHook(() => useGlobalStore().useCheckLatestVersion(), {
        wrapper: withSWR,
      });

      await waitFor(() => {
        expect(result.current.data).toBe(latestVersion);
      });

      expect(useGlobalStore.getState().hasNewVersion).toBeUndefined();
      expect(useGlobalStore.getState().latestVersion).toBeUndefined();
    });

    it('should set hasNewVersion to true if there is a new version', async () => {
      const latestVersion = '10000000.0.0';

      vi.spyOn(globalService, 'getLatestVersion').mockResolvedValueOnce(latestVersion);

      const { result } = renderHook(() => useGlobalStore().useCheckLatestVersion(), {
        wrapper: withSWR,
      });

      await waitFor(() => {
        expect(result.current.data).toBe(latestVersion);
      });

      expect(useGlobalStore.getState().hasNewVersion).toBe(true);
      expect(useGlobalStore.getState().latestVersion).toBe(latestVersion);
    });

    it('should set hasNewVersion to false if the version is same minor', async () => {
      const latestVersion = `${major(CURRENT_VERSION)}.${minor(CURRENT_VERSION)}.9999999`;

      vi.spyOn(globalService, 'getLatestVersion').mockResolvedValueOnce(latestVersion);

      const { result } = renderHook(() => useGlobalStore().useCheckLatestVersion(), {
        wrapper: withSWR,
      });

      await waitFor(() => {
        expect(result.current.data).toBe(latestVersion);
      });

      expect(useGlobalStore.getState().hasNewVersion).toBeUndefined();
      expect(useGlobalStore.getState().latestVersion).toBeUndefined();
    });

    it('should set hasNewVersion to true if there is a minor version', async () => {
      const latestVersion = `${major(CURRENT_VERSION)}.${minor(CURRENT_VERSION) + 10}.0`;

      vi.spyOn(globalService, 'getLatestVersion').mockResolvedValueOnce(latestVersion);

      const { result } = renderHook(() => useGlobalStore().useCheckLatestVersion(), {
        wrapper: withSWR,
      });

      await waitFor(() => {
        expect(result.current.data).toBe(latestVersion);
      });

      expect(useGlobalStore.getState().hasNewVersion).toBe(true);
      expect(useGlobalStore.getState().latestVersion).toBe(latestVersion);
    });

    it('should handle invalid latest version', async () => {
      const latestVersion = 'invalid.version';

      vi.spyOn(globalService, 'getLatestVersion').mockResolvedValueOnce(latestVersion);

      const { result } = renderHook(() => useGlobalStore().useCheckLatestVersion(), {
        wrapper: withSWR,
      });

      await waitFor(() => {
        expect(result.current.data).toBe(latestVersion);
      });

      expect(useGlobalStore.getState().hasNewVersion).toBeUndefined();
      expect(useGlobalStore.getState().latestVersion).toBeUndefined();
    });
  });

  describe('useInitGlobalPreference', () => {
    it('should init global status if there is empty object', async () => {
      vi.spyOn(useGlobalStore.getState().statusStorage, 'getFromLocalStorage').mockReturnValueOnce(
        {} as any,
      );

      const { result } = renderHook(() => useGlobalStore().useInitSystemStatus(), {
        wrapper: withSWR,
      });

      await waitFor(() => {
        expect(result.current.data).toEqual({});
      });

      expect(useGlobalStore.getState().status).toEqual(initialState.status);
    });

    it('should update with data', async () => {
      const { result } = renderHook(() => useGlobalStore());
      vi.spyOn(useGlobalStore.getState().statusStorage, 'getFromLocalStorage').mockReturnValueOnce({
        inputHeight: 300,
      } as any);

      const { result: hooks } = renderHook(() => result.current.useInitSystemStatus(), {
        wrapper: withSWR,
      });

      await waitFor(() => {
        expect(hooks.current.data).toEqual({ inputHeight: 300 });
      });

      expect(result.current.status.inputHeight).toEqual(300);
    });
  });
});
