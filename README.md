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

Dans ce pojet , ffmpeg est utilisé pour manipuler les fichiers multimédias, notamment pour extraire l'audio des fichiers vidéo que les utilisateurs téléchargent. Voici les étapes principales où ffmpeg intervient :

Téléchargement de la vidéo : L'utilisateur télécharge une vidéo via l'interface frontend.
Envoi au backend : La vidéo est envoyée au serveur backend via une requête HTTP POST.
Extraction de l'audio : Le serveur backend utilise ffmpeg pour extraire l'audio du fichier vidéo téléchargé et le convertir en fichier audio (ici, MP3).
Téléchargement de l'audio extrait : Le fichier audio extrait est envoyé en réponse à l'utilisateur, qui peut alors le télécharger et le lire.

Pourquoi ffmpeg ?
ffmpeg est un outil extrêmement puissant et polyvalent pour la manipulation des fichiers audio et vidéo. Il est capable de :

Convertir des fichiers entre différents formats audio et vidéo.
Extraire des pistes audio ou vidéo de fichiers multimédias.
Appliquer des filtres audio et vidéo.
Fusionner ou découper des fichiers audio et vidéo.
Enregistrer et diffuser des flux audio et vidéo.

Attention ! 
À installer sur le pc , pas juste dans le projet 

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

## Explication du code à l'heure actuel : 

### Téléchargement du fichier :
multer est utilisé pour gérer les téléchargements de fichiers.
Le fichier vidéo est stocké temporairement dans le dossier uploads/.

### Extraction de l'audio :
ffmpeg est utilisé pour lire le fichier vidéo et en extraire la piste audio.
La piste audio est sauvegardée en tant que fichier MP3 dans le dossier uploads/.

### Téléchargement du fichier audio extrait :
Une fois l'extraction terminée, le fichier audio est envoyé en réponse à l'utilisateur pour téléchargement.
Les fichiers temporaires (vidéo et audio) sont supprimés après le téléchargement.

j'ai rajouté le visualisation des niveaux sonores de l'audio extrait qui sont visibles à l'aide de wavesurfer.js. 

plus que le texte 
