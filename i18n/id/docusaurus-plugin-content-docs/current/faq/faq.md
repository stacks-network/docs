---
title: General FAQs
description: Pertanyaan Umum
sidebar_label: "Pertanyaan Umum (FAQ)"
sidebar_position: 10
---

![](/img/glasses.png)

## Mengapa transfer saya tertunda?

Biasanya karena biaya Anda terlalu rendah atau [nonce](#what-is-nonce) Anda salah.

Informasi lebih lanjut dapat ditemukan [di sini](https://www.hiro.so/wallet-faq/why-is-my-stacks-transaction-pending). Ada juga [praktik terbaik dan masalah yang diketahui](https://forum.stacks.org/t/transactions-in-mempool-best-practices-and-known-issues/11659) serta [mendiagnosis transaksi yang tertunda](https://forum.stacks.org/t/diagnosing-pending-transactions/11908).

Ada juga [skrip](https://github.com/citycoins/scripts/blob/main/getnetworkstatus.js) ini untuk melihat 200 transaksi pertama atau semua transaksi di mempool, untuk kemudian mengembalikan nilai biaya maksimum dan rata-rata. Kami telah memperhatikan bahwa menggunakan 1,5-2x biaya rata-rata di mempool umumnya akan memproses barang dalam 6-10 blok bahkan selama kemacetan tinggi.

Ada juga [skrip](https://github.com/citycoins/scripts/blob/main/gettxstatus.js) ini untuk melacak transaksi yang tertunda hingga mencapai status akhir.

## Apa itu Nonce?

Sebuah nonce digunakan untuk memastikan bahwa setiap transaksi berjalan dalam urutan yang benar. Nonce dimulai dari 0, jadi transaksi pertama dari sebuah alamat harus disetel ke nonce=0. Anda dapat menemukan alamat dompet Anda dengan mencari alamat di [penjelajah blockchain Stacks](https://explorer.stacks.co/) mana pun. Anda juga dapat menggunakan saldo `$ stx <address>`.

Jika Anda memiliki nonce transaksi yang kurang dari nonce akun Anda, transaksi tersebut tidak dapat ditambang dan akan (harus) hilang setelah 256 blok. Ini tidak mempengaruhi transaksi masa depan dan oleh karena itu dapat diabaikan begitu saja, mereka berada di masa lalu.

Jika Anda memiliki transaksi nonce yang sama dengan nonce akun Anda, maka transaksi tersebut sah dan harus menjadi baris berikutnya yang akan diproses selanjutnya.

Jika Anda memiliki nonce transaksi yang lebih tinggi dari nonce akun Anda, maka perlu ada rantai transaksi yang dimulai dengan nonce akun Anda agar dapat diproses. Misalnya. Nonce akun Anda adalah 10 tetapi transaksi yang tertunda memiliki nonce 12. Ini tidak dapat ditambang sampai transaksi dengan nonce 10 dan 11 diproses.

## Apa itu Replace-by-fee (RBF)?

Transaksi replace-by-fee (RBF) memberi tahu blockchain bahwa Anda ingin mengganti satu transaksi dengan yang lain, sambil menentukan biaya yang lebih tinggi dari biaya transaksi asli. Suatu transaksi dapat diganti dengan **transaksi lain**, dan tidak terbatas pada operasi yang sama.

Ini dapat digunakan untuk **membatalkan transaksi** secara efektif dengan menggantinya dengan sesuatu yang lain, seperti transfer STX kecil ke alamat lain yang dimiliki.

Ini dapat digunakan untuk **menaikkan biaya untuk transaksi** yang tertunda sehingga dianggap oleh penambang selama periode kemacetan yang tinggi. Ini juga dapat digunakan untuk _mengirim ulang_ transaksi, dalam arti bahwa transaksi RBF mendapat txid baru dan dipertimbangkan lagi (atau lebih cepat) oleh penambang. Misalnya. Saya mengajukan transaksi saya dengan biaya 1 STX di blok 54.123. Dengan blok 54.133 saya melihat tx saya belum diambil, jadi saya RBF dengan 1.1 STX. Kemudian tunggu 10 blok lagi, dan RBF lagi jika tidak diterima. Ada keseimbangan antara melakukan ini terlalu sering dan menjaga kecepatan yang konsisten, tetapi telah terlihat membantu menyelesaikan transaksi, terutama ketika yang baru terus-menerus membanjiri.

Transaksi penggantian harus menggunakan nonce yang sama dengan transaksi awal dengan kenaikan biaya minimal 0,000001 STX. Misalnya. Transaksi awal Anda dikenakan biaya 0,03 STX, transaksi RBF baru harus dikenakan biaya 0,030001 STX atau lebih.

Proses transaksi RBF dengan salah satu dari dua cara berikut:

- Jika penambang mengambil transaksi asli sebelum transaksi RBF diterima, maka transaksi asli diproses dan transaksi pengganti masuk ke status tidak dapat ditambang. Ini pada akhirnya akan hilang dan tidak mempengaruhi transaksi di masa depan.
- Jika penambang mengambil transaksi yang diganti, maka transaksi baru akan diproses alih-alih yang asli, dan status transaksi awal diatur ke “droppped_replaced_by_fee”. Status ini tidak ditampilkan pada explorer tetapi dapat dilihat saat menanyakan file txid.

Mengirimkan beberapa transaksi untuk tindakan yang sama dapat memperlambat segalanya dalam beberapa cara.

- Jika total yang dibelanjakan dalam 2 atau 3 transaksi lebih dari yang dapat dihabiskan dalam satu transaksi, transaksi tersebut tampaknya tidak dapat ditambang.
- Jika biaya untuk beberapa transaksi melebihi saldo STX, transaksi tidak dapat ditambang.

## What are .btc domains?

[This forum post](https://forum.stacks.org/t/btc-domains-are-live/12065) explains all the benefits of .btc domains. They can currently be purchased in [btc.us](https://btc.us/)

## What is the blockchain trilemma?

## Stacks vs. Solana vs. Polygon: How Do They Compare From a Developer Perspective?

[This blog post answers the question](https://www.hiro.so/blog/stacks-vs-solana-vs-polygon-how-do-they-compare-from-a-developer-perspective).

## What Does Lightning’s Taro Proposal Mean for Stacks?

[This blog post answers the question](https://www.hiro.so/blog/what-does-lightnings-taro-proposal-mean-for-stacks).


## Is Stacks a [PoS chain](https://en.wikipedia.org/wiki/Proof_of_stake)?[¹][]

No.

The act of block production requires an extrinsic expenditure — it is not tied to owning the native token, as would be required in PoS. The only way to produce blocks in the Stacks chain is to transfer Bitcoin to a predetermined randomized list of Bitcoin addresses. Moreover, the Stacks blockchain can fork, and there exists a protocol to rank forks by quality independent of the set of miners and the tokens they hold. These two properties further distinguish it from PoS chains, which cannot fork due to the inability to identify a canonical fork without trusting a 3rd party to decree a particular fork as valid. The ability to fork allows the Stacks blockchain to survive failure modes that would crash a PoS chain.

## Is Stacks a [sidechain](https://en.bitcoin.it/wiki/Sidechain)?[¹][]

No.

For two key reasons.

First, the history of all Stacks blocks produced is recorded to Bitcoin. This means that the act of producing a private Stacks fork is at least as hard as reorging the Bitcoin chain. This in turn makes it so attacks on the chain that rely on creating private forks (such as selfish mining and double-spending) are much harder to carry out profitably, since all honest participants can see the attack coming before it happens and have a chance to apply countermeasures. Sidechains offer no such security benefit.

Second, the Stacks blockchain has its own token; it does not represent pegged Bitcoin. This means that the safety of the canonical fork of the Stacks blockchain is underpinned by its entire token economy’s value, whereas the safety of a sidechain’s canonical fork is underpinned only by whatever system-specific measures incentivize its validators to produce blocks honestly, or the Bitcoin miners’ willingness to process peg-in requests (whichever is the weaker guarantee).


## Is Stacks a [layer-2 system](https://academy.binance.com/en/glossary/layer-2) for Bitcoin?[¹][]

No.

Stacks blockchain is a layer-1 blockchain, which uses a novel and unique mining protocol called proof-of-transfer (PoX). A PoX blockchain runs in parallel to another blockchain (Bitcoin in Stacks’ case), which it uses as a reliable broadcast medium for its block headers. It's a sovereign system in its own right. The Stacks blockchain state is distinct from Bitcoin, and is wholly maintained by and for Stacks nodes. Stacks transactions are separate from Bitcoin transactions. Layer-2 systems like Lightning are designed to help scale Bitcoin payment transactions, whereas Stacks is designed to bring new use-cases to Bitcoin through smart contracts. Stacks is not designed as a Bitcoin layer-2 scalability solution.


## Is Stacks a [merged-mined chain](https://en.bitcoin.it/wiki/Merged_mining_specification)?[¹][]

No.

The only block producers on the Stacks chain are Stacks miners. Bitcoin miners do not participate in Stacks block validation, and do not claim Stacks block rewards. Moreover, Stacks is not a [blind merged-mined chain](https://github.com/bitcoin/bips/blob/master/bip-0301.mediawiki), because STX block winners are public and randomly chosen (instead of highest-bid-wins), and its tokens are minted according to a schedule that is independent of the degree of miner commitment or Bitcoin transferred (instead of minted only by one-way pegs from Bitcoin). This ensures that Stacks is able to make forward progress without opt-in from Bitcoin miners, and it ensures that Stacks miners are adequately compensated for keeping the system alive regardless of transaction volume.

## Whats the difference between Stacks and Ethereum?[²][]
**Computation and Storage** Stacks does all computation and storage outside of the blockchain, and uses the blockchain only as a “shared source of truth” between clients. By contrast, Ethereum does all computation and most application storage in the blockchain itself. Like Ethereum, if two Stacks nodes see the same underlying blockchain, they will independently run the same computations and produce the same state. Unlike Ethereum, there is no Stacks-specific blockchain.

**Programming Language and Tooling** Stacks’s programming model is based on running off-chain programs. These programs can be written and debugged in any language you want. By contrast, Ethereum’s programming model is based on running on-chain “smart contracts.” These are written and debugged with a whole new set of tools, like Solidity and Serpent.

**Scalability of On-chain Computation** Stacks is designed around a “virtual chain” concept, where nodes only need to reach consensus on the shared “virtual chain” they’re interested in. Virtual chains do not interact with one another, and a single blockchain can host many virtual chains. Although Stacks’s specific virtual chain is not Turing-complete (i.e. it’s a list of instructions to build the name database), it is possible to create Turing-complete virtual chains like Ethereum. These virtual chains can live in any blockchain for which there exists a driver, and virtual chain clients only need to execute their virtual chain transactions (i.e. Stacks only processes Stacks virtual chain transactions).

By contrast, because smart contracts run on-chain and can call one another, all Ethereum nodes need to process all smart contracts’ computations in order to reach consensus. This can get expensive as the number of running smart contracts grow, which takes the form of gas fee increases.

**Scalability of Off-chain Computation** Stacks applications are very similar to Web applications today and almost never need to interact with the blockchain. For most Stacks applications, the blockchain is only used to authenticate the application’s code and data before the user runs it. By contrast, Ethereum applications usually require an application-specific smart contract, and must interact with the blockchain to carry out its operations.


[¹]: https://stacks.org/stacks-blockchain
[²]: https://forum.stacks.org/t/what-is-the-difference-between-blockstack-and-ethereum/781
