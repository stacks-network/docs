# Stacker Responsibilities

One of the most significant changes to accommodate the sBTC design is that Stackers must now perform active work to continue receiving PoX rewards. Stackers provide partial signatures for BTC withdrawal fulfillment transactions\[the BTC wallet] for the duration of each reward cycle in which their STX are locked. This chapter outlines the new role of the stackers, and how they interact with each other to fulfill their duties.

### sBTC wallet address generation

Stackers in sBTC operate in Reward cycles similar to previous versions of [PoX](https://github.com/stacksgov/sips/blob/main/sips/sip-007/sip-007-stacking-consensus.md). However, the reward cycle has been modified to consist of three phases: prepare (80 blocks), handoff (20 blocks), and reward (2000 blocks).

During the prepare phase, miners decide on an anchor block and the next reward cycle's Stackers as before. During the handoff phase, this new set of Stackers MUST collectively determine and provide a single Bitcoin address in the PoX contract to operate as the sBTC wallet address for the next reward cycle. If they fail to do so within the first 10 blocks of the handoff phase, the prepare phase is reinitiated and a new set of stackers will be selected.

If no valid sBTC address is provided, the current set of Stackers' continue operating as before. Their STX will remain frozen, and they will continue to receive PoX rewards until a successful prepare phase and handoff has occurred. However, once the new set of stackers has provided an sBTC wallet address, the current set of Stackers MUST execute a wallet handoff to this newly generated sBTC wallet address.

### sBTC Wallet handoff

An sBTC Wallet handoff is used by the current reward cycle's Stackers to send all deposited BTC to the next reward cycle's Stackers' sBTC wallet address within 10 blocks of the reward cycle starting. Additionally, Stackers MUST transfer an _equal or greater_ number of BTC than the amount of sBTC that existed at the end of their own wallet's lifetime. This implies that Stackers MUST cover any fee costs associated with fulfilling sBTC withdrawal requests.

### sBTC Withdrawal fulfillment

To fulfill an sBTC withdrawal request, Stackers send one or more Bitcoin transactions that pay the requested amount of BTC to the withdrawal address stipulated by the withdrawal request. If Stackers have received their sBTC wallet handoff and they fail to fulfill a request within 50 Bitcoin blocks of the request being finalized (i.e. at most 150 Bitcoin blocks after the request is submitted), then the system transitions to Recovery mode and PoX payouts are repurposed for fulfilling pending withdrawal requests.

If Stackers do not fulfill the pending sBTC withdrawal requests, their STX will be frozen by .pox and any earned BTC used to fulfill these pending requests. Stackers may only receive back their STX and resume earning BTC once all the withdrawal requests for which they were responsible are fulfilled.
