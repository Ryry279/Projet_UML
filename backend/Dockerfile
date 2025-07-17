# Utiliser l'image officielle Node.js LTS (Long-Term Support)
FROM node:lts

# Définir le répertoire de travail à l'intérieur du conteneur
WORKDIR /app

# Copier le package.json et le package-lock.json
COPY package*.json ./

# Installer les dépendances du projet
RUN npm install

# Copier tout le reste du code du backend
COPY . .

# Exposer le port que notre serveur utilise
EXPOSE 3001

# La commande pour démarrer l'application (utilise le script "start" du package.json)
CMD [ "npm", "start" ]