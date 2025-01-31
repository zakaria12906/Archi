Rapport de Développement - TRD Betting System
1. Introduction
TRD Betting System est une plateforme de gestion des paris sportifs développée selon une architecture microservices. L’objectif de cette application est de permettre aux utilisateurs de créer un compte, consulter les matchs disponibles, placer des paris, suivre les résultats et recevoir leurs gains automatiquement.

Le projet suit les principes de modularité, scalabilité et robustesse grâce à l'utilisation de services indépendants qui communiquent via API REST et RabbitMQ.

2. Objectifs du Projet
L’application doit répondre aux besoins suivants :

✅ Gestion des utilisateurs : permettre l’inscription, l’authentification et la gestion des rôles.
✅ Gestion des portefeuilles : suivre le solde des parieurs et gérer les transactions financières.
✅ Gestion des matchs et cotes : permettre aux bookmakers d'ajouter des matchs, fixer des cotes et mettre à jour les résultats.
✅ Gestion des paris : permettre aux utilisateurs de placer des paris et suivre leurs mises.
✅ Automatisation des paiements : créditer les gains automatiquement aux utilisateurs gagnants.


Le projet est basé sur une architecture microservices comprenant quatre services indépendants :

Auth-Service : Gestion des comptes utilisateurs (inscription, connexion, authentification).
Customers-Service : Gestion des portefeuilles et transactions financières des utilisateurs.
Match-Service : Gestion des matchs, des cotes et des résultats.
Bet-Service : Gestion des paris et du paiement des gains.
Chaque service possède sa propre base de données MongoDB et communique avec les autres via RabbitMQ pour les événements asynchrones.


4. Fonctionnalités Développées
4.1. Auth-Service - Gestion des Utilisateurs
 Technologies : Node.js, Express, MongoDB, JWT

✅ Inscription et connexion des utilisateurs.
✅ Gestion des rôles (admin, bookmaker, parieur).
✅ Sécurisation avec JWT et gestion des tokens.
✅ Vérification de l’authenticité des utilisateurs.

4.2. Customers-Service - Gestion des Portefeuilles
 Technologies : Node.js, Express, MongoDB

✅ Vérification du solde avant de placer un pari.
✅ Mise à jour du portefeuille après chaque transaction.
✅ Gestion des dépôts et retraits d’argent.
✅ API permettant d’ajouter ou de retirer des fonds aux utilisateurs.

4.3. Match-Service - Gestion des Matchs et Cotes
 Technologies : Node.js, Express, MongoDB, RabbitMQ

✅ Ajout et mise à jour des matchs et cotes par les bookmakers.
✅ Mise à jour automatique des statuts des matchs (upcoming, in_progress, finished).
✅ API permettant de récupérer la liste des matchs et leurs cotes.
✅ Publication des événements match_finished via RabbitMQ.

4.4. Bet-Service - Gestion des Paris et Paiements
 Technologies : Node.js, Express, MongoDB, RabbitMQ

✅ Placement de paris simples et paris combinés.
✅ Vérification des résultats des paris après la fin des matchs.
✅ Paiement automatique des gains aux utilisateurs gagnants.
✅ Connexion avec Match-Service et Customers-Service.
✅ Automatisation via un scheduler pour mettre à jour les résultats et déclencher les paiements.


5. Développement des Services
5.1. Développement du Auth-Service
 Modèle Utilisateur (user.model.js)
Le modèle utilisateur permet de gérer les comptes des utilisateurs avec leur rôle.

✅ Routes API
POST /auth/signup : Créer un utilisateur
POST /auth/login : Connexion d’un utilisateur
GET /auth/me : Récupérer les informations de l’utilisateur connecté

5.2. Développement du Customers-Service
✅ Modèle Portefeuille (customer.model.js)
Chaque utilisateur possède un portefeuille pour stocker son solde.

✅ Routes API
GET /customers/:id : Récupérer le solde d’un utilisateur
PUT /customers/:id/credit : Ajouter des fonds
PUT /customers/:id/debit : Débiter le compte après un pari



5.3. Développement du Match-Service
✅ Modèles de données
team.model.js : Stocke les équipes et leurs informations.
match.model.js : Stocke les matchs et leurs cotes.
✅ Routes API
GET /matches : Liste des matchs et cotes.
POST /matches : Ajouter un nouveau match (réservé aux bookmakers).
PUT /matches/:id/odds : Mettre à jour les cotes d’un match.
PUT /matches/:id/status : Modifier le statut du match (upcoming, in_progress, finished).



