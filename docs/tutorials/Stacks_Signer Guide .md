Module 4: Monitoring Stacks Signers (Prometheus & Grafana)
Author: @jadonamite
Difficulty: Intermediate
Time: 20 Minutes
In the Nakamoto era, "silence is expensive." If your Signer goes offline or fails to validate blocks within the strict 5-second tenure windows, you don't just lose revenue—you degrade network health.
Because the Signer operates as a background sidecar, you cannot rely on docker logs to know if it's healthy. You need real-time metrics. This module covers how to instrument your Signer with Prometheus and visualize it in Grafana to watch for Block Processing and RPC Latency.
1. Architecture: The Pull Model
We will add two new containers to our stack:
Prometheus: Periodically "scrapes" (pulls) metrics from your Signer.
Grafana: Visualizes the data stored in Prometheus.
2. Step-by-Step Implementation
Step 2.1: Expose Metrics in signer-config.toml
By default, the Signer keeps its internal state private. We must explicitly open a port for Prometheus.
Open your signer-config.toml and add the metrics_endpoint key.
Ini, TOML# signer-config.toml

# ... existing config ...

# 1. Metrics Exposure
# Expose metrics on port 9154 (standard convention for Signers)
# Use 0.0.0.0 to allow Docker containers to reach it
metrics_endpoint = "0.0.0.0:9154"
Step 2.2: Configure Prometheus
Create a new configuration file named prometheus.yml in your project root. This tells Prometheus where to find your Signer.
YAML# prometheus.yml
global:
  scrape_interval: 5s # Scrape often! Nakamoto blocks are fast (5s).

scrape_configs:
  - job_name: 'stacks-signer'
    static_configs:
      - targets: ['stacks-signer:9154'] # 'stacks-signer' is the Docker service name
    metrics_path: /metrics
Step 2.3: Update Docker Compose
We need to add the monitoring services and expose the Signer's new port.
Open docker-compose.yml and modify it:
YAMLversion: '3.8'

services:
  # ... existing Bitcoin/Stacks/Postgres services ...

  stacks-signer:
    image: hirosystems/stacks-signer:nakamoto
    container_name: stacks-signer
    ports:
      - "30000:30000"
      - "9154:9154" # <--- EXPOSE METRICS PORT
    volumes:
      - ./signer-config.toml:/etc/stacks-signer/config.toml
      - ./data/signer:/var/lib/stacks-signer
    command: stacks-signer run --config /etc/stacks-signer/config.toml
    depends_on:
      - stacks-node

  # 1. Prometheus (The Collector)
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"

  # 2. Grafana (The Dashboard)
  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin # Change this in production!
    depends_on:
      - prometheus
Step 2.4: Boot & Verify
Restart your stack:
Bashdocker-compose down && docker-compose up -d
Verify Prometheus is scraping correctly:
Open http://localhost:9090/targets in your browser.
You should see stacks-signer listed with State UP.
3. Visualizing in Grafana
Now, let's build a "Liveness Dashboard."
Login: Open http://localhost:3000 (User: admin, Pass: admin).
Add Data Source:
Go to Connections > Data Sources > Add data source.
Select Prometheus.
URL: http://prometheus:9090 (internal Docker DNS).
Click Save & Test.
Create Dashboard:
Click Dashboards > New Dashboard.
Add a Visualization.
Critical Metric 1: Block Processing Rate
Query: rate(stacks_signer_processed_blocks_total[1m])
Why: If this line drops to zero while the network is active, your Signer is stuck.
Critical Metric 2: RPC Latency
Query: histogram_quantile(0.95, rate(stacks_signer_node_rpc_call_latencies_histogram_bucket[5m]))
Why: In Nakamoto, your Signer must respond to the miner within milliseconds. If this spikes > 2 seconds, you will miss tenure.
Critical Metric 3: Error Count
Query: increase(stacks_signer_errors_total[1h])
Why: Any spike here indicates auth failures or database corruption.
4. Common Pitfalls
"Connection Refused" in Prometheus
If Prometheus shows the target as DOWN:
Did you restart the Signer after adding metrics_endpoint?
Is metrics_endpoint set to 0.0.0.0? If it is 127.0.0.1, it will only listen inside the container and Prometheus cannot reach it.
"No Data" in Grafana
If the query returns empty:
The Signer only emits metrics when events happen. Wait for a few blocks to be mined.
Check http://localhost:9154/metrics manually to see if raw text is flowing.
