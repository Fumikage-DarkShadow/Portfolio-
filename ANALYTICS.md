# Visibilité & mesure d'audience du portfolio

Site : https://fumikage-darkshadow.github.io/Portfolio-/

## 1. Pourquoi Google Analytics « ne convainc pas »

Trois raisons, dans l'ordre :

1. **Le public est cyber.** uBlock Origin, Brave, Firefox en mode strict, DNS filtrants (Pi-hole, NextDNS)…
   bloquent `googletagmanager.com`. Sur un public de profils sécu, on perd facilement **40 à 70 % des visites** :
   GA4 ne les voit jamais. Ce n'est pas un mauvais réglage, c'est structurel.
2. **Latence.** Les rapports standards GA4 mettent **24 à 48 h** à se remplir. Seul *Rapports → Temps réel* est immédiat.
3. **Interface.** GA4 est pensé pour l'e-commerce. Sans événements personnalisés, on ne voit que « page vue », ce qui est inutile pour un portfolio.

Ce qui est en place maintenant répond aux points 2 et 3, et propose une solution au point 1.

## 2. Ce qui est en place dans `index.html`

### GA4 (`G-4B3WB26VP4`)

- Google Signals et personnalisation pub désactivés (mesure d'audience seule, moins exposé côté CNIL).
- Événements personnalisés envoyés automatiquement :

| Événement | Quand | Paramètres |
|---|---|---|
| `section_view` | une section devient visible (1 fois/visite) | `label` = hero, about, experience, projects, certifications, recommandations, contact |
| `project_open` | clic sur « Détails » / lien d'un projet | `label` = titre du projet, `link_type` = pdf / external / page |
| `cv_download` | clic sur « Télécharger le vrai CV » | |
| `cv_prank_open` | clic sur « Télécharger mon CV » (déclenche le prank) | |
| `cv_prank_completed` | les 3 popups sont fermées | |
| `contact_click` | clic email / LinkedIn / GitHub | `label` = email / linkedin / github, `section` |
| `contact_form_submit` | envoi du formulaire | |
| `recommendation_open` | ouverture d'une lettre de recommandation | `label` = fichier |
| `nav_click` | clic sur un lien de navigation interne | `label` = section cible |

L'entonnoir intéressant : `section_view:projects` → `project_open` → `cv_download` → `contact_click`.

### À faire une fois dans l'interface GA4 (10 min)

1. **Admin → Événements** : attendre 24 h que les événements remontent, puis cocher **« Marquer comme événement clé »** pour `cv_download`, `contact_click`, `contact_form_submit`, `project_open`.
2. **Admin → Paramètres des données → Conservation des données** : passer de 2 à **14 mois** (sinon les explorations perdent l'historique).
3. **Admin → Flux de données → Mesure améliorée** : vérifier que *Défilements*, *Clics sortants* et *Téléchargements de fichiers* sont cochés.
4. **Admin → Liens avec les produits → Search Console** : lier la propriété (voir §4) pour voir les requêtes Google qui amènent sur le site.
5. **Explorer → Entonnoir** : créer un rapport avec les 4 étapes ci-dessus. C'est LE rapport à regarder chaque semaine.
6. Pour vérifier que ça marche tout de suite : ouvrir le site en navigation privée sans bloqueur, cliquer un projet, puis **Rapports → Temps réel** dans GA4.

### GoatCounter (recommandé en complément)

Compteur open source, gratuit pour un usage perso, **sans cookies**, sans bannière de consentement,
et beaucoup moins présent dans les listes de blocage que Google. Il donne un chiffre proche du réel.

1. Créer un compte : https://www.goatcounter.com/signup (choisir un code de site, ex. `ilyes-sadadou`).
2. Dans `index.html`, bloc `window.SITE_ANALYTICS`, renseigner `goatcounter: 'ilyes-sadadou'`.
3. Commit + push. Le tableau de bord est sur `https://ilyes-sadadou.goatcounter.com`.
   Les mêmes événements que GA4 y apparaissent sous `event/…` (ex. `event/cv_download/cv_pdf`).

Comparer GA4 et GoatCounter sur une semaine donne directement le taux de visiteurs qui bloquent Google.

## 3. SEO : ce qui a été ajouté

- `<title>` et `meta description` réécrits avec les mots-clés cibles (sécurité endpoint, RSSI, pentest, EDR, Active Directory…).
- `canonical`, `robots`, `theme-color`, `author`.
- **Open Graph + Twitter Card** avec une image `assets/og-image.png` (1200×630) : un lien partagé sur LinkedIn, Discord, WhatsApp ou Slack affiche maintenant une vraie carte au lieu d'un lien nu.
- **Données structurées JSON-LD** (`Person` + `WebSite`) : Google peut relier le site, le LinkedIn et le GitHub à la même personne.
- `robots.txt` et `sitemap.xml` à la racine.
- L'icône GitHub du hero est devenue un vrai lien vers le profil.

Vérifications utiles après mise en ligne :
- Aperçu LinkedIn : https://www.linkedin.com/post-inspector/ (coller l'URL du site, cliquer *Inspect* pour vider le cache).
- Données structurées : https://validator.schema.org/
- Google : https://search.google.com/test/rich-results

## 4. Search Console et Bing (à faire, 5 min chacun)

C'est ce qui donne les **requêtes réelles** tapées sur Google et le nombre d'impressions.

1. https://search.google.com/search-console → *Ajouter une propriété* → type **Préfixe d'URL** →
   `https://fumikage-darkshadow.github.io/Portfolio-/`.
2. Méthode de validation **Balise HTML** : copier la ligne `<meta name="google-site-verification" content="…">`
   et la coller dans le `<head>` de `index.html` sous la balise `canonical`. Commit, push, attendre le déploiement, *Valider*.
3. Dans Search Console : *Sitemaps* → envoyer `sitemap.xml`. Puis *Inspection d'URL* → *Demander l'indexation* sur la page d'accueil.
4. Même chose sur https://www.bing.com/webmasters (import possible depuis Search Console en un clic).

## 5. Autres leviers de visibilité (par impact)

1. **LinkedIn** : mettre l'URL du site dans *Coordonnées* et dans la section *Sélection* (Featured) avec l'aperçu OG. C'est de très loin la première source de trafic pour un portfolio.
2. **Dépôt GitHub** : renseigner *About* (description + Website) et des topics (`portfolio`, `cybersecurity`, `pentest`, `edr`). Épingler le dépôt sur le profil. Commande prête :
   ```bash
   gh repo edit Fumikage-DarkShadow/Portfolio- --homepage "https://fumikage-darkshadow.github.io/Portfolio-/" --description "Portfolio cybersécurité — Ingénieur Sécurité Endpoint, futur RSSI" --add-topic portfolio --add-topic cybersecurity --add-topic pentest --add-topic edr
   ```
3. **URL plus propre** : le tiret final de `/Portfolio-/` fait bricolé. Deux options :
   - renommer le dépôt en `fumikage-darkshadow.github.io` → le site devient `https://fumikage-darkshadow.github.io/` (racine). GitHub redirige l'ancienne URL du dépôt, mais **pas** l'ancienne URL Pages : mettre à jour `canonical`, `og:url`, JSON-LD, `robots.txt`, `sitemap.xml`, et le lien LinkedIn.
   - ou acheter un domaine (`ilyes-sadadou.fr`, ~10 €/an) et le brancher dans *Settings → Pages → Custom domain*. Bonus : GoatCounter et GA peuvent alors être servis derrière le domaine, ce qui réduit encore le blocage.
4. **Contenu** : Google indexe du texte. Un court article par projet (500 mots, page HTML dédiée) pèserait plus que dix PDF. Les PDF sont indexés, mais mal classés.

## 6. Formulaire de contact

Avant : le formulaire affichait « Message envoyé » mais **n'envoyait rien** (site statique, aucun backend).
Maintenant : il ouvre la messagerie du visiteur avec un email prérempli vers ilyesadadoupro@gmail.com.

Pour un vrai envoi sans que le visiteur ouvre sa messagerie : créer un formulaire sur https://formspree.io (gratuit, 50 messages/mois),
puis remplacer `window.location.href = mailto;` par un `fetch('https://formspree.io/f/XXXX', { method: 'POST', body: new FormData(contactForm), headers: { Accept: 'application/json' } })`.
