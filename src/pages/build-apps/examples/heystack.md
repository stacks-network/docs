---
title: Heystack app
description: Interacting with the wallet and smart contracts from a React application
tags:
  - example-app
images:
  large: /images/pages/heystack-app.svg
---

## Introduction

This example application demonstrates important features of the Stacks blockchain, and is a case study for how a frontend
web application can interact with a Clarity smart contract. The full source of the application is provided and
completely open source for you to use or modify. This page highlights important code snippets and design patterns to
help you learn how to develop your own Stacks application.

This app showcases the following platform features:

- Authenticating users with the web wallet
- Using a smart contract to store data on the blockchain
- Minting new fungible tokens with a [SIP-010][] compliant smart contract
- Creating and monitoring transactions on the Stacks blockchain using [Stacks.js][]

You can access the [online version of the Heystack app][heystack] to interact with it. The source for Heystack is also
available on [Github][heystack_gh]. This page assumes some familiarity with [React][].

## Heystack overview

Heystack is a web application for chatting with other Stacks users. The application uses the [Stacks web wallet][] to
authenticate users in the frontend. When a user logs in to Heystack, they're given a genesis amount of $HEY fungible
tokens, which allows them to send and like messages on the platform.

Heystack is powered by Clarity smart contracts so each message is a transaction on the Stacks blockchain. Each time a
user sends a message on the platform, they must sign the message with the [Stacks web wallet][] (or another compatible
wallet) and pay a small gas fee in STX. A user spends a $HEY token to send every message, and recieves a $HEY token for
every like that their messages receive.

The following video provides a brief overview of the Heystack application:

<br /><iframe width="560" height="315" src="https://www.youtube.com/embed/2_xAIctJqGw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Review smart contracts

Heystack depends on two smart contracts to execute the backend functions of the app on the Stacks blockchain:

- a contract for handling the messaging content
- a contract for minting and distributing the $HEY token

As a best practice, these two contracts are separate because of the different functionality they handle. This is an
exercise in [separation of concerns][].

### Content contract

The `hey.clar` contract provides two primary functions for the application, one to publish content to
the blockchain and another to like a piece of content based on its ID. This section reviews the implementation of
these primary functions, but is not a comprehensive discussion of the contract.

In order to accomplish the two primary functions, the contract relies on a data variable `content-index` and two
[data maps][], `like-state` and `publisher-state` which contain the number of likes a piece of content has received, and
the principal address of the account that published the content.

Note that all variables are defined at the top of the contract, which is a requirement of the Clarity language. These
include constants such as the `contract-creator`, error codes, and a treasury address.

```clarity
;;
;; Data maps and vars
(define-data-var content-index uint u0)

(define-read-only (get-content-index)
  (ok (var-get content-index))
)

(define-map like-state
  { content-index: uint }
  { likes: uint }
)

(define-map publisher-state
  { content-index: uint }
  { publisher: principal }
)
```

Read-only functions provide a method for getting the like count of a piece of content, and getting the principal address
of the message publisher.

```clarity
(define-read-only (get-like-count (id uint))
  ;; Checks map for like count of given id
  ;; defaults to 0 likes if no entry found
  (ok (default-to { likes: u0 } (map-get? like-state { content-index: id })))
)

(define-read-only (get-message-publisher (id uint))
  ;; Checks map for like count of given id
  ;; defaults to 0 likes if no entry found
  (ok (unwrap-panic (get publisher (map-get? publisher-state { content-index: id }))))
```

The `get-like-count` method accepts a content ID and returns the number of likes associated with that content. The
method uses the [`default-to`][] function to return `0` if the content ID isn't found in the map of likes.

The `get-message-publisher` method accepts a content ID and returns the principal address of the content publisher. The
method uses the [`unwrap-panic`][] function to halt execution of the method if the principal address isn't found in
the map of publishers.

The two primary public methods are the `send-message` and `like-message` functions. These methods allow the contract
caller to store a message on the blockchain (creating entries in the data maps for the message sender and the number
of likes). Note that the message itself isn't stored in a contract variable, the frontend application reads the content
of the message directly from the transaction on the blockchain.

