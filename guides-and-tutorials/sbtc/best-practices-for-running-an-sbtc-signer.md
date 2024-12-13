# Best practices for running a sBTC signer

The following best practices suggest how to create a resilient setup for running
your sBTC Signer.

## Protect your private key

- Prevent unauthorised access to the sBTC Signer private key.

### Backup signer keys in cold-storage

- Keep an offline, secure backup of your sBTC Signer private key (e.g., hardware
  security modules or encrypted storage devices).

## Backup your Postgres DB

- Periodically backup the sBTC Signer Postgresql DB.

## Firewall

- Allow connections to your signer `listen_on` address (used for P2P
  communication).
- Optionally, allow traffic to the P2P ports of your Stacks and Bitcoin node.
- Deny traffic to any other port and service, unless required, e.g. for SSH.

### Monitor and observe your sBTC Signer

- Retain at least 1 day of logs for both the sBTC Signer, the Stacks node, and
  the Bitcoin node.
- The sBTC signer can optionally expose Prometheus metrics (see
  `prometheus_exporter_endpoint` configuration option).
  - You can use them to monitor its health ([this guide shows how to configure
    Alloy to collect metrics on Grafana
    cloud](../running-a-signer/how-to-monitor-signer.md)).

### Downstream components

- Run a *dedicated* Bitcoin node and Stacks node for your sBTC Signer.
    - Ensure the nodes are provisioned with the minimum hardware requirements
      described [here][0].
    - Nodes should be *exclusively dedicated* to serve the Signer. Avoid
      re-using them to serve other clients as that may negatively affect
      performance (no *mock-signing*, no *Stacks API nodes*).

### Redundancy in operations

- Ensure that multiple, trusted users can manage and maintain your sBTC Signer instance.
- Where feasible, users should span different timezones.

### Monitor new software releases

- Stay up-to-date with new releases, patches, and security advisories (e.g.,
  GitHub, mailing lists, Discord).
- Apply updates as quickly as possible, especially those addressing a security
  vulnerability.

## References

[0]: https://docs.stacks.co/guides-and-tutorials/running-a-signer#minimum-system-requirements

- [Best practices to run a Stacks Signer](../running-a-signer/best-practices-to-run-a-signer.md).
