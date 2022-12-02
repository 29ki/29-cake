import {renderHook} from '@testing-library/react-hooks';
import {useTranslation} from 'react-i18next';

import {Session} from '../../../../../shared/src/types/Session';
import useSessionState from '../state/state';
import useExerciseTheme from './useExerciseTheme';

afterEach(() => {
  jest.clearAllMocks();
});

describe('useExerciseTheme', () => {
  const {t} = useTranslation();
  (t as jest.Mock).mockReturnValue({theme: 'some-theme'});

  it('returns current session exercise theme', async () => {
    useSessionState.setState({
      session: {contentId: 'some-content-id'} as Session,
    });

    const {result} = renderHook(() => useExerciseTheme());

    expect(result.current).toBe('some-theme');
  });

  it('returns undefined', async () => {
    const {result} = renderHook(() => useExerciseTheme());

    expect(result.current).toBe(undefined);
  });
});
