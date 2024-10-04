# Wallet Integration

This guide outlines how wallet developers can integrate sBTC deposits and withdrawals directly into their wallets, providing Bitcoin holders with easy access to Stacks smart contracts.

## Deposit Flow

To support sBTC deposits:

1. Add an option for users to deposit BTC as sBTC
2. When selected, prompt the user for the BTC amount to deposit
3. Generate a deposit address using the sBTC deposit API (docs coming soon)
4. Display deposit instructions to the user
5. Monitor for the deposit transaction on Bitcoin
6. Once confirmed, show the sBTC balance in the wallet

## Withdrawal Flow

To support sBTC withdrawals:

1. Add an option for users to withdraw sBTC to BTC
2. When selected, prompt for the sBTC amount and BTC address
3. Construct and broadcast the sBTC withdrawal transaction
4. Monitor for completion of the withdrawal (6 Stacks block confirmations)
5. Update the wallet balances once withdrawal is processed

## Balance Updates

- Update and display both BTC and sBTC balances after deposits/withdrawals
- Show pending/processing status for in-flight operations

## API Integration

Integrate with the sBTC deposit API and Stacks blockchain API to:

- Generate deposit addresses
- Monitor deposit/withdrawal status
- Query sBTC balances

## Security Considerations

- Use secure key management for signing sBTC transactions
- Validate all user inputs
- Handle error cases gracefully
- Follow best practices for Bitcoin and Stacks address generation/validation

## Testing

Thoroughly test deposit and withdrawal flows on testnet before mainnet launch.

For more details on the APIs and contracts, refer to the sBTC developer documentation.
