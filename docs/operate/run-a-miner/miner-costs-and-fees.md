# Miner Costs and Fees

### Configuring Cost and Fee Estimation

{% code title="config.toml" %}
```toml
[fee_estimation]
cost_estimator = naive_pessimistic
fee_estimator = fuzzed_weighted_median_fee_rate
fee_rate_fuzzer_fraction = 0.1
fee_rate_window_size = 5
cost_metric = proportion_dot_product
log_error = true
enabled = true
```
{% endcode %}

Fee and cost estimators observe transactions on the network and use the observed costs of those transactions to build estimates for viable fee rates and expected execution costs. Estimators and metrics can be selected using the configuration fields above (the defaults shown are currently the only options). `log_error` controls whether the INFO logger will display information about cost estimator accuracy as new costs are observed. Setting `enabled = false` turns off the cost estimators.

{% hint style="info" %}
Cost estimators are not consensus-critical components — they are intended for miners to rank mempool transactions or for clients to pick appropriate fee rates before broadcasting.
{% endhint %}

The `fuzzed_weighted_median_fee_rate` estimator:

* uses a median estimate from a window of the fees paid in the last `fee_rate_window_size` blocks, and
* then applies a uniform random "fuzz" up to `fee_rate_fuzzer_fraction` of the base estimate.

<details>

<summary>Mining calculator (external)</summary>

There is a mining calculator that can help with this process: https://friedger.github.io/mining-calculator/\
Source code: https://github.com/friedger/mining-calculator

</details>
