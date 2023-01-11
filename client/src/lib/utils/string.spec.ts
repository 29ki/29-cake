import {Exercise} from '../../../../shared/src/types/generated/Exercise';
import {formatExerciseName, formatInviteCode} from './string';

describe('formatInviteCode', () => {
  it('adds space every three digits', () => {
    expect(formatInviteCode(123456789)).toBe('123 456 789');
  });
});

describe('formatExerciseName', () => {
  it('should add WIP to hidden exercises', () => {
    expect(
      formatExerciseName({name: 'Test', hidden: true} as unknown as Exercise),
    ).toEqual('Test (WIP)');
  });

  it('should not add WIP to non hidden exercises', () => {
    expect(formatExerciseName({name: 'Test'} as unknown as Exercise)).toEqual(
      'Test',
    );
  });
});
