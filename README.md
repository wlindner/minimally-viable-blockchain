### Minimally Viable Blockchain (MVB)

[![Build Status](https://travis-ci.com/wlindner/minimally-viable-blockchain.svg?branch=master)](https://travis-ci.com/wlindner/minimally-viable-blockchain) [![Coverage Status](https://coveralls.io/repos/github/wlindner/minimally-viable-blockchain/badge.svg?branch=master)](https://coveralls.io/github/wlindner/minimally-viable-blockchain?branch=master)

Learning blockchain by making one. This blockchain is designed to work in your browser, but use a meeting server to find other peers to communicate with. Once you know about peers, your client can send and receive blocks in a secure, decentralized way.

#### Getting Started

To get started you'll need to install [Elixir](https://elixir-lang.org/install.html) and [Node](https://nodejs.org/en/download/package-manager/).

Once you've installed all the dependencies you can start the app.

```
mix phx.server
```

Navigate to http://localhost:4000/ in your favorite browser.

To start your Phoenix server:

- Install dependencies with `mix deps.get`
- Install Node.js dependencies with `cd assets && npm install`
- Start Phoenix endpoint with `mix phx.server`
