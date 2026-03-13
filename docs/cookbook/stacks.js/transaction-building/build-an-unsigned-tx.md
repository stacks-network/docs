# Build an unsigned tx

{% code fullWidth="false" expandable="true" %}
```typescript
import { getPublicKeyFromPrivate } from "@stacks/encryption";
import { 
  makeUnsignedSTXTokenTransfer,
  type StacksTransactionWire,
  type SingleSigSpendingCondition,
  createMessageSignature
} from "@stacks/transactions";

// Get public key from private key
const privateKey = "753b7cc01a1a2e86221266a154af739463fce51219d97e4f856cd7200c3bd2a601";
const publicKey = getPublicKeyFromPrivate(privateKey);
const recipient = process.env.STACKS_RECIPIENT_ADDRESS!;

// Build unsigned STX transfer
let transaction: StacksTransactionWire = await makeUnsignedSTXTokenTransfer({
  recipient,
  amount: 300,
  publicKey: pubKey,
  numSignatures: 1,
  network: "mainnet",
});

let sighash = transaction.signBegin()

let preSignSigHash: string = sigHashPreSign(
  sigHash,
  transaction.auth.authType,
  transaction.auth.spendingCondition.fee,
  transaction.auth.spendingCondition.nonce,
);

// Unsigned transaction payload ready for external signing ECDSA over secp256k1
console.log("Unsigned transaction payload to sign:", preSignSigHash);

// Signing should return a recoverable signature (in VRS order).
// let signature

// r and s values to be returned in hex format, may need to padStart r and s values
// v should be "00" for Stacks but a returned "01" also works
const nextSig = `${signature!.v}${signature!.r.padStart(64, "0")}${signature!.s.padStart(64, "0")}`;

// Reassign signature field in transaction with `nextSig`
let spendingCondition = transaction.auth.spendingCondition as SingleSigSpendingCondition;
spendingCondition.signature = createMessageSignature(nextSig);

// `transaction` is now ready to be broadcasted
console.log(transaction)
```
{% endcode %}

### Description

Create unsigned transactions for hardware wallets or multi-signature scenarios

### Use Cases

* Hardware wallet integration (Ledger, Trezor)
* Multi-signature wallet transactions
* Offline transaction signing
* Secure key management systems

### Key Concepts

* **Public key only** - No private key needed for creation
* **External signing** - Sign with hardware wallet or secure enclave
* **Serialization** - Can be transported and signed elsewhere
* Unsigned transactions separate transaction creation from signing
