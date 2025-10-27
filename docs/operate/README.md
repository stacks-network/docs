# Run a Node

<figure><img src=".gitbook/assets/Frame 316126262 (1).jpg" alt=""><figcaption></figcaption></figure>

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
