import * as yup from 'yup';
import {DEFAULT_LANGUAGE_TAG} from '../constants/i18n';
import {transformTimestamp} from '../modelUtils/transform';
import {LanguageSchema} from './Language';
import {UserSchema} from './User';

export enum SessionMode {
  async = 'async',
  live = 'live',
}

export enum SessionType {
  private = 'private',
  public = 'public',
}

const SessionStateFieldsSchema = yup.object({
  index: yup.number().required(),
  playing: yup.boolean().required(),
  started: yup.boolean().required(),
  ended: yup.boolean().required(),
  id: yup.string().required(),
  completed: yup.boolean(),
});
export type SessionStateFieldsType = yup.InferType<
  typeof SessionStateFieldsSchema
>;

const SessionBaseFiledsSchema = yup.object({
  id: yup.string().required(),
  mode: yup.mixed<SessionMode>().oneOf(Object.values(SessionMode)).required(),
  type: yup.mixed<SessionType>().oneOf(Object.values(SessionType)).required(),
  exerciseId: yup.string().required(),
  language: LanguageSchema.required(),
});

const LiveSessionFieldsSchema = yup
  .object({
    dailyRoomName: yup.string().required(),
    url: yup.string().required(),
    link: yup.string(),
    inviteCode: yup.number().required(),
    interestedCount: yup.number().required(),
    hostId: yup.string().required(),
    ended: yup.boolean().required(),
  })
  .concat(SessionBaseFiledsSchema);
export type LiveSessionFieldsType = yup.InferType<
  typeof LiveSessionFieldsSchema
>;

export const FeedbackSchema = yup.object({
  id: yup.string().required(),
  exerciseId: yup.string().required(),
  completed: yup.boolean().required(),
  sessionId: yup.string().required(),
  host: yup.string(),

  question: yup.string().required(),
  answer: yup.boolean().required(),
  comment: yup.string(),

  sessionMode: yup.string().oneOf([SessionMode.async, SessionMode.live]),
  sessionType: yup.string().oneOf([SessionType.private, SessionType.public]),

  approved: yup.boolean(),
  createdAt: transformTimestamp.required(),
});

// Applicaton schema
export const SessionStateSchema = yup
  .object({
    timestamp: transformTimestamp.required(),
  })
  .concat(SessionStateFieldsSchema);
export type SessionStateType = yup.InferType<typeof SessionStateSchema>;

export const LiveSessionSchema = yup
  .object({
    closingTime: transformTimestamp.required(),
    startTime: transformTimestamp.required(),
    createdAt: transformTimestamp.required(),
    updatedAt: transformTimestamp.required(),
    hostProfile: yup.object().concat(UserSchema).nullable(),
  })
  .concat(LiveSessionFieldsSchema);
export type LiveSessionType = yup.InferType<typeof LiveSessionSchema>;

export const AsyncSessionSchema = yup
  .object({
    startTime: yup.string().required(),
  })
  .concat(SessionBaseFiledsSchema);
export type AsyncSessionType = yup.InferType<typeof AsyncSessionSchema>;

export const CreateSessionSchema = LiveSessionSchema.pick([
  'exerciseId',
  'type',
]).concat(
  yup.object({
    startTime: yup.string().required(),
    language: LanguageSchema.default(DEFAULT_LANGUAGE_TAG),
  }),
);
export type CreateSessionType = yup.InferType<typeof CreateSessionSchema>;

export const UpdateSessionSchema = yup
  .object({
    startTime: yup.string(),
    type: yup.mixed<SessionType>().oneOf(Object.values(SessionType)),
  })
  .test(
    'nonEmptyObject',
    'object may not be empty',
    test => Object.keys(test).length > 0,
  );
export type UpdateSessionType = yup.InferType<typeof UpdateSessionSchema>;

export const InterestedCountSchema = yup.object({
  increment: yup.boolean().required(),
});
export type InterestedCountUpdateType = yup.InferType<
  typeof InterestedCountSchema
>;

export const SessionStateUpdateSchema = SessionStateSchema.partial().test(
  'nonEmptyObject',
  'object may not be empty',
  test => Object.keys(test).length > 0,
);
export type SessionStateUpdateType = yup.InferType<
  typeof SessionStateUpdateSchema
>;

export const JoinSessionSchema = LiveSessionSchema.pick(['inviteCode']);
export type JoinSessionType = yup.InferType<typeof JoinSessionSchema>;

export const RemoveMyselfParamsSchema = yup.object({
  sessionId: yup.string().required(),
});

export type RemoveMyselParamsfType = yup.InferType<
  typeof RemoveMyselfParamsSchema
>;

export type DailyUserData = {
  inPortal: boolean;
  userName?: string;
  photoURL?: string;
};
