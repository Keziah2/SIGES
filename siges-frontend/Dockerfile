# Étape 1: Build de l'application React
FROM node:18-alpine as build

WORKDIR /app

# Copier package.json et package-lock.json (ou yarn.lock)
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code de l'application
COPY . ./

# Builder l'application
RUN npm run build

# Étape 2: Servir l'application avec Nginx
FROM nginx:stable-alpine

# Copier les fichiers buildés de l'étape précédente dans le répertoire de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copier une configuration Nginx personnalisée (optionnel, mais souvent utile)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port 80
EXPOSE 80

# Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]
