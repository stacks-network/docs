# Signer Wallet Rotation

Signer Wallet Rotation is a crucial security feature in the sBTC system that allows sBTC Signers to rotate their private keys securely.

## Overview

- sBTC Signers have the ability to rotate their private keys.
- This feature enhances the long-term security of the sBTC system.
- Key rotation is coordinated among signers and requires on-chain voting by the signers.

## Process

1. Signers coordinate offline to initiate the key rotation process.
2. Signers vote on-chain for the new signer set (new set of keys).
3. Once the new signer set is determined, signers conduct a wallet handoff.
4. The signers re-execute the Distributed Key Generation (DKG) process.

## Implementation

The Signer Wallet Rotation process is facilitated by:

1. **Signer Key Rotation CLI**: Allows individual signers to initiate a private key rotation.
2. **Key Rotation Clarity Contracts**: Handle the on-chain aspects of the rotation process.

## Security Considerations

- The rotation process must ensure that the sBTC UTxO remains secure throughout the transition.
- Proper coordination among signers is crucial to prevent any disruption in sBTC operations.
- The new keys must be thoroughly verified before being put into use.

## Benefits

1. **Enhanced Security**: Regular key rotations reduce the risk of key compromise.
2. **Flexibility**: Allows for the replacement of compromised or lost keys.
3. **Continuity**: Enables long-term operation of the sBTC system with evolving security measures.

## Best Practices

- Signers should rotate their keys on a regular schedule (e.g., every 6 months).
- Emergency rotation procedures should be in place for suspected key compromises.
- The rotation process should be audited and tested regularly to ensure smooth execution when needed.
