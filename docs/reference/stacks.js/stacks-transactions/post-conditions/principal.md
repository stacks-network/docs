# Pc.principal

Entry point for building post conditions. Starts the post condition builder chain by specifying the principal (address) the condition applies to.

The `Pc` builder uses a chainable API pattern: `PRINCIPAL → [AMOUNT] → CODE → ASSET`.

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

// Contract principal
Pc.principal('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.my-contract')
  .willSendLte(5000)
  .ustx();
```

#### Notes

- The address can be a standard principal (`ST...`) or a contract principal (`address.contract-name`).
- After calling `Pc.principal()`, chain one of the amount/comparator methods, then finalize with an asset method.

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/pc.ts#L37)**

***

### Signature

```ts
function principal(principal: AddressString | ContractIdString): PartialPcWithPrincipal;
```

***

### Returns

`PartialPcWithPrincipal`

An intermediate builder object. Chain with one of the following methods:

| Method | Description |
| --- | --- |
| `.willSendEq(amount)` | Amount sent will be **equal to** the specified amount |
| `.willSendLte(amount)` | Amount sent will be **less than or equal to** the specified amount |
| `.willSendLt(amount)` | Amount sent will be **less than** the specified amount |
| `.willSendGte(amount)` | Amount sent will be **greater than or equal to** the specified amount |
| `.willSendGt(amount)` | Amount sent will be **greater than** the specified amount |
| `.willSendAsset()` | The principal **will send** the NFT asset |
| `.willNotSendAsset()` | The principal **will not send** the NFT asset |

After the comparator, finalize with an asset method:

| Method | Description |
| --- | --- |
| `.ustx()` | STX post condition (returns `StxPostCondition`) |
| `.ft(contractId, tokenName)` | Fungible token post condition (returns `FungiblePostCondition`) |
| `.nft(assetName, assetId)` | Non-fungible token post condition (returns `NonFungiblePostCondition`) |

***

### Parameters

#### principal (required)

* **Type**: `AddressString | ContractIdString`

The principal address or contract identifier the post condition applies to.
