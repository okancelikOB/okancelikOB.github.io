# okancelikOB.github.io

Persoonlijke cv-site met blog. Puur statisch: HTML, CSS en een beetje vanilla JS, zonder build-stap.

```
index.html                 cv / homepage (bento-dashboard)
style.css                  alle styling (kleuren staan bovenin als CSS-variabelen; accent = --violet)
script.js                  decoratieve grafieken en de klikbare werkervaring-tijdlijn
assets/                    afbeeldingen en favicon
blog/index.html            overzicht van alle posts
blog/posts/                één HTML-bestand per post
blog/posts/post-template.html   template voor nieuwe posts
```

## Eerst invullen

Zoek in alle bestanden op `[JOUW` en vervang:

- `[JOUW E-MAIL]` door je e-mailadres (in `mailto:[JOUW E-MAIL]` blijft `mailto:` staan)
- `[JOUW LINKEDIN-URL]` door je volledige LinkedIn-URL

Deze staan in de header van elke pagina, in de icoonrij van het hero-paneel en in het contactpaneel op `index.html`.

## Een blogpost toevoegen

1. Kopieer `blog/posts/post-template.html` naar bijvoorbeeld `blog/posts/mijn-nieuwe-post.html`.
   Gebruik kleine letters en koppeltekens, geen spaties.
2. Vervang alles waar `AANPASSEN` staat (titel, beschrijving, onderwerp, inleiding, tekst).
3. Verwijder de regel `<meta name="robots" content="noindex">` uit de kopie.
4. Open `blog/index.html` en kopieer een bestaand `<article class="panel span-4 card-link">`-blok.
   Zet het bovenaan de lijst (nieuwste eerst) en pas de link, het onderwerp, de titel en de korte tekst aan.
5. Optioneel: werk het paneel "Laatste blogpost" op `index.html` bij.
6. Afbeeldingen zet je in `assets/`. Vanuit een post verwijs je ernaar met
   `<img src="../../assets/naam.jpg" alt="Wat er op de afbeelding staat">`. Vergeet de alt-tekst niet.

Er staat bewust geen datum bij posts.

## Lokaal bekijken

```bash
python3 -m http.server 8000
```

Open daarna http://localhost:8000.

## GitHub Pages aanzetten

1. Push alles naar de `main`-branch van de repository `okancelikOB/okancelikOB.github.io`.
   De naam van de repo moet precies `<gebruikersnaam>.github.io` zijn.
2. Ga op GitHub naar **Settings → Pages**.
3. Kies bij **Build and deployment** onder **Source** voor **Deploy from a branch**.
4. Kies de branch `main` en de map `/ (root)`, en klik op **Save**.
5. Na een minuut of twee staat de site op https://okancelikOB.github.io.
   Elke nieuwe push naar `main` wordt automatisch opnieuw gepubliceerd.
