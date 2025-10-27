# Best Practices for running an sBTC Signer

The following best practices suggest how to create a resilient setup for running your sBTC Signer.

## Protect your private key and have a cold-storage backup

* Prevent unauthorised access to the sBTC Signer private key.
* Keep an offline, secure backup of your sBTC Signer private key (e.g., hardware security modules or encrypted storage devices).

## Backup your sBTC Signer PostgreSQL DB

* Perform daily backups of the sBTC Signer PostgreSQL DB.
* Periodically verify the integrity of backups (see steps below).

### Verifying integrity of PostgreSQL DB backups

{% stepper %}
{% step %}
### Import the backup

Import the backup into a fresh PostgreSQL instance. The database alone is sufficient — you do not need to spin up a Stacks or Bitcoin node or the sBTC signer.
{% endstep %}

{% step %}
### Run the verification query

Execute the following query:

{% code title="PostgreSQL" %}
```
```
{% endcode %}

```sql
SELECT aggregate_key FROM sbtc_signer.dkg_shares
WHERE dkg_shares_status = 'verified'
ORDER BY created_at DESC;
```

This returns rows like:

```sql
                            aggregate_key
----------------------------------------------------------------------
 \x03d8c4344861fc7590fd812c24884a3bfd9374d8ba865a787ff53c9060020aa967
 \x03f898f8a6ddb86dd4608dd168355ec6135fe2839222240c01942e8e7e50dd4c89
(2 rows)
```

The most recent `aggregate_key` is the first row.
{% endstep %}

{% step %}
### Compare with the on-chain aggregate key

Fetch the current aggregate pubkey from the sbtc-registry contract and compare it to the most recent `aggregate_key` from the DB query:

```bash
curl -s 'https://api.hiro.so/v2/contracts/call-read/SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4/sbtc-registry/get-current-aggregate-pubkey' \
           -H 'content-type: application/json' --data-raw '{"sender":"SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4","arguments":[]}' | jq .result
```

Example output:

```
"0x020000002103d8c4344861fc7590fd812c24884a3bfd9374d8ba865a787ff53c9060020aa967"
```

Discard the prefix `0x02000000210` (Clarity encoding). The remaining hex `3d8c4344861fc7590fd812c24884a3bfd9374d8ba865a787ff53c9060020aa967` should match the first row of the PostgreSQL query (excluding `\x0` which indicates hex encoding).
{% endstep %}
{% endstepper %}

## Setup proper access control

* Require hardware 2FA keys for access control (e.g., YubiKey) to connect through SSH, to authenticate to AWS, and for every other relevant action.
* Follow the principle of least privilege: if you don’t need access, you don’t get access; if you get access, it expires after the action is taken.

{% hint style="info" %}
Optional, but strongly recommended: Implement a "4-eyes" process (require that any activity by an individual must be reviewed or approved by a second individual) to access critical resources (e.g., deploying a new version of the sBTC signer).
{% endhint %}

## Maintain a strict firewall configuration

* Allow connections to your sBTC signer `listen_on` address (used for P2P communication).
* Do not expose any non-essential service to the internet: use a DEFAULT DENY policy with explicit ALLOWs for necessary network traffic (such as sBTC signer P2P and SSH).

## Maintain a robust secrets management program

* Ensure all relevant secrets are safely managed and rotated (where possible), e.g., if someone leaves the team.

## Monitor and observe your sBTC Signer

* Retain at least 90 days of logs for the sBTC Signer, the Stacks node, and the Bitcoin node.
* The sBTC signer can optionally expose Prometheus metrics (see `prometheus_exporter_endpoint` configuration option).

{% hint style="info" %}
You can use Prometheus metrics to monitor signer health. For example, see how Alloy can be configured to collect metrics on Grafana Cloud: ../running-a-signer/how-to-monitor-signer.md
{% endhint %}

## Provision dedicated downstream components

* Run a dedicated Bitcoin node and Stacks node for your sBTC Signer.
  * Ensure the nodes are provisioned with the minimum hardware requirements described here: https://docs.stacks.co/guides-and-tutorials/running-a-signer#minimum-system-requirements
  * Nodes should be exclusively dedicated to serve the sBTC Signer. Avoid re-using them to serve other clients as that may negatively affect performance (no mock-signing, no Stacks API nodes).

## Monitor new software releases

* Stay up-to-date with new releases, patches, and security advisories for all used operating systems, software and packages.
  * https://www.cve.org/ is a useful resource for popular software packages.
  * Subscribe to security notifications from your vendors.
  * Join relevant messaging channels as applicable (Discord, Slack, etc.).
* Exercise vulnerability management for all packages.
* Apply updates promptly, especially those addressing security vulnerabilities.
* Use inventory and patch management software, if available.

## Ensure redundancy in operations

* Ensure that multiple, trusted system administrators can manage and maintain your sBTC Signer instance.
* Where feasible, system administrators should span different time zones.
* Document your operations procedures and ensure that relevant personnel have access to them.

