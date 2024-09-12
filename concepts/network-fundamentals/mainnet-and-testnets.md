# Mainnet and Testnets

Stacks has both a mainnet and a few different testnets for different purposes. Mainnet and testnet are two completely different networks and tokens cannot be transferred between one or the other.

### Mainnet

Stacks mainnet is directly connected to Bitcoin mainnet and is the network where tokens have actual monetary worth. This is the production network and should be treated as such.

You can view mainnet activity using [Hiro's block explorer](https://explorer.hiro.so/).

### Primary and Nakamoto Testnets

There are some notable differences between Primary Testnet and Nakamoto Testnet, this table can guide you in selecting the one most aligned with your needs.&#x20;

<table><thead><tr><th width="198">Attributes</th><th>Nakamoto Testnet</th><th>Primary Testnet</th></tr></thead><tbody><tr><td><strong>Stacking Cycle Length</strong></td><td>3 days</td><td>1 week </td></tr><tr><td><strong>Description</strong></td><td>Bleeding edge, more frequent upgrades with Release Candidates.</td><td>Stable release updates ONLY, the last step before Mainnet.</td></tr><tr><td><strong>Usage Recommendations</strong></td><td><ul><li>Use this if you don’t mind frequent resets and would like to test the latest features as they’re released</li><li>Use this if you prefer faster feedback loops to test various stacking-signer scenarios</li></ul></td><td><ul><li>Use this if you prefer more stable releases and don’t want frequent resets and updates</li><li>Use this if you don't need to be among the first to test new features</li><li>Use this if you prefer longer Stacking cycles</li></ul></td></tr><tr><td><strong>Lifespan</strong></td><td>Nakamoto Testnet will remain available until sBTC goes live on Mainnet</td><td>The Primary Testnet will exist and be maintained forever.</td></tr><tr><td><strong>Explorer</strong></td><td><a href="https://explorer.hiro.so/?chain=testnet&#x26;api=https://api.nakamoto.testnet.hiro.so">Nakamoto Explorer</a></td><td><a href="https://explorer.hiro.so/?chain=testnet">Primary Explorer</a></td></tr></tbody></table>

### Important notes on the Primary Testnet:

* Core devs are working on a BTC Regtest Explorer. In the meantime, Wallet, Explorer, and API links to BTC transactions will lead you nowhere. This is expected and will be addressed. All STX transactions are available to track on the [Explorer](https://explorer.hiro.so/?chain=testnet).
* You can start onboarding your Signer, deploy contracts and test your Apps. All functionality from the previous testnet is available.
* Old testnet data is archived and will remain [available](https://explorer.hiro.so/?chain=testnet\&api=https://api.old.testnet.hiro.so) until the end of June 2024
* **Faucet and tSTX:**
  * The [Faucet address](https://explorer.hiro.so/address/ST2QKZ4FKHAH1NQKYKYAYZPY440FEPK7GZ1R5HBP2?chain=testnet) and limits stay the same.
  * If you need more tSTX than the current daily limit to onboard your Signer on Primary Testnet, please reach out to your main point of contact in the ecosystem.

### Configuration Files for Signers

* [sample-configuration-files.md](../../reference/sample-configuration-files.md "mention")
* [#primary-testnet-config](../../reference/sample-configuration-files.md#primary-testnet-config "mention")

### About testnet

The testnet is a separate blockchain from the Stacks mainnet analogous to a staging environnement. It's a network used by developers to test their apps, smart contracts, or changes to the protocol in a production-like environment.

It produces blocks at roughly the same rate as mainnet; about 1 block every 10 minutes on average. The Stacks testnet is rarely reset.

#### Faucets

Testnet faucets provide you with free Stacks Token (STX) to test with. These are not the same as STX on mainnet and have no value. There are a couple of different options for getting testnet STX.

**Hiro**

You can get STX from the Hiro faucet on the [Hiro Explorer Sandbox](https://explorer.hiro.so/sandbox/faucet?chain=testnet), or using the [API](https://docs.hiro.so/api#tag/Faucets).

To get STX tokens from within the Explorer Sandbox, navigate to the "Faucet" tab on the left and click "Request STX" button.

You can also try out Stacking by clicking on `I want to stack`.

{% hint style="info" %}
The Explorer Sandbox requires you to login with a Stacks wallet
{% endhint %}

**LearnWeb3**

Alternatively, you can use the [LearnWeb3 faucet](https://learnweb3.io/faucets).

<figure><img src="../../.gitbook/assets/image (7).png" alt=""><figcaption></figcaption></figure>

#### Testnet API

The hosted Stacks Blockchain API for the testnet is available at this base URL:

```shell
https://api.testnet.hiro.so/
```
