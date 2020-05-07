---
layout: learn
permalink: /:collection/:path.html
---
# Guide to Blockstack Connect
{:.no_toc}


Blockstack Connect is a Javascript library for integrating your application with Stacks v2. With Connect, you get some big benefits:

<!-- -  -->

* TOC
{:toc}

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

The exact interface you'll use [is defined as](https://github.com/blockstack/connect/blob/master/src/auth.ts#L12:L24):

```typescript
export interface AuthOptions {
  redirectTo: string;
  finished: (payload: FinishedData) => void;
  sendToSignIn?: boolean;
  userSession?: UserSession;
  appDetails: {
    name: string;
    icon: string;
  };
}
```

parameter | type | default | optional | description
---|---|---|---|---
redirectTo | string | | false | The path in your app where users go after sign in.
appDetails | object | | false | an object which includes `appName: string` and `appIcon: string`. This will speed up the process of loading your app's information during onboarding.
finished | function | | false | A callback that can be invoked after authentication. This prevents having to do a whole page refresh in a new tab. One argument is passed to this callback, which is an object with `userSession` included. If included, then the `redirectTo` path is ignored, and the user will be logged in automatically.
sendToSignIn | boolean | false | true | Whether the user should go straight to the 'sign in' flow (false) or be presented with the 'sign up' flow (true) instead.
userSession | UserSession | | false | pass a `UserSession` instance to use for authentication. If it's not passed, `@blockstack/connect` will create one for you.


### In React Apps

If you're using `connect` in a React app, then the best option is to include `connect`'s React Provider and hooks in your React app.

First, setup the `Connect` provider at the "top-level" of your app - probably next to wherever you would put a Redux provider, for example.

```javascript
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

const App = () => (
  <Connect authOptions={authOptions}>
    // the rest of your app's components
  </Connect>
)
```

Later, when you want to begin the onboarding process, use the `useConnect` hook to get `connect`'s `doOpenAuth` method.

```javascript
import { useConnect } from '@blockstack/connect';

const SignInButton = () => {
  const { doOpenAuth } = useConnect();

  return (
    <Button onClick={doOpenAuth}>
      Sign In
    </Button>
  )
}
```

#### Sign In

To send the user straight to sign in, call `doOpenAuth(true)`.

### In ES6 (non-React) apps

If you aren't using React, or just want a simpler API, then you can use the `showBlockstackConnect` method.


```javascript
import { showBlockstackConnect } from '@blockstack/connect';

const authOptions = { /** See docs above for options */ };
showBlockstackConnect(authOptions);
```

#### Sign In

To send the user straight to sign in, include `sendToSignIn: true` in your `authOptions`.

#### Note about dependency size:

If you're building a non-React app, note that importing `@blockstack/connect` will add React dependencies to your JavaScript bundle. We recommend using something like [Webpack resolve aliases](https://webpack.js.org/configuration/resolve/) to replace `react` with `preact` in production, which reduces your bundle size. Check out [our own webpack.config.js file](https://github.com/blockstack/ux/blob/fix/connect-modal-accessibility/packages/connect/webpack.config.js#L87:L95) to see how we use this for production builds.

If you're using the hosted version of `@blockstack/connect` (described below), then you already have a production-optimized bundle.

### Using a hosted version of `@blockstack/connect`

If you aren't using ES6 imports, you can still use `connect`! We package the library so that it can be automatically used with [unpkg](https://unpkg.com/).

First, include the script in your HTML:

```html
<script src="https://unpkg.com/@blockstack/connect" />
```

Then, you can use API methods under the `blockstackConnect` global variable:


```javascript
const authOptions = { /** See docs above for options */ };
blockstackConnect.showBlockstackConnect(authOptions);
```

## Handling redirect fallbacks

Connect is built to use popups with the `window.postMessage` API, which provides a much better and seamless user experience. However, there are times when this flow can fail. For example, the popup may be blocked, or the `window.postMessage` API might not work properly (which often happens on mobile browsers).

To make sure your app handles this gracefully, you'll need to handle the case where authentication is performed through vanilla redirects. With redirects, your users will be sent back to your app at a URL like:

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