# Authentication

### Introduction

This guide explains how authentication is performed on the Stacks blockchain.

Authentication provides a way for users to identify themselves to an app while retaining complete control over their credentials and personal details.

Users who register for your app can subsequently authenticate to any other app with support for the [Bitcoin Name System](bitcoin-name-system.md) and vice versa.

### Web2 vs Web3 Authentication

If you come from the web2 world, you are likely used to authenticating with usernames and passwords, where the user's info is stored in a database. Upon entering the password, it is hashed and compared to the hash stored in the database and, if it matches, the user is logged in.

Web3 authentication works a bit differently. One of the core philosophies of web3 is data ownership, which means users are in control of their data, including their authentication.

Authentication in the Bitcoin and Stacks world makes use of cryptography to generate private keys, public keys and addresses.

We'll go over the basics here, but if you want to dig in, [Learn Me a Bitcoin](https://learnmeabitcoin.com/beginners/guide/keys-addresses/) is a great place to start.

To generate a Stacks account, we generate a private key from a 24 word mnemonic phrase, as discussed in the previous section. This private key is then used to generate a public key using a one-way hash function. Meaning you can derive a public key from a private key, but not vice versa.

A user's private key is their main source of security and is used to authenticate them. Do not lose your private key.

So, when I use a wallet app like [Leather](https://leather.io) and I want to use it to authenticate with a dapp like StackingDAO, what I am doing is that I am giving my wallet my private key, proving that I own the corresponding address.

The wallet will then pass that information (my address and public key) to the app along with a signature.

A signature can be thought of as proof that I own the private key without actually revealing the private key. That mechanism is how I can use the same wallet and address to log in to any app that supports Stacks authentication.

Third Web has a great [conceptual primer](https://blog.thirdweb.com/web3-auth/) on web3 authentication.

For a more practical introduction, take a look at the [Quickstart tutorial ](../../guides-and-tutorials/hello-stacks-quickstart-tutorial.md)and [Hiro's Stacks.js docs](https://docs.hiro.so/stacks/connect/guides/authenticate-users).

### How it works

The authentication flow with Stacks is similar to the typical client-server flow used by centralized sign in services (for example, OAuth). However, with Stacks the authentication flow happens entirely client-side.

{% hint style="info" %}
This explanation is here so you can understand how this process works, but the bulk of this functionality is handled by the wallet and the JS library you use. Take a look at the [Stacks.js docs](https://docs.hiro.so/stacks/stacks.js/concepts/accounts-and-addresses) for more info.
{% endhint %}

An app and authenticator, such as the [Leather wallet](https://leather.io), communicate during the authentication flow by passing back and forth two tokens. The requesting app sends the authenticator an `authRequest` token. Once a user approves authentication, the authenticator responds to the app with an `authResponse` token.

These tokens are based on [a JSON Web Token (JWT) standard](https://tools.ietf.org/html/rfc7519) with additional support for the `secp256k1` curve used by Bitcoin and many other cryptocurrencies. They are passed via URL query strings.

When a user chooses to authenticate an app, it sends the `authRequest` token to the authenticator via a URL query string with an equally named parameter:

`https://wallet.hiro.so/...?authRequest=j902120cn829n1jnvoa...`

When the authenticator receives the request, it generates an `authResponse` token for the app using an _ephemeral transit key_ . The ephemeral transit key is just used for the particular instance of the app, in this case, to sign the `authRequest`.

The app stores the ephemeral transit key during request generation. The public portion of the transit key is passed in the `authRequest` token. The authenticator uses the public portion of the key to encrypt an _app private key_ which is returned via the `authResponse`.

The authenticator generates the app private key from the user's _identity address private key_ and the app's domain. The app private key serves three functions:

1. It is used to create credentials that give the app access to a storage bucket in the user's Gaia hub
2. It is used in the end-to-end encryption of files stored for the app in the user's Gaia storage.
3. It serves as a cryptographic secret that apps can use to perform other cryptographic functions.

Finally, the app private key is deterministic, meaning that the same private key will always be generated for a given Stacks address and domain.

### Key pairs

Authentication with Stacks makes extensive use of public key cryptography generally and ECDSA with the `secp256k1` curve in particular.

The following sections describe the three public-private key pairs used, including how they're generated, where they're used and to whom private keys are disclosed.

#### Transit private key

The transit private is an ephemeral key that is used to encrypt secrets that need to be passed from the authenticator to the app during the authentication process. It is randomly generated by the app at the beginning of the authentication response.

The public key that corresponds to the transit private key is stored in a single element array in the `public_keys` key of the authentication request token. The authenticator encrypts secret data such as the app private key using this public key and sends it back to the app when the user signs in to the app. The transit private key signs the app authentication request.

#### Identity address private key

The identity address private key is derived from the user's keychain phrase and is the private key of the Stacks username that the user chooses to use to sign in to the app. It is a secret owned by the user and never leaves the user's instance of the authenticator.

This private key signs the authentication response token for an app to indicate that the user approves sign in to that app.

#### App private key

The app private key is an app-specific private key that is generated from the user's identity address private key using the `domain_name` as input.

The app private key is securely shared with the app on each authentication, encrypted by the authenticator with the transit public key. Because the transit key is only stored on the client side, this prevents a man-in-the-middle attack where a server or internet provider could potentially snoop on the app private key.
