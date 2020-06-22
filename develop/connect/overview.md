---


---
# Introduction
{:.no_toc}

* TOC
{:toc}

Blockstack Connect is a JavaScript library for integrating Blockstack authentication and smart contracts into your app.

The library empowers you to:

- Register new users with a pre-built onboarding flow that quickly educates them as to the privacy benefits of using your app with Blockstack and provisions a "Secret Key" that secures their identity and data against the Stacks blockchain.
- Authenticate users when they return to your app using that same Secret Key.
- Prompt users to sign transactions with smart contracts as written in Clarity and published to the Stacks blockchain.

## See it in action

## How does this compare to `blockstack.js`?

Although [`blockstack.js`](https://github.com/blockstack/blockstack.js) can also be used to authenticate users, it implements the deprecated [Blockstack Browser](https://browser.blockstack.org/) and lacks any pre-built onboarding UI that educates users as to how your app is more secure for having implemented Blockstack. As such, we advise that you use `blockstack.js` for all other functionality apart from authentication, such as saving and retrieving user data with Gaia.

## Start building with Blockstack Connect

Head over to the [Tutorial for App Integration](/browser/todo-list.html) to learn how to build apps with Blockstack Connect.

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

**insert video**

As you can see, you simply need to add a "Get started" option to your app homepage and the library will display an introductory modal in the context of your app that explains the privacy benefits of using Blockstack and prepares users to receive a Secret Key instead of entering a traditional email and password.

The modal then triggers a popup in which Blockstack PBC's authenticator generates a 12-word mnemonic Secret Key and instructs the user to save it securely. The authenticator subsequently requests a username from the user, which will be used to identify them in your app and manage their various accounts, before routing them back to your app to start using it.

This entire onboarding flow has been designed and tested to optimize the speed in which your new users start using your app with the prerequisite knowledge and credentials. 

Here's what users see when returning to an app to sign back in:

**insert video**

As you can see, you simply need to add a "Sign in" option to your homepage. The library will trigger a popup in which the authenticator prompts users to simply enter their Secret Key at which point they can resume using your app.

At whichever point after a user has authenticated to your app, you can trigger the authenticator in a popup once more for them to a sign a transaction against any smart contract you or others have published to the Stacks blockchain.

![Transaction signing in apps](/assets/img/transaction-signing.png)

Note how this UI indicates "Testing mode" since transaction signing functionality is currently in beta and designed primarily with developers in mind. However, any Blockstack user who authenticates to your app can use it.

## Try it out

Our test app [Banter](https://banter.pub) is built with Blockstack Connect. Select "Get Started" to experience the standardized onboarding flow available to all apps that integrate this library.

Separately, you can use the [Blockstack Testnet Demo](https://authenticator-demo.netlify.app/) not only to experience registration and sign in but transaction signing as well.

## How does this compare to `blockstack.js`?

Although [`blockstack.js`](https://github.com/blockstack/blockstack.js) can also be used to authenticate users, it implements the deprecated [Blockstack Browser](https://browser.blockstack.org/) and lacks any pre-built onboarding UI that educates users as to how your app is more secure for having implemented Blockstack. As such, we advise that you use `blockstack.js` for all other functionality apart from authentication, such as saving and retrieving user data with Gaia.

## Start building with Blockstack Connect

Head over to the [Guide to Connect](get-started.html) for installation steps and usage guidelines.