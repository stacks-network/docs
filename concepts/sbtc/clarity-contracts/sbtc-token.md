# sbtc-token

This contract implements the sBTC token, following the SIP-010 fungible token standard.

## Key Functions

- `protocol-transfer`: Transfers sBTC between accounts (only callable by protocol contracts).
- `protocol-lock`: Locks sBTC by burning tokens and minting locked tokens.
- `protocol-unlock`: Unlocks sBTC by burning locked tokens and minting regular tokens.
- `protocol-mint`: Mints new sBTC tokens.
- `protocol-burn`: Burns sBTC tokens.
- `transfer`: Transfers sBTC tokens (implements SIP-010).

## Token Properties

- `token-name`: The name of the token ("sBTC").
- `token-symbol`: The symbol of the token ("sBTC").
- `token-uri`: Optional URI for token metadata.
- `token-decimals`: The number of decimal places for the token (8).
