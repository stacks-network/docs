# Best practices for running a Signer

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

* Run a _dedicated_ Bitcoin node and Stacks node per Signer.
  * Ensure the nodes are provisioned with the minimum hardware requirements described [here](https://docs.stacks.co/guides-and-tutorials/running-a-signer#minimum-system-requirements).
  * Nodes should be _exclusively dedicated_ to serve the Signer. Avoid re-using them to serve other clients as that may negatively affect performance (no _mock-signing_, no _Stacks API nodes_).
* If running dedicated nodes is not possible, then ensure that the Bitcoin / Stacks nodes do not become single point of failures for _multiple_ signers depending on them.
  * Introduce redundancy, load balancing, rely on a robust Bitcoin RPC provider, etc.

### Split voting power across multiple Signers

* Distribute your voting power across multiple, distinct Signer public keys to mitigate the risk of loss or downtime from a single compromised key.
* Each Signer should also limit voting power to a maximum amount and invite Stackers to use a different Signer when the limit is reached.

### Monitor new software releases

* Stay up-to-date with new releases, patches, and security advisories (e.g., GitHub, mailing lists, Discord).
* Apply updates as quickly as possible, especially those addressing a security vulnerability.

### Upgrade procedures

* Upgrading one Signer instance at the time.
* Test the update on one instance and, if successful, proceed to the others.
* While your Signer is offline for upgrades, it won't sign any blocks. Ensure that the downtime is as short as possible.

### Diversified hosting

* Use different provider / configuration where feasible (e.g., a self-hosted instance and one in the cloud, or in two different data center regions, etc.).
* Ensure each host has redundant power supply and network connectivity.

### Fall-back deployments

* Deploy additional Stacks nodes and Bitcoin nodes to be used as fall-back.
  * Use the same configuration as your _active_ instances.
  * For the Stacks node, comment out the `event_observer` section.
* Prepare a backup Signer (same configuration) to be quickly activated, but _do not run it_.
  * At all times, there should be _exactly_ one Signer instance running for each Signer private key.
* These instances should be hosted on separate physical hosts (see _diversified hosting_) from the instances usually active in operations (serving each Signer).
* If an active instance (e.g., the Signer, the Stacks node or the Bitcoin node) fails, you can quickly switch to the fall-back configuration to continue operations. To do that:
  * Run the backup Signer.
  * Enable the `event_observer` section of the Node configuration.
  * Restart the node.

### Redundancy in operations

* Ensure that multiple, trusted users can manage and maintain signer instances.
* Where feasible, users should span different timezones.

### Backup signer keys in cold-storage

* Keep an offline, secure backup of all Signer private keys (e.g., hardware security modules or encrypted storage devices).
