# Utiliser une image Python officielle comme image de base
FROM python:3.9-slim

# Définir les variables d'environnement
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Définir le répertoire de travail
WORKDIR /app

# Copier le fichier requirements.txt et installer les dépendances
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copier le reste du code de l'application dans le répertoire de travail
COPY . .

# Exposer le port sur lequel Gunicorn s'exécutera (si Gunicorn est utilisé)
EXPOSE 8000

# Commande pour démarrer l'application avec Gunicorn (ajuster au besoin)
# CMD ["gunicorn", "--bind", "0.0.0.0:8000", "siges_backend_django.wsgi:application"]
# Pour l'instant, on peut laisser le serveur de développement par défaut pour la simplicité du Dockerfile initial
# ou prévoir une commande de développement. Pour la production, Gunicorn est recommandé.
# Pour l'instant, nous allons juste nous assurer que le conteneur peut être construit.
# La commande CMD sera affinée plus tard.
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
