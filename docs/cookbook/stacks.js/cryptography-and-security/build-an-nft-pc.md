# Build an nft pc

{% code fullWidth="false" expandable="true" %}
```typescript
import { Pc, Cl } from '@stacks/transactions';

// Ensure a specific NFT will be sent
const sendPC = Pc.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM")
  .willSendAsset()
  .nft('ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE.cool-nfts::nft-token', Cl.uint(42));

// Ensure a specific NFT will NOT be sent
const keepPC = Pc.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM")
  .willNotSendAsset()
  .nft('ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE.cool-nfts::nft-token', Cl.uint(1));

// Allow a specific NFT to be sent, without requiring it (SIP-040)
const maybePC = Pc.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM")
  .willMaybeSendAsset()
  .nft('ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE.cool-nfts::nft-token', Cl.uint(7));
```
{% endcode %}

### Description

Create post-conditions for NFT transfers to ensure specific tokens are or aren't transferred

### Use Cases

* Protecting valuable NFTs from accidental transfers
* Ensuring specific NFTs are transferred in marketplace transactions
* Safeguarding NFT collections during contract interactions

### Key Concepts

* **Asset identifier** - Contract address + asset name with `::` separator
* **Token ID** - The specific NFT ID as a Clarity value (using `Cl.uint()`)
* NFT post-conditions use the `.nft()` method
* `.willMaybeSendAsset()` - The NFT may or may not be sent, and the condition always passes. It still counts as covering that NFT instance under `Deny` or `Originator` mode, so an optional transfer can be authorised without falling back to `Allow`. Added by [SIP-040](https://github.com/stacksgov/sips/blob/main/sips/sip-040/sip-040-post-conds.md), available in `@stacks/transactions` 7.4.0 and later.
