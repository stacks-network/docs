---
title: Authentication with Stacks.js
description: Authenticating a user with Stacks.js
---

Authenticating with a Stacks wallet is a very common task when building Stacks dapps.

Let's see how to set this up on the front end.

Code here is pulled from the [Hello Stacks](../tutorials/hello-stacks.md) tutorial.

## Stacks.js Code

We're using React here, but you can modify this for whatever frontend code you are using.

Before you add the frontend code, you need to install the correct NPM package.

```bash
yarn add @stacks/connect
```

And here's the JS code we'll need to implement.

```js
import {
  AppConfig,
  UserSession,
  AuthDetails,
  showConnect,
} from "@stacks/connect";
import { useState, useEffect } from "react";

function App() {
  const [message, setMessage] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [currentMessage, setCurrentMessage] = useState("");
  const [userData, setUserData] = useState(undefined);

  const appConfig = new AppConfig(["store_write"]);
  const userSession = new UserSession({ appConfig });

  const appDetails = {
    name: "Hello Stacks",
    icon: "https://freesvg.org/img/1541103084.png",
  };

  const connectWallet = () => {
    showConnect({
      appDetails,
      onFinish: () => window.location.reload(),
      userSession,
    });
  };

  useEffect(() => {
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((userData) => {
        setUserData(userData);
      });
    } else if (userSession.isUserSignedIn()) {
      setUserData(userSession.loadUserData());
    }
  }, []);

  return (
    <div className="flex flex-col justify-center items-center h-screen gap-8">
      <button
        className="p-4 bg-indigo-500 rounded text-white"
        onClick={connectWallet}
      >
        Connect Wallet
      </button>
      <h1 className="text-6xl font-black">Hello Stacks</h1>
    </div>
  );
}

export default App;
```

This is all the code we need to authenticate and access the user data in the UI.

But how do we actually use it?

Let's implement a `connectWallet` button to see how we can utilize the data we're pulling here.

```js
{
  !userData && (
    <button
      className="p-4 bg-indigo-500 rounded text-white"
      onClick={connectWallet}
    >
      Connect Wallet
    </button>
  );
}
```
