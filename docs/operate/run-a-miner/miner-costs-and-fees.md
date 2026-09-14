# Miner Costs and Fees

### Configuring Cost and Fee Estimation

{% code title="config.toml" %}
```toml
[fee_estimation]
cost_estimator = naive_pessimistic
fee_estimator = scalar_fee_rate
fee_rate_fuzzer_fraction = 0.1
fee_rate_window_size = 5
cost_metric = proportion_dot_product
log_error = false
enabled = true
```
{% endcode %}

Fee and cost estimators observe network transactions and build estimates for viable fee rates and expected execution costs from the costs they see. `log_error` controls whether the INFO logger will display information about cost estimator accuracy as new costs are observed. Setting `enabled = false` turns off the cost estimators.

Accepted values, as of stacks-core `4.0.3`:

| Key              | Accepted values                                      | Default                  |
| ---------------- | ---------------------------------------------------- | ------------------------ |
| `cost_estimator` | `naive_pessimistic`                                  | `naive_pessimistic`      |
| `fee_estimator`  | `scalar_fee_rate`, `fuzzed_weighted_median_fee_rate` | `scalar_fee_rate`        |
| `cost_metric`    | `proportion_dot_product`                             | `proportion_dot_product` |

The sample above is the default configuration. The node lowercases each value and panics at startup on anything else.

{% hint style="info" %}
Cost estimators are not consensus-critical components: they are intended for miners to rank mempool transactions or for clients to pick appropriate fee rates before broadcasting.
{% endhint %}

The `fuzzed_weighted_median_fee_rate` estimator:

* uses a median estimate from a window of the fees paid in the last `fee_rate_window_size` blocks, and
* then applies a uniform random "fuzz" up to `fee_rate_fuzzer_fraction` of the base estimate.

### The Epoch 4.0 block read budget

Epoch 4.0 doubles the read fields of the Clarity block execution budget. Write and runtime limits are unchanged.

| Field          | Epoch 2.1 through 3.4 | Epoch 4.0     |
| -------------- | --------------------- | ------------- |
| `read_length`  | 100,000,000           | 200,000,000   |
| `read_count`   | 15,000                | 30,000        |
| `write_length` | 15,000,000            | 15,000,000    |
| `write_count`  | 15,000                | 15,000        |
| `runtime`      | 5,000,000,000         | 5,000,000,000 |

This is the per-block budget, not the per-function cost table. Individual Clarity function costs are unchanged, so a block reaches its read limit at twice the previous volume. The config keys and estimator names above are unaffected.

Read the limits your node is enforcing:

```bash
curl -s http://localhost:20443/v2/pox \
  | jq '.epochs[] | select(.epoch_id=="Epoch40") | .block_limit'
```

<details>

<summary>Mining calculator (external)</summary>

Mining calculator: https://friedger.github.io/mining-calculator/

Source: https://github.com/friedger/mining-calculator

</details>
