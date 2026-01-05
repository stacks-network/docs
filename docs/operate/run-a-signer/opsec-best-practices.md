# OpSec Best Practices

#### Threat Modeling

A threat actor that is able to compromise > 70% of Signers (by stake weight) would be able to successfully propose Stacks blocks that would otherwise be considered invalid.

Some potential vectors for signer key compromise are as follows:

* stacks-signer node is compromised and key is exfiltrated from the filesystem
* Signer key is compromised during generation or deployment
* Signer key is accidentally checked into SCM (eg Github or Gitlab)
* Social engineering attack against Signer community: eg a malicious link is posted to social media that harvests key material
* An undisclosed backdoor is discovered in the Signer binary.
* Supply chain attack against stacks-signer source code: threat actor compromises upstream dependencies of stacks-signer

#### Countermeasures

What can Signers do to mitigate the threat vectors identified above? Let's identify countermeasures in response to each of the threats identified above, starting with the first vector: stacks-signer node compromise and key exfiltration.

{% stepper %}
{% step %}
#### Run the stacks-signer on a separate system from the stacks-node

This reduces discoverability of the signer. Systems running the stacks-node participate in the peer-to-peer network and are more easily enumerated. If an attacker can't find your stacks-signer, they can't attack it directly.

Best practice: ensure stacks-node and stacks-signer communicate only over trusted networks, ideally using localhost (127.0.0.1) or a secure private subnet.

Note: Running the stacks-signer on a separate system is an option, but not strictly necessary. Running both on the same virtual machine within a private network, with traffic firewalled to allow only incoming P2P connections (port 20444), provides a secure and easier setup while minimizing exposure.
{% endstep %}

{% step %}
#### Run the stacks-signer as a separate user from the stacks-node

When resource constraints prevent separate workloads, run the stacks-signer under a distinct unprivileged user account from the stacks-node. Ensure exclusive ownership and restrictive permissions for each user's configuration files.

Example: the user running the signer binary (e.g., signer) should own the signer’s config file and set permissions to prevent other users from reading it. The same principle applies to the stacks-node user. This ensures only appropriate processes can access sensitive configuration details.
{% endstep %}

{% step %}
#### Harden the systemd configuration for the stacks-signer

Hardening systemd can reduce blast radius if an attacker gains control of the stacks-signer process. An example stacks-signer.service systemd unit is shown below. This unit prevents certain filesystem writes and otherwise restricts the process.

{% code title="stacks-signer.service" %}
```ini
[Unit]
Description=Stacks Signer
After=network.target
StartLimitBurst=3
StartLimitIntervalSec=300
ConditionFileIsExecutable=/usr/local/bin/stacks-signer
ConditionPathExists=/etc/stacks/signer
ConditionFileNotEmpty=/etc/stacks/signer/signer-config.toml

[Service]
ExecStart=/usr/local/bin/stacks-signer run --config /home/etc/stacks/signer/signer-config.toml
User={{ svc_user }}
Group={{ svc_user }}
Type=simple
Restart=on-failure
TimeoutStopSec=600
KillSignal=SIGTERM
#KillSignal=SIGINT

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

[Install]
WantedBy=multi-user.target
```
{% endcode %}

Read more about systemd hardening: https://www.ctrl.blog/entry/systemd-service-hardening.html
{% endstep %}

{% step %}
#### Restrict access to unnecessary ports and protocols

The stacks-signer requires outbound TCP access to the stacks-node, but typically no other inbound network exposure is needed (except for OS updates and administrative access). Restrict network access to the minimum required for operation.
{% endstep %}

{% step %}
#### Harden the operating system

A few practical OS hardening measures:

* Run stacks-signer as an unprivileged user (not root).
* Set permissions on the stacks-signer key/config to be readable only by the user running the stacks-signer process, e.g.:
  * sudo chmod 600 signer/signer-config.toml
* Require public-key authentication for SSH and disable SSH root login.
* Consider running sshd on a non-standard port to reduce noise from port scanners and credential-stuffing attacks.
{% endstep %}
{% endstepper %}

This post outlines essential operational security best practices for Stacks Signers, key actors in the Nakamoto architecture.

By implementing these strategies, signer operators can effectively mitigate risks and maintain the security and reliability of the Stacks network.
