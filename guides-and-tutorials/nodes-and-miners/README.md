# Run a Node

This section will walk through the technical setup steps required to run Stacks Blockchain nodes and miners. There are multiple options available for running a node, including Docker, Digital Ocean, and Render.

Running your own Stacks node is a great way to increase the decentralization of the ecosystem and not have to rely on any third-party, centralized providers.

Regardless of your preferred setup, there are some minimum hardware recommendations you should be aware of:

The **minimum viable requirements** are listed below.

While you _can_ run a node using these specs, it's _recommended_ to assign more than the minimum for better performance.

* ⚠️ [docker-compose](https://docs.docker.com/compose/install/) version `2.2.2` or greater is **required**
* **4GB memory if running only a Stacks node**
* **10 GB memory if running Stacks + Bitcoin node**
* **2 Vcpu**
* **350GB disk for Stacks node**
* **1TB disk space for Bitcoin node**
