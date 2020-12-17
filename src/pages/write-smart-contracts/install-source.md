---
title: Install Clarity from source
description: 'Stacks smart contracting language'
---

## Installation

Build using `rust` and `cargo`:

```bash
cargo build --release
```

Install globally (you may have to run as sudoer):

```bash
cargo install --path .
```

You should now be able to run the command:

```bash
blockstack-core
```
