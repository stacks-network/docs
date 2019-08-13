---
layout: storage
description: "Storing user data with Blockstack"
permalink: /:collection/:path.html
---
# Hubs and user choice

Blockstack operates a default Gaia storage hub at `https://hub.blockstack.org`.
Individuals or organizations may also run their own hubs, either as a for-profit
service or for other reasons.

## Background

Each user with an identity in the Blockstack Network has a Gaia hub
configured on their profile. New users that create identities with the
Blockstack Browser automatically are given storage on this default hub. For a
user to have a storage hub other than this default, the user must create an
identity through an application that enables storage hub selection.

{% include note.html content="Users with existing identities cannot yet migrate
their data from one hub to another." %}

## Enable the Gaia hub URL option for new users

A major principle of Blockstack applications is that DApps do not store or
replicated user data. Through the Gaia feature, Blockstack seeks to empower
users to choose where to store their data and how they manage it.

As a step towards fulfilling this principle, DApp developers can configure their
application to prompt new users to provide a Gaia hub URL. An application with
this feature enabled presents users creating an identity for the first time
with this prompt:

![Official provider](/storage/images/official-provider.jpeg)

Users can choose to **Use Blockstack's official provider** or **Use a different provider**.  Choosing the non-default option prompts the user with the following:

![Different provider](/storage/images/different-provider.png)

Users can enter the HTTPS address of a hub hosted by an entity other than
Blockstack. Once the user submits the above form, they continue through the
standard identity creation. As they use DApps on the Blockstack Network, all
their data is stored in this storage hub and not the default Blockstack hub.

## Enabling hub selection in your DApp

To enable this feature, you must ensure your DApp is using the latest version of the blockstack.js library. Instead of the default flow `redirectToSignIn()` method, you must use the `makeAuthRequest()` method. This method takes the following parameters:

<dl class="uk-description-list">
   <dt class="uk-text-lowercase">
      <code>transitPrivateKey(String = generateAndStoreTransitKey())</code>
   </dt>
   <dd>A HEX encoded transit private key.</dd>
   <dt class="uk-text-lowercase">
      <code>redirectURI(String = `${window.location.origin}/`)</code>
   </dt>
   <dd>Location to redirect the user to after sign in approval.</dd>
   <dt class="uk-text-lowercase">
      <code>manifestURI(String = `${window.location.origin}/manifest.json`)</code>
   </dt>
   <dd>
      Location of this app's manifest file.
      </dd>
   <dt class="uk-text-lowercase">
      <code>scopes (Array = DEFAULT_SCOPE)</code>
   </dt>
   <dd>The permissions this app is requesting.</dd>
   <dt class="uk-text-lowercase">
      <code>appDomain(String = window.location.origin)</code>
   </dt>
   <dd>The origin of this app.</dd>
   <dt class="uk-text-lowercase">
      <code>expiresAt(Number = nextHour().getTime())</code>
   </dt>
   <dd>The time at which this request is no longer valid.</dd>
   <dt class="uk-text-lowercase">
      <code>extraParams(Object = {})</code>
   </dt>
   <dd>Any extra parameters to pass to the authenticator. Use this to pass options that aren't part of the Blockstack authentication specification, but might be supported by special authenticators.</dd>
</dl>

To ensure your DApps identity creation flow includes the Gaia URL, modify the `makeAuthRequest()` method to apply the  `solicitGaiaHubUrl` parameter with value `true` when executing the method:

```javascript
import {
  makeAuthRequest,
  redirectToSignInWithAuthRequest
} from 'blockstack';

const authRequest = makeAuthRequest(
  generateAndStoreTransitKey(),
  'http://localhost:8080/',
  'http://localhost:8080/manifest.json',
  ['store_write', 'publish_data'],
  'http://localhost:8080/',
  nextHour().getTime(), {
    solicitGaiaHubUrl: true
  } // new options param
);
redirectToSignInWithAuthRequest(authRequest);
```

You can also pass a suggested Gaia storage hub URL also. For example, you might
do this if you have a corporate client whose employees would all like to use
your application with a company-run Gaia hub. To do this, you provide an
additional `recommendedGaiaHubUrl` value alongside the `solicitGaiaHubUrl`


## Related information
{:.no_toc}

[Hello, Hub Choice Tutorial](hello-hub-choice.html) for a tutorial on using the [`makeAuthRequest()`](https://blockstack.github.io/blockstack.js/#makeauthrequest) method.
