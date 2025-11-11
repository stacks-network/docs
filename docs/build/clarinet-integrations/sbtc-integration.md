# sBTC Integration

Clarinet can automatically wire up the official sBTC contracts so you can build and test SIP-010 flows locally.

## What you'll learn

* Add sBTC smart contracts to your Clarinet project
* Test contracts with automatic sBTC funding in devnet
* Work with sBTC as a SIP-010 fungible token
* Deploy sBTC contracts to testnet and mainnet

## Prerequisites

* Clarinet 2.15.0 or later required for automatic sBTC integration.

## Quickstart

{% stepper %}
{% step %}
### Add sBTC to your project

Add the sBTC contracts to your project requirements:

```bash
clarinet requirements add SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-deposit
```

This pulls in:

* `sbtc-token` – SIP-010 fungible token contract
* `sbtc-registry` – configuration registry
* `sbtc-deposit` – deposit and withdrawal logic

Clarinet auto-funds devnet wallets with sBTC when these are present.
{% endstep %}

{% step %}
### Create an sBTC-enabled contract

Example NFT marketplace that accepts sBTC payments:

```clarity
(define-non-fungible-token marketplace-nft uint)
(define-data-var mint-price uint u100)
(define-data-var next-id uint u0)

(define-public (mint-with-sbtc)
  (begin
    (try! (contract-call? 'SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token transfer
      (var-get mint-price)
      tx-sender
      (as-contract tx-sender)
      none))
    (try! (nft-mint? marketplace-nft (var-get next-id) tx-sender))
    (ok (var-set next-id (+ (var-get next-id) u1)))
  )
)

(define-read-only (get-sbtc-balance (owner principal))
  (contract-call? 'SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token get-balance owner)
)
```
{% endstep %}

{% step %}
### Test in the Clarinet console

Launch the console and try the contract using auto-funded wallets:

```bash
clarinet console
```

```clarity
(contract-call? .nft-marketplace get-sbtc-balance tx-sender)
(contract-call? .nft-marketplace mint-with-sbtc)
(nft-get-owner? .nft-marketplace marketplace-nft u0)
```
{% endstep %}

{% step %}
### Write unit tests

Sample Vitest test for sBTC payments:

```ts
import { describe, expect, it } from 'vitest';
import { Cl } from '@stacks/transactions';

describe('NFT Marketplace', () => {
  it('mints NFT with sBTC payment', () => {
    const accounts = simnet.getAccounts();
    const wallet1 = accounts.get('wallet_1')!;

    const initial = simnet.callReadOnlyFn(
      'nft-marketplace',
      'get-sbtc-balance',
      [Cl.standardPrincipal(wallet1.address)],
      wallet1.address
    );

    const mint = simnet.callPublicFn(
      'nft-marketplace',
      'mint-with-sbtc',
      [],
      wallet1
    );

    expect(mint.result).toBeOk();

    const final = simnet.callReadOnlyFn(
      'nft-marketplace',
      'get-sbtc-balance',
      [Cl.standardPrincipal(wallet1.address)],
      wallet1.address
    );

    expect(Number(Cl.parse(final.result))).toBeLessThan(
      Number(Cl.parse(initial.result))
    );
  });
});
```
{% endstep %}

{% step %}
### Deploy to testnet

Generate a plan to confirm remapped addresses for official sBTC contracts:

```bash
clarinet deployments generate --testnet
```

Deploy when ready:

```bash
clarinet deployments apply --testnet
```
{% endstep %}
{% endstepper %}

## Common patterns

### Working with sBTC addresses

Clarinet handles sBTC contract address mapping across networks:

| Network       | sBTC Contract Address                                  |
| ------------- | ------------------------------------------------------ |
| Simnet/Devnet | `SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token` |
| Testnet       | `ST1F7QA2MDF17S807EPA36TSS8AMEFY4KA9TVGWXT.sbtc-token` |
| Mainnet       | Contract address remains unchanged                     |

Your contract code always references the simnet address. Clarinet automatically remaps during deployment.

## Manual sBTC minting in unit tests

While Clarinet 2.15.0+ automatically funds wallets with sBTC in devnet, you may need to manually mint sBTC in unit tests for specific scenarios.

### Minting sBTC using the deployer address

The sBTC token contract allows the deployer (multisig) address to mint tokens. Use this approach in your tests:

```ts
import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

describe("Manual sBTC minting", () => {
  it("mints sBTC to custom addresses", () => {
    // The sBTC multisig address that can mint
    const sbtcDeployer = "SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4";
    const customWallet = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";

    // Mint 1000 sats to custom wallet
    const mintResult = simnet.callPublicFn(
      "SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token",
      "mint",
      [
        Cl.uint(1000),              // amount in sats
        Cl.principal(customWallet)   // recipient
      ],
      sbtcDeployer                   // sender must be deployer
    );

    expect(mintResult.result).toBeOk(Cl.bool(true));

    // Verify balance
    const balance = simnet.callReadOnlyFn(
      "SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token",
      "get-balance",
      [Cl.principal(customWallet)],
      customWallet
    );

    expect(balance.result).toBeOk(Cl.uint(1000));
  });
});
```

### Testing with mainnet execution simulation

When using mainnet execution simulation, you can mint sBTC using the actual mainnet multisig:

```ts
const mainnetMultisig = "SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4";
const mainnetWallet = "SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR";

// Mint sBTC to any mainnet address
simnet.callPublicFn(
  "SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token",
  "mint",
  [Cl.uint(100000), Cl.principal(mainnetWallet)],
  mainnetMultisig
);
```

This approach is useful for:

* Testing specific sBTC amounts
* Simulating different wallet balances
* Testing edge cases with precise token amounts
* Integration testing with mainnet contracts
