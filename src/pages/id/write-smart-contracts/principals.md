---
title: Prinsipal
description: 'Clarity: Memahami Prinsipal'
images:
  large: /images/pages/write-smart-contracts.svg
  sm: /images/pages/write-smart-contracts-sm.svg
---

## Pengantar

_Prinsipal_ adalah tipe native Clarity yang mewakili entitas yang dapat memiliki saldo token. Bagian ini membahas prinsip-prinsip dan bagaimana mereka digunakan dalam Clarity.

## Prinsipal dan tx-sender

Aset dalam bahasa kontrak pintar dan blockchain "dimiliki" oleh objek dari tipe utama, yang berarti bahwa objek apa pun dari tipe utama dapat memiliki aset. Untuk kasus alamat Stacks dari hash kunci-publik dan multi-tanda tangan, prinsipal tertentu dapat beroperasi pada aset mereka dengan mengeluarkan transaksi yang ditandatangani di blockchain. _Kontrak pintar_ mungkin juga prinsipal (direpresentasikan oleh pengidentifikasi kontrak pintar), namun, tidak ada kunci privat yang terkait dengan kontrak pintar, dan tidak dapat menyiarkan transaksi yang ditandatangani pada blockchain.

Kontrak Clarity dapat menggunakan variabel `tx sender` yang ditentukan secara global untuk mendapatkan prinsipal saat ini. Contoh berikut mendefinisikan jenis transaksi yang mentransfer `amount` microSTX dari pengirim ke penerima jika jumlahnya kelipatan 10, jika tidak maka akan mengembalikan kode kesalahan 400.

```clarity
(define-public (transfer-to-recipient! (recipient principal) (amount uint))
  (if (is-eq (mod amount 10) 0)
      (stx-transfer? amount tx-sender recipient)
      (err u400)))
```

Clarity menyediakan variabel tambahan untuk membantu kontrak pintar mengautentikasi pengirim transaksi. Kata kunci `contract-caller` mengembalikan prinsipal yang _memanggil_ kontrak saat ini. Jika panggilan antar-kontrak terjadi, `contract-caller` mengembalikan kontrak terakhir di Stacks pemanggil. Misalnya, ada tiga kontrak A, B, dan C, masing-masing dengan fungsi `invoke` sedemikian rupa sehingga `A::invoke` memanggil `B::invoke` dan `B::invoke` memanggil `C::invoke`.

When a user Bob issues a transaction that calls `A::invoke`, the value of `contract-caller` in each successive invoke function's body would change:

```clarity
in A::invoke,  contract-caller = Bob
in B::invoke,  contract-caller = A
in C::invoke,  contract-caller = B
```

Hal ini memungkinkan kontrak untuk membuat pernyataan dan melakukan pemeriksaan otorisasi tidak hanya menggunakan `tx-sender` (yang dalam contoh ini, akan selalu menjadi "Bob"), tetapi juga menggunakan `contract-caller`. Ini dapat digunakan untuk memastikan bahwa fungsi tertentu hanya dipanggil secara langsung dan tidak pernah dipanggil melalui panggilan antar-kontrak (dengan menyatakan bahwa `tx-sender` dan `contract-caller` adalah sama). Kami memberikan contoh dua jenis pemeriksaan otorisasi yang berbeda dalam contoh kapal roket di bawah ini.

## Kontrak pintar sebagai prinsipal

Smart contracts themselves are principals and are represented by the smart contract's identifier -- which is the publishing address of the contract _and_ the contract's name, for example:

```clarity
'SZ2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQ9H6DPR.contract-name
```

Untuk kenyamanan, kontrak pintar dapat menulis pengidentifikasi kontrak dalam bentuk `.contract-name`. Ini akan diperluas oleh juru bahasa Clarity menjadi pengidentifikasi kontrak yang sepenuhnya memenuhi syarat yang sesuai dengan alamat penerbitan yang sama dengan kontrak tempat kontrak tersebut muncul. Misalnya, jika alamat penerbit yang sama, `SZ2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQ9H6DPR`, menerbitkan dua kontrak, `contract-A` dan `contract-B`, pengidentifikasi yang sepenuhnya memenuhi syarat untuk kontrak akan menjadi:

```clarity
'SZ2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQ9H6DPR.contract-A
'SZ2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQ9H6DPR.contract-B
```

But, in the contract source code, if the developer wishes to call a function from `contract-A` in `contract-B`, they can write

```clarity
(contract-call? .contract-A public-function-foo)
```

This allows the smart contract developer to modularize their applications across multiple smart contracts _without_ knowing the publishing key a priori.

