# Visibilité & mesure d'audience du portfolio

Site : https://fumikage-darkshadow.github.io/Portfolio-/
GA4 : https://analytics.google.com (propriété `G-4B3WB26VP4`)
Code de suivi : `assets/analytics.js` (chargé par `index.html` et `assets/floww-preview.html`)

## 1. Ce que tu peux voir, et ce que tu ne verras jamais

**Jamais** : le nom, l'email ou l'entreprise d'un visiteur. Aucun outil d'audience ne le fait, et c'est illégal sans consentement.

**Ce que tu vois, par visiteur anonyme** : ville, pays, source (LinkedIn, Google, direct…), appareil, navigateur,
nouveau ou récurrent, et la **chronologie horodatée de tout ce qu'il a fait** : sections lues et temps passé dans chacune,
projets survolés puis ouverts, CV téléchargé, prank, clics contact, temps total de visite.

Où le voir : GA4 → **Explorer** → *Explorateur d'utilisateurs*. Chaque ligne est un visiteur, clic dessus = sa timeline complète.

## 2. Événements envoyés

Tous sont envoyés à GA4 et, si activé, à GoatCounter (sous `event/<nom>/<label>`).

### Parcours et engagement

| Événement | Quand | Paramètres |
|---|---|---|
| `section_view` | première fois qu'une section est au centre de l'écran | `label` (hero, about, experience, projects, certifications, recommandations, contact), `seconds_since_load` |
| `section_time` | le visiteur quitte une section | `label`, `seconds` passées dedans |
| `scroll_depth` | 25 %, 50 %, 75 %, 100 % de la page | `label`, `percent`, `seconds_since_load` |
| `card_hover` | survol ≥ 0,8 s d'un projet, d'une certif, d'une reco ou d'une expérience (1 fois par carte) | `label` (titre), `card_type` (project / certification / recommendation / experience), `hover_ms` |
| `tab_hidden` / `tab_return` | l'onglet passe en arrière-plan / revient | bilan cumulé |
| `page_exit` | le visiteur quitte la page | `total_seconds` (temps onglet visible), `max_scroll_pct`, `sections_seen`, `sections_list`, `clicks`, `events_count` |

### Actions

