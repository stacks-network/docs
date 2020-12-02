---
title: Authentication
description: Stacks Auth provides single sign on and authentication without third parties or remote servers.
images:
  large: /images/pages/authentication.svg
  sm: /images/pages/authentication-sm.svg
---

## Authentication flow

For an application developer, the application flow is similar to the typical client-server flow used by centralized sign in services (e.g., OAuth). However, with Stacks auth, the authentication flow happens entirely client-side.

A decentralized application and [the Blockstack App](https://github.com/blockstack/ux/tree/master/packages/app) communicate during the authentication flow by passing back and forth two tokens. The requesting application sends the Blockstack App an `authRequest` token. Once a user approves a sign-in, the Blockstack App responds to the application with an `authResponse` token. These tokens are <a href="https://jwt.io/" target="\_blank">JSON Web Tokens</a>, and they are passed via URL query strings.

![](/images/app-sign-in.png)

When a user chooses to authenticate a decentralized application, it calls the `doOpenAuth()` method which sends an `authRequest` to the Blockstack App. Stacks auth passes the token in via a URL query string in the `authRequest` parameter:

`https://app.blockstack.org/#/sign-up?authRequest=j902120cn829n1jnvoa...`

When the Blockstack App receives the request, it generates an (`authResponse`) token to the application using an _ephemeral transit key_ . The ephemeral transit key is just used for the particular instance of the application, in this case, to sign the `authRequest`. The application stores the ephemeral transit key during the request generation. The public portion of the transit key is passed in the `authRequest` token. The Blockstack App uses the public portion of the key to encrypt an _app-private key_ which is returned via the `authResponse`.

During sign in, the Blockstack App generates the app-private key from the user's _identity-address private_ key and the application's `appDomain`. The app private key serves three functions:

- It is used to create the credentials that give an app access to the Gaia storage bucket for that specific app.
- It is used in the end-to-end encryption of files stored for the app in the user's Gaia storage.
- It serves as a cryptographic secret that apps can use to perform other cryptographic functions.

Finally, the app private key is deterministic, meaning that for a given user ID and domain name, the same private key is generated each time.

## Scopes

Scopes define the permissions requested by an app for granting during authentication.

Apps may request any of the following scopes:

| Scope          | Definition                                                                           |
| -------------- | ------------------------------------------------------------------------------------ |
| `store_write`  | Read and write data to the user's Gaia hub in an app-specific storage bucket.        |
| `publish_data` | Publish data so that other users of the app can discover and interact with the user. |

The permissions scope should be specified through the [`AppConfig`](https://blockstack.github.io/stacks.js/classes/appconfig.html)
object. If no `scopes` array is provided to the `redirectToSignIn` or `makeAuthRequest` functions, the default is to request `['store_write']`.

## Manifest file

Decentralized apps have a manifest file. This file is based on the [W3C web app manifest specification](https://w3c.github.io/manifest/).
The following is an example manifest file.

```json
{
  "name": "Todo App",
  "start_url": "http://blockstack-todos.appartisan.com",
  "description": "A simple todo app build on Stacks",
  "icons": [
    {
      "src": "http://blockstack-todos.appartisan.com/logo.png",
      "sizes": "400x400",
      "type": "image/png"
    }
  ]
}
```

The Blockstack App retrieves the manifest file from the app during the authentication process and displays the
information in it such as the app `name` and to the user during sign in. The location of the app manifest file is specific
in the authentication request token and **must** be on the same origin as the app requesting authentication.

The manifest file **must** have [Cross-origin resource sharing (CORS) headers](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
that allow the manifest file to be fetched from any arbitrary source. This usually means returning a header like this:

```
Access-Control-Allow-Origin: *
```

How you implement CORS depends in part on which platform/service you use to serve your application. For example, Netlify
and Firebase have two different ways of configuring CORS. Consult your vendor documentation for more information.

## Key pairs

Stacks Auth makes extensive use of public key cryptography. Blockstack uses ECDSA with the `secp256k1` curve. The
following sections describe the three public-private key pairs used in the authentication process:

- how they're generated
- where they're used
- to whom the private key is disclosed

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
is the private key of the Stacks username that the user chooses to use to sign in
to the app. It is a secret owned by the user and never leaves the user's
instance of the Blockstack App.

This private key signs the authentication response token for an app to indicate that the user approves sign in to that app.

### App private key

The app private key is an app-specific private key that is generated from the
user's identity address private key using the `domain_name` as input. It is
deterministic in that for a given Stacks username and `domain_name`, the same
private key is generated each time.

The app private key is securely shared with the app on each authentication, encrypted by the Blockstack App with the transit public key.

## JSON Web Token signatures

Both the `authRequest` and the `authResponse` tokens are [JSON Web Tokens](https://jwt.io/), and they are passed via URL query strings.

Stacks authentication tokens are based on the [RFC 7519 OAuth JSON Web Token (JWT)](https://tools.ietf.org/html/rfc7519)
with additional support for the `secp256k1` curve used by Bitcoin and many other
cryptocurrencies.

This signature algorithm is indicated by specifying `ES256K` in the token's
`alg` key, specifying that the JWT signature uses ECDSA with the secp256k1
curve. Stacks auth provide both [JavaScript](https://github.com/blockstack/jsontokens-js)
and
[Ruby](https://github.com/blockstack/ruby-jwt-blockstack/tree/ruby-jwt-blockstack)
JWT libraries with support for this signing algorithm.

-> The Stacks JWT implementation is different from other implementations because of the underlying cryptography we employ. There are libraries in [Javascript](https://github.com/blockstack/jsontokens-js) and [Ruby](https://github.com/blockstack/ruby-jwt-blockstack) available on the Blockstack Github to allow you to work with these tokens.

### Example: authRequest payload schema

```jsx
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
  scopes, // an array of string values indicating scopes requested by the app
};
```

### Example: authResponse payload schema

```jsx
const responsePayload = {
  jti, // UUID
  iat, // JWT creation time in seconds
  exp, // JWT expiration time in seconds
  iss, // legacy decentralized identifier (string prefix + identity address) - this uniquely identifies the user
  private_key, // encrypted private key payload
  public_keys, // single entry array with public key
  profile, // profile object or null if passed by profile_url
  username, // Stacks username (if any)
  core_token, // encrypted core token payload
  email, // email if email scope is requested & email available
  profile_url, // url to signed profile token
  hubUrl, // url pointing to user's gaia hub
  version, // version tuple
};
```

## Decode authRequest

To decode the token and see what information it holds:

1. Copy the `authRequest` string from the URL.

   <img src="/images/copy-authRequest.png" alt="" />

2. Navigate to [jwt.io](https://jwt.io/).
3. Paste the full token there.

   The output should look similar to below:

   ```json
   {
     "jti": "f65f02db-9f42-4523-bfa9-8034d8edf459",
     "iat": 1555641911,
     "exp": 1555645511,
     "iss": "did:btc-addr:1ANL7TNdT7TTcjVnrvauP7Mq3tjcb8TsUX",
     "public_keys": ["02f08d5541bf611ded745cc15db08f4447bfa55a55a2dd555648a1de9759aea5f9"],
     "domain_name": "http://localhost:8080",
     "manifest_uri": "http://localhost:8080/manifest.json",
     "redirect_uri": "http://localhost:8080",
     "version": "1.3.1",
     "do_not_include_profile": true,
     "supports_hub_url": true,
     "scopes": ["store_write", "publish_data"]
   }
   ```

   The `iss` property is a decentralized identifier or `did`. This identifies the user and the user name to the application. The specific `did` is a `btc-addr`.

## User profiles

Profile data is stored using Gaia on the user's selected storage provider. An example of a `profile.json` file URL using
default provided storage:

```
https://gaia.blockstack.org/hub/1EeZtGNdFrVB2AgLFsZbyBCF7UTZcEWhHk/profile.json
```

Follow these steps to create and register a profile for a BNS username (`identifier`):

1. Create a JSON profile object
2. Split up the profile into tokens, sign the tokens, and put them in a token file
3. Create a zone file that points to the web location of the profile token file

```jsx
"account": [
	{
	  "@type": "Account",
	  "service": "twitter",
	  "identifier": "naval",
	  "proofType": "http",
	  "proofUrl": "https://twitter.com/naval/status/12345678901234567890"
	}
]
```

## Create a profile

```jsx
const profileOfNaval = {
  '@context': 'http://schema.org/',
  '@type': 'Person',
  name: 'Naval Ravikant',
  description: 'Co-founder of AngelList',
};
```

## Sign a profile as a single token

```jsx
import { wrapProfileToken, Person } from '@stacks/profiles';

const privateKey = 'e546ba96ee34220287d0c177418011addf8d71b32fb81ae8e33a1d7510fa5d0d01';

const person = new Person(profileOfNaval);
const token = person.toToken(privateKey);
const tokenFile = [wrapProfileToken(token)];
```

## Verify an individual token

```jsx
import { verifyProfileToken } from '@stacks/profiles';

try {
  const decodedToken = verifyProfileToken(tokenFile[0].token, publicKey);
} catch (e) {
  console.log(e);
}
```

## Recover a profile from a token file

```jsx
const recoveredProfile = Person.fromToken(tokenFile, publicKey);
```

## Validate profile schema

```jsx
const validationResults = Person.validateSchema(recoveredProfile);
```
