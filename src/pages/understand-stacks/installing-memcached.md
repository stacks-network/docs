---
title: Installing Memcached
description: Learn how to install Memcached to improve performance of a local Stacks API instance.
---

The Stacks API optionally uses memcached and pylibmc for scaling read-only
calls. If you want to enable this functionality then you should have memcached
running locally.

### Memcached on Debian & Ubuntu:

```bash
$ sudo apt-get install -y python-dev libmemcached-dev zlib1g-dev
$ pip install pylibmc
```

### Memcached on macOS:

Easiest way to install memcached on macOS is by using [Homebrew](https://brew.sh/).

After installing Homebrew:

```bash
$ brew install memcached
$ brew install libmemcached
$ pip install pylibmc --install-option="--with-libmemcached=/usr/local/Cellar/libmemcached/1.0.18_1/"
```

After installing, you can start memcached and check if it's running properly:

```bash
$ memcached -d
$ echo stats | nc localhost 11211
```

### Memcached on Heroku

To deploy on Heroku:

```bash
$ heroku create
$ heroku addons:add memcachedcloud
$ git push heroku master
```
