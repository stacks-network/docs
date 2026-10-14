# Mainnet Execution Simulation

<div data-with-frame="true"><figure><img src="../.gitbook/assets/mainnet-execution-simulation.png" alt=""><figcaption></figcaption></figure></div>

Mainnet execution simulation (MXS) lets you test your Clarity contracts against real mainnet data without deploying experimental code. You can reproduce historical state, validate complex integrations, and debug edge cases while keeping the speed of local development.

## What you'll learn

* Set up MXS in a Clarinet project
* Write tests that interact with mainnet contracts
* Simulate historical transactions
* Understand MXS limitations

## What is Mainnet execution simulation?

Testing smart contracts in realistic conditions is essential. Simnet offers an isolated environment but lacks the live Stacks mainnet's complexity and history.

MXS fills this gap by enabling unit tests with the Clarinet JS SDK and Vitest to simulate the Stacks mainnet state at a specific block height. This allows you to:

* **Validate contract logic with real data:** Directly test mainnet contracts or data within your tests.
* **(Re)simulate transactions:** Analyze mainnet transactions' results, execution, or costs without deploying or using actual STX.

## Enable MXS in your project

Add the following configuration to your `Clarinet.toml` file:

```toml
[repl.remote_data]

# Enable mainnet execution simulation
enabled = true

# Stacks block height to fork from. 9,000,000 is in Epoch 4.0 (Bitcoin block 967,219).
initial_height = 9000000

# API URL (optional, defaults to https://api.hiro.so)
api_url = 'https://api.hiro.so'
```

{% hint style="info" %}
Pro tip

Set a specific `initial_height` to keep tests reproducible.
{% endhint %}

## Using mainnet addresses

When testing contracts that check or require mainnet addresses, set `use_mainnet_wallets = true`. This enables your simnet tests to use mainnet addresses (SP/SM) instead of testnet addresses (ST).

```toml
[repl.remote_data]
enabled = true
initial_height = 9000000
use_mainnet_wallets = true  # !mark
```

This is particularly useful when:

* Testing against mainnet-only contracts like DEX protocols
* Your contract includes [`(is-standard standard-or-contract-principal)`](mainnet-execution-simulation.md) validation
* Simulating transactions that require mainnet address formats

## Configure API access

While MXS works without an API key, you may encounter rate limits. Set up an API key for reliable access:

```bash
export HIRO_API_KEY="<your-api-key>"
```

## Write tests with mainnet data

Once MXS is enabled, your tests operate against the mainnet state at `initial_height`. This example reads the current reward cycle from the mainnet `pox-5` contract:

```ts
import { describe, it, expect } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;

describe("pox-5 mainnet interaction", () => {
  it("reads the current reward cycle from mainnet", () => {
    // Call the mainnet pox-5 contract
    const call = simnet.callReadOnlyFn(
      "SP000000000000000000002Q6VF78.pox-5", // Mainnet contract
      "current-pox-reward-cycle",
      [],
      deployer
    );

    // Stacks block 9,000,000 sits at Bitcoin block 967,219.
    // (967219 - 666050) / 2100 = 143. Recompute when you change initial_height.
    expect(call.result).toBeUint(143);

    console.log("Current PoX reward cycle:", Cl.prettyPrint(call.result));
  });
});
```

The test uses `simnet.callReadOnlyFn` as in a standard unit test. Because MXS is enabled, it reads the `pox-5` state at the forked block: `burn-block-height` inside the simnet starts at that block's Bitcoin height, and `current-pox-reward-cycle` divides the distance from `first-burnchain-block-height` (666,050) by the 2,100-block cycle length.

`pox-5` exists from Stacks block 8,665,568, the first block of Epoch 4.0 (Bitcoin block 960,230). Below that height the call fails with `Contract 'SP000000000000000000002Q6VF78.pox-5' does not exist`. `pox-4` stays readable after the fork, and its public functions fail from Epoch 4.0 onward, so a test that forks before 8,665,568 can read PoX-4 history but cannot exercise staking.

Read-only functions that are useful as a first MXS target, all on `SP000000000000000000002Q6VF78.pox-5`:

| Function                                 | Returns                                                                          |
| ---------------------------------------- | -------------------------------------------------------------------------------- |
| `current-pox-reward-cycle`               | The reward cycle at the simnet's `burn-block-height`                             |
| `get-pox-info`                           | Cycle id, cycle and prepare lengths, first burnchain block height, liquid supply |
| `get-staker-info (staker principal)`     | The staker's position, or `none`                                                 |
| `get-bond-membership (staker principal)` | The staker's protocol bond membership, or `none`                                 |

The TypeScript equivalents are in the SDK reference: [fetchPoxInfo](https://app.gitbook.com/s/GVj1Z9vMuEOMe7oH7Wnq/stacks.js/stacks-bitcoin-staking/fetch/fetchpoxinfo), [fetchStakerInfo](https://app.gitbook.com/s/GVj1Z9vMuEOMe7oH7Wnq/stacks.js/stacks-bitcoin-staking/fetch/fetchstakerinfo), [fetchBondMembership](https://app.gitbook.com/s/GVj1Z9vMuEOMe7oH7Wnq/stacks.js/stacks-bitcoin-staking/fetch/fetchbondmembership).

## Try it out

Run your test to see MXS in action:

```bash
npm run test
```

## Common issues

<details>

<summary>Rate limit errors</summary>

Solution: Set up the `HIRO_API_KEY` environment variable.

```bash
export HIRO_API_KEY="<your-api-key>"
```

</details>

<details>

<summary>Inconsistent results</summary>

Solution: Fix `initial_height` in configuration so tests are run against a reproducible block snapshot.

</details>

<details>

<summary>Function not found</summary>

Solution: Check the contract exists at your block height.

</details>

<details>

<summary>Contract 'SP000000000000000000002Q6VF78.pox-5' does not exist</summary>

Solution: `pox-5` is deployed from Stacks block 8,665,568. Set `initial_height` to 8,665,568 or later.

</details>

## Testing in the playground

{% stepper %}
{% step %}
**Visit the playground**

Go to: [https://play.stackslabs.com/?remote\_data=true](https://play.stackslabs.com/?remote_data=true)
{% endstep %}

{% step %}
**Run a mainnet contract call**

Example Clarity call:

```clarity
> contract-call? 'SP000000000000000000002Q6VF78.pox-5 current-pox-reward-cycle
```
{% endstep %}
{% endstepper %}
