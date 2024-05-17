# Sample Configuration Files

Below are sample configuration files for running a Stacks node and signer provided in one place for convenience. You'll need to modify some of these according to the [How to Run a Signer](running-a-signer.md) doc.

### Testnet Signer

```toml
# The IP address and port where your Stacks node can be accessed. 
# The port 20443 is the default RPC endpoint for Stacks nodes. 
# Note that you must use an IP address - DNS hosts are not supported at this time.
# This should be the IP address accessible via Docker, usually via a network.
node_host = "127.0.0.1:20443"

# This is the location where the signer will expose an RPC endpoint for 
# receiving events from your Stacks node.
endpoint = "0.0.0.0:30000"

# Either “testnet” or “mainnet”
network = "testnet"

# this is a file path where your signer will persist data. If using Docker, 
# this must be within a volume, so that data can be persisted across restarts
db_path = "/var/stacks/signer.sqlite"

# an authentication token that is used for some HTTP requests made from the 
# signer to your Stacks node. You’ll need to use this later on when configuring 
# your Stacks node. You create this field yourself, rather than it being generated 
# with your private key.
auth_password = "$your_http_auth_token"

# This is the privateKey field from the keys you generated in the 
# previous step.
stacks_private_key = "$your_stacks_private_key"
```

### Nakamoto Testnet Stacks Node

{% hint style="info" %}
Note that this example configuration file applies to the Nakamoto Testnet, not the Primary Testnet. The Primary Testnet is currently undergoing a major update and it is recommended to use the Nakamoto Testnet for the time being.
{% endhint %}

This is the configuration you'll need to run a Stacks follower node if you are also running a signer. Be sure to change the commented lines to the appropriate data for your setup. If you are not familiar with the process of setting up a signer, be sure to follow the [How to Run a Signer](running-a-signer.md) guide.

An overview of all Stacks node configuration options can be found in the [Stacks Node Configuration](../../stacks-in-depth/nodes-and-miners/stacks-node-configuration.md) doc.

Additions necessary specifically to run a signer are the `[connection_options]` and `[[events_observer]]` sections and the `stacker = true` line. There are also a few comments detailing other lines that need to change.

