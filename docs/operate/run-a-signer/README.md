---
description: >-
  What a Stacks signer is made of, what it needs from the machine and the
  network, and where each piece is set up.
---

# Run a Signer

<div data-with-frame="true"><figure><img src="https://4065274862-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F4cpTb2lbw0LAOuMHrvhA%2Fuploads%2Fn6Drb2IOHQHE6IPyghA7%2Frun-a-signer-cover.png?alt=media&#x26;token=8791bf7e-2040-4e81-8cff-9337cdcd4a1b" alt="Run a Signer"><figcaption></figcaption></figure></div>

A signer validates proposed Stacks blocks and signs the ones it accepts. This section covers the infrastructure: what has to be running, what it needs from the machine and the network, and where each piece is set up.

If signing is new to you, start with the [Signing concept guide](https://docs.stacks.co/learn/block-production/signing).

***

## What has to be running

These run alongside each other, and each depends on the one below it.

<table><thead><tr><th width="170">Process</th><th>What it does</th><th>Where to set it up</th></tr></thead><tbody><tr><td><code>stacks-signer</code></td><td>Validates proposed blocks and signs them with your signer key</td><td><a href="signer-quickstart.md">Signer Quickstart</a>, step 2</td></tr><tr><td><code>stacks-node</code></td><td>Follows the chain and streams block proposals to the signer. A follower, not a miner</td><td><a href="signer-quickstart.md">Signer Quickstart</a>, step 4</td></tr><tr><td><code>bitcoind</code></td><td>Feeds the Stacks node its view of Bitcoin. Run your own, dedicated to this signer</td><td><a href="../run-a-node/run-a-bitcoin-node.md">Run a Bitcoin Node</a> or <a href="../run-a-node/run-a-pruned-bitcoin-node.md">Run a Pruned Bitcoin Node</a></td></tr></tbody></table>

A shared or third-party Bitcoin node is the usual reason a Stacks node falls behind tip and stays there, and a signer whose node is behind tip stops signing. Treat a dedicated Bitcoin node as part of the signer, not as an optional extra.

The Quickstart runs both the signer and the node end to end, with binary and Docker paths. Field-by-field descriptions of both config files live in [Signer Configuration](https://docs.stacks.co/reference/node-operations/signer-configuration) and [Stacks Node Configuration](https://docs.stacks.co/reference/node-operations/readme-1).

***

## Minimum system requirements

These are minimums for the signer, the Stacks node and a Bitcoin node together. Provision above them if you can.

* 4 vCPU
* 8 GB memory for the signer and Stacks node, 16 GB with a Bitcoin node alongside them
* 1.5 TB storage or more: roughly 1 TB for the Bitcoin node, 500 GB for the Stacks node, 50 GB for the signer

***

## Networking

The signer and the node talk over plain HTTP. The signer builds its node URL as `http://{node_host}`, and the `auth_password` it sends is your node's `auth_token`, in the clear. Anything that can observe that link can read the token and impersonate your node to the signer.

Keep both on the same private network, with the signer reachable only from the node. Loopback on a single machine is the simplest way to do that. Separate hosts on a trusted private subnet is the better one, because a host running `stacks-node` participates in the peer-to-peer network and is easier to enumerate, so keeping the signer off it hides the signer. Either way, the signer's `endpoint` must never be reachable from the public internet.

User separation, systemd hardening and firewalling are covered in [OpSec Best Practices](opsec-best-practices.md).

***

## Setup checklist

{% stepper %}
{% step %}
#### Provision the machine

Meet the requirements above, and decide now whether the signer and node share a host or sit on a private subnet.
{% endstep %}

{% step %}
#### Generate the signer key

A fresh Stacks account, whose private key becomes `stacks_private_key`. Store it somewhere you can restore from. See [Signer Quickstart](signer-quickstart.md), step 1.
{% endstep %}

{% step %}
#### Configure and start the signer

`signer-config.toml` needs `node_host`, `endpoint`, `network`, `db_path`, `auth_password` and `stacks_private_key`. Verify it with `stacks-signer check-config` before starting.
{% endstep %}

{% step %}
#### Configure and start the Stacks node

`node-config.toml` needs `stacker = true`, an `auth_token` matching the signer's `auth_password`, and an `[[events_observer]]` pointing at the signer's `endpoint`. Start the signer first: the node will not run unless it can reach that endpoint.
{% endstep %}

{% step %}
#### Confirm both are healthy

The signer logs `Signer spawned successfully`. The node logs `Registering event observer at` with your signer's endpoint, then begins syncing Bitcoin headers. Until your signer is in a reward set it will also log that it is not registered for the current cycle, which is expected.
{% endstep %}

{% step %}
#### Register the signer

Bind your signer key to a signer-manager contract. Until that happens the signer is running but has no stake behind it and signs nothing.
{% endstep %}
{% endstepper %}

***

## Registering, once it runs

A running signer is not yet part of the signer set. Your signer key has to be bound to a signer-manager contract, and stakers have to route at least 50,000 STX through that manager in aggregate before it enters a cycle's signer set.

Under PoX-5 that binding is a standing on-chain grant rather than PoX-4's per-transaction signature: you sign a SIP-018 message with your signer key, the signer-manager submits it through `grant-signer-key`, and then calls `register-signer`.

* [Generate a Signer Signature](../staking-stx/generate-signer-signature.md) produces the grant
* [Staking STX](../staking-stx/) covers the staking side
* [Key and Address Rotation](../staking-stx/key-and-address-rotation.md) covers changing the key later

***

## Running it well

* [How to Read Signer Logs](how-to-read-signer-logs.md)
* [How to Monitor Signer](how-to-monitor-signer.md)
* [Best Practices to Run a Signer](best-practices-to-run-a-signer.md), including redundancy, fall-back deployments and auto-restart
* [OpSec Best Practices](opsec-best-practices.md)
