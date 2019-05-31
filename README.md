# poe-tradeapp

An electron application that employs the https://pathofexile.com/trade/search Website to streamline the item price checking process.

## Requirements

winhookjs: https://github.com/0x66656c6978/winhookjs
You need to build this extension yourself with `npm run rebuild` and require it in client/src/Application.js

## Setup

```
git clone https://github.com/0x66656c6978/poe-tradeapp.git
cd poe-tradeapp/client
npm install
```

To run

```
cd client
npm run build
npm run start
```

## Test the prototype

```
cd client
npm run build
npm run test
```
