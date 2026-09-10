# Run a Miner

<div data-with-frame="true"><figure><img src="https://4065274862-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F4cpTb2lbw0LAOuMHrvhA%2Fuploads%2F3IItqP16x3XffXnx6PgR%2Frun-a-miner-cover.png?alt=media&#x26;token=89a6cc96-1b14-4508-a321-238e73c56bdd" alt=""><figcaption></figcaption></figure></div>

Running a Stacks miner is running a Stacks node with extra configuration: a funded Bitcoin wallet, a mining key, and burnchain settings that let the node send block-commits.

These guides cover both a testnet and a mainnet miner.

{% hint style="warning" %}
**Where your BTC bid goes changed at Epoch 4.0.**

Your block-commit carries a single commit output holding the full `burn_fee_cap`. That output is an sBTC deposit whose recipient is the `pox-5` contract, so the bid auto-bridges into the reward pool and is paid to participants through the waterfall. Nothing is burned.

Under PoX-4 the same commit paid two reward-address outputs at half `burn_fee_cap` each, and BTC that matched no reward slot went to a burn address. Both of those are gone.

Miners fund the reward pool and are not paid from it. Mining income is still the STX coinbase plus transaction fees.

Your node builds the new output itself. No new miner configuration is required and there is no address to set. [Verify Miner](verify-miner.md) has the transaction shape and how to check it.
{% endhint %}

## Required Bitcoin wallet configuration

From stacks-core `4.0.2`, a mining node must set `burnchain.wallet_name` to a wallet that already exists in your Bitcoin Core node:

{% code title="config.toml" %}
```toml
[burnchain]
wallet_name = "stacks-miner"
```
{% endcode %}

Use the name of your own wallet. The name accepts ASCII letters, digits, and `. _ - /`. The node loads the wallet at startup and never creates it, so create or restore it in Bitcoin Core first. This applies on every Bitcoin Core version, and it restores compatibility with Bitcoin Core 31 and later, which removed the default unnamed wallet.

Loading lasts for the current bitcoind session. Set `wallet=<name>` in `bitcoin.conf` so the wallet is loaded again after a bitcoind restart. Nothing reloads it if bitcoind restarts while the Stacks node keeps running.

| Condition                                | Startup failure                                                                                         |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `wallet_name` unset or empty on a miner  | Config is missing the setting `burnchain.wallet_name` (mandatory and non-empty for miners)              |
| Named wallet not present in Bitcoin Core | FATAL: Configured bitcoin wallet `<name>` was not found; create or restore it before starting the miner |
| Bitcoin Core unreachable                 | FATAL: unable to load a bitcoin wallet after 6 attempts, exiting                                        |

Followers and mock miners do not use wallet RPCs and can leave `wallet_name` unset. On Bitcoin Core 31 and later, `migratewallet` can split a legacy wallet into a primary and a `<name>_watchonly` wallet. Set `wallet_name` to the one holding the miner's watched addresses.
