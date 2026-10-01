# How to Read Signer Logs

There are a lot of different messages you can get in the logs when running a signer. Getting a good grasp on what some of these logs mean can help you troubleshoot effectively and determine if your signer is running successfully or not.

There are three types of log messages you should be aware of:

* Successful
* Informational
* Errors

Successful log messages indicate that you are on track and everything is working as expected. However, there are various success stages depending on several factors including your staking status and the timing of the current reward cycle.

There are also several informational/warning logs that you don't necessarily need to take action on, but they provide useful context about the network or the signer.

Finally, error logs indicate something has gone wrong and you need to take action.

Below are some common log messages you might see, what they mean, and what action (if any) you should take. All examples are from stacks-signer 4.0.4 unless noted.

{% hint style="info" %}
Successful / informational / error categories — general guidance:

* Successful: nothing to do unless the message indicates a different stage of operation that requires action (e.g., registration needed).
* Informational: often safe to ignore, but useful for context.
* Errors: require investigation and remediation.
{% endhint %}

## Eligible for rewards vs. in the signing set

Two different conditions decide what your signer does in a reward cycle:

* **Eligible for rewards:** at least 50,000 STX is delegated to your signer for the cycle. The signer is on PoX-5's per-cycle signer list and its stakers earn rewards.
* **In the signing set:** when the node builds the cycle's signer set from that list, your signer gets a weight of at least 1. Only signers in the signing set sign blocks.

