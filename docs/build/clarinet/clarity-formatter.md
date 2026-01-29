---
title: Clarity Formatter
description: Automatically format Clarity smart contracts with consistent style rules for improved readability and team collaboration.
---

# Clarity Formatter

The Clarity formatter is an automated code formatting tool that ensures your smart contracts follow standardized style conventions. By maintaining consistent formatting across your codebase, you improve readability, reduce merge conflicts, and streamline team collaboration.

## Overview

Consistent code formatting is essential for maintaining professional smart contract projects. The Clarity formatter eliminates manual formatting decisions by automatically applying a well-defined set of style rules to your code.

**Key benefits:**
- Ensures uniform code style across your entire project
- Saves time by automating formatting decisions
- Reduces code review friction
- Prevents style-related merge conflicts
- Makes codebases easier to navigate and understand

## Formatting Philosophy

The Clarity formatter applies an opinionated set of rules designed to maximize code readability and maintainability.

### Core Formatting Principles

**Line length management**
- Default maximum line width: 80 characters
- Automatically wraps long expressions across multiple lines
- Configurable to match your team's preferences (supports up to 120+ characters)

**Consistent indentation**
- Uses 2 spaces per indentation level by default
- Customizable to 4 spaces or other values
- Never uses tabs to ensure cross-editor compatibility

**Structural consistency**
- Enforces uniform patterns for function definitions
- Standardizes let binding formatting
- Applies consistent rules to control flow structures
- Automatically converts to sugared syntax where appropriate

### Design Goals

The formatter prioritizes:
1. **Readability** - Code should be easy to scan and understand
2. **Consistency** - Similar constructs should look similar
3. **Predictability** - Formatting rules should be intuitive
4. **Maintainability** - Formatted code should minimize git diffs

## Getting Started

### Prerequisites

The Clarity formatter is available through two primary integration points:

**Clarinet CLI** (v2.0.0+)
- Command-line interface for formatting
- Supports batch formatting of entire projects
- Ideal for CI/CD integration

**Clarity VS Code Extension** (v1.0.0+)
- In-editor formatting support
- Format-on-save capability
- Integrated with VS Code's formatting commands

### Installation

**Install Clarinet:**
```bash
# macOS/Linux
curl -L https://github.com/hirosystems/clarinet/releases/latest/download/clarinet-linux-x64.tar.gz | tar xz

# Or via Homebrew
brew install clarinet
```

**Install VS Code extension:**
1. Open VS Code
2. Go to Extensions (Cmd/Ctrl + Shift + X)
3. Search for "Clarity"
4. Click Install on the official Clarity extension

### Quick Start

**Format a single file:**
```bash
clarinet format contracts/my-contract.clar
```

**Format all contracts in a project:**
```bash
clarinet format --in-place
```

**Check formatting without making changes:**
```bash
clarinet format --check
```

## Integration Methods

### VS Code Integration

Configure VS Code to format Clarity files automatically:

**Enable format on save:**
```json
// .vscode/settings.json
{
  "[clarity]": {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "hirosystems.clarity-lsp"
  }
}
```

**Manual formatting shortcuts:**
- **macOS:** Shift + Option + F
- **Windows/Linux:** Shift + Alt + F
- **Command palette:** Format Document

**Format selection:**
Highlight code and use:
- **macOS:** Cmd + K, Cmd + F
- **Windows/Linux:** Ctrl + K, Ctrl + F

### CLI Integration

**Basic commands:**

```bash
# Format and display to stdout (preview)
clarinet format contracts/token.clar

# Format and modify file in place
clarinet format --in-place contracts/token.clar

# Format entire project
clarinet format --in-place

# Check if files need formatting (CI/CD)
clarinet format --check
```

**Custom formatting options:**

```bash
# Use 4-space indentation
clarinet format -i 4 --in-place

# Set line width to 120 characters
clarinet format -l 120 --in-place

# Combine multiple options
clarinet format -i 4 -l 120 --in-place
```

**Available options:**
- `-i, --indent-size <SIZE>` - Number of spaces per indent (default: 2)
- `-l, --line-width <WIDTH>` - Maximum line width (default: 80)
- `--in-place` - Modify files directly instead of outputting to stdout
- `--check` - Exit with error if files need formatting (no changes made)

### CI/CD Integration

**GitHub Actions example:**

```yaml
name: Clarity Format Check

on: [push, pull_request]

jobs:
  format-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install Clarinet
        run: |
          curl -L https://github.com/hirosystems/clarinet/releases/latest/download/clarinet-linux-x64.tar.gz | tar xz
          sudo mv clarinet /usr/local/bin/
      
      - name: Check formatting
        run: clarinet format --check
```

**Pre-commit hook:**