Agar kontrak cerdas dapat beroperasi pada aset yang dimilikinya, kontrak cerdas dapat menggunakan fungsi khusus `(as-contract ...)`. Fungsi ini menjalankan ekspresi (diteruskan sebagai argumen) dengan `tx-sender` disetel ke prinsipal kontrak, bukan pengirim saat ini. Fungsi `as-contract` yaitu mengembalikan nilai ekspresi yang diberikan.

For example, a smart contract that implements something like a "token faucet" could be implemented as so:

```clarity
(define-map claimed-before
  ((sender principal))
  ((claimed bool)))

(define-constant err-already-claimed u1)
(define-constant err-faucet-empty u2)
(define-constant stx-amount u1)

(define-public (claim-from-faucet)
    (let ((requester tx-sender)) ;; set a local variable requester = tx-sender
        (asserts! (is-none (map-get? claimed-before {sender: requester})) (err err-already-claimed))
        (unwrap! (as-contract (stx-transfer? stx-amount tx-sender requester)) (err err-faucet-empty))
        (map-set claimed-before {sender: requester} {claimed: true})
        (ok stx-amount)))
```

Dalam contoh ini, fungsi publik `claim-from-faucet`:

- Memeriksa apakah pengirim telah mengklaim dari faucet sebelumnya.
- Menetapkan tx sender ke variabel `requester`.
- Menambahkan entri ke peta pelacakan.
- Menggunakan `as-contract` untuk mengirim 1 mikrostack

Tidak seperti prinsipal lainnya, tidak ada kunci privat yang terkait dengan kontrak pintar. Karena tidak memiliki kunci privat, kontrak pintar Clarity tidak dapat menyiarkan transaksi yang ditandatangani di blockchain.

## Contoh: Pemeriksaan otorisasi

Interaksi antara `tx-sender`, `contract-caller` dan `as-contract` tidak begitu terlihat, tetapi penting saat melakukan pemeriksaan otorisasi dalam sebuah kontrak. Dalam contoh kontrak ini, kami akan menunjukkan dua jenis pemeriksaan otorisasi yang berbeda yang mungkin akan dilakukan oleh suatu kontrak, dan kemudian membahas bagaimana cara yang berbeda dalam memanggil fungsi kontrak akan berhasil atau gagal dalam pemeriksaan tersebut.

Kontrak ini mendefinisikan sebuah "kapal roket" token-yang tidak-sepadan di mana prinsipal dapat memiliki dan mengelola pilot resmi. Pilot adalah prinsipal yang diizinkan untuk "menerbangkan" kapal roket.

Kontrak ini melakukan dua pemeriksaan otorisasi yang berbeda:

1. Sebelum kapal diizinkan untuk terbang, kontrak akan memeriksa apakah transaksi dibuat dan ditandatangani oleh pilot yang berwenang atau tidak. Seorang pilot dapat, misalnya, memanggil kontrak lain, yang kemudian memanggil fungsi publik `fly-ship` atas nama pilot.
2. Sebelum memodifikasi pilot yang diizinkan untuk kapal roket tertentu, kontrak tersebut memeriksa bahwa transaksi tersebut ditandatangani oleh pemilik kapal roket. Selanjutnya, kontrak mensyaratkan bahwa fungsi ini dipanggil _langsung_ oleh pemilik kapal, bukan melalui panggilan antar-kontrak.

The second type of check is more restrictive than the first check, and is helpful for guarding very sensitive routines --- it protects users from unknowingly calling a function on a malicious contract that subsequently tries to call sensitive functions on another contract.

