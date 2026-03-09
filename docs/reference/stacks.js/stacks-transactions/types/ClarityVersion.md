# ClarityVersion

Enum specifying the version of Clarity used to deploy a smart contract.

***

### Usage

```ts
import { ClarityVersion, makeContractDeploy } from '@stacks/transactions';

const transaction = await makeContractDeploy({
  // ...
  clarityVersion: ClarityVersion.Clarity3,
});
```

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/constants.ts#L48)**

***

### Definition

```ts
enum ClarityVersion {
  Clarity1 = 1,
  Clarity2 = 2,
  Clarity3 = 3,
  Clarity4 = 4,
}
```

***

### Values

| Value | Number | Description |
| --- | --- | --- |
| `Clarity1` | `1` | Original Clarity version |
| `Clarity2` | `2` | Clarity 2 with additional features |
| `Clarity3` | `3` | Clarity 3 (Nakamoto) |
| `Clarity4` | `4` | Clarity 4 |
