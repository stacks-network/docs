# Run a Node with Docker

### Stacks Blockchain with Docker

Run your own Stacks Blockchain node using [docker-compose](https://docs.docker.com/compose/) with just a few commands using [stacks-blockchain-docker](https://github.com/stacks-network/stacks-blockchain-docker)

### Requirements

The minimum viable requirements are listed below.

While you _can_ run a node using these specs, it's _recommended_ to assign more than the minimum for better performance.

* ⚠️ [docker-compose](https://docs.docker.com/compose/install/) version `2.2.2` or greater is **required**
* **8GB memory if running only a Stacks node**
* **16 GB memory if running Stacks + Bitcoin node**
* **1 Vcpu** ( _minimum of 2 Vcpu is recommended_ )
* **500GB disk for Stacks node**
* **1TB disk space for Bitcoin node**

{% hint style="warning" %}
MacOS with an ARM (M-series chip) processor is NOT recommended

The way Docker for Mac on an Arm CPU is designed makes the I/O incredibly slow, and blockchains are _**very**_ heavy on I/O. This only seems to affect MacOS with the M-series chip, other Arm based systems like Raspberry Pi work as expected.
{% endhint %}

### Quickstart

The `<network>` placeholder used below can be replaced with one of:

* mainnet
* testnet
* mocknet

{% stepper %}
{% step %}
#### Clone the repository

Clone the stacks-blockchain-docker repository locally and change into the directory:

{% code title="Clone repository" %}
```bash
git clone https://github.com/stacks-network/stacks-blockchain-docker && cd stacks-blockchain-docker
```
{% endcode %}
{% endstep %}

{% step %}
#### Start the services

Start the docker-compose services for the chosen network:

{% code title="Start services" %}
```bash
./manage.sh -n <network> -a start
```
{% endcode %}

{% hint style="info" %}
With an optional HTTP proxy on port 80:

{% code title="Start with proxy" %}
```bash
./manage.sh -n <network> -a start -f proxy
```
{% endcode %}
{% endhint %}
{% endstep %}
{% endstepper %}

### Accessing the services

{% hint style="info" %}
For networks other than `mocknet`, downloading the initial headers can take several minutes. Until the headers are downloaded, the `/v2/info` endpoints won't return any data.

Follow the logs to track the sync progress:

{% code title="Follow logs" %}
```bash
./manage.sh -n <network> -a logs
```
{% endcode %}
{% endhint %}

stacks-blockchain:

* Ports `20443-20444` are exposed on `localhost`

{% code title="Check stacks-blockchain /v2/info" %}
```bash
curl -sL localhost:20443/v2/info | jq -r
```
{% endcode %}

stacks-blockchain-api:

* Port `3999` is exposed on `localhost`

{% code title="Check stacks-blockchain-api" %}
```bash
curl -sL localhost:3999 | jq -r
```
{% endcode %}

proxy:

* Port `80` is exposed on `localhost`

{% code title="Check proxy" %}
```bash
curl -sL localhost/v2/info | jq -r
curl -sL localhost | jq -r
```
{% endcode %}

### Run behind a proxy (rate limiting)

If you plan to expose HTTP endpoints publicly, put a reverse proxy in front of the Stacks node RPC (`20443`) and Stacks API (`3999`). This is the right place to terminate TLS, add basic rate limits, and reduce abuse.

{% hint style="warning" %}
Do not proxy the P2P port (`20444`) — it is not HTTP. Keep it open to peers as needed, and only proxy HTTP endpoints.
{% endhint %}

Below are minimal examples; tune the limits for your traffic. If the node is only for internal use, bind the services to `localhost` or use an allowlist instead.

{% code title="Nginx example (HTTP)" %}
```nginx
# /etc/nginx/conf.d/stacks.conf
limit_req_zone $binary_remote_addr zone=stacks_rpc:10m rate=5r/s;
limit_req_zone $binary_remote_addr zone=stacks_api:10m rate=10r/s;
limit_conn_zone $binary_remote_addr zone=stacks_conn:10m;

server {
  listen 80;
  server_name <your-domain>;

  location /v2/ {
    limit_conn stacks_conn 20;
    limit_req zone=stacks_rpc burst=20 nodelay;
    proxy_pass http://127.0.0.1:20443;
  }

  location /extended/ {
    limit_conn stacks_conn 20;
    limit_req zone=stacks_api burst=40 nodelay;
    proxy_pass http://127.0.0.1:3999;
  }

  location / {
    limit_conn stacks_conn 20;
    limit_req zone=stacks_api burst=40 nodelay;
    proxy_pass http://127.0.0.1:3999;
  }
}
```
{% endcode %}

{% code title="HAProxy example (HTTP)" %}
```haproxy
frontend fe_stacks
  bind *:80
  mode http
  option httplog
  acl is_rpc path_beg /v2/
  use_backend be_rpc if is_rpc
  default_backend be_api

backend be_rpc
  mode http
  stick-table type ip size 100k expire 10m store http_req_rate(10s)
  http-request track-sc0 src
  http-request deny if { sc_http_req_rate(0) gt 50 }
  server stacks_rpc 127.0.0.1:20443 check

backend be_api
  mode http
  stick-table type ip size 100k expire 10m store http_req_rate(10s)
  http-request track-sc0 src
  http-request deny if { sc_http_req_rate(0) gt 100 }
  server stacks_api 127.0.0.1:3999 check
```
{% endcode %}

### Upgrades

{% hint style="warning" %}
For schema-breaking upgrades to running instances of this repo, you'll need to [run an event-replay](https://github.com/stacks-network/stacks-blockchain-docker/blob/master/docs/upgrade.md).
{% endhint %}
