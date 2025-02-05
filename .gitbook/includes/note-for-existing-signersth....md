---
title: Note for Existing SignersTh...
---

{% hint style="info" %}
**Note for Existing Signers**

The block for Nakamoto activation has been chosen as Bitcoin block 867,867, which is currently expected on October 28th. This block is subject to change should core developers need additional time for testing or unexpected issues.

The 3.0 binaries (and Docker images) are provided below. Note that if you do not upgrade ahead of the hard fork, your nodes will be dropped from the network.

If you have previously been running a signer, you'll want to make sure you do the following:

First, upgrade your node and signer to the latest version (listed below).

For miners: If you are currently using the config value `[miner].activated_vrf_key_path`, the saved json file will need to be removed prior to restart (it will be recreated). You will also need to add a new key to the miner section:

```
[miner]
mining_key = "private key" ## may be the same as [node].seed
```

**Important note**: Any unrecognized and uncommented config value _will_ cause the binary to panic.

The output will specify which configuration key caused the panic (there may be more than one, but the message will only show the first unrecognized key) in the format:

```
$ stacks-node check-config --config ./Config.toml
INFO [1738695683.067315] [testnet/stacks-node/src/main.rs:278] [main] stacks-node 3.1.0.0.5 (release/3.1.0.0.5:513dbc5, release build, linux [x86_64])
INFO [1729707265.671604] [testnet/stacks-node/src/main.rs:318] [main] Loading config at path ./Config.toml
WARN [1729707265.671992] [testnet/stacks-node/src/main.rs:325] [main] Invalid config file: Invalid toml: unknown field `foo`, expected one of `name`, `seed`, `deny_nodes`, `working_dir`, `rpc_bind`, `p2p_bind`, `p2p_address`, `data_url`, `bootstrap_node`, `local_peer_seed`, `miner`, `stacker`, `mock_mining`, `mock_mining_output_dir`, `mine_microblocks`, `microblock_frequency`, `max_microblocks`, `wait_time_for_microblocks`, `wait_time_for_blocks`, `next_initiative_delay`, `prometheus_bind`, `marf_cache_strategy`, `marf_defer_hashing`, `pox_sync_sample_secs`, `use_test_genesis_chainstate`, `always_use_affirmation_maps`, `require_affirmed_anchor_blocks`, `chain_liveness_poll_time_secs`, `stacker_dbs`, `fault_injection_block_push_fail_probability` for key `node` at line 20 column 1
```

**Changed config field**

Note that in the Stacks node config file, the `block_proposal_token` field has been changed to `auth_token`.

**Current Signer and Stacks Node Versions**

For quick reference, here are the current latest versions you'll want to be running as a signer. If you don't yet have your signer up and running, this guide will walk you through that.

* [Binaries](https://github.com/stacks-network/stacks-core/releases/latest)
* Stacks Signer Docker Image - [3.1.0.0.5.0](https://hub.docker.com/layers/blockstack/stacks-signer/3.1.0.0.5.0/images/sha256-4f0c19225065754ed08594deb3d2c67dc1126558e9e50f8174a1bc1736fedb99)
* Stacks Node Docker Image - [3.1.0.0.5](https://hub.docker.com/layers/blockstack/stacks-core/3.1.0.0.5/images/sha256-cf2c04b6f56d7a54c2032a13826ebb258cebe50a30b847810a279476824bd2c0)
{% endhint %}
