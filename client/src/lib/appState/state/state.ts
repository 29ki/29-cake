import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {LANGUAGE_TAG} from '../../i18n';

export const APP_RATING_REVISION = 1;

export type Settings = {
  preferredLanguage?: LANGUAGE_TAG;
  showHiddenContent: boolean;
  showLockedContent: boolean;
  showOnboarding: boolean;
  appRatedRevision?: number;
};

type State = {
  __hasHydrated?: boolean;
  isColdStarted: boolean;
  settings: Settings;
};

type Actions = {
  __setHasHydrated: (__hasHydrated: boolean) => void;
  setIsColdStarted: (isColdStarted: boolean) => void;
  setSettings: (settings: Partial<State['settings']>) => void;
  reset: () => void;
};

const initialState: State = {
  isColdStarted: true,
  settings: {
    showHiddenContent: false,
    showLockedContent: false,
    showOnboarding: true,
  },
};

const useAppState = create<State & Actions>()(
  persist(
    set => ({
      ...initialState,
      __setHasHydrated: __hasHydrated => set({__hasHydrated}),
      setIsColdStarted: isColdStarted => set({isColdStarted}),
      setSettings: settings =>
        set(state => ({settings: {...state.settings, ...settings}})),
      reset: () => set(initialState),
    }),
    {
      name: 'appState',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({settings}) => ({settings}),
      onRehydrateStorage: () => state => {
        state?.__setHasHydrated(true);
      },
    },
  ),
);

export default useAppState;
