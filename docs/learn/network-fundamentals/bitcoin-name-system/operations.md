# Operations

### Registering a Name

Name registration is performed by calling the appropriate BNSv2 contract function. The caller becomes the owner of the name.

**High-level flow:**

1. Check availability
2. Submit registration transaction
3. Pay required STX fee
4. Wait for confirmation
5. Name is assigned to caller principal

**Path 1 — Preorder + Register (safe, prevents front-running):**

1. Generate a salted hash of the fully-qualified name: hash160(name.namespace.salt)
2. Submit name-preorder with the hash and STX to burn
3. Wait at least 1 block
4. Submit name-register with the actual name, namespace, and salt
5. Contract verifies hash match, burns STX, mints NFT to caller&#x20;

**Path 2 — Fast Claim (single tx, vulnerable to front-running):**

1. Submit name-claim-fast with name, namespace, and recipient
2. STX burned in one step, NFT minted immediately
3. Risk: name is visible in the mempool before confirmation, so it can be sniped For managed namespaces: Use `mng-name-preorder` + `mng-name-register` (no STX burn, manager controls pricing).

### Updating Records

Once a name is owned, the owner can update records via contract calls. Updates go through the `zonefile-resolver` contract via `update-zonefile(name, namespace, new-zonefile)`. The caller must be either the name owner OR the namespace manager (for managed namespaces). Mention the 8KB limit.

Example record updates might include:

* Setting a Stacks address
* Updating profile metadata
* Adding custom key-value pairs

Only the current owner can modify records.

### Transferring a Name

Names are transferable digital assets. `transfer(id, sender, recipient)` on the BNS-V2 contract. For managed namespaces, use `mng-transfer(id, sender, recipient)`, but only if manager transfers haven't been turned off via `turn-off-manager-transfers` .

The owner can:

* Transfer ownership to another principal
* Use a name inside other contracts
* Integrate names into marketplaces or identity systems

Because ownership is native to Clarity, transfers are trustless.

### Resolving a Name

Resolution involves querying BNSv2 contracts for a name’s stored record.

`resolve-name(name, namespace)` on `zonefile-resolver`

The corresponding BNSv2 SDK functions: `resolveNameZonefile()`, `getNameInfo()`, `getPrimaryName()`.

Apps can:

* Call the contract directly via RPC
* Use SDK helpers
* Use indexers for convenience

Resolution is deterministic and does not rely on centralized servers.

### **Pricing**

Name prices are calculated based on:

* Length of the name
* Presence of vowels
* Presence of non-alphabetic characters
* Namespace-specific pricing functions
* **For managed namespaces the pricing will be handled directly by the namespace manager contract**

### **NFT Integration**

Each name is minted as an NFT, allowing:

* Easy transfers of ownership
* Integration with NFT marketplaces and other applications

### Renewals

Names in unmanaged namespaces expire after lifetime blocks. Owners have a 5,000 block grace period (\~34 days) after expiration to renew via `name-renewal(namespace, name)`.&#x20;

* Renewal burns STX based on the current name price.&#x20;
* If not renewed within the grace period, the name becomes available for anyone to register.
* Managed namespace names do NOT expire (renewal-height = 0).

### Marketplace

BNSv2 has a native marketplace:

* `list-in-ustx(id, price, commission-trait)`, list a name for sale
* `unlist-in-ustx(id)`, remove listing
* `buy-in-ustx(id, commission-trait)`, purchase a listed name Commission is handled via the SIP-009 commission trait.&#x20;
* For managed namespaces, the manager contract must wrap these functions.

### Setting a primary name

* `set-primary-name(id)` on BNS-V2 lets an owner designate one of their names as their primary identity.&#x20;
* This is what wallets and apps use for display.&#x20;
* Only one primary name per address.
