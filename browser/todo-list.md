---

description: Single-page application with Blockstack

---
# Tutorial for App Integration
{:.no_toc}

In this tutorial, you will learn about Blockstack authentication and storage by installing, running and reviewing the code for a "Todos" web app built with Blockstack and [React](https://reactjs.org/).

This app highlights the following platform functionality:

- Generate Secret Key with associated Blockstack username to authenticate app
- Add, edit and delete encrypted app data with Gaia
- Decrypt data on Gaia for public sharing by URL
- Unauthenticate and re-authenticate app with Secret Key

[Preview the app](https://todos.blockstack.org) or [view its code on GitHub](https://github.com/blockstack/blockstack-todos).

Existing familiarity with React is recommended for reviewing this app's code.

* TOC
{:toc}

### Install and run the app

You must have recent versions of Git and [Node.js](https://nodejs.org/en/download/) (v12.10.0 or greater) installed already.


1. Install the code and its dependencies:

    ```
    git clone https://github.com/blockstack/blockstack-todos
    cd blockstack-todos
    npm install
    ```

2. Run the application:

    ```bash
    $ npm run start
    ```
    
    You should see output similar to the following:

    ```bash
      Compiled successfully!

      You can now view bs-todo in the browser.

        http://127.0.0.1:3000/

      Note that the development build is not optimized.
      To create a production build, use npm run build.
      ```

2. Open your local browser to `http://localhost:3000` if it doesn't open automatically.
  
    You should see the app's landing page:

    ![](images/todos-home.png)

### Onboard into your first Blockstack app

1. Choose **Get started** to start onboarding into the app.

    The app displays a standardized introductory modal using [Blockstack Connect](https://github.com/blockstack/ux/tree/master/packages/connect), a JavaScript library that makes it easy to integrate Blockstack into the UI of any web app.

    ![](images/todos-intro.svg)

    The following [React component](https://reactjs.org/docs/react-component.html)  triggers this modal in [`src/components/Signin.js`](https://github.com/blockstack/blockstack-todos/blob/master/src/components/Signin.js):

    ```
    import React from 'react';
    import '../styles/Signin.css'
    import { useConnect } from '@blockstack/connect';

    export const Signin = () => {
      const { doOpenAuth } = useConnect();

      return (
        <div className="panel-landing" id="section-1">
          <h1 className="landing-heading">Hello, Blockstack!</h1>
          <p className="lead">
            <button
              className="btn btn-primary btn-lg"
              id="signin-button"
              onClick={() => doOpenAuth()}
            >
              Sign In with Blockstack
            </button>
          </p>
        </div>
      );
    }

    export default Signin;

    ```

    This component imports the [React hook](https://reactjs.org/docs/hooks-overview.html) [`useConnect`](https://github.com/blockstack/ux/blob/master/packages/connect/src/react/hooks/use-connect.ts) from the Blockstack Connect library.

    `useConnect` returns many helper functions such as [`doOpenAuth`](https://github.com/blockstack/ux/blob/5934829a40338ac269b80783912c8dad17af1962/packages/connect/src/react/hooks/use-connect.ts#L33), which triggers this modal upon click of the "Get started" button.

    The modal is designed to prepare new users for a different type of relationship with Blockstack apps, one in which they authenticate with a *Secret Key* that's used to encrypt their private data.

    The modal displays the app's name and icon as configured in [`src/components/App.js`](https://github.com/blockstack/blockstack-todos/blob/f6ab7b38f3f9bd98a900c7f285da4f4dd9768d60/src/components/App.js#L26):

    ```

      appDetails: {
        name: 'Blockstack App',
        icon: window.location.origin + '/favicon.ico'
      }

    ```

    This component loads the [`UserSession`](https://blockstack.github.io/blockstack.js/classes/usersession.html) module from a second Blockstack library called [blockstack.js](https://github.com/blockstack/blockstack.js/), which complements Blockstack Connect by providing an API for many protocol-level operations, such as for authentication and storage.

    ```

    import { UserSession } from 'blockstack';
    import { appConfig } from '../assets/constants'

    ...

    const userSession = new UserSession({ appConfig })

    ```

    This module handles user session operations and is initiated using the [`appConfig`](https://github.com/blockstack/blockstack-todos/blob/f6ab7b38f3f9bd98a900c7f285da4f4dd9768d60/src/assets/constants.js#L3) object, which contains an array of [scopes](/develop/overview_auth.html#scopes) that indicate just what permissions to grant during authentication:

    ```
    export const appConfig = new AppConfig(['store_write', 'publish_data'])
    ```

    The `appDetails` and `userSession` objects are joined by the callback function [`finished`](https://github.com/blockstack/blockstack-todos/blob/f6ab7b38f3f9bd98a900c7f285da4f4dd9768d60/src/components/App.js#L31) in configuring Blockstack Connect for authentication with the `authOptions` object:

    ```
    finished: ({ userSession }) => {
      this.setState({ userData: userSession.loadUserData() });
    }

    ```

    This function simply saves data about the user into the app's state upon authentication.

    Further down in the component we see in [`componentDidMount`](https://github.com/blockstack/blockstack-todos/blob/f6ab7b38f3f9bd98a900c7f285da4f4dd9768d60/src/components/App.js#L46) that it checks upon mount to either process completion of authentication with `userSession.handlePendingSignIn()` or otherwise load session data into app state as above with `userSession.isUserSignedIn()`:

    ```
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


2. Choose **Get started** to generate a *Secret Key*.

    The app triggers a popup window in which [the Blockstack App](https://github.com/blockstack/ux/tree/master/packages/app) is loaded from [`app.blockstack.org`](http://app.blockstack.org/) and begins generating a new *Secret Key*.

    ![](images/todos-generation.svg)

3. Choose **Copy Secret Key** to copy your *Secret Key* to the clipboard.

    The *Secret Key* is a unique 12-word [mnemonic phrase](https://en.bitcoinwiki.org/wiki/Mnemonic_phrase) that empowers the user not only to access Blockstack apps securely and independently. It's also used to encrypt all of the private data they create and manage with Blockstack apps.

    *Secret Keys* are like strong passwords. However, they can never be recovered if lost or reset if stolen. As such, it's paramount that users handle them with great care.

   ![](images/todos-copy-secret-key.svg)

4. Choose **I've saved it** to confirm you've secured your *Secret Key* in a suitable place.

   ![](images/todos-ive-saved-it.svg)

5. Enter a username value and choose **Continue**

   The username will be used by the app to generate a URL for sharing your todos, should you choose to make them public.

   It is registered on the Stacks blockchain with the [Blockstack Naming System (BNS)](/core/naming/introduction.html) and associated with your *Secret Key*.

   ![](images/todos-username.svg)

6. You've now completed onboarding into the app!

### Add, edit and delete todos privately

Once you've authenticated the app, you can can start adding todos by entering values into the "Write your to do" field and hitting "Enter".

![](images/todos-home-authenticated.svg)

The data for all todos are saved as JSON to the Gaia hub linked to your Secret Key using the [`putFile`](http://blockstack.github.io/blockstack.js/globals.html#putfile) method of the `userSession` object in the [`src/components/Profile.js`](https://github.com/blockstack/blockstack-todos/blob/f6ab7b38f3f9bd98a900c7f285da4f4dd9768d60/src/components/Profile.js#L50) component:

```
saveTasks(tasks, encrypt) {
  const options = { encrypt: encrypt ? true : encrypt };
  this.props.userSession.putFile(TASKS_FILENAME, JSON.stringify(tasks), options);
}
```

These todos are subsequently loaded using the [`getFile`](http://blockstack.github.io/blockstack.js/globals.html#getfile) method of the same object in the same component:

```
loadTasks() {
  const options = { decrypt: true };
  this.props.userSession.getFile(TASKS_FILENAME, options)
  .then((content) => {
    if(content) {
      const tasks = JSON.parse(content);
      this.setState({tasks});
    } 
  })
}
```

By default, the `putFile` and `getFile` methods automatically encrypt data when saved and decrypt it when retrieved, using the user's Secret Key. This ensures that only the user has the ability to view this data.

When deleting a todo, the same `putFile` method is used to save a new JSON array of todos that excludes the deleted todo.

### Publish your todos publicly

Select "Make public" to make your todos accessible to the public for sharing via URL.

![](images/todos-public.svg)

This will call the [`makePublic`](#) method of the `Profile.js` component, which in turn calls `saveTasks` with the `encrypt` parameter set to `false`, which is used to disable encryption when using `putFile`:

```
makePublic() {
  const tasks = remove(e.currentTarget.dataset.index, this.state);
  this.saveTasks(tasks, false);
}

saveTasks(tasks, encrypt) {
  const options = { encrypt: encrypt ? true : encrypt };
  this.props.userSession.putFile(TASKS_FILENAME, JSON.stringify(tasks), options);
}
```

The app will now show all of your todos to anyone who visits the URL displayed with your Blockstack username as a suffix.


### Sign out and back in

Select "Sign out" to deauthenticate the app with your Blockstack account.

This will call the [`handleSignOut`](https://github.com/blockstack/blockstack-todos/blob/6f9d7fa3cd2c13ab93a016ba9c3095a2216f3948/src/components/App.js#L17) method of the `App.js` component, which will call the `signUserOut` method of the `UserSession` object:

```
handleSignOut(e) {
  e.preventDefault();
  this.setState({ userData: null });
  userSession.signUserOut(window.location.origin);
}
```

This will deauthenticate the app but not your session with the Blockstack app itself on [app.blockstack.org](https://app.blockstack.org). Navigate to app.blockstack.org and select "Sign out" there if you want to deauthenticate the Blockstack app as well.

Once signed out, select "Sign in" to sign back in with your *Secret Key*.

If you've previously deauthenticated the Blockstack app, you'll see a prompt to enter your *Secret Key*:

![](images/todos-sign-in.svg)

The above screen will be ommitted if you have an active session with the Blockstack app already.

Then you'll be presented with the option to select an existing username associated with your *Secret Key* or create a new one if you wish to authenticate the app with a different identity and data set:

![](images/todos-choose-account.svg)

You'll now see your todos as an authenticated user for the username you've chosen.

## Learn more

Read [the Blockstack Connect guide](/develop/connect/get-started.html) and [the blockstack.js  reference](https://blockstack.github.io/blockstack.js/) to learn more about the libraries used in this tutorial.

