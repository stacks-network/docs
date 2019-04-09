---
layout: learn
permalink: /:collection/:path.html
---
# Todo List Application Tutorial
{:.no_toc}

In this tutorial, you build the code for and run a single-page application (SPA)
with Blockstack and Vue.js. Once the application is running, you take a tour
through the applications’ Blockstack functionality. You’ll learn how it manages
authentiation using a Blockstack ID and how it stores information associated
with that ID using Blockstack Storage (Gaia).

* TOC
{:toc}

{% include note.html content="On macOS, Blockstack requires macOS High Sierra. This tutorial was written on macOS High Sierra 10.13.4. If you use a Windows or Linux system, you can still follow along. However, you will need to \"translate\" appropriately for your operating system. Additionally, this tutorial assumes you are accessing the Blockstack Browser web application via Chrome. The application you build will also work with a local installation and/or with browsers other than Chrome. " %}

If you prefer a video, you can view <a href="https://www.youtube.com/embed/oyvg-h0obFw" target="\_blank">a video of the tutorial</a>.

## Before you begin

The application you build is a Vue.js application that is completely decentralized and server-less. While not strictly required to follow along, basic familiarity with Vue.js is helpful. When complete, the app is capable of the following:

* authenticating users using Blockstack
* posting new statuses
* displaying statuses in the user profile
* looking up the profiles and statuses of other users

For this tutorial, you will use the following tools:

* your workstation's command line
* `git` to clone the tutorial code
* `npm` to manage dependencies and scripts

The basic identity and storage services are provided by blockstack.js. To test the application, you need to have already registered a Blockstack ID.

### Verify you have git installed

This tutorial uses `git` to clone the tutorial code. Verify you have installed `git` using the `which` command to verify.

```bash
$ which git
/usr/local/bin/npm
```

### Verify you have npm installed

The tutorial relies on the `npm` dependency manager. Before you begin, verify you have installed `npm` using the `which` command to verify.