```clarity
;;
;; Public functions
(define-public (send-message (content (string-utf8 140)))
  (let ((id (unwrap! (increment-content-index) (err u0))))
    (print { content: content, publisher: tx-sender, index: id })
    (map-set like-state
      { content-index: id }
      { likes: u0 }
    )
    (map-set publisher-state
      { content-index: id }
      { publisher: tx-sender }
    )
    (transfer-hey u1 HEY_TREASURY)
  )
)
```

The `send-message` method accepts a utf-8 string with a maximum length of 140 characters. The method defines an internal
variable `id` using the `let` function and assigns the next content ID to that variable by calling the
`increment-contract-index` method of the contract. The value assignment of this variable is bound by the [`unwrap!`][]
function, which returns an error and exits the control-flow if the `increment-contract-index` function isn't
successfully called.

The method then assigns `u0` likes to the content in the `like-state` data map, and adds the principal address to the
`publisher-state` data map using the [`map-set`][] function. Finally, the private method `transfer-hey` is called to
transfer 1 $HEY token from the message sender to the $HEY treasury address stored in the `HEY_TREASURY` constant.

```clarity
(define-public (like-message (id uint))
  (begin
    ;; cannot like content that doesn't exist
    (asserts! (>= (var-get content-index) id) (err ERR_CANNOT_LIKE_NON_EXISTENT_CONTENT))
    ;; transfer 1 HEY to the principal that created the content
    (map-set like-state
      { content-index: id }
      { likes: (+ u1 (get likes (unwrap! (get-like-count id) (err u0)))) }
    )
    (transfer-hey u1 (unwrap-panic (get-message-publisher id)))
  )
)
```

The `like-message` method accepts a content ID. The method checks that the ID is lower than the current content ID using
the [`asserts!`][] function, to verify that the provided ID is a valid ID. If the [`asserts!`][] assessment is `false`,
the method returns an error code. If the ID is valid, the method performs a [`map-set`][] to look up the content in the
`like-state` data map and add a like to the value stored in the map. Once again, the [`unwrap!`][] function is used to
ensure that an invalid value isn't stored in the map.

The `hey.clar` contract provides some additional functions for working with the $HEY token contract, discussed in the
next section.

### Token contract

Heystack creates a native fungible token for use in the application. When a user authenticates with Heystack, they're
automatically eligible to claim 100 $HEY tokens to allow them to start messaging.

[SIP-010][] defines the fungible token standard on Stacks, which allows Stacks compatible wallets to handle fungible
tokens through a set of standardized methods. SIP-010 defines 7 traits that a fungible token contract must have in order
to be compliant:

- `transfer`: method for transferring the token from one principal to another
- `get-name`: returns the human-readable name of the token
- `get-symbol`: returns the ticker symbol of the token
- `get-decimals`: returns number of decimal places in the token
- `get-balance`: return the balance of a given principal
- `get-total-supply`: returns the total supply of the token
- `get-token-uri`: returns an optional string that resolves to a valid URI for the token's metadata.

In Clarity, a contract can declare that it intends to implement a set of standard traits.

```clarity

;; Implement the `ft-trait` trait defined in the `ft-trait` contract
;; https://github.com/hstove/stacks-fungible-token
(impl-trait 'ST3J2GVMMM2R07ZFBJDWTYEYAR8FZH5WKDTFJ9AHA.ft-trait.sip-010-trait)
```

The [`impl-trait`][] function asserts that the smart contract is fully implementing a given set of traits defined by the
argument. Like variable definitions, `impl-trait` must be declared at the top of a smart contract definition.

-> The contract address for SIP-010 trait definition is different depending on which network (mainnet, testnet, etc.)
your contract is deployed on. See the standard for the current addresses of the standard traits.

The `hey-token.clar` contract implements the required 7 traits of [SIP-010][], and one additional method, the
`gift-tokens` method, that allows a principal to request tokens from the contract.

