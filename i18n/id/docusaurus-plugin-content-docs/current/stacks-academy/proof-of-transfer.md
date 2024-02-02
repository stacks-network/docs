---
title: Proof of Transfer
description: Memahami mekanisme konsensus proof-of-transfer
sidebar_position: 3
---

In the previous section, we took a look at the vision and ethos of Stacks. We talked a lot about it being connected to Bitcoin and how it enables expanding functionality without modifying Bitcoin itself.

In this section, we'll run through the consensus mechanism that makes that happen, Proof of Transfer.

Algoritma konsensus untuk blockchain membutuhkan sumber daya komputasi atau finansial untuk mengamankan blockchain. Praktik umum dari konsensus terdesentralisasi adalah dengan membuatnya secara praktis tidak memungkinkan bagi setiap aktor jahat untuk memiliki kekuatan komputasi yang cukup atau kepemilikan saham untuk menyerang jaringan.

Popular consensus mechanisms in modern blockchains include proof of work, in which nodes dedicate computing resources, and proof of stake, in which nodes dedicate financial resources to secure the network.

Proof of burn is another, less-frequently used consensus mechanism where miners compete by ‘burning’ (destroying) a proof of work cryptocurrency as a proxy for computing resources.

Proof of transfer (PoX) is an extension of the proof of burn mechanism. PoX uses the proof of work cryptocurrency of an established blockchain to secure a new blockchain. However, unlike proof of burn, rather than burning the cryptocurrency, miners transfer the committed cryptocurrency to some other participants in the network.

![Mekanisme PoX](/img/pox-mechanism.png)

