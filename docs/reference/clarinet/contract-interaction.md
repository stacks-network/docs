# Contract Interaction

Clarinet provides powerful tools for interacting with your contracts during development. The console gives you an interactive REPL where you can call functions, inspect state, and debug issues in real time.

## Starting the console

Use `clarinet console` to launch an interactive session with your contracts deployed to a local simulated blockchain:

```bash
clarinet console
```

Sample startup output:

```
clarity-repl v3.3.0
Enter "::help" for usage hints.
Connected to a transient in-memory database.
```

The console supports several useful flags for different development scenarios:

| Option                                  | Description                                           |
| --------------------------------------- | ----------------------------------------------------- |
| `--enable-remote-data`                  | Connect to mainnet or testnet to query real contracts |
| `--deployment-plan-path <path>`         | Use a specific deployment plan                        |
| `--manifest-path <path>`                | Use an alternate `Clarinet.toml` location             |
| `--remote-data-api-url <url>`           | Specify a custom Stacks API endpoint                  |
| `--remote-data-initial-height <height>` | Set the starting block height for remote data         |

## Working with remote data

One of the most powerful features is the ability to interact with real mainnet or testnet contracts from your local console. This lets you test against actual deployed contracts:

```bash
clarinet console --enable-remote-data
```

Example contract calls:

```clarity
(contract-call? 'SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token get-decimals)
;; (ok u8)

(contract-call? 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.arkadiko-token get-name)
;; (ok "Arkadiko Token")
```

These capabilities help you:

* Test integrations with existing protocols
* Verify contract behavior against live chain state
* Develop contracts that depend on mainnet deployments

> **Warning: Remote data requirements**
>
> Before using remote data, add the target contract to `Clarinet.toml` with `clarinet requirements add SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token`.

### Using the Hiro API key

Avoid rate limits by setting the `HIRO_API_KEY` environment variable before launching the console. Clarinet forwards this key in the `x-api-key` header for all requests:

```bash
export HIRO_API_KEY=your_api_key_here
clarinet console --enable-remote-data
```

You can request a free API key from the Hiro Platform.

### Working with contracts

List all available contracts in the session:

```clarity
::get_contracts
;; +---------------------------------------------------------+----------------------+
;; | Contract identifier                                    | Public functions    |
;; |---------------------------------------------------------+----------------------|
;; | ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.counter      | (count-up)          |
;; |                                                         | (get-count (who ...))|
;; +---------------------------------------------------------+----------------------+

(contract-call? .counter count-up)
;; (ok true)

(contract-call? .counter get-count tx-sender)
;; u1
```

### Working with different principals

Switch between the provided test wallets to validate multi-user flows:

```clarity
::get_assets_maps
;; +-------------------------------------------+-----------------+
;; | Address                                   | uSTX            |
;; |-------------------------------------------+-----------------|
;; | ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM | 100000000000000 |
;; | ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5 | 100000000000000 |
;; ...

::set_tx_sender ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5
;; tx-sender switched to ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5
```

### Working with block heights

Advance the chain to test time-dependent logic:

```clarity
::get_block_height
;; Current block height: 4

::advance_chain_tip 100
;; new burn height: 3
;; new stacks height: 104

::get_block_height
;; Current block height: 104
```

> **Tip: Console reference**
>
> For a complete list of console commands, see the [CLI reference](cli-reference.md).

## Common issues

<details>

<summary>Contract not found errors</summary>

If you see `use of unresolved contract` errors, the contract may not be deployed or the name might be incorrect:

```clarity
(contract-call? .missing-contract get-value)
;; error: use of unresolved contract
```

Solutions:

* Check for typos in the contract identifier
* Confirm the contract is deployed in the current session with `::get_contracts`
* Use the correct prefix (`.` for local contracts)

</details>

<details>

<summary>Remote data connection issues</summary>

When you enable remote data, rate limits or connectivity problems can occur:

```clarity
(contract-call? 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.arkadiko-token get-name)
;; error: API rate limit exceeded
```

**Solutions:**

1. Set your Hiro API key: `export HIRO_API_KEY=your_key_here`
2. Use a custom API endpoint: `--remote-data-api-url https://your-node.com`
3. Wait for rate limit to reset (usually 1 minute)

</details>

##
