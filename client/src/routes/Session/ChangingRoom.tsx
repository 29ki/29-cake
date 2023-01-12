import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  RouteProp,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ActivityIndicator, Alert, Platform} from 'react-native';
import styled from 'styled-components/native';
import {useTranslation} from 'react-i18next';
import {DailyMediaView} from '@daily-co/react-native-daily-js';

import Button from '../../lib/components/Buttons/Button';
import Gutters from '../../lib/components/Gutters/Gutters';
import {
  FilmCameraIcon,
  FilmCameraOffIcon,
  MicrophoneIcon,
  MicrophoneOffIcon,
} from '../../lib/components/Icons';
import {
  BottomSafeArea,
  Spacer16,
  Spacer28,
  Spacer48,
  TopSafeArea,
} from '../../lib/components/Spacers/Spacer';
import {Body16} from '../../lib/components/Typography/Body/Body';
import {COLORS} from '../../../../shared/src/constants/colors';
import {DailyContext} from '../../lib/daily/DailyProvider';
import useSessionState from './state/state';
import {
  ModalStackProps,
  SessionStackProps,
  TabNavigatorProps,
} from '../../lib/navigation/constants/routes';
import {SPACINGS} from '../../lib/constants/spacings';
import TextInput from '../../lib/components/Typography/TextInput/TextInput';
import AudioIndicator from './components/Participants/AudioIdicator';
import IconButton from '../../lib/components/Buttons/IconButton/IconButton';
import Screen from '../../lib/components/Screen/Screen';
import useLocalParticipant from '../../lib/daily/hooks/useLocalParticipant';
import useUser from '../../lib/user/hooks/useUser';
import Image from '../../lib/components/Image/Image';
import useSubscribeToSessionIfFocused from './hooks/useSusbscribeToSessionIfFocused';
import {getSessionToken} from '../../lib/sessions/api/session';
import useLogInSessionMetricEvents from './hooks/useLogInSessionMetricEvents';
import useCheckPermissions from './hooks/useCheckPermissions';

const KeyboardWrapper = styled.KeyboardAvoidingView.attrs({
  behavior: Platform.select({ios: 'padding', android: undefined}),
})({
  flex: 1,
  justifyContent: 'center',
});

const ScrollWrapper = styled.ScrollView.attrs({
  contentContainerStyle: {flex: 1},
})({
  flex: 1,
});

const Controls = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
});

const VideoWrapper = styled.View({
  width: 200,
  height: 232,
  borderRadius: 24,
  overflow: 'hidden',
  alignContent: 'center',
  justifyContent: 'center',
  alignSelf: 'center',
  backgroundColor: COLORS.BLACK,
});

const DailyMediaViewWrapper = styled(DailyMediaView)({
  flex: 1,
});

const VideoText = styled(Body16)({
  textAlign: 'center',
  color: COLORS.PURE_WHITE,
});

const InputWrapper = styled.View({
  flexDirection: 'row',
});

const StyledTextInput = styled(TextInput)({
  flexGrow: 1,
});

const Audio = styled(AudioIndicator)({
  position: 'absolute',
  right: SPACINGS.SIXTEEN,
  top: SPACINGS.SIXTEEN,
});

const ImageContainer = styled.View({
  width: '100%',
  height: '100%',
});

