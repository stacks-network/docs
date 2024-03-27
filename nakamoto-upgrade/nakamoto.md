# Nakamoto Testnet

**Primary Usage:** App Developers, Signers

**About:**

* This testnet runs on a 20 block reward cycle length to accelerate the signer validation logic
* This testnet will always run against Bitcoin Testnet
* **This testnet starts fresh with a clean chain state, it does not use existing chain state from the Stacks testnet**
* Nakamoto rules will be applied to the existing Stacks testnet (including existing chain state) on Thursday March 28
  * This testnet will utilize the usual 1 week block reward cycle, rather than the 20 block reward cycle

**Here are some things currently in place on the Nakamoto Testnet:**

Today’s testnet includes the new contracts used for Signers and pox-4. This includes the new consensus rules which aren’t fully activated yet. Signers are now able to onboard and conduct distributed key generation and on-chain voting for the aggregate key, allowing them to test everything without the pressure of the network consensus requiring the real signing of blocks.

### Getting Started with the Nakamoto Testnet

You can jump into and begin using the Nakamoto Testnet today, here are some links to help you get started whether you are an app builder or a signer.

#### New Docs

There have been several updates to Hiro's products including Clarinet, Stacks.js, and the API. You can view a summary of all the changes and links to relevant documentation on [Hiro's Nakamoto Docs ](https://docs.hiro.so/nakamoto)page.

#### API Endpoints

* API status: [https://api.nakamoto.testnet.hiro.so/extended/](https://api.nakamoto.testnet.hiro.so/extended/)
* Burn Block endpoint. This will allow you to get the hashes of fast Stacks blocks as they are added to the chain and see their associated burn blocks. [https://api.nakamoto.testnet.hiro.so/extended/v2/burn-blocks](https://api.nakamoto.testnet.hiro.so/extended/v2/burn-blocks)
* Pox endpoint. This allows you to get information about proof of transfer, including the currently deployed pox-4 contract. This will be helpful for anyone looking to incorporate stacking into their app. [https://api.nakamoto.testnet.hiro.so/v2/pox](https://api.nakamoto.testnet.hiro.so/v2/pox)

#### Important addresses

Nakamoto Testnet launches with 3 default signer/stackers. There addresses are listed below.

* [Signer 1](https://explorer.hiro.so/address/ST20Q2N56E1NBWE37R4VGSF89X4HHTB3GSMD8GKYW?chain=testnet\&api=https://api.nakamoto.testnet.hiro.so)
* [Signer 2](https://explorer.hiro.so/address/ST2Q6124HQFKVKPJSS5J6156BJR74FD6EC1297HJ1?chain=testnet\&api=https://api.nakamoto.testnet.hiro.so)
* [Signer 3](https://explorer.hiro.so/address/ST1114TBQYGNPGFAVXKWBKZAHP0X7ZGX9K6XYYE4F?chain=testnet\&api=https://api.nakamoto.testnet.hiro.so)
* [Faucet sender](https://explorer.hiro.so/address/ST0DZFQ1XGHC5P1BZ6B7HSWQKQJHM74JBGCSDTNA?chain=testnet\&api=https://api.nakamoto.testnet.hiro.so) (the address the Nakamoto Testnet faucet sends from)

#### PoX-4 Contract

`pox-4.clar` is the new stacking contract for Nakamoto. If you are interested in experimenting with proof of transfer use cases including state changes, solo stacking, and pool stacking, all the functions you’ll need can be found at the deployed contract: [https://explorer.hiro.so/txid/0xaf8857ee1e4b8afc72f85b85ad785e1394672743acc63f4df79fb65b5e8b9d2a?chain=testnet\&api=https://api.nakamoto.testnet.hiro.so](https://explorer.hiro.so/txid/0xaf8857ee1e4b8afc72f85b85ad785e1394672743acc63f4df79fb65b5e8b9d2a?chain=testnet\&api=https://api.nakamoto.testnet.hiro.so)

#### Signers Voting Contract

After a DKG (Distributed Key Generation) round, signer votes are submitted to this contract. For more on DKG, you can read the [Stackers and Signing](nakamoto-in-depth/stackers-and-signing.md) section of Nakamoto In-Depth.

[https://explorer.hiro.so/txid/ST000000000000000000002AMW42H.signers-voting?chain=testnet\&api=https://api.nakamoto.testnet.hiro.so](https://explorer.hiro.so/txid/ST000000000000000000002AMW42H.signers-voting?chain=testnet\&api=https://api.nakamoto.testnet.hiro.so)

#### Block Explorer

The explorer will allow you to view fast blocks as they come in. Be sure to turn on “Live updates” to see them coming in in real time. [https://explorer.hiro.so/?chain=testnet\&api=https://api.nakamoto.testnet.hiro.so](https://explorer.hiro.so/?chain=testnet\&api=https://api.nakamoto.testnet.hiro.so)

<figure><img src="../.gitbook/assets/image (4).png" alt=""><figcaption><p>Turn on Live Updates to view blocks coming in in real time</p></figcaption></figure>

#### Local Development Environment

Clarinet has been updated to work with Nakamoto using as of [version 2.4](https://github.com/hirosystems/clarinet/releases/tag/v2.4.0). That means you can use Clarinet to build locally using Nakamoto rules in your local development environment and use Clarinet and deployment plans to deploy to Nakamoto Testnet.

Be sure to [update Clarinet](https://docs.hiro.so/clarinet/getting-started) to the newest version.

#### Running a signer

If you are interested in running a signer, you can take a look at the [How to Run a Signer](signing-and-stacking/running-a-signer.md) doc which will get you up to speed on how to get the signer software set up using Nakamoto.

#### Office Hours

If you need support or just want to ask questions while experimenting with the Nakamoto Testnet, you can [join the weekly office hours](https://events.stacks.co/event/HD16484710) with the Stacks' Foundation's Developer Advocate, Kenny Rogers.
