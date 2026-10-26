# Portée et suivi de sécurité

Cette correction retire le secret JWT de secours, refuse les anciens identifiants
exemples du seed, protège le reset destructif avant toute opération de base, et ne
journalise plus le mot de passe initial. Les redirections de formulaires passent
en 303 et le champ `next` reste sur le même site après normalisation.

La mise à jour Next.js 14 → 15.5.28 et React 19 inclut les adaptations asynchrones
`cookies`/`searchParams`. Le contrat de publication est vérifié sur une base locale
jetable (6 pages), avec tests de sécurité, TypeScript, lint et build. Une vérification
HTTP locale a confirmé une connexion normale, le rejet d'un JWT signé avec l'ancien
secret de secours et la déconnexion. Aucun compte réel n'a été utilisé.

## Avant fusion

Configurer un secret JWT aléatoire unique d'au moins 32 octets ; l'absence de valeur
valide bloque volontairement les connexions. Les seeds de démonstration exigent un
consentement local explicite et restent interdits en production. La configuration
distante et les sessions de production n'ont pas été modifiées.

## Dépendances restant à planifier

Après les mises à jour compatibles, `npm audit` signale encore 9 alertes : 0 critique,
4 élevées, 4 modérées et 1 faible. Elles concernent les chaînes Prisma 6 / deepmerge-ts,
PostCSS embarqué dans Next 15, Tailwind 3 / postcss-selector-parser et esbuild. Les
correctifs automatiques restants proposent notamment des migrations majeures
Prisma 7, Next 16 et Tailwind 4. Elles demandent une PR séparée avec validation des
schémas, du rendu et des builds ; aucun `audit fix --force` n'a été exécuté.
Ces alertes de dépendances ne démontrent pas une exploitation en production.

Le lint conserve un avertissement préexistant sur l'effet d'autosauvegarde du
page-editor. La limitation distribuée des connexions et la rotation/révocation
individuelle des sessions restent des améliorations à traiter séparément.
