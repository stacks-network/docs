# buildSignerCalldata

Encodes a Bitcoin payout address and a maximum fee into the `signerCalldata` bytes that [buildStake](../build/buildstake.md), [buildStakeUpdate](../build/buildstakeupdate.md), [buildRegisterForBond](../build/buildregisterforbond.md) and [buildUpdateBondRegistration](../build/buildupdatebondregistration.md) pass to the signer-manager. Pure computation.

***

### Usage

```ts
import { buildSignerCalldata } from '@stacks/bitcoin-staking';

const signerCalldata = buildSignerCalldata({
  poxAddress: 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4',
  maxFeeSats: 1_000n,
  network: 'mainnet',
});
```

#### Notes

* The bytes are the Clarity serialization of `{ pox-addr: { version, hashbytes }, max-fee }`.
* pox-5 does not read them. It forwards them to the signer-manager's `validate-stake!` as an `(optional (buff 500))` ([pox-5.clar L392-L427](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L392-L427)), so what they do depends on the signer-manager. The SDK documents this format as an election of an L1 BTC payout to `poxAddress`; omitting `signerCalldata` keeps the sBTC payout.
* pox-5 does not validate the address, so a wrong but well-formed address is accepted on-chain. Decode the bytes with [parseSignerCalldata](parsesignercalldata.md) to check them before you build.
* A string `poxAddress` must be a P2PKH, P2SH, P2WPKH, P2WSH or P2TR address, or the function throws. With `network`, an address from another network throws, for example a `bc1` address with `network: 'testnet'`. Without `network`, any network's address is accepted.
* A [BtcAddressRepr](../btcaddress/btcaddressrepr.md) `poxAddress` must have a known version and the matching `data` length, or the function throws.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/signer.ts#L106-L140)

***

### Signature

```ts
function buildSignerCalldata(opts: SignerCalldataL1Payout): Uint8Array;
```

`opts` is a [SignerCalldataL1Payout](../types/signercalldatal1payout.md).

***

### Returns

`Uint8Array`

The serialized Clarity tuple.

***

### Parameters

#### opts.poxAddress (required)

* **Type**: `string | BtcAddressRepr`

Bitcoin address to pay rewards to, as an address string or a parsed [BtcAddressRepr](../btcaddress/btcaddressrepr.md).

#### opts.maxFeeSats (required)

* **Type**: `IntegerType`

Largest sBTC fee, in sats, the staker accepts on the L1 BTC withdrawal.

#### opts.network (optional)

* **Type**: `StacksNetworkName | StacksNetwork`

When `poxAddress` is a string, the network it must belong to. Omit it to accept any network's address.
