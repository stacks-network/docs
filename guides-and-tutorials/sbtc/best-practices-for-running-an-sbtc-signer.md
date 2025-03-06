# Best practices for running a sBTC signer

The following best practices suggest how to create a resilient setup for running
your sBTC Signer.

## Protect your private key and have a cold-storage backup

- Prevent unauthorised access to the sBTC Signer private key.
- Keep an offline, secure backup of your sBTC Signer private key (e.g., hardware
  security modules or encrypted storage devices).

## Backup your sBTC Signer PostgreSQL DB

- Perform daily backups of the sBTC Signer PostgreSQL DB.
- Periodically verify the integrity of backups, as instructed below.

### Verifying integrity of PostgreSQL DB backups

To verify the integrity of a backup, first import it into a fresh PostgreSQL
instance (the database is enough, no need to spin up a Stacks / Bitcoin node or
the sBTC signer).

Then, perform the following query:

```sql
signer=> SELECT aggregate_key FROM sbtc_signer.dkg_shares WHERE
dkg_shares_status = 'verified' ORDER BY created_at DESC;
```

It will return results as follows (your mileage might vary depending on the
history of your sBTC signer, the following is provided for illustration purposes
only):

```sql

                            aggregate_key
----------------------------------------------------------------------
 \x03d8c4344861fc7590fd812c24884a3bfd9374d8ba865a787ff53c9060020aa967
 \x03f898f8a6ddb86dd4608dd168355ec6135fe2839222240c01942e8e7e50dd4c89
(2 rows)
```

Now, ensure that the most recent `aggregate_key` (the first one) corresponds to
the one returned by a read-only call to the
`SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4/sbtc-registry/get-current-aggregate-pubkey`
smart contract method:

```bash
curl -s 'https://api.hiro.so/v2/contracts/call-read/SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4/sbtc-registry/get-current-aggregate-pubkey' \
           -H 'content-type: application/json' --data-raw '{"sender":"SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4","arguments":[]}' | jq .result

"0x020000002103d8c4344861fc7590fd812c24884a3bfd9374d8ba865a787ff53c9060020aa967"⏎
```

You can discard the prefix `0x02000000210` (which is how Clarity encodes
values). The suffix
`3d8c4344861fc7590fd812c24884a3bfd9374d8ba865a787ff53c9060020aa967` matches the
first row of the PostgreSQL query above (excluding `\x0` which indicates hex
encoding).

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

- Retain at least 90 days of logs for both the sBTC Signer, the Stacks node, and
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

- Stay up-to-date with new releases, patches, and security advisories for all
  used operating systems, software and packages:
  - [https://www.cve.org/](https://www.cve.org/) is a great resource for popular
    software packages.
  - Subscribe to receive security notifications from your vendors.
  - Join relevant messaging channels as applicable (i.e. on Discord, Slack,
    etc.).
- Exercise vulnerability management for all packages.
- Apply updates as quickly as possible, especially those addressing a security
  vulnerability.
- Use inventory and patch management software, if available.

## Ensure redundancy in operations

- Ensure that multiple, trusted system administrators can manage and maintain
  your sBTC Signer instance.
- Where feasible, system administrators should span different time zones.
- Document your operations procedures and ensure that relevant personnel have
  access to them.

## References

[0]: https://docs.stacks.co/guides-and-tutorials/running-a-signer#minimum-system-requirements

- [Best practices to run a Stacks Signer](../running-a-signer/best-practices-to-run-a-signer.md).
