# selectStxDerivation

Determines the correct derivation path and username for an account by looking up BNS name ownership on the network. This is used during wallet restoration to figure out whether an account's STX key was derived via the Wallet path or the Data path.

***

### Usage

```ts
import { selectStxDerivation } from '@stacks/wallet-sdk';
import { HDKey } from '@scure/bip32';
import { mnemonicToSeed } from '@scure/bip39';

const seed = await mnemonicToSeed('your 24-word seed phrase ...');
const rootNode = HDKey.fromMasterSeed(seed);

// With a known username
const result = await selectStxDerivation({
  username: 'myname.btc',
  rootNode,
  index: 0,
  network: 'mainnet',
});
console.log(result.stxDerivationType); // DerivationType.Wallet or DerivationType.Data

// Without a username — auto-discovers
const result2 = await selectStxDerivation({
  rootNode,
  index: 0,
  network: 'mainnet',
});
console.log(result2.username);          // discovered username or undefined
console.log(result2.stxDerivationType); // DerivationType.Wallet (default)
```

#### Notes

- If a `username` is provided, it looks up the name's owner address on the network and checks which derivation path matches.
- If no `username` is provided, it tries both derivation paths and looks up names owned by each address.
- If no network is provided, returns `DerivationType.Unknown`.
- Falls back to `DerivationType.Wallet` when no username is found.

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/wallet-sdk/src/derive.ts#L107)**

***

### Signature

```ts
function selectStxDerivation(opts: {
  username?: string;
  rootNode: HDKey;
  index: number;
} & NetworkParam): Promise<{
  username: string | undefined;
  stxDerivationType: DerivationType;
}>;
```

***

### Returns

`Promise<{ username: string | undefined; stxDerivationType: DerivationType }>`

An object containing the resolved username (if any) and the derivation type that matches.

***

### Parameters

#### opts (required)

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `rootNode` | `HDKey` | Yes | The root HD key derived from the wallet's seed phrase. |
| `index` | `number` | Yes | The account index (0-based). |
| `username` | `string` | No | A BNS username to look up. If omitted, the function tries to auto-discover one. |
| `network` | `StacksNetworkName \| StacksNetwork` | No | The network to query for BNS name lookups. |
