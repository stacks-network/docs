---
layout: learn
permalink: /:collection/:path.html
---
# Todo List Application Tutorial

In this tutorial, you build the code for and run a single-page application (SPA)
with Blockstack and Vue.js. Once the application is running, you take a tour
through the applications’ Blockstack functionality. You’ll learn how it manages
authentiation using a Blockstack ID and how it stores information associated
with that ID using Blockstack Storage (Gaia).

* TOC
{:toc}

{% include note.html content="This tutorial was written on macOS High Sierra 10.13.4. If you use a Windows or Linux system, you can still follow along. However, you will need to \"translate\" appropriately for your operating system. Additionally, this tutorial assumes you are accessing the Blockstack Browser web application via Chrome. The application you build will also work with a local installation and/or with browsers other than Chrome. " %}

If you prefer a video, you can view <a href="https://www.youtube.com/embed/oyvg-h0obFw" target="\_blank">a video of the tutorial</a>.

## About this tutorial and the prerequisites you need
For this tutorial, we will use the following tools:

* `npm` to manage dependencies and scripts
* `browserify` to compile node code into browser-ready code
* `blockstack.js` to authenticate the user and work with the user’s identity/profile information

At minimum, Blockstack requires macOS High Sierra. This tutorial was written for a user running macOS High Sierra 10.13.4. The application you build is a Vue.js application that is completely decentralized and server-less. While not strictly required to follow along, basic familiarity with Vue.js is helpful.

When complete, the app is capable of the following:

* authenticating users using Blockstack
* posting new statuses
* displaying statuses in the user profile
* looking up the profiles and statuses of other users

The basic identity and storage services are provided by blockstack.js. To test the application, you need to have already registered a Blockstack ID.

The tutorial relies on the `npm` dependency manager. Before you begin, verify you have installed `npm` using the `which` command to verify.

```bash
$ which npm
/usr/local/bin/npm
```
If you don’t find `npm` in your system, [install it](https://www.npmjs.com/get-npm).


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

2. Use `npm` to install the dependencies.


    ```
    $ npm install
    ...
    added 1161 packages in 70.746s
    ```

The Todo application has a basic Vue.js structure. There are several configuration files but the central programming files are in the `src` directory:

| File            | Description |
|-----------------|-------------|
| `main.js`       | Application initialization.            |
| `App.vue `      | Code for handling the `authResponse`.        |
| `Landing.vue `  | Code for the initial sign on page.            |
| `Dashboard.vue` | Application data storage and user sign out.           |


## Sign into the application

The example application runs in a node server on your local host. In the this section, you start the application and interact with it.

1. Make sure you are in the root of the code base.

   ```bash
    $ pwd /Users/moxiegirl/repos/blockstack-todos
    Start the application.
   ```

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

Clicking the Sign In With Blockstack button brings up a modal that prompts you
to sign in with an existing ID or create a new ID. When Blockstack is provided
an ID, it generates an ephemeral key within the application. An ephemeral key is
generated for each execution of a key establishment process. This key is just
used for the particular instance of the application, in this case to sign a Sign
In request.

A Blockstack Core node also generates a public key token which is sent to the
browser as an `authRequest` from the browser to your core node. The signed
authentication request is sent to Blockstack through a JSON Web Token (JWT).
Blocktack passes the token in via a URL query string in the authRequest
parameter:

`https://browser.blockstack.org/auth?authRequest=j902120cn829n1jnvoa...`

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

    >**Note**:
    > * The `iss` property is a decentralized identifier or `did`. This identifies you and your name to the application. The specific `did` is a `btc-addr`.
    > * The Blockstack JWT implementation is different from other implementations because of the underlying cryptography we employ. There are libraries in [Javascript](https://github.com/blockstack/jsontokens-js) and [Ruby](https://github.com/blockstack/ruby-jwt-blockstack) available on the Blockstack Github to allow you to work with these tokens.

When the Blockstack node receives the `authRequest`, it generates a session token
and returns an authentication response to the application. This response is
similar to the `authRequest` above in that the `authResponse` includes a private key
intended only for the application. This allows the application to encrypt data
on your personal Blockstack storage.

After the completion of this process, the user is logged in.

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
