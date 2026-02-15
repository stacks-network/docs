# Financial Incentive And Security Budget

<div data-with-frame="true"><figure><img src="../.gitbook/assets/image (22).png" alt=""><figcaption></figcaption></figure></div>

In order to reorg the Stacks chain, someone must take control of at least 70% of the STX that are currently Stacked and conduct a 51% attack on Bitcoin itself.

In addition to this, because of how Stacks achieves Bitcoin finality by not allowing forks, Stacks security budget reaches 51% of Bitcoin's mining power because in order to reverse the chain state you would need to reverse the Bitcoin chain state as well.

Stackers have the new-found power to sign blocks in order to append them to the Stacks chain. However, some of them could refuse to sign, and ensure that no block ever reaches the 70% signature threshold. While this can happen by accident, this is not economically rational behavior -- if they stall the chain for too long, their STX loses their value, and furthermore, they cannot re-stack or liquidate their STX or activate PoX to earn BTC. Also, miners will stop mining if no blocks are getting confirmed, which eliminates their ongoing PoX payouts.

The technical details of how this all works are discussed in the [Block Production](../block-production/) section.
