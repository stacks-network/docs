# SIP-010 Fungible Token Example

A complete implementation of the SIP-010 standard for fungible tokens on Stacks.

## Overview

This example demonstrates how to create a fungible token that implements the [SIP-010 standard](https://github.com/stacksgov/sips/blob/main/sips/sip-010/sip-010-fungible-token-standard.md), making it compatible with wallets, exchanges, and other ecosystem tools.

## Complete Contract

```clarity
;; SIP-010 Fungible Token Example
;; A simple implementation of the SIP-010 standard

(impl-trait 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait)

(define-fungible-token reward-token u1000000000)

(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-token-owner (err u101))

;; SIP-010 Functions

(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
  (begin
    (asserts! (is-eq tx-sender sender) err-not-token-owner)
    (try! (ft-transfer? reward-token amount sender recipient))
    (match memo to-print (print to-print) 0x)
    (ok true)
  )
)

(define-read-only (get-name)
  (ok "Reward Token")
)

(define-read-only (get-symbol)
  (ok "RWD")
)

(define-read-only (get-decimals)
  (ok u6)
)

(define-read-only (get-balance (who principal))
  (ok (ft-get-balance reward-token who))
)

(define-read-only (get-total-supply)
  (ok (ft-get-supply reward-token))
)

(define-read-only (get-token-uri)
  (ok (some u"https://example.com/token-metadata.json"))
)

;; Mint function (only owner)
(define-public (mint (amount uint) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (ft-mint? reward-token amount recipient)
  )
)
```

## Key Features

### 1. Trait Implementation
The contract implements the SIP-010 trait, ensuring compatibility:
```clarity
(impl-trait 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait)
```

### 2. Token Transfer
Allows users to transfer tokens with optional memo:
```clarity
(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
  (begin
    (asserts! (is-eq tx-sender sender) err-not-token-owner)
    (try! (ft-transfer? reward-token amount sender recipient))
    (match memo to-print (print to-print) 0x)
    (ok true)
  )
)
```

### 3. Read-Only Functions
Required metadata functions for token information:
- `get-name`: Returns token name
- `get-symbol`: Returns token symbol
- `get-decimals`: Returns decimal places
- `get-balance`: Returns balance for an address
- `get-total-supply`: Returns total token supply
- `get-token-uri`: Returns metadata URI

### 4. Access Control
Only the contract owner can mint new tokens:
```clarity
(define-public (mint (amount uint) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (ft-mint? reward-token amount recipient)
  )
)
```

## Usage Examples

### Deploying the Contract
```bash
clarinet contract deploy token
```

### Minting Tokens
```clarity
(contract-call? .reward-token mint u1000000 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM)
```

### Transferring Tokens
```clarity
(contract-call? .reward-token transfer 
  u1000 
  tx-sender 
  'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG 
  none)
```

### Checking Balance
```clarity
(contract-call? .reward-token get-balance tx-sender)
```

## Customization

You can customize this template by:

1. **Changing token properties**:
   - Modify `get-name` for your token name
   - Modify `get-symbol` for your token symbol
   - Adjust `get-decimals` for precision

2. **Adjusting supply**:
   - Change max supply in `define-fungible-token`

3. **Adding features**:
   - Burn functionality
   - Pausable transfers
   - Allowance system

## Testing

Test your token with Clarinet:

```toml
# Clarinet.toml
[contracts.reward-token]
path = "contracts/reward-token.clar"
```

Run tests:
```bash
clarinet test
```

## Best Practices

1. **Always validate sender**: Ensure `tx-sender` matches the `sender` parameter
2. **Use error codes**: Define clear error codes for debugging
3. **Implement all trait functions**: Required for SIP-010 compatibility
4. **Add access control**: Protect sensitive functions like `mint`
5. **Test thoroughly**: Test all functions before mainnet deployment

## Resources

- [SIP-010 Specification](https://github.com/stacksgov/sips/blob/main/sips/sip-010/sip-010-fungible-token-standard.md)
- [Clarity Language Reference](https://docs.stacks.co/clarity)
- [Fungible Tokens Guide](https://docs.stacks.co/write-smart-contracts/tokens)

## License

This example is provided as-is for educational purposes.
