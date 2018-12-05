---
layout: org
permalink: /:collection/:path.html
---
# Information for current token holders

The information on this page is intended for **current Stacks token holders** during Blockstack’s token sale through early 2018.


## Find your token balance and unlock date

During your the initial grant process, you should have submitted a _public
Stacks wallet address_ to Blockstack. The wallet address is a string of letters and numbers
starting with an 'SP' or SM', for example: `SM3KJBA4RZ7Z20KD2HBXNSXVPCR1D3CRAV6Q05MKT`

If you purchased Stacks tokens through CoinList, you can find your address at
[CoinList](https://coinlist.co/distributions). If you submitted your Stacks
address directly to Blockstack, you can either use the “Restore from Seed
Phrase” feature on the Stacks wallet or contact us at <hello@stackstoken.com> for
help.


Use the following form to check your Stacks allocation:
<div class="uk-background-secondary uk-padding uk-panel">
<script>
function process()
{
var url="https://explorer.blockstack.org/address/stacks/" + document.getElementById("url").value;
location.href=url;
return false;
}
</script>

<form class="uk-form-horizontal" onSubmit="return process();" autocomplete="off">
 <div>
<input style="background: #fff !important;" class="uk-input" type="text" name="url" id="url" placeholder="Enter public Stacks wallet address">
<input class="uk-button uk-button-default uk-form-width-medium uk-align-center" type="submit" value="Check allocation">
</div>
</form>
</div>

You should see a report detailing the tokens allocated to your address and when they unlock:

![](images/unlocking-address.png)

If you have questions or concerns about your report, please contact <hello@StacksToken.com>.


## Understanding the timeline for unlocking your tokens

In October 2018, the Stacks blockchain launched under the Stacks token. With the
launch, Stacks tokens unlock for accredited token holders under a predetermined
unlocking schedule. The events on the unlocking schedule are the same for each
token holder, the dates of these events depend on the holders’s purchase date.

The general timeline for unlocking tokens and the capabilities that are
potentially possible, are as follows:


![](images/unlocking.png)

Your specific unlock date depends on when you purchased or were granted tokens.
You can use the Blockstack Explorer to discover how many tokens you have
registered and when they will unlock.
