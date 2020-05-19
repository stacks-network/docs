For an application developer, the application flow is similar to the typical client-server flow used by centralized sign in services (e.g., OAuth). However, with Blockstack, the authentication flow happens entirely client-side.

A decentralized application (DApp) and the Blockstack Browser communicate during the authentication flow by passing back and forth two tokens. The requesting application sends the Blockstack Browser an `authRequest` token. Once a user approves a sign-in, the Blockstack Browser responds to the application with an `authResponse` token. These tokens are <a href="https://jwt.io/" target="\_blank">JSON Web Tokens</a>, and they are passed via URL query strings.

![](/storage/images/app-sign-in.png)

When a user chooses to **Sign in with Blockstack** on a DApp, it calls the `doOpenAuth()` method which sends an  `authRequest` to the Blockstack Authenticator. Blockstack passes the token in via a URL query string in the `authRequest` parameter:

`https://app.blockstack.org/#/sign-up?authRequest=j902120cn829n1jnvoa...`

When the Blockstack Browser receives the request, it generates an (`authResponse`) token to the application using an _ephemeral transit key_ . The ephemeral transit key is just used for the particular instance of the application, in this case, to sign the `authRequest`. The application stores the ephemeral transit key during the request generation. The public portion of the transit key is passed in the `authRequest` token. The Blockstack Browser uses the public portion of the key to encrypt an _app-private key_ which is returned via the `authResponse`. 

During sign in, the Blockstack Browser generates the app-private key from the user's _identity-address private_ key and the application's `appDomain`. The app private key serves three functions:

* It is used to create the credentials that give an app access to the Gaia storage bucket for that specific app.
* It is used in the end-to-end encryption of files stored for the app in the user's Gaia storage.
* It serves as a cryptographic secret that apps can use to perform other cryptographic functions.

Finally, the app private key is deterministic, meaning that for a given user ID and domain name, the same private key is generated each time. 