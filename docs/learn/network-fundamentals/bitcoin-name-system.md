# Bitcoin Name System

<div data-with-frame="true"><figure><img src="../.gitbook/assets/image (20).png" alt=""><figcaption></figcaption></figure></div>

Bitcoin Name System (BNS) is a network system that binds Stacks usernames to off-chain state without relying on any central points of control.

The Stacks V1 blockchain implemented BNS through first-order name operations. In Stacks V2, BNS is instead implemented through a smart-contract loaded during the genesis block.

Names in BNS have three properties:

* **Names are globally unique.** The protocol does not allow name collisions, and all well-behaved nodes resolve a given name to the same state.
* **Names are human-meaningful.** Each name is chosen by its creator.
* **Names are strongly owned.** Only the name's owner can change the state it resolves to. Specifically, a name is owned by one or more ECDSA private keys.

The Stacks blockchain ensures that each node's BNS view is synchronized to all of the other nodes in the world, so queries on one node will be the same on other nodes. Stacks blockchain nodes allow a name's owner to bind up to 40Kb of off-chain state to their name, which will be replicated to all other Stacks blockchain nodes via a P2P network.

The biggest consequence for developers is that in BNS, reading name state is fast and cheap but writing name state is slow and expensive. This is because registering and modifying names requires one or more transactions to be sent to the underlying blockchain, and BNS nodes will not process them until they are sufficiently confirmed. Users and developers need to acquire and spend the requisite cryptocurrency (STX) to send BNS transactions.

### Motivation behind name systems

We rely on name systems in everyday life, and they play a critical role in many different applications. For example, when you look up a friend on social media, you are using the platform's name system to resolve their name to their profile. When you look up a website, you are using the Domain Name Service to resolve the hostname to its host's IP address. When you check out a Git branch, you are using your Git client to resolve the branch name to a commit hash. When you look up someone's PGP key on a keyserver, you are resolving their key ID to their public key.

What kinds of things do we want to be true about names? In BNS, names are globally unique, names are human-meaningful, and names are strongly owned. However, if you look at these examples, you'll see that each of them only guarantees two of these properties. This limits how useful they can be.

* In DNS and social media, names are globally unique and human-readable, but not strongly owned. The system operator has the final say as to what each name resolves to.
  * Problem: Clients must trust the system to make the right choice in what a given name resolves to. This includes trusting that no one but the system administrators can make these changes.
* In Git, branch names are human-meaningful and strongly owned, but not globally unique. Two different Git nodes may resolve the same branch name to different unrelated repository states.
  * Problem: Since names can refer to conflicting state, developers have to figure out some other mechanism to resolve ambiguities.
* In PGP, names are key IDs. They are globally unique and cryptographically owned, but not human-readable. PGP key IDs are derived from the keys they reference.
  * Problem: These names are difficult for most users to remember since they do not carry semantic information relating to their use in the system.

BNS names have all three properties, and none of these problems. This makes it a powerful tool for building all kinds of network applications. With BNS, we can do the following and more:

* Build domain name services where hostnames can't be hijacked.
* Build social media platforms where user names can't be stolen by phishers.
* Build version control systems where repository branches do not conflict.
* Build public-key infrastructure where it's easy for users to discover and remember each other's keys.

### Organization of BNS

BNS names are organized into a global name hierarchy. There are three different layers in this hierarchy related to naming:

* **Namespaces.** These are the top-level names in the hierarchy. An analogy to BNS namespaces are DNS top-level domains. Existing BNS namespaces include `.id`, `.podcast`, and `.helloworld`. All other names belong to exactly one namespace. Anyone can create a namespace, but in order for the namespace to be persisted, it must be _launched_ so that anyone can register names in it. Namespaces are not owned by their creators.
* **BNS names.** These are names whose records are stored directly on the blockchain. The ownership and state of these names are controlled by sending blockchain transactions. Example names include `verified.podcast` and `muneeb.id`. Anyone can create a BNS name, as long as the namespace that contains it exists already.
* **BNS subdomains.** These are names whose records are stored off-chain, but are collectively anchored to the blockchain. The ownership and state for these names lives within the P2P network data. While BNS subdomains are owned by separate private keys, a BNS name owner must broadcast their subdomain state. Example subdomains include `jude.personal.id` and `podsaveamerica.verified.podcast`. Unlike BNS namespaces and names, the state of BNS subdomains is _not_ part of the blockchain consensus rules.

A feature comparison matrix summarizing the similarities and differences between these name objects:

