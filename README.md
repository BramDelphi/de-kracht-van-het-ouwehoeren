# De kracht van het ouwehoeren, companion-website

Meertalige site (NL, EN, DE, FR, ES) bij het boek van Bram van der Boom. Live: https://de-kracht-van-het-ouwehoeren.vercel.app

## Structuur

- `template.html`: de volledige pagina met `{{placeholders}}` voor alle teksten
- `locales/*.json`: alle teksten en quizdata per taal
- `build.js`: genereert `dist/` met een statische pagina per taal (/, /en/, /de/, /fr/, /es/)
- `vercel.json`: buildinstellingen voor Vercel

## Lokaal bouwen

```
node build.js
```

Open daarna `dist/index.html` in een browser.

## Tekst aanpassen

Pas de betreffende taal aan in `locales/`, draai `node build.js` opnieuw en deploy.
Het canonieke domein staat bovenin `build.js` (CANON).

## Nog te doen voor livegang

- E-mailinschrijving vervangen door een echte formulierdienst (nu een mailto-koppeling)
- Domeinen dekrachtvanouwehoeren.nl en .com koppelen in Vercel
