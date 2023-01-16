import {useMemo} from 'react';
import useGetTagById from './useGetTagById';

const useGetTagsById = (tagIds?: Array<string>) => {
  const getTagById = useGetTagById();

  return useMemo(() => {
    return tagIds
      ? tagIds
          .map(getTagById)
          .filter(tag => Boolean(tag))
          .filter(tag => tag.tag && tag.tag.length > 0)
          .sort((a, b) => (a.featuredOrder ?? 100) - (b.featuredOrder ?? 100))
      : [];
  }, [tagIds, getTagById]);
};

export default useGetTagsById;