```clarity
(define-public (gift-tokens (recipient principal))
  (begin
    (asserts! (is-eq tx-sender recipient) (err u0))
    (ft-mint? hey-token u1 recipient)
  )
)
```

## Authentication

Authentication is handled through the [`@stacks/connect-react`][] and [`@stacks/auth`][] packages, which interact with
compatible Stacks wallet extensions and provide methods for interacting with a user session respectively. [Jotai][]
provides application state management.

The [connect wallet button component][] implements the interface with the Stacks web wallet through the
[`@stacks/connect-react`][] package.

```tsx
import { Button } from '@components/button';
import React from 'react';
import { useConnect } from '@stacks/connect-react';
import { ButtonProps } from '@stacks/ui';
import { useLoading } from '@hooks/use-loading';
import { LOADING_KEYS } from '@store/ui';

export const ConnectWalletButton: React.FC<ButtonProps> = props => {
  const { doOpenAuth } = useConnect();
  const { isLoading, setIsLoading } = useLoading(LOADING_KEYS.AUTH);
  return (
    <Button
      isLoading={isLoading}
      onClick={() => {
        void setIsLoading(true);
        doOpenAuth();
      }}
      {...props}
    >
      Connect wallet
    </Button>
  );
};
```

Once connected, [`/src/store/auth.ts`][] populates the user session data into the Jotai store, allowing the application
to access the user information.

You can see in the [welcome panel component][] how the presence or absence of stored user data is used to display the
wallet connect button or the signed in view.

```tsx
...
const UserSection = memo((props: StackProps) => {
  const { user } = useUser();

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      flexGrow={1}
      spacing="loose"
      textAlign="center"
      {...props}
    >
      {!user ? <SignedOutView /> : <SignedInView onClick={() => console.log('click')} />}
    </Stack>
  );
});
...
```

### Token faucet

The `use-claim-hey.ts` file provides a React hook for interacting with the token faucet of the Clarity smart contract.

```ts
import { useLoading } from '@hooks/use-loading';
import { LOADING_KEYS } from '@store/ui';
import { useConnect } from '@stacks/connect-react';
import { useNetwork } from '@hooks/use-network';
import { useCallback } from 'react';
import { useHeyContract } from '@hooks/use-hey-contract';
import { REQUEST_FUNCTION } from '@common/constants';
import { principalCV } from '@stacks/transactions/dist/clarity/types/principalCV';
import { useCurrentAddress } from '@hooks/use-current-address';

export function useHandleClaimHey() {
  const address = useCurrentAddress();
  const { setIsLoading } = useLoading(LOADING_KEYS.CLAIM_HEY);
  const { doContractCall } = useConnect();
  const [contractAddress, contractName] = useHeyContract();
  const network = useNetwork();

  const onFinish = useCallback(() => {
    void setIsLoading(false);
  }, [setIsLoading]);

  const onCancel = useCallback(() => {
    void setIsLoading(false);
  }, [setIsLoading]);

  return useCallback(() => {
    void setIsLoading(true);
    void doContractCall({
      contractAddress,
      contractName,
      functionName: REQUEST_FUNCTION,
      functionArgs: [principalCV(address)],
      onFinish,
      onCancel,
      network,
      stxAddress: address,
    });
  }, [setIsLoading, onFinish, network, onCancel, address, doContractCall]);
}
```

The [`@stacks/connect-react`][] package exports the `doContractCall` method, which interacts with the smart contract on
the blockchain. There are more examples of transaction calls in the next section. It's important to note that it's
necessary to convert Javascript types to Clarity types using the types exported by the [`@stacks/transactions`][] package.
Further discussion of this conversion is in the [Clarity types in Javascript][] section.

## Transactions

Since messages in Heystack are transactions against a Clarity smart contract, the application must be able to create
transactions and read their content from the blockchain. The following sections highlight code snippets that perform
Clarity transactions and read both completed and pending transactions from the Stacks blockchain.

### Issuing transactions

