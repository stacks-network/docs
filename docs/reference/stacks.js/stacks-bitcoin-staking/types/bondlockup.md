# BondLockup

The BTC side of a protocol bond registration: either proofs of L1 BTC lockup outputs, or an amount of sBTC for pox-5 to custody. [buildRegisterForBond](../build/buildregisterforbond.md) and [fetchEligibleRegisterForBond](../eligibility/fetcheligibleregisterforbond.md) take it as `lockup`. It maps to the `btc-lockup` argument of pox-5 [`register-for-bond`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L642-L842): `kind: 'btc'` is sent as `(ok ...)`, `kind: 'sbtc'` as `(err sats)`.

***

### Usage

```ts
import { buildRegisterForBond, fetchPoxInfo } from '@stacks/bitcoin-staking';
import { Pc } from '@stacks/transactions';

const poxInfo = await fetchPoxInfo({ network: 'mainnet' });

// sBTC: pox-5 takes up to 100,000 sats of sBTC from the staker
const tx = await buildRegisterForBond({
  bondIndex: 2,
  signerManager: 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.my-signer-manager',
  amountUstx,
  lockup: { kind: 'sbtc', sbtcSats: 100_000n },
  publicKey,
  fee: 10_000n,
  nonce,
  network: 'mainnet',
  postConditions: [
    Pc.principal(stakerAddress).willSendEq(amountUstx).ustxToLock(),
    Pc.principal(stakerAddress).willSendLte(100_000n).ft(poxInfo.sbtcContract, 'sbtc-token'),
  ],
});

// L1 BTC: proofs from buildLockProof, unlockBytes from buildRegisterMetadata
const btcLockup = { kind: 'btc', outputs: [output], unlockBytes: meta.unlockBytes } as const;
```

#### Notes

* With `kind: 'sbtc'`, pox-5 transfers only the difference between the sBTC it already custodies for the staker and `sbtcSats`, so `sbtcSats` is an upper bound for the sBTC post condition. Read the token contract from [PoxInfo](poxinfo.md) `sbtcContract`.
* With `kind: 'btc'`, the staked sats are the sum of the outputs' `amount`. Only the STX lock needs a post condition.
* In both cases the sats count against the staker's allowlist cap for the bond. Above it, `register-for-bond` fails with `ERR_TOO_MUCH_SATS (u10)`.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/types.ts#L335-L342)

***

### Definition

```ts
export type BondLockup =
  | { kind: 'btc'; outputs: BondL1LockupOutput[]; unlockBytes: Uint8Array | string }
  | { kind: 'sbtc'; sbtcSats: IntegerType };
```

***

### Values

| Value                                   | Description                                                                                                                                                                                                                                                                                                                 |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `{ kind: 'btc'; outputs; unlockBytes }` | L1 BTC lockup. `outputs` is 1 to 10 [BondL1LockupOutput](bondl1lockupoutput.md) proofs. `unlockBytes` is the staker's signature subscript, such as the output of [buildUnlockScript](../script/buildunlockscript.md), sent as `staker-unlock-bytes` (`buff 683`). It must be the subscript the lockup script was built with |
| `{ kind: 'sbtc'; sbtcSats }`            | sBTC lockup. `sbtcSats` is the total sBTC, in sats, to custody for the bond                                                                                                                                                                                                                                                 |
