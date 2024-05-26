# SoapVox


## Structure du projet
    
```
 soapvox/
├── .next/
├── backend/
│   ├── node_modules/
│   ├── src/
│   │   └── server.ts
│   ├── uploads/
│   ├── package-lock.json
│   ├── package.json
│   ├── tsconfig.json
├── node_modules/
├── public/
├── src/
│   └── app/
│       ├── favicon.ico
│       ├── globals.css
│       ├── layout.tsx
│       ├── page.tsx
├── .eslintrc.json
├── .gitignore
├── next-env.d.ts
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── README.md
├── tailwind.config.ts
├── tsconfig.json
└── LICENSE

```

## Installation

Prérequis

Node.js (version 14 ou supérieure)
npm (version 6 ou supérieure)
ffmpeg

### Installation de ffmpeg

Sur macOS avec Homebrew

```bash
brew install ffmpeg
```

Sur Ubuntu/Debian
    
```bash
sudo apt update
sudo apt install ffmpeg
```

Sur Windows

Téléchargez ffmpeg depuis le site officiel : FFmpeg Download.
Extrayez les fichiers téléchargés.
Ajoutez le chemin du dossier bin (où se trouve ffmpeg.exe) à la variable d'environnement PATH.

## Cloner le projet

```bash
git clone https://github.com/AntoineBendafiSchulmann/SoapVox 
```

## backend

Naviguez dans le répertoire backend et installez les dépendances :
```bash
cd soapvox
cd backend
npm install
```

```bash
npm start
```

Le serveur backend devrait maintenant être opérationnel sur http://localhost:3001.

## frontend

Naviguez dans le répertoire frontend et installez les dépendances :
```bash
cd soapvox
npm install
```

Démarrez le serveur de développement frontend :


```bash
npm run dev
```

Le serveur frontend devrait maintenant être opérationnel sur http://localhost:3000.

## État actuel du projet
Nous avons configuré le backend et le frontend de base pour le projet SoapVox :

Backend : Configuré avec Express, Multer pour l'upload de fichiers, et fluent-ffmpeg pour l'extraction audio.
Frontend : Configuré avec Next.js et Tailwind CSS, et utilise wavesurfer.js pour la visualisation des niveaux sonores.