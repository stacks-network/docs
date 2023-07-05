---
title: Envoi de Bitcoin avec le portefeuille Hiro
description: Lancer une transaction standard Bitcoin avec le portefeuille Hiro
---

En utilisant le portefeuille web d'Hiro, nous pouvons facilement initier une transaction Bitcoin simple avec seulement quelques lignes de code.

Vous devrez être authentifié avec le portefeuille Hiro pour que cela fonctionne, consultez comment faire dans le guide [Authentification avec Stacks.js](./stacks-js-auth).

Une fois que vous avez connecté le portefeuille, vous pouvez utiliser l'API Hiro Wallet pour initier une simple transaction Bitcoin dans votre application JS de cette façon.

```javascript
const sendBitcoin = async () => {
  const resp = attendre window.btc?. equest("sendTransfer", {
    adresse: "tb1qya9wtp4dyq67ldxz2pyuz40esvgd0cgx9s3pjl", //remplacez ceci par n'importe quelle adresse que vous voulez envoyer au montant de
    : "10000", // le montant que vous voulez envoyer en satoshis
  });

  // Stockage de txid dans le stockage local
  // Nous récupérerons la transaction IF, que nous pouvons ensuite utiliser pour faire ce que nous voulons
  si (typeof window ! = "undefined") {
    localStorage. etItem("txid", JSON.stringify(resp.resultat. xid));
  }

  // Nous pouvons vouloir faire quelque chose une fois cette transaction confirmée, pour que nous puissions le mettre en attente ici et ensuite utiliser une API comme mempool. le rythme de requête de la chaîne Bitcoin pour obtenir des informations sur cette transaction
  localStorage.setItem("txStatus", "pending");
};
```

Ensuite, tout ce que nous ferions est de brancher notre bouton pour appeler cette fonction `sendBitcoins`.

```javascript
<button onClick={sendBitcoin}>Send Bitcoin</button>
```

Vous pouvez jeter un coup d'œil au guide [Vérifier une transaction sur la chaîne BTC](./verifying-a-btc-tx-was-mined.md) pour voir un flux utilisateur plus complexe de vérification d'une transaction qui a été miné en utilisant cet ID retourné comme point de départ.

Vous pouvez jeter un coup d'oeil à un peu plus d'informations sur cette simple API sur la [documentation du développeur de portefeuille Hiro](https://hirowallet.gitbook.io/developers/bitcoin/sign-transactions/sending-bitcoin).
