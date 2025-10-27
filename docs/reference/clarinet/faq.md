# FAQ

Common questions and solutions for Clarinet development.

This page addresses common issues encountered when building with Clarinet, based on community feedback and support interactions.

<details>

<summary><strong>How do I test with sBTC tokens in my development environment?</strong></summary>

To test with sBTC tokens, add the mainnet sBTC contract as a requirement and mint tokens using the deployer address.

* Add sBTC as a requirement:\
  `clarinet requirements add SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token`
* Mint sBTC in your tests\
  // The sBTC multisig address that can mint\
  `const sbtcDeployer = "SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4";`\
  // Mint sBTC to your test wallet\
  `const mintTx = simnet.callPublicFn(  "SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token",  "mint",  [Cl.uint(1000000), Cl.principal(wallet1)],  sbtcDeployer);`\
  \
  This approach lets you work with sBTC in unit tests without complex Bitcoin transaction simulation.

</details>

<details>

<summary><strong>Why am I getting an error when using mainnet addresses during mainnet simulation?</strong></summary>

When you run mainnet execution simulation, the target contract may expect mainnet addresses instead of the default testnet wallets. As of Clarinet v3.4.0, you can enable mainnet wallets in simnet with `use_mainnet_wallets = true`:

```toml
[repl.remote_data]
enabled = true
initial_height = 522000
use_mainnet_wallets = true
```

If you prefer to manage addresses manually, skip `simnet.getAccounts()` and use the specific mainnet principals you need:

```ts
// Instead of using simnet.getAccounts()
const mainnetAddress = "SP3R4F6C1J3JQWWCVZ3S7FRRYPMYG6ZW6RZK31FXY";

// Mint STX to any mainnet address
simnet.mintSTX(mainnetAddress, 1000000n);

// Call functions with a mainnet address
const result = simnet.callReadOnlyFn(
  "SP3R4F6C1J3JQWWCVZ3S7FRRYPMYG6ZW6RZK31FXY.pyth-storage-v3",
  "get-price",
  [priceFeed],
  mainnetAddress
);
```

The simnet accepts any valid Stacks address when mainnet simulation is enabled.

</details>

<details>

<summary><strong>How do I migrate from expectSTXTransferEvent to the new SDK?</strong></summary>

Clarinet v2 relies on standard Vitest matchers instead of the legacy event helpers.

Old approach (Clarinet v1):

```ts
block.receipts[0].events.expectSTXTransferEvent(
  amount,
  sender,
  recipient
);
```

New approach (Clarinet v2):

```ts
// Check for an exact event match
expect(events).toContainEqual({
  event: "stx_transfer_event",
  data: {
    amount: "1000000",
    memo: "",
    recipient: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
    sender: "ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5",
  },
});

// Or assert specific properties only
expect(events).toContainEqual({
  event: "stx_transfer_event",
  data: expect.objectContaining({
    sender: address1,
    recipient: contractAddress,
  }),
});
```

For Clarity value assertions, use the built-in matchers:

```ts
expect(result).toBeOk(Cl.bool(true));
expect(result).toBeErr(Cl.uint(500));
```

</details>

<details>

<summary><strong>Why am I getting "bip39 error" when generating deployment plans?</strong></summary>

Starting with Clarinet 2.15.0, deployment configurations require 24-word mnemonics. Twelve-word mnemonics are no longer supported.

Update your configuration with a full 24-word phrase:

```toml
[accounts.deployer]

# Use a 24-word mnemonic
mnemonic = "twice kind fence tip hidden tilt action fragile skin nothing glory cousin green tomorrow spring wrist shed math olympic multiply hip blue scout claw"
```

Generate a new 24-word mnemonic using a BIP39 generator if needed. The longer phrase improves security for production deployments.

</details>

<details>

<summary><strong>Can I test Bitcoin transaction verification in Clarinet?</strong></summary>

Testing contracts that use `clarity-bitcoin-lib` for Bitcoin transaction verification has limitations in simnet and devnet environments.

Current limitations:

* No real Bitcoin blocks or transactions in simnet
* Mock blocks do not contain verifiable Bitcoin transactions
* `get-burn-block-info?` returns mock data unsuitable for verification

Workarounds:

* Test Bitcoin verification logic on mainnet or with mainnet execution simulation
* Write unit tests that mock expected behavior instead of full verification
* Consider separating Bitcoin verification logic so it can be tested independently

The Clarinet team continues to investigate better support for Bitcoin-focused testing.

</details>

<details>

<summary><strong>Why does my devnet freeze at the epoch 3.0 transition?</strong></summary>

The epoch 3.0 transition in devnet can be unstable, with success rates between 50–80% depending on your setup.

Temporary workarounds:

* Restart devnet if it freezes around blocks 139–140
* Try Clarinet 2.14.0, which some users report as more stable
* Watch for the upcoming feature to start devnet directly in epoch 3.0

You can also monitor the transition manually:

```
# Watch for the transition around these blocks
Block 139: Epoch 2.5
Block 140: Should transition to 3.0
```

The Clarinet team is working on improving epoch transition stability and plans to allow starting devnet in epoch 3.0.

</details>
