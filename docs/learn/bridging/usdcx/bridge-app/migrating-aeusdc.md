---
description: Migrate your aeUSDC tokens to USDCx.
---

# Migrating aeUSDC to USDCx

## What is aeUSDC?

aeUSDC on Stacks is a bridged form of USDC managed by Allbridge Classic. Following the launch of USDCx on Stacks in December 2025, aeUSDC holders should upgrade to USDCx for better liquidity, improved user experience, and stronger trust assumptions.

aeUSDC was first released in 2023 as a wrapped token that required users to lock USDC on Ethereum and receive aeUSDC on Stacks. With the introduction of native USDCx via Circle's xReserve infrastructure, aeUSDC is being gradually deprecated.

{% hint style="warning" %}
Minting new aeUSDC is disabled. Users can only bridge existing aeUSDC from Stacks back to Ethereum via Allbridge Classic. All new USDC bridging to Stacks should use the official USDCx bridge.
{% endhint %}

## Why Should You Migrate to USDCx?

### Better Liquidity
USDCx provides deeper liquidity pools and smoother swaps through integration with the broader Circle ecosystem. Major DeFi protocols on Stacks including Zest Protocol, Bitflow, and Granite have integrated USDCx, creating robust liquidity across the ecosystem.

### Improved User Experience
- **Direct bridging**: No need for wrapped tokens or multi-step processes
- **Native integration**: Works seamlessly with Circle's Cross-Chain Transfer Protocol (CCTP)
- **Faster transactions**: Streamlined bridging process (~15 minutes confirmation time)
- **Lower complexity**: Eliminate the need to swap wrapped tokens

### Enhanced Security & Trust
- **Circle xReserve**: Non-custodial smart contract infrastructure with cryptographic attestations
- **No third-party bridges**: Direct integration with Circle's infrastructure eliminates bridge risk
- **Institutional grade**: Fully backed 1:1 by USDC held in Circle's reserves
- **Transparent verification**: On-chain attestations provide cryptographic proof of backing

### Ecosystem Support
USDCx is supported by leading Stacks wallets including:
- Asigna
- Fordefi
- Leather
- Xverse

---

## How to Migrate aeUSDC to USDCx

There are two primary migration paths available. Choose the method that best fits your needs:

### Method 1: Swap via Bitflow (Recommended - Fastest & Easiest)

Bitflow has launched aeUSDC/USDCx liquidity pools with deep liquidity to facilitate seamless migration. This is the fastest and most cost-effective way to migrate.

**Steps:**

