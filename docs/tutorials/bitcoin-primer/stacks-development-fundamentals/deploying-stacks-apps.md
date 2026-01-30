# Deploying Stacks Apps

Finally, we need to deploy our new fundraising dapp.

## Deploying the Frontend

We won't cover deploying the frontend in detail in this guide, as that is up to the user and depends on your chosen framework. However, here are some recommended options:

- **Vercel** (recommended for Next.js apps) - Easy deployment with GitHub integration
- **Netlify** - Great for static sites and modern web apps
- **Cloudflare Pages** - Fast global CDN with zero configuration

### Environment Variables Best Practices

Make sure you have appropriately handled your environment variables. You'll want to ensure your deployments use the appropriate Stacks network.

You can create multiple environments and set these to correspond to different branches of your repo:

| Environment | Branch | Network | Purpose |
|-------------|--------|---------|---------|
| Development | `dev` | Testnet | Testing new features |
| Staging | `staging` | Testnet | Pre-production validation |
| Production | `main` | Mainnet | Live application |

**Example environment variables:**
```bash
# Development (.env.local)
NEXT_PUBLIC_NETWORK=testnet
NEXT_PUBLIC_API_URL=https://api.testnet.hiro.so

# Production (.env.production)
NEXT_PUBLIC_NETWORK=mainnet
NEXT_PUBLIC_API_URL=https://api.hiro.so
```


### Deploying your contracts

Because we are using a Platform template, deployment plans are handled for us. For a detailed guide on using Clarinet for deployment, check out the [Contract Deployment guide](https://docs.stacks.co/learn-clarinet/contract-deployment) in the docs.

For us, we already have a testnet deployment plan in `default.testnet-plan.yaml` that we can use.

One thing we do need to do is set up our credentials for the testnet account we want to use to deploy. You can see a sample of this file at the above guide, but it looks like this.

This file should live at `settings/Testnet.toml`.

```toml
[network]
name = "testnet"
deployment_fee_rate = 10

[accounts.deployer]
mnemonic = "<YOUR TESTNET MNEMONIC>"
balance = 100_000_000_000_000
derivation = "m/44'/5757'/0'/0/0"
```

Add your mnemonic for the testnet account you want to deploy from. Then run the following command in your `clarity` folder. Make sure your wallet has some STX in it. You can use the faucet in the Hiro Platform if it does not.

```bash
clarinet deployments apply --testnet
```

Clarinet will ask if you want to use the newly generated deployment plan. In this case we want to say yes because our expected sender is going to be different.

After you confirm you can see your contracts being deployed to testnet and can watch as they are confirmed.

You can see my fundraising contract [here](https://explorer.hiro.so/txid/STCDSEQ1MQV2S6K09CPG9VZYQA40EKNKJ835RZRK.fundraising?chain=testnet).
