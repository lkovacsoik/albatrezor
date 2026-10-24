# Alba-Trezor Kft. – új statikus weboldal

Sima HTML + CSS + JS, nincs szükség CMS-re, adatbázisra vagy PHP-ra.

## Feltöltés
1. A mappa teljes tartalmát töltse fel a tárhely gyökérkönyvtárába (FTP).
2. A régi oldal `docs/` mappáját (letölthető jogszabályok, cikkek PDF-jei) és az `images/ginop.pdf` fájlt hagyja a tárhelyen (vagy másolja mellé), mert az új oldal ugyanazokon az útvonalakon hivatkozik rájuk.
3. A fájlnevek megegyeznek a régi oldaléval, így a meglévő linkek és a Google-találatok tovább működnek.
4. A régi `kapcsolat.php` címet érdemes átirányítani a `kapcsolat.html`-re (Apache: `.htaccess`, lásd lent).

```
Redirect 301 /kapcsolat.php /kapcsolat.html
ErrorDocument 404 /404.html
```

## Szerkesztés
- Szövegek: közvetlenül a `.html` fájlokban.
- Színek, betűk: `assets/css/style.css` eleje (`:root` változók).
- Animációk: a `reveal` osztályú elemek görgetéskor úsznak be (`assets/js/main.js`).

## Kapcsolati űrlap
Statikus oldalon nincs szerveroldali levélküldés: az űrlap a látogató levelezőprogramját nyitja meg kitöltött levéllel (info@albatrezor.hu). Ha valódi elküldés kell, egy űrlapszolgáltatás (pl. Formspree) `action` címe beköthető.
