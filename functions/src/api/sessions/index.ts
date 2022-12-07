import * as yup from 'yup';
import validator from 'koa-yup-validator';
import 'firebase-functions';

import {SessionType} from '../../../../shared/src/types/Session';
import {createRouter} from '../../lib/routers';
import restrictAccessToRole from '../lib/restrictAccessToRole';

import * as sessionsController from '../../controllers/sessions';
import {
  DEFAULT_LANGUAGE_TAG,
  LANGUAGE_TAG,
  LANGUAGE_TAGS,
} from '../../lib/i18n';
import {JoinSessionError} from '../../../../shared/src/errors/Session';
import {RequestError} from '../../controllers/errors/RequestError';

const sessionsRouter = createRouter();

sessionsRouter.get('/', async ctx => {
  const {response, user} = ctx;

  const sessions = await sessionsController.getSessions(user.id);

  response.status = 200;
  ctx.body = sessions;
});

const CreateSessionSchema = yup.object().shape({
  contentId: yup.string().required(),
  type: yup.mixed<SessionType>().oneOf(Object.values(SessionType)).required(),
  startTime: yup.string().required(),
  language: yup
    .mixed<LANGUAGE_TAG>()
    .oneOf(LANGUAGE_TAGS)
    .default(DEFAULT_LANGUAGE_TAG),
});

type CreateSession = yup.InferType<typeof CreateSessionSchema>;

sessionsRouter.post(
  '/',
  validator({body: CreateSessionSchema}),
  restrictAccessToRole<CreateSession>(
    'publicHost',
    ({type}) => type === SessionType.public,
  ),
  async ctx => {
    const {contentId, type, startTime, language} = ctx.request
      .body as CreateSession;
    const {user} = ctx;

    ctx.body = await sessionsController.createSession(user.id, {
      contentId,
      type,
      startTime,
      language,
    });
  },
);

sessionsRouter.delete('/:id', async ctx => {
  const {id} = ctx.params;

  try {
    await sessionsController.removeSession(ctx.user.id, id);
  } catch {
    ctx.status = 500;
  }

  ctx.status = 200;
  ctx.body = 'Session deleted successfully';
});

const JoinSessionSchema = yup.object({
  inviteCode: yup.number().required(),
});

export type JoinSession = yup.InferType<typeof JoinSessionSchema>;

sessionsRouter.put(
  '/joinSession',
  validator({body: JoinSessionSchema}),
  async ctx => {
    const {inviteCode} = ctx.request.body as JoinSession;
    const {user} = ctx;

    try {
      ctx.body = await sessionsController.joinSession(user.id, inviteCode);
    } catch (error) {
      const requestError = error as RequestError;
      switch (requestError.code) {
        case JoinSessionError.notFound:
          ctx.status = 404;
          break;

        case JoinSessionError.notAvailable:
          ctx.status = 410;
          break;

        default:
          throw error;
      }
      ctx.message = requestError.code;
    }
  },
);

const UpdateSessionSchema = yup
  .object({
    started: yup.boolean(),
    ended: yup.boolean(),
    startTime: yup.string(),
    type: yup.mixed<SessionType>().oneOf(Object.values(SessionType)),
  })
  .test(
    'nonEmptyObject',
    'object may not be empty',
    test => Object.keys(test).length > 0,
  );

export type UpdateSession = yup.InferType<typeof UpdateSessionSchema>;

sessionsRouter.put(
  '/:id',
  validator({body: UpdateSessionSchema}),
  async ctx => {
    const {id} = ctx.params;
    const body = ctx.request.body as UpdateSession;

    try {
      const updatedSession = await sessionsController.updateSession(
        ctx.user.id,
        id,
        body,
      );

      ctx.status = 200;
      ctx.body = updatedSession;
    } catch (err) {
      ctx.status = 500;
      throw err;
    }
  },
);

const ExerciseStateUpdateSchema = yup
  .object({
    index: yup.number(),
    playing: yup.boolean(),
    dailySpotlightId: yup.string(),
    ended: yup.boolean(),
  })
  .test(
    'nonEmptyObject',
    'object may not be empty',
    test => Object.keys(test).length > 0,
  );

export type ExerciseStateUpdate = yup.InferType<
  typeof ExerciseStateUpdateSchema
>;

sessionsRouter.put(
  '/:id/exerciseState',
  validator({body: ExerciseStateUpdateSchema}),
  async ctx => {
    const {id} = ctx.params;
    const data = ctx.request.body as ExerciseStateUpdate;

    try {
      const updatedSession = await sessionsController.updateExerciseState(
        ctx.user.id,
        id,
        data,
      );
      ctx.body = updatedSession;
    } catch (err) {
      ctx.status = 500;
      throw err;
    }
  },
);

export {sessionsRouter};
