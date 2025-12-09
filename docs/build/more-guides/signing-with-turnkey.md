---
description: Leverage Stacks.js with Turnkey's embedded wallet solutions
---

# Signing with Turnkey

[Turnkey’s embedded wallet](https://docs.turnkey.com/embedded-wallets/overview) makes STX & sBTC transactions seamless, secure, and user-friendly, letting your users experience Bitcoin-native apps without friction. Using external embedded wallet/signing solutions with Stacks comes down to properly passing in a hashed transaction payload to a provided signing method. We'll show you how to derive that hashed transaction payload in this guide.

{% hint style="info" %}
Currently, Turnkey does not natively support Stacks, but can be simply integrated together using the example below. Work is in progress for native Stacks support in Turnkey.
{% endhint %}

### Address derivation

Turnkey supports Stacks address derivation with `ADDRESS_FORMAT_COMPRESSED` and `ADDRESS_FORMAT_UNCOMPRESSED` address formats. Stacks addresses are derived from the secp256k1 curve, which Turnkey fully supports.

{% hint style="info" %}
Use a secp256k1 generated public key to derive Stacks addresses and sign Stacks transactions. In most cases with Turnkey, using an Ethereum account's public key would satisfy this.
{% endhint %}

```typescript
import { publicKeyToAddress } from "@stacks/transactions"

const stxAddress = publicKeyToAddress(matchingAccount?.publicKey!)

// STX address: SP1Z6MYME47PW04D1J15K368XZE02VWQ2A5SRC4HV
// publicKey: 03169b8f8bbad2cc6435893c5f255cd5201d272befa8556c82136bf9b36aa0d778
```

### Transaction construction and signing

A sample script that demonstrates how to sign a Stacks transaction with Turnkey. Stacks uses the secp256k1 cryptographic curve for transaction signing, but there some specific data formatting that takes place for the signing process.

Simplified step-by-step process of what this example script is showing:

1. Generate `sigHash` from unsigned transaction
2. Generate `preSignSigHash`
3. ECDSA sign `preSignSigHash` with a Turnkey private key
4. Concatenate outputted raw signature (from step 3) components in the order of V + R + S
5. The resulting signature of step 4 will be the `nextSig`
6. Reassign `spendingCondition.signature` with the value of `nextSig`

**Note:** The hashFunction `HASH_FUNCTION_NO_OP` should be set this way because the payload has already been hashed.

{% hint style="info" %}
Signing Stacks transactions works with either Turnkey's Server or React SDKs
{% endhint %}

```typescript
import { Turnkey as TurnkeyServerSDK } from "@turnkey/sdk-server";
import {
  broadcastTransaction,
  createMessageSignature,
  makeUnsignedSTXTokenTransfer,
  sigHashPreSign,
  SingleSigSpendingCondition,
  TransactionSigner,
  publicKeyToAddress,
  type StacksTransactionWire,
} from "@stacks/transactions";
import * as path from "path";
import * as dotenv from "dotenv";

// Load environment variables from `.env.local`
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

// Define the Turnkey API client
const client = new TurnkeyServerSDK({
  apiBaseUrl: process.env.TURNKEY_BASE_URL!,
  apiPrivateKey: process.env.TURNKEY_API_PRIVATE_KEY!,
  apiPublicKey: process.env.TURNKEY_API_PUBLIC_KEY!,
  defaultOrganizationId: process.env.TURNKEY_ORGANIZATION_ID!,
});

// Construct an unsigned Stacks transaction
const constructStacksTx = async (pubKey: string) => {
  const recipient = process.env.STACKS_RECIPIENT_ADDRESS!;

  let transaction = await makeUnsignedSTXTokenTransfer({
    recipient,
    amount: 300,
    publicKey: pubKey,
    numSignatures: 1,
    network: "mainnet",
  });

  return { stacksTransaction: transaction, sighash: transaction.signBegin() };
};

// The resulting preSignSigHash is what ultimately gets signed by a private key using ECDSA over the secp256k1 curve. 
const generatePreSignSigHash = (
  transaction: StacksTransactionWire,
  sighash: string
) => {
  let preSignSigHash = sigHashPreSign(
    sigHash,
    transaction.auth.authType,
    transaction.auth.spendingCondition.fee,
    transaction.auth.spendingCondition.nonce,
  );

  return preSignSigHash;
};

const signStacksTx = async () => {
  try {
    // Grab the public key associated with the user's Turnkey Ethereum account as a proxy
    // Ethereum's public key generation and signing curve matches that of Stacks
    // Use `publicKeyToAddress` to convert public key to Stacks address for display purposes
    const stacksPublicKey = process.env.TURNKEY_SIGNER_PUBLIC_KEY!;

    let { stacksTransaction, stacksTxSigner } = await constructStacksTx(
      stacksPublicKey!,
    );
    let preSignSigHash = generatePreSignSigHash(
      stacksTransaction,
      stacksTxSigner,
    );

    const payload = `0x${preSignSigHash}`;

    const signature = await client?.apiClient().signRawPayload({
      payload,
      // either passing in pubkey or account address
      signWith: stacksPublicKey,
      encoding: "PAYLOAD_ENCODING_HEXADECIMAL",
      hashFunction: "HASH_FUNCTION_NO_OP",
    });

    // r and s values returned are in hex format, may need to padStart r and s values
    // v should be "00" for Stacks but the returned "01" also works
    const nextSig = `${signature!.v}${signature!.r.padStart(64, "0")}${signature!.s.padStart(64, "0")}`;

    // Reassign signature field in transaction with `nextSig`
    let spendingCondition = stacksTransaction.auth.spendingCondition as SingleSigSpendingCondition;
    spendingCondition.signature = createMessageSignature(nextSig);

    return stacksTransaction;
  } catch (err) {
    console.error("Signing failed:", err);
    return undefined;
  }
};

const handleBroadcastTx = async () => {
  let tx = await signStacksTx();

  let result = await broadcastTransaction({
    transaction: tx!,
    network: "mainnet",
  });

  console.log("Broadcast Result:", result);
};

(async () => {
  await handleBroadcastTx();
})();
```

### **Components of a ECDSA signature**

* **r (32 bytes)**: The x-coordinate of a point on the elliptic curve, derived during the signing process.
* **s (32 bytes)**: A scalar derived from the message hash, private key, and the nonce k.
* **v (1 byte)**: Indicates which of the two possible public keys was used to generate the signature.&#x20;

### **Why Use Turnkey Embedded Wallets for Stacks Apps**

* **Seamless onboarding** – Users can start interacting with your app immediately, without installing separate wallets or extensions.
* **Simplified authentication** – Turnkey handles secure key management and signing, including modern standards like passkeys.
* **Improved UX** – Embedded wallets reduce friction in transactions, making dApps feel more like mainstream apps.
* **Multi-chain-ready** – Easily support STX, sBTC and other blockchain assets without building your own wallet infrastructure.

***

### Additional Resources

* \[[Hiro Blog](https://www.hiro.so/blog/dissecting-a-transaction-signature-on-stacks)] Dissecting a Transaction Signature on Stacks
* \[[Twitter](https://x.com/ECBSJ/status/1976286764018077933)] Stacks DevRel Office Hours with Turnkey's Michael Lewellen
* \[[Twitter](https://x.com/kai_builder/status/1977059253379834059)] sBTC.Cool - Example project on Stacks integrating Turnkey
* \[[Twitter](https://x.com/turnkeyhq/status/1946239286686241228)] Turnkey supporting transaction signing for Stacks