const ChangingRoom = () => {
  const {t} = useTranslation('Screen.ChangingRoom');
  const [joiningMeeting, setJoiningMeeting] = useState(false);

  const {goBack, navigate} =
    useNavigation<
      NativeStackNavigationProp<
        SessionStackProps & TabNavigatorProps & ModalStackProps
      >
    >();
  const {toggleAudio, toggleVideo, setUserName, joinMeeting, preJoinMeeting} =
    useContext(DailyContext);

  const session = useSessionState(state => state.session);
  const sessionState = useSessionState(state => state.sessionState);
  const {
    params: {sessionId: sessionId},
  } = useRoute<RouteProp<SessionStackProps, 'ChangingRoom'>>();

  useSubscribeToSessionIfFocused(sessionId);
  const isFocused = useIsFocused();
  const me = useLocalParticipant();
  const user = useUser();
  const [localUserName, setLocalUserName] = useState(user?.displayName ?? '');
  const logSessionMetricEvent = useLogInSessionMetricEvents();
  const {
    checkJoinPermissions,
    checkCameraPermissions,
    checkMicrophonePermissions,
  } = useCheckPermissions();

  const hasAudio = Boolean(me?.audioTrack);
  const hasVideo = Boolean(me?.videoTrack);

  useEffect(() => {
    // If switching between sessions, the session will first be the old one
    // and then beacome the current one by useSubscribeToSessionIfFocused.
    // Only log metrics when session is the same as passed in by params
    if (session?.id === sessionId) {
      logSessionMetricEvent('Enter Changing Room');
    }
  }, [logSessionMetricEvent, session?.id, sessionId]);

  const preJoin = useCallback(
    async (url: string, id: string) => {
      try {
        const token = await getSessionToken(id);
        preJoinMeeting(url, token);
      } catch (e: any) {
        Alert.alert(
          t('errorTitle'),
          /* @ts-expect-error variable/string litteral as key is not yet supported https://www.i18next.com/overview/typescript#type-error-template-literal*/
          t(`errors.${e.code ?? e.message}`),
          [
            {
              onPress: goBack,
              style: 'cancel',
            },
          ],
        );
      }
    },
    [goBack, t, preJoinMeeting],
  );

  useEffect(() => {
    // If switching between sessions, the session will first be the old one
    // and then beacome the current one by useSubscribeToSessionIfFocused.
    // Only pre join when the session is the same as passed in by params
    if (isFocused && session?.url && session?.id && session?.id === sessionId) {
      preJoin(session.url, session.id);
    }
  }, [isFocused, session?.url, session?.id, sessionId, preJoin]);

  const join = useCallback(async () => {
    setJoiningMeeting(true);
    if (sessionState?.started) {
      await joinMeeting();
      navigate('Session', {sessionId});
    } else {
      await joinMeeting({
        subscribeToTracksAutomatically: false,
        userData: {
          inPortal: true,
        },
      });
      navigate('IntroPortal', {sessionId});
    }
  }, [
    setJoiningMeeting,
    sessionId,
    sessionState?.started,
    joinMeeting,
    navigate,
  ]);

  const joinPress = useCallback(() => {
    if (localUserName) {
      setUserName(localUserName);
      checkJoinPermissions(join);
    }
  }, [localUserName, setUserName, checkJoinPermissions, join]);

  const toggleAudioPress = useCallback(() => {
    checkMicrophonePermissions(() => {
      toggleAudio(!hasAudio);
    });
  }, [checkMicrophonePermissions, toggleAudio, hasAudio]);

  const toggleVideoPress = useCallback(() => {
    checkCameraPermissions(() => {
      toggleVideo(!hasVideo);
    });
  }, [checkCameraPermissions, toggleVideo, hasVideo]);

  return (
    <Screen onPressBack={goBack}>
      <ScrollWrapper>
        <TopSafeArea />
        <KeyboardWrapper>
          {!me ? (
            <ActivityIndicator size="large" />
          ) : (
            <>
              <VideoWrapper>
                {isFocused && hasVideo ? (
                  <DailyMediaViewWrapper
                    videoTrack={me?.videoTrack ?? null}
                    audioTrack={me?.audioTrack ?? null}
                    objectFit={'cover'}
                    mirror={me?.local}
                  />
                ) : user?.photoURL ? (
                  <ImageContainer>
                    <Image source={{uri: user.photoURL}} />
                  </ImageContainer>
                ) : (
                  <VideoText>{t('cameraOff')}</VideoText>
                )}
                <Audio muted={!hasAudio} />
              </VideoWrapper>

              <Spacer28 />
              <Gutters>
                <Controls>
                  <IconButton
                    disabled
                    onPress={toggleAudioPress}
                    active={hasAudio}
                    variant="secondary"
                    Icon={hasAudio ? MicrophoneIcon : MicrophoneOffIcon}
                  />
                  <Spacer16 />
                  <IconButton
                    onPress={toggleVideoPress}
                    active={hasVideo}
                    variant="secondary"
                    Icon={hasVideo ? FilmCameraIcon : FilmCameraOffIcon}
                  />
                </Controls>
                <Spacer48 />
                <InputWrapper>
                  <StyledTextInput
                    autoFocus
                    onChangeText={setLocalUserName}
                    onSubmitEditing={joinPress}
                    autoCapitalize="words"
                    autoCorrect={false}
                    maxLength={20}
                    defaultValue={localUserName}
                    placeholder={t('placeholder')}
                  />
                  <Spacer28 />
                  <Button
                    variant="secondary"
                    onPress={joinPress}
                    loading={joiningMeeting}
                    disabled={!localUserName.length || joiningMeeting}>
                    {t('join_button')}
                  </Button>
                </InputWrapper>
              </Gutters>
            </>
          )}
        </KeyboardWrapper>
        <BottomSafeArea minSize={SPACINGS.TWENTYEIGHT} />
      </ScrollWrapper>
    </Screen>
  );
};

export default ChangingRoom;
