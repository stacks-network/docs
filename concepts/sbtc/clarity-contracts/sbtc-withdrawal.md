# sbtc-withdrawal

This contract handles the withdrawal of sBTC to receive BTC.

## Key Functions

- `initiate-withdrawal-request`: Initiates a new withdrawal request.
- `accept-withdrawal-request`: Accepts and processes a withdrawal request.
- `reject-withdrawal-request`: Rejects a withdrawal request.
- `complete-withdrawals`: Processes multiple withdrawal requests in a single transaction.

## Constants

- `MAX_ADDRESS_VERSION`: Maximum value of a valid address version (6).
- `MAX_ADDRESS_VERSION_BUFF_20`: Maximum address version for 20-byte hash addresses (4).
- `MAX_ADDRESS_VERSION_BUFF_32`: Maximum address version for 32-byte hash addresses (6).
- `DUST_LIMIT`: Minimum amount of sBTC that can be withdrawn (546 sats).

## Error Codes

- `ERR_INVALID_ADDR_VERSION`: Invalid address version.
- `ERR_INVALID_ADDR_HASHBYTES`: Invalid address hash bytes.
- `ERR_DUST_LIMIT`: Withdrawal amount below dust limit.
- `ERR_INVALID_REQUEST`: Invalid withdrawal request ID.
- `ERR_INVALID_CALLER`: Unauthorized function caller.
- `ERR_ALREADY_PROCESSED`: Withdrawal request already processed.
- `ERR_FEE_TOO_HIGH`: Paid fee higher than requested.
