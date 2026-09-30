# Run a Node Behind a Proxy

{% hint style="warning" %}
Running a publicly accessible node exposes your infrastructure to the open internet. The proxy configurations below are starting points, not complete security solutions. **Do this at your own risk.** You are responsible for securing and maintaining your own infrastructure.
{% endhint %}

If you plan to run a Stacks node with publicly accessible RPC endpoints, it is strongly recommended at a minimum to place the node behind a reverse proxy with rate limiting. Without rate limiting, a public node can be overwhelmed by excessive requests, leading to degraded performance or denial of service.

This guide provides minimal, production-tested configurations for two popular reverse proxies. **Choose one — you do not need both:**

- [**Nginx**](#nginx) — simpler configuration, widely used, good baseline rate limiting.
- [**HAProxy**](#haproxy) — more advanced abuse detection via stick tables, HTTP proxying with automatic IP blocking.

### Ports overview

A Stacks node deployment typically exposes the following services:

| Service     | Default Port | Protocol | Proxy?                 |
| ----------- | ------------ | -------- | ---------------------- |
| Stacks RPC  | 20443        | HTTP     | Yes                    |
| Stacks P2P  | 20444        | TCP      | No, rate-limit instead |
| Stacks API  | 3999         | HTTP     | Yes, if running        |
| Bitcoin RPC | 8332         | HTTP     | Yes, if exposed        |
| Bitcoin P2P | 8333         | TCP      | No                     |

{% hint style="info" %}
The **P2P ports** (20444, 8333) use custom binary protocols for peer-to-peer communication, not HTTP, so they are left open directly to the network rather than proxied. The proxy configurations below focus on the **RPC/API ports** which serve HTTP traffic and are the primary target for abuse.

**The Stacks P2P port still needs rate limiting.** A denial-of-service attack could flood inbound connection slots so the node's neighbor set fills with malicious or junk peers, starving honest ones. Because this port cannot be proxied, apply the limits at the firewall instead — see [Rate-limit the Stacks P2P port](#rate-limit-the-stacks-p2p-port).
{% endhint %}

## Configure the Stacks node

Before setting up the proxy, configure your Stacks node so its RPC endpoint is not directly reachable from the public internet (i.e. for stacks-node configuration -`rpc_bind = "127.0.0.1:30443"`). The proxy will be the only public-facing service.

Since the proxy needs to listen on the standard public ports (e.g. `20443`), the node itself must bind to **different** ports to avoid conflicts. The examples below use offset ports (`30443`, `33999`) for the node's RPC and API, while the proxy owns the public-facing ports (`20443`, `3999`). P2P stays on its standard port and is not proxied.

### Bare metal

In your node's configuration file (e.g. `Stacks.toml`), bind the RPC to a localhost address on an offset port:

{% code title="Stacks.toml" %}

```toml
[node]
rpc_bind = "127.0.0.1:30443"    # Only accessible from localhost, offset port
p2p_bind = "0.0.0.0:20444"      # Standard port, open directly to the network
# data_url = "http://<your-public-ip>:20443"  # Uncomment if peers need to reach your RPC
```

{% endcode %}

The proxy will listen on port `20443` and forward RPC traffic to the offset port. P2P binds directly on the standard port `20444` and does not go through the proxy.

### Docker (stacks-blockchain-docker)

When running with [stacks-blockchain-docker](https://github.com/stacks-network/stacks-blockchain-docker), the node's ports are controlled by the Docker Compose configuration. By default, ports are exposed on all interfaces (`0.0.0.0`). To restrict the RPC and API to localhost (so only the proxy can reach them), edit `compose-files/common.yaml` and change the port mappings. P2P is published directly on the standard port:

{% code title="compose-files/common.yaml (port changes)" %}

```yaml
services:
  stacks-blockchain:
    ports:
      - 127.0.0.1:30443:20443   # RPC: only localhost, host port 30443
      - 0.0.0.0:20444:20444     # P2P: open directly, standard port
      - 127.0.0.1:9153:9153     # Metrics: only localhost
  stacks-blockchain-api:
    ports:
      - 127.0.0.1:33999:3999    # API: only localhost, host port 33999
```

{% endcode %}

The format is `host_ip:host_port:container_port`. The node inside the container keeps its default ports — only the **host** side changes. Offset host ports (`30443`, `33999`) are necessary because the proxy already occupies the standard ports (`20443`, `3999`) on the host. Binding to `127.0.0.1` ensures the container ports are only reachable from the host (where the proxy runs), not from the public internet. P2P is published directly on the standard port `20444`.

{% hint style="info" %}
Inter-container communication (e.g. the API receiving events from the blockchain node) uses Docker's internal network and service names, not published host ports. These port mapping changes do not affect container-to-container traffic.
{% endhint %}

## Rate-limit the Stacks P2P port

The P2P port (`20444`) is not proxied, so its rate limiting is applied at the firewall. This step is independent of which proxy you chose above — do it either way.

The node does impose its own inbound limits (`soft_max_clients_per_host`, default 4, and `max_sockets`, default 800), but those only take effect **after** a connection has been accepted and registered. A firewall rule rejects the flood earlier and far more cheaply.

{% hint style="warning" %}
**Do not put Nginx `stream` or HAProxy `mode tcp` in front of port 20444.** The Stacks node does not read the PROXY protocol header, so a TCP proxy makes every peer appear to originate from `127.0.0.1`. Per-host limits collapse into a single bucket and the peer database records the proxy's address instead of real peers. Firewall-level limiting preserves the true source IPs.
{% endhint %}

### nftables (recommended)

The rules below cap both the number of **concurrent** P2P connections per source IP and the rate of **new** connections per source IP. The concurrent cap is deliberately set above the node's `soft_max_clients_per_host` so the node's own pruning still does the fine-grained work.

{% code title="/etc/nftables.d/stacks-p2p.nft" %}

```
table inet stacks_p2p {
    chain input {
        type filter hook input priority filter; policy accept;

        # Optional: exempt known bootstrap or partner peers
        # tcp dport 20444 ip saddr { 203.0.113.10, 198.51.100.7 } accept

        # Cap concurrent P2P connections per source IP
        tcp dport 20444 ct state new \
            meter p2p_conns { ip saddr ct count over 8 } \
            counter drop

        # Cap new P2P connections per source IP (10/min, burst of 5)
        tcp dport 20444 ct state new \
            meter p2p_rate { ip saddr limit rate over 10/minute burst 5 packets } \
            counter drop
    }
}
```

{% endcode %}

{% code title="Load the rules" %}

```bash
sudo nft -f /etc/nftables.d/stacks-p2p.nft
```

{% endcode %}

{% hint style="info" %}
This adds a separate table with `policy accept`, so it drops only what the two rules match and leaves any existing firewall untouched. To make it persistent across reboots, include the file from your `/etc/nftables.conf` or your distribution's equivalent.
{% endhint %}

### iptables

If your host uses `iptables` rather than `nftables`, the equivalent rules use the `connlimit` and `hashlimit` modules:

{% code title="iptables equivalent" %}

```bash
# Cap concurrent P2P connections per source IP
sudo iptables -A INPUT -p tcp --dport 20444 --syn \
    -m connlimit --connlimit-above 8 --connlimit-mask 32 -j DROP

# Cap new P2P connections per source IP (10/min, burst of 5)
sudo iptables -A INPUT -p tcp --dport 20444 --syn \
    -m hashlimit --hashlimit-name stacks_p2p \
    --hashlimit-mode srcip --hashlimit-above 10/minute --hashlimit-burst 5 \
    -j DROP
```

{% endcode %}

### Docker (stacks-blockchain-docker)

Traffic to a **published** container port is forwarded, not delivered locally, so it never traverses the `INPUT` chain — the rules above will not match it. Place them in Docker's `DOCKER-USER` chain instead:

{% code title="Docker equivalent" %}

```bash
sudo iptables -I DOCKER-USER -p tcp --dport 20444 --syn \
    -m connlimit --connlimit-above 8 --connlimit-mask 32 -j DROP

sudo iptables -I DOCKER-USER -p tcp --dport 20444 --syn \
    -m hashlimit --hashlimit-name stacks_p2p \
    --hashlimit-mode srcip --hashlimit-above 10/minute --hashlimit-burst 5 \
    -j DROP
```

{% endcode %}

### Tuning the node's own limits

The firewall rules complement the node's inbound connection settings, which you can tune in your configuration file:

{% code title="Stacks.toml" %}

```toml
[connection_options]
soft_max_clients_per_host = 4    # Inbound P2P connections per IP before pruning
max_sockets = 800                # Total client sockets the node will register
```

{% endcode %}

### Verify

{% code title="Check P2P connections and rule counters" %}

```bash
# Count established inbound P2P connections
ss -tn state established '( sport = :20444 )' | wc -l

# nftables: counters show how many packets the rules dropped
sudo nft list table inet stacks_p2p

# iptables: same, per rule
sudo iptables -L INPUT -v -n --line-numbers | grep 20444
```

{% endcode %}

The thresholds above are conservative starting points. Watch the counters after deploying: if legitimate peers are being dropped, raise the limits; if the counters stay at zero under load, they can be tightened.

## Nginx

Nginx can serve as a reverse proxy with rate limiting using the `limit_req` module. The configuration below rate-limits the Stacks RPC and Stacks API endpoints.

**Rate limit parameters explained:**

- **`rate=5r/s`** — allows a sustained average of 5 requests per second per client IP. Requests beyond this rate are delayed or rejected.
- **`burst=20`** — permits up to 20 requests to queue above the base rate before Nginx starts rejecting. This absorbs short traffic spikes without immediately dropping legitimate requests.
- **`nodelay`** — queued burst requests are forwarded immediately rather than being spaced out over time. Without `nodelay`, excess requests would be throttled to match the base rate.

The Stacks API zone uses a higher rate (`10r/s`) and larger burst (`40`) because API endpoints typically see more traffic than the node RPC.

{% code title="Install Nginx" %}

```bash
sudo apt-get update
sudo apt-get install -y nginx
```

{% endcode %}

{% code title="/etc/nginx/sites-available/stacks-node" %}

```nginx
limit_req_zone $binary_remote_addr zone=stacks_rpc:10m rate=5r/s;
limit_req_zone $binary_remote_addr zone=stacks_api:10m rate=10r/s;

server {
    listen 20443;

    # Stacks RPC
    location / {
        limit_req zone=stacks_rpc burst=20 nodelay;
        proxy_pass http://127.0.0.1:30443;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}

server {
    listen 3999;

    # Stacks API (if running)
    location / {
        limit_req zone=stacks_api burst=40 nodelay;
        proxy_pass http://127.0.0.1:33999;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

{% endcode %}

Enable the site and restart Nginx:

{% code title="Enable and start Nginx" %}

```bash
sudo ln -s /etc/nginx/sites-available/stacks-node /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

{% endcode %}

### Verify

{% code title="Test the RPC endpoint through the proxy" %}

```bash
curl -s localhost:20443/v2/info | jq
```

{% endcode %}

## HAProxy

HAProxy provides fine-grained connection tracking and abuse detection via [stick tables](https://www.haproxy.com/blog/introduction-to-haproxy-stick-tables). The configuration below proxies Stacks RPC and API traffic over HTTP, automatically rejecting clients that exceed request rate thresholds.

{% hint style="info" %}
Adjust `maxconn`, rate thresholds (`ge 25`), stick-table sizes, and expiry times to suit your traffic patterns. The values below are conservative defaults.
{% endhint %}

{% code title="Install HAProxy" %}

```bash
sudo apt-get update
sudo apt-get install -y haproxy
```

{% endcode %}

{% code title="/etc/haproxy/haproxy.cfg" %}

```
global
    log /dev/log    local0
    log /dev/log    local1 notice
    maxconn 512
    chroot /var/lib/haproxy
    stats socket /run/haproxy/admin.sock mode 660 level admin
    stats timeout 30s
    user haproxy
    group haproxy
    daemon

defaults
    log     global
    mode    http
    option  httplog
    option  dontlognull
    timeout connect 5000
    timeout client  50000
    timeout server  50000
    timeout http-request 10s

# -------------------------------------------
# Abuse tracking table (shared across all frontends)
# Keeps 100k entries, each expiring after 30m.
# All frontends share this table, so a client that
# exceeds the rate limit on any service is blocked
# from all services. To isolate rate limits per
# service, create separate stick-table backends.
# -------------------------------------------
backend Abuse
    stick-table type ip size 100K expire 30m store gpc0,http_req_rate(10s)

# -------------------------------------------
# Stacks RPC (public: 20443 -> node: 30443)
# -------------------------------------------
frontend stacks_rpc
    bind *:20443
    http-request track-sc0 src table Abuse
    http-request deny deny_status 429 if { src_get_gpc0(Abuse) gt 0 }
    http-request deny deny_status 429 if { src_http_req_rate(Abuse) ge 25 } { src_inc_gpc0(Abuse) ge 0 }
    default_backend stacks_rpc_back

backend stacks_rpc_back
    server stacks-node 127.0.0.1:30443 maxconn 100 check inter 10s

# -------------------------------------------
# Stacks API (public: 3999 -> node: 33999)
# -------------------------------------------
frontend stacks_api
    bind *:3999
    http-request track-sc0 src table Abuse
    http-request deny deny_status 429 if { src_get_gpc0(Abuse) gt 0 }
    http-request deny deny_status 429 if { src_http_req_rate(Abuse) ge 25 } { src_inc_gpc0(Abuse) ge 0 }
    default_backend stacks_api_back

backend stacks_api_back
    server stacks-api 127.0.0.1:33999 maxconn 100 check inter 10s

# -------------------------------------------
# Bitcoin RPC (optional, if you expose it)
# -------------------------------------------
frontend btc_rpc
    bind *:8332
    http-request track-sc0 src table Abuse
    http-request deny deny_status 429 if { src_get_gpc0(Abuse) gt 0 }
    http-request deny deny_status 429 if { src_http_req_rate(Abuse) ge 25 } { src_inc_gpc0(Abuse) ge 0 }
    default_backend btc_rpc_back

backend btc_rpc_back
    server bitcoin 127.0.0.1:8332 maxconn 100 check inter 10s
```

{% endcode %}

{% code title="Enable and start HAProxy" %}

```bash
sudo systemctl enable haproxy
sudo systemctl start haproxy
```

{% endcode %}

### Verify

{% code title="Test the RPC endpoint through the proxy" %}

```bash
curl -s localhost:20443/v2/info | jq
```

{% endcode %}

{% hint style="info" %}
**How the abuse table works:** HAProxy tracks each client IP's HTTP request rate. When a client exceeds the threshold (e.g. 25 HTTP requests in 10 seconds), its `gpc0` counter is incremented and all subsequent requests from that IP are denied with HTTP 429. The stick-table entry expires after 30 minutes, lifting the block automatically.
{% endhint %}

## Firewall considerations

Additionally, a host-level firewall adds defense in depth: only the proxy's listening ports and the P2P ports should be reachable from the public internet, while the node's RPC stays accessible only via the proxy (localhost). The P2P ports should be reachable **and** rate-limited, as described in [Rate-limit the Stacks P2P port](#rate-limit-the-stacks-p2p-port). How you configure this depends on your environment — cloud providers, bare-metal hosts, and container setups all handle firewalling differently.

{% hint style="warning" %}
Cloud security groups (AWS, GCP, Azure) express which ports are reachable, but cannot express per-source connection-rate limits. Even on a cloud host, the P2P rate limiting must be done at the host level with `nftables` or `iptables`.
{% endhint %}

{% hint style="info" %}
Refer to your provider's or operating system's firewall documentation for specifics:

- **AWS** — [Security Groups](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html)
- **GCP** — [VPC Firewall Rules](https://cloud.google.com/firewall/docs/firewalls)
- **Azure** — [Network Security Groups](https://learn.microsoft.com/en-us/azure/virtual-network/network-security-groups-overview)
- **Digital Ocean** — [Cloud Firewalls](https://docs.digitalocean.com/products/networking/firewalls/)
- **Linux (bare metal)** — [UFW](https://help.ubuntu.com/community/UFW), [iptables](https://wiki.archlinux.org/title/Iptables), or [nftables](https://wiki.nftables.org/)
- **Docker** — Docker manipulates `iptables` directly and can bypass host firewall rules. See the [Docker packet filtering docs](https://docs.docker.com/engine/network/packet-filtering-firewalls/) for how to enforce restrictions.
{% endhint %}
