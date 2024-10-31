# Best practices for running a Signer

{% hint style="info" %}
**Intended audience**: solo Stackers or Stacking pool operators.
{% endhint %}

The following best practices suggest how to create a resilient setup for running your Signer.

{% hint style="info" %}
tl;dr: avoid single point of failures, introduce redundancy, monitor things.
{% endhint %}

### Run redundant Signer instances

- Deploy two signer software instances for each signer public key.
- These instances should have identical configurations, but be hosted on
separate physical hosts (see *diversified hosting* below).

This setup ensures that if one instance fails the other can continue operations
without interruption.

### Monitor your Signer and collect logs

- See
  [here](https://www.notion.so/guides-and-tutorials/running-a-signer/how-to-monitor-signer.md)
  on how to set up monitoring.
- Retain at least 1 week of logs for both the Signer and the Stacks node.

### Downstream components

- Run a *dedicated* Bitcoin node and Stacks node per Signer.
    - Ensure the nodes are provisioned with the minimum hardware requirements
      described
      [here](https://docs.stacks.co/guides-and-tutorials/running-a-signer#minimum-system-requirements).
    - Nodes should be *exclusively dedicated* to serve the Signer. Avoid
      re-using them to serve other clients as that may negatively affect
      performance (no *mock-signing*, no *Stacks API nodes*).
- If running dedicated nodes is not possible, then ensure that the Bitcoin /
  Stacks nodes do not become single point of failures for *multiple* signers
  depending on them.
    - Introduce redundancy, load balancing, rely on a robust Bitcoin RPC
      provider, etc.

### Split voting power across multiple Signers

- Distribute your voting power across multiple, distinct Signer public keys to
  mitigate the risk of loss or downtime from a single compromised key.
- Each Signer should also limit voting power to a maximum amount and invite
  Stackers to use a different Signer when the limit is reached.

### Monitor new software releases

- Stay up-to-date with new releases, patches, and security advisories (e.g.,
  GitHub, mailing lists, Discord).
- Apply updates as quickly as possible, especially those addressing a security
  vulnerability.

### Upgrade procedures

- Upgrading one Signer instance (of those running redundantly) at the time.
- Test the update on one instance and, if successful, proceed to the others.

### Diversified hosting

- Use different provider / configuration where feasible (e.g., a self-hosted
  instance and one in the cloud, or in two different data center regions, etc.).
- Ensure each host has redundant power supply and network connectivity.

### Redundancy in operations

- Ensure that multiple, trusted users can manage and maintain signer instances.
- Where feasible, users should span different timezones.

### Backup signer keys in cold-storage

- Keep an offline, secure backup of all Signer private keys (e.g., hardware
  security modules or encrypted storage devices).

