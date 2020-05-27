---
layout: learn
permalink: /:collection/:path.html
---
# Understand Blockstack authentication
{:.no_toc}

Blockstack Auth provides single sign on and authentication without third parties or remote servers. On this page, you'll get an overview of authentication from an developer and user perspective.

## User experience flow

Blockstack Auth is a bearer token-based authentication system. From an application user's perspective, Blockstack authentication is similar to legacy third-party authentication techniques that they're familiar with. Applications present users with a **Sign in with Blockstack** button.

   ![](images/signwithblockstack.png)

Assume a user, Alice, clicks the **Sign in with Blockstack** button on an app. She is
redirected to her copy of the Blockstack Browser. If the user has
signed into the DApp previously. The actual Blockstack sign-in dialog depends on
whether the user already has an existing session in the Blockstack Browser.

<img src="images/kingdom_notin.png" alt="">

Alice can choose to authenticate as one of her Blockstack usernames by selecting the
username and clicking the **Approve** button. The Blockstack Browser shows Alice an approval dialog with information about your app including:

* The origin your app was served from
* Your app's name
* Your app's logo
* The types of permissions and data your app is requesting

Signing in with an identity is the means by which the user grants the DApp access. Access depends on the scope requested by the DApp. The default `store_write` scope allows the DApp to read the user profile and read/write user data for the DApp. Data is encrypted at a unique URL on a Gaia storage hub.

When she clicks approve, Alice is redirected back to the DApp where she is logged in.

## Application-authentication workflow

For an application developer, the application flow is different from the typical client-server flow used by centralized sign in services (e.g., OAuth). Rather, with Blockstack, the authentication flow happens entirely client-side.

A decentralized application (DApp) and the Blockstack Browser communicate during the authentication flow by passing back and forth two tokens. The requesting application sends the Blockstack Browser an `authRequest` token. Once a user approves a sign-in, the Blockstack Browser responds to the application with an `authResponse` token. These tokens are <a href="https://jwt.io/" target="\_blank">JSON Web Tokens</a>, and they are passed via URL query strings.

![](/storage/images/app-sign-in.png)

When a user chooses to **Sign in with Blockstack** on a DApp, calls the `redirectToSignIn()` method which sends the user to the Blockstack Browser. When Blockstack Browser is provided a username, it generates an The browser responds with an authentication token and an _app private key_.

The app private key is application-specific. It is generated from the user's identity address private key using the `appDomain` as input.  The key is ephemeral, it is generated for each execution of a key establishment process. This key is just used for the particular instance of the application, in this case to sign a sign-in request.

This app private key is also deterministic, meaning that for a given Blockstack username and domain name, the same private key is generated each time. The app private key is securely shared with the app on each authentication and encrypted by the Blockstack Browser. The key serves three functions, it:

* is used to create the credentials that give an app access to the Gaia hub storage bucket for that specific app
* is used in the end-to-end encryption of files stored for the app on the user's Gaia hub
* serves as a cryptographic secret that apps can use to perform other cryptographic functions

A Stacks node also generates a public key token which is sent to the
browser as an `authRequest` from the browser to the core node. The signed
authentication request is sent to Blockstack through a JSON Web Token (JWT).
Blocktack passes the token in via a URL query string in the `authRequest`
parameter:

`https://browser.blockstack.org/auth?authRequest=j902120cn829n1jnvoa...`

When the Blockstack node receives the `authRequest`, it generates a session token
and returns an authentication response (`authResponse`) to the application. Similar to the `authRequest`, the `authResponse` token includes a private key
intended only for the application. This allows the application to encrypt data
on user's personal Blockstack storage.

{% include note.html content="The Blockstack JWT implementation is different from other implementations because of the underlying cryptography we employ. There are libraries in <a href='https://github.com/blockstack/jsontokens-js'>Javascript</a> and <a href='https://github.com/blockstack/ruby-jwt-blockstack'>Ruby</a> available on the Blockstack Github to allow you to work with these tokens." %}


## Manifest file

