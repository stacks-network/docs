# Dynamic Blocklist

The Dynamic Blocklist is a security feature implemented in the sBTC system to prevent malicious activities and enhance overall security.

## Overview

- The sBTC Bootstrap Signers are launched with support for dynamic blocklists.
- The blocklist is based on an on-host querying system.
- It helps screen deposits and withdrawals for potential security risks.

## Implementation

1. Each individual Signer is responsible for running the dynamic blocklist system.
2. Signers have the option to provide their own functionality, but default behavior is provided with the initial system.
3. The blocklist is queried through a local API that the sBTC Bootstrap Signer accesses when deciding whether to approve or deny an sBTC operation.

## Components

1. **Dynamic Blocklist Client**: Runs on every machine that hosts an sBTC Bootstrap Signer.
2. **Local API**: Hosted by the Dynamic Blocklist Client for queries from the sBTC Bootstrap Signer.
3. **Update Mechanism**: Allows the blocklist to be updated dynamically as new threats are identified.

## Use Cases

The dynamic blocklist can be used to:

1. Block deposits from known malicious addresses.
2. Prevent withdrawals to sanctioned or high-risk addresses.
3. Flag suspicious patterns of activity for further review.

## Benefits

1. **Enhanced Security**: Helps prevent malicious actors from abusing the sBTC system.
2. **Flexibility**: Can be updated quickly to respond to new threats.
3. **Compliance**: Assists in adhering to regulatory requirements.

## Considerations

- The blocklist system must balance security with user privacy and system decentralization.
- Regular audits and community oversight may be necessary to ensure the blocklist is not misused.
