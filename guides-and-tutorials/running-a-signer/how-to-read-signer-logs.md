# How to Read Signer Logs

There are a lot of different messages you can get in the logs when running a signer, getting a good grasp on what some of these logs mean can help you troubleshoot effectively and determine if your signer is running successfully or not.

There are really three types of log messages we should be aware of:

* Successful
* Informational
* Errors

Successful log messages indicate that you are on track and everything is working as expected. However, there are various success stages depending on several factors including your stacking status and the timing of where we are in the current reward cycle.

There are also several information/warning logs that you don't necessarily need to take action on, but may be informational about the status of something occurring in the network.

Finally, error logs indicate something has gone wrong and you need to take some kind of action.

Let's go through some of the common log messages you might see, what they mean, and what action to take.

### Successful

#### Signer uninitialized or not registered

If you get a message like the following saying your signer is uninitialized, that means that it has not registered for the current or upcoming reward cycle (or the burnchain block height is not yet at the second block in the prepare phase) for the signer to know if it is registered. Your signer is running successfully, there is just another action you need to take.

`Signer spawned successfully. Waiting for messages to process... INFO [1711088054.872542] [stacks-signer/src/runloop.rs:278] [signer_runloop] Running one pass for signer ID# 0. Current state: Uninitialized`

This warning may also look like this:

```
WARN [1712003997.160121] [stacks-signer/src/runloop.rs:247] [signer_runloop] Signer is not registered for reward cycle 556. Waiting for confirmed registration...
```

At this point if you want your signer to do something you need someone to either delegate or you need to stack on your own for an upcoming reward cycle.

For more on this, be sure to check out the [How to Stack ](../stack-stx/stacking-flow.md)doc.

### Informational

#### Peer not connecting

If you get an error about a peer not connecting that looks like the following:

```
INFO [1711988555.021567] [stackslib/src/net/neighbors/walk.rs:1015] [p2p-(0.0.0.0:20444,0.0.0.0:20443)] local.80000000://(bind=0.0.0.0:20444)(pub=Some(10.0.19.16:20444)): Failed to connect to facade0b+80000000://172.16.60.18:20444: PeerNotConnected
```

That means that your node is trying to connect to some external node on the network, but is unable to. This is common and can happen for a variety of reasons.

It is not a cause for concern and doesn't impact whether or not your signer is running correctly.
