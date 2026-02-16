# Run a Node

<div data-with-frame="true"><figure><img src=".gitbook/assets/Frame 316126262 (1).jpg" alt=""><figcaption></figcaption></figure></div>

This section walks through the technical setup steps required to run Stacks network nodes and miners. There are multiple options available for running a node, including Docker, Digital Ocean, and Render.

Running your own Stacks node is a great way to increase the decentralization of the ecosystem and avoid relying on third-party centralized providers.

## Minimum viable requirements

While you can run a node using these specs, it's recommended to assign more than the minimum for better performance.

{% hint style="warning" %}
* ⚠️ docker-compose version `2.2.2` or greater is **required** — https://docs.docker.com/compose/install/
* **8 GB memory** if running only a Stacks node
* **16 GB memory** if running Stacks + Bitcoin node
* **2 vCPU**
* **1 TB disk** for Stacks node
* **1 TB disk** for Bitcoin node
{% endhint %}

***

## Quick Troubleshooting Tips

| Issue | Solution |
| ----- | -------- |
| Node not syncing | Check your internet connection and firewall settings. Ensure ports 20443 and 20444 are open. |
| Out of disk space | Increase disk allocation or prune old chainstate data. |
| Connection timeouts | Verify your `bootstrap_node` configuration in the `[node]` section of your Stacks node config file (e.g., `stacks-node-mainnet.toml`) is correct and reachable. See [Stacks Node Configuration](../reference/) for details. |
| High memory usage | Consider running only the Stacks node without a local Bitcoin node. |

## Community Support

* **Discord**: Join the [Stacks Discord](https://stacks.chat/) and ask in the #node-operators channel
* **Forum**: Post questions on the [Stacks Forum](https://forum.stacks.org/)
* **GitHub Issues**: Report bugs at [stacks-network/stacks-core](https://github.com/stacks-network/stacks-core/issues)

## Health Check Recommendations

Monitor your node's health regularly by checking:

1. **Sync status**: Compare your node's block height with the [Stacks Explorer](https://explorer.hiro.so/)
2. **RPC endpoint**: Test with `curl http://localhost:20443/v2/info`
3. **Peer connections**: Verify your node has active peer connections
4. **Disk usage**: Ensure you have at least 100GB free space for growth
