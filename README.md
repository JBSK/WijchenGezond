Wijchen Verenigd applicatie
=====

Setup
=====
Installatie
----------------------------

Kloon de repository met:

```
git clone https://github.com/serealkiller/WijchenGezond.git
```

Na dit commando wordt u gepromped om een wachtwoord in te voeren. Hier kunt u uw eigen wachtwoord invoeren als u toegang heeft tot de repository.
```~/workspaces/WijchenGezond``` Kan veranderd worden naar eigen inzicht.

Ga naar de gekloonde map

```
cd ~/workspaces/WijchenGezond
```

Waar ```~/workspaces/WijchenGezond``` kan verschillen naar wat u heeft ingevoerd als map in het git clone commando

Configuratie
----------
Standaard zal de applicatie draaien op ```poort: 3000```. Als u dit wilt aanpassen navigeer naar naar de 
config map en pas daar het ```app.js``` bestand aan, deze bevindt zich in:

```
Prototype3_WijchenVerenigd/server/config/server.js
```

De applicatie zal standaard zoeken naar een Mongodatabase op ```localhost/WijchenGezond```.


[Node](http://nodejs.org/) modules installeren
----------
Het Wijchen Gezond project wordt geleverd zonder [node](http://nodejs.org/) modules. Voordat u de server wilt starten zult u de [node](http://nodejs.org/) modules 
installeren. Als u [node](http://nodejs.org/) al geinstalleerd is dit erg simpel:

```
sudo npm install //Voer vervolgens het wachtwoord van uw machine in..
```

Als u geen [node](http://nodejs.org/) heeft geinstalleerd zult u deze moeten installeren voordat u deze applicatie kunt gebruiken.

Database initialiseren
----------
Na dat u alle bovenstaande commandos hebt uitgevoerd kunt u de applicatie gebruiken. Voordat u de applicatie gaat gebruiken 
moet u echter een [MongoDB](http://www.mongodb.org/) instantie draaien. Als u [MongoDB](http://www.mongodb.org/) geinstalleerd heeft doet u dit zo:

```
sudo mongod //Voer vervolgens het wachtwoord van uw machine in..
```

Als u geen [MongoDB](http://www.mongodb.org/) heeft zult u deze eerst moeten installeren.

Voordat u iets kunt doem met de applicatie zult u eerst de [MongoDB](http://www.mongodb.org/) database moeten vullen. Als u dit niet doet zal de website er erg leeg uit zien. Dit doet u d.m.v deze commando's:

```
cd Prototype3_WijchenVerenigd/server/dump/WijchenGezond/
mongorestore --db WijchenGezond
```


De applicatie starten
----------


Als u eenmaal een [MongoDB](http://www.mongodb.org/) instantie heeft draaien en een gevulde database hebt kunt u de applicatie starten door dit commando:

```
node app.js
```

U zult nu een bericht te zien krijgen dat de applicatie draait en op welke port deze draait. 
Als u nu naar ```localhost:3000``` navigeerd (of naar een andere poort die u zelf hebt ingesteld) dan zult u op de 
hoofdpagina van de WijchenVerenigd website uitkomen.


Meter applicatie
=====

Setup
=====
Installatie
----------------------------

Kloon de repository met:

```
git clone https://github.com/serealkiller/WijchenGezond.git
```

Na dit commando wordt u gepromped om een wachtwoord in te voeren. Hier kunt u uw eigen wachtwoord invoeren als u toegang heeft tot de repository.
```~/workspaces/WijchenGezond``` Kan veranderd worden naar eigen inzicht.

Ga naar de gekloonde map

```
cd ~/workspaces/WijchenGezond
```

Waar ```~/workspaces/WijchenGezond``` kan verschillen naar wat u heeft ingevoerd als map in het git clone commando

De applicatie starten
----------


Deze applicatie is simpelweg een html/css/JavaScript applicatie. U kunt de applicatie starten door de indexpagina te openen met Chrome, Safari of Firefox:

```
cd ~/workspaces/WijchenGezond/Prototype2_meterProto/client/

index.html //Open dit bestand met Chrome, Safari of Firefox.
```

Zorg ervoor dat JavaScript niet door de browser geblokkeerd wordt. De meter begint na 5 seconden te lopen.s