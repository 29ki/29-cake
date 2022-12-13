import React, {useCallback} from 'react';
import styled from 'styled-components/native';
import {ViewStyle} from 'react-native';
import {useTranslation} from 'react-i18next';

import useIsSessionHost from '../../hooks/useIsSessionHost';
import useSessionState from '../../state/state';
import useSessionSlideState from '../../hooks/useSessionSlideState';

import {
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
  Rewind,
} from '../../../../common/components/Icons';

import useUpdateSessionExerciseState from '../../hooks/useUpdateSessionExerciseState';
import {Spacer8} from '../../../../common/components/Spacers/Spacer';
import Button from '../../../../common/components/Buttons/Button';
import IconButton from '../../../../common/components/Buttons/IconButton/IconButton';
import useSessionExercise from '../../hooks/useSessionExercise';

const Wrapper = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
});

const MediaControls = styled.View({
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'center',
});

const SlideButton = styled(Button)(({disabled}) => ({
  opacity: disabled ? 0 : 1,
}));

const IconSlideButton = styled(IconButton)(({disabled}) => ({
  opacity: disabled ? 0 : 1,
}));

type ContentControlsProps = {
  sessionId: string;
  style?: ViewStyle;
};

const ContentControls: React.FC<ContentControlsProps> = ({
  sessionId,
  style,
}) => {
  const isHost = useIsSessionHost();
  const exerciseState = useSessionState(state => state.session?.exerciseState);
  const currentSlideDone = useSessionState(state => state.currentSlideDone);
  const setCurrentSlideDone = useSessionState(
    state => state.setCurrentSlideDone,
  );
  const exercise = useSessionExercise();
  const slideState = useSessionSlideState();
  const {t} = useTranslation('Screen.Session');

  const {navigateToIndex, setPlaying} =
    useUpdateSessionExerciseState(sessionId);

  const onPrevPress = useCallback(() => {
    if (slideState && exercise?.slides) {
      navigateToIndex({
        index: slideState.index - 1,
        content: exercise?.slides,
      });
    }
  }, [slideState, exercise?.slides, navigateToIndex]);

  const onNextPress = useCallback(() => {
    if (slideState && exercise?.slides) {
      navigateToIndex({
        index: slideState.index + 1,
        content: exercise?.slides,
      });
    }
  }, [slideState, exercise?.slides, navigateToIndex]);

  const onResetPlayingPress = useCallback(
    () => setPlaying(Boolean(exerciseState?.playing)),
    [exerciseState?.playing, setPlaying],
  );

  const onTogglePlayingPress = useCallback(() => {
    if (currentSlideDone) {
      setPlaying(true);
      setCurrentSlideDone(false);
    } else {
      setPlaying(!exerciseState?.playing);
    }
  }, [
    exerciseState?.playing,
    setPlaying,
    currentSlideDone,
    setCurrentSlideDone,
  ]);

  if (!isHost || !exercise || !exerciseState || !slideState) {
    return null;
  }

  return (
    <Wrapper style={style}>
      <SlideButton
        variant="tertiary"
        small
        LeftIcon={ChevronLeft}
        disabled={!slideState.previous}
        elevated
        onPress={onPrevPress}>
        {t('controls.prev')}
      </SlideButton>
      {slideState.current.type !== 'host' &&
        !slideState.current.content?.video?.autoPlayLoop && (
          <MediaControls>
            <IconSlideButton
              small
              elevated
              disabled={!slideState.current.content?.video}
              variant="tertiary"
              Icon={Rewind}
              onPress={onResetPlayingPress}
            />
            <Spacer8 />
            <IconSlideButton
              small
              elevated
              disabled={!slideState.current.content?.video}
              variant="tertiary"
              Icon={exerciseState.playing && !currentSlideDone ? Pause : Play}
              onPress={onTogglePlayingPress}
            />
          </MediaControls>
        )}
      <SlideButton
        small
        elevated
        variant="tertiary"
        disabled={!slideState.next}
        RightIcon={ChevronRight}
        onPress={onNextPress}>
        {t('controls.next')}
      </SlideButton>
    </Wrapper>
  );
};

export default ContentControls;
