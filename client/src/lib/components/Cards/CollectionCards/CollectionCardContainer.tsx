import React, {useCallback, useMemo} from 'react';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';

import {JourneyStackProps} from '../../../navigation/constants/routes';
import useCollectionById from '../../../content/hooks/useCollectionById';
import usePinnedCollectionById from '../../../user/hooks/usePinnedCollectionById';
import useCompletedSessionByTime from '../../../user/hooks/useCompletedSessionByTime';
import useExercisesByCollectionId from '../../../content/hooks/useExercisesByCollectionId';
import CollectionFullCard from './CollectionFullCard';

type CollectionCardContainer = {
  collectionId: string;
};

const CollectionCardContainer: React.FC<CollectionCardContainer> = ({
  collectionId,
}) => {
  const {navigate} =
    useNavigation<NativeStackNavigationProp<JourneyStackProps, 'Collection'>>();
  const collection = useCollectionById(collectionId);
  const savedCollection = usePinnedCollectionById(collectionId);
  const exercises = useExercisesByCollectionId(collectionId);
  const {getCompletedSessionByExerciseId} = useCompletedSessionByTime();

  const items = useMemo(() => {
    if (exercises.length > 0 && savedCollection) {
      return exercises
        .map(e =>
          getCompletedSessionByExerciseId(e.id, savedCollection.startedAt)
            ? true
            : false,
        )
        .sort(a => (a ? -1 : 1));
    } else if (collection) {
      return exercises.map(() => false);
    }
    return [];
  }, [collection, savedCollection, exercises, getCompletedSessionByExerciseId]);

  const onPress = useCallback(() => {
    navigate('Collection', {collectionId: collection?.id});
  }, [navigate, collection]);

  if (!collection) {
    return null;
  }

  return (
    <CollectionFullCard
      collection={collection}
      progressItems={items}
      onPress={onPress}
    />
  );
};

export default CollectionCardContainer;
