# Contract Deployment

Clarinet provides deployment tooling that helps you move from local development to production networks. Whether you're testing on devnet, staging on testnet, or launching on mainnet, Clarinet streamlines the process.

## Generating deployment plans

Deployment plans are YAML files that describe how contracts are published or called. Be sure to have a valid 24 word mnemonic seed phrase specified in the target network's `.toml` file in `settings/` and then generate a plan for any network:

```bash
$ clarinet deployments generate --testnet --medium-cost
Analyzing contracts...
Calculating deployment costs...
Generating deployment plan
Created file deployments/default.testnet-plan.yaml
```

Example output structure:

{% code title="deployments/default.devnet-plan.yaml" %}
```yaml
---
id: 0
name: Devnet deployment
network: devnet
stacks-node: "http://localhost:20443"
bitcoin-node: "http://devnet:devnet@localhost:18443"
plan:
  batches:
    - id: 0
      transactions:
        - contract-publish:
            contract-name: counter
            expected-sender: ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
            cost: 6940
            path: contracts/counter.clar
            anchor-block-only: true
            clarity-version: 2
      epoch: "2.5"
```
{% endcode %}

### Deployment plan structure

| Field          | Description                                  |
| -------------- | -------------------------------------------- |
| `id`           | Unique identifier for the deployment         |
| `name`         | Human-readable deployment name               |
| `network`      | Target network (devnet, testnet, or mainnet) |
| `stacks-node`  | RPC endpoint for the Stacks node             |
| `bitcoin-node` | RPC endpoint for the Bitcoin node            |
| `plan.batches` | Array of deployment batches                  |

### Deployment specifications

Deployment behavior is configured in two places:

* **Project configuration (`Clarinet.toml`)** – Clarity versions, dependencies, epoch requirements
* **Network configuration (`settings/<network>.toml`)** – Account details, balances, endpoints

Example network configuration:

{% code title="settings/Testnet.toml" %}
```toml
[network]
name = "testnet"
deployment_fee_rate = 10

[accounts.deployer]
mnemonic = "<YOUR TESTNET MNEMONIC>"
balance = 100_000_000_000_000
derivation = "m/44'/5757'/0'/0/0"
```
{% endcode %}

## Working with contract requirements

Reference contracts that already exist on-chain—useful for standardized traits.

### Adding requirements

```bash
clarinet requirements add SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-trait
```

Clarinet updates your configuration automatically:

```toml
[project]
name = "my-nft-project"
requirements = [
  { contract_id = "SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-trait" }
]
```

During deployment Clarinet downloads the contract, remaps the principal for devnet, and ensures the requirement is available before your contracts deploy.

## Deploying to different networks

### Devnet

Devnet deploys contracts automatically when it starts:

```bash
clarinet devnet start
```

To deploy manually against a running devnet:

```bash
clarinet deployments apply --devnet
```

See [local development](local-blockchain-development.md) for more devnet configuration tips.

### Testnet

{% hint style="info" %}
Prerequisites:

* Request testnet STX from the faucet
* Configure your account in `settings/Testnet.toml`
* Validate contracts with `clarinet check`
{% endhint %}

Generate a deployment plan with cost estimation:

```bash
clarinet deployments generate --testnet --medium-cost
```

Deploy to testnet:

```bash
clarinet deployments apply --testnet
```

### Mainnet

{% hint style="warning" %}
Mainnet checklist
{% endhint %}

{% stepper %}
{% step %}
Finish thorough testing on testnet
{% endstep %}

{% step %}
Audit contracts for security
{% endstep %}

{% step %}
Ensure sufficient STX for fees
{% endstep %}

{% step %}
Back up deployment keys securely
{% endstep %}

{% step %}
Prefer a hardware wallet for deployment
{% endstep %}
{% endstepper %}

Create a mainnet plan:

```bash
clarinet deployments generate --mainnet --high-cost
```

Deploy with confirmation:

```bash
clarinet deployments apply --mainnet
```

## Cost estimation and optimization

Choose the right fee level for your deployment:

```bash
clarinet deployments generate --testnet --manual-cost
```

Fee options:

* `--low-cost` – minimize fees, slower confirmation
* `--medium-cost` – balanced approach
* `--high-cost` – priority inclusion
* `--manual-cost` – interactive selection

Analyze costs before deploying:

```bash
clarinet deployments generate --testnet --medium-cost
```

## Advanced deployment configurations

### Multi-batch deployments

Deploy complex systems with batches:

{% code title="" %}
```yaml
plan:
  batches:
    - id: 0
      transactions:
        - contract-publish:
            contract-name: trait-definitions
            path: contracts/traits.clar
            clarity-version: 2
    - id: 1
      transactions:
        - contract-publish:
            contract-name: token
            path: contracts/token.clar
        - contract-publish:
            contract-name: oracle
            path: contracts/oracle.clar
    - id: 2
      transactions:
        - contract-publish:
            contract-name: defi-pool
            path: contracts/defi-pool.clar
```
{% endcode %}

Batches guarantee that dependencies deploy first, allow parallel transactions within a batch, and run batches sequentially.

### Transaction types

Deployment plans support different transaction types:

| Transaction type    | Description                                                         |
| ------------------- | ------------------------------------------------------------------- |
| Contract operations | Publish or call contracts, specifying sender, cost, and source path |
| Asset transfers     | Transfer STX or BTC by setting sender, recipient, and amounts       |

**Contract operations**

