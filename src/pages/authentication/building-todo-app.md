---
title: Building a Todo app
description: Learn how to integrate authentication and data storage.
experience: beginners
duration: 30 minutes
tags:
  - tutorial
images:
  large: /images/pages/todo-app.svg
  sm: /images/pages/todo-app-sm.svg
---

# Building a Todo app

![What you'll be creating in this tutorial](/images/todo-list-app.png)

## Introduction

In this tutorial, you will learn about Stacks authentication and storage by installing,
running and reviewing the code for a "Todos" web app built with Blockstack and [React](https://reactjs.org/).

This app highlights the following platform functionality:

- Generate Secret Key with associated Blockstack username to authenticate app
- Add, edit and delete encrypted app data with Gaia
- Decrypt data on Gaia for public sharing by URL
- Unauthenticate and re-authenticate app with Secret Key

[Preview the app](https://todos.blockstack.org) or [view its code on GitHub](https://github.com/blockstack/blockstack-todos).

Existing familiarity with React is recommended for reviewing this app's code.

## Install and run the app

You must have recent versions of Git and [Node.js](https://nodejs.org/en/download/)
(v12.10.0 or greater) installed already.

### Step 1: Install the code and its dependencies

```bash
git clone https://github.com/blockstack/blockstack-todos
cd blockstack-todos
npm install
```

### Step 2: Run the application:

```bash
$ npm run start
```

You should see output similar to the following:

```bash
Compiled successfully!

You can now view bs-todo in the browser.

    http://localhost:3000/

Note that the development build is not optimized.
To create a production build, use npm run build.
```

### Step 3: Open your local browser to [`http://localhost:3000`](http://localhost:3000) if it doesn't open automatically.

You should see the app's landing page:

![The homepage of the todos app](/images/todos-home.png)

## Onboard into your first Stacks app

### Step 1: Choose **Get started** to start onboarding into the app.

The app displays a standardized introductory modal using
[Stacks Connect](https://github.com/blockstack/ux/tree/master/packages/connect), a JavaScript
library that makes it easy to integrate Stacks authentication into the UI of any web app.

![The Stacks Connect Modal](/images/todos-intro.png)

Below, you can see the relevant parts of the [React component](https://reactjs.org/docs/react-component.html)
that triggers this modal in [`src/components/Signin.jsx`](https://github.com/blockstack/blockstack-todos/blob/master/src/components/Signin.jsx):

```js
// src/components/Signin.jsx

import { useConnect } from '@stacks/connect';

export const Signin = () => {
  const { doOpenAuth } = useConnect();

  return <Button onClick={() => doOpenAuth()}>Get Started</Button>;
};
```

This component imports the [React hook](https://reactjs.org/docs/hooks-overview.html)
[`useConnect`](https://github.com/blockstack/ux/blob/master/packages/connect/src/react/hooks/use-connect.ts)
from the Stacks Connect library.

`useConnect` returns many helper functions such as
[`doOpenAuth`](https://github.com/blockstack/ux/blob/master/packages/connect/src/react/hooks/use-connect.ts#L33),
which triggers this modal upon click of the "Get started" button.

The modal is designed to prepare new users for a different type of relationship with
Stacks apps, one in which they authenticate with a _Secret Key_ that's used to encrypt
their private data.

The modal displays the app's name and icon as configured in
[`src/components/App.jsx`](https://github.com/blockstack/blockstack-todos/blob/master/src/components/App.jsx#L26):

```jsx
// src/components/App.jsx

appDetails: {
    name: 'Blockstack App',
    icon: window.location.origin + '/favicon.ico'
}

```

This component loads the [`UserSession`](https://blockstack.github.io/blockstack.js/classes/usersession.html)
module from a second Stacks library called [@stacks/auth](https://github.com/blockstack/blockstack.js/),
which complements Stacks Connect by providing an API for many protocol-level operations, such as for
authentication and storage.

```js
import { UserSession } from '@stacks/auth';
import { appConfig } from '../assets/constants';

// ...

const userSession = new UserSession({ appConfig });
```

This module handles user session operations and is initiated using the
[`appConfig`](https://github.com/blockstack/blockstack-todos/blob/master/src/assets/constants.js#L3) object,
which contains an array of [scopes](/authentication/overview#scopes) that indicate just what permissions
to grant during authentication:

```js
// src/assets/constants.js

export const appConfig = new AppConfig(['store_write', 'publish_data']);
```

The `appDetails` and `userSession` objects are joined by the callback function
[`finished`](https://github.com/blockstack/blockstack-todos/blob/master/src/components/App.jsx#L31)
in configuring Stacks Connect for authentication with the `authOptions` object:

```js
// src/components/App.jsx

finished: ({ userSession }) => {
  this.setState({ userData: userSession.loadUserData() });
};
```

This function simply saves data about the user into the app's state upon authentication.

Further down in the component we see in
[`componentDidMount`](https://github.com/blockstack/blockstack-todos/blob/master/src/components/App.jsx#L46)
that it checks upon mount to either process completion of authentication with `userSession.handlePendingSignIn()`
or otherwise load session data into app state as above with `userSession.isUserSignedIn()`:

```jsx
// src/components/App.jsx

componentDidMount() {
  if (userSession.isSignInPending()) {
    userSession.handlePendingSignIn().then((userData) => {
      window.history.replaceState({}, document.title, "/")
      this.setState({ userData: userData})
    });
  } else if (userSession.isUserSignedIn()) {
    this.setState({ userData: userSession.loadUserData() });
  }
}
```

### Step 2: Choose **Get started** to generate a _Secret Key_.

The app triggers a popup window in which [the Stacks App](https://github.com/blockstack/ux/tree/master/packages/app)
is loaded from [`app.blockstack.org`](http://app.blockstack.org/) and begins generating a new _Secret Key_.

![What the UI looks like when a new ID is generated](/images/todos-generation.svg)

### Step 3: Choose **Copy Secret Key** to copy your _Secret Key_ to the clipboard.

The _Secret Key_ is a unique 12-word [mnemonic phrase](https://en.bitcoinwiki.org/wiki/Mnemonic_phrase) that
empowers the user not only to access Stacks apps securely and independently. It's also used to encrypt
all of the private data they create and manage with Stacks apps.

_Secret Keys_ are like strong passwords. However, they can never be recovered if lost or reset if stolen.
As such, it's paramount that users handle them with great care.

![An example of a secret key](/images/todos-copy-secret-key.svg)

### Step 4: Choose **I've saved it** to confirm you've secured your _Secret Key_ in a suitable place.

![An example of the I've saved it screen](/images/todos-ive-saved-it.svg)

### Step 5: Enter a username value and choose **Continue**

The username will be used by the app to generate a URL for sharing your todos, should you choose to make them public.

It is registered on the Stacks blockchain with the [Stacks Naming System (SNS)](/core/naming/introduction)
and associated with your _Secret Key_.

![Choosing a user name example](/images/todos-username.svg)

### Done: You've now completed onboarding into the app!

## Add, edit and delete todos privately

Once you've authenticated the app, you can can start adding todos by entering values into the "Write your to do"
field and hitting "Enter".

![The authenticated view of the todos app](/images/todos-home-authenticated.svg)

The data for all todos are saved as JSON to the Gaia hub linked to your Secret Key using the
[`putFile`](http://blockstack.github.io/blockstack.js/globals.html#putfile) method of the `userSession` object in the
[`src/assets/data-store.js`](https://github.com/blockstack/blockstack-todos/blob/master/src/assets/data-store.js#L26) module:

```jsx
import { Storage } from '@stacks/storage';

export const saveTasks = async (userSession, tasks, isPublic) => {
  const storage = new Storage(userSession);
  await storage.putFile(TASKS_FILENAME, JSON.stringify({ tasks, isPublic }), {
    encrypt: !isPublic,
  });
};
```

These todos are subsequently loaded using the [`getFile`](http://blockstack.github.io/blockstack.js/globals.html#getfile)
method of the same object in the same module:

```jsx
import { Storage } from '@stacks/storage';

export const fetchTasks = async (userSession, username) => {
  const storage = new Storage(userSession);
  const tasksJSON = await storage.getFile(TASKS_FILENAME, {
    decrypt: false,
    username: username || undefined,
  });
  // code to format and return the tasks
};
```

By default, the `putFile` and `getFile` methods automatically encrypt data when saved and decrypt it when retrieved,
using the user's Secret Key. This ensures that only the user has the ability to view this data.

When deleting a todo, the same `putFile` method is used to save a new JSON array of todos that excludes the deleted todo.

## Publish your todos publicly

Select "Make public" to make your todos accessible to the public for sharing via URL.

![Public todos view](/images/todos-public.svg)

This will call `saveTasks` with the `isPublic` parameter set to `true`, which is used to disable encryption when using `putFile`.

The app will now show all of your todos to anyone who visits the URL displayed with your Stacks username as a suffix.

## Sign out and see your public tasks

Select "Sign out" to deauthenticate the app with your Stacks account.

This triggers an event, which
[under the hood](https://github.com/blockstack/blockstack-todos/blob/master/src/components/Header.jsx#L47)
calls the [`signUserOut` method](https://blockstack.github.io/blockstack.js/classes/usersession.html#signuserout)
of the `UserSession` object.

Now, visit the URL that was provided to you when you made your tasks public. This url is of the format `/todos/:username`, so if your username is `jane_doe.id.blockstack`, the URL would be [`localhost:3000/todos/jane_doe.id.blockstack`](http://localhost:3000/todos/jane_doe.id.blockstack).

When you visit this page, the `TodoList.jsx` component detects that there is a username in the URL.
When there is a username, it calls `fetchTasks`, this time providing the `username` argument. This `username`
option is then passed to `getFile`, which will lookup where that user's tasks are stored.

## Sign back in

At this point, you will be logged out from the app but not you'll still have an active session with the Stacks
app itself on [app.blockstack.org](https://app.blockstack.org). Navigate to app.blockstack.org and select "Sign out" there if you want to deauthenticate the Stacks app as well.

Once signed out, select "Sign in" to sign back in with your _Secret Key_.

If you've previously deauthenticated the Stacks app, you'll see a prompt to enter your _Secret Key_:

![An example of a sign in screen](/images/todos-sign-in.svg)

The above screen will be ommitted if you have an active session with the Stacks app already.

Then you'll be presented with the option to select an existing username associated with your _Secret Key_ or
create a new one if you wish to authenticate the app with a different identity and data set:

![An example of the choose an account screen](/images/todos-choose-account.svg)

You'll now see your todos as an authenticated user for the username you've chosen.

## Learn more

Read [the Stacks Connect guide](/authentication/connect) and
[the stacks.js reference](https://blockstack.github.io/blockstack.js/) to learn more about the
libraries used in this tutorial.
