# Run a Node Behind a Proxy

{% hint style="warning" %}
Running a publicly accessible node exposes your infrastructure to the open internet. The configurations below are starting points, not complete security solutions. **Do this at your own risk.** You are responsible for securing and maintaining your own infrastructure.
{% endhint %}

If you plan to run a Stacks node with publicly accessible RPC endpoints, it is strongly recommended to place the node behind a reverse proxy with rate limiting. Without rate limiting, a public node can be overwhelmed by excessive requests, leading to degraded performance or denial of service.

This guide provides minimal, production-tested configurations for two popular reverse proxies. **Choose one — you do not need both:**

- [**Nginx**](#nginx) — simpler configuration, widely known, good baseline rate limiting.
- [**HAProxy**](#haproxy) — more advanced abuse detection via stick tables, HTTP proxying with automatic IP blocking.

### Ports overview

A Stacks node deployment typically exposes the following services:

| Service     | Default Port | Protocol | Proxy?          |
| ----------- | ------------ | -------- | --------------- |
| Stacks RPC  | 20443        | HTTP     | Yes             |
| Stacks P2P  | 20444        | TCP      | No              |
| Stacks API  | 3999         | HTTP     | Yes, if running |
| Bitcoin RPC | 8332         | HTTP     | Yes, if exposed |
| Bitcoin P2P | 8333         | TCP      | No              |

{% hint style="info" %}
The **P2P ports** (20444, 8333) use custom binary protocols for peer-to-peer communication, not HTTP. You can leave them open directly to the network. The proxy configurations below focus on the **RPC/API ports** which serve HTTP traffic and are the primary target for abuse.

**Optional:** P2P ports can also benefit from rate-limiting. While unlikely, a denial-of-service attack could flood the P2P port so the node only communicates with malicious peers. Adding connection-rate limits on P2P ports won't hurt and provides an extra layer of protection.
{% endhint %}

## Configure the Stacks node

Before setting up the proxy, configure your Stacks node so its RPC endpoint is not directly reachable from the public internet. The proxy will be the only public-facing service.

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

## Nginx

Nginx can serve as a reverse proxy with rate limiting using the `limit_req` module. The configuration below rate-limits the Stacks RPC and Stacks API endpoints.

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
    }
}

server {
    listen 3999;

    # Stacks API (if running)
    location / {
        limit_req zone=stacks_api burst=40 nodelay;
        proxy_pass http://127.0.0.1:33999;
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
# Abuse tracking table
# Keeps 100k entries, each expiring after 30m
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
    bind *:18332
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

Ensure that only the proxy's listening ports and the P2P ports are reachable from the public internet. The node's RPC should only be accessible via the proxy (localhost).

{% code title="UFW example" %}

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp              # SSH
sudo ufw allow 20443/tcp           # Stacks RPC (via proxy)
sudo ufw allow 20444/tcp           # Stacks P2P (direct)
sudo ufw allow 8333/tcp            # Bitcoin P2P (direct)
sudo ufw enable
```

{% endcode %}

{% hint style="warning" %}
**Docker users:** Docker manipulates `iptables` directly and bypasses UFW rules. If your node runs in Docker, bind container ports to `127.0.0.1` explicitly (e.g. `-p 127.0.0.1:20443:20443`) or use the `DOCKER-USER` iptables chain to enforce restrictions. See the [Docker documentation](https://docs.docker.com/engine/network/packet-filtering-firewalls/) for details.
{% endhint %}