```toml
[node]
# Set this based on where you downloaded 
# the chain state archive as described in the How to Run a Signer guide:
working_dir = "/stacks-blockchain/data"
rpc_bind = "0.0.0.0:20443"
p2p_bind = "0.0.0.0:20444"
# This is the node that your node will use to begin syncing chain state
bootstrap_node = "0341b2ff35b545d8e5c5d2fc8821484610ef85ce8e276214caf23d53be16fdcd65@seed.nakamoto.regtest.hiro.so:50444"
wait_time_for_microblocks = 0
mine_microblocks = false

[burnchain]
chain = "bitcoin"
mode = "krypton"
magic_bytes = "N3"
poll_time_secs = 30
pox_prepare_length = 100
pox_reward_length = 900
peer_host = "bitcoin.nakamoto.regtest.hiro.so"
username = "hirosystems"
password = "hirosystems"
burnchain_op_tx_fee = 5500
commit_anchor_block_within = 300000
rpc_port = 18543
peer_port = 18544
#satoshis_per_byte = 20
first_burn_block_height = 230
first_burn_block_timestamp = 1714513150
first_burn_block_hash = "654e1e9f66701d4f8a138b46d4cf0cc26665688175bcbb1700729efbf759e57d"

# Set your auth token, which the signer uses
# This should match the auth_password field of your signer config
[connection_options]
block_proposal_token = "12345"

# Set your signer as an event observer
[[events_observer]]
# This endpoint is where your signer will communicate with your Stacks node
endpoint = "127.0.0.1:30000"
retry_count = 255
include_data_events = false
events_keys = ["stackerdb", "block_proposal", "burn_blocks"]

[[burnchain.epochs]]
epoch_name = "1.0"
start_height = 0

[[burnchain.epochs]]
epoch_name = "2.0"
# start_height = 2000000 # real epoch start height
start_height = 230

[[burnchain.epochs]]
epoch_name = "2.05"
# start_height = 2104380 # real epoch start height
start_height = 240

[[burnchain.epochs]]
epoch_name = "2.1"
# start_height = 2422101 # real epoch start height
start_height = 241

[[burnchain.epochs]]
epoch_name = "2.2"
# start_height = 2431300 # real epoch start height
start_height = 242

[[burnchain.epochs]]
epoch_name = "2.3"
# start_height = 2431633 # real epoch start height
start_height = 243

[[burnchain.epochs]]
epoch_name = "2.4"
# start_height = 2432545 # real epoch start height
start_height = 244

[[burnchain.epochs]]
epoch_name = "2.5"
start_height = 245

[[burnchain.epochs]]
epoch_name = "3.0"
start_height = 41111

[[ustx_balance]]
address = "ST0DZFQ1XGHC5P1BZ6B7HSWQKQJHM74JBGCSDTNA"
amount = 10000000000000000

[[ustx_balance]]
address = "ST2G2RJR4B5M95D0ZZAGZJP9J4WH090WHP0C5YW0H"
amount = 10000000000000000

[[ustx_balance]]
address = "ST3JCQJE9NZRCAPPE44Q12KR7FH8AY9HTEMWP2G5F"
amount = 10000000000000000

[[ustx_balance]]
address = "STA0EP5GD8FC661T8Q0Z382QW7Z6JXDM3E476MB7"
amount = 17500000000000

[[ustx_balance]]
address = "ST3MNK12DGQF7JN4Q0STK6926VWE5MN21KJ4EGV0E"
amount = 10000000000000000

[[ustx_balance]]
address = "ST484MS3VACPAZ90WHC21XQ7T6XANCV341HJYE0W"
amount = 10000000000000000

[[ustx_balance]]
address = "ST2D1M978SCE52GAV07VXSRC9DQBP69X5WHX0DHN5"
amount = 10000000000000000

[[ustx_balance]]
address = "ST2A68NMMXVZDWDTDZ5GJGA69M86V8KK0JS9X1QQP"
amount = 10000000000000000

[[ustx_balance]]
address = "ST2ME1CR5XR0P332SBTSD90P9HG48F1SK8MZVJ3XW"
amount = 10000000000000000

[[ustx_balance]]
address = "ST19MXV72S9HHRSZCDY10K9DMB11JYPTXVVNYAWPH"
amount = 10000000000000000

[[ustx_balance]]
address = "ST20Q2N56E1NBWE37R4VGSF89X4HHTB3GSMD8GKYW"
amount = 10000000000000000

[[ustx_balance]]
address = "ST2Q6124HQFKVKPJSS5J6156BJR74FD6EC1297HJ1"
amount = 10000000000000000

[[ustx_balance]]
address = "ST1114TBQYGNPGFAVXKWBKZAHP0X7ZGX9K6XYYE4F"
amount = 10000000000000000

[[ustx_balance]]
address = "ST1NCEQ0T4Z32QTYT88BNXJKC9HR3VWYHJ0TB95TP"
amount = 10000000000000000

[[ustx_balance]]
address = "STWF12K119FTA70NDG29MNYWR0CPMF44ZKC2SG2T"
amount = 24378281250000

[[ustx_balance]]
address = "ST36G5CRHH1GJVZGFWPTW4H9GSA8VAVWM0ST7AV82"
amount = 24378281250000

[[ustx_balance]]
address = "ST2KWFMX0SVXFMZ0W7TXZ3MV0C6V276BNAT49XAQW"
amount = 24378281250000

[[ustx_balance]]
address = "ST1ZMVDYKGWF5TFGH46GEFBR273JJ3RRTHEDETKNH"
amount = 24378281250000

[[ustx_balance]]
address = "ST3D0TEK871ZMBFFF0998YY609A1QGM6ZTYCQJJFQ"
amount = 24378281250000

[[ustx_balance]]
address = "ST372ND8K8M3GKESD0KG8ZWJ6EV0GGXWXC5246MJN"
amount = 24378281250000

[[ustx_balance]]
address = "ST33PA4H3TW3DQFHG2RXPGGW1FFG5YQJ704B3DA8M"
amount = 24378281250000

[[ustx_balance]]
address = "STJ737JNPK525J86BGSPAW362SRRAYC4SP6F95HC"
amount = 24378281250000

[[ustx_balance]]
address = "ST21AJANGK9NA2ZED5D5J1VZPTVW8DY05B0ECMFN"
amount = 24378281250000

[[ustx_balance]]
address = "ST30Z74A4S2T8563D844ENSBHBFSVQEVBPV9S0A7E"
amount = 24378281250000

[[ustx_balance]]
address = "ST2FGTGYAGJVXJZQX17NBJNSQAM4J2V5JFDHEEAZQ"
amount = 24378281250000

[[ustx_balance]]
address = "ST16PC3G9BMQH0G37JGAGDGYZPDB5NGNARBDFPWYB"
amount = 24378281250000

[[ustx_balance]]
address = "ST1XJHGBSQPV9B14HFYG98ZBSQGKG8GN0AMB3V2VT"
amount = 24378281250000

[[ustx_balance]]
address = "ST2XDC0R30841X2RRECWV2F9KTANKQEERPS4V3H9D"
amount = 24378281250000

[[ustx_balance]]
address = "ST2HC6JENRNNE6YVATT7WZVZWVR5J26BGYX67W8G7"
amount = 24378281250000

[[ustx_balance]]
address = "STPW2CGZC98EZ95XYC9DE93SFBS5KA2PYYK89VHM"
amount = 24378281250000

[[ustx_balance]]
address = "STNX3E9MYTA2ZDQK53YNMMJ3E7783DC019JZNYZZ"
amount = 24378281250000

[[ustx_balance]]
address = "ST0D135PF2R0S4B6S4G49QZC69KF19MSZ4Z5RDF5"
amount = 24378281250000
```

