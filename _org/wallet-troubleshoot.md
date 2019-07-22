---
layout: org
permalink: /:collection/:path.html
---
# Wallet FAQs and Troubleshooting
{:.no_toc}

This page contains frequently asked questions and troubleshooting related to the wallet.

* TOC
{:toc}


## Frequently asked questions

{% for faq in site.data.theFAQs.faqs %}
   {% if faq.category == 'wallet' %}
### {{ faq.question }}
{{ faq.answer }}
  {% endif %}
{% endfor %}

## Change from a software-only wallet to a hardware wallet

To change from a software-only wallet to a hardware wallet, do the following:

1. Purchase and set up your hardware wallet according to the manufacturer's instructions.
2. **Reset** the Blockstack Software wallet <a href="wallet-use.html#reset-the-wallet" target="_blank">according to the instructions</a>.
3. Choose the <a href="wallet-use.html#use-with-a-hardware-wallet" target="_blank">hardware wallet option<a> to setup the Blockstack Software wallet.
4. Use the <a href="wallet-use.html#receive-stacks" target="_blank">**Receive** button to display the Stacks address</a>.
5. Login into your Coinlist account.
6. Change your Stacks wallet address.


## View or change your Stacks wallet address on Coinlist

If you purchased Stacks via Coinlist during in the token sale, your Stacks address is located at this URL:

```
https://sale.stackstoken.com/stacks-token-sale/YOUR_COINLIST_USERNAME/wallet_address 
```

For example, if your Coinlist user name is `Eleven`, the URL you would use is:

```
https://sale.stackstoken.com/stacks-token-sale/Eleven/wallet_address 
```

To view or change your Stacks address on Coinlist, do the following:

1. Log into your Coinlist account.
2. Enter the URL in this format:
  
   ```
  https://sale.stackstoken.com/stacks-token-sale/YOUR_COINLIST_USERNAME/wallet_address 
  ```

3. Change your address if necessary.
