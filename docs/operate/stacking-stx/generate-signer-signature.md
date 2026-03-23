# Generate a Signer Signature

Stacking transactions require a **signer key signature** to prove that the controller of the signer key authorizes the stacking operation. This page covers what a signer signature is, what data it contains, and all the ways to generate one.

Both [solo stacking](solo-stacking.md) and delegated stacking ([Stack with a Pool](stack-with-a-pool.md) / [Operate a Pool](operate-a-pool.md)) reference this page. Generate your signature here before making stacking transactions.

***

## Overview

Signer signatures are created using your signer key. They demonstrate that the controller of that signer key is allowing a stacker (or pool operator) to use their signing key in a stacking transaction. Because signer keys must be unique across the network, this also prevents other stackers from using someone else's key.

{% hint style="info" %}
The current pox-4 contract address can be found at [https://api.mainnet.hiro.so/v2/pox](https://api.mainnet.hiro.so/v2/pox). You can view the contract in the [Stacks Explorer](https://explorer.hiro.so/?chain=mainnet).
{% endhint %}

### Fields Passed in Stacking Transactions

When making stacking transactions, you need to provide these signature-related fields:

{% stepper %}
{% step %}
#### signer-key

The public key that corresponds to the `stacks_private_key` your signer is using.
{% endstep %}

{% step %}
#### signer-signature

A signature that demonstrates you actually control your `signer-key`.
{% endstep %}

{% step %}
#### max-amount

The maximum amount of uSTX (1 STX = 1,000,000 uSTX) that can be locked in the transaction that uses this signature. For example, if calling `stack-increase`, this dictates the maximum amount of uSTX that can be used to add more locked STX.
{% endstep %}

{% step %}
#### auth-id

A random integer that prevents the same signature from being reused, similar to how nonces are used with transactions. Must be less than 14 characters.
{% endstep %}
{% endstepper %}

### Signature Message Contents

The signer signature's message hash is created using the following data:

* **`method`**: the stacking function that is allowed to use this signature. Valid options:
  * `stack-stx`: for solo stacking
  * `stack-extend`: for extending a solo stacking lock
  * `stack-increase`: for increasing a solo stacking position
  * `agg-commit`: for `stack-aggregation-commit-indexed` (pool operators)
  * `agg-increase`: for `stack-aggregation-increase` (pool operators)
* **`max-amount`**: the maximum uSTX allowed (described above)
* **`auth-id`**: the random integer (described above)
* **`period`**: a value between 1 and 12 indicating how many cycles the stacker is allowed to lock for. For `agg-commit`, this must equal 1.
* **`reward-cycle`**: the reward cycle in which the stacking transaction can be confirmed. See the important note below about how this differs between solo and delegated stacking.
* **`pox-address`**: the Bitcoin address allowed for receiving rewards
* **`config`**: the signer configuration file path where the `stacks_private_key` is located (used by the CLI for signing)

{% hint style="warning" %}
**reward-cycle differences:**
* For **solo stacking** operations (`stack-stx`, `stack-extend`, `stack-increase`): set this to the **current** reward cycle.
* For **`stack-aggregation-commit-indexed`**: set this to the **target** reward cycle (typically current cycle + 1, or a future cycle you are committing to). This is because pool operators can commit for future cycles, not just the next one.
{% endhint %}

{% hint style="warning" %}
Every field in the signature must **exactly match** the corresponding fields in your stacking transaction. A mismatch will cause the transaction to fail.
{% endhint %}

***

## Generating Signatures

You have several options for generating signer signatures. Choose the one that best fits your setup.

### Using the stacks-signer CLI

If you have your signer configured and running, you can use the `stacks-signer` CLI to generate signatures. You can SSH into your running signer or use the CLI locally with a matching configuration file.

{% hint style="info" %}
Having a matching configuration file is important to ensure the signer public key in your stacking transactions is the same as in your hosted signer.
{% endhint %}

```bash
stacks-signer generate-stacking-signature \
  --method stack-stx \
  --max-amount 1000000000000 \
  --auth-id 71948271489 \
  --period 1 \
  --reward-cycle 100 \
  --pox-address bc1... \
  --config ./config.toml \
  --json
```

* `--json` optionally outputs the result in JSON format

You can generate a random 32-bit integer for `auth-id` with:

```bash
python3 -c 'import secrets; print(secrets.randbits(32))'
```

The CLI outputs a JSON object:

```json
{
  "authId": "71948271489",
  "maxAmount": "1000000000000",
  "method": "stack-stx",
  "period": 1,
  "poxAddress": "bc1...",
  "rewardCycle": 100,
  "signerKey": "03a3...",
  "signerSignature": "bbbbbbbbbbb"
}
```

Use this JSON when making stacking transactions. This output can be pasted directly into Leather Earn.

{% hint style="info" %}
The address you use for stacking transactions may differ from your signer address. See [Key and Address Rotation](key-and-address-rotation.md) for more details on the relationship between signer keys and pool operator keys.
{% endhint %}

### Using stacks.js

The [@stacks/stacking](https://www.npmjs.com/package/@stacks/stacking) NPM package provides a `signPoxSignature` function to generate signer signatures programmatically.

More information and code samples can be found on [Hiro's Nakamoto docs](https://docs.hiro.so/nakamoto/stacks-js).

### Using Degen Lab's stacking.tools

Degen Lab provides a [signature generation tool](https://signature.stacking.tools/) that generates signatures using their signer. This is the quickest and simplest option. Visit the tool and enter the relevant parameters.

### Using Leather Earn

{% hint style="info" %}
At the time of writing, this has only been tested using the [Leather](https://leather.io/) wallet.
{% endhint %}

Visit [earn.leather.io](https://earn.leather.io/) to generate a signer key signature. Make sure you're connected to the correct network.

To generate a signer key signature, log into Leather with the same secret key used to generate your signer key (not your pool operator address). Then click the "Signer key signature" link at the bottom of the page.

The fields are:

* **Reward cycle**:
  * For solo stacking transactions: must equal the current reward cycle. The field defaults to the current cycle.
  * For `stack-aggregation-commit-indexed`: must equal the cycle used in that function's "reward cycle" argument. Typically current\_cycle + 1.
* **Bitcoin address**: the PoX reward address
* **Topic**: the stacking function that will use this signature
* **Max amount**: max amount of STX that can be used. Defaults to "max possible amount".
* **Auth ID**: defaults to a random integer
* **Duration**: must match the number of cycles used in the stacking transaction. For `stack-aggregation-commit-indexed`, use "1".

Click "generate signature" to popup a Leather signing window. After signing, Leather Earn will display your signer key and signature. You can click the "copy" icon next to "signer details to share with stackers" to copy a JSON string that can be pasted directly into the stacking transaction form.

### Using a Hardware or Software Wallet

If your signer is configured with a `stacks_private_key`, you can use that key in a wallet to generate stacking signatures.

If you used [@stacks/cli](https://docs.hiro.so/get-started/command-line-interface) to generate the key, the CLI also outputs a mnemonic (seed phrase) that can be imported into a wallet. Because the Stacks CLI uses the standard derivation path, any Stacks wallet will default to the same private key when imported.

#### Setting up a wallet for signature generation

{% stepper %}
{% step %}
#### Generate the keypair and configure signer

1. Use `@stacks/cli` to generate the keychain and private key.
   * When using a hardware wallet, it's typically better to generate the mnemonic on the device itself. However, the signer software needs the raw private key, which hardware wallets don't export by design.
2. Take the `privateKey` from the CLI output and add it to your signer's configuration.
3. Take the mnemonic (24 words) and either:
   * Set up a new hardware wallet with this mnemonic, or
   * Store it securely (e.g., in a password manager). Import it into Leather or XVerse when you need to generate signatures.
{% endstep %}

{% step %}
#### Generate signatures when needed

1. Set up your wallet with your signer key's private key:
   * Set up Leather with a Ledger hardware wallet, or
   * Import your mnemonic into Leather, XVerse, or another Stacks wallet
2. Open an app with stacking signature functionality (e.g., Leather Earn)
3. Connect your wallet (sign in)
4. Enter your PoX address and submit. The app will prompt you to sign
5. Confirm the signature (if using a Ledger, confirm on the device)
6. The app displays your signer key and signature
7. Use the signer key and signature in your stacking transaction
{% endstep %}
{% endstepper %}

***

## Signature Requirements by Function

| Function | Method | Period | Reward Cycle |
|----------|--------|--------|-------------|
| `stack-stx` | `stack-stx` | Lock period (1–12) | Current cycle |
| `stack-extend` | `stack-extend` | Extend count (1–12) | Current cycle |
| `stack-increase` | `stack-increase` | Current lock period | Current cycle |
| `stack-aggregation-commit-indexed` | `agg-commit` | 1 | Target cycle (e.g., current + 1) |
| `stack-aggregation-increase` | `agg-increase` | 1 | Target cycle |
