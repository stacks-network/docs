# Module 8: OpSec - Secure Key Management

**Author:** @jadonamite
**Difficulty:** Intermediate
**Time:** 10 Minutes

In Module 2, we pasted our private key directly into `signer-config.toml` in plaintext. **Do not do this on Mainnet.**

If you commit that `signer-config.toml` to GitHub, your Stacking rewards will be stolen, and your signer identity compromised. In a production environment, secrets should never touch the disk in unencrypted formats and should definitely never be in version control.

This module refactors our setup to use **Environment Variables** and **Docker Secrets**, moving from "Plaintext Config" to "12-Factor App" security standards.

## 1. The Vulnerability

Currently, your `signer-config.toml` looks like this:

```toml
# ❌ BAD: Key is visible to anyone who can read this file
stacks_private_key = "72f...91a"

```

## 2. Refactoring to Environment Variables

The Stacks Signer binary allows configuration overrides via Environment Variables. This means we can remove the key from the file entirely.

### Step 2.1: Clean the Config File

Open `signer-config.toml`. **Delete** the `stacks_private_key` line.

```toml
# signer-config.toml

# 1. Identity
# stacks_private_key = "..."  <-- REMOVE THIS LINE

# ... rest of config ...

```

### Step 2.2: Create a `.env` File

Create a file named `.env` in your project root. This file will hold your secrets locally but will be excluded from Git.

```bash
# .env
# Store the raw key here locally
STACKS_SIGNER_PRIVATE_KEY=72f...91a

```

### Step 2.3: Secure the Git History

**Crucial:** Immediately add `.env` to your `.gitignore`.

```bash
echo ".env" >> .gitignore

```

## 3. Injecting the Key (Docker Compose)

We need to map the host's environment variable into the container.

Open `docker-compose.yml` and modify the `stacks-signer` service.

```yaml
  stacks-signer:
    image: hirosystems/stacks-signer:nakamoto
    container_name: stacks-signer
    # ... ports ...
    environment:
      # Option A: Pass explicitly from host env
      - STACKS_SIGNER_PRIVATE_KEY=${STACKS_SIGNER_PRIVATE_KEY}
    volumes:
      - ./signer-config.toml:/etc/stacks-signer/config.toml
    # ...

```

Now, when the container starts, it sees the environment variable. However, the Signer binary needs to know to *look* for it.

*Note: Depending on the specific version of the Signer binary, it may auto-detect `STACKS_SIGNER_PRIVATE_KEY`, or you may need to rely on the `config.toml` utilizing a placeholder. Most Nakamoto builds prioritize the Environment Variable `STACKS_SIGNER_PRIVATE_KEY` if the config value is missing.*

## 4. Advanced: Using Docker Secrets (Production)

For true production (Kubernetes or Docker Swarm), avoiding `.env` files is better. We use **Docker Secrets**, which mounts the key as a file in memory (`/run/secrets/my_key`), reducing the risk of accidental environment dumps.

**This requires modifying the entrypoint.**

1. **Define Secret in Compose:**
```yaml
secrets:
  signer_key:
    file: ./secret_key.txt

```


2. **Update Service:**
```yaml
services:
  stacks-signer:
    secrets:
      - signer_key
    # Overwrite the command to read the secret and export it
    entrypoint: /bin/sh -c "export STACKS_SIGNER_PRIVATE_KEY=$(cat /run/secrets/signer_key) && /bin/stacks-signer run --config /etc/stacks-signer/config.toml"

```



## 5. Verification

1. Stop the old signer:
```bash
docker-compose down

```


2. Start with the new env injection:
```bash
docker-compose up -d

```


3. Check logs to ensure it didn't panic about a missing key:
```bash
docker logs stacks-signer

```


*Success:* You see the standard startup logs ("Listening on...").
*Failure:* `Error: Missing private key`.

## 6. Summary Checklist

* [ ] **Gitignore:** Is `.env` ignored?
* [ ] **File Permissions:** Is the `.env` file readable only by you? (`chmod 600 .env`)
* [ ] **Config Cleanup:** Is the private key removed from `signer-config.toml`?

---

