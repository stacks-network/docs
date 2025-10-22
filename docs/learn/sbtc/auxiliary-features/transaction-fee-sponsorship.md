# Transaction Fee Sponsorship

Transaction Fee Sponsorship is a feature in sBTC that allows users to pay for Stacks transaction fees using sBTC instead of STX.

## Overview

* sBTC transactions on Stacks can be sponsored in return for some sBTC.
* This feature improves user experience by allowing sBTC holders to use their tokens for gas fees.

## Implementation

The fee sponsorship system is implemented using the approach suggested in [stacks-network/stacks-core#4235](https://github.com/stacks-network/stacks-core/issues/4235).

{% stepper %}
{% step %}
### Sponsor support for fees

sBTC users can get support from existing STX holders for transaction fees.
{% endstep %}

{% step %}
### Sponsor receives sBTC

The sponsor pays the STX fee and receives sBTC in return.
{% endstep %}
{% endstepper %}

## User Experience

From a user's perspective:

{% stepper %}
{% step %}
### Opt into fee sponsorship

When initiating an sBTC transaction, they can opt for fee sponsorship.
{% endstep %}

{% step %}
### Agree to sponsorship terms

The user agrees to pay a small amount of sBTC for the sponsorship.
{% endstep %}

{% step %}
### Transaction processed

The transaction is then processed with the fees paid in STX by the sponsor.
{% endstep %}
{% endstepper %}

## Benefits

* Improved UX: Users don't need to hold STX to use sBTC.
* Lower Barrier to Entry: New users can start using sBTC without first acquiring STX.
* Flexibility: Provides an additional option for handling transaction fees.