| Feature                                | **Namespaces** | **BNS names** | **BNS Subdomains** |
| -------------------------------------- | -------------- | ------------- | ------------------ |
| Globally unique                        | X              | X             | X                  |
| Human-meaningful                       | X              | X             | X                  |
| Owned by a private key                 |                | X             | X                  |
| Anyone can create                      | X              | X             | \[1]               |
| Owner can update                       |                | X             | \[1]               |
| State hosted on-chain                  | X              | X             |                    |
| State hosted off-chain                 |                | X             | X                  |
| Behavior controlled by consensus rules | X              | X             |                    |
| May have an expiration date            |                | X             |                    |

\[1] Requires the cooperation of a BNS name owner to broadcast its transactions

### Namespaces

Namespaces are the top-level name objects in BNS. They control a few properties about the names within them:

* How expensive they are to register
* How long they last before they have to be renewed
* Who (if anyone) receives the name registration fees
* Who is allowed to seed the namespace with its initial names

At the time of this writing, by far the largest BNS namespace is the `.id` namespace. Names in the `.id` namespace are meant for resolving user identities. Short names in `.id` are more expensive than long names, and have to be renewed by their owners every two years. Name registration fees are not paid to anyone in particular—they are instead sent to a "black hole" where they are rendered non-spendable (the intention is to discourage ID squatters).

Unlike DNS, anyone can create a namespace and set its properties. Namespaces are created on a first-come first-serve basis, and once created, they last forever.

However, creating a namespace is not free. The namespace creator must burn cryptocurrency to do so. The shorter the namespace, the more cryptocurrency must be burned (that is, short namespaces are more valuable than long namespaces). For example, it cost Blockstack PBC 40 BTC to create the `.id` namespace in 2015 (in transaction `5f00b8e609821edd6f3369ee4ee86e03ea34b890e242236cdb66ef6c9c6a1b281`).

Namespaces can be between 1 and 19 characters long, and are composed of the characters `a-z`, `0-9`, `-`, and `_`.

### Subdomains

BNS names are strongly owned because the owner of its private key can generate valid transactions that update its zone file hash and owner. However, this comes at the cost of requiring a name owner to pay for the underlying transaction in the blockchain. Moreover, this approach limits the rate of BNS name registrations and operations to the underlying blockchain's transaction bandwidth.

BNS overcomes this with subdomains. A **BNS subdomain** is a type of BNS name whose state and owner are stored outside of the blockchain, but whose existence and operation history are anchored to the blockchain. Like their on-chain counterparts, subdomains are globally unique, strongly owned, and human-readable. BNS gives them their own name state and public keys. Unlike on-chain names, subdomains can be created and managed cheaply, because they are broadcast to the BNS network in batches. A single blockchain transaction can send up to 120 subdomain operations.

This is achieved by storing subdomain records in the BNS name zone files. An on-chain name owner broadcasts subdomain operations by encoding them as `TXT` records within a DNS zone file. To broadcast the zone file, the name owner sets the new zone file hash with a `NAME_UPDATE` transaction and replicates the zone file. This, in turn, replicates all subdomain operations it contains, and anchors the set of subdomain operations to an on-chain transaction. The BNS node's consensus rules ensure that only valid subdomain operations from valid `NAME_UPDATE` transactions will ever be stored.

For example, the name `verified.podcast` once wrote the zone file hash `247121450ca0e9af45e85a82e61cd525cd7ba023`, which is the hash of the following zone file:

