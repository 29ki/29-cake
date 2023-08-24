import {renderHook} from '@testing-library/react-hooks';
import useExerciseById from './useExerciseById';

const mockT = jest.fn().mockReturnValue('some-exercise');
jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({
    t: mockT,
  })),
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe('useExerciseById', () => {
  it('returns a translated exercise', () => {
    const {result} = renderHook(() => useExerciseById('some-exercise-id'));

    expect(mockT).toHaveBeenCalledTimes(1);
    expect(mockT).toHaveBeenCalledWith('some-exercise-id', {
      returnObjects: true,
    });

    expect(result.current).toBe('some-exercise');
  });

  it('returns a translated exercise for a specific language', () => {
    const {result} = renderHook(() =>
      useExerciseById('some-exercise-id', 'sv'),
    );

    expect(mockT).toHaveBeenCalledTimes(1);
    expect(mockT).toHaveBeenCalledWith('some-exercise-id', {
      returnObjects: true,
      lng: 'sv',
    });

    expect(result.current).toBe('some-exercise');
  });

  it('returns null when no ID is provided', () => {
    const {result} = renderHook(() => useExerciseById(undefined));

    expect(mockT).toHaveBeenCalledTimes(0);

    expect(result.current).toBe(null);
  });

  it('memoizes the result - as i18next.t is not pure', () => {
    const {result, rerender} = renderHook(() =>
      useExerciseById('some-exercise-id'),
    );

    rerender();

    expect(mockT).toHaveBeenCalledTimes(1);
    expect(result.all.length).toEqual(2);
  });
});
