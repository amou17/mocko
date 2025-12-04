# 🎭 Mocko

> Générateur de données fictives à partir d'un schéma JSON — Propulsé par Deno et Faker.js

## 📖 Description

**Mocko** est un outil CLI qui génère automatiquement des données réalistes à partir d'un fichier JSON template. Il analyse la structure et les noms des champs pour produire des données cohérentes (emails, noms, adresses, etc.).

## ✨ Fonctionnalités

- 🔍 **Détection intelligente** des champs (email, name, phone, address...)
- 🔄 **Support récursif** des objets imbriqués et tableaux
- 🌍 **Données localisées** en français
- ⚡ **Rapide** grâce à Deno

## 🚀 Installation

```bash
# Cloner le projet
git clone https://github.com/amou17/mocko.git
cd mocko

# Installer les dépendances
deno install
```

## 📋 Utilisation

### Créer un fichier template

Créez un fichier `schema.json` avec la structure souhaitée :

```json
{
  "id": "",
  "email": "",
  "profile": {
    "firstname": "",
    "lastname": "",
    "phone": ""
  },
  "orders": [
    {
      "id": "",
      "title": "",
      "price": 0
    }
  ]
}
```

### Générer les données

```bash
deno run --allow-read cli/main.ts --file="./schema.json"
```

### Résultat

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "jean.dupont@gmail.com",
  "profile": {
    "firstname": "Jean",
    "lastname": "Dupont",
    "phone": "06 12 34 56 78"
  },
  "orders": [
    { "id": "...", "title": "Lorem ipsum dolor", "price": 423 },
    { "id": "...", "title": "Sit amet consectetur", "price": 891 }
  ]
}
```

## 🛠️ Scripts

```bash
# Développement avec hot-reload
deno task dev

# Lancer l'application
deno task start
```

## 📦 Technologies

- [Deno](https://deno.land/) - Runtime TypeScript
- [Faker.js](https://fakerjs.dev/) - Génération de données fictives
- [MongoDB](https://www.mongodb.com/) - Base de données (optionnel)

## 📄 Licence

MIT © [amou17](https://github.com/amou17)
