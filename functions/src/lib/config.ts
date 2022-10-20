/*
Firebase functions supports .env ...
https://firebase.google.com/docs/functions/config-env

...but only during runtime and not at deploy or even bootstrap.
https://github.com/firebase/firebase-functions/issues/1065
https://github.com/firebase/firebase-functions/issues/1044
https://github.com/firebase/firebase-tools/issues/4656

We therefore shim this with the dotenv library
*/
import 'dotenv/config';
import {cleanEnv, str} from 'envalid';

const configValidation = {
  GIT_COMMIT_SHORT: str(),
  ENVIRONMENT: str(),
  DAILY_API_KEY: str(),
  SENTRY_DSN: str(),
  DEEP_LINK_API_KEY: str(),
  DEEP_LINK_DOMAIN_URI_PREFIX: str(),
  DEEP_LINK_BASE_URL: str(),
  DEEP_LINK_ANDROID_PACKAGE_NAME: str(),
  DEEP_LINK_IOS_BUNDLE_ID: str(),
  DEEP_LINK_IOS_APPSTORE_ID: str(),
};

export default cleanEnv(process.env, configValidation);
