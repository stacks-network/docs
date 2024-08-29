# BNS

The Bitcoin Name System (BNS) is implemented as a smart contract using Clarity.

Below is a list of public and read-only functions as well as error codes that can be returned by those methods:

* Public functions
* Read-only functions
* Error codes

### Public functions

#### name-import

**Input: `(buff 20), (buff 48), principal, (buff 20)`**

**Output: `(response bool int)`**

**Signature: `(name-import namespace name beneficiary zonefile-hash)`**

**Description:**

Imports name to a revealed namespace. Each imported name is given both an owner and some off-chain state.

#### name-preorder

**Input: `(buff 20), uint`**

**Output: `(response uint int)`**

**Signature: `(name-preorder hashed-salted-fqn stx-to-burn)`**

**Description:**

Preorders a name by telling all BNS nodes the salted hash of the BNS name. It pays the registration fee to the namespace owner's designated address.

#### name-register

**Input: `(buff 20), (buff 48), (buff 20), (buff 20)`**

**Output: `(response bool int)`**

**Signature: `(name-register namespace name salt zonefile-hash)`**

**Description:**

Reveals the salt and the name to all BNS nodes, and assigns the name an initial public key hash and zone file hash.

#### name-renewal

**Input: `(buff 20), (buff 48), uint, (optional principal), (optional (buff 20))`**

**Output: `(response bool int)`**

**Signature: `(name-renewal namespace name stx-to-burn new-owner zonefile-hash)`**

**Description:**

Depending in the namespace rules, a name can expire. For example, names in the .id namespace expire after 2 years. You need to send a name renewal every so often to keep your name.

You will pay the registration cost of your name to the namespace's designated burn address when you renew it. When a name expires, it enters a "grace period". The period is set to 5000 blocks (a month) but can be configured for each namespace.

It will stop resolving in the grace period, and all of the above operations will cease to be honored by the BNS consensus rules. You may, however, send a NAME\_RENEWAL during this grace period to preserve your name. After the grace period, everybody can register that name again. If your name is in a namespace where names do not expire, then you never need to use this transaction.

#### name-revoke

**Input: `(buff 20), (buff 48)`**

**Output: `(response bool int)`**

**Signature: `(name-revoke namespace name)`**

**Description:**

Makes a name unresolvable. The BNS consensus rules stipulate that once a name is revoked, no one can change its public key hash or its zone file hash. The name's zone file hash is set to null to prevent it from resolving. You should only do this if your private key is compromised, or if you want to render your name unusable for whatever reason.

#### name-transfer

**Input: `(buff 20), (buff 48), principal, (optional (buff 20))`**

**Output: `(response bool int)`**

**Signature: `(name-transfer namespace name new-owner zonefile-hash)`**

**Description:**

Changes the name's public key hash. You would send a name transfer transaction if you wanted to:

* Change your private key
* Send the name to someone else or
* Update your zone file

When transferring a name, you have the option to also clear the name's zone file hash (i.e. set it to null). This is useful for when you send the name to someone else, so the recipient's name does not resolve to your zone file.

#### name-update

**Input: `(buff 20), (buff 48), (buff 20)`**

**Output: `(response bool int)`**

**Signature: `(name-update namespace name zonefile-hash)`**

**Description:**

Changes the name's zone file hash. You would send a name update transaction if you wanted to change the name's zone file contents. For example, you would do this if you want to deploy your own Gaia hub and want other people to read from it.

#### namespace-preorder

**Input: `(buff 20), uint`**

**Output: `(response uint int)`**

**Signature: `(namespace-preorder hashed-salted-namespace stx-to-burn)`**

**Description:**

Registers the salted hash of the namespace with BNS nodes, and burns the requisite amount of cryptocurrency. Additionally, this step proves to the BNS nodes that user has honored the BNS consensus rules by including a recent consensus hash in the transaction. Returns pre-order's expiration date (in blocks).

#### namespace-ready

**Input: `(buff 20)`**

**Output: `(response bool int)`**

**Signature: `(namespace-ready namespace)`**

**Description:**

Launches the namespace and makes it available to the public. Once a namespace is launched, anyone can register a name in it if they pay the appropriate amount of cryptocurrency.

#### namespace-reveal

**Input: `(buff 20), (buff 20), uint, uint, uint, uint, uint, uint, uint, uint, uint, uint, uint, uint, uint, uint, uint, uint, uint, uint, uint, uint, uint, principal`**