1. Navigate to [Bitflow Swap](https://app.bitflow.finance/trade)
2. Connect your Stacks wallet (Leather, Xverse, or other supported wallet)
3. Select **aeUSDC** as the "From" token
4. Select **USDCx** as the "To" token
5. Enter the amount you want to migrate
   - You can migrate your full balance at once
   - Or test with a small amount first to verify the process
6. Review the exchange rate and fees
7. Click "Swap" to initiate the transaction
8. Sign the transaction in your wallet to complete the migration

{% hint style="info" %}
**Tip:** Bitflow's swap aggregator automatically routes your trade through the best available liquidity pools to ensure optimal rates with minimal slippage.
{% endhint %}

### Method 2: Bridge via Allbridge Classic + Official USDCx Bridge

This method involves bridging aeUSDC back to Ethereum, then bridging USDC to Stacks as USDCx. While more complex, this route may be preferred if you want to hold USDC on Ethereum temporarily or if Bitflow liquidity is insufficient for large amounts.

**Part A: Bridge aeUSDC back to Ethereum**

1. Navigate to [Allbridge Classic](https://app.allbridge.io/bridge?from=STX&to=ETH&asset=aeUSDC)
2. Connect your Stacks wallet and Ethereum wallet
3. Configure the bridge:
   - **From:** Stacks
   - **To:** Ethereum
   - **Asset:** aeUSDC
4. Enter the amount to bridge
5. Review fees and confirmation time (approximately 60 minutes - six confirmation blocks)
6. Initiate the bridge transaction
7. Sign the transaction in your Stacks wallet
8. Wait for the bridging process to complete
9. Verify you received USDC in your Ethereum wallet

**Part B: Bridge USDC to Stacks as USDCx**

1. Navigate to the [Official USDCx Bridge](https://bridge.stacks.co/usdc/eth/stx)
2. Connect your Ethereum wallet and Stacks wallet
3. Configure the bridge:
   - **From:** USDC (Ethereum)
   - **To:** USDCx (Stacks)
4. Enter the amount to bridge
   - Minimum amount: 10 USDC
   - Network fees: ~$4.80 USD
5. Enter your Stacks recipient address (or use the connected wallet address)
6. Review the transaction details
7. Click "Bridge USDC to Stacks"
8. Approve and sign the transaction in your Ethereum wallet
9. Wait for confirmation (~15 minutes)
10. Verify you received USDCx in your Stacks wallet

{% hint style="warning" %}
**Important Notes:**
- Total time for this method: ~75 minutes (60 min + 15 min)
- Two sets of gas fees apply (Ethereum gas for both transactions)
- Ensure you have enough ETH for gas fees on both bridge transactions
{% endhint %}

---

## Migration Comparison

| Feature | Bitflow Swap | Allbridge + USDCx Bridge |
|---------|--------------|--------------------------|
| **Time** | ~1-2 minutes | ~75 minutes |
| **Complexity** | Low (single swap) | High (two bridges) |
| **Fees** | Swap fee only (~0.3%) | Bridge fees + Ethereum gas × 2 |
| **Best For** | Most users, fast migration | Large amounts, holding USDC on Ethereum |
| **Network Used** | Stacks only | Stacks → Ethereum → Stacks |

---

## What is USDCx?

USDCx is a USDC-backed stablecoin native to Stacks, issued through Circle's xReserve infrastructure. Unlike wrapped tokens like aeUSDC, USDCx is:

- **Fully backed 1:1** by USDC held in Circle xReserve
- **Cryptographically attested** with on-chain proof of reserves
- **Interoperable** with USDC across 15+ supported blockchains via CCTP
- **Native to Stacks** as a SIP-010 token
- **Institutional grade** with Circle's security and compliance standards

### Technical Architecture

USDCx uses a sophisticated bridging mechanism:

**Deposits (Ethereum → Stacks):**
1. User deposits USDC into Circle's xReserve smart contract on Ethereum
2. Funds are locked and a deposit event is emitted
3. Circle's attestation service generates a cryptographic deposit attestation
4. Stacks attestation service fetches the signed attestation
5. USDCx tokens are minted on Stacks and deposited to user's wallet

**Withdrawals (Stacks → Ethereum):**
1. User requests to burn USDCx on Stacks
2. USDCx tokens are burned and a burn event is emitted
3. Stacks attestation service creates a burn intent message
4. Circle's xReserve verifies the burn
5. USDC is released to user's wallet on Ethereum

---

## Frequently Asked Questions

### Do I have to migrate?

While not required immediately, migration to USDCx is strongly recommended. As the ecosystem standardizes on USDCx, aeUSDC liquidity will continue to decrease, potentially making it harder to use or migrate later.

### What happens if I don't migrate?

You can continue holding aeUSDC, but you'll experience:
- Reduced liquidity and fewer trading pairs
- Higher slippage when trading
- Limited support from new DeFi applications
- Difficulty bridging (minting disabled, only withdrawals available)

### Can I migrate back to aeUSDC if needed?

No. Once migrated to USDCx, you cannot directly convert back to aeUSDC. However, you can bridge USDCx to USDC on Ethereum if needed.

### Are there any risks?

Both migration methods use audited protocols:
- **Bitflow**: Audited by leading Clarity security experts
- **Allbridge Classic**: Audited by Hacken, Kudelski Security, Cossack Labs, and CoinFabrik
- **Official USDCx Bridge**: Powered by Circle's institutional-grade infrastructure

As with any DeFi transaction, always verify contract addresses and start with small test amounts.

### What's the minimum amount I can migrate?

- **Bitflow swap**: No minimum (subject to gas fees making it economical)
- **USDCx bridge**: 10 USDC minimum

### Will I lose money during migration?

- **Bitflow swap**: You'll pay a small swap fee (~0.3%) plus Stacks transaction fees
- **Bridge method**: You'll pay Allbridge fees + Ethereum gas × 2 + Stacks transaction fees

The cost difference can be significant, especially during high Ethereum gas periods.

---

## Additional Resources

### Official Links
- [USDCx Bridge](https://bridge.stacks.co/usdc/eth/stx)
- [Bitflow DEX](https://app.bitflow.finance)
- [Allbridge Classic](https://app.allbridge.io/bridge)
- [Stacks Documentation - USDCx](https://docs.stacks.co/learn/bridging/usdcx)

### Wallet Support
- [Xverse Wallet](https://www.xverse.app/)
- [Leather Wallet](https://leather.io/)
- [Asigna Wallet](https://asigna.io/)

### DeFi Integrations
- [Zest Protocol](https://zestprotocol.com/) - Lending/borrowing with USDCx
- [Granite](https://www.granite.xyz/) - Bitcoin-collateralized loans in USDCx
- [Bitflow](https://bitflow.finance/) - Trading and liquidity provision

---

## Need Help?

If you encounter any issues during migration:

1. **For Bitflow issues**: Visit [Bitflow Discord](https://discord.gg/bitflow) or check their documentation
2. **For Allbridge issues**: Contact [Allbridge Support](https://allbridge.io/)
3. **For USDCx bridge issues**: Visit [Stacks Discord](https://discord.gg/stacks) or check [Stacks Documentation](https://docs.stacks.co)
4. **For wallet issues**: Contact your wallet provider's support team

---

*Last updated: January 2026*
