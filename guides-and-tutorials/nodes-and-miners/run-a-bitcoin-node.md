# Running a Bitcoin Node

### **Requirements:**

This guide is written for a Unix based system. It's reasonable to expect some modifications will be required for other operating systems.

When started, the Bitcoin node will take several days to reach chain tip.

- Bitcoin Core >= v25.0
  - <https://github.com/bitcoin/bitcoin>
  - <https://bitcoincore.org/en/download/>
- Host with a minimum of:
  - 2 vCPU (a single dedicated cpu for the bitcoind process)
  - 4GB Memory (during sync, more available memory will improve sync time)
  - 1TB free disk space
- User account: `bitcoin:bitcoin`
- Chainstate directory located at: `/bitcoin/mainnet`
  - `bitcoin` user must have read/write access.
- Config directory located at: `/etc/bitcoin`
  - `bitcoin` user must have at least read access

---

### **Add bitcoin user and set file ownership**

```shell
$ sudo mkdir -p /bitcoin/mainnet
$ sudo mkdir /etc/bitcoin
$ sudo useradd bitcoin -d /bitcoin
$ sudo chown -R bitcoin:bitcoin /bitcoin /etc/bitcoin/
```

### **Bitcoin Config**

Below is a sample config used to sync a bitcoin node - feel free to adjust as needed.

{% hint style="info" %}
If using the [systemd unit below](#systemd-unit-file), save this file as `/etc/bitcoin/bitcoin.conf`
{% endhint %}

- `btuser:btcpass` is hardcoded as an rpcauth user/password ([generated using this script](https://github.com/bitcoin/bitcoin/tree/master/share/rpcauth)).
- Only localhost access is allowed (`127.0.0.1`) on the standard mainnet ports.
- `dbcache` is set to the maximum of 16GB.
- Wallet (and wallet rpc calls) are disabled.

```text
## [rpc]
# Accept command line and JSON-RPC commands.
server=1

# Allow JSON-RPC connections from specified source.
rpcallowip=127.0.0.1/0

# Bind to given address to listen for JSON-RPC connections.
rpcbind=127.0.0.1:8332

# Username and HMAC-SHA-256 hashed password for JSON-RPC connections.
#   Use the script at https://github.com/bitcoin/bitcoin/tree/master/share/rpcauth to generate
#   Note: may be specified multiple times for different users.
rpcauth=btcuser:18857b4df4b1f0f5e6b1d7884617ab39$de6e02e1da8ee138ee702e13e0637e24679d844756216b066c3aeac4bcac5e10 # btuser:btcpass

# Optional: rpcwhitelist can restrict listed RPC calls to specific rpcauth users.
#   Uncomment the below the restrict the `limited` user to a small subset of `get` commands
# rpcauth=limited:350c91a60895b567c4662c27e63e9a41$25188b0f51f2f974dcdc75c1e0d41174e8f7ae19fb96927abf68ac5bc1e8897b # limited:limited
# rpcwhitelist=limited:getblockchaininfo,getblock,getblockcount,getblockhash,getblockheader,getnetworkinfo
# rpcwhitelistdefault=0

## [core]
# Specify data directory
datadir=/bitcoin/mainnet
# Do not keep transactions in the mempool longer than <n> hours (default: 336)
mempoolexpiry=24
# Bind to given address and always listen on it (default: 0.0.0.0)
bind=127.0.0.1:8333
# Maximum database cache size <n> MiB (4 to 16384, default: 450). In addition, unused mempool memory is shared for this cache
dbcache=16384
# Maintain a full transaction index, used by the getrawtransaction rpc call
txindex=1

## [wallet]
# Do not load the wallet and disable wallet RPC calls
disablewallet=1
```

## Systemd unit file

ref: <https://github.com/bitcoin/bitcoin/blob/master/contrib/init/bitcoind.service>

```text
[Unit]
Description=Bitcoin daemon
Documentation=https://github.com/bitcoin/bitcoin/blob/master/doc/init.md

# https://www.freedesktop.org/wiki/Software/systemd/NetworkTarget/
After=network-online.target
Wants=network-online.target

[Service]
ExecStart=/usr/bin/bitcoind -pid=/run/bitcoind/bitcoind.pid \
                            -conf=/etc/bitcoin/bitcoin.conf \
                            -startupnotify='systemd-notify --ready' \
                            -shutdownnotify='systemd-notify --stopping'

# Make sure the config directory is readable by the service user
PermissionsStartOnly=true
ExecStartPre=/bin/chgrp bitcoin /etc/bitcoin

# Process management
####################

Type=notify
NotifyAccess=all
PIDFile=/run/bitcoind/bitcoind.pid

Restart=on-failure
TimeoutStartSec=infinity
TimeoutStopSec=600

# Directory creation and permissions
####################################

# Run as bitcoin:bitcoin
User=bitcoin
Group=bitcoin

# /run/bitcoind
RuntimeDirectory=bitcoind
RuntimeDirectoryMode=0710

# /etc/bitcoin
ConfigurationDirectory=bitcoin
ConfigurationDirectoryMode=0710

# /var/lib/bitcoind
StateDirectory=bitcoind
StateDirectoryMode=0710

# Hardening measures
####################

# Provide a private /tmp and /var/tmp.
PrivateTmp=true

# Mount /usr, /boot/ and /etc read-only for the process.
ProtectSystem=full

# Deny access to /home, /root and /run/user
ProtectHome=true

# Disallow the process and all of its children to gain
# new privileges through execve().
NoNewPrivileges=true

# Use a new /dev namespace only populated with API pseudo devices
# such as /dev/null, /dev/zero and /dev/random.
PrivateDevices=true

# Deny the creation of writable and executable memory mappings.
MemoryDenyWriteExecute=true

# Restrict ABIs to help ensure MemoryDenyWriteExecute is enforced
SystemCallArchitectures=native

[Install]
WantedBy=multi-user.target
```

### **Enable and start the Bitcoin service**

```shell
$ sudo systemctl daemon-reload
$ sudo systemctl enable bitcoin.service
$ sudo systemctl start bitcoin.service
```

{% hint style="info" %}
Once started, you may track the sync progress:

```text
$ sudo tail -f /bitcoin/mainnet/debug.log
2024-12-05T19:35:31Z UpdateTip: new best=00000000000000000058990a84cc8f8eab25dbbd572f123f9190cea7256d7349 height=509258 version=0x20000000 log2_work=88.128280 tx=299522737 date='2018-02-15T03:42:14Z' progress=0.295203 cache=43.5MiB(172740txo)
...
$ bitcoin-cli \
    -rpcconnect=127.0.0.1 \
    -rpcport=8332 \
    -rpcuser=btcuser \
    -rpcpassword=btcpass \
    getblockcount
509016
```

{% endhint %}
