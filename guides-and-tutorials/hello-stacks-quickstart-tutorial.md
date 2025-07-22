# Hello Stacks Quickstart Tutorial

## Build Your First Stacks App in 30 Minutes

Looking to see what building on Stacks is all about? You're in the right place.

This tutorial will help you build a working Stacks application in just 30 minutes. You'll learn the essential tools and concepts needed to build decentralized applications on Stacks, the leading Bitcoin L2.

**What you'll build:** A simple message board where users can post messages to the blockchain and read messages from others.

**What you'll learn:**

- How to write a Clarity smart contract
- How to deploy contracts to Stacks testnet
- How to connect a wallet to your app
- How to interact with contracts from a frontend

**Prerequisites:**

- Basic familiarity with web development (HTML, CSS, JavaScript)
- A modern web browser
- 30 minutes of your time

Let's get started!

## Step 1: Set Up Your Wallet (5 minutes)

First, you'll need a Stacks wallet to interact with the blockchain.

### Install Leather Wallet

1. Visit [leather.io](https://leather.io) and install the browser extension
2. Create a new wallet or import an existing one
3. **Important**: Switch to the **Testnet** network in your wallet settings
4. Get testnet STX tokens from the [Stacks Testnet Faucet](https://explorer.hiro.so/sandbox/faucet?chain=testnet)

{% hint style="info" %}
Testnet STX tokens are free and used for testing. They have no real value but let you experiment with Stacks development without cost.
{% endhint %}

Your wallet is now ready for testnet development!

{% hint style="info" %}
You don't have to use Leather, two other wallets popular with Stacks users are [Xverse](https://xverse.app) and [Asigna](https://asigna.io) if you need a multisig.
{% endhint %}

## Step 2: Write Your First Clarity Contract (10 minutes)

Clarity is Stacks' smart contract language, designed for safety and predictability. Let's write a simple message board contract.

Clarity is inspired by LISP and uses a functional programming approach. Everything in Clarity is an expression wrapped in parentheses. This can be a bit overwhelming at first if you are used to languages like JavaScript or Solidity, but the learning curve is short and Clarity is a simple language to understand once you dive in and start using it.

For a more detailed introduction, check out the [Clarity Crash Course](./clarity-crash-course.md) in the docs.

### Write the Contract

Open [Clarity Playground](https://play.hiro.so/) in your browser. This is an online IDE where you can write and test Clarity code without installing anything.

Delete the existing code and replace it with this message board contract:

```clarity
;; Simple Message Board Contract
;; This contract allows users to post and read messages

;; Define a map to store messages
;; Key: message ID (uint), Value: message content (string-utf8 280)
(define-map messages uint (string-utf8 280))

;; Define a map to store message authors
(define-map message-authors uint principal)

;; Counter for message IDs
(define-data-var message-count uint u0)

;; Public function to add a new message
(define-public (add-message (content (string-utf8 280)))
  (let ((id (+ (var-get message-count) u1)))
    (map-set messages id content)
    (map-set message-authors id tx-sender)
    (var-set message-count id)
    (ok id)))

;; Read-only function to get a message by ID
(define-read-only (get-message (id uint))
  (map-get? messages id))

;; Read-only function to get message author
(define-read-only (get-message-author (id uint))
  (map-get? message-authors id))

;; Read-only function to get total message count
(define-read-only (get-message-count)
  (var-get message-count))

;; Read-only function to get the last few messages
(define-read-only (get-recent-messages (count uint))
  (let ((total-count (var-get message-count)))
    (if (> count total-count)
      (map get-message (list u1 u2 u3 u4 u5))
      (map get-message (list
        (- total-count (- count u1))
        (- total-count (- count u2))
        (- total-count (- count u3))
        (- total-count (- count u4))
        (- total-count (- count u5)))))))
```

### Test the Contract

Click "Deploy", and go to the command line in the bottom right corner and try calling the functions.

We are using the [contract-call?](../reference/functions.md#contract-call) method to call the functions in the contract that we just deployed within the playground.

```clarity
;; Test adding a message
(contract-call? .contract-1 add-message u"Hello, Stacks!")

;; Test reading the message
(contract-call? .contract-1 get-message u1)

;; Test getting the count
(contract-call? .contract-1 get-message-count)
```

You should see the contract working in the evaluation panel on the right!

### Key Clarity Concepts Explained

Now that you've seen the contract in action, let's talk about the core Clarity concepts you just used. When you write `define-map`, you're creating a data structure for storing key-value pairs on the blockchain. Think of it like creating a table in a database. The `define-data-var` function creates a variable that persists on the blockchain, perfect for keeping track of counters or settings that need to survive between function calls.

When you declare a function with `define-public`, you're creating a function that can modify blockchain state and be called by anyone externally. This is different from `define-read-only`, which creates functions that can only read existing data without changing anything. This separation helps prevent accidental state changes and makes your contract's behavior more predictable.

The `tx-sender` variable is particularly useful because it's automatically set by the blockchain to contain the address of whoever called your function. You can't fake this value, which makes it perfect for authentication. When you need to create temporary variables within a function, you'll use `let` to set up local variables that only exist during that function call.

Finally, every public function in Clarity must return a response type, which is why you see `ok` wrapping our return values. This ensures that every function call has a clear success or failure outcome, making your contracts much more predictable and easier to debug.

<details>
<summary><strong>🔍 Deep Dive: Understanding the Contract Code (Optional)</strong></summary>

Want to understand exactly what each part of the contract is doing? Let's walk through every function and concept used in our message board contract. Links to the official documentation are included for each function, so you may dive deeper if you want.

### How We Store Data on the Blockchain

Let's start with how we're storing our messages. We use [`define-map`](../reference/functions.md#define-map) to create what's essentially a database table on the blockchain:

```clarity
(define-map messages uint (string-utf8 280))
```

Think of this as creating a table where each message gets a unique number (the `uint` key) and the message content can be up to 280 characters (the `string-utf8 280` value). It's like having a simple database where message #1 might be "Hello World!", message #2 might be "Learning Clarity!", and so on.

We also create another map to track who wrote each message:

```clarity
(define-map message-authors uint principal)
```

This links each message ID to a `principal` (that's Clarity's term for a blockchain address). So if you post message #1, we'll store your address alongside that message ID.

Finally, we need a way to keep track of how many messages we've posted so far:

```clarity
(define-data-var message-count uint u0)
```

The [`define-data-var`](../reference/functions.md#define-data-var) creates a single variable that persists on the blockchain. We start it at `u0` (that's how you write the number 0 for unsigned integers in Clarity). The `u` prefix might look weird if you're coming from other languages, but it's just Clarity's way of saying "this is a positive integer."

### The Heart of Our Contract: Adding Messages

Now let's break down the most important function, the one that actually adds messages to our board:

```clarity
(define-public (add-message (content (string-utf8 280)))
  (let ((id (+ (var-get message-count) u1)))
    (map-set messages id content)
    (map-set message-authors id tx-sender)
    (var-set message-count id)
    (ok id)))
```

Step by step, this function performs:

When you call [`define-public`](../reference/functions.md#define-public), you're creating a function that anyone can call from outside the contract. The function takes one parameter called `content` that must be a UTF-8 string of maximum 280 characters.

Inside the function, we use [`let`](../reference/functions.md#let) to create a local variable. This is like declaring a variable inside a function in other languages, but with Clarity's unique syntax. We're creating a variable called `id` and setting it to the current message count plus 1.

*Here's where Clarity might trip you up if you're coming from other languages.* Notice how we write `(+ (var-get message-count) u1)` instead of something like `message-count + 1`. In Clarity, operators like `+`, `-`, `>`, and `<` are actually functions that use prefix notation. So `(+ 2 3)` means "add 2 and 3" (instead of `2 + 3` like you'd write in JavaScript or Python). This is part of Clarity's LISP-inspired syntax where everything is a function call.

The [`var-get`](../reference/functions.md#var-get) function reads the current value of our message counter, and [`+`](../reference/functions.md#add) adds 1 to create the next message ID.

Next, we store the message content using [`map-set`](../reference/functions.md#map-set), which is like inserting a row into a database table. We store the message content with the new ID we just created.

We also store who posted the message using another [`map-set`](../reference/functions.md#map-set) call (*Notice how we use `tx-sender` here*). This is a special variable that Clarity automatically sets to the address of whoever called the function. You can't fake this or manipulate it, which makes it perfect for tracking message authors.

We update our message counter using [`var-set`](../reference/functions.md#var-set), and finally return [`ok`](../reference/functions.md#ok) with the new message ID. In Clarity, all public functions must return either `(ok value)` for success or `(err error)` for failure. This ensures that every function call has a predictable outcome.

### Reading Messages Back

Now let's look at how we read messages back from the blockchain. Our simplest function is:

```clarity
(define-read-only (get-message (id uint))
  (map-get? messages id))
```

When you use [`define-read-only`](../reference/functions.md#define-read-only), you're creating a function that can only read data, never modify it. This is perfect for getter functions like this one.

The [`map-get?`](../reference/functions.md#map-get) function looks up a message by its ID. Notice the `?` at the end of the function name. This is Clarity's convention for functions that might not find what they're looking for. If the message exists, you'll get back `(some "message content")`. If it doesn't exist, you'll get `none`. This is much safer than null pointers in other languages because you have to explicitly handle both cases.

We have similar functions for getting the message author and the total message count:

```clarity
(define-read-only (get-message-author (id uint))
  (map-get? message-authors id))

(define-read-only (get-message-count)
  (var-get message-count))
```

The message count function is particularly simple because it just reads our counter variable and returns it. No parameters needed since there's only one counter.

### A More Complex Function: Getting Recent Messages

Let's look at our most complex function:

```clarity
(define-read-only (get-recent-messages (count uint))
  (let ((total-count (var-get message-count)))
    (if (> count total-count)
      (map get-message (list u1 u2 u3 u4 u5))
      (map get-message (list
        (- total-count (- count u1))
        (- total-count (- count u2))
        (- total-count (- count u3))
        (- total-count (- count u4))
        (- total-count (- count u5)))))))
```

This function demonstrates several advanced Clarity concepts. We use [`if`](../reference/functions.md#if) for conditional logic. The [`>`](../reference/functions.md#greater-than) operator (remember, it's a function in prefix notation) compares whether the requested count is greater than our total messages.

The [`map`](../reference/functions.md#map) function applies another function to each item in a list. So `(map get-message (list u1 u2 u3))` would call `get-message` on each of the numbers 1, 2, and 3.

We use [`list`](../reference/functions.md#list) to create a list of message IDs, and [`-`](../reference/functions.md#subtract) for subtraction to calculate which recent messages to fetch.

### What Makes Clarity Special

Now that you've seen the code, let me explain some of the key concepts that make Clarity different from other smart contract languages.

One of the most important things to understand about Clarity is its response types. Every public function must return either `(ok value)` or `(err error)`. This might seem annoying at first, but it ensures that every function call has a predictable outcome. If a function returns `err`, any changes it made to the blockchain are automatically rolled back. If it returns `ok`, the changes are committed. This prevents a lot of the bugs that plague other blockchain platforms.

Clarity also uses optional types extensively. Functions like `map-get?` return `(some value)` or `none` instead of potentially null values. This forces you to handle the case where data might not exist, which eliminates an entire class of bugs that you see in other languages where developers may neglect to check for null values.

Understanding data persistence on the blockchain is another key concept. While Clarity does provide functions like `map-delete` and `map-set` that can modify or remove data, the decision of whether to make data mutable is entirely up to the contract developer. Notice how our contract doesn't have any functions to edit or delete messages. This is a deliberate design choice for our message board - we want messages to be permanent and trustworthy once posted. You could easily add update or delete functionality if your use case requires it, but for a message board, immutability makes sense.

Every operation on the blockchain has execution costs, and Clarity is designed to make these costs predictable. Simple operations like reading a variable cost very little, while complex operations cost more. This is why we [avoid unbounded loops and recursion in Clarity](../concepts/clarity/decidability.md) at the language level - they can lead to unpredictable costs and potentially infinite execution.

The automatic sender tracking through the `tx-sender` variable gives you built-in authentication without having to implement it yourself. This variable is automatically set by the blockchain and can't be spoofed, making it perfect for knowing who called your function.

{% hint style="warning" %}
**Important**: Be careful when using `tx-sender` vs `contract-caller` in your contracts. While `tx-sender` refers to the original transaction sender and remains constant throughout the entire transaction chain, `contract-caller` refers to the most recent principal in the transaction chain and can change with each internal function or contract call. This difference is crucial for security - malicious contracts can potentially exploit `tx-sender`'s persistent context to bypass admin checks if you're not careful. For simple contracts like our message board, `tx-sender` is appropriate, but for more complex authorization logic, consider whether you need the original sender or the immediate caller.

For more details on this, check out [this excellent blog post](https://www.setzeus.com/public-blog-post/clarity-carefully-tx-sender) from Clarity developer [setzeus](https://x.com/setzeus).
{% endhint %}

Clarity's type safety means every variable and parameter has an explicit type. While Clarity is an interpreted language (not compiled), it performs comprehensive static analysis at deployment time through a multi-pass analysis system. This analysis catches type mismatches, undefined variables, and other errors before your contract is deployed, preventing runtime errors that could cause your contract to fail unexpectedly. Tools like `clarinet check` use this same analysis system to catch errors during development.

Finally, Clarity's predictable execution model and [decidability](../concepts/clarity/decidability.md) mean that every function will terminate, and execution costs are predictable. Clarity doesn't allow recursion or unbounded loops, which makes Clarity contracts more reliable and easier to reason about than contracts written in other languages.

This contract demonstrates the core patterns you'll use in most Clarity smart contracts: storing data in maps and variables, creating public functions for state changes, read-only functions for data access, and proper error handling with response types.

</details>

## Step 3: Deploy Your Contract (5 minutes)

Now let's deploy your contract to the Stacks testnet so you can interact with it from a web application.

### Deploy via Stacks Explorer

1. Visit the [Stacks Explorer Sandbox](https://explorer.hiro.so/sandbox/deploy?chain=testnet)
2. Connect your Leather wallet (make sure you're on testnet)
3. Paste your contract code into the editor
4. Give your contract a name (e.g., "message-board") or just use the default generated name
5. Click "Deploy Contract"
6. Confirm the transaction in your wallet

The deployment should only take a few seconds. Once complete, you'll see your contract address in the explorer. Here's [my transaction](https://explorer.hiro.so/txid/0x3df7b597d1bbb3ce1598b1b0e28b7cbed38345fcf3fb33ae387165e13085e5d8?chain=testnet) deploying this contract.

### Test Your Deployed Contract

1. In the explorer, find your deployed contract
2. Scroll down a bit and click on "Available Functions" to view its functions
3. Try calling `add-message` with a test message (you'll need to change the post conditions toggle to allow mode, there is a dedicated docs page talking about [Post Conditions on Stacks](../concepts/transactions/post-conditions.md))
4. Call `get-message` with ID `u1` to read it back
5. Call `get-message-count` to see the total

Your contract is now live and functional on the blockchain!

## Step 4: Build the Frontend (10 minutes)

Let's create a simple web interface to interact with your contract.

### Set Up the Project

Create a new React project:

```bash
npm create vite@latest my-message-board -- --template react
cd my-message-board
npm install
```

Install the Stacks.js libraries:

```bash
npm install @stacks/connect @stacks/transactions @stacks/network
```

### Create the App Component

Replace the contents of `src/App.jsx` with the following:

{% hint style="info" %}
Since this is a quickstart, we won't dive into a long explanation of exacly what this code is doing. We suggest going and checking out [Hiro's Docs](https://docs.hiro.so/stacks/stacks.js) in order to get a handle on how stacks.js works.
{% endhint %}

```jsx
import { useState, useEffect } from "react";
import { connect, disconnect, isConnected, request } from "@stacks/connect";
import {
  fetchCallReadOnlyFunction,
  stringUtf8CV,
  uintCV,
} from "@stacks/transactions";
import "./App.css";

const network = "testnet";

// Replace with your contract address
const CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS_HERE";
const CONTRACT_NAME = "message-board";

function App() {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setConnected(isConnected());
    if (isConnected()) {
      loadMessages();
    }
  }, []);

  // Check for connection changes
  useEffect(() => {
    const checkConnection = () => {
      const connectionStatus = isConnected();
      if (connectionStatus !== connected) {
        setConnected(connectionStatus);
        if (connectionStatus) {
          loadMessages();
        }
      }
    };

    const intervalId = setInterval(checkConnection, 500);
    return () => clearInterval(intervalId);
  }, [connected]);

  const connectWallet = async () => {
    try {
      await connect({
        appDetails: {
          name: "Message Board",
          icon: window.location.origin + "/logo.svg",
        },
        onFinish: () => {
          setConnected(true);
          // Small delay to ensure connection is fully established
          setTimeout(() => {
            loadMessages();
          }, 100);
        },
      });
    } catch (error) {
      console.error("Connection failed:", error);
    }
  };

  const disconnectWallet = () => {
    disconnect();
    setConnected(false);
    setMessages([]);
  };

  const loadMessages = async () => {
    try {
      // Get message count
      const countResult = await fetchCallReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: "get-message-count",
        functionArgs: [],
        network,
        senderAddress: CONTRACT_ADDRESS,
      });

      const count = parseInt(countResult.value);

      // Load recent messages
      const messagePromises = [];
      for (let i = Math.max(1, count - 4); i <= count; i++) {
        messagePromises.push(
          fetchCallReadOnlyFunction({
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACT_NAME,
            functionName: "get-message",
            functionArgs: [uintCV(i)],
            network,
            senderAddress: CONTRACT_ADDRESS,
          })
        );
      }

      const messageResults = await Promise.all(messagePromises);
      const loadedMessages = messageResults
        .map((result, index) => ({
          id: count - messageResults.length + index + 1,
          content: result.value.value,
        }))
        .filter((msg) => msg.content !== undefined);

      setMessages(loadedMessages);
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const postMessage = async () => {
    if (!newMessage.trim()) return;

    setLoading(true);
    try {
      const result = await request("stx_callContract", {
        contract: `${CONTRACT_ADDRESS}.${CONTRACT_NAME}`,
        functionName: "add-message",
        functionArgs: [stringUtf8CV(newMessage)],
        network,
      });

      console.log("Transaction submitted:", result.txid);
      setNewMessage("");

      // Reload messages after a delay to allow the transaction to process
      setTimeout(() => {
        loadMessages();
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Error posting message:", error);
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>📝 Stacks Message Board</h1>

        {!connected ? (
          <button onClick={connectWallet} className="connect-button">
            Connect Wallet
          </button>
        ) : (
          <button onClick={disconnectWallet} className="disconnect-button">
            Disconnect
          </button>
        )}
      </header>

      {connected && (
        <main className="App-main">
          <div className="post-message">
            <h2>Post a Message</h2>
            <div className="message-input">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="What's on your mind?"
                maxLength={280}
                disabled={loading}
              />
              <button
                onClick={postMessage}
                disabled={loading || !newMessage.trim()}
              >
                {loading ? "Posting..." : "Post"}
              </button>
            </div>
          </div>

          <div className="messages">
            <h2>Recent Messages</h2>
            <button onClick={loadMessages} className="refresh-button">
              Refresh
            </button>
            {messages.length === 0 ? (
              <p>No messages yet. Be the first to post!</p>
            ) : (
              <ul>
                {messages.map((message) => (
                  <li key={message.id}>
                    <strong>Message #{message.id}:</strong> {message.content}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </main>
      )}
    </div>
  );
}

export default App;
```

### Add Basic Styling

Update `src/App.css`:

```css
.App {
  max-width: 800px;
  width: 100%;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
    "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
    "Helvetica Neue", sans-serif;
}

.App-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.App-header h1 {
  color: white;
  margin-bottom: 20px;
  font-size: 2.5rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.connect-button,
.disconnect-button {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 12px 28px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.connect-button:hover,
.disconnect-button:hover {
  background-color: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.post-message {
  margin-bottom: 40px;
  padding: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.message-input {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.message-input input {
  flex: 1;
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 16px;
}

.message-input button {
  background-color: #10b981;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.message-input button:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.messages {
  padding: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.refresh-button {
  background-color: #6b7280;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 20px;
}

.messages ul {
  list-style: none;
  padding: 0;
}

.messages li {
  padding: 10px;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 10px;
}

.messages li:last-child {
  border-bottom: none;
}
```

### Update the Contract Address

1. Go back to the Stacks Explorer and find your deployed contract
2. Copy the contract address (it looks like `ST1ABC...123.message-board`)
3. Replace `YOUR_CONTRACT_ADDRESS_HERE` in the App.jsx file with your actual contract address and the contract name with the actual name

### Run Your App

```bash
npm run dev
```

Visit `http://localhost:5173` and you should see your message board app! Connect your wallet and try posting a message.

## Congratulations! 🎉

You've just built your first Stacks application! Here's what you accomplished:

1. ✅ Wrote a Clarity smart contract with data storage and public functions
2. ✅ Deployed the contract to Stacks testnet
3. ✅ Built a React frontend that connects to a Stacks wallet
4. ✅ Integrated your frontend with your smart contract
5. ✅ Posted and read data from the blockchain

## Next Steps

Now that you have the basics down, here are some ways to continue your Stacks development journey:

### Learn More About Clarity

- **[Clarity Book](https://book.clarity-lang.org/)**: Comprehensive guide to Clarity development
- **[Clarity Reference](https://docs.stacks.co/docs/clarity)**: Complete documentation of Clarity functions
- **[Clarity Crash Course](https://docs.stacks.co/docs/clarity-crash-course)**: Quick introduction to Clarity concepts

### Explore Advanced Features

- **Error Handling**: Learn about Clarity's `try!` and `unwrap!` functions
- **Access Control**: Implement admin functions and permissions
- **Token Standards**: Build fungible (SIP-010) and non-fungible (SIP-009) tokens

### Development Tools

- **[Clarinet](https://github.com/hirosystems/clarinet)**: Local development environment for Clarity
- **[Hiro Platform](https://platform.hiro.so)**: Hosted development environment
- **[Stacks Explorer](https://explorer.stacks.co)**: View transactions and contracts on mainnet

### Community Resources

- **[Stacks Discord](https://discord.gg/stacks)**: Connect with other developers
- **[Stacks Forum](https://forum.stacks.org)**: Ask questions and share projects
- **[Stacks GitHub](https://github.com/stacks-network)**: Contribute to the ecosystem

Happy building! 🚀
