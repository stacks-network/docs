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

## Start building with Blockstack Connect

Head over to the [Guide to Connect](get-started.html) for installation steps and usage guidelines.