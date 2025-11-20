Demo at [pokedex.nicolas.nz](https://pokedex.nicolas.nz/)

# Pokemon - Pokedex Next.js

Application Pokedex complète développée avec Next.js, utilisant l'API [PokeAPI](https://pokeapi.co/) pour afficher et comparer les informations des Pokémons.

## À propos

Cette application est une **application de test** qui a été **entièrement générée par IA** (Vide codé). Aucune ligne de code n'a été écrite manuellement - tout le code source a été produit automatiquement par un assistant IA.

## Fonctionnalités

- **Recherche de Pokémons** : Recherche par nom ou ID avec suggestions en temps réel
- **Affichage des détails** : Fiche complète avec statistiques, types, capacités
- **Comparaison** : Comparaison côte à côte de deux Pokémons avec graphiques radar
- **Catalogue infini** : Parcours paginé avec lazy loading au scroll
- **Interface moderne** : Design épuré avec Shadcn UI et animations Motion

## Technologies utilisées

- **Next.js 16** (App Router)
- **TypeScript** (strict mode, aucun `any`)
- **React Query** (TanStack Query) pour la gestion des données
- **Jotai** pour l'état global (comparaison)
- **Zod** pour la validation
- **Shadcn UI** pour les composants
- **Motion** pour les animations
- **Recharts** pour les graphiques radar
- **TanStack React Form** pour les formulaires

## Démarrage

Installer les dépendances :

```bash
pnpm install
```

Lancer le serveur de développement :

```bash
pnpm dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Structure du projet

```
pokemon-exalt/
├── app/                    # Pages Next.js (App Router)
│   ├── page.tsx           # Accueil
│   ├── search/            # Page de recherche
│   ├── pokemon/[id]/      # Page détail Pokémon
│   └── compare/           # Page de comparaison
├── components/
│   ├── pokemon/           # Composants Pokémon réutilisables
│   ├── layout/            # Layout et sidebar
│   └── ui/                # Composants Shadcn UI
├── lib/
│   ├── api/               # Client API PokeAPI
│   ├── hooks/             # Hooks React Query
│   ├── store/             # Store Jotai
│   ├── types/             # Types TypeScript
│   └── validators/        # Schémas Zod
└── components.json        # Configuration Shadcn
```

## Principes de développement

- **Clean Code** : Code propre et maintenable
- **SOLID** : Respect des principes SOLID
- **TypeScript strict** : Aucun `any`, types explicites partout
- **Server Components** : Utilisation par défaut, Client Components uniquement si nécessaire
- **Performance** : Optimisations avec React Query, lazy loading, memoization

## API

Cette application utilise l'API publique [PokeAPI](https://pokeapi.co/) pour récupérer les données des Pokémons.

## Note importante

⚠️ **Cette application est un projet de test/démonstration entièrement généré par IA. Elle n'est pas destinée à un usage en production.**
