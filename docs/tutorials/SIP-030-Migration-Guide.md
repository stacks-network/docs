# Module 32: Frontend - Migrating to SIP-030 (The `request` Method)

**Author:** @jadonamite
**Difficulty:** Intermediate
**Time:** 15 Minutes

For years, Stacks developers relied on `@stacks/connect` and the helper function `openContractCall`. While easy to use, it created a dependency on a specific library rather than a standard wallet interface.

**SIP-030** introduced a standard Provider API (similar to Ethereum's EIP-1193). This means wallets inject a standard object into the window, and you interact with it using a generic `request` method.

This shift allows your dApp to support *any* compliant wallet (Leather, Xverse, Asylow) without installing SDKs specific to each one.

This module shows you how to refactor your transaction logic from the legacy helper to the modern standard.

## 1. The Legacy Approach (`openContractCall`)

You likely have code that looks like this. It relies on callbacks (`onFinish`) and a specific library import.

**Legacy:**

```typescript
import { openContractCall } from '@stacks/connect';

function buyItemLegacy() {
  openContractCall({
    network: new StacksTestnet(),
    contractAddress: 'ST1...',
    contractName: 'marketplace',
    functionName: 'buy',
    functionArgs: [uintCV(100)],
    
    // Callback Hell
    onFinish: (data) => {
      console.log('Tx ID:', data.txId);
    },
    onCancel: () => {
      console.log('User cancelled');
    },
  });
}

```

## 2. The Modern Approach (SIP-030 `request`)

The new standard uses `window.StacksProvider?.request`. It returns a **Promise**, allowing for cleaner `async/await` flows and no library dependency for the trigger mechanism.

**Modern:**

```typescript
// 1. Type Definition for the Window Object
interface StacksProvider {
  request: (payload: { method: string; params?: any }) => Promise<any>;
}

function buyItemModern() {
  // 2. Locate the Provider
  // Wallets inject themselves here. Xverse/Leather both support this.
  const provider = (window as any).StacksProvider as StacksProvider;

  if (!provider) {
    alert("No Stacks wallet found!");
    return;
  }

  // 3. Construct the Request
  try {
    const response = await provider.request({
      method: 'stx_callContract', // The RPC Method
      params: {
        contractAddress: 'ST1...',
        contractName: 'marketplace',
        functionName: 'buy',
        functionArgs: [
            // Note: SIP-030 usually expects Hex strings for arguments
            // You still use ClarityValue classes to generate the hex.
            uintCV(100).toString() 
        ], 
        postConditions: [] // Optional hex strings
      }
    });

    // 4. Handle Success (Promise resolves)
    console.log('Tx ID:', response.txid); // Note: response structure may vary slightly by wallet implementation, but usually contains txid
    
  } catch (error) {
    // 5. Handle Errors/Cancellation (Promise rejects)
    console.error('Transaction failed or cancelled:', error);
  }
}

```

## 3. Key Differences Table

| Feature | `openContractCall` (Legacy) | `request` (SIP-030) |
| --- | --- | --- |
| **Dependency** | `@stacks/connect` | None (Native Window) |
| **Flow Control** | Callbacks (`onFinish`) | Promises (`async/await`) |
| **Arguments** | Clarity Values (Objects) | Serialized Hex Strings (mostly) |
| **Method Name** | Implicit | Explicit (`stx_callContract`, `stx_signMessage`) |
| **Compatibility** | Specific Wallets | Any SIP-030 Compliant Wallet |

## 4. Helper Utility: Serializing Arguments

The biggest friction point is that `request` often expects **Strings** (Hex) rather than Objects for arguments.

**File:** `utils/serialization.ts`

```typescript
import { cvToHex, ClarityValue } from '@stacks/transactions';

export const serializeArgs = (args: ClarityValue[]) => {
  return args.map(arg => cvToHex(arg));
};

// Usage in request params:
// functionArgs: serializeArgs([uintCV(100), standardPrincipalCV(...)])

```

## 5. Handling Wallet Fragmentation

While `window.StacksProvider` is the standard, some wallets might inject themselves under different namespaces initially (e.g., `window.btc` for generic Bitcoin apps, or `window.XverseProviders`).

**Best Practice:** Use a discovery adapter or check for the standard first.

```typescript
const getProvider = () => {
  if ('StacksProvider' in window) {
    return window.StacksProvider;
  }
  // Fallback or specific wallet checks
  return undefined;
};

```

## 6. Summary Checklist

* [ ] **Provider Check:** Do you safely check `if (window.StacksProvider)` before calling request?
* [ ] **Async Flow:** Did you replace `onFinish` with `await` and `try/catch`?
* [ ] **Serialization:** Are you converting Clarity Values to Hex strings before passing them to `params`?

