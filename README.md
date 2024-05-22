# Projektarbete i kursen Backend-baserad webbutveckling, av Andreas Nygård.

# Applikation för registrering och inlogging.

# Av Andreas Nygård

Detta är en server byggd med Express och SQLite.

## Installation

1. Klona detta repo till din lokala dator.
2. Navigera till mappen där du har klonat repositoriet.
3. Kör "npm install" för att installera alla paket.

## Konfiguration

API'et använder en SQLite-databas. Kör kommandot "npm run serve" för att starta servern.

## Användning

Här beskriver jag hur du når API't. Här används "admin_user" som exempel. Alla andra ändpunkter fungerar likadant.

1.  Metod: GET
    Ändpunkt: "/api/admin_user"
    Beskrivning: Hämtar alla tillgängliga admin-användare

2.  Metod: GET
    Ändpunkt: "/api/admin_user/:id"
    Beskrivning: Hämtar en specifik admin-användare

3.  Metod: POST
    Ändpunkt: "/api/register
    Beskrivning: Lagrar en ny admin

4.  Metod: DELETE
    Ändpunkt: "/api/admin_user/:id
    Beskrivning: Raderar en användare

5.  Metod: PUT
    Ändpunkt: "/api/admin_user/:id
    Beskrivning: Uppdaterar en användare

Ett objekt med följande format kommer returneras:

{
"firstname": "Andreas",
"lastname": "Nygård",
"email": "anny2301@student.miun.se",
"username": "AndreasUser",
"password": "password",
}

Alla objekt kommer även tilldelas ett unikt id, samt en "created" som visar när inlägget är tillagt.