A signer can be eligible for rewards without being in the signing set. See [How much stake gets a signer into the signing set](how-to-read-signer-logs.md#how-much-stake-gets-a-signer-into-the-signing-set).

## Successful

### Signer started

The signer prints this once at startup. It goes to stdout rather than through the logger, so it has no log level or source location:

```
Signer spawned successfully. Waiting for messages to process...
```

### Registered for the next cycle

During the prepare phase before a new reward cycle, the signer checks whether it is in that cycle's signing set. If it is, you see:

```
INFO [1790795396.187214] [stacks-signer/src/runloop.rs:291] [signer_runloop:30000] Signer #2 (ST3RER3ACSM68ZNMDHNAPH03TM3HCV7JTECASVWSG) is registered for reward cycle 25.
INFO [1790795396.313448] [stacks-signer/src/runloop.rs:346] [signer_runloop:30000] Cycle #25 Signer #2 Signer is registered for reward cycle 25 as signer #2. Initialized signer state.
```

Action: none.

### Signing blocks

When a miner proposes a block, the signer evaluates it and broadcasts its response:

```
INFO [1790818862.698771] [stacks-signer/src/v0/signer.rs:968] [signer_runloop:30000] Cycle #25 Signer #2: Evaluating proposal against global state, signer_state: SignerStateMachine { burn_block: cc284ccb708076b8bc17bcd1d49a895c3bd289e1, burn_block_height: 22500, ... }
INFO [1790818864.029602] [stacks-signer/src/v0/signer.rs:1006] [signer_runloop:30000] Cycle #25 Signer #2: Broadcasting block response to stacks node: Accepted(BlockAccepted { signer_signature_hash: 9b7b2bab54629ba5794ecdcf73113ad370ca156991ac32439f185635f5ee8fd4, ... })
```

`Accepted(BlockAccepted { ... })` means your signer approved the block. Action: none.

### Two cycles side by side

After registering for the next cycle, the signer runs one instance per cycle until the switchover. Both receive the same Bitcoin blocks:

```
INFO [1790795396.313530] [stacks-signer/src/v0/signer.rs:647] [signer_runloop:30000] Cycle #25 Signer #2: Received a new burn block event for block height 22402
INFO [1790795396.438501] [stacks-signer/src/v0/signer.rs:647] [signer_runloop:30000] Cycle #24 Signer #2: Received a new burn block event for block height 22402
```

The current cycle's instance keeps signing; the next cycle's instance takes over when that cycle starts. Action: none.

## Not in the signing set

### Signer not registered for a cycle

If your signer is not in a cycle's signing set, it logs this once when it checks the cycle (at the start of the cycle, or after a restart):

```
WARN [1790369680.021308] [stacks-signer/src/runloop.rs:280] [signer_runloop:30000] Signer SP11T9Q1TTZVCNF60A3R2C75NZVV3CTGV10DZJXGT was not found in stacker db. Must not be registered for this reward cycle 144.
WARN [1790369680.021324] [stacks-signer/src/runloop.rs:350] [signer_runloop:30000] Signer is not registered for reward cycle 144
```

After that, the line you see on every Bitcoin block is:

```
INFO [1790850513.311363] [stacks-signer/src/runloop.rs:414] [signer_runloop:30000] Refreshing runloop with new burn block event, latest_node_burn_ht: 969440, event_ht: 969440, reward_cycle_before_refresh: 144, current_reward_cycle: 144, configured_for_current: true, registered_for_current: false, configured_for_next: false, registered_for_next: false, is_in_next_prepare_phase: false
```

Look for `registered_for_current: false` and `registered_for_next: false`. The signer process is running correctly, but it will not sign in this cycle.

The example above is from a mainnet signer with about 50,000 STX delegated. It was in the signing set in cycle 141 and has not been since cycle 142, while its stake stayed locked and kept earning rewards: it is eligible for rewards but not in the signing set.

Action:

* Confirm your signer-manager holds a grant for this signer key: the signer-manager calls `grant-signer-key` with your signature, then `register-signer`. See [Deploy a Signer Manager Contract](../deploy-a-signer-manager-contract.md) and [Key and Address Rotation](../staking-stx/key-and-address-rotation.md).
* Confirm stake is routed through your signer-manager for the cycle, through `stake`, `stake-update`, `register-for-bond` or `update-bond-registration`. See [Staking STX](../staking-stx/).
* Compare the stake delegated to your signer with the cycle's `pox_ustx_threshold` (below). If it is lower, attract more stake to sign reliably.

### How much stake gets a signer into the signing set

50,000 STX makes a signer eligible for rewards. Getting into the signing set depends on how much STX is staked in total. For each cycle, the node computes:

1. `pox_ustx_threshold = ceil(total STX locked / reward slots)`. There are 4,000 reward slots on mainnet and 2,000 on testnet.
2. Each signer's weight is `floor(stake / pox_ustx_threshold)`.
3. Slots left over after step 2 go one each to the signers with the largest remainders.
4. Signers that end with weight 0 are left out of the signing set.

Stake at or above `pox_ustx_threshold` guarantees a place in the signing set. Below it, a signer gets in only if it wins a leftover slot, which depends on every other signer's stake.

{% hint style="info" %}
**Mainnet, cycle 144:** about 448.3 million STX was locked, so `pox_ustx_threshold` was 112,082,393,974 uSTX, about **112,083 STX**. A signer needed at least that much delegated to be sure of a place in the signing set. The threshold rises as total stake rises (it was about 98,112 STX in cycle 141), so leave a margin and check it each cycle.
{% endhint %}

To read the threshold and the signing set for a cycle, query your node's RPC endpoint:

```bash
curl -s http://localhost:20443/v3/stacker_set/<cycle>
```

In the response, `stacker_set.pox_ustx_threshold` is the threshold in uSTX, and `stacker_set.signers` lists the signing set. Your signer is in the set if its `signing_key` appears there with a `weight` of 1 or more. Replace `localhost:20443` with your node's RPC address.

Source: `stackslib/src/chainstate/nakamoto/signer_set.rs` in [stacks-core 4.0.4](https://github.com/stacks-network/stacks-core/blob/4.0.4/stackslib/src/chainstate/nakamoto/signer_set.rs#L858-L927).

## Informational

### Peer not connecting

If you see a message about a peer not connecting, for example:

```
INFO [1711988555.021567] [stackslib/src/net/neighbors/walk.rs:1015] [p2p-(0.0.0.0:20444,0.0.0.0:20443)] local.80000000://(bind=0.0.0.0:20444)(pub=Some(10.0.19.16:20444)): Failed to connect to facade0b+80000000://172.16.60.18:20444: PeerNotConnected
```

This means your node attempted to connect to another node on the network but was unable to. This can happen for many reasons (network connectivity, remote node offline, NAT/firewall, etc.).

Action:

* Usually not a cause for concern and does not impact whether your signer is running correctly.
* If you see many such messages or persistent connectivity issues, investigate network connectivity, firewall/NAT rules, or peer configuration.

## Finding these lines in your logs

Filter the signer's output for the messages on this page. How you read the output depends on how you run the signer:

```bash
PATTERN="spawned successfully|registered for reward cycle|not found in stacker db|not the reward set|Refreshing runloop|Broadcasting block response|Evaluating proposal"

# Docker
docker logs <signer-container> 2>&1 | grep -E "$PATTERN"

# systemd service
journalctl -u <signer-service> --no-pager | grep -E "$PATTERN"

# Binary writing to a log file
grep -E "$PATTERN" /path/to/signer.log
```

`Signer spawned successfully` goes to stdout, while the logger writes to stderr. Keep `2>&1` (or capture both streams) so the startup line isn't lost.
