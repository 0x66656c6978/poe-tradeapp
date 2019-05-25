# poe-tradeapp

An electron application that employs the https://pathofexile.com/trade/search Website to streamline the item price checking process.

## Requirements

winhookjs: https://github.com/0x66656c6978/winhookjs
You need to build this extension yourself with `npm run rebuild` and require it in client/src/Application.js

## Usage

ToDo: write usage guide

## Setup

```
git clone https://github.com/0x66656c6978/poe-tradeapp.git
cd poe-tradeapp
npm install
```

ToDo: verify setup guide

To run

```
npm run start
```

## Disclaimer

I coded this in one of those nights and just about refactored the things i was testing.
It's a working prototype nothing more.

### Test the prototype

Run the app, then copy the description of an item in PoE and press the key combination "CommandOrControl+F". Et voila, the app should now have searched for the item base + item level and optionally the number of fractured mods on the item