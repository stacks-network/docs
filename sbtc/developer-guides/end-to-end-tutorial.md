# End to End Tutorial

{% hint style="warning" %}
sBTC is under heavy development, and the developer release that this tutorial corresponds to is not being maintained. Development efforts are currently focused on Nakamoto, so everything in this tutorial is subject to change and may not work. It is highly recommended that you wait to build any sBTC functionality until development continues, at least as far as the bridging functionality is concerned.

The current recommended way to begin working on prototype applications that use sBTC is to take a look at the [current sBTC contract](https://github.com/stacks-network/sbtc/tree/main/romeo/asset-contract/contracts) and duplicate it in the app you are working on and work with that. Although the bridging functionality to actually mint sBTC will change, sBTC will continue to operate as a SIP-010 token, meaning you can learn, experiment, and build with it as with any other SIP-010 token.
{% endhint %}

### Build a Basic DeFi Application using Next, Stacks.js, Clarity, and the sBTC Developer Release

If you are looking to start building full-stack applications with the sBTC Developer Release (sBTC DR), this is the place to start. We'll walk through the entire process of building a full-stack application utilizing sBTC from start to finish.

If you prefer a quicker introduction, check out the Quickstart, which will get you up to speed on the essentials of building with sBTC.

First, some housekeeping.

### Prerequisites

In this tutorial, we'll be building a basic Bitcoin lending app called Lagoon. We'll be using Next for our frontend and the Developer Release of sBTC on Stacks for the smart contract functionality.

We'll be building a full-stack app in this tutorial, primarily working in JavaScript and Clarity.

You should have at least some familiarity with the following before starting:

* React
* Next
* Stacks
* sBTC
* Clarity

If you aren't familiar with React or Next for frontend development, I recommend Vercel's [Next Foundations](https://nextjs.org/learn/foundations/about-nextjs) to get up to speed.

If you aren't familiar with Stacks, check out [Stacks Academy](https://docs.stacks.co/docs/stacks-academy) and if you need an intro to building on Stacks, take a look at the [Stacks Developer Quickstart](https://docs.stacks.co/docs/tutorials/hello-stacks).

To get you up to speed on sBTC, you can start by familiarizing yourself with sBTC from a high level.

Specifically, we're working with the Developer Release now, which is an early version of sBTC for developers to begin experimenting and building before the full version is released.

Finally, if you aren't familiar with Clarity, you can get the basics, which is enough for this tutorial, by going through this [Clarity Crash Course](https://docs.stacks.co/docs/clarity/crash-course).

You'll also want to make sure you have the [Leather web wallet](https://leather.io/) installed, as that is what we'll be using to interact with our application.

Now let's get started.

### What We're Building

We're going to be building an app called Lagoon. Lagoon is a very basic Bitcoin lending application that allows you to borrow and lend BTC using Clarity smart contracts. We'll take full advantage of sBTC here and use it in the process.

One of the primary solutions sBTC brings to the world is to create a robust decentralized financial system on top of Bitcoin, rather than needing to go through centralized custodians or pay high fees on the L1.

Lagoon allows users to connect their wallet, convert their BTC to sBTC, and then take that sBTC and deposit it into a lending pool in order to earn interest on it.

This is by no means a production level borrowing and lending app, and is only meant to be used to illustrate how to get started with sBTC. Feel free to use it as a starting point in your projects, but just know that the code is only for demo purposes and should not be used in production.

### Getting Set Up

Note: There are still some bugs being worked out with the testnet sBTC system, so we're going to use a local developer environment for this tutorial.

For this tutorial, we're going to get you set up with a local version of the sBTC DR. Although this does require a bit more setup time, it will pay off by making your development experience significantly faster.

So, before going any further, make sure you have sBTC set up locally by following the Local environment setup guide.

Once you're all set up, it's time to start building!

If at any time you get stuck, you can refer to the final code at the [Lagoon repo](https://github.com/kenrogers/lagoon).

### Creating Our Front End

The first thing we need to do is create a new folder for our project, called `lagoon`.

```bash
mkdir lagoon && cd lagoon
```

Inside that we'll initiate our Next project for our frontend.

```bash
npx create-next-app@latest
```

Use the following values when answering the setup questions:

* Name: frontend
* TypeScript: no
* ESLint: up to you
* Tailwind: yes
* src directory: yes
* App Router: yes
* Customize import alias: no

Now let's get our frontend created. Since this isn't a React/Next tutorial, I'll gloss over the boilerplate code.

First, we need to install the `@stacks/connect` package as this is what we'll use to connect our wallet.

```bash
npm install @stacks/connect
```

Now, let's update our `layout.js` file in `frontend/src/app/layout.js` to get a Navbar and Connect Wallet component created.

```jsx
"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import React, { useState, useEffect } from "react";
import { AppConfig, UserSession } from "@stacks/connect";

import Navbar from "./components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const [userData, setUserData] = useState({});

  const appConfig = new AppConfig();
  const userSession = new UserSession({ appConfig });

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
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen text-white bg-slate-800">
          {userData !== undefined ? (
            <>
              <Navbar
                userSession={userSession}
                userData={userData}
                setUserData={setUserData}
              />
              {children}
            </>
          ) : (
            ""
          )}
        </div>
      </body>
    </html>
  );
}
```

Next up let's add our Navbar by creating a `Navbar.js` file inside the `src/app/components` directory.

```jsx
"use client";

import Link from "next/link";
import ConnectWallet from "./ConnectWallet";

export default function Navbar({ userSession, userData, setUserData }) {
  return (
    <nav className="flex justify-between p-4 bg-slate-900">
      <ul className="flex justify-center space-x-4 text-white">
        <li>
          <Link href="/" className="hover:text-orange-500">
            Home
          </Link>
        </li>
        <li>
          <Link href="/lend" className="hover:text-orange-500">
            Lend
          </Link>
        </li>
        <li>
          <Link href="/borrow" className="hover:text-orange-500">
            Borrow
          </Link>
        </li>
        <li>
          <Link href="/deposit" className="hover:text-orange-500">
            Deposit BTC
          </Link>
        </li>
        <li>
          <Link href="/withdraw" className="hover:text-orange-500">
            Withdraw sBTC
          </Link>
        </li>
      </ul>
      {userData ? (
        <ConnectWallet
          userSession={userSession}
          userData={userData}
          setUserData={setUserData}
        />
      ) : (
        ""
      )}
    </nav>
  );
}
```

Next we need to create the `ConnectWallet.js` component. You can do that inside the `src/app/components` directory.

Inside that file, we'll add the following.

```jsx
import { showConnect } from "@stacks/connect";
import { StacksMocknet, StacksTestnet } from "@stacks/network";

export default function ConnectWallet({ userSession, userData, setUserData }) {
  const connectWallet = () => {
    showConnect({
      userSession,
      network: StacksTestnet,
      appDetails: {
        name: "BitLoan",
        icon: "https://freesvg.org/img/bitcoin.png",
      },
      onFinish: () => {
        window.location.reload();
      },
      onCancel: () => {
        // handle if user closed connection prompt
      },
    });
  };

  const disconnectWallet = () => {
    userSession.signUserOut(window.location.origin);
    setUserData({});
  };
  return (
    <button
      className="px-4 py-2 font-bold text-white transition duration-500 ease-in-out rounded bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-orange-500"
      onClick={() => {
        userData.profile ? disconnectWallet() : connectWallet();
      }}
    >
      {userData.profile ? "Disconnect" : "Connect Wallet"}
    </button>
  );
}
```

All we are doing here is providing a mechanism for the user to connect with a web wallet. Walking through how each piece of the authentication works is outside the scope of this sBTC tutorial. Refer to the Stacks Quickstart linked above if you are unsure of what is happening here.

Then, update your `src/app/page.js` file to look like this.

```jsx
export const metadata = {
  title: "Lagoon",
  description: "A decentralized Bitcoin lending application",
};

export default function Home() {
  return (
    <>
      <h1 className="mt-8 text-4xl text-center">Lagoon</h1>
      <p className="mt-4 text-center">
        Decentralized lending and borrowing with sBTC.
      </p>
    </>
  );
}
```

Now we're going to add each page and component to create a basic UI.

`src/app/borrow/page.js`

```jsx
import BorrowForm from "../components/BorrowForm";

export const metadata = {
  title: "Borrow",
  description: "A decentralized Bitcoin lending application",
};

export default function Borrow() {
  return (
    <div className="min-h-screen text-white bg-gray-800">
      <h2 className="my-6 text-3xl text-center">Borrow sBTC</h2>
      <BorrowForm />
    </div>
  );
}
```

`deposit/page.js`

```jsx
import DepositForm from "../components/DepositForm";

export const metadata = {
  title: "Deposit",
  description: "A decentralized Bitcoin lending application",
};

export default function Deposit() {
  return (
    <div className="min-h-screen text-white bg-gray-800">
      <h2 className="my-6 text-3xl text-center">Deposit BTC to Mint sBTC</h2>
      <DepositForm />
    </div>
  );
}
```

`lend/page.js`

```jsx
import LendForm from "../components/LendForm";

export const metadata = {
  title: "Lend",
  description: "A decentralized Bitcoin lending application",
};

export default function Lend() {
  return (
    <div className="min-h-screen text-white bg-gray-800">
      <h2 className="my-6 text-3xl text-center">Lend your sBTC</h2>
      <LendForm />
    </div>
  );
}
```

`withdraw/page.js`

```jsx
import WithdrawForm from "../components/WithdrawForm";

export const metadata = {
  title: "Withdraw",
  description: "A decentralized Bitcoin lending application",
};

export default function Withdraw() {
  return (
    <div className="min-h-screen text-white bg-gray-800">
      <h2 className="my-6 text-3xl text-center">Withdraw sBTC to BTC</h2>
      <WithdrawForm />
    </div>
  );
}
```

`components/BorrowForm.js`

```jsx
export default function BorrowForm() {
  return (
    <form className="flex flex-col items-center space-y-4">
      <input
        type="number"
        placeholder="Amount to borrow"
        className="w-1/3 px-4 py-2 text-gray-300 bg-gray-700 rounded  focus:outline-none focus:border-orange-500"
      />
      <input
        type="number"
        placeholder="Collateral amount"
        className="w-1/3 px-4 py-2 text-gray-300 bg-gray-700 rounded focus:outline-none focus:border-orange-500"
      />
      <button
        type="submit"
        className="w-1/3 px-6 py-2 bg-orange-500 rounded hover:bg-orange-600 focus:outline-none"
      >
        Borrow sBTC
      </button>
    </form>
  );
}
```

`components/DepositForm.js`

```jsx
export default function DepositForm() {
  return (
    <form className="flex items-center justify-center space-x-4">
      <input
        type="number"
        placeholder="Amount of BTC to deposit"
        className="w-1/3 px-4 py-2 text-gray-300 bg-gray-700 rounded focus:outline-none focus:border-orange-500"
      />
      <button
        type="submit"
        className="px-6 py-2 bg-orange-500 rounded hover:bg-orange-600 focus:outline-none"
      >
        Deposit BTC
      </button>
    </form>
  );
}
```

`components/LendForm.js`

```jsx
export default function LendForm() {
  return (
    <form className="flex items-center justify-center space-x-4">
      <input
        type="number"
        placeholder="Amount to lend"
        className="w-1/3 px-4 py-2 text-gray-300 bg-gray-700 rounded focus:outline-none focus:border-orange-500"
      />
      <button
        type="submit"
        className="px-6 py-2 bg-orange-500 rounded hover:bg-orange-600 focus:outline-none"
      >
        Lend sBTC
      </button>
    </form>
  );
}
```

`components/WithdrawForm.js`

```jsx
export default function WithdrawForm() {
  return (
    <form className="flex items-center justify-center space-x-4">
      <input
        type="number"
        placeholder="Amount of sBTC to withdraw"
        className="w-1/3 px-4 py-2 text-gray-300 bg-gray-700 rounded focus:outline-none focus:border-orange-500"
      />
      <button
        type="submit"
        className="px-6 py-2 bg-orange-500 rounded hover:bg-orange-600 focus:outline-none"
      >
        Withdraw to BTC
      </button>
    </form>
  );
}
```

If you run `npm run dev` from the `frontend` folder you should see the UI display.

What we have here is a basic UI for converting BTC and sBTC, and borrowing and lending sBTC.

Now that we have our basic UI in place, let's add functionality one piece at a time.

### Initiating a sBTC Deposit

The first thing we are going to do is create a component to initiate a sBTC deposit.

You should already be familiar with how sBTC works at a high level, but what we are going to be doing is constructing a custom Bitcoin transaction that will have all the data we need in order to successfully deposit it into the sBTC wallet and then mint our sBTC.

Remember that for the Developer Release, the system that actually does the minting is not the fully decentralized version, it is a centralized single binary, but for the purposes of interacting with it as an application developer, the interface will be very similar to the final version.

Recall that in order to mint sBTC to our Stacks address we need to deposit the amount of BTC we want to convert into the threshold signature wallet, and pass in what Stacks address we want the sBTC minted to in via the OP\_RETURN data.

The protocol and sBTC Clarity contracts will handle the actual minting of the sBTC.

We can use the sBTC package to make constructing that transaction much easier, and then we can use Leather's API to broadcast it.

We'll start by installing the sBTC package.

```bash
npm install sbtc
```

Next we need to set up the context that will allow us to have our `UserData` available everywhere.

Create the `UserContext.js` file within the `src` directory and put this content in it:

```jsx
import React from "react";

export const UserContext = React.createContext();
```

This will allow us to read from this file and pull in our authenticated user data in any part of the app.

Let's now update the `DepositForm.js` component.

```jsx
"use client";

import { useState, useContext } from "react";
import {
  DevEnvHelper,
  sbtcDepositHelper,
  TESTNET,
  TestnetHelper,
  WALLET_00,
  WALLET_01,
} from "sbtc";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils";
import * as btc from "@scure/btc-signer";

import { UserContext } from "../UserContext";

export default function DepositForm() {
  const { userData } = useContext(UserContext);
  const [satoshis, setSatoshis] = useState("");

  const handleInputChange = (event) => {
    setSatoshis(event.target.value);
  };

  const buildTransaction = async (e) => {
    e.preventDefault();
    const testnet = new TestnetHelper();
    // const testnet = new DevEnvHelper();

    // setting BTC address for devnet
    // const bitcoinAccountA = await testnet.getBitcoinAccount(WALLET_00);
    // const btcAddress = bitcoinAccountA.wpkh.address;
    // const btcPublicKey = bitcoinAccountA.publicKey.buffer.toString();

    // setting BTC address for testnet
    const btcAddress = userData.profile.btcAddress.p2wpkh.testnet;
    const btcPublicKey = userData.profile.btcPublicKey.p2wpkh;

    let utxos = await testnet.fetchUtxos(btcAddress);

    // If we are working via testnet
    // get sBTC deposit address from bridge API
    const response = await fetch(
      "https://bridge.sbtc.tech/bridge-api/testnet/v1/sbtc/init-ui"
    );
    const data = await response.json();
    const sbtcWalletAddress = data.sbtcContractData.sbtcWalletAddress;

    // if we are working via devnet
    // const sbtcWalletAccount = await testnet.getBitcoinAccount(WALLET_00);
    // const sbtcWalletAddress = sbtcWalletAccount.tr.address;
    const tx = await sbtcDepositHelper({
      // comment this line out if working via devnet
      network: TESTNET,
      sbtcWalletAddress,
      stacksAddress: userData.profile.stxAddress.testnet,
      amountSats: satoshis,
      feeRate: await testnet.estimateFeeRate("low"),
      utxos,
      bitcoinChangeAddress: btcAddress,
    });

    const psbt = tx.toPSBT();
    const requestParams = {
      publicKey: btcPublicKey,
      hex: bytesToHex(psbt),
    };
    const txResponse = await window.btc.request("signPsbt", requestParams);
    const formattedTx = btc.Transaction.fromPSBT(
      hexToBytes(txResponse.result.hex)
    );
    formattedTx.finalize();
    const finalTx = await testnet.broadcastTx(formattedTx);
    console.log(finalTx);
  };

  return (
    <form className="flex items-center justify-center space-x-4">
      <input
        type="number"
        placeholder="Amount of BTC to deposit"
        className="w-1/3 px-4 py-2 text-gray-300 bg-gray-700 rounded focus:outline-none focus:border-orange-500"
        value={satoshis}
        onChange={handleInputChange}
      />
      <button
        type="submit"
        className="px-6 py-2 bg-orange-500 rounded hover:bg-orange-600 focus:outline-none"
        onClick={buildTransaction}
      >
        Deposit BTC
      </button>
    </form>
  );
}
```

Before we go through the code, a reminder that in order to mint sBTC, you initiate a deposit transaction via Bitcoin. So to mint sBTC from a UI like this, we need to construct and broadcast that transaction on the Bitcoin network. Then the sBTC binary will detect that transaction and mint the sBTC.

We need a way to tell the Bitcoin network how much sBTC we want to mint. That's easy, we just send that amount to the threshold wallet. And we need to tell it where to send the sBTC. To do that we need to pass our Stacks address to the OP\_RETURN of the Bitcoin transaction.

It can get pretty complicated to construct this manually. Luckily, the sBTC library will do most of the heavy lifting.

Okay let's go through this step by step. First we are importing some packages we need in order to construct our Bitcoin transaction.

We're also using React's state and context APIs to set how many sats we are depositing and to get our `userData`.

At the bottom you can see in our UI that we have a basic form where users enter how many sats they want to convert and call the `buildTransaction` function to initiate that.

Let's dig into that function.

The very first thing we are doing is setting what network we are on with either the `DevenvHelper` or the `TestnetHelper` from the `sbtc` package.

Here we have it configured to use either testnet or devnet, depending on which line we have commented out. If you have your local `devenv` up and running, great, use that. Otherwise, you can use testnet as well, you'll just need to wait for transactions to confirm.

The next thing we need to do is get all of the UTXOs that belong to our currently logged in address. The `sbtc` package helps us with that as well and we can pass in our authenticated address.

Again, this will be a slightly different process depending on if you are on testnet or devnet.

Bitcoin, unlike the accounts model of something like Ethereum, works off of a UTXO model.

UTXO stands for unspent transaction output, and the collection of UTXOs that are spendable by a specific Bitcoin address determines how much bitcoin an address has.

When we create new transactions, we need to construct the inputs (what is being sent) based on those UTXOs. This helper function gets all of our UTXOs and formats them the right way.

Next we are using the [sBTC Bridge](https://bridge.sbtc.tech) API in order to get the current threshold wallet we should be sending the BTC to.

Next it's time to actually build the transaction. To do that we need to pass i:

* What network we are using, imported from the `sbtc` package. This defaults to `devnet` so you only need to pass this parameter if you are using something else.
* The threshold wallet address we got above
* Our stacks address. This is where the sBTC will be minted to
* How many sats we want to deposit and convert to sBTC
* The fee to use, we can get this by using another helper from the `sbtc` package
* Our utxos that we fetched
* And where to send the remaining Bitcoin change after the transaction (UTXOs can only be spent as a whole, so we need to create another transaction to send any remainder)

Then we need to covnert that transaction to a PSBT. In order to use the Leather wallet, our transaction needs to be a PSBT, which we then pass to the wallet, use the wallet to sign, and then use the `sbtc` helper to broadcast it.

The next few lines are converting the transaction to the right format, calling the wallet API to sign it, and broadcasting it.

Then we simply log the transaction. After you confirm the transaction in the Leather wallet, you can view this transaction in a Bitcoin explorer. Wait a few minutes (or a few seconds on devnet) and you should see your sBTC minted in your wallet.

:::note If you run into an error about the input script not having a pubKey, make sure you are authenticated with the same account you are initiating the transaction from. :::

Alright now that we are successfully minting sBTC, we're going to switch gears a bit and build out a super simple Clarity contract to handle our borrowing and lending functionality.

### Creating Our Lending Smart Contract

We're going to be creating our new smart contract inside the sBTC repo we have running.

Switch into `sbtc/romeo/asset-contract` and run `clarinet contract new lagoon`.

If you are working from testnet the easiest option will probably be to write and deploy your contract from the [Hiro explorer sandbox](https://explorer.hiro.so/sandbox/deploy?chain=testnet).

We want to developer our smart contract in the same folder and environment as sBTC.

Please keep in mind that this is for demo purposes only. Real DeFi lending systems are much more complex and robust than this. Don't use this as a model for building a DeFi protocol, it's only meant to be a starting point for how to work with sBTC.

Now let's write it.

First we're going to set up the data variables we need.

```clojure
;; Define the contract's data variables
(define-map deposits { owner: principal } { amount: uint })
(define-map loans principal { amount: uint, last-interaction-block: uint })

(define-data-var total-deposits uint u0)
(define-data-var total-loans uint u0)
(define-data-var pool-reserve uint u0)
(define-data-var loan-interest-rate uint u10) ;; Representing 10% interest rate
```

We're creating a few different things here. First, we're setting up some maps that define all of the deposits and loans currently in the protocol, assigning an owner and an amount. We also have the `last-interaction-block` field that will help us calculate how much interest is owed to a lender.

Next up we have a few basic variables defining how many deposits and loans we have in total, the pool reserve, which is the total interest paid by borrowers, and the interest rate, which we are hardcoding here for simplicity.

Now let's write our deposit function. This function will allow users to deposit sBTC into the protocol in order to generate interest.

```clojure
(define-public (deposit (amount uint))
    (let (
        (current-balance (default-to u0 (get amount (map-get? deposits { owner: tx-sender }))))
        )
        (try! (contract-call? .asset transfer amount tx-sender (as-contract tx-sender) none))
        (map-set deposits { owner: tx-sender } { amount: (+ current-balance amount) })
        (var-set total-deposits (+ (var-get total-deposits) amount))
        (ok true)
    )
)
```

Let's walk through this. We are declaring a public function that takes in a `uint` called `amount` that will represent how many sats the user wants to deposit into the protocol.

Next we are using `let` to get the current balance of the depositor. If they have never made a deposit and don't have an entry in the map, we default to 0.

Next up we are initiating a `try!` call and calling the `transfer` function from the sBTC contract, `.asset` in this case. We are transferring the corresponding amount of sBTC from ourselves into the Lagoon contract.

If that is successful, we then update our `deposits` map to add the amount we just deposited.

Finally, we update the `total-deposits` as well and return `true`.

Next up, let's write the `borrow` function.

```clojure
(define-public (borrow (amount uint))
    (let (
        (user-deposit (default-to u0 (get amount (map-get? deposits { owner: tx-sender }))))
        (allowed-borrow (/ user-deposit u2))
        (current-loan-details (default-to { amount: u0, last-interaction-block: u0 } (map-get? loans tx-sender )))
        (accrued-interest (calculate-accrued-interest (get amount current-loan-details) (get last-interaction-block current-loan-details)))
        (total-due (+ (get amount current-loan-details) (unwrap! accrued-interest (err u8))))
        (new-loan (+ total-due amount))
    )
        (asserts! (<= amount allowed-borrow) (err u7))
        (try! (contract-call? .asset transfer amount (as-contract tx-sender) tx-sender none))
        (map-set loans tx-sender { amount: new-loan, last-interaction-block: block-height })
        (ok true)
    )
)
```

Again here we are using `let` to retrieve and set the amount this user currently has in the pool, defaulting to 0.

Next we are getting the number that this user is allowed to borrow. Borrowers can only borrow up to 50% of their collateral.

Next we are checking to see how many blocks it has been since they last interacted with the protocol. We set this to keep track of interest accrual. We use the `calculate-accrued-interest` function (which we'll implement in a moment) to calculate how much they owe and set that as well.

Next we are checking to make sure that the depositor is allowed to borrow and that the pool has enough liquidity to cover the new loan.

Then we transfer the sBTC from the contract to the borrower.

Finally we update all of our variables to include the new amount. Note that when we update these variables, we are taking interest into account. In this case, when this borrower repays this loan, they will repay the original amount plus the 10% interest.

Next up we have the repay function.

```clojure
;; Users can repay their sBTC loans
(define-public (repay (amount uint))
    (let (
        (current-loan-details (default-to { amount: u0, last-interaction-block: u0 } (map-get? loans tx-sender)))
        (accrued-interest (calculate-accrued-interest (get amount current-loan-details) (get last-interaction-block current-loan-details)))
        (total-due (+ (get amount current-loan-details) (unwrap! accrued-interest (err u8))))
    )
        (asserts! (>= total-due amount) (err u4))
        (try! (contract-call? .asset transfer amount tx-sender (as-contract tx-sender) none))
        (map-set loans tx-sender  { amount: (- total-due amount), last-interaction-block: block-height })
        (var-set total-loans (- (var-get total-loans) amount))
        (ok true)
    )
)
```

This is very similar to the other functions. In this case the borrower is simply paying back their loan with the included interest. Remember that the interest was calculated when they initially borrowed, so we don't need to include it here.

Now let's write the function that allows lenders to claim their yield.

```clojure
(define-public (claim-yield)
    (let (
        (user-deposit (default-to u0 (get amount (map-get? deposits { owner: tx-sender }))))
        (yield-amount (/ (* (var-get pool-reserve) user-deposit) (var-get total-deposits)))
    )
        (try! (as-contract (contract-call? .asset transfer yield-amount (as-contract tx-sender) tx-sender none)))
        (var-set pool-reserve (- (var-get pool-reserve) yield-amount))
        (ok true)
    )
)
```

First we get the user's deposits and calculate how much interest they are owed based on their proportion of the pool reserve.

Then we simply transfer that amount to them and update the pool reserve with the new amount.

And finally let's implement the function to calculate interest.

```clojure
(define-private (calculate-accrued-interest (principal uint) (start-block uint))
    (let (
        (elapsed-blocks (- block-height start-block))
        (interest (/ (* principal (var-get loan-interest-rate) elapsed-blocks) u10000))
    )
        (asserts! (not (is-eq start-block u0)) (ok u0))
       (ok interest)
    )
)
```

Here we are using the amount of elapsed blocks to calculate interest that accrues linearly across blocks. If the user has never taken out a loan, the interest is set to 0.

There is a lot of functionality missing here that we would need in a real DeFi protocol including liquidation, compound interest, withdrawal functionality for depositors, and a lot of controls to ensure the system can't be gamed. The purpose of this tutorial is to show you how to use sBTC, not build a full-fledged DeFi product. As such, we'll keep the functionality basic, as that's enough to understand how to utilize sBTC and the role it would play in a DeFi application.

Before we can interact with our contract, we need to deploy it. To do that, we can create a new deployment plan with Clarinet.

To do this, simply modify the `default.devnet.yaml` file in deployments and add your new contract to the list of contracts to publish.

```yaml
- contract-publish:
    contract-name: lagoon
    expected-sender: ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
    cost: 38610
    path: contracts/lagoon.clar
    anchor-block-only: true
    clarity-version: 2
```

Now you'll need to restart your environment and call the `deploy_contracts.sh` helper again. Refer back to the devnet setup guide if this is confusing.

If you deployed to testnet, you don't need to worry about this part.

Now that we have a basic smart contract in place, let's build the UI to actually interact with it.

### Creating the Lend UI

We're going to be build out the Lend form first. Go ahead and replace the contents of the `LendForm.js` file with the following, then we'll go through it line by line.

```jsx
"use client";

import React, { useState } from "react";
import { uintCV, PostConditionMode } from "@stacks/transactions";
import { openContractCall } from "@stacks/connect";
import { StacksMocknet, StacksTestnet } from "@stacks/network";

export default function LendForm() {
  const [amount, setAmount] = useState(0);

  const handleDeposit = async () => {
    const functionArgs = [
      uintCV(amount), // Convert the amount to uintCV
    ];

    const contractAddress = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM"; // Replace with your contract address
    const contractName = "lagoon"; // Replace with your contract name
    const functionName = "deposit"; // Function for deposit

    const options = {
      contractAddress,
      contractName,
      functionName,
      functionArgs,
      network: new StacksTestnet(),
      // network: new StacksMocknet(),
      postConditionMode: PostConditionMode.Allow,
      appDetails: {
        name: "Lagoon",
        icon: "https://freesvg.org/img/bitcoin.png", // You can provide an icon URL for your application
      },
      onFinish: (data) => {
        console.log(data);
      },
    };

    await openContractCall(options);
  };

  return (
    <form
      className="flex items-center justify-center space-x-4"
      onSubmit={(e) => {
        e.preventDefault();
        handleDeposit();
      }}
    >
      <input
        type="number"
        placeholder="Amount to lend"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-1/3 px-4 py-2 text-gray-300 bg-gray-700 rounded focus:outline-none focus:border-orange-500"
      />
      <button
        type="submit"
        className="px-6 py-2 bg-orange-500 rounded hover:bg-orange-600 focus:outline-none"
      >
        Lend sBTC
      </button>
    </form>
  );
}
```

### Creating the Borrow UI

The borrow UI will be very similar. We're doing almost the exact same thing except renaming a couple things and calling the `borrow` function instead of `lend`.

```jsx
"use client";

import React, { useState } from "react";
import { uintCV, PostConditionMode } from "@stacks/transactions";
import { openContractCall } from "@stacks/connect";
import { StacksMocknet, StacksTestnet } from "@stacks/network";

export default function BorrowForm() {
  const [amount, setAmount] = useState(0);

  const handleDeposit = async () => {
    const functionArgs = [
      uintCV(amount), // Convert the amount to uintCV
    ];

    const contractAddress = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM"; // Replace with your contract address
    const contractName = "lagoon"; // Replace with your contract name
    const functionName = "borrow"; // Function for deposit

    const options = {
      contractAddress,
      contractName,
      functionName,
      functionArgs,
      network: new StacksTestnet(),
      //network: new StacksMocknet(),
      postConditionMode: PostConditionMode.Allow,
      appDetails: {
        name: "Lagoon",
        icon: "https://freesvg.org/img/bitcoin.png", // You can provide an icon URL for your application
      },
      onFinish: (data) => {
        console.log(data);
      },
    };

    await openContractCall(options);
  };

  return (
    <form
      className="flex items-center justify-center space-x-4"
      onSubmit={(e) => {
        e.preventDefault();
        handleDeposit();
      }}
    >
      <input
        type="number"
        placeholder="Amount to borrow"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-1/3 px-4 py-2 text-gray-300 bg-gray-700 rounded focus:outline-none focus:border-orange-500"
      />
      <button
        type="submit"
        className="px-6 py-2 bg-orange-500 rounded hover:bg-orange-600 focus:outline-none"
      >
        Borrow sBTC
      </button>
    </form>
  );
}
```

### Initiating a sBTC Withdrawal

Now we can mint sBTC, borrow sBTC, and lend out sBTC. Now if we want to convert our sBTC back to BTC, we need to withdraw it. We can do that with a very similar process as the deposit.

Add the following to the `WithdrawForm.js` file.

```jsx
"use client";

import { useState, useContext } from "react";
import {
  DevEnvHelper,
  sbtcWithdrawHelper,
  sbtcWithdrawMessage,
  TESTNET,
  TestnetHelper,
} from "sbtc";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils";
import * as btc from "@scure/btc-signer";
import { openSignatureRequestPopup } from "@stacks/connect";

import { UserContext } from "../UserContext";
import { StacksTestnet } from "@stacks/network";

export default function WithdrawForm() {
  const { userData, userSession } = useContext(UserContext);
  const [satoshis, setSatoshis] = useState("");
  const [signature, setSignature] = useState("");

  const handleInputChange = (event) => {
    setSatoshis(event.target.value);
  };

  const signMessage = async (e) => {
    e.preventDefault();
    const message =
      sbtcWithdrawMessage({
        network: TESTNET,
        amountSats: satoshis,
        bitcoinAddress: userData.profile.btcAddress.p2wpkh.testnet,
      });

    openSignatureRequestPopup({
      message,
      userSession,
      network: new StacksTestnet(),
      onFinish: (data) => {
        setSignature(data.signature);
      },
    });
  };

  const buildTransaction = async (e) => {
    e.preventDefault();
    const testnet = new TestnetHelper();
    // const testnet = new DevEnvHelper();

    let utxos = await testnet.fetchUtxos(
      userData.profile.btcAddress.p2wpkh.testnet
    );

    // get sBTC deposit address from bridge API
    const response = await fetch(
      "https://bridge.sbtc.tech/bridge-api/testnet/v1/sbtc/init-ui"
    );
    const data = await response.json();

    const tx = await sbtcWithdrawHelper({
      network: TESTNET,
      sbtcWalletAddress: data.sbtcContractData.sbtcWalletAddress,
      bitcoinAddress: userData.profile.btcAddress.p2wpkh.testnet,
      amountSats: satoshis,
      signature,
      feeRate: await testnet.estimateFeeRate("low"),
      fulfillmentFeeSats: 2000,
      utxos,
      bitcoinChangeAddress: userData.profile.btcAddress.p2wpkh.testnet,
    });
    const psbt = tx.toPSBT();
    const requestParams = {
      publicKey: userData.profile.btcPublicKey.p2wpkh.testnet,
      hex: bytesToHex(psbt),
    };
    const txResponse = await window.btc.request("signPsbt", requestParams);
    const formattedTx = btc.Transaction.fromPSBT(
      hexToBytes(txResponse.result.hex)
    );
    formattedTx.finalize();
    const finalTx = await testnet.broadcastTx(formattedTx);
    console.log(finalTx);
  };

  return (
    <form className="flex items-center justify-center space-x-4">
      <input
        type="number"
        placeholder="Amount of BTC to deposit"
        className="w-1/3 px-4 py-2 text-gray-300 bg-gray-700 rounded focus:outline-none focus:border-orange-500"
        value={satoshis}
        onChange={handleInputChange}
      />
      <button
        className="px-6 py-2 bg-orange-500 rounded hover:bg-orange-600 focus:outline-none"
        onClick={(e) => {
          signature ? buildTransaction(e) : signMessage(e);
        }}
      >
        {signature ? "Broadcast Withdraw Tx" : "Sign Withdraw Tx"}
      </button>
    </form>
  );
}
```

There's a lot going on here, so let's break it down.

First we need to import quite a few different things from `sbtc` and some stacks.js packages. We'll go over what these do as we use them.

Next we are pulling in our user data and the network we will be working with, testnet in this case.

Next up we have some similar state variables as before, and an addition one, signature.

When we initiate withdrawals, we first need to sign a Stacks message proving we are the owner of the account with the sBTC, then we can take that signature and broadcast it with our withdrawal request on the Bitcoin side.

That's what this `signMessage` function is doing. We are generating our message in a specific format that the sBTC binary expects it, and then signing it, and saving that signature.

Once that signature is set, we can then broadcast our transaction.

We do that in a similar way to the deposit function, where we use a helper to build the withdrawal transaction, passing it all the data we need (including the signature we just generated) and using Leather to sign and broadcast it.

Once that is broadcasted successfully, you'll see the transaction ID logged and you can view it in a block explorer.

### Wrapping Up

Congratulations! You just built a basic DeFi app powered by Bitcoin. sBTC is just a baby right now, and many more improvements will be made over the coming months as the system is fully fleshed out.

In the meantime, continue to explore what it's capable of and keep up with development by checking out [sBTC.tech](https://sbtc.tech) and [Bitcoin Writes](https://bitcoinwrites.com).
