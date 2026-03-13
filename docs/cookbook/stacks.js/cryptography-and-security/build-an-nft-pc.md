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
