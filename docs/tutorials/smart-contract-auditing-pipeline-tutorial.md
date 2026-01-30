# Automate Security: Build a Smart Contract Auditing Pipeline

**Author:** @jadonamite
**Topic:** Security & CI/CD
**Level:** Intermediate
**Prerequisites:** A Foundry Project, GitHub Repository

Security shouldn't be an afterthought; it should be part of your git commit history. While a manual audit is irreplaceable, automated tools catch 80% of low-hanging fruit (reentrancy, uninitialized variables, access control gaps) before a human ever looks at the code.

In this tutorial, we will build a **GitHub Actions Pipeline** that automatically runs **Slither** (Static Analysis) and **Aderyn** (Rust-based Analyzer) every time you open a Pull Request.

---

## 1. Architecture

We are building a **Continuous Security (DevSecOps)** pipeline.

* **Trigger:** Push to `main` or Pull Request.
* **Build Environment:** Ubuntu-latest with Foundry installed.
* **Analyzers:**
* **Slither:** The industry standard for Solidity static analysis (Python-based).
* **Aderyn:** A high-performance analyzer built specifically for Foundry projects (Rust-based).


* **Output:** A markdown report posted directly to the PR comments.

---

## 2. Prerequisites

You need a Foundry project pushed to GitHub.
If you don't have one, initialize one:

```bash
forge init secure-contract
cd secure-contract
git init && git add . && git commit -m "init"
# Push to your GitHub repo

```

---

## 3. Implementation

### Step 1: Configure Slither (`slither.config.json`)

Slither needs to know which files to ignore (like dependencies). Create a config file in your root.

```json
{
  "filter_paths": "lib|test|script",
  "exclude_optimizers": true,
  "solc_remaps": [
    "@openzeppelin/=lib/openzeppelin-contracts/",
    "ds-test/=lib/forge-std/lib/ds-test/src/",
    "forge-std/=lib/forge-std/src/"
  ]
}

```

*Note: Adjust `solc_remaps` to match your `remappings.txt`.*

### Step 2: Configure Aderyn (`aderyn.toml`)

Aderyn is zero-config by default, but you can create a `aderyn.toml` to customize it if needed. For now, we will run it with defaults.

### Step 3: The Workflow File (`.github/workflows/audit.yml`)

Create the directory `.github/workflows` and the file `audit.yml`.

This workflow does three things:

1. Installs Foundry and compiles the code.
2. Runs **Slither** and saves the output.
3. Runs **Aderyn** and saves the output.
4. Uses a "Comment Bot" action to post the findings to your PR.

```yaml
name: Smart Contract Audit

on:
  push:
    branches: [main]
  pull_request:

jobs:
  security-check:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write # Needed to post comments

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4
        with:
          submodules: recursive

      - name: Install Foundry
        uses: foundry-rs/foundry-toolchain@v1
        with:
          version: nightly

      - name: Build Contracts
        run: forge build

      # -------------------------------------------------------
      # 1. Run Slither
      # -------------------------------------------------------
      - name: Run Slither
        uses: crytic/slither-action@v0.3.0
        id: slither
        with:
          fail-on: none # Don't block PR, just report
          slither-args: --checklist --markdown-root ${{ github.server_url }}/${{ github.repository }}/blob/${{ github.sha }}/
        continue-on-error: true

      # -------------------------------------------------------
      # 2. Run Aderyn
      # -------------------------------------------------------
      - name: Install Aderyn
        run: curl -L https://github.com/Cyfrin/aderyn/releases/download/v0.1.3/aderyn-linux-x86_64.tar.gz | tar -xz && sudo mv aderyn /usr/local/bin/

      - name: Run Aderyn
        run: aderyn . >> aderyn_report.md
        continue-on-error: true

      # -------------------------------------------------------
      # 3. Post Results
      # -------------------------------------------------------
      - name: Comment PR (Slither)
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v6
        env:
          REPORT: ${{ steps.slither.outputs.stdout }}
        with:
          script: |
            const output = process.env.REPORT;
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '## 🐍 Slither Report\n\n' + output
            })

      - name: Comment PR (Aderyn)
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            try {
              const report = fs.readFileSync('aderyn_report.md', 'utf8');
              // Aderyn report can be long, let's truncate or summarize in a real scenario
              // For now, we post a link or the summary
              github.rest.issues.createComment({
                issue_number: context.issue.number,
                owner: context.repo.owner,
                repo: context.repo.repo,
                body: '## 🦜 Aderyn Report\n\n' + report.substring(0, 60000) // GitHub comment limit
              })
            } catch (e) {
              console.log("No Aderyn report found");
            }

```

---

## 4. Testing the Pipeline

1. **Commit and Push:** Push the `.github` folder to your repo.
2. **Create a PR:** Create a new branch, introduce a vulnerability (e.g., a reentrancy bug), and open a PR.
```solidity
// Add this to src/Counter.sol
function withdraw() public {
    (bool success, ) = msg.sender.call{value: address(this).balance}("");
    require(success);
    balances[msg.sender] = 0; // VULNERABILITY: Updates state after call
}

```


3. **Check Actions:** Go to the "Actions" tab in GitHub. You will see the "Smart Contract Audit" job running.
4. **View Comment:** Once finished, the bot will comment on your PR:
* **Slither:** *"Reentrancy in Counter.withdraw()..."*
* **Aderyn:** *"Low severity: State variable written after call..."*



---

## 5. Common Pitfalls

1. **Dependency Errors (Remappings):**
* **Context:** Slither often fails to find `openzeppelin`.
* **Fix:** Ensure your `remappings.txt` is correct and explicit. Use the `slither.config.json` `solc_remaps` if auto-detection fails.


2. **False Positives:**
* **Context:** Static analysis tools are paranoid. They will flag things that aren't bugs.
* **Fix:** Use code comments to ignore specific rules if you are sure it's safe: `// slither-disable-next-line reentrancy-no-eth`.


3. **GitHub Token Permissions:**
* **Context:** "Resource not accessible by integration".
* **Fix:** Ensure `permissions: pull-requests: write` is set in the YAML file.

