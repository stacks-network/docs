# principal

Entry point for building post conditions. Starts the post condition builder chain by specifying the principal (address) the condition applies to.

The `Pc` builder uses a chainable API pattern: `PRINCIPAL → [AMOUNT] → CODE → ASSET`. PoX conditions are the exception — they terminate directly on the principal.

***

### Usage

```ts
import { Pc, Cl } from '@stacks/transactions';

// STX post condition — principal will send exactly 10,000 microSTX
Pc.principal('STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6')
  .willSendEq(10000)
  .ustx();

// Fungible token post condition
Pc.principal('STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6')
  .willSendGte(1000)
  .ft('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.token-contract', 'token-name');

// Non-fungible token post condition
Pc.principal('STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6')
  .willSendAsset()
  .nft('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.nft-contract::nft-name', Cl.uint(1));

// NFT that may or may not be sent (SIP-040)
Pc.principal('STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6')
  .willMaybeSendAsset()
  .nft('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.nft-contract::nft-name', Cl.uint(1));

// Staking post condition — principal will lock at most 1 STX
Pc.principal('STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6')
  .willSendLte(1000000)
  .ustxToLock();

// PoX post condition — terminates directly, no amount or asset
Pc.principal('STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6').willNotPerformPox();

// Contract principal
Pc.principal('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.my-contract')
  .willSendLte(5000)
  .ustx();
```

#### Notes

* The address can be a standard principal (`ST...`) or a contract principal (`address.contract-name`).
* After calling `Pc.principal()`, chain one of the amount/comparator methods, then finalize with an asset method — except for the PoX methods, which return a complete post condition on their own.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/b7f0ed3f87cd4c5bfb7ab3c4bd8787c2018e3cec/packages/transactions/src/pc.ts)

***

### Signature

```ts
function principal(principal: AddressString | ContractIdString): PartialPcWithPrincipal;
```

***

### Returns

`PartialPcWithPrincipal`

An intermediate builder object. Chain with one of the following methods:

| Method                  | Description                                                           |
| ----------------------- | --------------------------------------------------------------------- |
| `.willSendEq(amount)`   | Amount sent will be **equal to** the specified amount                 |
| `.willSendLte(amount)`  | Amount sent will be **less than or equal to** the specified amount    |
| `.willSendLt(amount)`   | Amount sent will be **less than** the specified amount                |
| `.willSendGte(amount)`  | Amount sent will be **greater than or equal to** the specified amount |
| `.willSendGt(amount)`   | Amount sent will be **greater than** the specified amount             |
| `.willSendAsset()`      | The principal **will send** the NFT asset                             |
| `.willNotSendAsset()`   | The principal **will not send** the NFT asset                         |
| `.willMaybeSendAsset()` | The NFT asset **may or may not** be sent — always passes              |

After an amount comparator, finalize with an asset method:

| Method                       | Description                                                     |
| ---------------------------- | --------------------------------------------------------------- |
| `.ustx()`                    | STX post condition (returns `StxPostCondition`)                 |
| `.ft(contractId, tokenName)` | Fungible token post condition (returns `FungiblePostCondition`) |
| `.ustxToLock()`              | Staking post condition (returns `StakingPostCondition`)         |

After an NFT comparator, finalize with:

| Method                     | Description                                                            |
| -------------------------- | ---------------------------------------------------------------------- |
| `.nft(assetName, assetId)` | Non-fungible token post condition (returns `NonFungiblePostCondition`) |

***

### PoX methods

These return a complete `PoxPostCondition` immediately — there is no amount and no asset to supply.

| Method                 | Condition code   | Description                                                  |
| ---------------------- | ---------------- | ------------------------------------------------------------ |
| `.willPerformPox()`    | `WillPerform`    | The principal **must** perform a gated PoX action            |
| `.willNotPerformPox()` | `WillNotPerform` | The principal **must not** perform a gated PoX action        |
| `.mayPerformPox()`     | `MayPerform`     | The principal **may or may not** perform one — always passes |

{% hint style="info" %}
`.willMaybeSendAsset()` comes from [SIP-040](https://github.com/stacksgov/sips/blob/main/sips/sip-040/sip-040-post-conds.md) and is available in `@stacks/transactions` 7.4.0 and later. `.ustxToLock()` and the PoX methods were added for Stacks epoch 4.0 and are available in 7.5.0 and later.
{% endhint %}

***

### Parameters

#### principal (required)

* **Type**: `AddressString | ContractIdString`

The principal address or contract identifier the post condition applies to.
