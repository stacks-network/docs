Use the following table to answer questions about keys/phrases/values you can share with others (`SHAREABLE`) and ones you should _never_ share but instead keep in a secure place (`PROTECT`).

<table class="uk-table-small uk-table-striped uk-text-small">
   <tr valign="top">
      <th class="uk-width-large">Phrase/Key/Value</th>
      <th>Security</th>
      <th class="uk-width-medium">Description</th>
   </tr>
   <tr valign="top">
      <td>
         <p>Secret Recovery Key</p>
         <p>12 word seed phrase</p>
         <p>24 word seed phrase</p>
      </td>
      <td><p>PROTECT</p></td>
      <td>
         <p>A 12 or 24 sequence of words for example:</p>
         <p><code>applied binge crisp pictorial fiery</code>
         </p><p><code> dancing agreeable frogs light finish ping apple</code></p>
      </td>
   </tr>
   <tr valign="top">
      <td>
         <p>Identity</p>
         <p>Blockstack identity</p>
         <p>Blockstack ID</p>
         </td>
      <td><p>SHAREABLE</p></td>
      <td>
         <p>A username, Both <code>moxiegirl.id.blockstack</code> or <code>chad.id</code> are examples of IDs.</p>
      </td>
   </tr>
   <tr valign="top">
      <td>Magic Recovery Code</td>
      <td><p>PROTECT</p></td>
      <td><p>An long encrypted string, for example:</p>
        <p> <code>36mWivFdy0YPH2z31EflpQz/Y0UMrOrJ++lH=0EI7c3mop2JuRBm5WXxSTazJsUjOA...</code></p>
         <p>Do not share the QR code that accompanied your code either. This is a QR code:</p>
           <img src="/org/images/qr-code.png"/>
      </td>
   </tr>
   <tr valign="top">
      <td>Blockstack Owner Address</td>
      <td><p>SHAREABLE</p></td>
      <td><p>Looks like a bitcoin address but starts with <code>ID</code> for example:</p>
         <p><code>ID-1J3PUxY5uDShUnHRrMyU6yKtoHEUPhKULs</code></p>
      </td>
   </tr>
   <tr valign="top">
      <td>Bitcoin address
         BTC Address
      </td>
      <td><p>SHAREABLE</p></td>
      <td><p>A string of letters and numbers.</p>
    <p><code>3E53XjqK4Cxt71BGeP2VhpcotM8LZ853C8</code></p>
        <p>Sharing this address allows anyone to send Bitcoin to the address.</p>
      </td>
   </tr>
   <tr valign="top">
      <td><p>Stacks Address</p>
         <p>Stacks Wallet Address</p>
         <p>STX address</p>
      </td>
      <td><p>SHAREABLE</p></td>
      <td><p>A string of letters and numbers starting with an <code>SP</code> or <code>SM</code></p>
      <code>SM3KJBA4RZ7Z20KD2HBXNSXVPCR1D3CRAV6Q05MKT</code>
         <p>Sharing this allows anyone to send Stacks to the address, view the address balances, and view the address allocations.</p>
      </td>
   </tr>
   <tr valign="top">
      <td>public key</td>
      <td><p>SHAREABLE</p></td>
      <td><p>Public and private key pair comprise of two uniquely related cryptographic keys. It looks like a long random string of letters and numbers:</p>
         <p><code>3048 0241 00C9 18FA CF8D EB2D EFD5 FD37 89B9 E069 EA97 FC20 …</code></p>
      <p>The exact format of the public and private key depend on the software you use to create them.</p>
      </td>
   </tr>
   <tr valign="top">
      <td>private key</td>
      <td></td>
      <td><p>Private keys matches a corresponding public key.  A public key also looks like a string of letters and numbers:</p>
      <img src="/org/images/private.png"/>
         <p>The exact format of the public and private key depend on the software you use to create them.</p>
      </td>
   </tr>
</table>
