# Mercadona Catalog Overview

## How to build

Cloner ce repository dans un emplacement local de votre machine.

### Préparer l'environement de développement

Ouvrez le terminal à la racine du projet et créer l'environnement virtuel.

```
python -m venv .env
source .env/bin/activate
```
*Note*: Le script _activate_ à exécuter peut différer selon votre shell.
Pour plus d'information, se référer à [la documentation de venv](https://docs.python.org/3/library/venv.html).

Installer les paquets Python requis:

```
pip install -r requirements.txt
```

### Lancer le site web

```
./manage.py runserver
```

Le site web est accessible à l'adresse https://docs.python.org/3/library/venv.html.

Pour plus d'information sur le script _manage_, consulter [la documentation officielle](https://docs.djangoproject.com/en/4.2/ref/django-admin/).

## Remarques

**Les identifiants utilisateurs pour l'espace d'administration sont : _jose_ / _jose_.**

Le projet ne délivre pas les fonctionnalités suivantes :

- Filtre des produits à l'affichage (ajouté post-rendu final)
- Déconnexion de l'utilisateur identifié (fixé post-rendu final) 






