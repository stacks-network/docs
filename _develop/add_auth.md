---
layout: learn
permalink: /:collection/:path.html
---
# Add Auth to your DApp
{:.no_toc}

The way you can add Blockstack Auth to your DApp depends on whether your
app is a modern decentralized Blockstack App where code runs client-side without
trusted servers or a legacy client-server app where a server is trusted.

* TOC
{:toc}

## Authentication in Client-side apps

This method is appropriate for decentralized client-side apps where the user's
zone of trust &mdash; the parts of the app that the user is trusting &mdash; begins and ends
with the code running on their own computer. In apps like these, any code the
app interacts with that's not on their own computer such as external servers
does not need to know who they are.

[Blockstack.js](https://blockstack.github.io/blockstack.js/) provides API
methods that help you to implement Blockstack Authentication in your client-side
app.

### Default flow

The preferred way to implement authentication in these apps is to use the
default flow. This flow encapsulates authentication behind a few function
calls and makes it very fast to get up and running.

The default process use these four functions:

- <a href="https://blockstack.github.io/blockstack.js/classes/usersession.html#redirecttosignin" target="_blank">UserSession.redirectToSignIn</a>
- <a href="https://blockstack.github.io/blockstack.js/classes/usersession.html#issigninpending" target="_blank">UserSession.isSignInPending</a>
- <a href="https://blockstack.github.io/blockstack.js/classes/usersession.html#handlependingsignin" target="_blank">UserSession.handlePendingSignIn</a>
- <a href="https://blockstack.github.io/blockstack.js/classes/usersession.html#loaduserdata" target="_blank">UserSession.loadUserData</a>

When your app wants to start the sign in process, typically when the user clicks
a **Sign in with Blockstack** button, your app will call the `UserSession.redirectToSignIn`.
This creates an ephemeral transit key, stores it in the web browser's
`localStorage`. Then, the function is used to create an authentication request token. The Blockstack Browser
redirects the user to the Blockstack browser to approve the sign in request.


When a user approves a sign in request, the Blockstack Browser returns a signed `authResponse` token to the `redirectURI` specified in `UserSession.redirectToSignIn`.

To check for the presence of this token, your app should call `UserSession.isSignInPending`. If this returns `true`, the app should then call `UserSession.handlePendingSignIn`. This decodes the token, returns the signed-in-user's data, and simultaneously storing it to `localStorage` so that it can be retrieved later with `loadUserData`.

```js
import * as blockstack from 'blockstack'

var userSession = new UserSession()
if (userSession.isSignInPending()) {
    userSession.handlePendingSignIn()
    .then(userData => {
        const profile = userData.profile
    })
}

```

By default, these method use the `store_write` scope which allows the DApp to read the user profile and read/write user data for the DApp. To specify a different scope, use a <a href="https://blockstack.github.io/blockstack.js/classes/appconfig.html" target="\_blank">AppConfig</a> object.

### Custom flows

Alternatively, you can generate your own transit private key and/or
authentication request token using the <a href="https://blockstack.github.io/blockstack.js/classes/usersession.html#makeauthrequest" target="_blank">UserSession.makeAuthRequest</a> function. This function gives you more control over the authentication experience. For example, you can change the sign in experience so that it prompts users who have not yet created a Blockstack identity, to choose a hub URL.

 The `makeAuthRequest()` method takes the following parameters:

<dl class="uk-description-list">
   <dt class="uk-text-lowercase">
      <code>transitPrivateKey(String = generateAndStoreTransitKey())</code>
   </dt>
   <dd>A HEX encoded transit private key.</dd>
   <dt class="uk-text-lowercase">
      <code>redirectURI(String = `${window.location.origin}/`)</code>
   </dt>
   <dd>Location to redirect the user to after sign in approval.</dd>
   <dt class="uk-text-lowercase">
      <code>manifestURI(String = `${window.location.origin}/manifest.json`)</code>
   </dt>
   <dd>
      Location of this app's manifest file.
      </dd>
   <dt class="uk-text-lowercase">
      <code>scopes (Array = DEFAULT_SCOPE)</code>
   </dt>
   <dd>The permissions this app is requesting.</dd>
   <dt class="uk-text-lowercase">
      <code>appDomain(String = window.location.origin)</code>
   </dt>
   <dd>The origin of this app.</dd>
   <dt class="uk-text-lowercase">
      <code>expiresAt(Number = nextHour().getTime())</code>
   </dt>
   <dd>The time at which this request is no longer valid.</dd>
   <dt class="uk-text-lowercase">
      <code>extraParams(Object = {})</code>
   </dt>
   <dd>Any extra parameters to pass to the authenticator. Use this to pass options that aren't part of the Blockstack authentication specification, but might be supported by special authenticators.</dd>
</dl>


For example, you could use the following code to generate an authentication
request on `https://alice.example.com` or `https://bob.example.com` for an app
running on origin `https://example.com`.

```js

const transitPrivateKey = generateAndStoreTransitKey()
const redirectURI = 'https://example.com/authLandingPage'
const manifestURI = 'https://example.com/manifest.json'
const scopes = ['scope_write', 'publish_data']
const appDomain = 'https://example.com'

const authRequest = makeAuthRequest(transitPrivateKey, redirectURI, manifestURI, scopes, appDomain)

redirectToSignInWithAuthRequest(authRequest)
```

## Authentication in client-server apps

{% include note.html content="Client-server authentication requires using a library written in the
language of your server app. There are private methods in blockstack.js that can
be accomplish this on node.js server apps, but they are not currently part of
our public, supported API." %}

Using Blockstack Authentication in client-server apps is very similar to
client-side apps. You generate the authentication request using the same code in
the client as described above.

The main difference is that you need to verify the authentication response token
on the server after the user approves sign in to your app.

For an example of how verification can be done server side, take a look at the
[blockstack-ruby](https://github.com/blockstack/blockstack-ruby#to-verify-an-auth-response)
library.