```yaml
- contract-publish:
    contract-name: my-contract
    expected-sender: ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
    cost: 5960
    path: contracts/my-contract.clar
    clarity-version: 2

- contract-call:
    contract-id: ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.my-contract
    expected-sender: ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
    method: initialize
    parameters:
      - u1000000
      - "Token Name"
    cost: 5960
```

**Asset transfers**

```yaml
- stx-transfer:
    expected-sender: ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
    recipient: ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG
    mstx-amount: 1000000
    memo: '0x48656c6c6f'

- btc-transfer:
    expected-sender: mjSrB3wS4xab3kYqFktwBzfTdPg367ZJ2d
    recipient: bcrt1qnxknq3wqtphv7sfwy07m7e4sr6ut9yt6ed99jg
    sats-amount: 100000000
    sats-per-byte: 10
```

### Manual customization

You can edit deployment plans for complex scenarios.

{% hint style="info" %}
Manual edits

When Clarinet prompts to overwrite your plan, answer `no` to keep custom changes.
{% endhint %}

Example contract initialization batch:

```yaml
- id: 3
  transactions:
    - contract-call:
        contract-id: ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.token
        method: initialize
        parameters:
          - u1000000
          - { name: "My Token", symbol: "MTK", decimals: u6 }
        expected-sender: ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
```

### Encrypted mnemonics

`clarinet 3.11.0` contains support for encrypted mnemonics. This feature gives users the option to encrypt the mnemonic seed phrase in their deployment files, so if a user's machine is compromised by a filesystem reading vulnerability, the seed phrase is not leaked to the attacker.

To use this feature, a user must first run `clarinet deployments encrypt`, which will prompt the user for the seed phrase and a password, then print the encrypted mnemonic to the console. The user can then put the resulting ciphertext into their deployment config file using the key `encrypted_mnemonic`. The next time the user runs `clarinet deployments apply`, they will be prompted for the password, and the mnemonic will be decrypted for use in that session.

For example, if your `settings/Mainnet.toml` file looks like this:

{% code title="settings/Mainnet.toml" %}
```toml
[network]
name = "mainnet"
stacks_node_rpc_address = "https://api.hiro.so"
deployment_fee_rate = 10

[accounts.deployer]
mnemonic = "twice kind fence tip hidden tilt action fragile skin nothing glory cousin green tomorrow spring wrist shed math olympic multiply hip blue scout claw"
```
{% endcode %}

You would then run:

{% code title="terminal" %}
```
user@host package % clarinet deployments encrypt
Enter mnemonic to encrypt:
twice kind fence tip hidden tilt action fragile skin nothing glory cousin green tomorrow spring wrist shed math olympic multiply hip blue scout claw
Enter password: 
Encrypted mnemonic: 47hYHSp4gtoBabz4X8cByJtRbvD3tBemS1zZJTkxYh2LJ7cVAHY6z74Td8bF5Dcsdpv45gDELPwfBP8Mfk64Q8TsBJNU9sf5hWMrTKPtr5h9abSdmxu4m2BewbUCi4o8znn42nAd7yphcb345YCrYLJFqFC7k9LqXvxgbQxUiFpWeyTVJPkGFa3aiQ8G5uhrv7pLCer4kRmXsmXbBvEqwEQLG7eM3TUMzUP79mHqJ1HGe2XWn
```
{% endcode %}

You would then replace the `mnemonic` field in your settings file with the `encrypted_mnemonic` output above:

{% code title="settings/Mainnet.toml" %}
```toml
[accounts.deployer]
encrypted_mnemonic = "47hYHSp4gtoBabz4X8cByJtRbvD3tBemS1zZJTkxYh2LJ7cVAHY6z74Td8bF5Dcsdpv45gDELPwfBP8Mfk64Q8TsBJNU9sf5hWMrTKPtr5h9abSdmxu4m2BewbUCi4o8znn42nAd7yphcb345YCrYLJFqFC7k9LqXvxgbQxUiFpWeyTVJPkGFa3aiQ8G5uhrv7pLCer4kRmXsmXbBvEqwEQLG7eM3TUMzUP79mHqJ1HGe2XWn"
```
{% endcode %}

Then the next time you deploy your package, you will be prompted for the password:

{% code title="terminal" %}
```
user@host package % clarinet deployments apply --mainnet

Enter password to decrypt mnemonic for account deployer: 
```
{% endcode %}

## Common issues

### Insufficient STX balance

**Error**: “Insufficient STX balance for deployment”

Solutions:

{% stepper %}
{% step %}
Request testnet STX from the faucet
{% endstep %}

{% step %}
Reduce the fee rate with `--low-cost`
{% endstep %}

{% step %}
Check your balance:

```bash
clarinet console --testnet
stx-account 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG
```
{% endstep %}
{% endstepper %}

### Contract already exists

**Error**: “Contract `token` already deployed at this address”

Solutions:

{% stepper %}
{% step %}
Use a different contract name
{% endstep %}

{% step %}
Deploy from another address
{% endstep %}

{% step %}
On testnet, switch to a fresh account
{% endstep %}
{% endstepper %}

### Network connection failures

**Error**: “Failed to connect to testnet node”

Check your network settings:

```toml
[network]
name = "testnet"
node_rpc_address = "https://stacks-node-api.testnet.stacks.co"
```

Alternative endpoints:

* Hiro: `https://api.testnet.hiro.so`
* Your own node

Debug the connection:

```bash
curl -I https://api.testnet.hiro.so/v2/info
```

### Invalid deployment plan

**Common YAML errors**

* Incorrect indentation
* Missing required fields
* Invalid contract paths

Validate and regenerate as needed:

```bash
clarinet deployments check
clarinet deployments generate --testnet
ls contracts/
```
