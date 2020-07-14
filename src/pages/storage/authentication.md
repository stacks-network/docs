---
description: 'Storing user data with Blockstack'
---

# Authentication and Gaia

Blockstack authentication is a bearer token-based authentication system. From an app user's perspective, login similar to third-party authentication techniques that they're familiar with. For an app developer, the flow is unlike the typical client-server flow of centralized sign-in services such as OAuth. With Blockstack the authentication flow happens entirely client-side.

In this section, you get an overview of the authentication system and learn how Gaia fits into it.

## Authentication and Gaia

A decentralized application (DApp) and the Blockstack authenticator communicate during
the authentication flow by passing back and forth two tokens. The requesting
application sends the Blockstack authenticator an `authRequest` token. Once a user
approves a sign-in, the Blockstack authenticator responds to the application with an
`authResponse` token. These tokens are <a href="https://jwt.io/" target="\_blank">JSON Web Tokens</a>, and they are passed via
URL query strings.

When a user chooses to "Sign in with Blockstack" on your DApp, the `redirectToSignIn()` method sends the user to the Blockstack authenticator. The browser responds with an authentication token and an _app private key_.

![](/storage/images/app-sign-in.png)

The app private key is application-specific. It is generated from the user's identity address private key using the `appDomain` as input. This key is deterministic, meaning that for a given Blockstack ID and domain name, the same private key is generated each time. The app private key is securely shared with the app on each authentication and encrypted by the Blockstack authenticator. The key serves three functions, it:

- is used to create the credentials that give an app access to the Gaia hub storage bucket for that specific app
- is used in the end-to-end encryption of files stored for the app on the user's Gaia hub
- serves as a cryptographic secret that apps can use to perform other cryptographic functions

When an application writes to a Gaia hub, the authentication token, key, and the data are passed to the Gaia hub.

![Gaia writes](/storage/images/gaia-writes.png)

The token ensures the DApp has the authorization to write to the hub on the user's behalf.
