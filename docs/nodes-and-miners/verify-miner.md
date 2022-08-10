---
title: Verify Miner
description: Verify node is operating as miner
---

You can verify that your node is operating as a miner by checking its log output to verify that it was able to find its Bitcoin UTXOs:

```bash
$ head -n 100 /path/to/your/node/logs | grep -i utxo
INFO [1630127492.031042] [testnet/stacks-node/src/run_loop/neon.rs:146] [main] Miner node: checking UTXOs at address: <redacted>
INFO [1630127492.062652] [testnet/stacks-node/src/run_loop/neon.rs:164] [main] UTXOs found - will run as a Miner node
```