The two primary functions of the `hey.clar` smart contract are publishing a message and accepting a like on an already
published message. The [`src/hooks/use-publish-hey.ts`][] file implements the frontend method for calling the smart
contract on the blockchain with the appropriate values.

```ts
...
  return useCallback(
    (content: string, _onFinish: () => void) => {
      void setShowPendingOverlay(true);
      void setIsLoading(true);

      void doContractCall({
        contractAddress,
        contractName,
        functionName: MESSAGE_FUNCTION,
        functionArgs: [
          stringUtf8CV(content),
          attachmentUri !== '' ? someCV(stringUtf8CV(attachmentUri)) : noneCV(),
        ],
        onFinish: () => {
          _onFinish();
          onFinish();
        },
        postConditions: [
          createFungiblePostCondition(
            address,
            FungibleConditionCode.Equal,
            new BN(1),
            createAssetInfo(contractAddress, 'hey-token', 'hey-token')
          ),
        ],
        onCancel,
        network,
        stxAddress: address,
      });
    },
    [setIsLoading, onFinish, network, onCancel, address, doContractCall]
  );
...
```

The frontend uses the `doContractCall` function from the [`@stacks/connect-react`][] package to perform the call to the
Clarity smart contract. In order to support the mapping of [Javascript types to Clarity types][], helpers exported from
the [`@stacks/transactions`][] package are used as arguments to the contract call.

Note that the contract call also create post conditions to verify that a single $HEY token is transferred by the
execution of the contract call. Post conditions are a powerful feature of Clarity that can be used to prevent
rug-pulling and other detrimental behavior by smart contracts.

### Reading transactions

Heystack achieves pseudo-real-time messaging by reading both confirmed and pending transactions from the blockchain.
Pending transactions are read from the mempool, whereas confirmed transactions are read directly from the chain. The
[`src/store/hey.ts`][] file contains the implementation of both.

```ts
...
export const heyTransactionsAtom = atomWithQuery<ContractCallTransaction[], string>(get => ({
  queryKey: ['hey-txs'],
  ...(defaultOptions as any),
  refetchInterval: 500,
  queryFn: async (): Promise<ContractCallTransaction[]> => {
    const client = get(accountsClientAtom);
    const txClient = get(transactionsClientAtom);

    const txs = await client.getAccountTransactions({
      limit: 50,
      principal: HEY_CONTRACT,
    });
    const txids = (txs as TransactionResults).results
      .filter(
        tx =>
          tx.tx_type === 'contract_call' &&
          tx.contract_call.function_name === MESSAGE_FUNCTION &&
          tx.tx_status === 'success'
      )
      .map(tx => tx.tx_id);

    const final = await Promise.all(txids.map(async txId => txClient.getTransactionById({ txId })));
    return final as ContractCallTransaction[];
  },
}));
...
```

The `getAccountTransactions` from the `AccountsApi` object exported by [`@stacks/blockchain-api-client`][] is used to
read confirmed blockchain transactions against the `hey.clar` contract from the Stacks API. The list of transactions
returned by the API is filtered to only transactions representing a call to the message function that was successful,
and then mapped to an array of transaction IDs.

Finally, the array of IDs is used to read each full transaction from the blockchain using the `getTransactionsById`
method from the `TransactionsApi` object exported by the [`@stacks/blockchain-api-client`][] package.

Pending transactions are read from the mempool in a similar implementation.

