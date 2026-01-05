# Best Practices to Run a Signer

{% hint style="info" %}
**Intended audience**: solo Stackers or Stacking pool operators.
{% endhint %}

The following best practices suggest how to create a resilient setup for running your Signer.

{% hint style="info" %}
tl;dr: avoid single point of failures, introduce redundancy, monitor things.
{% endhint %}

### Monitor your Signer and collect logs

* See [here](how-to-monitor-signer.md) on how to set up monitoring.
* Retain at least 1 week of logs for both the Signer and the Stacks node.

### Downstream components

* Run a dedicated Bitcoin node and Stacks node per Signer.
  * Ensure the nodes are provisioned with the minimum hardware requirements described [here](https://docs.stacks.co/guides-and-tutorials/running-a-signer#minimum-system-requirements).
  * Nodes should be exclusively dedicated to serve the Signer. Avoid re-using them to serve other clients as that may negatively affect performance (no mock-signing, no Stacks API nodes).
* If running dedicated nodes is not possible, then ensure that the Bitcoin / Stacks nodes do not become single points of failure for multiple signers depending on them.
  * Introduce redundancy, load balancing, rely on a robust Bitcoin RPC provider, etc.

### Split voting power across multiple Signers

* Distribute your voting power across multiple, distinct Signer public keys to mitigate the risk of loss or downtime from a single compromised key.
* Each Signer should also limit voting power to a maximum amount and invite Stackers to use a different Signer when the limit is reached.

### Monitor new software releases

* Stay up-to-date with new releases, patches, and security advisories (e.g., GitHub, mailing lists, Discord).
* Apply updates as quickly as possible, especially those addressing a security vulnerability.

### Upgrade procedures

{% stepper %}
{% step %}
#### Test one instance first

Upgrade one Signer instance at a time. Test the update on a single instance and verify functionality before proceeding to others.
{% endstep %}

{% step %}
#### Roll out gradually

If the test is successful, proceed to upgrade the remaining instances one-by-one.
{% endstep %}

{% step %}
#### Minimize downtime

While a Signer is offline for upgrades, it won't sign any blocks. Ensure that the downtime is as short as possible.
{% endstep %}
{% endstepper %}

### Diversified hosting

* Use different provider / configuration where feasible (e.g., a self-hosted instance and one in the cloud, or in two different data center regions, etc.).
* Ensure each host has redundant power supply and network connectivity.

### Fall-back deployments

* Deploy additional Stacks nodes and Bitcoin nodes to be used as fall-back.
  * Use the same configuration as your active instances.
  * For the Stacks node, comment out the `event_observer` section.
* Prepare a backup Signer (same configuration) to be quickly activated, but do not run it.
  * At all times, there should be exactly one Signer instance running for each Signer private key.
* These fall-back instances should be hosted on separate physical hosts (see diversified hosting) from the instances usually active in operations (serving each Signer).

To switch to the fall-back configuration quickly if an active instance fails, follow these steps:

{% stepper %}
{% step %}
#### Run the backup Signer

Start the prepared backup Signer instance.
{% endstep %}

{% step %}
#### Enable event observer

Enable the `event_observer` section of the Stacks node configuration.
{% endstep %}

{% step %}
#### Restart the node

Restart the Stacks node so it runs with the enabled `event_observer`.
{% endstep %}
{% endstepper %}

### Redundancy in operations

* Ensure that multiple, trusted users can manage and maintain signer instances.
* Where feasible, users should span different timezones.

### Backup signer keys in cold-storage

* Keep an offline, secure backup of all Signer private keys (e.g., hardware security modules or encrypted storage devices).