```bash
# .git/hooks/pre-commit
#!/bin/bash

# Format all Clarity files before commit
clarinet format --in-place

# Add formatted files to commit
git add contracts/*.clar
```

Make the hook executable:
```bash
chmod +x .git/hooks/pre-commit
```

**Using pre-commit framework:**

```yaml
# .pre-commit-config.yaml
repos:
  - repo: local
    hooks:
      - id: clarity-format
        name: Clarity Formatter
        entry: clarinet format --check
        language: system
        types: [clarity]
```

## Formatting Rules Reference

### Function Definitions

**Multi-parameter functions:**

Functions with multiple parameters are formatted across multiple lines with consistent indentation:

```clarity
;; Before formatting
(define-public (transfer (amount uint) (sender principal) (recipient principal)) (ok true))

;; After formatting
(define-public (transfer
    (amount uint)
    (sender principal)
    (recipient principal)
  )
  (ok true)
)
```

**Single-parameter functions:**

Functions with a single parameter can remain on one line:

```clarity
(define-read-only (get-balance (who principal))
  (ok (default-to u0 (map-get? balances who)))
)
```

**Zero-parameter functions:**

```clarity
(define-read-only (get-total-supply)
  (ok (var-get total-supply))
)
```

### Let Expressions

Let bindings are placed on separate lines for clarity:

```clarity
;; Before formatting
(let ((a u1) (b u2) (c (+ a b))) (ok c))

;; After formatting
(let (
    (a u1)
    (b u2)
    (c (+ a b))
  )
  (ok c)
)
```

**Nested let expressions:**

```clarity
(let (
    (balance (unwrap! (get-balance tx-sender) err-no-balance))
    (new-balance (- balance amount))
  )
  (let (
      (result (map-set balances tx-sender new-balance))
    )
    (ok new-balance)
  )
)
```

### Control Flow Structures

**If expressions:**

Each branch receives its own line for readability:

```clarity
;; Before formatting
(if (> amount u0) (ok true) (err u1))

;; After formatting
(if (> amount u0)
  (ok true)
  (err u1)
)
```

**Complex conditions:**

```clarity
(if (and
      (> amount u0)
      (is-eq tx-sender contract-owner)
    )
  (begin
    (var-set total-supply (+ (var-get total-supply) amount))
    (ok true)
  )
  (err err-unauthorized)
)
```

**Match expressions:**

```clarity
;; Before formatting
(match (map-get? balances who) balance (ok balance) (err u404))

;; After formatting
(match (map-get? balances who)
  balance (ok balance)
  (err err-not-found)
)
```

**Complex match with multiple clauses:**

```clarity
(match result
  (ok value)
    (begin
      (print "Success")
      (ok value)
    )
  (err code)
    (begin
      (print "Error occurred")
      (err code)
    )
)
```

### Data Structures

**Tuples - automatic sugaring:**

The formatter converts tuple syntax to the more readable sugared format:

```clarity
;; Before formatting
(tuple (name "Alice") (age u30) (active true))

;; After formatting
{
  name: "Alice",
  age: u30,
  active: true,
}
```

**Nested tuples:**

```clarity
{
  user: {
    name: "Alice",
    id: u1,
  },
  balance: u1000,
  metadata: {
    created: u12345,
    updated: u67890,
  },
}
```

**Maps:**

```clarity
(define-map users
  principal
  {
    balance: uint,
    name: (string-ascii 50),
    active: bool,
  }
)
```

**Lists:**

```clarity
;; Before formatting
(list u1 u2 u3 u4 u5 u6 u7 u8 u9 u10)

;; After formatting
(list
  u1 u2 u3 u4 u5
  u6 u7 u8 u9 u10
)
```

### Comments

Comments are preserved and properly aligned:

```clarity
;; This is a contract-level comment
(define-constant contract-owner tx-sender)

;; Function to transfer tokens
;; Parameters:
;;   amount - number of tokens to transfer
;;   recipient - address to receive tokens
(define-public (transfer
    (amount uint)
    (recipient principal)
  )
  ;; Check amount is positive
  (asserts! (> amount u0) err-invalid-amount)
  
  ;; Perform transfer
  (ok true)
)
```

## Advanced Usage

### Ignoring Formatting

Prevent the formatter from modifying specific code sections using the `@format-ignore` directive:

```clarity
;; @format-ignore
(define-constant special-list (list
  1     2  3  ;; Custom spacing preserved
  4 5 ))
```

**Use cases for format-ignore:**
- ASCII art or visual formatting
- Deliberately aligned code for clarity
- Generated code that shouldn't be reformatted
- Temporary debugging code

**Multi-line ignore blocks:**

```clarity
;; @format-ignore-start
(define-constant config {
  option-a:  u1,
  option-bb: u2,
  option-c:  u3,  ;; Aligned for readability
})
;; @format-ignore-end
```

