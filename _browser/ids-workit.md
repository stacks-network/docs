---
layout: usenew
description: Use a Blockstack ID with a DApp
permalink: /:collection/:path.html
---
# How does a Blockstack ID work?


## What happens when you create a primary Blockstack ID?

When you create an identity, that identity is registered on the Stacks blockchain. With the exception of sending or receiving STX crypto currency with the Stacks wallet software application, this is the only time workng with a DApp interacts with the Stacks blockchain. If you create an ID in the `id.blockstack` namespace it is free; if you want a primary name such as  `moxiegirl` or `moxiegirl.id` that name is not in the `id.blockstack` namespace and you pay a fee for it.

When you click *Create a new ID* you 

1. Request an available ID through onboarding.
2. Blockstack the new username on the Stacks blockchain for that `username` in the `id.blockstack` namespace.
3. Creates a profile for you on a Gaia server. That profile includes:
   * an encrypted version of your private key
   * a public key that corresponds to your ID.
   * the location where your encrypted application data is stored on Gaia.
4. Returns a secret recovery key to you, the user.

## What is a sign in session?

A sign in session is a combination of Internet browser (Chrome or Safari for example) and a device. So, if you sign into an app on your desktop computer with Chrome you create one session. If you open Safari on that same desktop, you are starting a second session. And, if you go to that same app on a mobile phone and sign in with Safari, you have a third session.

Your session is kept in your local browser and it includes this information from the sign in process:

* the Blockstack ID you entered
* Your public key from your profile on Gaia hub. The public key was 
* An encrypted authorization for the app from you. The authorization allows the app to read or to write data on your behalf.
* The email you entered on sign in. 




## When you Sign in with Blockstack

1. When you Sign in with Blockstack from an application, you give your Blockstack ID and your key.
2. Blockstack checks to see if you have an existing sign in session from that browser, if you don't have a session, Blockstack ask you to provide:

    * your ID which is stored in your profile on a Gaia hub
    * your key which is encrypted and stored with your profile
    * your email which is not stored and kept in the session until it is destroyed


   
   

3. If you have a session Blockstack users that session to 