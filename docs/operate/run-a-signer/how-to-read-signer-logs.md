# How to Read Signer Logs

There are a lot of different messages you can get in the logs when running a signer. Getting a good grasp on what some of these logs mean can help you troubleshoot effectively and determine if your signer is running successfully or not.

There are three types of log messages you should be aware of:

* Successful
* Informational
* Errors

Successful log messages indicate that you are on track and everything is working as expected. However, there are various success stages depending on several factors including your stacking status and the timing of the current reward cycle.

There are also several informational/warning logs that you don't necessarily need to take action on, but they provide useful context about the network or the signer.

Finally, error logs indicate something has gone wrong and you need to take action.

Below are some common log messages you might see, what they mean, and what action (if any) you should take.

{% hint style="info" %}
Successful / informational / error categories — general guidance:

* Successful: nothing to do unless the message indicates a different stage of operation that requires action (e.g., registration needed).
* Informational: often safe to ignore, but useful for context.
* Errors: require investigation and remediation.
{% endhint %}

## Successful

### Signer uninitialized or not registered

If you get a message saying your signer is uninitialized, it means your signer is not registered for the current or upcoming reward cycle (or the burnchain block height is not yet at the second block in the prepare phase) so the signer cannot determine registration status yet. This does not mean the signer process itself has failed — it is running successfully, but the signer cannot act until registration/delegation occurs.

Example log:

`Signer spawned successfully. Waiting for messages to process... INFO [1711088054.872542] [stacks-signer/src/runloop.rs:278] [signer_runloop] Running one pass for signer ID# 0. Current state: Uninitialized`

You may also see a warning like:

```
WARN [1712003997.160121] [stacks-signer/src/runloop.rs:247] [signer_runloop] Signer is not registered for reward cycle 556. Waiting for confirmed registration...
```

Action:

* If you want the signer to participate, either delegate to it or stack on your own for an upcoming reward cycle.
* For more details on stacking and registration, see the How to Stack doc: ../stack-stx/stacking-flow.md

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
