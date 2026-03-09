# How BNSv2 Works

## Architecture Overview

BNSv2 is implemented amongst two Clarity contracts: `.BNS-V2` and `.zonefile-resolver` . These two Clarity contracts collectively manage:

1. Namespace registration and management
2. Name registration (preorder/reveal and fast-claim)
3. Record storage (via zonefile-resolver)
4. Ownership transfers
5. Renewals
6. Marketplace (list, unlist, buy)
7. Primary name designation

All state lives on-chain and is publicly verifiable.

<table><thead><tr><th width="162.8984375"></th><th>Mainnet</th><th>Testnet</th></tr></thead><tbody><tr><td>BNSv2</td><td><code>SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2</code></td><td><code>ST2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D9SZJQ0M.BNS-V2</code></td></tr><tr><td>Zonefile Resolver</td><td><code>SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.zonefile-resolver</code></td><td><code>ST2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D9SZJQ0M.zonefile-resolver</code></td></tr></tbody></table>

#### Resolution of names

Resolution works as follows:

1. A user queries the zonefile-resolver contract with a name and namespace
2. The resolver checks the name is valid, not revoked, and within its renewal period (cross-contract call to BNS-V2)
3. Returns the zonefile data (owner, zonefile buffer, revoked status)
4. Applications parse the zonefile JSON to extract addresses, profiles, etc.

For name ownership/properties (without zonefile data), you query the BNS-V2 contract directly. There are no centralized DNS servers or off-chain dependencies required for correctness.

{% hint style="info" %}
BNSv2 discontinued V1-style off-chain subdomains (Atlas network / TXT records) and DID compliance. Subdomains are now defined within a name's zonefile, stored on-chain. For legacy documentation on BNSv1, navigate [here](https://docs.stacks.co/learn/network-fundamentals/bitcoin-name-system).
{% endhint %}

***

## Zonefiles

Zonefiles also look significantly different in this upgrade.

Previously, BNS zonefiles are built on top of the “atlas” network. Atlas is a protocol built in to Stacks node’s software for replication and distribution of zonefiles. In BNSv1, BNS apps and APIs only recognized zonefiles that are part of the Atlas network.

The `zonefile-resolver` contract stores a `(optional (buff 8192))`. The contract itself has no IPFS-specific logic. It stores raw bytes — which at the application layer could be a full JSON zonefile or a CID/URL pointing to external storage.

Overall, this architecture delivers a flexible and scalable solution, combining the security and immediacy of on-chain storage with the extensibility and efficiency of decentralized off-chain storage.

These changes can summarized in two ways:

1. Zonesfiles, or links to zonefiles, now live on-chain
2. Zonefiles are now decoupled from the BNS-V2 contract. Zonefiles now live-onchain & in their own contract: `.zonefile-resolver`. This contract is fairly limited with a single map & only three functions: `resolve-name`, `update-zonefile` & `revoke-name`.

Under this design, a dedicated smart contract is responsible for managing all zonefile-related functionality. The contract supports storing zonefiles of up to 8,192 bytes (8 KB) directly on-chain, associating the zonefile deterministically with its corresponding name and namespace. This ensures that smaller zonefiles are immediately available, tamper-resistant, and secured by the underlying blockchain guarantees.

{% code title="Data map for a name’s zonefile information" %}
```clarity
;; zonefile map: Stores zonefile information for each name in a namespace
;; Key: {name: (buff 48), namespace: (buff 20)}
;; Value: {owner: principal, zonefile: (optional (buff 8192)), revoked: bool}
(define-map zonefile {name: (buff 48), namespace: (buff 20)} 
    {
        owner: principal,
        zonefile: (optional (buff 8192)),
        revoked: bool
    }
)
```
{% endcode %}

Zonefiles are technically stored as a hex-encoded UTF-8 JSON. The maximum length if defined in the contract to be 8,192 bytes (8 KB). The following JSON schema is the standard format used by BNSv2 applications and the official API. The contract itself stores raw bytes and does not enforce this structure.

{% code title="Zonefile structure" expandable="true" %}
```json
{
	"owner": "SP...",
	"btc": "bc1...",
	"bio": "User bio...",
	"website": "www.url.com",
	"pfp": "www.mypfp.com/image.png", // must be a valid image format (e.g. .png, .jpg, .svg)
	"name": "User Name",
	"location": "City, Country",
	"social": [
		{
			"platform": "x", 
			"username": "username"
		},
		{
			"platform": "telegram", 
			"username": "username"
		}
		// ...
	],
	"addresses": [
		{
			"network": "btc",
			"address": "bc1...",
			"type": "payment"
		},
		{
			"network": "btc",
			"address": "bc1...",
			"type": "ordinal"
		},
		{
			"network": "eth",
			"address": "0x123...",
			"type": "wallet"
		}
		// ...
	],
	"meta": [
		{
			"name": "example",
			"value": "custom datas"
		}
		// ...
	],
	"subdomains": [
		{
			"test": {
				"owner": "SP....",
				"bio": "Subdomain bio..",
				"website": "www.url.com",
				"pfp": "www.mypfp.com/image.png",
				"name": "User Name",
				"location": "City, Country",
				"social": [
					{
						"platform": "x",
						"username": "@username"
					}
				],
				"addresses": [
					{
						"network": "Bitcoin",
						"address": "bc1...",
						"type": "payment"
					}
				]
			}
		}
		// ...
	],
	"externalSubdomainsFile": "www.url.com/subdomains.json" // optional: external file containing subdomain definitions
}
```
{% endcode %}

The API layer abstracts the resolution logic, automatically determining whether to retrieve the zonefile data directly from the contract or via IPFS using the stored CID. As a result, clients can resolve zonefile information for any given name and namespace through a consistent interface without needing to manage storage distinctions manually.

Check out the [BNSv2 SDK](https://github.com/Strata-Labs/bns-v2-sdk) for more info on zonefiles.
