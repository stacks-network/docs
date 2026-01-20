Module 3: Simulating Nakamoto Speeds (Custom Devnet Config)
Author: @jadonamite
Difficulty: Intermediate
Time: 15 Minutes
One of the defining features of the Nakamoto Release is "Fast Blocks." Instead of waiting 10+ minutes for a Bitcoin block to confirm your transaction, Stacks miners now produce blocks every few seconds.
However, when developing, you often have two opposing needs:
Speed: You want instant feedback (fast blocks) to iterate quickly.
Realism: You want to simulate network latency or the "Pre-Nakamoto" environment to test migration scripts or edge cases.
This module covers how to fine-tune your local Devnet.toml to control time itself.
1. The Configuration File: Devnet.toml
When you ran clarinet integrate (or the Docker setup from Module 1), Clarinet generated a settings/Devnet.toml file. This is the control center for your private blockchain simulation.
Open settings/Devnet.toml.
2. Adjusting the Heartbeat: Bitcoin Block Time
The Stacks chain is anchored to Bitcoin. In a standard Devnet, we don't want to wait 10 minutes for a Bitcoin anchor block.
Find the [devnet.bitcoin_node] section.
Scenario A: "The Speedster" (Default Dev Experience)
For rapid UI development, we want Bitcoin blocks to arrive quickly so "settlement" happens fast.
Ini, TOML[devnet.bitcoin_node]
# ... other settings
# Generate a Bitcoin block every 5 seconds
block_time = 5000 
Scenario B: "The Realist" (Production Simulation)
If you are testing how your app handles long confirmation times (e.g., checking if your UI correctly shows "Pending" states), slow it down.
Ini, TOML[devnet.bitcoin_node]
# Generate a Bitcoin block every 10 minutes (600,000 ms)
block_time = 600000 
3. Configuring Nakamoto Fast Blocks
Nakamoto isn't just about faster Bitcoin blocks; it's about Stacks blocks being produced between Bitcoin blocks. This is controlled by the Epoch settings.
We need to ensure our Devnet boots up in (or transitions to) Epoch 3.0 (Nakamoto).
In settings/Devnet.toml, look for the [devnet.stacks_node] or [devnet] root settings.
Activating Nakamoto Immediately
To start the chain in Nakamoto mode (Clarity 3, Fast Blocks):
Ini, TOML[devnet]
# Boot immediately into Nakamoto
epoch_2_0 = 0
epoch_2_05 = 0
epoch_2_1 = 0
epoch_2_2 = 0
epoch_2_3 = 0
epoch_2_4 = 0
epoch_3_0 = 0 # Nakamoto activates at block 0
Simulating the Transition (The "Hard Fork" Test)
If you have an existing contract and want to ensure it survives the upgrade from Stacks 2.5 to Nakamoto, you can schedule the activation in the future.
Ini, TOML[devnet]
# Boot in Stacks 2.5
epoch_2_5 = 0
# Activate Nakamoto at Bitcoin Block 20
epoch_3_0 = 20 
Why do this?
To test Pox-4 stacking flow changes.
To verify that block-height logic in your contracts (like our Time-Locked Vault) behaves correctly when block production accelerates.
4. The "Tenure" Configuration
In Nakamoto, a miner has "tenure" to produce many blocks per Bitcoin block. You can tweak how aggressive this is in the Stacks Node config (mapped in Devnet.toml).
Ini, TOML[devnet.stacks_node]
# ...
# Simulate a miner producing a Stacks block every 2 seconds
# independent of the Bitcoin block time defined above.
miner_block_time = 2000
Result: If Bitcoin blocks are 10 minutes (600,000ms) and Stacks blocks are 2 seconds (2,000ms), you will see ~300 Stacks blocks per Bitcoin block.
Observation: In your terminal logs, you will see mined_block events rapid-firing, followed by a bitcoin_anchor event.
5. Verifying the Behavior
Restart your Devnet:
Bashclarinet integrate
# OR if using the Docker setup from Module 1
docker-compose down && docker-compose up -d

Observe the Logs:
Fast Mode: You should see "Processing Bitcoin Block" messages scrolling rapidly.
Transition Mode: You will see "Slow" blocks initially. Once the chain tip hits Block 20 (your configured epoch), you will see log messages indicating Epoch 3.0 active and the block production rate will visibly increase if you have miner_block_time configured.
6. Common Pitfalls
"My contract stopped working after Epoch 3.0"
In Nakamoto, block-height increases much faster. If you wrote (lock 10) thinking "10 blocks = 100 minutes" (old style), in Nakamoto "10 blocks" might be "50 seconds".
Fix: Always calculate time based on expected block times or, better yet, just be aware that block-height is now a "tick" counter, not a reliable clock for long durations.
"Clarinet keeps resetting my config"
If you re-run clarinet integrate without flags, it might regenerate settings/Devnet.toml.
Fix: Once you have edited settings/Devnet.toml, verify your changes before booting