```bash
$ which npm
/usr/local/bin/npm
```
If you don’t find `npm` in your system, [install it](https://www.npmjs.com/get-npm).

### Make sure you have a Blockstack ID

Finally, make sure you have [created at least one Blockstack ID]({{site.baseurl}}/browser/ids-introduction.html#create-an-initial-blockstack-id).
You’ll use this ID to interact with the application.

## Install the application code and retrieve the dependencies

You can clone the source code with  `git` or [download and unzip the code from
the
repository](https://github.com/blockstack/blockstack-todos/archive/master.zip).
These instructions assume you are cloning.


1. Install the code by cloning it.

    ```
    $ git clone git@github.com:blockstack/blockstack-todos.git
    ```

2. Change to directory to the root of the code.

    ```
    $ cd blockstack-todos
    ```

3. Use `npm` to install the dependencies.


    ```
    $ npm install
    ```

The Todo application has a basic Vue.js structure. There are several configuration files but the central programming files are in the `src` directory:

| File            | Description |
|-----------------|-------------|
| `main.js`       | Application initialization.            |
| `App.vue `      | Code for handling the `authResponse`.        |
| `components/Landing.vue `  | Code for the initial sign on page.            |
| `components/Dashboard.vue` | Application data storage and user sign out.           |


## Sign into the application

The example application runs in a node server on your local host. In the this section, you start the application and interact with it.

1. Make sure you are in the root of the code base.

   ```bash
    $ pwd 
    /Users/moxiegirl/repos/blockstack-todos
   ```
   
   This path will be different for you, but double-check the last part to ensure that you're in the directory into which you cloned and in which you ran `npm install`.

2. Start the application.

    ```
    $ npm run start
    ```

    You should see a simple application:

    ![](images/todo-sign-in.png)

 2. Choose **Sign In with Blockstack**.

    If you have already signed into Blockstack the application prompts you to select the ID to use. If you aren’t signed in, Blockstack prompts you to:

    ![](images/login-choice.png)

    If the login to the application is successful, the user is presented with the application:

    ![](images/todo-app.png)

## Understand the sign in process

{% include sign_in.md %}

To decode the token and see what information it holds:

1. Copy the `authRequest` string from the URL.
2. Navigate to [jwt.io](https://jwt.io/).
3. Paste the full token there.

    The output should look similar to below:

    ```json
    {
      "jti": "3i96e3ad-0626-4e32-a316-b243154212e2",
      "iat": 1533136622,
      "exp": 1533140228,
      "iss": "did:btc-addr:1Nh8oQTunbEQWjrL666HBx2qMc81puLmMt",
      "public_keys": [
        "0362173da080c6e1dec0653fa9a3eff5f5660546e387ce6c24u04a90c2fe1fdu73"
      ],
      "domain_name": "http://localhost:8080",
      "manifest_uri": "http://localhost:8080/manifest.json",
      "redirect_uri": "http://localhost:8080/",
      "version": "1.2.0",
      "do_not_include_profile": true,
      "supports_hub_url": true,
      "scopes": [
        "store_write"
      ]
    }
    ```

    The `iss` property is a decentralized identifier or `did`. This identifies the user and the user name to the application. The specific `did` is a `btc-addr`.

## Under the covers in the sign in code

Now, go to the underlying `blockstack-todo` code you cloned or downloaded. Sign
in and sign out is handled in each of these files:

| File            | Description |
|-----------------|-------------|
| `App.vue `      | Handles the `authResponse`.        |
| `Landing.vue `  | Generates the `authRequest`.        |
| `Dashboard.vue` | Handles sign out.           |

The `src/components/Landing.vue` code calls a [`redirectToSignIn()`](https://blockstack.github.io/blockstack.js#redirectToSignIn) function which generates the `authRequest` and redirects the user to the Blockstack authenticator:

```js
signIn () {
  const blockstack = this.blockstack
  blockstack.redirectToSignIn()
}
```

Once the user authenticates, the application handles the `authResponse` in the `src/App.vue` file. :

```js
if (blockstack.isUserSignedIn()) {
  this.user = blockstack.loadUserData().profile
} else if (blockstack.isSignInPending()) {
  blockstack.handlePendingSignIn()
  .then((userData) => {
    window.location = window.location.origin
  })
}
```

If [`blockstack.isUserSignedIn()`](https://blockstack.github.io/blockstack.js/#isusersignedin) is true, the user was previously signed in so Blockstack pulls the data from the browser and uses it in our application. If the check on  [`blockstack.isSignInPending()`](https://blockstack.github.io/blockstack.js/#issigninpending) is true, a previous `authResponse` was sent to the application but hasn't been processed yet. The `handlePendingSignIn()` function processes any pending sign in.

Signout is handled in `src/components/Dashboard.vue`.

```js
signOut () {
  this.blockstack.signUserOut(window.location.href)
}
```

The method allows the application creator to decide where to redirect the user upon Sign Out:


## Working with the application

Now, trying adding a few itmes to the todo list. For example, try making a list of applications you want to see built on top of Blockstack:

![](images/make-a-list.png)

Each list is immediately stored in the Gaia Hub linked to your Blockstack ID.
For more information about the Gaia hub, see the [hub
repository](https://github.com/blockstack/gaia). You can fetch the `todos.json`
file you just added by opening the Javascript console and running the following
command:

```Javascript
blockstack.getFile("todos.json", { decrypt: true }).then((file) => {console.log(file)})
```

You should see a JSON with the todos you just added:

```json
[
  {
    "id":2,
    "text":"Software package manager secured by the blockchain",
    "completed":false
  },
  {
    "id":1,
    "text":"Mutable torrents with human readable names",
    "completed":false
  },
  {
    "id":0,
    "text":"Decentralized twitter",
    "completed":false
  }
]
```

Add another todo and check it off. When you fetch the newly generated file
using the Javascript console, the results reflect your change. Look for `"completed":true`:

```json
[
  {
    "id":3,
    "text":"Blockstack Todo",
    "completed":true
  },
  {
    "id":2,
    "text":"Software package manager secured by the blockchain",
    "completed":false
  },
 ...
]
```

Now that you have seen the application in action, dig into how it works.


## Implementing storage

Go to the underlying `blockstack-todo` code you cloned or downloaded. The
application interactions with your Gaia Hub originate in the
`src/components/Dashboard.vue` file. First, examine where the changes to the
Todos are processed:

```js
todos: {
  handler: function (todos) {
    const blockstack = this.blockstack

    // encryption is now enabled by default
    return blockstack.putFile(STORAGE_FILE, JSON.stringify(todos))
  },
  deep: true
}
```

The `todos` JSON object is passed in and the
[`blockstack.putFile()`](https://blockstack.github.io/blockstack.js/#putfile)
method to store it in a Gaia Hub.

The code needs to read the Todo items from the storage with the [`blockstack.getFile()`](https://blockstack.github.io/blockstack.js/#getfile) method which returns a promise:

```js
fetchData () {
  const blockstack = this.blockstack
  blockstack.getFile(STORAGE_FILE) // decryption is enabled by default
  .then((todosText) => {
    var todos = JSON.parse(todosText || '[]')
    todos.forEach(function (todo, index) {
      todo.id = index
    })
    this.uidCount = todos.length
    this.todos = todos
  })
},
```

The `todos` data is retrieved from the promise.


## Summary

You now have everything you need to construct complex applications complete with authentication and storage on the Decentralized Internet. Why not try coding [a sample application that accesses multiple profiles](blockstack_storage.html).

If you would like to explore the Blockstack APIs, you can visit the [Blockstack Core API](https://core.blockstack.org/) documentation or the [Blockstack JS API](https://blockstack.github.io/blockstack.js).

Go forth and build!
