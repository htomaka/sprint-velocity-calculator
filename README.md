# Sprint Velocity Calculator

Calculateur de capacité de sprint agile basé sur la vélocité de référence, les jours ouvrés et les absences.

## 🚀 Déploiement

Ce projet est déployé sur Vercel : https://sprint-velocity-calculator.vercel.app/

## 📋 Fonctionnalités

- Calcul de la capacité de sprint en fonction de la vélocité de référence
- Prise en compte des absences par développeur
- Répartition entre capacité de build et capacité technique
- Interface responsive et moderne avec Tailwind CSS

## 🛠️ Installation et développement

1. Clonez le dépôt :
   ```bash
   git clone git@github.com:htomaka/sprint-velocity-calculator.git
   cd sprint-velocity-calculator
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Lancez le serveur de développement :
   ```bash
   npm run dev
   ```

L'application sera disponible sur http://localhost:3000

## 📦 Build

Le projet est un site statique, aucun build n'est nécessaire :
```bash
npm run build
```

## 🌐 Déploiement sur Vercel

Le projet est configuré pour être déployé sur Vercel avec :

- `vercel.json` : configuration des routes et en-têtes de sécurité
- `package.json` : scripts de build et dépendances
- `robots.txt` et `sitemap.xml` : optimisation SEO

## 📊 Utilisation

1. Saisissez la vélocité de référence de votre équipe
2. Indiquez le nombre de développeurs
3. Précisez les jours ouvrés du sprint
4. Définissez le pourcentage dédié au build
5. Ajoutez les absences prévues par développeur
6. Cliquez sur "Calculer la capacité"

## 🔧 Technologies

- HTML5
- Tailwind CSS (via CDN)
- JavaScript vanilla
- Vercel (hébergement)

## 📄 Licence

MIT License
