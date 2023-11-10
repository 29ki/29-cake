import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {renderHook, act} from '@testing-library/react-hooks';
import {PostType} from '../../../../../shared/src/schemas/Post';
import {AsyncSessionType} from '../../../../../shared/src/schemas/Session';
import {
  FeedbackPayload,
  PostPayload,
} from '../../../../../shared/src/types/Event';
import useSessionState from '../../session/state/state';
import useUserState from '../../user/state/state';
import {fetchExercisePosts, addPost} from '../api/posts';
import useSessionSharingPosts from './useSessionSharingPosts';

jest.mock('../api/posts');

const mockFetchPosts = jest.mocked(fetchExercisePosts);
const mockAddPost = jest.mocked(addPost);
const mockLogAsyncPostMetricEvent = jest.fn();

jest.mock(
  '../../session/hooks/useAsyncPostMetricEvents',
  () => () => mockLogAsyncPostMetricEvent,
);

afterEach(() => {
  jest.clearAllMocks();
});

describe('useSessionSharingPosts', () => {
  describe('getSharingPosts', () => {
    it('should return fetched posts as PostItems', async () => {
      mockFetchPosts.mockResolvedValueOnce([
        {
          id: 'some-post-id',
        } as PostType,
      ]);
      const {result} = renderHook(() =>
        useSessionSharingPosts('some-exercise-id'),
      );

      await act(async () => {
        const posts = await result.current.getSharingPosts('some-sharing-id');

        expect(posts).toEqual([{type: 'text', item: {id: 'some-post-id'}}]);
        expect(mockFetchPosts).toHaveBeenCalledTimes(1);
        expect(mockFetchPosts).toHaveBeenCalledWith(
          'some-exercise-id',
          'some-sharing-id',
        );
      });
    });

    it('should return sharing videos mixed with fetched posts as PostItems', async () => {
      mockFetchPosts.mockResolvedValueOnce([
        {
          id: 'some-post-id',
        } as PostType,
      ]);
      const {result} = renderHook(() =>
        useSessionSharingPosts('some-exercise-id'),
      );

      await act(async () => {
        const posts = await result.current.getSharingPosts('some-sharing-id', [
          {video: {source: 'some-video'}},
        ]);

        expect(posts).toEqual([
          {
            type: 'video',
            item: {
              video: {
                source: 'some-video',
              },
              exerciseId: 'some-exercise-id',
              sharingId: 'some-sharing-id',
            },
          },
          {type: 'text', item: {id: 'some-post-id'}},
        ]);
        expect(mockFetchPosts).toHaveBeenCalledTimes(1);
        expect(mockFetchPosts).toHaveBeenCalledWith(
          'some-exercise-id',
          'some-sharing-id',
        );
      });
    });

    it('should return sharing videos mixed with fetched posts padded as PostItems', async () => {
      mockFetchPosts.mockResolvedValueOnce([
        {
          id: 'some-post-id',
        } as PostType,
        {
          id: 'some-other-post-id',
        } as PostType,
      ]);
      const {result} = renderHook(() =>
        useSessionSharingPosts('some-exercise-id'),
      );

      await act(async () => {
        const posts = await result.current.getSharingPosts('some-sharing-id', [
          {video: {source: 'some-video'}},
        ]);

        expect(posts).toEqual([
          {
            type: 'video',
            item: {
              video: {source: 'some-video'},
              exerciseId: 'some-exercise-id',
              sharingId: 'some-sharing-id',
            },
          },
          {type: 'text', item: {id: 'some-post-id'}},
          {type: 'text', item: {id: 'some-other-post-id'}},
        ]);
        expect(mockFetchPosts).toHaveBeenCalledTimes(1);
        expect(mockFetchPosts).toHaveBeenCalledWith(
          'some-exercise-id',
          'some-sharing-id',
        );
      });
    });

    it('should return empty list if no exerciseId', async () => {
      const {result} = renderHook(() => useSessionSharingPosts(undefined));

      await act(async () => {
        const posts = await result.current.getSharingPosts('some-sharing-id');

        expect(posts).toEqual([]);
        expect(mockFetchPosts).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe('addSharingPost', () => {
    it('should add public post', async () => {
      useSessionState.setState({
        asyncSession: {id: 'some-session-id'} as AsyncSessionType,
      });
      useUserState.setState({
        user: {uid: 'some-user-id'} as FirebaseAuthTypes.User,
        userState: {
          'some-user-id': {},
        },
      });
      const {result} = renderHook(() =>
        useSessionSharingPosts('some-exercise-id'),
      );

      await act(async () => {
        await result.current.addSharingPost(
          'some-sharing-id',
          'some text',
          true,
          false,
        );
      });

      expect(mockAddPost).toHaveBeenCalledTimes(1);
      expect(mockAddPost).toHaveBeenCalledWith(
        'some-exercise-id',
        'some-sharing-id',
        'some text',
        false,
      );
      expect(mockLogAsyncPostMetricEvent).toHaveBeenCalledTimes(1);
      expect(mockLogAsyncPostMetricEvent).toHaveBeenCalledWith(
        'Create Async Post',
        true,
        false,
      );
      expect(
        useUserState.getState().userState['some-user-id'].userEvents,
      ).toEqual([
        {
          type: 'post',
          payload: {
            exerciseId: 'some-exercise-id',
            sharingId: 'some-sharing-id',
            sessionId: 'some-session-id',
            isPublic: true,
            isAnonymous: false,
            text: 'some text',
          } as PostPayload,
          timestamp: expect.any(String),
        },
      ]);
    });

    it('should add non public post', async () => {
      useSessionState.setState({
        asyncSession: {id: 'some-session-id'} as AsyncSessionType,
      });
      useUserState.setState({
        user: {uid: 'some-user-id'} as FirebaseAuthTypes.User,
        userState: {
          'some-user-id': {},
        },
      });
      const {result} = renderHook(() =>
        useSessionSharingPosts('some-exercise-id'),
      );

      await act(async () => {
        await result.current.addSharingPost(
          'some-sharing-id',
          'some text',
          false,
          false,
        );
      });

      expect(mockAddPost).toHaveBeenCalledTimes(0);
      expect(mockLogAsyncPostMetricEvent).toHaveBeenCalledTimes(1);
      expect(mockLogAsyncPostMetricEvent).toHaveBeenCalledWith(
        'Create Async Post',
        false,
        false,
      );
      expect(
        useUserState.getState().userState['some-user-id'].userEvents,
      ).toEqual([
        {
          type: 'post',
          payload: {
            exerciseId: 'some-exercise-id',
            sharingId: 'some-sharing-id',
            sessionId: 'some-session-id',
            isPublic: false,
            isAnonymous: false,
            text: 'some text',
          } as PostPayload,
          timestamp: expect.any(String),
        },
      ]);
    });

    it('should not add if exercise id is missing', async () => {
      useSessionState.setState({
        asyncSession: {id: 'some-session-id'} as AsyncSessionType,
      });
      useUserState.setState({
        user: {uid: 'some-user-id'} as FirebaseAuthTypes.User,
        userState: {
          'some-user-id': {},
        },
      });
      const {result} = renderHook(() => useSessionSharingPosts(undefined));

      await result.current.addSharingPost(
        'some-sharing-id',
        'some text',
        true,
        false,
      );

      expect(mockAddPost).toHaveBeenCalledTimes(0);
      expect(mockLogAsyncPostMetricEvent).toHaveBeenCalledTimes(0);
      expect(useUserState.getState().userState['some-user-id'].userEvents).toBe(
        undefined,
      );
    });

    it('should not add if session is not set', async () => {
      useSessionState.setState({
        asyncSession: undefined,
      });
      useUserState.setState({
        user: {uid: 'some-user-id'} as FirebaseAuthTypes.User,
        userState: {
          'some-user-id': {},
        },
      });
      const {result} = renderHook(() =>
        useSessionSharingPosts('some-exercise-id'),
      );

      await result.current.addSharingPost(
        'some-sharing-id',
        'some text',
        true,
        false,
      );

      expect(mockAddPost).toHaveBeenCalledTimes(0);
      expect(mockLogAsyncPostMetricEvent).toHaveBeenCalledTimes(0);
      expect(useUserState.getState().userState['some-user-id'].userEvents).toBe(
        undefined,
      );
    });
  });

  describe('getSharingPostForSession', () => {
    it('should filter out relevant sharing post events', () => {
      useUserState.setState({
        user: {uid: 'some-user-id'} as FirebaseAuthTypes.User,
        userState: {
          'some-user-id': {
            userEvents: [
              {
                type: 'feedback',
                payload: {} as FeedbackPayload,
                timestamp: new Date().toISOString(),
              },
              {
                type: 'post',
                payload: {
                  exerciseId: 'some-exercise-id',
                  sessionId: 'some-session-id',
                  sharingId: 'some-sharing-id',
                } as PostPayload,
                timestamp: new Date().toISOString(),
              },
              {
                type: 'post',
                payload: {
                  exerciseId: 'some-other-exercise-id',
                  sessionId: 'some-session-id',
                  sharingId: 'some-sharing-id',
                } as PostPayload,
                timestamp: new Date().toISOString(),
              },
              {
                type: 'post',
                payload: {
                  exerciseId: 'some-exercise-id',
                  sessionId: 'some-ohter-session-id',
                  sharingId: 'some-sharing-id',
                } as PostPayload,
                timestamp: new Date().toISOString(),
              },
              {
                type: 'post',
                payload: {
                  exerciseId: 'some-exercise-id',
                  sessionId: 'some-session-id',
                  sharingId: 'some-ohter-sharing-id',
                } as PostPayload,
                timestamp: new Date().toISOString(),
              },
            ],
          },
        },
      });

      const {result} = renderHook(() =>
        useSessionSharingPosts('some-exercise-id'),
      );

      const posts = result.current.getSharingPostForSession(
        'some-session-id',
        'some-sharing-id',
      );

      expect(posts).toEqual({
        type: 'post',
        payload: {
          exerciseId: 'some-exercise-id',
          sessionId: 'some-session-id',
          sharingId: 'some-sharing-id',
        },
        timestamp: expect.any(String),
      });
    });
  });

  describe('getSharingPostForExcercise', () => {
    it('should filter out relevant sharing post events', () => {
      useUserState.setState({
        user: {uid: 'some-user-id'} as FirebaseAuthTypes.User,
        userState: {
          'some-user-id': {
            userEvents: [
              {
                type: 'feedback',
                payload: {} as FeedbackPayload,
                timestamp: new Date('2023-01-01').toISOString(),
              },
              {
                type: 'post',
                payload: {
                  exerciseId: 'some-exercise-id',
                  sessionId: 'some-session-id',
                  sharingId: 'some-sharing-id',
                } as PostPayload,
                timestamp: new Date('2023-01-04').toISOString(),
              },
              {
                type: 'post',
                payload: {
                  exerciseId: 'some-exercise-id',
                  sessionId: 'some-other-session-id',
                  sharingId: 'some-sharing-id',
                } as PostPayload,
                timestamp: new Date('2023-01-03').toISOString(),
              },
              {
                type: 'post',
                payload: {
                  exerciseId: 'some-exercise-id',
                  sessionId: 'some-session-id',
                  sharingId: 'some-other-sharing-id',
                } as PostPayload,
                timestamp: new Date('2023-01-02').toISOString(),
              },
              {
                type: 'post',
                payload: {
                  exerciseId: 'some-other-exercise-id',
                  sessionId: 'some-session-id',
                  sharingId: 'some-ohter-sharing-id',
                } as PostPayload,
                timestamp: new Date('2023-01-01').toISOString(),
              },
            ],
          },
        },
      });

      const {result} = renderHook(() =>
        useSessionSharingPosts('some-exercise-id'),
      );

      const posts =
        result.current.getSharingPostsForExercise('some-sharing-id');

      expect(posts).toEqual([
        {
          type: 'post',
          payload: {
            exerciseId: 'some-exercise-id',
            sessionId: 'some-session-id',
            sharingId: 'some-sharing-id',
          },
          timestamp: expect.any(String),
        },
        {
          type: 'post',
          payload: {
            exerciseId: 'some-exercise-id',
            sessionId: 'some-other-session-id',
            sharingId: 'some-sharing-id',
          },
          timestamp: expect.any(String),
        },
      ]);
    });
  });
});