### Custom Configuration

Create a project-wide formatting configuration:

```toml
# Clarinet.toml
[formatting]
indent-size = 4
line-width = 120
```

**Team configuration sharing:**

Commit formatting settings to version control:

```toml
# .clarinet/formatting.toml
[style]
indent_size = 2
line_width = 100
preserve_blank_lines = true
```

### Formatting Multiple Files

**Format specific contracts:**

```bash
clarinet format --in-place contracts/token.clar contracts/vault.clar
```

**Format with glob patterns:**

```bash
# Bash
clarinet format --in-place contracts/*.clar

# Find with filtering
find contracts -name "*.clar" -exec clarinet format --in-place {} \;
```

**Exclude files from formatting:**

```bash
# Format all except test files
clarinet format --in-place $(find contracts -name "*.clar" ! -name "*test*")
```

## Comparison: Manual vs. Automated Formatting

| Aspect | Manual Formatting | Clarity Formatter |
|--------|------------------|-------------------|
| **Consistency** | Varies by developer and over time | Uniform across entire codebase |
| **Speed** | Time-consuming, requires attention | Instant, automated |
| **Accuracy** | Prone to human error | Deterministic and error-free |
| **Team coordination** | Requires style guide and enforcement | Automatic enforcement |
| **Code reviews** | Time spent on style feedback | Focus on logic and functionality |
| **Onboarding** | New developers must learn style guide | Automatic compliance |
| **Merge conflicts** | Frequent style-related conflicts | Minimal style conflicts |
| **Maintenance** | Ongoing manual effort | Zero maintenance overhead |

## Best Practices

### Development Workflow

**Enable automatic formatting:**

Always enable format-on-save in your editor to maintain consistency without thinking about it:

```json
// VS Code settings
{
  "[clarity]": {
    "editor.formatOnSave": true
  }
}
```

**Use pre-commit hooks:**

Ensure all code is formatted before it enters version control:

```bash
# Install pre-commit
pip install pre-commit

# Setup hooks
pre-commit install
```

**Integrate with CI/CD:**

Add formatting checks to your continuous integration pipeline to catch unformatted code:

```yaml
# GitHub Actions
- name: Check Clarity formatting
  run: clarinet format --check
```

### Team Adoption

**Standardize settings:**

Share formatting configuration across your team:

1. Commit `.vscode/settings.json` with Clarity formatting settings
2. Document formatting standards in `CONTRIBUTING.md`
3. Include formatting check in PR templates
4. Run formatter as part of automated testing

**Communicate changes:**

When adopting the formatter:

1. Announce the change to your team
2. Format entire codebase in a single PR
3. Update contribution guidelines
4. Provide examples and documentation

**Gradual rollout:**

For large projects:

1. Start with new files only
2. Format one module at a time
3. Use `@format-ignore` for legacy code if needed
4. Incrementally expand formatted areas

### Code Quality

**Combine with linting:**

Use the formatter alongside the Clarity linter for comprehensive code quality:

```bash
# Format code
clarinet format --in-place

# Check for errors and warnings
clarinet check
```

**Review before committing:**

Even with auto-formatting:
- Review changes before committing
- Ensure formatting didn't hide logic errors
- Verify complex expressions still make sense

**Document exceptions:**

If using `@format-ignore`, document why:

```clarity
;; @format-ignore - ASCII art banner
;;  _____ ___  _  _______ _   _ 
;; |_   _/ _ \| |/ / ____| \ | |
;;   | || | | | ' /|  _| |  \| |
;;   | || |_| | . \| |___| |\  |
;;   |_| \___/|_|\_\_____|_| \_|
```

## Troubleshooting

### Common Issues

**Issue: Formatter not working in VS Code**

Solutions:
1. Ensure Clarity extension is installed and enabled
2. Check that Clarity is set as the default formatter
3. Verify file has `.clar` extension
4. Restart VS Code after installing extension

```json
// Verify settings
{
  "[clarity]": {
    "editor.defaultFormatter": "hirosystems.clarity-lsp"
  }
}
```

**Issue: Format check fails in CI**

Causes and solutions:
- Different Clarinet versions: Pin Clarinet version in CI
- Local changes not committed: Run formatter before pushing
- Different formatting settings: Commit config files

```yaml
# Pin version in CI
- name: Install Clarinet
  run: |
    curl -L https://github.com/hirosystems/clarinet/releases/download/v2.0.0/clarinet-linux-x64.tar.gz | tar xz
```

**Issue: Unwanted formatting changes**

Solutions:
- Use `@format-ignore` for specific sections
- Adjust line width if lines are wrapping unexpectedly
- Check indentation settings match team preferences

**Issue: Performance with large files**

The formatter handles large files efficiently, but if you experience slowness:
- Format incrementally during development
- Use `--check` in CI instead of formatting
- Consider breaking large contracts into modules

