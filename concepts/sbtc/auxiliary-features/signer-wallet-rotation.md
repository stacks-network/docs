# Signer Wallet Rotation

Signer wallet rotation allows sBTC signers to update their private keys and modify the signer set composition. This mechanism is how the network maintains security over time and adapts to changing participants.

## How it works

The sBTC system uses a multi-signature wallet on Bitcoin to custody BTC deposits. When the system needs to change who controls this wallet - either by rotating keys or changing the signer set - it uses the rotation mechanism.

As of v1.1.0, the system supports:

- Adding new signers to the set
- Removing existing signers
- Replacing specific signers
- Rotating keys for current signers

The rotation happens through an on-chain voting process. When signers agree on a new configuration, the system automatically runs a Distributed Key Generation (DKG) protocol to create new signing shares for the updated group. Once complete, control of the sBTC wallet transfers to the new configuration.

## The rotation process

Here's what happens during a typical rotation:

1. Signers coordinate off-chain to decide on the new signer set
2. They submit their votes on-chain for the proposed configuration
3. When enough votes are collected, the system triggers DKG automatically
4. Signers participate in the DKG protocol to generate new key shares
5. The new signer set takes control of the sBTC wallet

The Bitcoin UTXOs remain under continuous control throughout this process - there's no moment where funds are unsecured.

## When rotation occurs

Key rotation typically happens in several scenarios:

**Regular maintenance**: Many operators rotate keys on a schedule (like every 6 months) as a security practice, similar to changing passwords periodically.

**Signer changes**: When someone leaves the signer set or new participants join, the configuration must be updated to reflect the new membership.

**Security events**: If a key might be compromised, an emergency rotation can be initiated to secure the system.

## Technical implementation

The rotation system has two main components:

The **rotation CLI** lets individual signers propose and vote on rotations. This tool initiates the process and coordinates with other signers.

The **Clarity contracts** handle the on-chain voting and coordination. These contracts track votes, determine when consensus is reached, and trigger the DKG process.
