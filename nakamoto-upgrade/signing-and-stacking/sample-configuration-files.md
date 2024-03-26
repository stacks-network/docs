# Sample Configuration Files

Below are sample configuration files for running a Stacks node and signer provided in one place for convenience. You'll need to modify some of these according to the [How to Run a Signer](running-a-signer.md) doc.

### Signer

```toml
# The IP address and port where your Stacks node can be accessed. 
# The port 20443 is the default RPC endpoint for Stacks nodes. 
# Note that you must use an IP address - DNS hosts are not supported at this time.
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

# This is the hex-encoded privateKey field from the keys you generated in the 
# previous step.
stacks_private_key = "$your_stacks_private_key"
```

### Stacks Node

This is the configuration you'll need to run a Nakamoto Stacks follower node if you are also running a signer. Be sure to change the commented lines to the appropriate data for your setup.

An overview of all Stacks node configuration options can be found in the [Stacks Node Configuration](../../stacks-in-depth/nodes-and-miners/stacks-node-configuration.md) doc.

Additions necessary specifically to run a signer are the `[connection_options]` and `[[events_observer]]` sections and the `stacker = true` line. There are also a few comments detailing other lines that need to change.

```toml
[node]
rpc_bind = "0.0.0.0:20443"
p2p_bind = "0.0.0.0:20444"
local_peer_seed = "CHANGE ME" # Change to any 64-character hexidecimal string
bootstrap_node = "02fa2ee45aa9aebd3707b43a09e13571bbdc216e48232091dcdd805012cfffdb8b@seed.nakamoto.testnet.hiro.so:40444"
prometheus_bind = "0.0.0.0:9153"
working_dir = "/change/me" # Change to data directory you would like to use for your node
wait_time_for_microblocks = 0
mine_microblocks = false
stacker = true # required if you are running a signer

[connection_options]
block_proposal_token = "12345" # any string, must match the `auth_password` in signer config

[[events_observer]]
endpoint = "$your_signer_endpoint" # change to your signer endpoint
retry_count = 255
include_data_events = false
events_keys = ["stackerdb", "block_proposal"]

[burnchain]
chain = "bitcoin"
mode = "xenon"
magic_bytes = "N3"
pox_prepare_length = 5
pox_reward_length = 20
peer_host = "bitcoind.testnet.stacks.co"
username = "blockstack"
password = "blockstacksystem"
burnchain_op_tx_fee = 5500
commit_anchor_block_within = 300000
rpc_port = 18332
peer_port = 18333
satoshis_per_byte = 20
first_burn_block_height = 2583232
first_burn_block_timestamp = 1711238511
first_burn_block_hash = "000000000000db6864215e5f52067f6418884560a205cb990d13acc350743aaf"

[[burnchain.epochs]]
epoch_name = "1.0"
start_height = 0

[[burnchain.epochs]]
epoch_name = "2.0"
start_height = 2583232

[[burnchain.epochs]]
epoch_name = "2.05"
start_height = 2583245

[[burnchain.epochs]]
epoch_name = "2.1"
start_height = 2583246

[[burnchain.epochs]]
epoch_name = "2.2"
start_height = 2583247

[[burnchain.epochs]]
epoch_name = "2.3"
start_height = 2583248

[[burnchain.epochs]]
epoch_name = "2.4"
start_height = 2583249

[[burnchain.epochs]]
epoch_name = "2.5"
start_height = 2583250

[[burnchain.epochs]]
epoch_name = "3.0"
start_height = 3000000

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
