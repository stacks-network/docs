# Nakamoto Testnet

{% hint style="info" %}
Nakamoto has been instantiated on the primary Stacks testnet. If you began experimenting with testnet prior to March 28, 2024, you probably were using the Nakamoto Testnet. Continuing to use that is perfectly fine and you don't need to change anything, but we recommend new work be performed on the primary testnet, outlined below.
{% endhint %}

<details>

<summary>Nakamoto Testnet Environments</summary>

There are several different testnet environments available to test Nakamoto. This doc covers the primary testnet, which is the main Stacks testnet with all the existing chain state and recommended for most users.

However, there are a few additional testnet environments you may want to be aware of.

The process for interacting with each testnet is similar. The main difference is the URL you will need to use. The differences between each and the relevant URLs are shared here.

#### Pre-Launch

Good for:

* experience fast blocks (for everyone)&#x20;
* debugging and testing (for core devs)&#x20;

Keep in mind:&#x20;

* less stable, expect frequent resets and upgrades&#x20;
* temporary, will eventually be decomissioned&#x20;
* closed network&#x20;

API endpoint: [https://api.nakamoto-1.hiro.so](https://t.co/b6wwmAgSbm)&#x20;

Explorer: [https://explorer.hiro.so/blocks?chain=testnet\&api=https://api.nakamoto-1.hiro.so](https://t.co/xy38nkO6TT)

#### Nakamoto

Good for:

* Clean slate testnet -- good for greenfield projects where you don't need or want historical state \* Open network: anyone can mine, run signers, run followers etc&#x20;
* Good for signer onboarding&#x20;
* PoX-4 integrations&#x20;
* Shorter PoX cycle: 5 block prepare phase, 20 block reward phase -- good for testing stacking flows&#x20;

Keep in mind:&#x20;

* Stable but will likely be eventually deprecated&#x20;
* Wonky genesis setup has resulted in unwieldy PoX parameters, like > 1B testnet STX stacking minimum&#x20;

API: [https://api.nakamoto.testnet.hiro.so](https://t.co/ia9g4MYxb3)&#x20;

Explorer: [https://explorer.hiro.so/?chain=testnet\&api=https://api.nakamoto.testnet.hiro.so](https://t.co/Psnhfy0ziy)

#### Primary

Good for:

* Everything that the Nakamoto testnet is good for. PLUS&#x20;
* Testnet with the most state, and thus the most edge cases. Great for testing!&#x20;

Keep in mind:

* PoX cycle is half as long as mainnet, but might still be too long for rapid iteration and testing&#x20;

API: [https://api.testnet.hiro.so](https://t.co/HkHDxCgznc)&#x20;

Explorer: [https://explorer.hiro.so/?chain=testnet](https://t.co/rtrrEtlgE0)

This is the primary testnet with Nakamoto instantiated. Pox-4 is active but Nakamoto rules and fast blocks are not yet active.

This testnet is what is covered in this doc.

Here is graphic outlining the differeces, click to zoom.

<img src="../../.gitbook/assets/image (1) (1).png" alt="" data-size="original">

</details>

**Here are some things currently in place on the Nakamoto Testnet:**

Today’s testnet includes the new contracts used for Signers and pox-4. This includes the new consensus rules which aren’t fully activated yet. Signers are now able to onboard and conduct distributed key generation and on-chain voting for the aggregate key, allowing them to test everything without the pressure of the network consensus requiring the real signing of blocks.

### Getting Started with the Nakamoto Testnet

You can jump into and begin using the Nakamoto Testnet today, here are some links to help you get started whether you are an app builder or a signer.

#### New Docs

There have been several updates to Hiro's products including Clarinet, Stacks.js, and the API. You can view a summary of all the changes and links to relevant documentation on [Hiro's Nakamoto Docs ](https://docs.hiro.so/nakamoto)page.

#### API Endpoints

* API status: [https://api.testnet.hiro.so/extended/](https://api.testnet.hiro.so/extended/)
* Burn Block endpoint. This will allow you to get the hashes of fast Stacks blocks as they are added to the chain and see their associated burn blocks. [https://api.testnet.hiro.so/extended/v2/burn-blocks](https://api.testnet.hiro.so/extended/v2/burn-blocks)
* Pox endpoint. This allows you to get information about proof of transfer, including the currently deployed pox-4 contract. This will be helpful for anyone looking to incorporate stacking into their app. [https://api.testnet.hiro.so/v2/pox](https://api.testnet.hiro.so/v2/pox)

#### PoX-4 Contract

`pox-4.clar` is the new stacking contract for Nakamoto. If you are interested in experimenting with proof of transfer use cases including state changes, solo stacking, and pool stacking, all the functions you’ll need can be found at the deployed contract: [https://explorer.hiro.so/txid/0xaf8857ee1e4b8afc72f85b85ad785e1394672743acc63f4df79fb65b5e8b9d2a?chain=testnet](https://explorer.hiro.so/txid/0xaf8857ee1e4b8afc72f85b85ad785e1394672743acc63f4df79fb65b5e8b9d2a?chain=testnet)

#### Signers Voting Contract

After a DKG (Distributed Key Generation) round, signer votes are submitted to this contract. For more on DKG, you can read the [Stackers and Signing](../nakamoto-in-depth/stackers-and-signing.md) section of Nakamoto In-Depth.

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
