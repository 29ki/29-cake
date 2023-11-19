import {groupBy} from 'ramda';
import dayjs from 'dayjs';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {RefreshControl, SectionList} from 'react-native';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  useIsFocused,
  useNavigation,
  useScrollToTop,
} from '@react-navigation/native';
import throttle from 'lodash.throttle';

import useSessions from '../../../lib/sessions/hooks/useSessions';

import {LiveSessionType} from '../../../../../shared/src/schemas/Session';

import {SPACINGS} from '../../../lib/constants/spacings';
import {COLORS} from '../../../../../shared/src/constants/colors';
import {
  ModalStackProps,
  OverlayStackProps,
} from '../../../lib/navigation/constants/routes';
import SETTINGS from '../../../lib/constants/settings';
import {
  Spacer12,
  Spacer16,
  Spacer24,
  Spacer48,
  TopSafeArea,
} from '../../../lib/components/Spacers/Spacer';
import Gutters from '../../../lib/components/Gutters/Gutters';
import Button from '../../../lib/components/Buttons/Button';
import SessionCard from '../../../lib/components/Cards/SessionCard/SessionCard';
import {PlusIcon} from '../../../lib/components/Icons';
import Screen from '../../../lib/components/Screen/Screen';
import {Heading16} from '../../../lib/components/Typography/Heading/Heading';
import {SectionListRenderItem} from 'react-native';
import StickyHeading from '../../../lib/components/StickyHeading/StickyHeading';
import TopBar from '../../../lib/components/TopBar/TopBar';
import MiniProfile from '../../../lib/components/MiniProfile/MiniProfile';
import BottomFade from '../../../lib/components/BottomFade/BottomFade';
import usePinnedCollections from '../../../lib/user/hooks/usePinnedCollections';
import useGetStartedCollection from '../../../lib/content/hooks/useGetStartedCollection';
import useUserEvents from '../../../lib/user/hooks/useUserEvents';
import CollectionCardContainer from '../../../lib/components/Cards/CollectionCards/CollectionCardContainer';
import useGetRelativeDateGroup from '../../../lib/date/hooks/useGetRelativeDateGroup';
import useResumeFromBackgrounded from '../../../lib/appState/hooks/useResumeFromBackgrounded';
import useSharingPosts from '../../../lib/posts/hooks/useSharingPosts';
import {PostItem} from '../../../lib/posts/types/PostItem';
import SharingPosts from './components/SharingPosts';

type Section =
  | {
      title: string;
      data: LiveSessionType[];
      type: 'hostedBy' | 'interested' | 'comming';
    }
  | {
      title: string;
      data: Array<PostItem[]>;
      type: 'sharingPosts';
    };

const AddButton = styled(Button)({
  alignSelf: 'center',
  ...SETTINGS.BOXSHADOW,
});

const AddSessionWrapper = styled.View({
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
});

const AddSessionForm = () => {
  const {t} = useTranslation('Screen.Home');
  const {navigate} =
    useNavigation<NativeStackNavigationProp<ModalStackProps>>();

  return (
    <AddSessionWrapper>
      <AddButton
        onPress={() => navigate('CreateSessionModal', {exerciseId: undefined})}
        LeftIcon={PlusIcon}>
        {t('add')}
      </AddButton>
      <Spacer12 />
    </AddSessionWrapper>
  );
};

const GetStarted = () => {
  const {pinnedCollections} = usePinnedCollections();
  const {getStartedCollection} = useGetStartedCollection();
  const {completedCollectionEvents} = useUserEvents();

  const getStarted = useMemo(() => {
    const collection = pinnedCollections.find(
      p => p.id === getStartedCollection?.id,
    );
    if (
      collection &&
      !completedCollectionEvents.find(
        c => c.payload.id === getStartedCollection?.id,
      )
    ) {
      return collection;
    }
    return null;
  }, [pinnedCollections, getStartedCollection, completedCollectionEvents]);

  if (getStarted) {
    return (
      <Gutters>
        <Spacer24 />
        <CollectionCardContainer collectionId={getStarted.id} />
      </Gutters>
    );
  }
  return <Spacer24 />;
};