5.4. Développement du Bet-Service
✅ Modèle de Pari (bet.model.js)
Stocke les paris avec l’identifiant du match et le type de pari.

✅ Routes API
POST /bets : Placer un pari.
GET /bets : Récupérer les paris d’un utilisateur.
POST /bets/update-results : Mettre à jour les résultats des paris après la fin des matchs.
POST /bets/process-payments : Traiter les paiements des paris gagnants.
✅ Automatisation avec le Scheduler
Mise à jour automatique des paris en fonction des résultats des matchs.
Déclenchement du paiement des gains via RabbitMQ.

Installation : 

1.1. Cloner le projet

git clone https://github.com/votre-repo/projet-arch.git
cd projet-arch

1.2  Installer les dépendances

npm install

 Démarrage des services
  2.1. Démarrer tous les services
bash
Copier
Modifier
npm start

2:2 : Démarrer un service spécifique
cd auth-service && npm run dev  # Pour Auth-Service
cd customers-service && npm run dev  # Pour Customers-Service
cd match-service && npm run dev  # Pour Match-Service
cd bet-service && npm run dev  # Pour Bet-Service


2.3. Démarrer MongoDB
mongod --dbpath ./data/db


2.4. Démarrer RabbitMQ avec Docker

docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:management avec un accès à l'interface RabbitMQ : http://localhost:15672 (login: guest, pass: guest)
















6. Tests et Validation
✅ Commandes pour tester l’API

Créer un compte et se connecter

✅ curl -X POST "http://localhost:5001/auth/signup" -H "Content-Type: application/json" --data '{"email": "test@example.com", "password": "password", "role": "parieur"}'


Activer un compte manuellement (MongoDB)
✅mongo
✅use auth-db
✅db.users.updateOne({ email: "zakariae@example.com" }, { $set: { isActive: true } })

Obtenir un token d’authentification

✅curl -X POST "http://localhost:5001/auth/login" \
     -H "Content-Type: application/json" \
     --data '{
       "email": "zakariae@example.com",
       "password": "password123"
     }'

Vérifier le solde d’un utilisateur

✅curl -X GET "http://localhost:5002/customers/USER_ID"


Ajouter des fonds à un utilisateur
✅curl -X PUT "http://localhost:5002/customers/USER_ID/credit" \
     -H "Content-Type: application/json" \
     --data '{ "amount": 100 }'

Débiter un utilisateur
✅curl -X PUT "http://localhost:5002/customers/USER_ID/debit" \
     -H "Content-Type: application/json" \
     --data '{ "amount": 50 }'



Ajouter un nouveau match

✅curl -X POST "http://localhost:5003/matches" \
     -H "Authorization: Bearer <TOKEN>" \
     -H "Content-Type: application/json" \
     --data '{
       "teams": { "home": "Real Madrid", "away": "FC Barcelone" },
       "date": "2024-09-17T20:00:00Z",
       "odds": { "homeWin": 1.8, "draw": 3.2, "awayWin": 2.1 }
     }'

Récupérer la liste des matchs

✅curl -X GET "http://localhost:5003/matches"

Modifier les cotes d’un match

✅curl -X PUT "http://localhost:5003/matches/MATCH_ID/odds" \
     -H "Authorization: Bearer <TOKEN>" \
     -H "Content-Type: application/json" \
     --data '{ "homeWin": 2.0, "draw": 3.5, "awayWin": 2.0 }'


Modifier le statut d’un match

✅curl -X PUT "http://localhost:5003/matches/MATCH_ID/status" \
     -H "Authorization: Bearer <TOKEN>" \
     -H "Content-Type: application/json" \
     --data '{ "status": "finished", "score": { "home": 2, "away": 1 } }'


Vérifier les matchs disponibles

✅curl -X GET "http://localhost:5003/matches"

Placer un pari

✅curl -X POST "http://localhost:5004/bets" -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" --data '{"type": "simple", "bets": [{"matchId": "MATCH_ID", "betType": "homeWin", "odd": 1.8}], "amount": 50}'


Mettre à jour les résultats des paris

✅curl -X POST "http://localhost:5004/bets/update-results"

Récupérer tous les paris de l’utilisateur

✅curl -X GET "http://localhost:5004/bets" \
     -H "Authorization: Bearer <TOKEN>"


Effectuer le paiement des gains
✅curl -X POST "http://localhost:5004/bets/process-payments"


Déploiement avec Docker

Démarrer tous les services avec Docker

✅docker-compose up --build

Arrêter les services Docker

✅docker-compose down

