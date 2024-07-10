---
description: >-
  There are two main options when it comes to testnets. The one you work with
  will depend on your own testing needs and preferences.
---

# Nakamoto & Primary Testnet

<details>

<summary>Recent Testnet History (May 2024)</summary>

Over the past month+, the Bitcoin Testnet has slowly become[ unusable](https://blog.lopp.net/griefing-bitcoin-testnet/). Given the Primary Stacks Testnet leverages Bitcoin to provide a realistic environment, the Stacks testnet also became unusable. To overcome this, the core developers spun up the [Nakamoto Testnet](https://explorer.hiro.so/?chain=testnet\&api=https://api.nakamoto.testnet.hiro.so) to unblock Signers and test ahead of [Nakamoto Instantiation](nakamoto-rollout-plan/). \
\
In the background, they have also been working to bring the Primary Testnet back. To achieve this, they migrated the Primary Stacks testnet to the Bitcoin Regtest network. As of May 31st, the Primary Testnet is back and ready to use.&#x20;

</details>

### Primary and Nakamoto Testnets

There are some notable differences between Primary Testnet and Nakamoto Testnet, this table can guide you in selecting the one most aligned with your needs.&#x20;

<table><thead><tr><th width="198">Attributes</th><th>Nakamoto Testnet</th><th>Primary Testnet</th></tr></thead><tbody><tr><td><strong>Stacking Cycle Length</strong></td><td>3 days</td><td>1 week </td></tr><tr><td><strong>Description</strong></td><td>Bleeding edge, more frequent upgrades with Release Candidates.</td><td>Stable release updates ONLY, the last step before Mainnet.</td></tr><tr><td><strong>Usage Recommendations</strong></td><td><ul><li>Use this if you don’t mind frequent resets and would like to test the latest features as they’re released</li><li>Use this if you prefer faster feedback loops to test various stacking-signer scenarios</li></ul></td><td><ul><li>Use this if you prefer more stable releases and don’t want frequent resets and updates</li><li>Use this if you don't need to be among the first to test new features</li><li>Use this if you prefer longer Stacking cycles</li></ul></td></tr><tr><td><strong>Lifespan</strong></td><td>Nakamoto Testnet will remain available until sBTC goes live on Mainnet</td><td>The Primary Testnet will exist and be maintained forever.</td></tr><tr><td><strong>Explorer</strong></td><td><a href="https://explorer.hiro.so/?chain=testnet&#x26;api=https://api.nakamoto.testnet.hiro.so">Nakamoto Explorer</a></td><td><a href="https://explorer.hiro.so/?chain=testnet">Primary Explorer</a></td></tr></tbody></table>

### Important notes on the Primary Testnet:

* Core devs are working on a BTC Regtest Explorer. In the meantime, Wallet, Explorer, and API links to BTC transactions will lead you nowhere. This is expected and will be addressed. All STX transactions are available to track on the [Explorer](https://explorer.hiro.so/?chain=testnet).
* You can start onboarding your Signer, deploy contracts and test your Apps. All functionality from the previous testnet is available.
* Old testnet data is archived and will remain [available](https://explorer.hiro.so/?chain=testnet\&api=https://api.old.testnet.hiro.so) until the end of June 2024
* **Faucet and tSTX:**
  * The [Faucet address](https://explorer.hiro.so/address/ST2QKZ4FKHAH1NQKYKYAYZPY440FEPK7GZ1R5HBP2?chain=testnet) and limits stay the same. Learn more about faucets: [testnet.md](../stacks-101/testnet.md "mention")
  * If you need more tSTX than the current daily limit to onboard your Signer on Primary Testnet, please reach out to your main point of contact in the ecosystem.

### Configuration Files for Signers

* [sample-configuration-files.md](signing-and-stacking/sample-configuration-files.md "mention")
* [#primary-testnet-config](signing-and-stacking/sample-configuration-files.md#primary-testnet-config "mention")
