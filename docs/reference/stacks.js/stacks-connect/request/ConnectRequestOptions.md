# ConnectRequestOptions

Configuration options passed to the [`request`](request.md) function to control wallet selection, provider behavior, and local storage caching.

***

### Definition

```ts
interface ConnectRequestOptions {
  provider?: StacksProvider;
  forceWalletSelect?: boolean;
  persistWalletSelect?: boolean;
  enableOverrides?: boolean;
  enableLocalStorage?: boolean;
  defaultProviders?: WbipProvider[];
  approvedProviderIds?: string[];
  walletConnect?: Partial<Pick<UniversalConnectorConfig, 'metadata' | 'networks'>> &
    Omit<UniversalConnectorConfig, 'metadata' | 'networks'>;
}
```

**[Reference Link](https://github.com/stx-labs/connect/blob/main/packages/connect/src/request.ts#L30)**

***

### Properties

#### provider (optional)

* **Type**: `StacksProvider`
* **Default**: Previously selected provider, or `null`

The wallet provider to use for the request. If none is provided, the wallet selection modal is displayed to the user (unless a wallet was previously selected and `forceWalletSelect` is `false`).

```ts
import { request } from '@stacks/connect';

const myProvider = window.LeatherProvider;

await request(
  { provider: myProvider },
  'stx_getAddresses',
);
```

***

#### forceWalletSelect (optional)

* **Type**: `boolean`
* **Default**: `false`

When `true`, the wallet selection modal is always shown, even if a wallet was previously selected. This is useful when you want to allow the user to switch wallets.

```ts
import { request } from '@stacks/connect';

await request(
  { forceWalletSelect: true },
  'stx_getAddresses',
);
```

***

#### persistWalletSelect (optional)

* **Type**: `boolean`
* **Default**: `true`

When `true`, the wallet selected by the user is remembered for subsequent requests. The selected provider ID is stored so future calls to `request` automatically use the same wallet without prompting again.

***

#### enableOverrides (optional)

* **Type**: `boolean`
* **Default**: `true`

When `true`, `request` automatically rewrites method names and parameter formats to normalize behavior across different wallet providers (e.g. Xverse, Leather, Fordefi). This helps ensure consistent behavior regardless of which wallet the user selects.

Examples of overrides:

- Converting `getAddresses` to `wallet_connect` for Xverse-like wallets.
- Normalizing `amount` types between `number` and `string` depending on the wallet.
- Transforming `signPsbt` input formats to match each wallet's expected schema.
- Normalizing response fields like `txId` vs `txid` and `hex` vs `psbt`.

Set to `false` if you are handling provider-specific formatting yourself.

***

#### enableLocalStorage (optional)

* **Type**: `boolean`
* **Default**: `true`

When `true`, address results from `getAddresses` calls are automatically cached in local storage. This enables the [`isConnected`](../connection/isConnected.md) and [`getLocalStorage`](../storage/getLocalStorage.md) functions to work.

***

#### defaultProviders (optional)

* **Type**: `WbipProvider[]`
* **Default**: [`DEFAULT_PROVIDERS`](../providers/DEFAULT_PROVIDERS.md)

The list of wallet providers to display in the wallet selection modal. By default, this includes Leather, Xverse, Asigna, and Fordefi.

```ts
import { request } from '@stacks/connect';

await request(
  {
    defaultProviders: [
      {
        id: 'MyCustomWallet',
        name: 'My Wallet',
        icon: 'https://example.com/icon.svg',
        webUrl: 'https://example.com',
      },
    ],
  },
  'stx_getAddresses',
);
```

***

#### approvedProviderIds (optional)

* **Type**: `string[]`
* **Default**: `undefined` (all providers shown)

A whitelist of provider IDs to show in the wallet selection modal. If provided, only providers whose `id` matches one of the entries in this array will be displayed. Both default and installed providers are filtered.

```ts
import { request } from '@stacks/connect';

await request(
  {
    approvedProviderIds: ['LeatherProvider', 'XverseProviders.BitcoinProvider'],
  },
  'stx_getAddresses',
);
```

#### Notes

If using `walletConnect` alongside `approvedProviderIds`, make sure to include `"WalletConnectProvider"` in the array.

***

#### walletConnect (optional)

* **Type**: `Partial<Pick<UniversalConnectorConfig, 'metadata' | 'networks'>> & Omit<UniversalConnectorConfig, 'metadata' | 'networks'>`

Configuration for WalletConnect. If provided, the WalletConnect provider is automatically initialized and added to the wallet selection modal.

- `projectId` is **required**.
- `metadata` and `networks` are optional and will use default values if not provided.

```ts
import { request, WalletConnect } from '@stacks/connect';

await request(
  {
    walletConnect: {
      projectId: 'your-project-id',
      networks: [WalletConnect.Networks.Stacks],
    },
  },
  'stx_getAddresses',
);
```

#### Notes

If using `walletConnect` alongside `approvedProviderIds`, include `"WalletConnectProvider"` in the `approvedProviderIds` array so the WalletConnect option is visible in the modal.
