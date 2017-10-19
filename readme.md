# dbwebb-stream irc

En server som lyssnar på en irc-kanal och vidarebefordrar irc-meddelanden till websocket.

Servern består av en irc-bot, en express-server och en websocket-server. Förutom att vidarebefordra meddelanden på websocket loggar servern också alla meddelanden i en sqlite3-databas. På route `/history/{n}` kan man få `n` senaste meddelanden som json. Servern har även en info-sida på route `/`.

## Installation
1. Klona repot.
2. `cd` in och kör `$ npm install`
3. Eventuell konfiguration i `config.js`

Servern är som standard konfigurerad att lyssna på kanal 'db-o-webb' på server 'irc.bsnet.se'. Servern lyssnar på port som anges i miljövariabeln `PORT` eller 1337 som standard.

## Starta
`$ npm start`

## Stoppa
`$ npm stop`

## TODO
* Bygg ut historiedelen.
* Mer tester.
* Bättre efterlevnad av konfigurationsinställningar i bot-svarsdelen.
* m.m

License
------------------

MIT.

 .
..:  @ 2017 Anders Nygren (litemerafrukt@gmail.com)
```
