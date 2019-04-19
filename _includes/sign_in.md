For an application developer, the application flow is similar to the typical client-server flow used by centralized sign in services (e.g., OAuth). However, with Blockstack, the authentication flow happens entirely client-side.

A decentralized application (DApp) and the Blockstack Browser communicate during the authentication flow by passing back and forth two tokens. The requesting application sends the Blockstack Browser an `authRequest` token. Once a user approves a sign-in, the Blockstack Browser responds to the application with an `authResponse` token. These tokens are <a href="https://jwt.io/" target="\_blank">JSON Web Tokens</a>, and they are passed via URL query strings.

![](/storage/images/app-sign-in.png)

When a user chooses to **Sign in with Blockstack** on a DApp, it calls the `redirectToSignIn()` method which sends an  `authRequest` to the Blockstack Browser. Blockstack passes the token in via a URL query string in the `authRequest` parameter:

`https://browser.blockstack.org/auth?authRequest=j902120cn829n1jnvoa...`

When the Blockstack Browser receives the request, it generates an (`authResponse`) token to the application. This token includes three key pairs:

* an _ephemeral transit_ key 
* an _identity-address private_ key
* an _app-private key_

The ephemeral key is just used for the particular instance of the application, in this case to sign a sign-in request. It encrypts secrets that need to be passed from the Blockstack Browser to the app during the authentication process. 

The identity-address private key is derived from the user's keychain phrase. This key signs the authentication response token for an app to indicate that the user approves sign in to that app.

The app private key is application-specific. It is generated from the user's identity address private key using the `appDomain` as input. This app private key is also deterministic, meaning that for a given Blockstack ID and domain name, the same private key is generated each time. The app private key serves three functions:

* It is used to create the credentials that give an app access to the gaia hub storage bucket for that specific app.
* It is used in the end-to-end encryption of files stored for the app on the user's gaia hub.
* It serves as a cryptographic secret that apps can use to perform other cryptographic functions.

A Blockstack Core node also generates a public key token which is sent to the browser as an `authRequest` from the browser to the core node. 