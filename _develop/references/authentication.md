---
layout: learn
permalink: /:collection/:path.html
---

# Authentication Reference
{:.no_toc}

Blockstack Auth provides single sign on and authentication without third parties or remote servers. On this page, you'll get an overview of authentication from a developer perspective. The following topics are covered:

Blockstack Connect is a JavaScript library for integrating Blockstack authentication and smart contracts into your app.

The library empowers you to:

- Register new users with a pre-built onboarding flow that quickly educates them as to the privacy benefits of using your app with Blockstack and provisions a "Secret Key" that secures their identity and data against the Stacks blockchain.
- Authenticate users when they return to your app using that same Secret Key.
- Prompt users to sign transactions with smart contracts as written in Clarity and published to the Stacks blockchain.

* TOC
{:toc}

## See it in action

Here's what it looks like to register new users into an app with Blockstack Connect:

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

![Design Guidance Example](./docs/call-to-action-branding.png)

### Provide a quick way for existing users to sign in

You can point users to a specific part of the Blockstack App. For instance, a “Sign in” button on your website can redirect users to the sign in flow of the Blockstack App. If you do this, make sure you also have an option that is explicitly for new users and that points to the sign up flow.

To implement this functionality, check out our section on sending users to sign in immediately.

## Scopes

Scopes define the permissions requested from, and that a user accepts, through the sign-in dialog.
Decentralized apps may request any of the following scopes:

| Scope          | Definition                                                                           |
| -------------- | ------------------------------------------------------------------------------------ |
| `store_write`  | Read and write data to the user's Gaia hub in an app-specific storage bucket.        |
| `publish_data` | Publish data so that other users of the app can discover and interact with the user. |                                          |

The permissions scope should be specified through the <a href="https://blockstack.github.io/blockstack.js/classes/appconfig.html" target="\_blank">AppConfig</a> object. If no `scopes` array is provided to the `redirectToSignIn` or `makeAuthRequest`
functions, the default is to request `['store_write']`.

## Manifest file

Decentralized apps have a manifest file. This file is based on the [W3C web app manifest specification](https://w3c.github.io/manifest/). The following is an example manifest file.

```
{
  "name": "Todo App",
  "start_url": "http://blockstack-todos.appartisan.com",
  "description": "A simple todo app build on blockstack",
  "icons": [{
    "src": "http://blockstack-todos.appartisan.com/logo.png",
    "sizes": "400x400",
    "type": "image/png"
  }]
}
```

The Blockstack App retrieves the manifest file from the app during the
authentication process and displays the information in it such as the
app `name` and to the user during sign in. The location of the app manifest file is specific
in the authentication request token and **must** be on the same origin as the app
requesting authentication.

The manifest file **must** have [Cross-origin resource sharing (CORS) headers](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) that allow the manifest file to be fetched from any arbitrary source. This usually means returning a header like this:

```
Access-Control-Allow-Origin: *
```

How you implement CORS depends in part on which platform/service you use to serve your application. For example, Netlify and Firebase have two different ways of configuring CORS. Consult your vendor documentation for more information.

## Key pairs

Blockstack Auth makes extensive use of public key cryptography. Blockstack uses ECDSA with the `secp256k1` curve. The following sections describe the three public-private key pairs used in the authentication process:

* how they're generated
* where they're used
* to whom the private key is disclosed

### Transit private key

The transit private is an ephemeral key that is used to encrypt secrets that
need to be passed from the Blockstack App to the decentralized app during the
authentication process. It is randomly generated by the app at the beginning of
the authentication response.

The public key that corresponds to the transit private key is stored in a single
element array in the `public_keys` key of the authentication request token. The
Blockstack App encrypts secret data such as the app private key using this
public key and sends it back to the app when the user signs in to the app. The
transit private key signs the app authentication request.

### Identity address private key

The identity address private key is derived from the user's keychain phrase and
is the private key of the Blockstack username that the user chooses to use to sign in
to the app. It is a secret owned by the user and never leaves the user's
instance of the Blockstack App. 

This private key signs the authentication response token for an app to indicate that the user approves sign in to that app.

### App private key

The app private key is an app-specific private key that is generated from the
user's identity address private key using the `domain_name` as input. It is
deterministic in that for a given Blockstack username and `domain_name`, the same
private key is generated each time. 

The app private key is securely shared with the app on each authentication, encrypted by the Blockstack App with the transit public key.

## JSON Web Token signatures

Both the `authRequest` and the `authResponse` tokens are [JSON Web Tokens](https://jwt.io/), and they are passed via URL query strings.

Blockstack's authentication tokens are based on the [RFC 7519 OAuth JSON Web Token (JWT)](https://tools.ietf.org/html/rfc7519)
with additional support for the `secp256k1` curve used by Bitcoin and many other
cryptocurrencies.

This signature algorithm is indicated by specifying `ES256K` in the token's
`alg` key, specifying that the JWT signature uses ECDSA with the secp256k1
curve. Blockstack provide both [JavaScript](https://github.com/blockstack/jsontokens-js)
and
[Ruby](https://github.com/blockstack/ruby-jwt-blockstack/tree/ruby-jwt-blockstack)
JWT libraries with support for this signing algorithm.


{% include note.html content="The Blockstack JWT implementation is different from other implementations because of the underlying cryptography we employ. There are libraries in <a href='https://github.com/blockstack/jsontokens-js'>Javascript</a> and <a href='https://github.com/blockstack/ruby-jwt-blockstack'>Ruby</a> available on the Blockstack Github to allow you to work with these tokens." %}

### Example: authRequest payload schema

``` JavaScript
const requestPayload = {
    jti, // UUID
    iat, // JWT creation time in seconds
    exp, // JWT expiration time in seconds
    iss, // legacy decentralized identifier generated from transit key
    public_keys, // single entry array with public key of transit key
    domain_name, // app origin
    manifest_uri, // url to manifest file - must be hosted on app origin
    redirect_uri, // url to which the Blockstack App redirects user on auth approval - must be hosted on app origin
    version, // version tuple
    do_not_include_profile, // a boolean flag asking Blockstack App to send profile url instead of profile object
    supports_hub_url, // a boolean flag indicating gaia hub support
    scopes // an array of string values indicating scopes requested by the app
  }
```


### Example: authResponse payload schema

```JavaScript
    const responsePayload = {
    jti, // UUID
    iat, // JWT creation time in seconds
    exp, // JWT expiration time in seconds
    iss, // legacy decentralized identifier (string prefix + identity address) - this uniquely identifies the user
    private_key, // encrypted private key payload
    public_keys, // single entry array with public key
    profile, // profile object or null if passed by profile_url
    username, // blockstack username (if any)
    core_token, // encrypted core token payload
    email, // email if email scope is requested & email available
    profile_url, // url to signed profile token
    hubUrl, // url pointing to user's gaia hub
    version // version tuple
  }
```