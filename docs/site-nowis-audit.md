# Audit complet site-nowis-web -> NoWisAdmin

Date: 2026-03-29
Perimetre: pages publiques editoriales (hors CRM et espace client prive)

## 1) Pages du site detectees (public)

Pages principales auditees:
- /
- /musique
- /videos
- /ateliers
- /contact
- /services
- /a-propos
- /commander-une-chanson
- /creations
- /portfolio

Fichiers principaux:
- src/app/page.tsx
- src/app/musique/page.tsx
- src/app/videos/page.tsx
- src/app/ateliers/page.tsx
- src/app/contact/page.tsx
- src/app/services/page.tsx
- src/app/a-propos/page.tsx
- src/app/commander-une-chanson/page.tsx
- src/app/creations/page.tsx
- src/app/portfolio/page.tsx

## 2) Types de sections reels detectes

Types communs:
- HeroSection (PageHero + Hero maison sur HomeScreen)
- CardsSection (cartes de contenu/services/infos)
- ProcessSection (etapes numerotees)
- TrustStripSection (arguments courts)
- GridListSection (songs/videos cards)
- FinalCTASection (bloc final avec boutons)
- ContactInfoSection (email/telephone + boutons)
- SocialLinksSection
- LegalInfoSection
- PortalGateSection (ClientPortalRequestGate)

Sections marketing reutilisees:
- SongHowItWorksSection
- SongPackagesSection
- SongProjectTypesSection
- SongVideoExtrasSection
- WhyNowisSection
- SongGuaranteeBlock
- SongPortfolioBlock
- SongFinalCtaSection

## 3) Structure par page (resume)

### /
- Hero complexe avec image, overlays, 3 boutons, 2 cartes resumees
- Bande emotion/message (3 cartes)
- Bloc double colonnes musique/ateliers
- Bloc process 3 etapes
- Bloc chansons recentes (grille)
- Bloc connexion/portail
- Bloc garanties et temoignages (dans HomeScreen)

### /musique
- PageHero
- Intro textuelle
- Grille SongCard (donnees songs)

### /videos
- PageHero
- Intro textuelle
- Grille VideoCard (donnees videos)

### /services
- PageHero
- Grille serviceOffers (titre, sous-titre, description, bullets)
- Bloc CTA final sombre

### /a-propos
- PageHero
- Grille cartes (qui je suis, IA, pourquoi, offre)

### /contact
- PageHero
- ClientPortalRequestGate
- Bloc contact direct
- Bloc protection des donnees
- Bloc liens juridiques
- Bloc reseaux sociaux

### /commander-une-chanson
- PageHero
- SongProjectTypesSection (tags)
- SongHowItWorksSection
- SongPackagesSection
- SongVideoExtrasSection
- WhyNowisSection
- SongGuaranteeBlock + SongPortfolioBlock
- SongFinalCtaSection
- Bloc acces portail + consentement portfolio + liens legaux

## 4) Contenus modifiables reels

Contenus texte:
- Eyebrow, titres, sous-titres, paragraphes, descriptions de cartes
- Etapes (titre + texte)
- Tags/projets
- Textes de garantie, portfolio, contact legal

Boutons et liens:
- CTA principal/secondaire sur hero
- CTA de sections finales
- Liens contact, legal, social, portail

Images et medias:
- Hero image principale (home)
- Images des songs/videos (via donnees)

Styles forts codés en dur:
- Gradients de fond hero/panels/cards
- Overlays image hero
- Spacing et rayons (rounded-2xl, rounded-3xl, etc.)
- Couleurs classes utilitaires et classes brand-* dans globals.css
- Variantes dark/light selon section

Responsive:
- Multiples breakpoints md/lg/xl (grilles, colonnes, typographies)
- Variantes mobile menu dans Header

## 5) Ce qui manquait dans NoWisAdmin

Manques constates avant refonte:
- Mode edition trop generique (titre/texte/bouton/image seulement)
- Pas de modele par type de section reel
- Pas de champs specialises pour:
  - etapes
  - cartes multi-items
  - liens sociaux
  - blocs contact directs
  - CTA finaux doubles
- Aucune cartographie claire entre section NoWisAdmin et sections reelles du site
- Difficultes a reproduire fidèlement les pages publiques

## 6) Nouveau modele d edition propose (simple et logique)

Principe:
- Chaque section = un type clair
- Chaque type expose uniquement les champs utiles
- Champs supplementaires stockes en content blocks par cles metier

Types et champs retenus dans NoWisAdmin:
- hero
  - eyebrow
  - primaryCta.label / primaryCta.href
  - secondaryCta.label / secondaryCta.href
  - overlay
- cards
  - item1..item3 (title + text)
- process
  - step1..step3 (title + text)
- trustStrip
  - trust1..trust4 (title + text)
- contactInfo
  - email, phone, button1, button2
- socialLinks
  - spotify, youtube, instagram, facebook
- finalCta
  - cta1, cta2 (label + href)
- generic
  - fallback minimal

## 7) Changements effectues dans NoWisAdmin

Architecture/edition:
- Ajout d un modele de sections derive du site reel:
  - lib/site-section-model.ts
- Section cards affichent le type de zone
- Section editor affiche maintenant les champs specifiques selon le type de section
- API section-editor supporte la sauvegarde dynamique des champs par blockKey (upsert)

Donnees de base:
- Seed prisma aligne sur pages/sections reelles du site public
- Ajout des pages principales et sections de base auditees

## 8) Ce qui reste a brancher/affiner

A finaliser pour fidelite maximale:
- Brancher le rendu de site-nowis-web pour lire ces donnees admin au lieu de constantes locales
- Couvrir 100% des sous-sections HomeScreen non encore externalisees
- Ajouter edition de listes longues (ex: plus de 3 cartes) avec UI tres simple
- Ajouter edition des styles de section critiques (gradient preset, overlay preset) via choix simples, pas via CSS libre
- Synchroniser les data files existants (songSales, serviceOffers, socialLinks, legal) vers une source unique admin

## 9) Regle UX conservee

- Pas de jargon developpeur dans l interface
- Edition par zone avec apercu direct
- Champs regroupes par logique metier
- Pas d options gadgets
- Simplicite prioritaire