```bash
$TTL 3600
1yeardaily TXT "owner=1MwPD6dH4fE3gQ9mCov81L1DEQWT7E85qH" "seqn=0" "parts=1" "zf0=JE9SSUdJTiAxeWVhcmRhaWx5CiRUVEwgMzYwMApfaHR0cC5fdGNwIFVSSSAxMCAxICJodHRwczovL3BoLmRvdHBvZGNhc3QuY28vMXllYXJkYWlseS9oZWFkLmpzb24iCg=="
2dopequeens TXT "owner=1MwPD6dH4fE3gQ9mCov81L1DEQWT7E85qH" "seqn=0" "parts=1" "zf0=JE9SSUdJTiAyZG9wZXF1ZWVucwokVFRMIDM2MDAKX2h0dHAuX3RjcCBVUkkgMTAgMSAiaHR0cHM6Ly9waC5kb3Rwb2RjYXN0LmNvLzJkb3BlcXVlZW5zL2hlYWQuanNvbiIK"
10happier TXT "owner=1MwPD6dH4fE3gQ9mCov81L1DEQWT7E85qH" "seqn=0" "parts=1" "zf0=JE9SSUdJTiAxMGhhcHBpZXIKJFRUTCAzNjAwCl9odHRwLl90Y3AgVVJJIDEwIDEgImh0dHBzOi8vcGguZG90cG9kY2FzdC5jby8xMGhhcHBpZXIvaGVhZC5qc29uIgo="
31thoughts TXT "owner=1MwPD6dH4fE3gQ9mCov81L1DEQWT7E85qH" "seqn=0" "parts=1" "zf0=JE9SSUdJTiAzMXRob3VnaHRzCiRUVEwgMzYwMApfaHR0cC5fdGNwIFVSSSAxMCAxICJodHRwczovL3BoLmRvdHBvZGNhc3QuY28vMzF0aG91Z2h0cy9oZWFkLmpzb24iCg=="
359 TXT "owner=1MwPD6dH4fE3gQ9mCov81L1DEQWT7E85qH" "seqn=0" "parts=1" "zf0=JE9SSUdJTiAzNTkKJFRUTCAzNjAwCl9odHRwLl90Y3AgVVJJIDEwIDEgImh0dHBzOi8vcGguZG90cG9kY2FzdC5jby8zNTkvaGVhZC5qc29uIgo="
30for30 TXT "owner=1MwPD6dH4fE3gQ9mCov81L1DEQWT7E85qH" "seqn=0" "parts=1" "zf0=JE9SSUdJTiAzMGZvcjMwCiRUVEwgMzYwMApfaHR0cC5fdGNwIFVSSSAxMCAxICJodHRwczovL3BoLmRvdHBvZGNhc3QuY28vMzBmb3IzMC9oZWFkLmpzb24iCg=="
onea TXT "owner=1MwPD6dH4fE3gQ9mCov81L1DEQWT7E85qH" "seqn=0" "parts=1" "zf0=JE9SSUdJTiBvbmVhCiRUVEwgMzYwMApfaHR0cC5fdGNwIFVSSSAxMCAxICJodHRwczovL3BoLmRvdHBvZGNhc3QuY28vb25lYS9oZWFkLmpzb24iCg=="
10minuteteacher TXT "owner=1MwPD6dH4fE3gQ9mCov81L1DEQWT7E85qH" "seqn=0" "parts=1" "zf0=JE9SSUdJTiAxMG1pbnV0ZXRlYWNoZXIKJFRUTCAzNjAwCl9odHRwLl90Y3AgVVJJIDEwIDEgImh0dHBzOi8vcGguZG90cG9kY2FzdC5jby8xMG1pbnV0ZXRlYWNoZXIvaGVhZC5qc29uIgo="
36questionsthepodcastmusical TXT "owner=1MwPD6dH4fE3gQ9mCov81L1DEQWT7E85qH" "seqn=0" "parts=1" "zf0=JE9SSUdJTiAzNnF1ZXN0aW9uc3RoZXBvZGNhc3RtdXNpY2FsCiRUVEwgMzYwMApfaHR0cC5fdGNwIFVSSSAxMCAxICJodHRwczovL3BoLmRvdHBvZGNhc3QuY28vMzZxdWVzdGlvbnN0aGVwb2RjYXN0bXVzaWNhbC9oZWFkLmpzb24iCg=="
_http._tcp URI 10 1 "https://dotpodcast.co/"
```

Each `TXT` record in this zone file encodes a subdomain-creation. For example, `1yeardaily.verified.podcast` resolves to:

```json
{
  "address": "1MwPD6dH4fE3gQ9mCov81L1DEQWT7E85qH",
  "blockchain": "bitcoin",
  "last_txid": "d87a22ebab3455b7399bfef8a41791935f94bc97aee55967edd5a87f22cce339",
  "status": "registered_subdomain",
  "zonefile_hash": "e7acc97fd42c48ed94fd4d41f674eddbee5557e3",
  "zonefile_txt": "$ORIGIN 1yeardaily\n$TTL 3600\n_http._tcp URI 10 1 \"https://ph.dotpodcast.co/1yeardaily/head.json\"\n"
}
```

This information was extracted from the `1yeardaily` `TXT` resource record in the zone file for `verified.podcast`.

Subdomain lifecycle

{% stepper %}
{% step %}
**Creation**

A subdomain-creation operation is created by the subdomain owner and encoded into a `TXT` record in an on-chain name owner's zone file. The on-chain name owner broadcasts the zone file by issuing a `NAME_UPDATE` transaction, which anchors the subdomain-creation on-chain.
{% endstep %}

{% step %}
**Update**

Subdomain updates are done off-chain by creating signed operations from the subdomain owner's private key. Any on-chain name owner can include these signed operations in their zone file and broadcast via `NAME_UPDATE`. Operations are ordered by a sequence number and require a valid signature that links to the previous operation's public key.
{% endstep %}

