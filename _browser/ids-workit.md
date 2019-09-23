---
layout: usenew
description: Use a Blockstack ID with a DApp
permalink: /:collection/:path.html
---
# How does a Blockstack ID work?
{:.no_toc}

If you are user of a Blockstack ID, this page explains how your ID works in simple language. In some cases, you may have to learn a few new concepts.  

* TOC
{:toc}

## What happens when you create a primary Blockstack ID?

When you create an identity, that identity is registered on the Stacks blockchain. With the exception of sending or receiving STX crypto currency with the Stacks wallet software application, this is the only time workng with a DApp interacts with the Stacks blockchain. If you create an ID in the `id.blockstack` namespace it is free; if you want a primary name such as  `moxiegirl` or `moxiegirl.id` that name is not in the `id.blockstack` namespace and you pay a fee for it.

When you click *Create a new ID* you 

1. Request an available ID through onboarding.
2. Blockstack the new username on the Stacks blockchain for that `username` in the `id.blockstack` namespace.
3. Creates a profile for you on a Gaia hub. That profile includes:
   * An encrypted version of your private key
   * A public key that corresponds to your ID.
   * The location where your encrypted application data is stored on Gaia.
4. Returns a secret recovery key to you, the user.

## What is a Gaia Hub?

A Gaia hub is a server for storing data from a Blockstack application. Blockstack applications store this data for you and present it back to you. Data is typically encrypted but it doesn't have to be. If you 

## What is a sign in session?

You create a sign in session when you **Sign in with Blockstack** or **Create a new ID**. Your session is kept in your local browser and it includes this information from when you signed in.

* The Blockstack ID you entered when you signed in.
* Your public key from your profile on Gaia hub. The public key is used to authorize you on Blockstack 
* An encrypted authorization for the app from you. The authorization allows the app to read or to write data on your behalf. 

    {% include note.html content="The Blockstack Browser is a special application, you must grant it full authorization to read and write to your Gaia hub." %}

* The email you entered on sign in, this is a session email, it is not kept with your profile. 
* The password you entered on sign in, this a session password, it is not stored on Gaia.
  
A sign in session is a combination of Internet browser (Chrome or Safari for example) and a device. So, if you sign into an app on your desktop computer with Chrome you create one session. If you open Safari on that same desktop, you are starting a second session. And, if you go to that same app on a mobile phone and sign in with Safari, you have a third session. 

You can supply a different password and email for every sign in session. If you have multiple Blockstack IDs, you can also sign in with one ID on Safari and another ID on Chrome. 

## When you Sign in with Blockstack

1. When you Sign in with Blockstack from an application, you give your Blockstack ID and your key.
2. Blockstack checks if you have an existing sign in session, if you don't have a session, Blockstack ask you to provide new session information:

    * your ID which is stored in your profile on a Gaia hub
    * your key which is encrypted and stored with your profile
    * your email which is not stored and kept in the session until it is destroyed

3. If you have a session or after you create one, Blockstack asks you how you want to authorize the application. Applications may want to:

    * Read your data from your Gaia hub.
    * Write data for you to your Gaia hub.
    * 