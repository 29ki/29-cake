import {Session, SessionState} from '../../../../../shared/src/types/Session';
import create from 'zustand';

type State = {
  session: Session | null;
  state: SessionState | null;
  currentContentReachedEnd: boolean;
};

type Actions = {
  setState: (sessionState: SessionState) => void;
  setSession: (session: Session) => void;
  setCurrentContentReachedEnd: (currentContentReachedEnd: boolean) => void;
  reset: () => void;
};

const initialState: State = {
  session: null,
  state: null,
  currentContentReachedEnd: false,
};

const useSessionState = create<State & Actions>()(set => ({
  ...initialState,
  setState: state => set({state}),
  setSession: session => set({session}),
  setCurrentContentReachedEnd: currentContentReachedEnd =>
    set({currentContentReachedEnd}),
  reset: () => set(initialState),
}));

export default useSessionState;
