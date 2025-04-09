# Fuzz Testing with Rendezvous

Smart contracts on Stacks are immutable. Bugs are forever. Test early. Test
often. Fuzzing finds edge cases that unit tests often miss.

## What is Fuzz Testing?

Fuzzing hits your code with random inputs. It helps uncover unexpected
behavior and subtle bugs. Unlike unit tests, it explores paths you didn't
think of.

Rendezvous (`rv`) is a Clarity fuzzer. It supports:

### Property-Based Testing

You define a property. Rendezvous checks it with random inputs.

- **Properties**: Truths that must always hold.
- **Generators**: Create random input data.
- **Shrinking**: Reduce failing input to the minimal case.

### Invariant Testing

You define conditions that must always hold. Rendezvous runs sequences of
calls to verify them.

- **Invariants**: Must always be true.
- **State transitions**: What changes with each call.
- **Function sequences**: Random sequences of calls to test state consistency.

## Why Test in Clarity?

Rendezvous tests run in Clarity, just like your contracts.

1. Tests operate under the exact same constraints as production code.
2. Better understanding of Clarity.
3. No need to expose internals as public functions.
4. Fewer tools to manage.

## Getting Started

Put tests next to contracts. Rendezvous will find them.

```
my-project/
├── Clarinet.toml
├── contracts/
│   ├── my-contract.clar       # Contract
│   ├── my-contract.tests.clar # Tests
└── settings/
    └── Devnet.toml
```

See full docs at:
https://stacks-network.github.io/rendezvous/
