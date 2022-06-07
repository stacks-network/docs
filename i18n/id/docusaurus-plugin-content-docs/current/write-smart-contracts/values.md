---
title: Nilai Clarity
description: Pelajari cara menangani Nilai Clarity dalam JavaScript
sidebar_position: 2
---

## Pengantar

The Clarity language makes use of a strong static type system. Ini berarti bahwa setiap fungsi yang didefinisikan dalam Clarity mengharapkan argumen dari tipe tertentu, dan bahwa kegagalan untuk memberikan argumen yang diketik dengan benar akan mengakibatkan kode Anda gagal dikompilasi, atau transaksi panggilan kontrak Anda gagal sebelum dijalankan.

Untuk membangun aplikasi web yang berinteraksi dengan kontrak Clarity, Anda perlu mempelajari cara membuat dan menggunakan objek `ClarityValue`. Pustaka [@stacks/transactions](https://github.com/hirosystems/stacks.js/tree/master/packages/transactions) mempermudah semua, seperti yang akan kami tunjukkan di bawah ini.

## Tipe Clarity

Please see the following page for information on [Clarity Types](../write-smart-contracts/clarity-language/language-types).

## Membangun Nilai Clarity dan mengakses datanya

Nilai Clarity dapat dibuat dengan fungsi yang disediakan oleh pustaka [@stacks/transactions](https://github.com/hirosystems/stacks.js/tree/master/packages/transactions). Fungsi-fungsi ini hanya menampilkan objek javascript yang berisi nilai dan representasi numerik dari informasi jenis Clarity. Jenis Clarity dikodekan sebagai berikut:

```typescript
export enum ClarityType {
  Int = 0,
  UInt = 1,
  Buffer = 2,
  BoolTrue = 3,
  BoolFalse = 4,
  PrincipalStandard = 5,
  PrincipalContract = 6,
  ResponseOk = 7,
  ResponseErr = 8,
  OptionalNone = 9,
  OptionalSome = 10,
  List = 11,
  Tuple = 12,
  StringASCII = 13,
  StringUTF8 = 14,
}
```

Objek `ClarityValue` dapat diserialkan dan disertakan dalam transaksi yang berinteraksi dengan kontrak Clarity yang dipublikasikan.

Berikut adalah contoh cara membangun setiap jenis nilai Clarity, dan cara mengakses datanya jika ada:

### Boolean

```typescript
const t = trueCV();
// { type: ClarityType.BoolTrue }

const f = falseCV();
// { type: ClarityType.BoolFalse }
```

Nilai Clarity Boolean tidak berisi data yang mendasarinya. Mereka hanyalah objek dengan informasi `type`.

### Nilai Opsi

```typescript
const nothing: NoneCV = noneCV();
// { type: ClarityType.OptionalNone }

const something: SomeCV = someCV(trueCV());
// { type: ClarityType.OptionalSome, value: { type: 4 } }
```

Nilai Clarity Opsional dapat berupa (tipe kosong yang tidak memiliki data), atau sesuatu (nilai yang dikemas).

Jika Anda berurusan dengan fungsi atau fungsi kontrak yang mengembalikan `OptionalCV`, Anda harus selalu memeriksa jenisnya sebelum mencoba mengakses nilainya.

```typescript
const maybeVal: OptionalCV = await callReadOnlyFunction(...);

if (maybeVal.type === ClarityType.OptionalSome) {
  console.log(maybeVal.value);
} else if (maybeVal.type === ClarityType.OptionalNone) {
  // deal with `none` value
}
```

### Buffer

```typescript
const buffer = Buffer.from('foo');
const bufCV: BufferCV = bufferCV(buffer);
// { type: ClarityType.Buffer, buffer: <Buffer 66 6f 6f> }
```

### Bilangan bulat

Clarity mendukung bilangan bulat dan bilangan bulat yang tidak ditandatangani.

```typescript
const i: IntCV = intCV(-10);
// { type: ClarityType.Int, value: BN { ... } }

const u: UIntCV = uintCV(10);
// { type: ClarityType.UInt, value: BN { ... } }
```

Int nilai Clarity menyimpan data dasarnya sebagai nilai `BigNum` dari pustaka [bn.js](https://github.com/indutny/bn.js/).

Untuk menampilkan/mencetak nilai Clarity (u)int, gunakan metode `cvToString(val)`.

Jika Anda ingin melakukan operasi aritmatika menggunakan nilai Clarity (u)int, Anda harus menggunakan metode dari api `BigNum` pada nilai `BigNum` yang mendasarinya, dan membangun nilai Clarity baru keluar dari hasil. Misalnya:

```typescript
const x = intCV(1);
const y = intCV(2);

x.value.add(y.value);
// 3
```

### String

```typescript
const ascii: StringAsciiCV = stringAsciiCV('hello world');
// { type: ClarityType.StringASCII, data: 'hello world' }

const utf8: StringUtf8CV = stringUtf8CV('hello 🌾');
// { type: ClarityType.StringUTF8, data: 'hello 🌾' }
```

Clarity mendukung string ascii dan utf8.

### Prinsipal

```typescript
const address = 'SP2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02B';
const contractName = 'contract-name';

const spCV = standardPrincipalCV(address);
// {
//   type: ClarityType.PrincipalStandard
//   address: {
//       type: StacksMessageType.Address,
//       version: AddressVersion.MainnetSingleSig,
//       hash160: "SP2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02B"
//   }
// }

const cpCV = contractPrincipalCV(address, contractName);
// {
//   type: ClarityType.PrincipalContract,
//   contractName: {
//     type: StacksMessageType.LengthPrefixedString,
//     content: 'contract-name',
//     lengthPrefixBytes: 1,
//     maxLengthBytes: 128,
//   },
//   address: {
//     type: StacksMessageType.Address,
//     version: AddressVersion.MainnetSingleSig,
//     hash160: "SP2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02B"
//   }
// }
```

Kedua jenis nilai prinsipal Clarity berisi informasi `type` dan objek `address`. Prinsipal kontrak juga berisi `contractName`.

### Nilai Respons

```typescript
const errCV = responseErrorCV(trueCV());
// { type: ResponseErr, value: { type: ClarityType.BoolTrue } }

const okCV = responseOkCV(falseCV());
// { type: ResponseOk, value: { type: ClarityType.BoolFalse } }
```

Nilai Clarity Respons akan memiliki jenis `ClarityType.ResponseOk` atau `ClarityType.ResponseErr`. Keduanya mengandung Nilai Clarity. Seringkali nilai ini akan menjadi kode kesalahan bilangan bulat jika responsnya adalah `Error`.

### Tuple

```typescript
const tupCV = tupleCV({
  a: intCV(1),
  b: trueCV(),
  c: falseCV(),
});
// {
//   type: ClarityType.Tuple,
//   data: {
//     a: { type: ClarityType.Int, value: BN { ... } },
//     b: { type: ClarityType.BoolTrue },
//     c: { type: ClarityType.BoolFalse },
//   }
// }

console.log(tupCV.data['b']);
// { type: ClarityType.BoolTrue }
```

Tuple di Clarity diketik dan berisi bidang yang memiliki nama. Tuple di atas, misalnya, berisi tiga bidang dengan nama **a**, **b** dan **c**, dan jenis nilainya masing-masing adalah `Int`, `Boolean` dan `Boolean`.

Tuple Clarity direpresentasikan dalam JavaScript sebagai objek dan data tuple dapat diakses oleh bidang `data`, tempat objek JS yang mendasarinya disimpan.

### Daftar

```typescript
const l = listCV([trueCV(), falseCV()]);
// { type: ClarityType.List, list: [{ type: ClarityType.BoolTrue }] }

console.log(l.list[0]);
// { type: ClarityType.BoolTrue }
```

Daftar, dalam Clarity, bersifat homogen, artinya daftar tersebut hanya dapat berisi elemen bertipe tunggal (Clarity). Pastikan untuk menghindari membuat daftar yang memiliki elemen dari beberapa jenis.

Data yang mendasari daftar Clarity dapat diakses melalui bidang `list`.

## Menggunakan Nilai Clarity

Sekarang setelah Anda mengetahui cara membuat _dan_ mendekonstruksi nilai Clarity, Anda dapat menggunakannya untuk membuat transaksi `contract-call` yang memanggil fungsi kontrak pintar, dan Anda dapat memanfaatkan respons dari mereka.

This is covered in depth [here](../understand-stacks/transactions#construction).

## Memanfaatkan Nilai Clarity dari Respons Transaksi

`Read-only` Fungsi Clarity dapat mengembalikan nilai Clarity sebagai respons. Fungsi `read-only` ini dapat diakses dengan mudah di JavaScript melalui [`callReadOnlyFunction()`](https://github.com/hirosystems/stacks.js/tree/master/packages/transactions#calling-read -only-contract-function) fungsi yang disertakan dalam `@stacks/transactions`, yang mengembalikan `ClarityValue`.

Seperti disebutkan di atas, `ClarityValues` hanyalah objek javascript yang berisi nilai dan informasi jenis Clarity yang terkait. Jenis objek ini ditentukan [di sini](https://github.com/hirosystems/stacks.js/tree/1f2b5fd8bdf1c2b5866e8171163594d7708a8c7a/packages/transactions/src/clarity/types).

Ketika Anda memanggil fungsi kontrak `read-only`, Anda akan selalu tahu jenis fungsi yang akan dikembalikan, karena fungsi di Clarity diketik dengan kuat.

Fungsi Clarity biasanya mengembalikan nilai yang dikemas dengan `Response`, untuk menunjukkan apakah berhasil atau ada kesalahan.

Karena setiap `ClarityValue` memiliki bidang `type`, jenis hasil dari panggilan fungsi `read-only` dapat diperiksa dan ditindaklanjuti seperti di bawah ini:

```typescript
const contractAddress = 'ST3KC0MTNW34S1ZXD36JYKFD3JJMWA01M55DSJ4JE';
const contractName = 'kv-store';
const functionName = 'get-value';
const buffer = bufferCVFromString('foo');
const network = new StacksTestnet(); // for mainnet, use `StacksMainnet()`
const senderAddress = 'ST2F4BK4GZH6YFBNHYDDGN4T1RKBA7DA1BJZPJEJJ';

const options = {
  contractAddress,
  contractName,
  functionName,
  functionArgs: [buffer],
  network,
  senderAddress,
};

// make a read-only call to a contract function that
// returns a Response
const result: ResponseCV = await callReadOnlyFunction(options);

if (result.type === ClarityType.ResponseOk) {
  console.log(cvToString(result.value));
} else if (result.type === ClarityType.ResponseErr) {
  throw new Error(`kv-store contract error: ${result.value.data}`);
}
```

### Nilai Clarity ke/dari Hex

Jika Anda menerima respons dari transaksi dalam bentuk string `hex`, Anda dapat melakukan deserialize menjadi nilai Clarity seperti berikut:

```javascript
import { hexToCV } from '@stacks/transactions';

let cv = hexToCV('hex_string');
```

Demikian pula, Anda dapat mengkonversi nilai Clarity menjadi string `hex` seperti:

```javascript
import { cvToHex, trueCV } from '@stacks/transactions';

let trueHex = cvToHex(trueCV());
```

## Mendebug Nilai Clarity

Terkadang Anda mungkin menerima nilai Clarity yang tidak Anda harapkan. Mencatat nilai ke konsol Anda tidak akan selalu terbukti bermanfaat, kecuali Anda telah mengingat nilai enum tipe nilai Clarity.

Untuk mengetahui jenis nilai yang Anda hadapi, Anda dapat menggunakan fungsi `cvToString()` untuk mengonversi nilai Clarity menjadi string yang lebih mudah dibaca.

Misalnya, memanggil `cvToString()` pada `tuple` besar kemungkinan akan menghasilkan sesuatu seperti:

```
(tuple
  (a -1)
  (b u1)
  (c 0x74657374)
  (d true)
  (e (some true))
  (f none)
  (g SP2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02B)
  (h SP2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02B.test)
  (i (ok true))
  (j (err false))
  (k (list true false))
  (l (tuple (a true) (b false)))
  (m "hello world")
  (n u"hello \u{1234}"))`
```