Ini memungkinkan peserta jaringan untuk mengamankan jaringan mata uang kripto PoX dan mendapatkan hadiah dalam mata uang kripto dasar. Thus, PoX blockchains are anchored on their chosen PoW chain. Stacks menggunakan [Bitcoin](#why-bitcoin) sebagai rantai tertautnya.

![Peserta PoX](/img/pox-participants.png)

## Mengapa Bitcoin?

Ada beberapa alasan mengapa Stacks memilih Bitcoin sebagai blockchain untuk mendukung konsensus. Ini adalah protokol blockchain tertua, yang diluncurkan pada tahun 2009, dan telah menjadi aset yang diakui di luar komunitas mata uang kripto. BTC telah memegang kapitalisasi pasar tertinggi dari semua mata uang kripto selama dekade terakhir ini.

Bitcoin unggul pada kesederhanaan dan stabilitas, dan telah teruji oleh waktu. Mempengaruhi atau menyerang jaringan akan menjadi sulit atau tidak praktis bagi peretas yang berpotensial. Ini adalah satu-satunya mata uang kripto yang menarik perhatian publik. Bitcoin adalah nama rumah tangga, dan diakui sebagai aset oleh pemerintah, perusahaan besar, dan lembaga perbankan warisan. Lastly, Bitcoin is largely considered a reliable store of value, and provides extensive infrastructure to support the PoX consensus mechanism.

SIP-001 memberikan [daftar lengkap alasan mengapa Bitcoin dipilih untuk mengamankan Stacks](https://github.com/stacksgov/sips/blob/main/sips/sip-001/sip-001-burn-election.md).

:::note
By the way, SIP stands for Stacks Improvement Proposal, and it's the process by which community members agree on making changes to the network, we'll look at these in a future lesson.
:::

## Blok dan mikroblok

Blockchain Stacks memungkinkan peningkatan transaksi melalui mekanisme yang disebut mikroblok. Bitcoin dan Stacks berkembang secara bertahap, dan blok mereka dikonfirmasi secara bersamaan. Di Stacks, ini disebut sebagai 'blok tertaut'. Seluruh blok transaksi Stacks sesuai dengan satu transaksi Bitcoin. Ini secara signifikan meningkatkan rasio biaya/byte untuk memproses transaksi Stacks. Karena produksi blok yang secara simultan, Bitcoin bertindak sebagai pembatas kecepatan untuk membuat blok Stacks, sehingga mencegah serangan penolakan layanan pada jaringan rekanannya.

Namun, di antara blok terkait Stacks yang menetap di blockchain Bitcoin, ada juga sejumlah mikroblok yang memungkinkan penyelesaian transaksi Stacks secara cepat dengan tingkat kepercayaan yang tinggi. Hal ini memungkinkan transaksi Stacks untuk menskalakan secara independen dari Bitcoin, sambil tetap secara berkala menetapkan finalitas dengan rantai Bitcoin. Blockchain Stacks mengadopsi model streaming blok di mana setiap pemimpin dapat secara adaptif memilih dan mengemas transaksi ke dalam blok mereka saat mereka tiba di mempool. Oleh karena itu ketika blok terkait dikonfirmasi, semua transaksi dalam aliran mikroblok induk dikemas dan diproses. Ini merupakan metode yang belum pernah terjadi sebelumnya untuk mencapai skalabilitas tanpa membuat protokol yang benar-benar terpisah dari Bitcoin.

![stx-mikroblok](/img/stx-microblocks.png)

## Membuka kunci modal Bitcoin

In the previous section we talked about Stacks being able to allow us to build a decentralized economy on top of Bitcoin and that PoX was a key piece of being able to do that.

The reason is two-fold. First, as a part of this PoX mining process we have covered here, a hash of each Stacks block is recorded to the OP_RETURN opcode of a Bitcoin transaction. If you aren't familiar, the OP_RETURN opcode allows us to store up to 40 bytes of arbitrary data in a Bitcoin transaction.

:::note
This [Stack Exchange answer](https://bitcoin.stackexchange.com/questions/29554/explanation-of-what-an-op-return-transaction-looks-like) gives a good overview of the reasoning and history of this opcode.
:::

This is how Stacks records its history to the Bitcoin chain and why it inherits some security as a result of this process. If you wanted to try and create a false Stacks fork, you would have to broadcast the entire process to the Bitcoin chain.

Similarly, if you wanted to try and change the history of the Stacks chain, you would have to somehow modify these OP_RETURN values in each corresponding Bitcoin block, meaning you would have to compromise Bitcoin in order to compromise the history of Stacks.

:::caution
Note that this is not the same thing as saying that you need to compromise Bitcoin in order compromise Stacks at all, but simply that in order to falsify the history of the Stacks chain you would have to also falsify the history of the Bitcoin chain.
:::

Additionally, part of this PoX process involves each Stacks block also knowing which Bitcoin block it is anchored to. Clarity, Stacks' smart contract language, has built-in functions for reading this data, such as [`get-block-info`](https://docs.stacks.co/docs/write-smart-contracts/clarity-language/language-functions#get-block-info), which returns, among other things, a field called `burnchain-header-hash`, which gives us the hash of the Bitcoin header corresponding to this Stacks block.

This allows us to do really interesting things like trigger certain things to happen in a Clarity contract by watching the chain and verifying whether or not certain transactions occurred. You can see this in action in [Catamaran Swaps](https://docs.catamaranswaps.org/en/latest/catamaran.html), with other interesting projects like [Zest](https://www.zestprotocol.com/) seeking to expand on this functionality.

The ultimate goal of all this is to enable the vision of web3, building a decentralized economy and enabling true user ownership of assets and data, on top of Bitcoin as a settlement layer, and using Bitcoin as a base decentralized money.

![Membuka kunci Bitcoin](/img/pox-unlocking-btc.png)

We also recommend [reading the full PoX whitepaper](https://community.stacks.org/pox), as it breaks down the reasoning behind creating a PoX chain and the unique benefits we get from doing so.

## Proof of Transfer Contracts and Technical Details

The Proof of Transfer functionality is implemented on the Stacks chain via a [Clarity smart contract](https://explorer.stacks.co/txid/0xfc878ab9c29f3d822a96ee73898000579bdf69619a174e748672eabfc7cfc589). An overview of this contract is [available in the docs](../clarity/noteworthy-contracts/stacking-contract.md).

You can see the original design for stacking and proof of transfer by reading the relevant SIP, [SIP-007](https://github.com/stacksgov/sips/blob/main/sips/sip-007/sip-007-stacking-consensus.md). You can also utilize [Hiro's API](https://docs.hiro.so/api#tag/Info/operation/get_pox_info) to get proof of transfer details including the relevant contract address.

However, since Stacks mainnet launched in January 2021, several shortcomings have been recognized in the stacking process, which are being corrected in the next major network epoch, Stacks 2.1 You can read more about these changes in [SIP-015](https://github.com/stacksgov/sips/blob/feat/sip-015/sips/sip-015/sip-015-network-upgrade.md), the SIP responsible for managing the upgrade to 2.1.

### Got another question

Have another question not answered here? Post in on Stack Overflow under the appropriate tag(s) and post the link to the Stack Overflow question in the Stacks Discord in the appropriate channel.