| Événement | Quand | Paramètres |
|---|---|---|
| `project_open` | clic « Détails » / lien d'un projet | `label` (titre), `link_type` (pdf / external / page), `link_url`, `seconds_since_load` |
| `cv_prank_open` | clic « Télécharger mon CV » | |
| `cv_prank_click` | clic sur un bouton d'une fausse popup | `label` (texte du bouton), `popup` |
| `cv_prank_completed` | les 3 popups fermées | |
| `cv_prank_close` | fermeture de l'écran final | |
| `cv_download` | clic « Télécharger le vrai CV » | `seconds_since_load` |
| `experience_flip` | retournement d'une carte expérience | `label` (poste) |
| `recommendation_open` | ouverture d'une lettre | `label` (fichier) |
| `contact_click` | clic email / LinkedIn / GitHub | `label`, `section` (d'où le clic est parti) |
| `form_start` | premier champ du formulaire touché | |
| `form_error` | envoi avec un champ invalide | `label` (champ) |
| `contact_form_submit` | formulaire envoyé | |
| `text_copy` | copie de texte (l'email par exemple) | `label` (email / text) |
| `nav_click` | lien de navigation interne | `label` (section cible) |
| `menu_open` | menu mobile ouvert | |
| `back_to_top` | bouton retour en haut | |
| `outbound_click` | tout lien externe non couvert | `label` (domaine), `link_url` |

### Propriétés utilisateur

`visitor_type` (new / returning), `visit_count` (1…9, 10+), `first_visit_date`. Utilisables comme filtres et comparaisons dans tous les rapports.

### Tester en direct

Ouvrir `https://fumikage-darkshadow.github.io/Portfolio-/?analytics_debug=1` sans bloqueur de pub, puis GA4 → **Admin → DebugView**.
Chaque événement apparaît en temps réel avec ses paramètres. La console du navigateur (F12) les affiche aussi (`[analytics] …`).

## 3. Configuration GA4 à faire une fois (15 min)

Sans l'étape 1, les rapports montrent « 12 project_open » sans dire lesquels.

1. **Admin → Définitions personnalisées → Créer une dimension personnalisée** (portée *Événement*), une par ligne :
   `label`, `section`, `link_type`, `card_type`, `link_url`, `popup`, `sections_list`.
   Puis **Créer une métrique personnalisée** (portée *Événement*, unité *Standard*) :
   `seconds`, `seconds_since_load`, `hover_ms`, `total_seconds`, `max_scroll_pct`, `sections_seen`, `clicks`, `percent`.
   Et **dimension de portée Utilisateur** : `visitor_type`, `visit_count`, `first_visit_date`.
2. **Admin → Événements** : marquer comme **événement clé** `cv_download`, `contact_click`, `contact_form_submit`, `project_open`.
   (Les événements n'apparaissent dans la liste qu'après avoir été reçus une fois : faire un test en navigation privée d'abord.)
3. **Admin → Paramètres des données → Conservation des données** : **14 mois**.
4. **Admin → Flux de données → ta propriété web → Mesure améliorée** : tout cocher.
5. **Admin → Liens avec les produits → Search Console** : lier (voir §5).
6. **Explorer** : créer trois explorations et les enregistrer :
   - *Entonnoir* : `section_view` (label=projects) → `project_open` → `cv_download` → `contact_click`.
   - *Explorateur d'utilisateurs* : la timeline par visiteur.
   - *Format libre* : lignes = `label`, valeurs = nombre d'événements, filtre `event_name = project_open`. Donne le classement des projets les plus ouverts. Dupliquer avec `card_hover` pour ceux qui attirent l'œil sans être ouverts.

## 4. GoatCounter (recommandé en complément)

Le public cyber bloque Google Analytics (uBlock, Brave, Pi-hole…). Sur ce type d'audience, GA4 rate facilement 40 à 70 % des visites.
GoatCounter est open source, gratuit pour un usage perso, sans cookies, sans bannière, et beaucoup moins présent dans les listes de blocage.

1. Créer un compte : https://www.goatcounter.com/signup (choisir un code de site, ex. `ilyes-sadadou`).
2. Dans `assets/analytics.js`, renseigner `goatcounter: 'ilyes-sadadou'`.
3. Commit + push. Tableau de bord : `https://ilyes-sadadou.goatcounter.com`. Les événements y sont sous `event/…`.

Comparer GA4 et GoatCounter sur une semaine donne le taux de visiteurs qui bloquent Google.

## 5. Search Console et Bing : la visibilité *avant* la visite

Seul outil qui montre les requêtes Google tapées, le nombre d'impressions et la position.

1. https://search.google.com/search-console → *Ajouter une propriété* → **Préfixe d'URL** → `https://fumikage-darkshadow.github.io/Portfolio-/`.
2. Validation par **balise HTML** : coller la ligne `<meta name="google-site-verification" content="…">` dans le `<head>` de `index.html` sous `canonical`. Commit, push, attendre le déploiement, *Valider*.
3. *Sitemaps* → envoyer `sitemap.xml`. *Inspection d'URL* → *Demander l'indexation*.
4. https://www.bing.com/webmasters : import en un clic depuis Search Console.

## 6. Savoir d'où viennent les visiteurs : liens UTM

LinkedIn et la plupart des applis mobiles masquent le référent : ces visites tombent en « direct ». Utiliser ces URL selon l'endroit où tu publies le lien :

| Où | URL à utiliser |
|---|---|
| Profil LinkedIn (coordonnées, Sélection) | `https://fumikage-darkshadow.github.io/Portfolio-/?utm_source=linkedin&utm_medium=profile` |
| Post LinkedIn | `https://fumikage-darkshadow.github.io/Portfolio-/?utm_source=linkedin&utm_medium=post` |
| CV PDF, signature mail | `https://fumikage-darkshadow.github.io/Portfolio-/?utm_source=cv&utm_medium=pdf` |
| Candidature / mail à un recruteur | `https://fumikage-darkshadow.github.io/Portfolio-/?utm_source=email&utm_medium=candidature&utm_campaign=NOM-ENTREPRISE` |
| Profil GitHub | `https://fumikage-darkshadow.github.io/Portfolio-/?utm_source=github&utm_medium=profile` |

Avec `utm_campaign=NOM-ENTREPRISE` dans chaque candidature, GA4 (Acquisition → Acquisition de trafic, dimension *Campagne*) dit quelle entreprise a ouvert le portfolio, ce qui est le plus proche du « qui » possible légalement.

## 7. SEO en place

- `<title>` et `meta description` avec les mots-clés cibles ; `canonical`, `robots`, `theme-color`, `author`.
- Open Graph + Twitter Card avec `assets/og-image.png` (1200×630) : carte riche sur LinkedIn, Discord, WhatsApp, Slack.
- JSON-LD `Person` + `WebSite` reliant le site, LinkedIn et GitHub.
- `robots.txt`, `sitemap.xml`. La page de démo Floww est en `noindex` (page technique).

Vérifier : https://www.linkedin.com/post-inspector/ · https://validator.schema.org/ · https://search.google.com/test/rich-results

## 8. Autres leviers de visibilité

1. **LinkedIn** : URL (avec UTM) dans *Coordonnées* et dans *Sélection*. Première source de trafic d'un portfolio, de loin.
2. **Dépôt GitHub** : *About* + topics, dépôt épinglé :
   ```bash
   gh repo edit Fumikage-DarkShadow/Portfolio- --homepage "https://fumikage-darkshadow.github.io/Portfolio-/" --description "Portfolio cybersécurité — Ingénieur Sécurité Endpoint, futur RSSI" --add-topic portfolio --add-topic cybersecurity --add-topic pentest --add-topic edr
   ```
3. **URL propre** : renommer le dépôt en `fumikage-darkshadow.github.io` (site à la racine) ou brancher un domaine (`ilyes-sadadou.fr`, ~10 €/an).
   Dans les deux cas mettre à jour `canonical`, `og:url`, JSON-LD, `robots.txt`, `sitemap.xml` et les liens UTM.
4. **Contenu** : une page HTML par projet (500 mots) pèse plus dans Google que dix PDF.

## 9. Formulaire de contact

Le site est statique : le formulaire ouvre la messagerie du visiteur avec un email prérempli vers ilyesadadoupro@gmail.com.
Pour un envoi sans ouvrir la messagerie : https://formspree.io (gratuit, 50 messages/mois), puis remplacer
`window.location.href = mailto;` dans `index.html` par un `fetch('https://formspree.io/f/XXXX', { method: 'POST', body: new FormData(contactForm), headers: { Accept: 'application/json' } })`.

## 10. Limites à connaître

- **Bloqueurs de pub** : GA4 ne verra jamais une partie du public cyber. GoatCounter compense en partie.
- **Consentement** : en France, GA4 sans bannière n'est pas conforme CNIL. Risque nul pour un site perso, mais un recruteur RSSI pointilleux peut le remarquer. GoatCounter seul n'a pas ce problème.
- **PDF** : on sait qu'un PDF est ouvert, pas combien de temps il est lu.
