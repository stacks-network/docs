# Nakamoto for App Developers

### API Endpoints

* API status
  * Tesnet: https://api.testnet.hiro.so/extended/
  * Mainnet: https://api.hiro.so/extended/
* Burn Block endpoint. This will allow you to get the hashes of fast Stacks blocks as they are added to the chain and see their associated burn blocks.
  * Testnet: https://api.testnet.hiro.so/extended/v2/burn-blocks
  * Mainnet: https://api.hiro.so/extended/v2/burn-blocks
* Pox endpoint. This allows you to get information about proof of transfer, including the currently deployed pox-4 contract. This will be helpful for anyone looking to incorporate stacking into their app.
  * Testnet: https://api.testnet.hiro.so/v2/pox
  * Mainnet: https://api.hiro.so/v2/pox

#### PoX-4 Contract

`pox-4.clar` is the stacking contract. If you are interested in experimenting with proof of transfer use cases including state changes, solo stacking, and pool stacking, all the functions you’ll need can be found at the deployed contract:

* Testnet: https://explorer.hiro.so/txid/0xfba7f786fae1953fa56f4e56aeac053575fd48bf72360523366d739e96613da3?chain=testnet
* Mainnet: https://explorer.hiro.so/txid/0xc6d6e6ec82cabb2d7a9f4b85fcc298778d01186cabaee01685537aca390cdb46?chain=mainnet

#### Signers Voting Contract

After a DKG (Distributed Key Generation) round, signer votes are submitted to this contract. For more on DKG, you can read the Stackers and Signing section of Nakamoto In-Depth:

https://explorer.hiro.so/txid/0x69af1dbed501acdbc0d1c79e1ecbc17e1904edacc15cf4b39d6783e720e21c00?chain=testnet

#### Block Explorer

The explorer will allow you to view fast blocks as they come in. Be sure to turn on “Live updates” to see them coming in in real time.\
https://explorer.hiro.so/?chain=testnet

#### Local Development Environment

Clarinet has been updated to work with Nakamoto as of version 2.4. That means you can use Clarinet to build locally using Nakamoto rules in your local development environment and use Clarinet and deployment plans to deploy to Nakamoto Testnet.

Be sure to update Clarinet to the newest version: https://docs.hiro.so/clarinet/getting-started

#### Running a signer

If you are interested in running a signer, you can take a look at the How to Run a Signer doc which will get you up to speed on how to get the signer software set up using Nakamoto:

../../guides-and-tutorials/running-a-signer/

#### Office Hours

If you need support or just want to ask questions while experimenting with the Nakamoto Testnet, you can join the weekly office hours with the Stacks' Foundation's Developer Advocate, Kenny Rogers:

https://events.stacks.co/event/HD16484710
