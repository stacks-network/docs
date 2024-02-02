# Financial Incentives and Security Budget

Miners remain incentivized to mine blocks because they earn STX by spending BTC. This dynamic is not affected by Nakamoto changes.

Stackers have the new-found power to sign blocks in order to append them to the Stacks chain. However, some of them could refuse to sign, and ensure that no block ever reaches the 70% signature threshold. While this can happen by accident, this is not economically rational behavior -- if they stall the chain for too long, their STX loses their value, and furthermore, they cannot re-stack or liquidate their STX or activate PoX to earn BTC. Also, miners will stop mining if no blocks are getting confirmed, which eliminates their ongoing PoX payouts.

Stackers may refuse to sign blocks that contain transactions they do not like, for various reasons. In the case of `stack-stx`, `delegate-stx`, and `transfer-stx`, users have the option to _force_ Stackers to accept the block by sending these transactions as Bitcoin transactions. Then, all subsequently-mined blocks must include these transactions in order to be valid. This forces Stackers to choose between signing the block and stalling the network forever.

Stackers who do not wish to be in this position should evaluate whether or not to continue Stacking. Furthermore, Stackers may delegate their signing authority to a third party if they feel that they cannot participate directly in block signing.

That all said, the security budget of the chain is considerably larger in Nakamoto than before. In order to reorg the Stacks chain, someone must take control of at least 70% of the STX that are currently Stacked. If acquired at market prices, then at the time of this writing, that amounts to spending about $191 million USD. By contrast, Stacks miners today spend a few hundred USD per Bitcoin block to mine a Stacks block. Reaching the same economic resistance to reorgs provided by a signature from 70% of all stacked STX would take considerably longer.
