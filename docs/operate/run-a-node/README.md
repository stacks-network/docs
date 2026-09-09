---
description: Ways to run a Stacks node or miner, and the minimum machine they need.
---

# Run a Node

<div data-with-frame="true"><figure><img src="https://4065274862-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F4cpTb2lbw0LAOuMHrvhA%2Fuploads%2FFTemmfAy773rwMGUSyGc%2Frun-a-stacks-node-cover.png?alt=media&#x26;token=d237f0aa-0d46-4be1-8763-1986ec311c30" alt="Run a Node"><figcaption></figcaption></figure></div>

This section covers running Stacks network nodes and miners. Several paths are available, from Docker to a hosted provider, and the pages below cover each one along with the Bitcoin node a Stacks node depends on.

Running your own node increases the decentralization of the network and removes your dependence on someone else's infrastructure.

## Minimum viable requirements

These are minimums. Provision above them if you can.

{% hint style="warning" %}
* **8 GB memory** if running only a Stacks node
* **16 GB memory** if running Stacks + Bitcoin node
* **2 vCPU**
* **2 TB disk** for Stacks node
* **1 TB disk** for Bitcoin node
{% endhint %}

The Stacks chainstate grows continuously, so size the disk for headroom rather than for today's figure. A [pruned node](./#run-a-pruned-stacks-node) needs far less.

## Run a pruned Stacks node

Epoch 4.0 ships `marf-squash`, an offline tool that produces a **Pruned Chainstate Snapshot (PCS)**: a compacted copy of a node's chainstate you can boot from instead of syncing full history from genesis.

This is not a config flag and not continuous pruning. You generate or download a PCS, point your node's `working_dir` at it, and start the node normally. The node does not know it is running from a pruned snapshot.

{% hint style="warning" %}
**Treat this as experimental.** Do not run a critical node from a PCS. Online pruning is planned for a later version; this first one is an offline snapshot with the limitations described below.
{% endhint %}

### What you give up

A PCS holds the value of each key as of the squash height, plus everything above it. It does not hold historical values below that height. Squash at block 1,000 and you can ask the node for an account's balance at block 1,000 or later, but not at block 800.

For most operators that is not a loss, because `at-block` is disabled from epoch 3.4 onward and nothing on the network can request state below the boundary. It matters if you run something alongside the node that serves historical queries, such as the Stacks API.

Approximate mainnet sizes at tip. These come from engineering rather than a published benchmark, and the gap will move over time.

| Chainstate         | Size     |
| ------------------ | -------- |
| Pruned             | \~120 GB |
| Compressed archive | \~500 GB |
| Uncompressed       | \~1.2 TB |

### Get the tool

`marf-squash` ships in the `4.0.3` release archives for every platform, and in the `ghcr.io/stacks-network/stacks-core:4.0.3` image at `/usr/bin/marf-squash`, so it is probably already sitting next to your `stacks-node`. You can also build it from the `stacks-core` repository root:

```bash
cargo build -p marf-squash --release
```

### Produce a snapshot

```bash
marf-squash squash \
  --chainstate /data/mainnet \
  --out-dir /data/pcs \
  --tenure-start-bitcoin-height <a recent canonical tenure start> \
  --all
```

**Choosing the height.** It is a boundary, not a retention window. Everything at or below it is squashed into a single trie holding the state as of that block. Everything above it is absent from the snapshot and re-synced from peers on boot. A more recent height means less catch-up, and that is the whole tradeoff.

The value must be a Bitcoin height whose sortition elected a miner, so a canonical Nakamoto tenure start. On mainnet it must also be **943,334 or higher**, the first tenure of epoch 3.4, and at least six blocks behind the burn tip. The tool enforces all of this, and if you miss a tenure start it exits listing the valid heights within ten blocks either side. In practice, take a recent tenure start from your own synced node.

Off mainnet, `--config` is required, so the tool can read epoch 3.4's activation height from your node config.

`--all` squashes all three MARFs (Clarity, Index and Sortition), copies canonical block data, copies Bitcoin auxiliary files, and writes the manifest. You can squash individual MARFs with `--clarity`, `--index` or `--sortition`; note that `--blocks` requires `--index` (or `--all`), and `--bitcoin` requires `--sortition` (or `--all`).

A full snapshot mirrors the node's working-directory layout beneath a network directory, so the contents land under `<out-dir>/mainnet/`: `chainstate/vm/clarity/`, `chainstate/blocks/`, `burnchain/sortition/`, `headers.sqlite` and `PCS_manifest.toml`. The tool prints the path to use when it finishes, along with the original and squashed size of each MARF.

### Bootstrap a node from a PCS

1. Produce a PCS with `marf-squash` from a fully synced node you trust, and move it to the target machine over a channel you trust.
2. Set `[node].working_dir` in your Stacks config to the **parent** of the network directory the tool reported.
3. Start the node normally. It re-syncs everything above the boundary from peers.

{% hint style="danger" %}
**Do not boot from a snapshot you did not produce yourself.** `PCS_manifest.toml` carries the squash root hashes that are meant to be the trust anchor, but the manifest is part of the artifact and authenticates nothing on its own. The offline verifier that would check those hashes against an independently published checkpoint does not exist yet, and no checkpoints are published, so a snapshot obtained from someone else cannot be verified by anyone today.
{% endhint %}

### Known issue: proofs and RPC reads

Proof generation on a squashed chainstate is not supported yet. It is tracked upstream in [stacks-network/stacks-core#6953](https://github.com/stacks-network/stacks-core/issues/6953), open at the time of writing. Follow it there for status.

Until it lands, `proof=1` is the default on the RPC read endpoints, and on a PCS-booted node at `4.0.3` the resulting error is discarded rather than returned:

* `/v2/accounts` answers HTTP 200 with balance `0` and **nonce `0`**, and an empty `balance_proof` and `nonce_proof` in place of a hex proof.
* `/v2/map_entry` answers 200 with `none`, which is indistinguishable from an absent key, and an empty `proof`.
* `/v2/data_var` answers 404, `Data var not found`.

The wrong nonce is the dangerous one. A client that reads `0` will build transactions that cannot confirm, and neither the response nor the node log says the chainstate is squashed. The empty proof field is the only thing in the response that distinguishes this from a genuinely empty account.

{% hint style="info" %}
**Pass `proof=0` on every read against a PCS-booted node.** That path does not construct a proof, and returns correct values.
{% endhint %}

Verified against `stacks-core` `4.0.3`: the [squash guard on `get_with_proof`](https://github.com/stacks-network/stacks-core/blob/4.0.3/stackslib/src/chainstate/stacks/index/marf.rs), the [`proof` query-parameter default](https://github.com/stacks-network/stacks-core/blob/4.0.3/stackslib/src/net/httpcore.rs), and the [mainnet minimum tenure height](https://github.com/stacks-network/stacks-core/blob/4.0.3/contrib/marf-squash/src/config.rs).
