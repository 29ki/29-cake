import {useNavigation} from '@react-navigation/native';
import {act, renderHook} from '@testing-library/react-hooks';
import {useTranslation} from 'react-i18next';
import {Alert as AlertMock} from 'react-native';
import {Session} from '../../../../../shared/src/types/Session';
import useSessionState from '../state/state';
import useLeaveSession from './useLeaveSession';

const alertConfirmMock = AlertMock.alert as jest.Mock;

jest.mock('../../../lib/daily/DailyProvider', () => ({
  DailyContext: jest.fn(),
}));

const mockLeaveMeeting = jest.fn();
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn(() => ({leaveMeeting: mockLeaveMeeting})),
}));

const mockLogSessionMetricEvent = jest.fn();
jest.mock(
  './useLogInSessionMetricEvents',
  () => () => mockLogSessionMetricEvent,
);

afterEach(() => {
  jest.clearAllMocks();
});

describe('useLeaveSession', () => {
  const {t} = useTranslation();
  (t as unknown as jest.Mock).mockReturnValue('Some translation');
  const navigation = useNavigation();
  const mockNavigate = jest.mocked(navigation.navigate);

  describe('leaveSession', () => {
    it('leaves the call, resets the state and navigates on confirming', async () => {
      useSessionState.setState({
        session: {
          id: 'some-session-id',
        } as Session,
      });

      const {result} = renderHook(() => useLeaveSession());

      await act(() => result.current.leaveSession());

      expect(mockLeaveMeeting).toHaveBeenCalledTimes(1);
      expect(useSessionState.getState().session).toBe(null);
      expect(mockNavigate).toHaveBeenCalledTimes(2);
    });

    it('navigates to session feedback modal with set params', async () => {
      useSessionState.setState({
        session: {
          id: 'some-session-id',
          hostId: 'some-host-id',
          exerciseState: {
            completed: true,
          },
        } as Session,
      });
      const {result} = renderHook(() => useLeaveSession());

      await act(() => result.current.leaveSession());

      expect(mockNavigate).toHaveBeenCalledWith('SessionFeedbackModal', {
        completed: true,
        isHost: false,
        sessionId: 'some-session-id',
      });
    });
  });

  describe('leaveSessionWithConfirm', () => {
    it('shows a confirm dialogue on leaving the session', async () => {
      const {result} = renderHook(() => useLeaveSession());

      await act(() => result.current.leaveSessionWithConfirm());

      expect(alertConfirmMock).toHaveBeenCalledTimes(1);
      expect(alertConfirmMock).toHaveBeenCalledWith(
        'Some translation',
        'Some translation',
        [
          {
            onPress: expect.any(Function),
            style: 'cancel',
            text: 'Some translation',
          },
          {
            onPress: expect.any(Function),
            style: 'destructive',
            text: 'Some translation',
          },
        ],
      );
    });

    it('leaves the call, resets the state and navigates on confirming', async () => {
      useSessionState.setState({
        session: {
          id: 'some-session-id',
        } as Session,
      });

      alertConfirmMock.mockImplementationOnce((header, text, config) => {
        // Run the confirm action
        config[1].onPress();
      });

      const {result} = renderHook(() => useLeaveSession());

      await act(() => result.current.leaveSessionWithConfirm());

      expect(alertConfirmMock).toHaveBeenCalledTimes(1);
      expect(mockLeaveMeeting).toHaveBeenCalledTimes(1);
      expect(useSessionState.getState().session).toBe(null);
      expect(mockLogSessionMetricEvent).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledTimes(2);
    });

    it('does nothing on dismiss', async () => {
      useSessionState.setState({
        session: {
          id: 'some-session-id',
        } as Session,
      });

      alertConfirmMock.mockImplementationOnce((header, text, config) => {
        // Run the dismiss action
        config[0].onPress();
      });

      const {result} = renderHook(() => useLeaveSession());

      await act(() => result.current.leaveSessionWithConfirm());

      expect(alertConfirmMock).toHaveBeenCalledTimes(1);
      expect(mockLeaveMeeting).toHaveBeenCalledTimes(0);
      expect(useSessionState.getState().session).toEqual({
        id: 'some-session-id',
      });
      expect(mockNavigate).toHaveBeenCalledTimes(0);
    });
  });
});
