# Portfolio — Ilyes Sadadou

> Ingénieur Sécurité Endpoint @ BNP Paribas — Futur RSSI

Portfolio personnel développé en HTML/CSS/JS vanilla, déployé sur GitHub Pages.

🌐 **Live** : [fumikage-darkshadow.github.io/Portfolio-](https://fumikage-darkshadow.github.io/Portfolio-/)

---

## À propos

Portfolio one-page d'un ingénieur en cybersécurité, présentant :
- 5 expériences professionnelles avec missions détaillées (flip cards)
- 10 projets techniques (pentest, malware, RAT, IoT, infra, app mobile)
- 14 certifications (Trellix, CompTIA, Splunk, ANSSI, CNIL, DRSD, Cisco...)
- 3 lettres de recommandation
- Formulaire de contact

## Stack technique

- **Frontend** : HTML5 sémantique, CSS3 (variables, grid, flexbox, animations), JavaScript vanilla
- **Fonts** : IBM Plex Mono + DM Sans (Google Fonts)
- **Aucune dépendance** : pas de framework, pas de build, un seul fichier `index.html`
- **Analytics** : Google Analytics 4
- **Hébergement** : GitHub Pages

## Fonctionnalités

- 🎨 Design dark mode avec accents néon vert/bleu
- ✍️ Effet typewriter sur le hero (avec commandes bash geek)
- 🔄 Cards d'expérience flippables au clic (recto/verso)
- 🎢 Bandeaux marquee avec défilement auto + drag bidirectionnel
- 🎯 Prank Windows-style au téléchargement du CV (3 popups antivirus)
- 📱 Responsive mobile (breakpoints 480/768/1024/1200px)
- ♿ Accessibilité : ARIA labels, prefers-reduced-motion, contraste WCAG AA
- ⚡ Performance : un seul HTTP request HTML, pas de JS frameworks

## Structure

```
Portfolio/
├── index.html              # Site complet (HTML + CSS + JS inline)
├── Image/                  # Logos d'entreprises et icônes projets
├── assets/
│   ├── pdf/                # Rapports techniques + CV + lettres reco
│   └── floww-preview.html  # Preview de l'app Floww (sous-projet)
└── README.md
```

## Projets présentés

| # | Projet | Stack |
|---|--------|-------|
| 1 | **Floww** — App de budget Gen Z | React Native, Expo, TypeScript |
| 2 | **Analyse Statique Satan** — Ransomware | HxD, PE Studio, VirusTotal |
| 3 | **Custom RAT** — Remote Access Trojan | C/C++, Python, TLS 1.3 |
| 4 | **Spyware éducatif** — Analyse comportementale | Python, FLARE VM, Sandbox |
| 5 | **Pentest & Phishing** — Site cloné | Kali Linux, SET, Metasploit |
| 6 | **Réseau LoRa privé** — IoT portable | LoRaWAN, Capteurs, Dashboard |
| 7 | **SSH Hardening** — Auth + 2FA | SSH, Linux, Google 2FA |
| 8 | **Active Directory** — Centralisation identités | AD, Windows Server, GPO |
| 9 | **Réseau unifié PME** — Architecture | VLAN, Routage, Cisco |
| 10 | **Clonezilla** — Déploiement de postes | Boot USB, Disk Cloning |

---

## Tu veux faire un portfolio similaire ? Voici comment

### Choix techniques

**Un seul fichier HTML.** Pour un portfolio personnel, pas besoin de React/Vue/Next. CSS et JS inline dans un seul `index.html`. Avantages :
- Hébergement gratuit instantané (GitHub Pages, Netlify drop)
- Pas de build, pas de `node_modules`, pas de dépendances qui cassent
- Recruteur curieux fait `Ctrl+U` → voit ton code propre direct
- Performance maximale (un seul HTTP request)

**Variables CSS centralisées.** Au début du `<style>` :

```css
:root {
  --bg-primary: #080b12;
  --accent-green: #00f5a0;
  --font-mono: 'IBM Plex Mono', monospace;
}
```

Tu peux refactor toute la palette en 10 secondes.

**Mobile-first responsive.** Breakpoints classiques : 480 (mobile), 768 (tablette), 1024 (desktop), 1200 (large). `grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))` est ton ami.

### Pièges à éviter

1. **Lorem ipsum.** Si tu n'as pas le contenu réel, ne lance pas le portfolio. Du faux texte = mort instantanée chez un recruteur.
2. **Animations excessives.** Une animation par section, pas 5. Et toujours respecter `prefers-reduced-motion`.
3. **Stack overengineered.** "Portfolio Next.js + Tailwind + Framer Motion + tRPC" pour 5 pages statiques = signal négatif.
4. **Photos volées sur Unsplash sans attribution.** Soit tu prends tes propres screenshots, soit tu utilises des SVG dont tu as les droits.
5. **CV uniquement en JPG.** Toujours fournir un vrai PDF. Les ATS (logiciels RH) ne lisent pas les images.

### Structure recommandée

```
1. Hero          → Nom + accroche + CTA
2. À propos      → 2-3 paragraphes humains, pas un CV
3. Expérience    → Timeline avec dates + missions concrètes
4. Projets       → Avec images, stack, et lien vers détail (PDF/repo)
5. Certifications→ Visuel, pas une liste à puces
6. Recommandations→ Citations + photos d'auteurs
7. Contact       → Email + LinkedIn + formulaire (qui marche)
```

### Outils utiles (gratuits)

- **GitHub Pages** : hébergement gratuit, certificat HTTPS auto
- **Google Fonts** : polices gratuites (`IBM Plex Mono`, `Inter`, `JetBrains Mono`)
- **Heroicons / Lucide** : SVG icons libres de droit, à inliner
- **Squoosh.app** : compresse tes images en WebP (gain ~40-60%)
- **Formspree** : 50 messages/mois gratuits pour le formulaire de contact
- **Google Analytics 4** : stats détaillées gratuites
- **Lighthouse Chrome** : `F12 → Lighthouse → Generate report` pour mesurer perf/accessibilité

### Checklist avant publication

- [ ] Tous les liens fonctionnent (`<a href="#">` à éliminer)
- [ ] Tous les PDFs s'ouvrent
- [ ] Mobile : pas de scroll horizontal involontaire
- [ ] Lighthouse : Performance > 80, Accessibilité > 90
- [ ] Open Graph meta + favicon configurés
- [ ] Formulaire de contact branché ou retiré
- [ ] CV PDF à jour, accessible
- [ ] Coquilles + fautes d'orthographe (lis 2 fois à voix haute)
- [ ] Test en navigation privée
- [ ] Test sur Firefox + Safari, pas que Chrome

### Tips spécifiques cybersécurité

- **Montre tes rapports.** Les PDFs de pentest, malware analysis = preuve concrète. Anonymise les données clients.
- **Cite tes certifs avec date d'obtention.** Plus crédible qu'une simple liste.
- **Ajoute un lien GitHub avec des repos publics.** Même 2-3 scripts pertinents valent mieux qu'aucun repo.
- **Évite les mots-buzz vides.** "Synergique", "innovant", "passionné par les défis"... Préfère du concret : "j'ai analysé 50 alertes EDR/jour pendant 10 mois".

### Inspiration

Sites à étudier (sans copier) :
- brittanychiang.com (typo + couleurs)
- josh.is (animations subtiles)
- bchiang7.github.io (timeline expérience)

Lire le code source de ces sites = meilleure formation que n'importe quel tuto YouTube.

---

## Contact

- 💼 [LinkedIn](https://www.linkedin.com/in/ilyes-s-265356a8/)
- 📧 ilyesadadoupro@gmail.com

---

*Code et design : Ilyes Sadadou — 2026*
