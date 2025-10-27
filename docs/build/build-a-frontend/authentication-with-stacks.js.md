# Authentication with Stacks.js

Authenticating with a Stacks wallet is a common task when building Stacks dapps. Below is a React-based example (from the Hello Stacks tutorial) showing how to set up front-end authentication with Stacks.js and access user data in the UI.

{% hint style="info" %}
This example uses React, but the patterns can be adapted to other front-end frameworks.
{% endhint %}

## Install

{% code title="Install with yarn" %}
```bash
yarn add @stacks/connect
```
{% endcode %}

## Stacks.js Code (React)

This example implements the authentication flow and loads user data when the user signs in.

{% code title="App.jsx" %}
```javascript
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
{% endcode %}

This is all the code needed to authenticate and access user data in the UI.

## Example: Connect Wallet Button (conditional)

Here is how you might render a Connect Wallet button only when there is no signed-in user:

{% code title="Conditional Connect Button" %}
```javascript
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
{% endcode %}

When clicked, `connectWallet` calls `showConnect` from @stacks/connect, which opens the wallet for the user to sign in. After sign-in completes, the app reloads (via `onFinish`) and the `useEffect` code loads and stores the user data in state.