```clarity
;;
;; rockets-base.clar
;;

(define-non-fungible-token rocket-ship uint)

;; a map from rocket ships to their allowed
;;  pilots
(define-map allowed-pilots
    ((rocket-ship uint)) ((pilots (list 10 principal))))

;; implementing a contains function via fold
(define-private (contains-check
                  (y principal)
                  (to-check { p: principal, result: bool }))
   (if (get result to-check)
        to-check
        { p: (get p to-check),
          result: (is-eq (get p to-check) y) }))

(define-private (contains (x principal) (find-in (list 10 principal)))
   (get result (fold contains-check find-in
    { p: x, result: false })))

(define-read-only (is-my-ship (ship uint))
  (is-eq (some tx-sender) (nft-get-owner? rocket-ship ship)))

;; this function will print a message
;;  (and emit an event) if the tx-sender was
;;  an authorized flyer.
;;
;;  here we use tx-sender, because we want
;;   to allow the user to let other contracts
;;   fly the ship on behalf of users

(define-public (fly-ship (ship uint))
  (let ((pilots (default-to
                   (list)
                   (get pilots (map-get? allowed-pilots { rocket-ship: ship })))))
    (if (contains tx-sender pilots)
        (begin (print "Flew the rocket-ship!")
               (ok true))
        (begin (print "Tried to fly without permission!")
               (ok false)))))
;;
;; Authorize a new pilot.
;;
;;  here we want to ensure that this function
;;   was called _directly_ by the user by
;;   checking that tx-sender and contract-caller are equal.
;;  if any other contract is in the call stack, contract-caller
;;   would be updated to a different principal.
;;
(define-public (authorize-pilot (ship uint) (pilot principal))
 (begin
   ;; sender must equal caller: an intermediate contract is
   ;;  not issuing this call.
   (asserts! (is-eq tx-sender contract-caller) (err u1))
   ;; sender must own the rocket ship
   (asserts! (is-eq (some tx-sender)
                  (nft-get-owner? rocket-ship ship)) (err u2))
   (let ((prev-pilots (default-to
                         (list)
                         (get pilots (map-get? allowed-pilots { rocket-ship: ship })))))
    ;; don't add a pilot already in the list
    (asserts! (not (contains pilot prev-pilots)) (err u3))
    ;; append to the list, and check that it is less than
    ;;  the allowed maximum
    (match (as-max-len? (append prev-pilots pilot) u10)
           next-pilots
             (ok (map-set allowed-pilots {rocket-ship: ship} {pilots: next-pilots}))
           ;; too many pilots already
           (err u4)))))
```

### Memperluas fungsionalitas: Kontrak multi-flyer

Skema otorisasi untuk `fly-ship` memungkinkan pilot untuk menerbangkan roket dari kontrak lain. Ini memungkinkan kontrak lain untuk menyediakan fungsionalitas baru yang dibangun di sekitar pemanggilan fungsi tersebut.

For example, we can create a contract that calls `fly-ship` for multiple rocket-ships in a single transaction:

```clarity
;;
;; rockets-multi.clar
;;

(define-private (call-fly (ship uint))
  (unwrap! (contract-call? .rockets-base fly-ship ship) false))
;; try to fly all the ships, returning a list of whether
;;  or not we were able to fly the supplied ships
(define-public (fly-all (ships (list 10 uint)))
  (ok (map call-fly ships)))
```

### Otorisasi untuk Aset Milik Kontrak

Pemeriksaan `authorize-pilot` melindungi pengguna dari kontrak berbahaya, tetapi bagaimana skema tersebut mendukung aset yang dimiliki kontrak? Inilah gunanya fungsi dari `as-contract`. Fungsi `as-contract` menjalankan penutupan yang diberikan seolah-olah pengirim transaksi adalah kontrak saat ini, bukan pengguna -- fungsi ini dilakukan dengan memperbarui `tx sender` ke prinsip kontrak saat ini. Kita dapat menggunakan ini untuk, misalnya, membuat kontrak kapal roket pintar:

```clarity
;;
;; rockets-ship-line.clar
;;

(define-constant line-ceo 'SP19Y6GRV9X778VFS1V8WT2H502WFK33XZXADJWZ)

(define-data-var employed-pilots (list 10 principal) (list))

;; This function will:
;;  * check that it is called by the line-ceo
;;  * check that the rocket is owned by the contract
;;  * authorize each employed pilot to the ship
(define-public (add-managed-rocket (ship uint))
 (begin
  ;; only the ceo may call this function
  (asserts! (is-eq tx-sender contract-caller line-ceo) (err u1))
  ;; start executing as the contract
   (as-contract (begin
    ;; make sure the contract owns the ship
    (asserts! (contract-call? .rockets-base is-my-ship ship) (err u2))
    ;; register all of our pilots on the ship
    (add-pilots-to ship)))))

;; add all the pilots to a ship using fold --
;;  the fold checks the return type of previous calls,
;;  skipping subsequent contract-calls if one fails.
(define-private (add-pilot-via-fold (pilot principal) (prior-result (response uint uint)))
  (let ((ship (try! prior-result)))
    (try! (contract-call? .rockets-base authorize-pilot ship pilot))
    (ok ship)))
(define-private (add-pilots-to (ship uint))
  (fold add-pilot-via-fold (var-get employed-pilots) (ok ship)))
```

Agar kontrak dapat menambahkan setiap pilot ke kapal baru, kontrak harus memanggil `otorisasi-pilot`. Namun, kontrak ingin melakukan tindakan ini atas nama kapal yang _kontrak_ miliki, bukan pengirim transaksi. Untuk melakukan ini, kontrak menggunakan `as-contract`.
