---
title: Blockstack Connect
description: Learn what Connect is and how to integrate it into an app.
experience: beginners
duration: 15 minutes
images:
  large: /images/pages/connect.svg
  sm: /images/pages/connect-sm.svg
---

## Introduction

Blockstack Connect is a JavaScript library for integrating Blockstack authentication, data storage, and smart contracts into your app.

The library empowers you to:

- Register new users with a pre-built onboarding flow that quickly educates them as to the privacy benefits of using your app with Blockstack and provisions a "Secret Key" that secures their identity and data against the Stacks blockchain.
- Authenticate users when they return to your app using that same Secret Key.
- Prompt users to sign transactions with smart contracts as written in Clarity and published to the Stacks blockchain.

## How does this compare to `blockstack.js`?

Although [`blockstack.js`](https://github.com/blockstack/blockstack.js) can also be used to authenticate users, it implements the deprecated [Blockstack Browser](https://browser.blockstack.org/) and lacks any pre-built onboarding UI that educates users as to how your app is more secure for having implemented Blockstack. As such, we advise that you use `blockstack.js` for all other functionality apart from authentication, such as saving and retrieving user data with Gaia.

## Start building with Blockstack Connect

Head over to the [to-do app tutorial](/authentication/building-todo-app) to learn how to build apps with Blockstack Connect. For interaction with Stacks accounts and smart contracts with Blockstack Connect see the [transaction sigining section](/smart-contracts/signing-transactions).

## Installation

With yarn:

```bash
yarn add @blockstack/connect
```

With npm:

```bash
npm install --save @blockstack/connect
```

## Usage

### AuthOptions

Every major method you'll use with `connect` requires you to pass some options, like the name and icon of your app, and what to do when authentication is finished. In practice, this means you need to define these options, and pass them to the various API methods.

The exact interface you'll use [is defined as](https://github.com/blockstack/ux/blob/master/packages/connect/src/auth.ts#L17:L39):

```typescript
export interface AuthOptions {
  redirectTo?: string;
  finished?: (payload: FinishedData) => void;
  sendToSignIn?: boolean;
  userSession?: UserSession;
  appDetails: {
    name: string;
    icon: string;
  };
}
```

| parameter    | type        | default | optional | description                                                                                                                                                                                                                                                                                                   |
| ------------ | ----------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| redirectTo   | string      |         | true     | The path in your app where users go after sign in.                                                                                                                                                                                                                                                            |
| appDetails   | object      |         | false    | an object which includes `appName: string` and `appIcon: string`. This will speed up the process of loading your app's information during onboarding.                                                                                                                                                         |
| finished     | function    |         | true     | A callback that can be invoked after authentication. This prevents having to do a whole page refresh in a new tab. One argument is passed to this callback, which is an object with `userSession` included. If included, then the `redirectTo` path is ignored, and the user will be logged in automatically. |
| sendToSignIn | boolean     | false   | true     | Whether the user should go straight to the 'sign in' flow (false) or be presented with the 'sign up' flow (true) instead.                                                                                                                                                                                     |
| userSession  | UserSession |         | true    | pass a `UserSession` instance to use for authentication. If it's not passed, `@blockstack/connect` will create one for you.                                                                                                                                                                                   |

### In React Apps

If you're using `connect` in a React app, then the best option is to include `connect`'s React Provider and hooks in your React app.

First, setup the `Connect` provider at the "top-level" of your app - probably next to wherever you would put a Redux provider, for example.

```jsx
import { Connect } from '@blockstack/connect';

const authOptions = {
  redirectTo: '/',
  finished: ({ userSession }) => {
    console.log(userSession.loadUserData());
  },
  appDetails: {
    name: 'My Cool App',
    icon: 'https://example.com/icon.png',
  },
};

const App = () => <Connect authOptions={authOptions}>// the rest of your app's components</Connect>;
```

Later, when you want to begin the onboarding process, use the `useConnect` hook to get `connect`'s `doOpenAuth` method.

```jsx
import { useConnect } from '@blockstack/connect';

const SignInButton = () => {
  const { doOpenAuth } = useConnect();

  return <Button onClick={doOpenAuth}>Sign In</Button>;
};
```

#### Sign In

To send the user straight to sign in, call `doOpenAuth(true)`.

### In ES6 (non-React) apps

If you aren't using React, or just want a simpler API, then you can use the `showBlockstackConnect` method.

```jsx
import { showBlockstackConnect } from '@blockstack/connect';

const authOptions = {
  /** See docs above for options */
};
showBlockstackConnect(authOptions);
```

#### Sign In

To send the user straight to sign in, include `sendToSignIn: true` in your `authOptions`.

#### Note about dependency size:

If you're building a non-React app, note that importing `@blockstack/connect` will add React dependencies to your JavaScript bundle. We recommend using something like [Webpack resolve aliases](https://webpack.js.org/configuration/resolve/) to replace `react` with `preact` in production, which reduces your bundle size. Check out [our own webpack.config.js file](https://github.com/blockstack/ux/blob/master/packages/connect/webpack.config.js#L87:L95) to see how we use this for production builds.

If you're using the hosted version of `@blockstack/connect` (described below), then you already have a production-optimized bundle.

### Using a hosted version of `@blockstack/connect`

If you aren't using ES6 imports, you can still use `connect`! We package the library so that it can be automatically used with [unpkg](https://unpkg.com/).

First, include the script in your HTML:

```html
<script src="https://unpkg.com/@blockstack/connect" />
```

Then, you can use API methods under the `blockstackConnect` global variable:

```jsx
const authOptions = {
  /** See docs above for options */
};
blockstackConnect.showBlockstackConnect(authOptions);
```

## Handling redirect fallbacks

Connect is built to use popups with the [`window.postMessage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) API, which provides a much better and seamless user experience. However, there are times when this flow can fail. For example, the popup may be blocked, or the `window.postMessage` API might not work properly (which often happens on mobile browsers).

To make sure your app handles this gracefully, you'll need to handle the case where authentication is performed through regular HTTP redirects. With redirects, your users will be sent back to your app at a URL like:

`${authOptions.redirectTo}?authResponse=....`

To finalize authentication with this flow, you'll need to utilize the `UserSession` methods `isSignInPending()` and `handlePendingSignIn()`. For more information, check out the [blockstack.js API reference](https://blockstack.github.io/blockstack.js/).

```js
const userSession = new UserSession(appConfig);

// ... call this code on page load
if (userSession.isSignInPending()) {
  const userData = await userSession.handlePendingSignIn();
  // your user is now logged in.
}
```

## Design Guidance

Blockstack is valuable to users, but it can also be a barrier to those unfamiliar with Blockstack. The following guidelines serve to remedy that and help you onboard as many new users as you can.

### Delay Blockstack onboarding as long as possible

People will often leave apps when things are asked of them before they experience the app. Give them a chance to try your app before you ask them to sign up with Blockstack. For example, a note taking app could let a new user write a couple of notes before prompting them to save their progress.

### Provide an easy way in for new users

Many new users to your app will not be familiar with Blockstack yet and will be hesitant to click a Blockstack-branded button. Provide a generic button for users that are new to your app and Blockstack. Blockstack Connect will introduce new users to Blockstack and recognize existing users.

![Design Guidance Example](/images/connect-call-to-action-branding.png)

### Provide a quick way for existing users to sign in

You can point users to a specific part of the Blockstack App. For instance, a “Sign in” button on your website can redirect users to the sign in flow of the Blockstack App. If you do this, make sure you also have an option that is explicitly for new users and that points to the sign up flow.

To implement this functionality, check out our section on sending users to sign in immediately.
