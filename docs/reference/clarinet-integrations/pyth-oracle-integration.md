---
hidden: true
---

# Pyth Oracle Integration

### What you'll learn

* Set up mainnet contract dependencies
* Use mainnet transaction execution (MXS) for oracle testing
* Create mock price feeds for unit tests
* Write integration tests with real oracle data

### Prerequisites

* Clarinet version 2.1.0 or higher with MXS support
* Understanding of [Pyth oracle contracts](pyth-oracle-integration.md#)

### Quickstart

#### Configure mainnet dependencies

Add Pyth oracle contracts to your `Clarinet.toml` requirements:

```toml
[project]
name = "my-oracle-project"

[[project.requirements]]
contract_id = "SP3R4F6C1J3JQWWCVZ3S7FRRYPMYG6ZW6RZK31FXY.pyth-oracle-v3"

[[project.requirements]]
contract_id = "SP3R4F6C1J3JQWWCVZ3S7FRRYPMYG6ZW6RZK31FXY.pyth-storage-v3"

[[project.requirements]]
contract_id = "SP3R4F6C1J3JQWWCVZ3S7FRRYPMYG6ZW6RZK31FXY.pyth-pnau-decoder-v2"

[[project.requirements]]
contract_id = "SP3R4F6C1J3JQWWCVZ3S7FRRYPMYG6ZW6RZK31FXY.wormhole-core-v3"
```

#### Create a mock oracle for unit tests

Use a lightweight mock contract for fast tests:

```clarity
(define-map price-feeds
  (buff 32)
  {
    price: int,
    conf: uint,
    expo: int,
    ema-price: int,
    ema-conf: uint,
    publish-time: uint,
    prev-publish-time: uint
  }
)

(define-public (set-mock-price (feed-id (buff 32)) (price int) (expo int))
  (ok (map-set price-feeds feed-id {
    price: price,
    conf: u1000000,
    expo: expo,
    ema-price: price,
    ema-conf: u1000000,
    publish-time: block-height,
    prev-publish-time: (- block-height u1)
  })))
)

(define-read-only (get-price (feed-id (buff 32)) (storage-contract principal))
  (ok (unwrap! (map-get? price-feeds feed-id) (err u404)))
)

(define-public (verify-and-update-price-feeds (vaa (buff 8192)) (params (tuple)))
  (ok u1)
)
```

#### Write unit tests with mocked prices

Example Vitest suite using the mock oracle:

```ts
import { Cl } from '@stacks/transactions';
import { describe, expect, it } from 'vitest';

const accounts = simnet.getAccounts();
const deployer = accounts.get('deployer')!;
const wallet1 = accounts.get('wallet_1')!;

describe('Benjamin Club with Mock Oracle', () => {
  it('sets up mock BTC price', () => {
    const btcFeedId = '0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43';
    const mockPrice = Cl.int(10_000_000_000_000);
    const expo = Cl.int(-8);

    const response = simnet.callPublicFn(
      'mock-pyth-oracle',
      'set-mock-price',
      [Cl.bufferFromHex(btcFeedId), mockPrice, expo],
      deployer
    );

    expect(response.result).toBeOk(Cl.uint(1));
  });

  it('calculates required sBTC amount for $100', () => {
    const response = simnet.callReadOnlyFn(
      'benjamin-club',
      'get-required-sbtc-amount',
      [],
      wallet1
    );

    expect(response.result).toBeOk(Cl.uint(100_000));
  });

  it('mints NFT when user has sufficient sBTC', () => {
    const mockVaa = Cl.bufferFromHex('00'.repeat(100));

    simnet.callPublicFn(
      'sbtc-token',
      'mint',
      [Cl.uint(100_000_000), Cl.principal(wallet1)],
      deployer
    );

    const response = simnet.callPublicFn(
      'benjamin-club',
      'mint-for-hundred-dollars',
      [mockVaa],
      wallet1
    );

    expect(response.result).toBeOk(Cl.uint(1));
  });
});
```

#### Set up mainnet execution tests

Use mainnet execution (MXS) with live Pyth data:

```ts
import { buildDevnetNetworkOrchestrator } from '@hirosystems/clarinet-sdk';
import { Cl } from '@stacks/transactions';
import { PriceServiceConnection } from '@pythnetwork/price-service-client';
import { describe, expect, it } from 'vitest';

describe('Benjamin Club with Mainnet Oracle', () => {
  it('interacts with the real Pyth oracle', async () => {
    const orchestrator = buildDevnetNetworkOrchestrator({
      manifest: './Clarinet.toml',
      networkId: 1,
    });

    const client = new PriceServiceConnection(
      'https://hermes.pyth.network',
      { priceFeedRequestConfig: { binary: true } }
    );

    const btcFeedId = 'e62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43';
    const [vaa] = await client.getLatestVaas([btcFeedId]);
    const vaaHex = Buffer.from(vaa, 'base64').toString('hex');

    const response = await orchestrator.callPublicFn(
      'benjamin-club',
      'get-current-btc-price',
      [Cl.bufferFromHex(vaaHex)],
      'wallet_1'
    );

    expect(response.result).toBeOk();
  });
});
```

### Common patterns

#### Testing different price scenarios

Create helper functions to test various market conditions:

```ts
export function setupPriceScenario(
  scenario: 'bull' | 'bear' | 'stable',
  simnet: any
) {
  const prices = {
    bull: {
      btc: 15000000000000,  // $150,000
      stx: 500000000,       // $5.00
      eth: 500000000000     // $5,000
    },
    bear: {
      btc: 2000000000000,   // $20,000
      stx: 50000000,        // $0.50
      eth: 100000000000     // $1,000
    },
    stable: {
      btc: 10000000000000,  // $100,000
      stx: 200000000,       // $2.00
      eth: 300000000000     // $3,000
    }
  };

  const selectedPrices = prices[scenario];

  // Set up all price feeds
  Object.entries(selectedPrices).forEach(([asset, price]) => {
    const feedId = getFeedId(asset);
    simnet.callPublicFn(
      "mock-pyth-oracle",
      "set-mock-price",
      [Cl.bufferFromHex(feedId), Cl.int(price), Cl.int(-8)],
      "deployer"
    );
  });
}
```

#### Testing price staleness

Ensure your contract handles stale prices correctly:

```ts
describe("Price Staleness Handling", () => {
  it("should reject stale prices", () => {
    // Set a price with old timestamp
    const oldTimestamp = simnet.getBlockHeight() - 1000;

    simnet.callPublicFn(
      "mock-pyth-oracle",
      "set-price-with-timestamp",
      [
        Cl.bufferFromHex(BTC_FEED_ID),
        Cl.int(10000000000000),
        Cl.int(-8),
        Cl.uint(oldTimestamp)
      ],
      deployer
    );

    const response = simnet.callPublicFn(
      "benjamin-club",
      "mint-for-hundred-dollars",
      [mockVaa],
      wallet1
    );

    expect(response.result).toBeErr(Cl.uint(ERR_STALE_PRICE));
  });
});
```

#### Deployment testing

Create deployment tests to ensure proper configuration:

```yaml
---
id: 0
name: "Mainnet deployment"
network: mainnet
stacks-node: "https://api.mainnet.hiro.so"
bitcoin-node: "https://blockstream.info/api/"
plan:
  batches:
    - id: 0
      transactions:
        - contract-call:
            contract-id: ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRCBGD7R.benjamin-club
            method: initialize
            parameters:
              - "'SP3R4F6C1J3JQWWCVZ3S7FRRYPMYG6ZW6RZK31FXY.pyth-oracle-v3"
              - "'SP3R4F6C1J3JQWWCVZ3S7FRRYPMYG6ZW6RZK31FXY.pyth-storage-v3"
```

#### Gas estimation

Test gas consumption for oracle operations:

```ts
describe("Gas Estimation", () => {
  it("should estimate gas for oracle update + mint", () => {
    const txCost = simnet.getTransactionCost(
      "benjamin-club",
      "mint-for-hundred-dollars",
      [Cl.bufferFromHex("00".repeat(1000))], // Typical VAA size
      wallet1
    );

    console.log("Estimated gas cost:", txCost);

    // Ensure gas cost is reasonable
    expect(txCost.write_length).toBeLessThan(20000);
    expect(txCost.runtime).toBeLessThan(50000000);
  });
});
```

### CI/CD integration

Set up GitHub Actions for automated testing:

```yaml
name: Test Oracle Integration

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Install Clarinet
        run: |
          curl -L https://github.com/hirosystems/clarinet/releases/download/v2.1.0/clarinet-linux-x64.tar.gz | tar xz
          chmod +x ./clarinet
          sudo mv ./clarinet /usr/local/bin

      - name: Run unit tests
        run: clarinet test --coverage

      - name: Run mainnet fork tests
        run: clarinet test --mainnet-fork
        env:
          MAINNET_API_KEY: ${{ secrets.MAINNET_API_KEY }}
```
