import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import hexToRgba from 'hex-to-rgba';
import React, {useCallback, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {SectionList, SectionListRenderItem, Share} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../shared/src/constants/colors';
import {Exercise} from '../../../../../shared/src/types/generated/Exercise';
import CompletedSessionCard from '../../../lib/components/Cards/SessionCard/CompletedSessionCard';
import ExerciseCard from '../../../lib/components/Cards/SessionCard/ExerciseCard';
import Gutters from '../../../lib/components/Gutters/Gutters';
import Screen from '../../../lib/components/Screen/Screen';
import {
  Spacer12,
  Spacer16,
  Spacer24,
  Spacer32,
  Spacer48,
  Spacer8,
  TopSafeArea,
} from '../../../lib/components/Spacers/Spacer';
import StickyHeading from '../../../lib/components/StickyHeading/StickyHeading';
import {Display20} from '../../../lib/components/Typography/Display/Display';
import {Heading16} from '../../../lib/components/Typography/Heading/Heading';
import useCollectionById from '../../../lib/content/hooks/useCollectionById';
import useExercisesByCollectionId from '../../../lib/content/hooks/useExercisesByCollectionId';
import {
  AppStackProps,
  ExploreStackProps,
} from '../../../lib/navigation/constants/routes';
import useCompletedSessionByTime from '../../../lib/user/hooks/useCompletedSessionByTime';
import usePinCollection from '../../../lib/user/hooks/usePinCollection';
import usePinnedCollectionById from '../../../lib/user/hooks/usePinnedCollectionById';
import {formatContentName} from '../../../lib/utils/string';
import Markdown from '../../../lib/components/Typography/Markdown/Markdown';
import AnimatedButton from '../../../lib/components/Buttons/AnimatedButton';
import {
  PlusToCheckIconAnimated,
  ShareIcon,
} from '../../../lib/components/Icons';
import IconButton from '../../../lib/components/Buttons/IconButton/IconButton';
import CoCreators from '../../../lib/components/CoCreators/CoCreators';
import CardGraphic from '../../../lib/components/CardGraphic/CardGraphic';

type Section = {
  title: string;
  data: Exercise[];
};

const Row = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  flex: 1,
});

const RowJustified = styled(Row)({
  justifyContent: 'space-between',
});

const JourneyButton = styled(AnimatedButton)({
  alignSelf: 'flex-start',
});

const LeftColumn = styled.View({
  flex: 1,
  minHeight: 134,
  justifyContent: 'space-between',
});

const Graphic = styled(CardGraphic)({
  width: 134,
  height: 134,
  aspectRatio: '1',
  borderRadius: 8,
  overflow: 'hidden',
});

const Wrapper = styled.View({flex: 1});

const BottomGradient = styled(LinearGradient)({
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  height: 40,
});

const Collection = () => {
  const {
    params: {collectionId},
  } = useRoute<RouteProp<ExploreStackProps, 'Collection'>>();
  const {goBack} = useNavigation<NativeStackNavigationProp<AppStackProps>>();
  const {t} = useTranslation('Screen.Collection');
  const collection = useCollectionById(collectionId);
  const exercises = useExercisesByCollectionId(collectionId);
  const savedCollection = usePinnedCollectionById(collectionId);
  const {getCompletedSessionByExerciseId} = useCompletedSessionByTime();
  const {togglePinned, isPinned} = usePinCollection(collectionId);

  const colors = useMemo(
    () => [hexToRgba(COLORS.WHITE, 0), hexToRgba(COLORS.WHITE, 1)],
    [],
  );

  const exerciseSections = useMemo(() => {
    return [
      {
        title: t('sessionsHeading'),
        data: exercises,
      } as Section,
    ];
  }, [exercises, t]);

  const renderExerciseSectionHeader = useCallback<
    (info: {section: Section}) => React.ReactElement
  >(
    ({section: {title}}) => (
      <StickyHeading>
        <Heading16>{title}</Heading16>
      </StickyHeading>
    ),
    [],
  );

  const renderExerciseItem = useCallback<
    SectionListRenderItem<Exercise, Section>
  >(
    ({item}) => {
      const completedExerciseEvent = savedCollection
        ? getCompletedSessionByExerciseId(item.id, savedCollection.startedAt)
        : undefined;

      return (
        <Gutters>
          {completedExerciseEvent ? (
            <CompletedSessionCard
              completedSessionEvent={completedExerciseEvent}
            />
          ) : (
            <ExerciseCard exercise={item} small />
          )}
        </Gutters>
      );
    },
    [savedCollection, getCompletedSessionByExerciseId],
  );

  const onShare = useCallback(() => {
    if (collection?.link) {
      Share.share({
        message: collection.link,
      });
    }
  }, [collection?.link]);

  return (
    <Screen
      onPressBack={goBack}
      backgroundColor={COLORS.PURE_WHITE}
      title={t('collectionHeading')}>
      <Wrapper>
        <TopSafeArea />
        <Spacer32 />

        <SectionList
          sections={exerciseSections}
          ItemSeparatorComponent={Spacer16}
          keyExtractor={exercise => exercise.id}
          ListHeaderComponent={
            <Gutters>
              <Spacer32 />
              <RowJustified>
                <LeftColumn>
                  <Spacer8 />
                  <Display20 numberOfLines={3}>
                    {formatContentName(collection)}
                  </Display20>
                  <Spacer16 />
                  <Markdown>{collection?.description}</Markdown>
                </LeftColumn>
                <Spacer16 />
                <Graphic graphic={collection?.card} />
              </RowJustified>

              <Spacer16 />

              <Row>
                <JourneyButton
                  onPress={togglePinned}
                  variant={isPinned ? 'primary' : 'secondary'}
                  AnimatedIcon={PlusToCheckIconAnimated}
                  fill={COLORS.WHITE}
                  active={isPinned}>
                  {t('addToJourney')}
                </JourneyButton>
                <Spacer12 />
                {collection?.link && (
                  <>
                    <IconButton
                      variant="secondary"
                      onPress={onShare}
                      Icon={ShareIcon}
                    />
                  </>
                )}
              </Row>

              <Spacer24 />
            </Gutters>
          }
          renderSectionHeader={renderExerciseSectionHeader}
          ListFooterComponent={
            <Gutters>
              {Boolean(collection?.coCreators?.length) && (
                <>
                  <Spacer24 />
                  <Heading16>{t('coCreatorsHeading')}</Heading16>
                  <Spacer8 />
                  <CoCreators coCreators={collection?.coCreators} />
                </>
              )}
              <Spacer48 />
            </Gutters>
          }
          renderItem={renderExerciseItem}
        />
      </Wrapper>
      <BottomGradient colors={colors} />
    </Screen>
  );
};

export default Collection;
