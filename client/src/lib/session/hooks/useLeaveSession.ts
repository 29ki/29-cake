import {useCallback, useContext} from 'react';
import {Alert} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {DailyContext} from '../../../lib/daily/DailyProvider';
import useSessionState from '../state/state';
import {
  AppStackProps,
  ModalStackProps,
  OverlayStackProps,
} from '../../../lib/navigation/constants/routes';
import useSessions from '../../../lib/sessions/hooks/useSessions';
import useLiveSessionMetricEvents from './useLiveSessionMetricEvents';
import useIsSessionHost from './useIsSessionHost';
import {
  AsyncSessionType,
  LiveSessionType,
  SessionMode,
} from '../../../../../shared/src/schemas/Session';
import useAsyncSessionMetricEvents from './useAsyncSessionMetricEvents';
import {removeMyself} from '../../sessions/api/session';

type ScreenNavigationProps = NativeStackNavigationProp<
  OverlayStackProps & AppStackProps & ModalStackProps
>;

const useLeaveSession = (session: LiveSessionType | AsyncSessionType) => {
  const {t} = useTranslation('Component.ConfirmExitSession');
  const {leaveMeeting} = useContext(DailyContext);
  const {navigate} = useNavigation<ScreenNavigationProps>();
  const sessionState = useSessionState(state => state.sessionState);

  const isHost = useIsSessionHost();
  const {fetchSessions} = useSessions();
  const logLiveSessionMetricEvent = useLiveSessionMetricEvents();
  const logAsyncSessionMetricEvent = useAsyncSessionMetricEvents();

  const resetSession = useSessionState(state => state.reset);

  const leaveSession = useCallback(
    async (isEjected?: boolean) => {
      if (session.mode !== SessionMode.async) {
        await leaveMeeting();
      }

      navigate('App', {screen: 'Tabs'});
      if (session?.id && sessionState?.started && !isEjected) {
        navigate('SessionFeedbackModal', {
          exerciseId: session.exerciseId,
          sessionId: session.id,
          completed: Boolean(sessionState?.completed),
          isHost,
          sessionMode: session.mode,
          sessionType: session.type,
        });
      }

      if (isEjected) {
        await removeMyself(session.id);
      }

      fetchSessions();
      resetSession();
    },
    [
      sessionState?.started,
      sessionState?.completed,
      isHost,
      session,
      leaveMeeting,
      resetSession,
      navigate,
      fetchSessions,
    ],
  );

  const leaveSessionWithConfirm = useCallback(
    () =>
      Alert.alert(t('header'), t('text'), [
        {
          text: t('buttons.cancel'),
          style: 'cancel',
          onPress: () => {},
        },
        {
          text: t('buttons.confirm'),
          style: 'destructive',

          onPress: () => {
            leaveSession();
            if (!sessionState?.completed) {
              if (session.mode === SessionMode.async) {
                logAsyncSessionMetricEvent('Leave Sharing Session');
              } else {
                logLiveSessionMetricEvent('Leave Sharing Session');
              }
            }
          },
        },
      ]),
    [
      session.mode,
      t,
      leaveSession,
      sessionState?.completed,
      logLiveSessionMetricEvent,
      logAsyncSessionMetricEvent,
    ],
  );

  return {leaveSession, leaveSessionWithConfirm};
};

export default useLeaveSession;