Blockstack apps have a manifest file. This file is based on the [W3C web app manifest specification](https://w3c.github.io/manifest/). The following is an example manifest file.

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

The Blockstack Browser retrieves the manifest file from the app during the
authentication process and displays some of the information in it such as the
app name and icon to the user. The location of the app manifest file is specific
in the authentication request token and **must** be on the same origin as the app
requesting authentication.

The manifest file **must** have [Cross-origin resource sharing (CORS) headers](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) that allow the manifest file to be fetched from any arbitrary source. This usually means returning a header like this:

```
Access-Control-Allow-Origin: *
```

How you implement cors depends in part on which platform/service you use to serve your application. For example, Netlify and Firebase have two different ways of configuring CORS. Consult your vendor documentation for more information.

## Key pairs

Blockstack Auth makes extensive use of public key cryptography. Blockstack uses ECDSA with the `secp256k1` curve. The following sections describe the various public-private key pairs used in the authentication process including:

* how they're generated, 
* where they're used 
* to whom the private key is disclosed.

{% include note.html content="The Blockstack JWT implementation is different from other implementations because of the underlying cryptography we employ. There are libraries in <a href='https://github.com/blockstack/jsontokens-js'>Javascript</a> and <a href='https://github.com/blockstack/ruby-jwt-blockstack'>Ruby</a> available on the Blockstack Github to allow you to work with these tokens." %}

### Transit private key

The transit private is an ephemeral key that is used to encrypt secrets that
need to be passed from the Blockstack Browser to the app during the
authentication process. It is randomly generated by the app at the beginning of
the authentication response.

The public key that corresponds to the transit private key is stored in a single
element array in the `public_keys` key of the authentication request token. The
Blockstack Browser encrypts secret data such as the app private key using this
public key and sends it back to the app when the user signs in to the app. The
transit private key signs the app authentication request.

### Blockstack username identity address private key

The identity address private key is derived from the user's keychain phrase and
is the private key of the Blockstack username that the user chooses to use to sign in
to the app. It is a secret owned by the user and never leaves the user's
instance of the Blockstack Browser. This private key signs the authentication
response token for an app to indicate that the user approves sign in to that
app.

### App private key

The app private key is an app-specific private key that is generated from the
user's identity address private key using the `domain_name` as input. It is
deterministic in that for a given Blockstack username and `domain_name`, the same
private key will be generated each time. The app private key is securely shared
with the app on each authentication, encrypted by the Blockstack Browser with
the transit public key.

## Scopes

Scopes define the information and permissions an app requests from the
user during authentication. Requested scopes may be any of the following:

| Scope |  Definition|
|---|---|
| `store_write` | Read and write data to the user's Gaia hub in an app-specific storage bucket. |
| `publish_data` | Publish data so that other users of the app can discover and interact with the user. |
| `email` | Requests the user's email if available. |

If no `scopes` array is provided to the `redirectToSignIn` or `makeAuthRequest`
functions, the default is to request `['store_write']`.

## Authentication tokens

The app and the Blockstack Browser communicate during the authentication flow by
passing back and forth two tokens, the `authRequest` and the `authResponse`
token. The requesting application sends the Blockstack Browser an `authRequest`
token. Once a user approves a sign in, the Blockstack Browser responds to the
application with an `authResponse` token.

These tokens are [JSON Web Tokens](https://jwt.io/), and they are passed via URL
query strings.

### JSON Web Token signatures

Blockstack's authentication tokens are based on the [RFC 7519 OAuth JSON Web Token (JWT)](https://tools.ietf.org/html/rfc7519)
with additional support for the `secp256k1` curve used by Bitcoin and many other
cryptocurrencies.

This signature algorithm is indicated by specifying `ES256K` in the token's
`alg` key, specifying that the JWT signature uses ECDSA with the secp256k1
curve. We provide both [JavaScript](https://github.com/blockstack/jsontokens-js)
and
[Ruby](https://github.com/blockstack/ruby-jwt-blockstack/tree/ruby-jwt-blockstack)
JWT libraries with support for this signing algorithm.

### Authentication request payload schema

``` JavaScript
const requestPayload = {
    jti, // UUID
    iat, // JWT creation time in seconds
    exp, // JWT expiration time in seconds
    iss, // legacy decentralized identifier generated from transit key
    public_keys, // single entry array with public key of transit key
    domain_name, // app origin
    manifest_uri, // url to manifest file - must be hosted on app origin
    redirect_uri, // url to which browser redirects user on auth approval - must be hosted on app origin
    version, // version tuple
    do_not_include_profile, // a boolean flag asking browser to send profile url instead of profile object
    supports_hub_url, // a boolean flag indicating gaia hub support
    scopes // an array of string values indicating scopes requested by the app
  }
```


### Authentication response payload schema

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

## `blockstack:` custom protocol handler

The `blockstack:` custom protocol handler is how Blockstack apps send their
authentication requests to the Blockstack Browser. When the Blockstack Browser
is installed on a user's computer, it registers itself as the handler for the
`blockstack:` customer protocol.

When an application calls
[`redirectToSignIn`](http://blockstack.github.io/blockstack.js/index.html#redirecttosignin)
or
[`redirectToSignInWithAuthRequest`](http://blockstack.github.io/blockstack.js/index.html#redirecttosigninwithauthrequest),
blockstack.js checks if a `blockstack:` protocol handler is installed and, if so,
redirects the user to `blockstack:<authRequestToken>`. This passes the
authentication request token from the app to the Blockstack Browser, which will
in turn validate the request and display an authentication dialog.


## Adding Blockstack Authentication to your app

The way you can add Blockstack Authentication to you app depends on whether your
app is a modern decentralized Blockstack App where code runs client-side without
trusted servers or a legacy client-server app where a server is trusted.

### Authentication in Client-side apps

This method is appropriate for decentralized client-side apps where the user's
zone of trust - the parts of the app that the user is trusting - begins and ends
with the code running on their own computer. In apps like these, any code the
app interacts with that's not on their own computer such as external servers
does not need to know who she is.

[Blockstack.js](https://github.com/blockstack/blockstack.js) provides API
methods that help you to implement Blockstack Authentication in your client-side
app.

#### Standard flow
The preferred way to implement authentication in these apps is to use the
standard flow. This flow hides much of the process behind a few easy function
calls and makes it very fast to get up and running.

In this process you'll use these four functions:

- [[redirectToSignIn]]
- [[isSignInPending]]
- [[handlePendingSignIn]]
- [[loadUserData]]

##### Starting the sign in process

When your app wants to start the sign in process, typically when the user clicks
a "Sign in with Blockstack" button, your app will call the [[redirectToSignIn]]
method of [blockstack.js](https://github.com/blockstack/blockstack.js).

This creates an ephemeral transit key, stores it in the web browser's
`localStorage`, uses it to create an authentication request token and finally
redirects the user to the Blockstack Browser to approve the sign in request.

##### Handling an authentication response

When a user approves a sign in request, the Blockstack Browser will return the signed authentication response token to the `redirectURI` specified in `redirectToSignIn`.

To check for the presence of this token, your app should call `isSignInPending`. If this returns `true`, the app should then call `handlePendingSignIn`. This decodes the token, returns the signed-in-user's data, and simultaneously storing it to `localStorage` so that it can be retrieved later with `loadUserData`.

```js
import * as blockstack from 'blockstack'

if (blockstack.UserSession.isSignInPending()) {
    blockstack.UserSession.handlePendingSignIn()
    .then(userData => {
        const profile = userData.profile
    })
}

```

#### Manual flow

Alternatively, you can manually generate your own transit private key and/or
authentication request token. This gives you more control over the experience.

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

### Authentication in client-server apps

*Note: Client-server authentication requires using a library written in the
language of your server app. There are private methods in blockstack.js that can
be accomplish this on node.js server apps, but they are not currently part of
our public, supported API.*

Using Blockstack Authentication in client-server apps is very similar to
client-side apps. You generate the authentication request using the same code in
the client as described above.

The main difference is that you need to verify the authentication response token
on the server after the user approves sign in to your app.

For an example of how verification can be done server side, take a look at the
[blockstack-ruby](https://github.com/blockstack/blockstack-ruby#to-verify-an-auth-response)
library.