```ts
export const pendingTxsAtom = atomWithQuery<Heystack[], string>(get => ({
  queryKey: ['hey-pending-txs'],
  refetchInterval: 1000,
  ...(defaultOptions as any),
  queryFn: async (): Promise<Heystack[]> => {
    const client = get(transactionsClientAtom);

    const txs = await client.getMempoolTransactionList({ limit: 96 });
    const heyTxs = (txs as MempoolTransactionListResponse).results
      .filter(
        tx =>
          tx.tx_type === 'contract_call' &&
          tx.contract_call.contract_id === HEY_CONTRACT &&
          tx.contract_call.function_name === MESSAGE_FUNCTION &&
          tx.tx_status === 'pending'
      )
      .map(tx => tx.tx_id);

    const final = await Promise.all(heyTxs.map(async txId => client.getTransactionById({ txId })));

    return (
      (final as ContractCallTransaction[]).map(tx => {
        const attachment = tx.contract_call.function_args?.[1].repr
          .replace(`(some u"`, '')
          .slice(0, -1);

        return {
          sender: tx.sender_address,
          content: tx.contract_call.function_args?.[0].repr
            .replace(`u"`, '')
            .slice(0, -1) as string,
          id: tx.tx_id,
          attachment: attachment === 'non' ? undefined : attachment,
          timestamp: (tx as any).receipt_time,
          isPending: true,
        };
      }) || []
    );
  },
}));
```

Pending transactions are read from the mempool using the `getMempoolTransactionList` method from the `TransactionsApi`
exported by [`@stacks/blockchain-api-client`][]. Similar to confirmed transactions, the returned array is filtered to
a list of IDs, and then used to generate an array of full transactions.

Because of differences in the data structure of the pending transactions vs. confirmed transactions, the pending
transaction list must be standardized before being returned.

Note that for the low stakes of a messaging app, pending transactions can be treated as likely permanent state
transitions. For applications implementing higher stakes business logic (such as the transfer of representations
of value) it would be more appropriate to wait to display confirmed transactions.

### Clarity types in Javascript

In order to create transactions to call functions in Clarity contracts, the [`@stacks/transactions`][] package exports
classes that make it easy to construct well-typed Clarity values in Javascript. According to the Clarity language
specification, Clarity has the following types:

- `(tuple (key-name-0 key-type 0) (key-name-1 key-type-1) ...)` - a typed tuple with named fields
- `(list max-len entry-type)` - a list of maximum length `max-len`, with entries of type `entry-type`
- `(response ok-type err-type)` - object used by public functions to commit their state changes or abort
- `(optional some-type)` - an option type for objects that can be either `(some-value)` or `none`
- `(buff max-len)` - byte buffer of maximum length
- `principal` - object representing a principal address (contract or standard)
- `bool` - boolean value (`true` or `false`)
- `int` - signed 128-bit integer
- `uint` - unsigned 128-bit integer

To support these types in Javascript, [`@stacks/transactions`][] exports the following helpers:

```ts
// construct boolean clarity values
const t = trueCV();
const f = falseCV();

// construct optional clarity values
const nothing = noneCV();
const something = someCV(t);

// construct a buffer clarity value from an existing Buffer
const buffer = Buffer.from('foo');
const bufCV = bufferCV(buffer);

// construct signed and unsigned integer clarity values
const i = intCV(-10);
const u = uintCV(10);

// construct principal clarity values
const address = 'SP2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02B';
const contractName = 'contract-name';
const spCV = standardPrincipalCV(address);
const cpCV = contractPrincipalCV(address, contractName);

// construct response clarity values
const errCV = responseErrorCV(trueCV());
const okCV = responseOkCV(falseCV());

// construct tuple clarity values
const tupCV = tupleCV({
  a: intCV(1),
  b: trueCV(),
  c: falseCV(),
});

