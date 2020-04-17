---
layout: learn
permalink: /:collection/:path.html
---

# Guide to Blockstack Auth
{:.no_toc}

Blockstack Auth provides single sign on and authentication without third parties or remote servers. On this page, you'll get an overview of authentication from a developer and user perspective. The following topics are covered:

* TOC
{:toc}

## User experience flow

Blockstack Auth is a bearer token-based authentication system. From an application user's perspective, Blockstack authentication is similar to legacy third-party authentication techniques that they're familiar with. Applications present users with a **Sign in with Blockstack** button.

   ![](images/signwithblockstack.png)

Assume a user, Alice, clicks the **Sign in with Blockstack** button on an app. She is
redirected to her copy of the Blockstack Browser. The Blockstack sign-in dialog a user sees depends on
whether the user already has an existing Blockstack Browser session for their current device.

<img src="images/kingdom_notin.png" alt="">

Signing in with an identity is the means by which the user grants the DApp access. Access depends on the scope requested by the DApp. The default `store_write` scope allows the DApp to read the user profile and read/write user data for the DApp. Data is encrypted at a unique URL on a Gaia storage hub.

Alice can choose to authenticate and sign into the DApp with one of her Blockstack IDs by selecting the
ID. The Blockstack Browser shows Alice an approval dialog with information about the access the DApp requests:

* The origin your app was served from
* Your app's name
* Your app's logo
* The types of permissions and data your app is requesting

When she chooses an ID (or creates a new one), Alice is redirected back to the DApp where she is logged in.

## DApp authentication flow

{% include sign_in.md %}

## Scopes

Scopes define the permissions requested from, and that a user accepts, through the sign-in dialog.
DApps may request any of the following scopes:

| Scope          | Definition                                                                           |
| -------------- | ------------------------------------------------------------------------------------ |
| `store_write`  | Read and write data to the user's Gaia hub in an app-specific storage bucket.        |
| `publish_data` | Publish data so that other users of the app can discover and interact with the user. |
| `email`        | Requests the user's email if available.                                              |

The permissions scope should be specified through the <a href="https://blockstack.github.io/blockstack.js/classes/appconfig.html" target="\_blank">AppConfig</a> object. If no `scopes` array is provided to the `redirectToSignIn` or `makeAuthRequest`
functions, the default is to request `['store_write']`.

## blockstack: custom protocol handler

The `blockstack:` custom protocol handler is how Blockstack apps send their authentication requests to the Blockstack Browser. Users can have a Blockstack Browser installed locally on their device or they can use the web version of the Blockstack Browser. If the Blockstack Browser is installed on a user's computer, it registers itself as the handler for the `blockstack:` customer protocol.

When an application calls
[`redirectToSignIn`](http://blockstack.github.io/blockstack.js/index.html#redirecttosignin)
or
[`redirectToSignInWithAuthRequest`](http://blockstack.github.io/blockstack.js/index.html#redirecttosigninwithauthrequest),
blockstack.js checks if a `blockstack:` protocol handler is installed and, if so,
redirects the user to `blockstack:<authRequestToken>`. This passes the
authentication request token from the app to the local Blockstack Browser. If the local Blockstack Browser is not installed, the call is directed to the web version of the Blockstack Browser.

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
need to be passed from the Blockstack Browser to the app during the
authentication process. It is randomly generated by the app at the beginning of
the authentication response.

The public key that corresponds to the transit private key is stored in a single
element array in the `public_keys` key of the authentication request token. The
Blockstack Browser encrypts secret data such as the app private key using this
public key and sends it back to the app when the user signs in to the app. The
transit private key signs the app authentication request.

### Blockstack ID Identity address private key

The identity address private key is derived from the user's keychain phrase and
is the private key of the Blockstack ID that the user chooses to use to sign in
to the app. It is a secret owned by the user and never leaves the user's
instance of the Blockstack Browser. 

This private key signs the authentication response token for an app to indicate that the user approves sign in to that app.

### App private key

The app private key is an app-specific private key that is generated from the
user's identity address private key using the `domain_name` as input. It is
deterministic in that for a given Blockstack ID and `domain_name`, the same
private key is generated each time. 

The app private key is securely shared with the app on each authentication, encrypted by the Blockstack Browser with the transit public key.

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
    redirect_uri, // url to which browser redirects user on auth approval - must be hosted on app origin
    version, // version tuple
    do_not_include_profile, // a boolean flag asking browser to send profile url instead of profile object
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
    username, // blockstack id username (if any)
    core_token, // encrypted core token payload
    email, // email if email scope is requested & email available
    profile_url, // url to signed profile token
    hubUrl, // url pointing to user's gaia hub
    version // version tuple
  }
```

