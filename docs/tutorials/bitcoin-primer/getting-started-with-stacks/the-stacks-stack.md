# The Stacks Stack

In order to be an effective Stacks developer, you need to be familiar with the Stacks stack, or the different components you'll be using to build out a full-stack Stacks application and the different developer tools available to you.

We'll be using each of these as we add our feature to Crowdforge, but let's go through an overview of each of the primary pieces.

### Clarity

Clarity is the smart contract language that we use to write smart contracts on Stacks. We'll cover the basics when we look at and add to our fundraising contract, and we have an entire [section of the documentation](https://app.gitbook.com/s/kmQRCSAss8rGMUFc587c/guides-and-tutorials/clarity-crash-course) and a [whole book](https://book.clarity-lang.org) dedicated to learning Clarity.

### Platform

The Hiro Platform is what we've been using so far to get our application set up. This is likely going to be one of the main tools you use to handle a lot of your DevOps related tasks as you go through building out Stacks applications.

### Clarinet

[Clarinet](https://www.hiro.so/clarinet) is a tool for local smart contract development, although the Platform utilizes it to some extent under the hood. Clarinet is used to set up some of our configurations for our smart contracts and used to do things like execute tests on our smart contract and set up our deployment workflows.

### Stacks.js

[Stacks.js](https://www.hiro.so/stacks-js) is the JavaScript library you can use to hook your frontend up to both your contracts and the Stacks chain itself.

### Stacks API

The [Stacks API](https://www.hiro.so/stacks-api) is how you can bring chain data into your application and to broadcast new transaction data. You can call the API directly, but many of its functions are built-in as utility functions in Stacks.js.

### Explorer

Finally, the [Explorer](https://explorer.hiro.so/) is how we can view transaction data in our browser. The explorer can also be used to quickly experiment with a deploy contracts to testnet.

There are some other tools like Chainhook that are useful to be familiar with as well, but we won't be using them in this course. Readers are encouraged to check out Hiro's website and documentation to familiarize themselves with these additional tools.