// construct list clarity values
const l = listCV([trueCV(), falseCV()]);
```

You should use these helpers when calling Clarity contracts with Javascript to avoid failed contract calls due to bad
typing.

## Reading BNS names

An important feature of Stacks is the [Blockchain Naming System][] (BNS). BNS allows users to register a human-readable
identity to their account, that can act as both a username and a web address.

Names registered to a user can be read from a Stacks API endpoint, as demonstrated in [`src/store/names.ts`][].

-> Due to ecosystem limitations, it's currently uncommon for BNS names to be registered on any testnet. For the purpose
of demonstration, Heystack looks for BNS names against the user's mainnet wallet address.

```ts
export const namesAtom = atomFamily((address: string) =>
  atom(async get => {
    if (!address || address === '') return;
    const network = get(mainnetNetworkAtom);
    if (!network) return null;

    const local = getLocalNames(network.coreApiUrl, address);

    if (local) {
      const [names, timestamp] = local;
      const now = Date.now();
      const isStale = now - timestamp > STALE_TIME;
      if (!isStale) return names;
    }

    try {
      const names = await fetchNamesByAddress({
        networkUrl: network.coreApiUrl,
        address,
      });
      if (names?.length) {
        setLocalNames(network.coreApiUrl, address, [names, Date.now()]);
      }
      return names || [];
    } catch (e) {
      console.error(e);
      return [];
    }
  })
);
```

In order to reduce network traffic, Heystack also caches names in the browser's local storage.

A common design pattern in Stacks 2.0 apps is to check if a user has a registered BNS name (only 1 name can be tied to
an account) and display that name in the app where appropriate. If the user doesn't own a BNS name, the wallet address
is used as a stand in. Often, the wallet address is truncated to avoid displaying an overly long string.

The account name component in [`src/components/user-area.tsx`][] demonstrates this design pattern:

```tsx
...
const AccountNameComponent = memo(() => {
  const { user } = useUser();
  const address = useCurrentMainnetAddress();
  const names = useAccountNames(address);
  const name = names?.[0];
  return <Text mb="tight">{name || user?.username || truncateMiddle(address)}</Text>;
});
...
```

## Development walkthrough video

If you would like to learn more about the Heystack application and how it was developed, the following video presents
specific implementation details.

<br /><iframe width="560" height="315" src="https://www.youtube.com/embed/e-IfT5CI-Gw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

[heystack]: https://heystack.xyz
[stacks.js]: https://github.com/blockstack/stacks.js
[stacks web wallet]: https://www.hiro.so/wallet/install-web
[react]: https://reactjs.org/
[heystack_gh]: https://github.com/blockstack/heystack
[data maps]: /references/language-functions#define-map
[`default-to`]: /references/language-functions#default-to
[`asserts!`]: /references/language-functions#asserts
[`unwrap-panic`]: /references/language-functions#unwrap-panic
[`unwrap!`]: /references/language-functions#unwrap
[`map-set`]: /references/language-functions#map-set
[sip-010]: https://github.com/hstove/sips/blob/feat/sip-10-ft/sips/sip-010/sip-010-fungible-token-standard.md
[`impl-trait`]: /references/language-functions#impl-trait
[`@stacks/connect-react`]: https://github.com/blockstack/connect#readme
[`@stacks/auth`]: https://github.com/blockstack/stacks.js/tree/master/packages/auth
[jotai]: https://github.com/pmndrs/jotai
[connect wallet button component]: https://github.com/blockstack/heystack/blob/main/src/components/connect-wallet-button.tsx
[welcome panel component]: https://github.com/blockstack/heystack/blob/63ce30f4f6de7a9c846fcdba3acbb6c7b82b83e3/src/components/welcome-panel.tsx#L102
[`/src/store/auth.ts`]: https://github.com/blockstack/heystack/blob/main/src/store/auth.ts
[clarity types in javascript]: /build-apps/examples/heystack#clarity-types-in-javascript
[`@stacks/transactions`]: https://github.com/blockstack/stacks.js/tree/master/packages/transactions#constructing-clarity-values
[blockchain naming system]: /build-apps/references/bns
[`src/store/names.ts`]: https://github.com/blockstack/heystack/blob/main/src/store/names.ts
[javascript types to clarity types]: /build-apps/examples/heystack#clarity-types-in-javascript
[`@stacks/blockchain-api-client`]: https://github.com/blockstack/stacks-blockchain-api/tree/master/client
[`src/common/hooks/use-publish-hey.ts`]: https://github.com/blockstack/heystack/blob/main/src/common/hooks/use-publish-hey.ts
[`src/store/hey.ts`]: https://github.com/blockstack/heystack/blob/main/src/store/hey.ts
[`src/components/user-area.tsx`]: https://github.com/blockstack/heystack/blob/22e4e9020f8bbb404e8c1e36f32f000050f90818/src/components/user-area.tsx#L62
[separation of concerns]: https://en.wikipedia.org/wiki/Separation_of_concerns
