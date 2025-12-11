---
description: December 9, 2025
---

# Deploy using encrypted mnemonics

### Encrypted mnemonics

`clarinet 3.11.0` contains support for encrypted mnemonics. This feature gives users the option to encrypt the mnemonic seed phrase in their deployment files, so if a user's machine is compromised by a filesystem reading vulnerability, the seed phrase is not leaked to the attacker.

To use this feature, a user must first run `clarinet deployments encrypt`, which will prompt the user for the seed phrase and a password, then print the encrypted mnemonic to the console. The user can then put the resulting ciphertext into their deployment config file using the key `encrypted_mnemonic`. The next time the user runs `clarinet deployments apply`, they will be prompted for the password, and the mnemonic will be decrypted for use in that session.

For example, if your `settings/Mainnet.toml` file looks like this:

{% code title="settings/Mainnet.toml" %}
```toml
[network]
name = "mainnet"
stacks_node_rpc_address = "https://api.hiro.so"
deployment_fee_rate = 10

[accounts.deployer]
mnemonic = "twice kind fence tip hidden tilt action fragile skin nothing glory cousin green tomorrow spring wrist shed math olympic multiply hip blue scout claw"
```
{% endcode %}

You would then run:

{% code title="terminal" %}
```
user@host package % clarinet deployments encrypt
Enter mnemonic to encrypt:
twice kind fence tip hidden tilt action fragile skin nothing glory cousin green tomorrow spring wrist shed math olympic multiply hip blue scout claw
Enter password: 
Encrypted mnemonic: 47hYHSp4gtoBabz4X8cByJtRbvD3tBemS1zZJTkxYh2LJ7cVAHY6z74Td8bF5Dcsdpv45gDELPwfBP8Mfk64Q8TsBJNU9sf5hWMrTKPtr5h9abSdmxu4m2BewbUCi4o8znn42nAd7yphcb345YCrYLJFqFC7k9LqXvxgbQxUiFpWeyTVJPkGFa3aiQ8G5uhrv7pLCer4kRmXsmXbBvEqwEQLG7eM3TUMzUP79mHqJ1HGe2XWn
```
{% endcode %}

You would then replace the `mnemonic` field in your settings file with the `encrypted_mnemonic` output above:

{% code title="settings/Mainnet.toml" %}
```toml
[accounts.deployer]
encrypted_mnemonic = "47hYHSp4gtoBabz4X8cByJtRbvD3tBemS1zZJTkxYh2LJ7cVAHY6z74Td8bF5Dcsdpv45gDELPwfBP8Mfk64Q8TsBJNU9sf5hWMrTKPtr5h9abSdmxu4m2BewbUCi4o8znn42nAd7yphcb345YCrYLJFqFC7k9LqXvxgbQxUiFpWeyTVJPkGFa3aiQ8G5uhrv7pLCer4kRmXsmXbBvEqwEQLG7eM3TUMzUP79mHqJ1HGe2XWn"
```
{% endcode %}

Then the next time you deploy your package, you will be prompted for the password:

{% code title="terminal" %}
```
user@host package % clarinet deployments apply --mainnet

Enter password to decrypt mnemonic for account deployer: 
```
{% endcode %}
