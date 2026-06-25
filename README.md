# EcoAction

EcoAction est une application mobile qui facilite la participation a des actions ecologiques locales. Les utilisateurs peuvent creer un compte, consulter les missions disponibles, filtrer les actions par categorie, s'inscrire a une mission et suivre leurs participations.

## Apercu

L'objectif du projet est de proposer une plateforme simple pour connecter des citoyens a des initiatives environnementales : nettoyage d'espaces publics, plantation d'arbres, ateliers de sensibilisation et actions locales.

## Fonctionnalites

- Creation de compte et connexion par email/mot de passe.
- Gestion de session utilisateur avec Supabase Auth.
- Liste des missions ecologiques disponibles.
- Recherche de missions par titre.
- Filtrage par categorie : `cleanup`, `planting`, `workshop`.
- Consultation du detail d'une mission : description, date, lieu, capacite et places restantes.
- Inscription a une mission.
- Annulation d'une participation.
- Ecran "Mes missions" pour consulter les missions confirmees.
- Profil utilisateur avec informations personnelles et nombre d'actions realisees.
- Cache local des donnees avec React Query et AsyncStorage.

## Stack technique

- Expo
- React Native
- TypeScript
- Expo Router
- Supabase Auth
- Supabase Database
- TanStack React Query
- AsyncStorage
- NativeWind / Tailwind CSS

## Structure du projet

```text
EcoAction/
|-- app/                  # Routes et navigation Expo Router
|-- assets/               # Icones et images de l'application
|-- src/
|   |-- components/       # Composants reutilisables
|   |-- hooks/            # Hooks metier pour les missions
|   |-- providers/        # Contexte d'authentification
|   |-- screens/          # Ecrans de l'application
|   |-- services/         # Clients Supabase et React Query
|   `-- types/            # Types TypeScript
|-- supabase/             # Schema SQL et donnees de depart
|-- app.config.ts         # Configuration Expo
`-- package.json          # Dependances et scripts
```

## Prerequis

- Node.js
- npm
- Expo Go ou un emulateur Android/iOS
- Un projet Supabase

## Installation

Installer les dependances :

```bash
npm install
```


## Scripts

```bash
npm start        # Lance Expo
npm run android  # Lance l'application sur Android
npm run ios      # Lance l'application sur iOS
npm run web      # Lance la version web
```


## Auteur

Projet réalisé par Yasmine Soussi.
