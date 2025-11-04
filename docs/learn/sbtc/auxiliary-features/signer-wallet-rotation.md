# Signer Wallet Rotation

Signer wallet rotation allows sBTC signers to update their private keys and modify the signer set composition. This mechanism is how the network maintains security over time and adapts to changing participants.

## How it works

The sBTC system uses a multi-signature wallet on Bitcoin to custody BTC deposits. When the system needs to change who controls this wallet—either by rotating keys or changing the signer set—it uses the rotation mechanism.

As of v1.1.0, the system supports:

* Adding new signers to the set
* Removing existing signers
* Replacing specific signers
* Rotating keys for current signers

When signers agree on a new configuration, the system automatically runs a Distributed Key Generation (DKG) protocol to create new signing shares for the updated group. Once complete, control of the sBTC wallet transfers to the new configuration.

## The rotation process

{% stepper %}
{% step %}
#### Signers coordinate off-chain

Signers agree on the new signer set.
{% endstep %}

{% step %}
#### Update configuration

Each signer operator updates their configuration with the newly decided set.
{% endstep %}

{% step %}
#### DKG runs automatically

Once all signers have configured the exact same set of signers, DKG occurs automatically to generate new signing shares.
{% endstep %}

{% step %}
#### New signer set takes control

The new signer set takes control of the sBTC wallet.
{% endstep %}
{% endstepper %}

The Bitcoin UTXOs remain under continuous control throughout this process—there's no moment where funds are unsecured.

## When rotation occurs

Key rotation typically happens when:

* **Signer changes**: When someone leaves the signer set or new participants join, the configuration must be updated to reflect the new membership.
* **Security events**: If a key might be compromised, an emergency rotation can be initiated to secure the system.
