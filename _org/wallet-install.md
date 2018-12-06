---
layout: org
permalink: /:collection/:path.html
---
# Install the Stacks Wallet software
{:.no_toc}

You use the Stacks Wallet software client alone or with a hardware wallet to
manage your Stacks tokens. On this page, you learn how to install the Stacks
Software wallet. This page contains the following:

* TOC
{:toc}

If you have already installed the latest Stacks wallet, see [Use the Stacks
Wallet software](wallet-use.html) in this documentation instead.


##  Before you start

If Trezor, install Trezor bridge https://wallet.trezor.io/data/bridge/latest/index.html


## Windows Installation


## Download and check the download

1. Select the download button this page.
2. Download the software which is packaged in a Zip file.

## Verify the download was secure

During you wallet download, you are at risk of a man-in-the-middle attack (as an
example) from hackers interested in stealing your tokens or your other
information.  To protect yourself from this type of attack, you should verify
your downloaded wallet software before you install it. Verification confirms
that you received the software signed by Blockstack PBC.

1. Open command prompt.

   You can find it by typing command into the Start menu

2. Change to the directory your wallet downloaded to by running cd <directory>

    By default that’s <You-User-Directory>/Downloads , so you can run cd Downloads

3. Run the Windows checksum utility by running:

    certUtil -hashfile windows-stacks-wallet.exe SHA512

4. Verify that the resulting hash is the same as the latest hash published on on https://blockstack.org/wallet



## Mac OSX Installation


## Download and check the download

1. Select the download button this page.
2. Download the software which is packaged in a Zip file.
3. Unzip the zip file. ?Is it a zip

## Verify and then start the wallet

During you wallet download, you are at risk of a man-in-the-middle attack (as an
example) from hackers interested in stealing your tokens or your other
information.  To protect yourself from this type of attack, you should verify
your downloaded wallet software before you install it. Verification confirms
that you received the software signed by Blockstack PBC.

1. From your Mac desktop, click on the magnifying glass in the top, right corner of your screen.

   ![Spotlight search launch](images/search-start.png)

   The Spotlight search bar appears.

2. Enter terminal in the search field.

   ![Terminal](images/search-terminal.png)

3. Select the **Terminal.app** to launch it.
4. Change to the directory in Terminal to the directory your wallet downloaded to

    The default directory is usually `/Downloads` so type cd ~/Downloads and press return

5. Run the checksum utility shasum by typing the following command and pressing return:

    `shasum -a 512 macos-stacks-wallet.dmg`

6. Verify that the resulting hash is the same as the latest hash published on on https://blockstack.org/wallet

7. Run the dmg



## Before you start

You link your wallet with a Coinlist or other account with access to Bitcoin. Before you begin, make sure that
you have [an account with CoinList](https://coinlist.co/register). You must
create this account yourself. You use this account to load very small fractions
of Bitcoin to fuel your wallet transactions.
