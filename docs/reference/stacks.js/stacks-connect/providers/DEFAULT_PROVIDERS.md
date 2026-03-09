# DEFAULT\_PROVIDERS

A pre-configured array of wallet providers that are displayed in the wallet selection modal by default. These represent the most popular Stacks-compatible wallets.

***

### Usage

```ts
import { DEFAULT_PROVIDERS } from '@stacks/connect';

console.log(DEFAULT_PROVIDERS);
// [
//   { id: 'LeatherProvider', name: 'Leather', ... },
//   { id: 'XverseProviders.BitcoinProvider', name: 'Xverse Wallet', ... },
//   { id: 'AsignaProvider', name: 'Asigna Multisig', ... },
//   { id: 'FordefiProviders.UtxoProvider', name: 'Fordefi', ... },
// ]
```

```ts
import { request, DEFAULT_PROVIDERS } from '@stacks/connect';

// Extend the default providers with a custom wallet
await request(
  {
    defaultProviders: [
      ...DEFAULT_PROVIDERS,
      {
        id: 'MyCustomWallet',
        name: 'My Wallet',
        icon: 'https://example.com/icon.svg',
        webUrl: 'https://example.com',
      },
    ],
  },
  'getAddresses',
);
```

#### Notes

- These providers are passed as the `defaultProviders` option to [`request`](../request/request.md) when no custom providers are specified.
- Each provider entry contains metadata for display in the wallet selection modal (name, icon, download URLs), not the actual provider implementation. The actual provider is detected from the browser environment at runtime.
- You can override this list by passing a custom `defaultProviders` array in [`ConnectRequestOptions`](../request/ConnectRequestOptions.md).

**[Reference Link](https://github.com/stx-labs/connect/blob/main/packages/connect/src/providers.ts#L5)**

***

### Definition

```ts
const DEFAULT_PROVIDERS: WebBTCProvider[]
```

***

### Included Providers

| Provider ID | Name | Description |
| --- | --- | --- |
| `LeatherProvider` | Leather | Popular Stacks wallet (browser extension). |
| `XverseProviders.BitcoinProvider` | Xverse Wallet | Multi-chain Bitcoin and Stacks wallet (extension and mobile). |
| `AsignaProvider` | Asigna Multisig | Multisig wallet for Stacks. |
| `FordefiProviders.UtxoProvider` | Fordefi | Institutional-grade wallet (browser extension). |

***

### Provider Shape

Each entry in the array conforms to the `WebBTCProvider` interface:

```ts
interface WebBTCProvider {
  id: string;
  name: string;
  icon: string;
  webUrl: string;
  chromeWebStoreUrl?: string;
  mozillaAddOnsUrl?: string;
  googlePlayStoreUrl?: string;
  iOSAppStoreUrl?: string;
}
```

| Property | Type | Description |
| --- | --- | --- |
| `id` | `string` | Unique identifier used to match with the installed browser provider. |
| `name` | `string` | Display name shown in the wallet selection modal. |
| `icon` | `string` | Base64-encoded SVG icon or URL for the wallet icon. |
| `webUrl` | `string` | The wallet's website URL. |
| `chromeWebStoreUrl` | `string` (optional) | Chrome Web Store installation link. |
| `mozillaAddOnsUrl` | `string` (optional) | Mozilla Add-ons installation link. |
| `googlePlayStoreUrl` | `string` (optional) | Google Play Store link (mobile wallets). |
| `iOSAppStoreUrl` | `string` (optional) | Apple App Store link (mobile wallets). |
