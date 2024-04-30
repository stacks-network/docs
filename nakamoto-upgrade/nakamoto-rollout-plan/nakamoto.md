# Nakamoto for App Developers

**Here are some things currently in place:**

Today’s testnet and mainnet (as of Bitcoin block 840,360) include the new contracts used for Signers and pox-4. This includes the new consensus rules which aren’t fully activated yet. Signers are now able to onboard and conduct distributed key generation and on-chain voting for the aggregate key, allowing them to test everything without the pressure of the network consensus requiring the real signing of blocks.

Fast blocks and Bitcoin finality will not be available until activation around August 28th. Until then, application developers can go about their development process as normal, but there are a few things to be aware of depending on the functionality your app has.

### Getting Started with Nakamoto

You can jump into and begin using Nakamoto today, here are some links to help you get started.

#### New Docs

There have been several updates to Hiro's products including Clarinet, Stacks.js, and the API. You can view a summary of all the changes and links to relevant documentation on [Hiro's Nakamoto Docs ](https://docs.hiro.so/nakamoto)page.

#### API Endpoints

* API status&#x20;
  * Tesnet: [https://api.testnet.hiro.so/extended/](https://api.testnet.hiro.so/extended/)
  * Mainnet: [https://api.hiro.so/extended/](https://api.hiro.so/extended/)
* Burn Block endpoint. This will allow you to get the hashes of fast Stacks blocks as they are added to the chain and see their associated burn blocks.
  * Testnet: [https://api.testnet.hiro.so/extended/v2/burn-blocks](https://api.testnet.hiro.so/extended/v2/burn-blocks)
  * Mainnet: [https://api.hiro.so/extended/v2/burn-blocks](https://api.hiro.so/extended/v2/burn-blocks)
* Pox endpoint. This allows you to get information about proof of transfer, including the currently deployed pox-4 contract. This will be helpful for anyone looking to incorporate stacking into their app.
  * Testnet: [https://api.testnet.hiro.so/v2/pox](https://api.testnet.hiro.so/v2/pox)
  * Mainnet: [https://api.hiro.so/v2/pox](https://api.hiro.so/v2/pox)

#### PoX-4 Contract

`pox-4.clar` is the new stacking contract for Nakamoto. If you are interested in experimenting with proof of transfer use cases including state changes, solo stacking, and pool stacking, all the functions you’ll need can be found at the deployed contract:&#x20;

* Testnet: [https://explorer.hiro.so/txid/0xfba7f786fae1953fa56f4e56aeac053575fd48bf72360523366d739e96613da3?chain=testnet](https://explorer.hiro.so/txid/0xfba7f786fae1953fa56f4e56aeac053575fd48bf72360523366d739e96613da3?chain=testnet)
* Mainnet: [https://explorer.hiro.so/txid/0xc6d6e6ec82cabb2d7a9f4b85fcc298778d01186cabaee01685537aca390cdb46?chain=mainnet](https://explorer.hiro.so/txid/0xc6d6e6ec82cabb2d7a9f4b85fcc298778d01186cabaee01685537aca390cdb46?chain=mainnet)

#### Signers Voting Contract

After a DKG (Distributed Key Generation) round, signer votes are submitted to this contract. For more on DKG, you can read the [Stackers and Signing](../what-is-the-nakamoto-release/nakamoto-in-depth/stackers-and-signing.md) section of Nakamoto In-Depth.

[https://explorer.hiro.so/txid/0x69af1dbed501acdbc0d1c79e1ecbc17e1904edacc15cf4b39d6783e720e21c00?chain=testnet](https://explorer.hiro.so/txid/0x69af1dbed501acdbc0d1c79e1ecbc17e1904edacc15cf4b39d6783e720e21c00?chain=testnet)

#### Block Explorer

The explorer will allow you to view fast blocks as they come in. Be sure to turn on “Live updates” to see them coming in in real time. [https://explorer.hiro.so/?chain=testnet](https://explorer.hiro.so/?chain=testnet)

<figure><img src="../../.gitbook/assets/image (4).png" alt=""><figcaption><p>Turn on Live Updates to view blocks coming in in real time</p></figcaption></figure>

#### Local Development Environment

Clarinet has been updated to work with Nakamoto using as of [version 2.4](https://github.com/hirosystems/clarinet/releases/tag/v2.4.0). That means you can use Clarinet to build locally using Nakamoto rules in your local development environment and use Clarinet and deployment plans to deploy to Nakamoto Testnet.

Be sure to [update Clarinet](https://docs.hiro.so/clarinet/getting-started) to the newest version.

#### Running a signer

If you are interested in running a signer, you can take a look at the [How to Run a Signer](../signing-and-stacking/running-a-signer.md) doc which will get you up to speed on how to get the signer software set up using Nakamoto.

#### Office Hours

If you need support or just want to ask questions while experimenting with the Nakamoto Testnet, you can [join the weekly office hours](https://events.stacks.co/event/HD16484710) with the Stacks' Foundation's Developer Advocate, Kenny Rogers.
