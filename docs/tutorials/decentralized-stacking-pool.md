Tutorial 1: Building a Decentralized Stacking Pool with pox-4
Directory: docs/docs/tutorials/

File Name: decentralized-stacking-pool.md

id: decentralized-stacking-pool title: "Building a Decentralized Stacking Pool with pox-4" description: "A deep-dive tutorial on implementing the new pox-4 trait for pool aggregation and signer delegation." slug: /tutorials/stacking/decentralized-pool
Module 1: Stacking - Building a Decentralized Stacking Pool with pox-4
Author: @jadonamite File Name: docs/docs/tutorials/decentralized-stacking-pool.md Difficulty: Expert Time: 45 Minutes

Individual Stacking requires meeting a dynamic minimum that often creates a high barrier to entry for users. By implementing a decentralized stacking pool, you enable users to aggregate their STX while leveraging the new Nakamoto signer set to achieve 100% Bitcoin finality. This tutorial addresses the knowledge gap in handling the pox-4 trait's new signer authorization requirements.

1. The Concept
In the Nakamoto release, Stacking involves a tripartite relationship between the Delegator, the Pool Operator, and the Signer. Unlike previous PoX versions, the operator must now account for a validated signer key to authorize block production during the reward cycle.

Constraint A: The Pool Operator must use a SIP-18 compliant signature to verify control over the signing infrastructure before committing the pool.

Constraint B: Reward cycles are fixed; the pool operator must commit aggregated funds before the "Prepare Phase" (the last 100 Bitcoin blocks of the current cycle).

2. The Implementation
The implementation follows a two-step logic: first, aggregating user delegation permissions, and second, committing the aggregate stake to the official reward set.

File: contracts/decentralized-pool.clar

```
Code snippet
;; Step 1: User delegates STX to the Pool Operator
;; Step 2: Pool Operator approves stackers via delegate-stack-stx
;; Step 3: Pool Operator commits the aggregate with a signer signature

(define-public (commit-aggregated-pool 
    (reward-cycle uint) 
    (pox-addr { version: (buff 1), hashbytes: (buff 32) })
    (signer-sig (optional (buff 65)))
    (signer-key (buff 33))
    (max-amount uint)
    (auth-id uint))
  (begin
    ;; Ensure caller is the authorized pool operator
    (asserts! (is-eq tx-sender.pool-admin) (err u403))
    
    ;; Commit the partially-stacked STX into the official reward set
    (contract-call? 'ST000000000000000000002AMW42H.pox-4 stack-aggregation-commit-indexed
      pox-addr
      reward-cycle
      signer-sig
      signer-key
      max-amount
      auth-id
    )
  )
)
```

3. Key Nuances / Security
Under Nakamoto rules, the signer key is no longer just for identification; it is a consensus-critical requirement for block validation.

Signer Authorization Signature
Risk: If a pool operator uses an unauthorized or "bad" signing key, they can grief the reward address, causing all payouts for that address to cease.

Mitigation: pox-4 requires the signer-sig to prove the operator has physical access to the stacks-signer private key.

4. Summary Checklist
[ ] Minimum Threshold: Verified the current min_threshold_ustx via the /v2/pox endpoint.

[ ] Signer Sync: Confirmed stacks-signer is configured and making RPC calls to the Stacks node.

[ ] Epoch Check: Verified the contract targets pox-4 for Nakamoto rules (Epoch 3.0).

