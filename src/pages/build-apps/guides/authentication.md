---
title: Authentication
description: Register and sign in users with identities on the Stacks blockchain
experience: beginners
tags:
  - tutorial
images:
  large: /images/pages/write-smart-contracts.svg
  sm: /images/pages/write-smart-contracts-sm.svg
---

## Introduction

This guide explains how to authenticate users with [the Stacks Connect protocol](/build-apps/references/stacks-connect) by implementing the `connect` package of [Stacks.js](https://blockstack.github.io/stacks.js/).

Authentication provides a way for users to identify themselves to an app while retaining complete control over their credentials and personal details. It can be integrated alone or used in conjunction with [transaction signing](/build-apps/tutorials/transaction-signing) and [data storage](/build-apps/tutorials/data-storage), for which it is a prerequisite.

Users who register for your app can subsequently authenticate to any other app with support for the [Blockchain Naming System](/build-apps/references/bns) and vice versa.

See [the Todos app tutorial](/build-apps/tutorials/todos) for a concrete example of this functionality in practice.

## Initiate authentication flow

```js
import { AppConfig, UserSession, showConnect } from '@stacks/connect';

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

function authenticate() {
  showConnect({
    appDetails: {
      name: 'My App',
      icon: window.location.origin + '/my-app-logo.svg',
    },
    redirectTo: '/',
    finished: () => {
      window.location.reload();
    },
    userSession: userSession,
  });
}
```

## Handle pending sign in (still needed??)

```jsx
import { AppConfig, UserSession, showConnect } from '@stacks/connect';

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

function componentDidMount() {
  if (userSession.isSignInPending()) {
    userSession.handlePendingSignIn().then(userData => {
      window.history.replaceState({}, document.title, '/');
      this.setState({ userData: userData });
    });
  } else if (userSession.isUserSignedIn()) {
    this.setState({ userData: userSession.loadUserData() });
  }
}
```
