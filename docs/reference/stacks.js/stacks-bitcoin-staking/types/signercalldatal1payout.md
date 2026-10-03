# SignerCalldataL1Payout

An election to receive rewards as native BTC at a Bitcoin address instead of the sBTC default. [buildSignerCalldata](../signer/buildsignercalldata.md) encodes it into the `signerCalldata` bytes that [buildStake](../build/buildstake.md), [buildStakeUpdate](../build/buildstakeupdate.md), [buildRegisterForBond](../build/buildregisterforbond.md) and [buildUpdateBondRegistration](../build/buildupdatebondregistration.md) accept, and [parseSignerCalldata](../signer/parsesignercalldata.md) decodes it.

***

### Usage

```ts
import { buildSignerCalldata, buildStake } from '@stacks/bitcoin-staking';

const signerCalldata = buildSignerCalldata({
  poxAddress: 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4',
  maxFeeSats: 1_000n,
  network: 'mainnet', // rejects a testnet address
});

const tx = await buildStake({ ...stakeArgs, signerCalldata });
```

#### Notes

* pox-5 does not read the calldata. It forwards it, as `(optional (buff 500))`, to the signer-manager's `validate-stake!` ([`signer-manager-validate-stake`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L408-L427)). Whether and how the payout is honored depends on the signer-manager contract.
* The encoded blob is the Clarity tuple `{ pox-addr: { version, hashbytes }, max-fee }`, where `version` is a one-byte [PoXAddressVersion](../constants/poxaddressversion.md).
* A string `poxAddress` that is not a valid P2PKH, P2SH, P2WPKH, P2WSH or P2TR address throws, as in [BtcAddress.parse](../btcaddress/btcaddress-parse.md). A [BtcAddressRepr](../btcaddress/btcaddressrepr.md) with an unknown version or a hash of the wrong length throws.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/types.ts#L236-L251)

***

### Definition

```ts
export interface SignerCalldataL1Payout {
  /** Destination Bitcoin reward address: a parsed {@link BtcAddressRepr} or an
   * address string (P2PKH/P2SH/P2WPKH/P2WSH/P2TR). */
  poxAddress: string | BtcAddressRepr;
  /** Max sBTC fee (sats) the staker tolerates on the L1 BTC withdrawal. */
  maxFeeSats: IntegerType;
  /**
   * When given (and `poxAddress` is a string), assert the address belongs to
   * this network: catches a wrong-network payout-address paste.
   */
  network?: StacksNetworkName | StacksNetwork;
}
```

***

### Properties

| Property     | Type                                            | Description                                                                                                                                         |
| ------------ | ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `poxAddress` | `string \| BtcAddressRepr`                      | Bitcoin address to pay rewards to, as a string or a parsed [BtcAddressRepr](../btcaddress/btcaddressrepr.md). Encoded as `pox-addr`                 |
| `maxFeeSats` | `IntegerType`                                   | Highest fee, in sats of sBTC, the staker accepts on the withdrawal to BTC. Encoded as `max-fee` (`uint`)                                            |
| `network`    | `StacksNetworkName \| StacksNetwork` (optional) | Network the string `poxAddress` must belong to. Ignored when `poxAddress` is a `BtcAddressRepr`. Without it, an address for any network is accepted |
