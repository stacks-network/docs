# sbtc-registry

This contract serves as the central registry for the sBTC protocol, managing withdrawal requests, deposits, and signer data.

## Key Functions

- `create-withdrawal-request`: Creates a new withdrawal request.
- `complete-withdrawal-accept`: Marks a withdrawal request as accepted.
- `complete-withdrawal-reject`: Marks a withdrawal request as rejected.
- `complete-deposit`: Records a completed deposit.
- `rotate-keys`: Updates the signer set, multi-sig principal, and aggregate public key.

## Data Structures

- `withdrawal-requests`: Map storing withdrawal request details.
- `withdrawal-status`: Map storing the status of withdrawal requests.
- `completed-deposits`: Map storing completed deposit information.
- `aggregate-pubkeys`: Map storing aggregate public keys to prevent replay attacks.
- `multi-sig-address`: Map storing multi-sig addresses to prevent replay attacks.
- `protocol-contracts`: Map storing active protocol contracts.