{% step %}
**Transfer**

To change the address (public key hash) owning a subdomain, the subdomain owner signs a subdomain-transfer operation and asks an on-chain name owner (typically the one who created the subdomain) to broadcast it via `NAME_UPDATE`. The broadcasting on-chain name owner's zone file must be present in the Atlas network to prove absence of conflicting operations.
{% endstep %}
{% endstepper %}

Sequence and validation rules

* Subdomain operations are ordered by sequence number, starting at 0. Each new operation must include:
  * The next sequence number
  * The public key that hashes to the previous subdomain transaction's address
  * A signature from the corresponding private key over the entire subdomain operation
* If two correctly signed but conflicting operations have the same sequence number, the one earlier in blockchain history is accepted. Invalid operations are ignored.

Subdomain creation and management rules

* A subdomain-creation transaction can only be processed by the owner of the on-chain name that shares its suffix (e.g., only the owner of `res_publica.id` can broadcast creations for `*.res_publica.id`).
* A subdomain-transfer transaction can only be broadcast by the owner of the on-chain name that created it.
* To send a subdomain-creation or subdomain-transfer, all of an on-chain name owner's zone files must be present in the Atlas network. This allows proving the absence of conflicting operations.
* A subdomain update can be broadcast by any on-chain name owner, but the subdomain owner needs to find a cooperating on-chain name owner to include and broadcast it.

To create a subdomain, the subdomain owner generates the creation operation and gives it to the on-chain name owner. Once created, the subdomain owner can use any on-chain name owner to broadcast updates by providing signed operations packaged into zone files.

Subdomain registrars

Because subdomain names are cheap, developers may run subdomain registrars for their applications. For example, the name `personal.id` is used to register usernames without requiring users to spend Bitcoin.

A reference implementation is available: https://github.com/stacks-network/subdomain-registrar. Users still own their subdomain names; the registrar helps developers broadcast subdomain operations.

### BNS and DID Standards

BNS names are compliant with the emerging Decentralized Identity Foundation (DIF) protocol specification for decentralized identifiers (DIDs): http://identity.foundation

Each name in BNS has an associated DID. The DID format for BNS is:

```bash
did:stack:v0:{address}-{index}
```

Where:

* `{address}` is an on-chain public key hash (for example a Bitcoin address).
* `{index}` refers to the `nth` name this address created.

Examples:

* `personal.id` → `did:stack:v0:1dARRtzHPAFRNE7Yup2Md9w18XEQAtLiV-0` (first name created by that address)
* `jude.id` → `did:stack:v0:16EMaNw3pkn3v6f2BgnSSs53zAKH4Q8YJg-1` (the address had created one earlier name before this one)

Purpose: a DID provides an eternal identifier for a public key. The public key may change, but the DID will not.

For a DID to be resolvable, all of the following must be true for a name:

* The name must exist
* The name's zone file hash must be the hash of a well-formed DNS zone file
* The DNS zone file must be present in the Stacks node's data
* The DNS zone file must contain a `URI` resource record that points to a signed JSON Web Token
* The public key that signed the JSON Web Token (and is included with it) must hash to the address that owns the name

Not all names will have DIDs that resolve to public keys. Names created by standard tooling will have DIDs that do.

A RESTful API is under development.

### DID Encoding for Subdomains

Every name and subdomain in BNS has a DID. Encoding differs so software can determine which code-path to take.

* For on-chain BNS names, the `{address}` is the same as the Bitcoin address that owns the name. Currently, both version byte 0 and version byte 5 addresses are supported (addresses starting with `1` or `3`, meaning `p2pkh` and `p2sh` addresses).
* For off-chain BNS subdomains, the `{address}` has version byte 63 for subdomains owned by a single private key, and version byte 50 for subdomains owned by an m-of-n set of private keys. That is, subdomain DID addresses start with `S` or `M`, respectively.

The `{index}` field for a subdomain's DID is distinct from the `{index}` field for a BNS name's DID, even if the same address created both names and subdomains. Example:

* The name `abcdefgh123456.id` → `did:stack:v0:16EMaNw3pkn3v6f2BgnSSs53zAKH4Q8YJg-0` (first name created by that address)
* The subdomain `jude.statism.id` created by the same address → `did:stack:v0:SSXMcDiCZ7yFSQSUj7mWzmDcdwYhq97p2i-0`

Note: The address `SSXMcDiCZ7yFSQSUj7mWzmDcdwYhq97p2i` encodes the same public key hash as `16EMaNw3pkn3v6f2BgnSSs53zAKH4Q8YJg`—the difference is base58check version byte (63 vs 0).
