# Core Concepts

## **Namespaces**

Namespaces are the top-level domains in BNS (e.g., .btc, .id). They have the following lifecycle:

* **Preorder:** A salted hash of the namespace is submitted with a burn payment
* **Reveal:** The actual namespace is revealed, along with pricing information and all of the namespace properties

<details>

<summary>What happens during reveal?</summary>

During reveal, the creator sets: `lifetime` (how long names last before needing renewal, 0 means no renewal), `namespace-import` principal, and the full `price-function` (16 buckets, base, coefficient, nonalpha-discount, no-vowel-discount). These are critical parameters that define the namespace's behavior forever.

Namespace pricing can be updated (via `namespace-update-price`) and can be frozen permanently (via `namespace-freeze-price`). Once frozen, the price function can never be changed. These are important governance decisions.

Also, names can be imported before launch via `name-import`. This allows namespace creators to pre-populate names (e.g., for migration or reserved names) before opening registration to the public.

</details>

* **Launch:** The namespace becomes active, allowing name registrations

#### **Unmanaged vs Managed Namespaces**

BNS-V2 supports two types of namespaces: **Unmanaged** and **Managed**.

Unmanaged namespaces are open for anyone to register names within them, subject to the namespace’s pricing rules. These namespaces operate fully in a decentralized manner, with minimal restrictions on name registration and management.

Managed namespaces, on the other hand, introduce an additional layer of control and customization. These namespaces are overseen by a designated manager who has special privileges and responsibilities. Managed namespaces can implement custom rules for name registration, pricing, transfer and renewals. This allows for use cases such as creating namespaces for specific communities, implementing additional verification processes, or enforcing particular naming conventions.

The key differences between unmanaged and managed namespaces lie in their governance and flexibility. While unmanaged namespaces provide a more open and unrestricted environment, managed namespaces offer greater control and the ability to tailor the namespace to specific requirements or use cases.

#### Creating a Managed Namespace

Managed namespaces are one of the biggest updates in this version of BNSv2. Meant to allow for significant more control & flexibility over a namespace, a "managed" namespace is controlled by a single principal (almost always a _contract_ principal). For expected behavior, you must be very careful on setting up this contract principal - if it's not setup correctly, it's possible to to permanently lose control of the namespace.

A few important decisions to make when creating a managed namespace are:

* Will the manager contract _ever_ need to be changed?
* How will your mint process work?
* Can managers transfer _any_ name?
* Will you names be tradeable?
* Does your namespace require metadata?

These are critical decisions that one must consider to future-proof a managed namespace. For the first question, it's almost guaranteed that you _will_ need to update or remove the manager contract, therefore, it's imperative that the manager contract include access to the 'mng-manager-transfer' function. If the initial manager contract does not include this function, it will be impossible to update or remove the namespace to a new manager contract.

Managed namespaces do not require STX burns for name registration. The `mng-name-register` function sets `stx-burned: u0` on the preorder. Pricing is entirely handled by the manager contract (could be free, token-gated, STX-based via the manager's own logic, etc.). This is a fundamental difference from unmanaged namespaces.

Next, the mint process is vastly more customizable in a managed namespace. At a high-level, managed namespaces have access to the same two paths for name registration: 2 steps / mng-name-preorder + mng-name-register, or a single step / fast-claim. Managed contracts **must** have access to one or both of these functions to successfully mint names in a namespace; additionally, the mint process can be customized to a high degree to allow for: free mints, token-gated mints, variable pricing, sip-10 token support, etc...

Once minted, you must take special care to implement the three standard sip-09 market functions: list, unlist & buy. Managed namespaces _are not_ tradeable by default, they _must_ include wrapped calls into the list,unlist & buy functions in BNSv2 as those functions specifically check against 'contract-caller' (aka the managed contract).

Lastly, the ability to allow for the managed namespace contract _itself_ to transfer any name is a critical decision. It's almost guranteed that you **don't** want to allow this, as it would allow the contract to transfer any name to any principal; however, there are some use-cases where much more granular control is required.

Managed namespace names do not expire. The `mng-name-register` function sets `renewal-height: u0`, meaning there's no automatic renewal requirement. The manager controls the full lifecycle.

***

## **Names**

Names are the individual identifiers within a namespace (e.g., alice.btc). They have the following properties:

* Unique within their namespace
* Represented as NFTs
* Can be transferred and renewed
* Associated with a zonefile, which stores additional information related to the name in a separate `zonefile-resolver` contract

A BNS name has two components:

```
<name>.<namespace>
```

Example:

```
alice.id
```

* `alice` → the name
* `id` → the namespace

Namespaces define rules and pricing for name registrations.

***

## Ownership

Names are owned by a Stacks principal.

Ownership allows the holder to:

* Update records
* Set name as the primary name
* List the name for sale on the built-in marketplace
* Transfer the name
* Renew the name
* Configure resolution data

Ownership is enforced entirely by smart contract logic.

***

## Zonefiles

Each name can store structured records. The zonefile JSON supports: owner address, BTC address, bio, website, PFP, name, location, social links (X, Telegram, etc.), multi-chain addresses (BTC payment, BTC ordinal, ETH, etc.), arbitrary key-value metadata, and subdomain definitions.

These records may include:

* Address mappings
* Text metadata
* Application-specific data
* Profile information

Because BNSv2 is implemented in Clarity, other contracts can read name data directly on-chain.