### Mainnet Signer

This config is very similar to the testnet config, except the `network` field is changed.

```toml
# The IP address and port where your Stacks node can be accessed. 
# The port 20443 is the default RPC endpoint for Stacks nodes. 
# Note that you must use an IP address - DNS hosts are not supported at this time.
# This should be the IP address accessible via Docker, usually via a network.
node_host = "127.0.0.1:20443"

# This is the location where the signer will expose an RPC endpoint for 
# receiving events from your Stacks node.
endpoint = "0.0.0.0:30000"

# Either “testnet” or “mainnet”
network = "mainnet"

# this is a file path where your signer will persist data. If using Docker, 
# this must be within a volume, so that data can be persisted across restarts
db_path = "/var/stacks/signer.sqlite"

# an authentication token that is used for some HTTP requests made from the 
# signer to your Stacks node. You’ll need to use this later on when configuring 
# your Stacks node. You create this field yourself, rather than it being generated 
# with your private key.
auth_password = "$your_http_auth_token"

# This is the privateKey field from the keys you generated in the 
# previous step.
stacks_private_key = "$your_stacks_private_key"
```

### Mainnet Stacks Node

With a mainnet Stacks node config, you'll need to change the bootstrap node field and the burnchain fields. Other than that, the `ustx_balance` fields are not necessary.

```toml
[node]
# Set this based on where you downloaded 
# the chain state archive as described in the How to Run a Signer guide:
working_dir = "/data-dir-somewhere"
rpc_bind = "0.0.0.0:20443"
p2p_bind = "0.0.0.0:20444"
# This is the node that your node will use to begin syncing chain state
bootstrap_node = "02196f005965cebe6ddc3901b7b1cc1aa7a88f305bb8c5893456b8f9a605923893@seed.mainnet.hiro.so:20444,02539449ad94e6e6392d8c1deb2b4e61f80ae2a18964349bc14336d8b903c46a8c@cet.stacksnodes.org:20444,02ececc8ce79b8adf813f13a0255f8ae58d4357309ba0cedd523d9f1a306fcfb79@sgt.stacksnodes.org:20444,0303144ba518fe7a0fb56a8a7d488f950307a4330f146e1e1458fc63fb33defe96@est.stacksnodes.org:20444"
stacker = true

[burnchain]
chain = "bitcoin"
mode = "mainnet"
peer_host = "bitcoind.stacks.co"
username = "blockstack"
password = "blockstacksystem"
rpc_port = 8332
peer_port = 8333

# Set your auth token, which the signer uses
# This should match the auth_password field of your signer config
[connection_options]
block_proposal_token = "12345"

# Set your signer as an event observer
[[events_observer]]
# This endpoint is where your signer will communicate with your Stacks node
endpoint = "127.0.0.1:30000"
retry_count = 255
include_data_events = false
events_keys = ["stackerdb", "block_proposal", "burn_blocks"]
```
