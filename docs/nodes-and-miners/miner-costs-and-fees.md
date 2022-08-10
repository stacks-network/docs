---
title: Miner costs and fees
description: Miner Cost and Fee Estimation
sidebar_position: 10
---

## Configuring Cost and Fee Estimation

Fee and cost estimators can be configured via the config section `[fee_estimation]`:

```
[fee_estimation]
cost_estimator = naive_pessimistic
fee_estimator = fuzzed_weighted_median_fee_rate
fee_rate_fuzzer_fraction = 0.1
fee_rate_window_size = 5
cost_metric = proportion_dot_product
log_error = true
enabled = true
```

Fee and cost estimators observe transactions on the network and use the observed costs of those transactions to build estimates for viable fee rates
and expected execution costs for transactions.
Estimators and metrics can be selected using the configuration fields above, though the default values are the only options currently. `log_error` controls whether or not the INFO logger will display information about the cost estimator accuracy as new costs are observed. Setting `enabled = false` turns off the cost estimators.
Cost estimators are **not** consensus-critical components, but rather can be used by miners to rank transactions in the mempool or client to determine appropriate fee rates for transactions before broadcasting them.

The `fuzzed_weighted_median_fee_rate` uses a median estimate from a window of the fees paid in the last `fee_rate_window_size` blocks.
Estimates are then randomly "fuzzed" using uniform random fuzz of size up to `fee_rate_fuzzer_fraction` of the base estimate.
