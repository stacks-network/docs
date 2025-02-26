# Best practices for running a sBTC signer

The following best practices suggest how to create a resilient setup for running
your sBTC Signer.

## Protect your private key and have a cold-storage backup

- Prevent unauthorised access to the sBTC Signer private key.
- Keep an offline, secure backup of your sBTC Signer private key (e.g., hardware
  security modules or encrypted storage devices).

## Backup your sBTC Signer PostgreSQL DB

- Perform daily backups of the sBTC Signer PostgreSQL DB.
- Periodically verify the integrity of backups (e.g. by importing them into a
  fresh PostgreSQL instance).

## Setup proper access control

- Require hardware 2FA keys for access control (e.g., by using Yubikey) to
  connect through SSH, to authenticate to AWS, and for every other relevant
  action.
- Follow the principle of _least privilege_: if you don’t need access, you don’t
  get access; if you get access, it expires after the action is taken.
- _Optional, but strongly recommended_: Implement a "_4-eyes_" process to access
  critical resources (e.g., deploy a new version of the sBTC signer).

## Maintain a strict firewall configuration

- Allow connections to your signer `listen_on` address (used for P2P
  communication).
- Do not expose any non-essential service to the internet: use a `DEFAULT DENY` policy with explicit `ALLOW`s for necessary network traffic (such as signer p2p and SSH).

## Maintain a robust secrets management program

- Ensure all relevant secrets are safely managed and rotated (where possible),
  e.g. if someone leaves the team.

## Monitor and observe your sBTC Signer

- Retain at least 7 day of logs for both the sBTC Signer, the Stacks node, and
  the Bitcoin node.
- The sBTC signer can optionally expose Prometheus metrics (see
  `prometheus_exporter_endpoint` configuration option).
  - You can use them to monitor its health ([this guide shows how to configure
    Alloy to collect metrics on Grafana
    cloud](../running-a-signer/how-to-monitor-signer.md)).

## Provision dedicated downstream components

- Run a _dedicated_ Bitcoin node and Stacks node for your sBTC Signer.
  - Ensure the nodes are provisioned with the minimum hardware requirements
    described [here][0].
  - Nodes should be _exclusively dedicated_ to serve the sBTC Signer. Avoid
    re-using them to serve other clients as that may negatively affect
    performance (no _mock-signing_, no _Stacks API nodes_).

## Monitor new software releases

- Stay up-to-date with new releases, patches, and security advisories (e.g.,
  GitHub, mailing lists, Discord).
- Exercise vulnerability management for all packages.
- Apply updates as quickly as possible, especially those addressing a security
  vulnerability.

## Ensure redundancy in operations

- Ensure that multiple, trusted users can manage and maintain your sBTC Signer instance.
- Where feasible, users should span different time zones.
- Document your operations procedures and ensure that relevant personnel have access to them.

## References

[0]: https://docs.stacks.co/guides-and-tutorials/running-a-signer#minimum-system-requirements

- [Best practices to run a Stacks Signer](../running-a-signer/best-practices-to-run-a-signer.md).