**Output: `(response bool int)`**

**Signature: `(namespace-reveal namespace namespace-salt p-func-base p-func-coeff p-func-b1 p-func-b2 p-func-b3 p-func-b4 p-func-b5 p-func-b6 p-func-b7 p-func-b8 p-func-b9 p-func-b10 p-func-b11 p-func-b12 p-func-b13 p-func-b14 p-func-b15 p-func-b16 p-func-non-alpha-discount p-func-no-vowel-discount lifetime namespace-import)`**

**Description:**

Reveals the salt and the namespace ID (after a namespace preorder). It reveals how long names last in this namespace before they expire or must be renewed, and it sets a price function for the namespace that determines how cheap or expensive names its will be.All of the parameters prefixed by `p` make up the `price function`. These parameters govern the pricing and lifetime of names in the namespace.

The rules for a namespace are as follows:

* a name can fall into one of 16 buckets, measured by length. Bucket 16 incorporates all names at least 16 characters long.
* the pricing structure applies a multiplicative penalty for having numeric characters, or punctuation characters.
* the price of a name in a bucket is `((coeff) * (base) ^ (bucket exponent)) / ((numeric discount multiplier) * (punctuation discount multiplier))`

Example:

* base = 10
* coeff = 2
* nonalpha discount: 10
* no-vowel discount: 10
* buckets 1, 2: 9
* buckets 3, 4, 5, 6: 8
* buckets 7, 8, 9, 10, 11, 12, 13, 14: 7
* buckets 15, 16+:

### Read-only functions

#### can-name-be-registered

**Input: `(buff 20), (buff 48)`**

**Output: `(response bool int)`**

**Signature: `(can-name-be-registered namespace name)`**

**Description:**

Returns true if the provided name can be registered.

#### can-namespace-be-registered

**Input: `(buff 20)`**

**Output: `(response bool UnknownType)`**

**Signature: `(can-namespace-be-registered namespace)`**

**Description:**

Returns true if the provided namespace is available.

#### can-receive-name

**Input: `principal`**

**Output: `(response bool int)`**

**Signature: `(can-receive-name owner)`**

**Description:**

Returns true if the provided name can be received. That is, if it is not currently owned, a previous lease is expired, and the name wasn't revoked.

#### get-name-price

**Input: `(buff 20), (buff 48)`**

**Output: `(response uint int)`**

**Signature: `(get-name-price namespace name)`**

**Description:**

Gets the price for a name.

#### get-namespace-price

**Input: `(buff 20)`**

**Output: `(response uint int)`**

**Signature: `(get-namespace-price namespace)`**

**Description:**

Gets the price for a namespace.

#### get-namespace-properties

**Input: `(buff 20)`**

**Output: `(response (tuple (namespace (buff 20)) (properties (tuple (can-update-price-function bool) (launched-at (optional uint)) (lifetime uint) (namespace-import principal) (price-function (tuple (base uint) (buckets (list 16 uint)) (coeff uint) (no-vowel-discount uint) (nonalpha-discount uint))) (revealed-at uint)))) int)`**

**Signature: `(get-namespace-properties namespace)`**

**Description:**

Get namespace properties.

#### is-name-lease-expired

**Input: `(buff 20), (buff 48)`**

**Output: `(response bool int)`**

**Signature: `(is-name-lease-expired namespace name)`**

**Description:**

Return true if the provided name lease is expired.

#### name-resolve

**Input: `(buff 20), (buff 48)`**

**Output: `(response (tuple (lease-ending-at (optional uint)) (lease-started-at uint) (owner principal) (zonefile-hash (buff 20))) int)`**

**Signature: `(name-resolve namespace name)`**

**Description:**

Get name registration details.

#### resolve-principal

**Input: `principal`**

**Output: `(response (tuple (name (buff 48)) (namespace (buff 20))) (tuple (code int) (name (optional (tuple (name (buff 48)) (namespace (buff 20)))))))`**

**Signature: `(resolve-principal owner)`**

**Description:**

Returns the registered name that a principal owns if there is one. A principal can only own one name at a time.

### Error codes

#### ERR\_INSUFFICIENT\_FUNDS

**type: `int`**

**value: `4001`**

#### ERR\_NAMESPACE\_ALREADY\_EXISTS

**type: `int`**

**value: `1006`**

