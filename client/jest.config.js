// This needs to be mocked before runners since react-native-config is a
// babel plugin
process.env = Object.assign(process.env, {
  ENVIRONMENT: 'dev',
  IOS_CODE_PUSH_DEPLOYMENT_KEY: 'some-ios-code-push-deployment-key',
  ANDROID_CODE_PUSH_DEPLOYMENT_KEY: 'some-android-code-push-deployment-key',
  API_ENDPOINT: 'some-api-endpoint',
  GIT_COMMIT_SHORT: 'some-git-hash',
});
const modules = ['react-native', '@react-native', '@notifee'];

module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$':
      'jest-transform-stub',
  },
  transformIgnorePatterns: [
    // Solves the issue of non transpiled modules. See https://github.com/getsentry/sentry-react-native/issues/668
    `./node_modules/(?!(${modules.join('|')}).*/)`,
  ],
};