const renderSectionHeader: (info: {section: Section}) => React.ReactElement = ({
  section: {title},
}) => (
  <StickyHeading backgroundColor={COLORS.PURE_WHITE}>
    <Heading16>{title}</Heading16>
  </StickyHeading>
);

const renderSession = ({
  item,
  section,
  index,
}: {
  item: LiveSessionType;
  section: Section;
  index: number;
}) => (
  <Gutters>
    <SessionCard
      session={item}
      small={
        section.type !== 'comming' && section.data.length >= 1 && index > 0
      }
    />
  </Gutters>
);

const renderSharingPosts = ({
  item,
}: {
  item: PostItem[];
  section: Section;
  index: number;
}) => <SharingPosts sharingPosts={item} />;

const renderListItem: SectionListRenderItem<
  LiveSessionType | PostItem[],
  Section
> = ({item, section, index}) =>
  section.type === 'sharingPosts'
    ? renderSharingPosts({item: item as PostItem[], section, index})
    : renderSession({item: item as LiveSessionType, section, index});

const Home = () => {
  const {t} = useTranslation('Screen.Home');
  const {navigate} =
    useNavigation<NativeStackNavigationProp<OverlayStackProps>>();
  const {fetchSessions, sessions, pinnedSessions, hostedSessions} =
    useSessions();
  const {sharingPosts, fetchSharingPosts} = useSharingPosts();
  const getRelativeDateGroup = useGetRelativeDateGroup();
  const listRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const isFocused = useIsFocused();

  useScrollToTop(listRef);

  const sections = useMemo(() => {
    let sectionsList: Section[] = [];

    if (hostedSessions.length > 0) {
      sectionsList.push({
        title: t('sections.hostedBy'),
        data: hostedSessions,
        type: 'hostedBy',
      });
    }
    if (pinnedSessions.length > 0) {
      sectionsList.push({
        title: t('sections.interested'),
        data: pinnedSessions,
        type: 'interested',
      });
    }

    if (sessions.length > 0) {
      Object.entries(
        groupBy(
          session => getRelativeDateGroup(dayjs(session.startTime)),
          sessions,
        ),
      ).forEach(([group, items = []]) => {
        sectionsList.push({
          title: group,
          data: items,
          type: 'comming',
        });
      });
    }

    if (sharingPosts.length > 0) {
      // Insert at second place
      sectionsList.splice(2, 0, {
        title: t('sections.sharingPosts'),
        data: [sharingPosts],
        type: 'sharingPosts',
      });
    }

    return sectionsList;
  }, [
    sessions,
    sharingPosts,
    pinnedSessions,
    hostedSessions,
    t,
    getRelativeDateGroup,
  ]);

  const fetch = useCallback(async () => {
    await Promise.all([fetchSessions(), fetchSharingPosts()]);
  }, [fetchSessions, fetchSharingPosts]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const refreshPull = useCallback(async () => {
    try {
      setIsLoading(true);
      await fetch();
      setIsLoading(false);
    } catch (e: any) {
      setIsLoading(false);
      throw e;
    }
  }, [setIsLoading, fetch]);

  const onPressEllipsis = useCallback(() => {
    navigate('AboutOverlay');
  }, [navigate]);

  const throttledRefresh = useMemo(
    () =>
      throttle(() => {
        if (isFocused) {
          fetch();
        }
      }, 5 * 60000),
    [fetch, isFocused],
  );

  useEffect(throttledRefresh, [throttledRefresh]);

  useResumeFromBackgrounded(throttledRefresh);

  return (
    <Screen backgroundColor={COLORS.PURE_WHITE}>
      <TopSafeArea minSize={SPACINGS.SIXTEEN} />
      <TopBar
        backgroundColor={COLORS.PURE_WHITE}
        onPressEllipsis={onPressEllipsis}>
        <MiniProfile />
      </TopBar>
      <SectionList<LiveSessionType | PostItem[], Section>
        ref={listRef}
        sections={sections}
        ListHeaderComponent={GetStarted}
        ListFooterComponent={Spacer48}
        ItemSeparatorComponent={Spacer16}
        stickySectionHeadersEnabled
        renderSectionHeader={renderSectionHeader}
        renderItem={renderListItem}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refreshPull} />
        }
      />
      <BottomFade />
      <AddSessionForm />
    </Screen>
  );
};

export default Home;