#### ERR\_NAMESPACE\_ALREADY\_LAUNCHED

**type: `int`**

**value: `1014`**

#### ERR\_NAMESPACE\_BLANK

**type: `int`**

**value: `1013`**

#### ERR\_NAMESPACE\_CHARSET\_INVALID

**type: `int`**

**value: `1016`**

#### ERR\_NAMESPACE\_HASH\_MALFORMED

**type: `int`**

**value: `1015`**

#### ERR\_NAMESPACE\_NOT\_FOUND

**type: `int`**

**value: `1005`**

#### ERR\_NAMESPACE\_NOT\_LAUNCHED

**type: `int`**

**value: `1007`**

#### ERR\_NAMESPACE\_OPERATION\_UNAUTHORIZED

**type: `int`**

**value: `1011`**

#### ERR\_NAMESPACE\_PREORDER\_ALREADY\_EXISTS

**type: `int`**

**value: `1003`**

#### ERR\_NAMESPACE\_PREORDER\_CLAIMABILITY\_EXPIRED

**type: `int`**

**value: `1009`**

#### ERR\_NAMESPACE\_PREORDER\_EXPIRED

**type: `int`**

**value: `1002`**

#### ERR\_NAMESPACE\_PREORDER\_LAUNCHABILITY\_EXPIRED

**type: `int`**

**value: `1010`**

#### ERR\_NAMESPACE\_PREORDER\_NOT\_FOUND

**type: `int`**

**value: `1001`**

#### ERR\_NAMESPACE\_PRICE\_FUNCTION\_INVALID

**type: `int`**

**value: `1008`**

#### ERR\_NAMESPACE\_STX\_BURNT\_INSUFFICIENT

**type: `int`**

**value: `1012`**

#### ERR\_NAMESPACE\_UNAVAILABLE

**type: `int`**

**value: `1004`**

#### ERR\_NAME\_ALREADY\_CLAIMED

**type: `int`**

**value: `2011`**

#### ERR\_NAME\_BLANK

**type: `int`**

**value: `2010`**

#### ERR\_NAME\_CHARSET\_INVALID

**type: `int`**

**value: `2022`**

#### ERR\_NAME\_CLAIMABILITY\_EXPIRED

**type: `int`**

**value: `2012`**

#### ERR\_NAME\_COULD\_NOT\_BE\_MINTED

**type: `int`**

**value: `2020`**

#### ERR\_NAME\_COULD\_NOT\_BE\_TRANSFERRED

**type: `int`**

**value: `2021`**

#### ERR\_NAME\_EXPIRED

**type: `int`**

**value: `2008`**

#### ERR\_NAME\_GRACE\_PERIOD

**type: `int`**

**value: `2009`**

#### ERR\_NAME\_HASH\_MALFORMED

**type: `int`**

**value: `2017`**

#### ERR\_NAME\_NOT\_FOUND

**type: `int`**

**value: `2013`**

#### ERR\_NAME\_NOT\_RESOLVABLE

**type: `int`**

**value: `2019`**

#### ERR\_NAME\_OPERATION\_UNAUTHORIZED

**type: `int`**

**value: `2006`**

#### ERR\_NAME\_PREORDERED\_BEFORE\_NAMESPACE\_LAUNCH

**type: `int`**

**value: `2018`**

#### ERR\_NAME\_PREORDER\_ALREADY\_EXISTS

**type: `int`**

**value: `2016`**

#### ERR\_NAME\_PREORDER\_EXPIRED

**type: `int`**

**value: `2002`**

#### ERR\_NAME\_PREORDER\_FUNDS\_INSUFFICIENT

**type: `int`**

**value: `2003`**

#### ERR\_NAME\_PREORDER\_NOT\_FOUND

**type: `int`**

**value: `2001`**

#### ERR\_NAME\_REVOKED

**type: `int`**

**value: `2014`**

#### ERR\_NAME\_STX\_BURNT\_INSUFFICIENT

**type: `int`**

**value: `2007`**

#### ERR\_NAME\_TRANSFER\_FAILED

**type: `int`**

**value: `2015`**

#### ERR\_NAME\_UNAVAILABLE

**type: `int`**

**value: `2004`**

#### ERR\_PANIC

**type: `int`**

**value: `0`**

#### ERR\_PRINCIPAL\_ALREADY\_ASSOCIATED

**type: `int`**

**value: `3001`**
