# OpSec Best Practices

#### **Threat Modeling**

A threat actor that is able to compromise > 70% of Signers (by stake weight) would be able to successfully propose Stacks blocks that would otherwise be considered invalid.

Some potential vectors for signer key compromise are as follows:

1. stacks-signer node is compromised and key is exfiltrated from the filesystem
2. Signer key is compromised during generation or deployment
3. Signer key is accidentally checked into SCM (eg Github or Gitlab)
4. Social engineering attack against Signer community: eg a malicious link is posted to social media that harvests key material
5. An undisclosed backdoor is discovered in the Signer binary.
6. Supply chain attack against stacks-signer source code: threat actor compromises upstream dependencies of stacks-signer

#### **Countermeasures**

What can Signers do to mitigate the threat vectors identified above? Let's identify countermeasures in response to each of the threats identified above, starting with #1.

#### **1. Stacks-signer node is compromised and key is exfiltrated from the filesystem**

An obvious attack vector is a direct attack on the system running the stacks-signer software. Presently, the stacks-signer depends on a signing key that is both loaded into memory, and resident on the filesystem in cleartext. Thus a system or process level intrusion on the stacks-signer node will likely lead to compromise of the signing key.

**Some countermeasures that can help mitigate this vector include:**

1. **Run the stacks-signer on a separate system from the stacks-node.** This is important, as the IP addresses of systems running the stacks-signer cannot be trivially enumerated, but the same is not true for systems running stacks-node, due to the fact that stacks-node systems participate in the peer to peer network. If an attacker can't find your stacks-signer, they can't attack it (directly). It’s best practice to ensure that the stacks-node and stacks-signer communicate only over trusted networks, ideally using localhost (127.0.0.1) or a secure private subnet. While running the stacks-signer on a separate system is an option, it’s not necessary for security. Instead, running both on the same virtual machine within a private network, with traffic firewalled to allow only incoming peer-to-peer (P2P) connections (port 2044), provides a secure and easier setup. This minimizes the risk of exposure to attacks while avoiding the complexity of managing multiple systems.
2. **Run the stacks-signer as a separate user from the stacks-node**. This is helpful in situations where due to resource constraints, it's not possible to separate the stacks-signer and stacks-node deployments onto separate workloads. Run the stacks-signer as a separate user from the stacks-node to enhance security, especially when resource constraints prevent deploying them on separate systems. The key here is ensuring that each user has exclusive ownership and access to its respective configuration files. For example, the user running the signer binary (e.g., signer) should own the signer’s config file, with permissions set restrictively to prevent other users from reading it. The same principle applies to the stacks-node user. This setup ensures that only the appropriate processes can access sensitive configuration details.
3. **Harden the systemd configuration for the stacks-signer.** Hardening systemd can help mitigate the blast radius from an attack that successfully gets control of the stacks-signer process. An example stacks-signer.service systemd unit is below. Specifically, this systemd unit prevents certain filesystem writes (which can prevent an attacker from gaining persistence). Read more about [systemd hardening](https://www.ctrl.blog/entry/systemd-service-hardening.html).

```
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

1. **Restrict access to unnecessary ports and protocols.** The stacks-signer requires _outbound_ TCP access to the stacks-node, but no other communications (except for what may be necessary to update the underlying OS).
2. Harden the operating system. This is a broad topic, but the basics are:
   1. Run stacks-signer as an unprivileged user (not root)
   2. Set permissions on the stacks-signer key to be readable only by the user running the stacks-signer process, eg `sudo chmod 600 signer/signer-config.toml`
   3. Require public-key authentication for remote SSH to the system running the stacks-signer and disable ssh root login.
   4. Run sshd on a non-standard port to reduce noise from port scanners and credential stuffing attacks

This post outlines essential operational security best practices for Stacks Signers, key actors in the Nakamoto architecture.

By implementing these strategies, signer operators can effectively mitigate risks and maintain the security and reliability of the Stacks network.
