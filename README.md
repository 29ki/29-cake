<div align="center">

[![29k](https://user-images.githubusercontent.com/474066/174894987-58605dd7-86b8-4455-9c86-f17346f4e213.png)](https://29k.org)

</div>

<p align="center">
  <strong>Your Mental Health App and Supportive Community</strong></br>
  Access free exercises, short or extended courses, daily prompts, meditations and connection with peers via chat, audio & video.
</p>

<p align="center">
  This is the 2.0 open-source version based on the learnings from the currently live <a href="https://app.29k.org/download">29k: Mental Health App</a>.
</p>

<p align="center">
  <a href="https://github.com/29ki/29k/blob/HEAD/LICENSE">
    <img src="https://img.shields.io/github/license/29ki/29k" alt="29k is released under the Creative Commons Zero v1.0 Universal." />
  </a>
  <img src="https://github.com/29ki/29k/actions/workflows/test.yml/badge.svg" alt="Current build status." />
  <a href="http://makeapullrequest.com"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="Make a Pull Request"></a>
  <a href="code_of_conduct.md"><img src="https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg" alt="Contributor Covenant"></a>
</p>

# Download Android/iOS app

Latest builds can be downloaded through iOS TestFlight and Android PlayStore:

- 🍎 [29k: Cupcake for iOS](https://testflight.apple.com/join/0VdruQ6z) - get access through TestFlight
- 🤖 [29k: Cupcake for Android](https://groups.google.com/u/1/a/29k.org/g/android-beta-test) - get access by becoming member of this google group

# Installation

```
yarn
cd functions 
yarn
cd client
yarn
```

# Local development

## Functions

```
cd functions
yarn build:watch
yarn start
```

## Client

### iOS

```
cd client
yarn ios
```

### Android

```
cd client
yarn android
```

### Metro bundler

```
cd client
yarn start
```

## Content

Content needs to be re-built when it's changed.

```
cd content
yarn build:watch
```

# Testing

## Client

```
cd client
yarn test
```

## Functions

```
cd functions
yarn test
```



## Translations

# Contributing

[Contributions doc](/docs/CONTRIBUTING.md)
# Code of conduct

[Code of Conduct](/docs/CODE_OF_CONDUCT.md)