### Getting Help

**Resources:**
- Clarity documentation: [docs.stacks.co](https://docs.stacks.co)
- Clarinet repository: [github.com/hirosystems/clarinet](https://github.com/hirosystems/clarinet)
- Discord community: [stacks.chat](https://stacks.chat)

**Reporting issues:**

When reporting formatter bugs:
1. Include the original code snippet
2. Show the unexpected output
3. Specify Clarinet version (`clarinet --version`)
4. Note any custom configuration
5. Provide minimal reproducible example

## Migration Guide

### Formatting an Existing Project

**Step 1: Backup your code**
```bash
git checkout -b formatting-update
git add .
git commit -m "Pre-formatting snapshot"
```

**Step 2: Format the entire project**
```bash
clarinet format --in-place
```

**Step 3: Review changes**
```bash
git diff
```

**Step 4: Commit formatted code**
```bash
git add .
git commit -m "Apply Clarity formatter to entire project"
```

**Step 5: Update documentation**

Update `CONTRIBUTING.md`:
```markdown
## Code Style

This project uses the Clarity formatter. All code must be formatted before committing:

```bash
clarinet format --in-place
```

Enable format-on-save in VS Code for automatic formatting.
```

### Handling Large Diffs

For projects with many files:

```bash
# Format and commit one directory at a time
clarinet format --in-place contracts/core/*.clar
git add contracts/core/
git commit -m "Format core contracts"

clarinet format --in-place contracts/traits/*.clar
git add contracts/traits/
git commit -m "Format trait contracts"
```

## Examples

### Before and After

**Unformatted contract:**

```clarity
(define-constant contract-owner tx-sender)(define-constant err-not-authorized (err u100))
(define-map balances principal uint)(define-public (transfer (amount uint) (recipient principal))(begin (asserts! (is-eq tx-sender contract-owner) err-not-authorized)(let ((sender-balance (default-to u0 (map-get? balances tx-sender))))(asserts! (>= sender-balance amount) (err u101))(map-set balances tx-sender (- sender-balance amount))(map-set balances recipient (+ (default-to u0 (map-get? balances recipient)) amount))(ok true))))
```

**Formatted contract:**

```clarity
(define-constant contract-owner tx-sender)
(define-constant err-not-authorized (err u100))

(define-map balances principal uint)

(define-public (transfer
    (amount uint)
    (recipient principal)
  )
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-not-authorized)
    (let (
        (sender-balance (default-to u0 (map-get? balances tx-sender)))
      )
      (asserts! (>= sender-balance amount) (err u101))
      (map-set balances tx-sender (- sender-balance amount))
      (map-set balances recipient
        (+ (default-to u0 (map-get? balances recipient)) amount)
      )
      (ok true)
    )
  )
)
```

### Real-World Contract

**Token contract with formatting:**

```clarity
;; SIP-010 Fungible Token Implementation

(impl-trait 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait)

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-token-owner (err u101))
(define-constant err-insufficient-balance (err u102))

;; Data vars
(define-fungible-token clarity-coin)

;; Data maps
(define-map token-balances
  principal
  uint
)

;; Public functions
(define-public (transfer
    (amount uint)
    (sender principal)
    (recipient principal)
    (memo (optional (buff 34)))
  )
  (begin
    (asserts! (is-eq tx-sender sender) err-not-token-owner)
    (asserts!
      (>= (ft-get-balance clarity-coin sender) amount)
      err-insufficient-balance
    )
    (try! (ft-transfer? clarity-coin amount sender recipient))
    (match memo
      value (print value)
      true
    )
    (ok true)
  )
)

;; Read-only functions
(define-read-only (get-balance (who principal))
  (ok (ft-get-balance clarity-coin who))
)

(define-read-only (get-total-supply)
  (ok (ft-get-supply clarity-coin))
)

(define-read-only (get-name)
  (ok "Clarity Coin")
)

(define-read-only (get-symbol)
  (ok "CC")
)

(define-read-only (get-decimals)
  (ok u6)
)

(define-read-only (get-token-uri)
  (ok (some u"https://example.com/token-metadata.json"))
)
```

## Related Resources

- [Clarity Language Reference](https://docs.stacks.co/clarity)
- [Clarinet Documentation](https://docs.hiro.so/clarinet)
- [Smart Contract Best Practices](https://docs.stacks.co/build-apps/guides/best-practices)
- [VS Code Extension Documentation](https://marketplace.visualstudio.com/items?itemName=hirosystems.clarity-lsp)

---

**Last Updated:** January 2026

For questions or feedback about the Clarity formatter, visit the [Clarinet GitHub repository](https://github.com/hirosystems/clarinet) or join the [Stacks Discord community](https://stacks.chat).
