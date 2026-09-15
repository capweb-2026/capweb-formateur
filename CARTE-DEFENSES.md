# Carte des défenses — Boussole

Chaque ligne dit quelle connerie est arrêtée, par quoi, et **où est la preuve** : le lien d'un run rouge ou d'une PR bloquée. Une barrière sans preuve ne compte pas.

| Connerie | Barrière qui l'arrête | Preuve (lien) | Checkpoint |
|---|---|---|---|
| Régression | Tests de contrat et CI obligatoire sur `main` | Run rouge de la PR « identité » avant le code (tests écrits d'abord) | CP1 |
| Test affaibli ou supprimé | `check:tests` (TEST-CHANGE obligatoire) et relecture | Run rouge d’une PR refusée : lien ajouté quand elle arrive | CP2 |
| Dépendance ajoutée | `check:deps` et `dependances-autorisees.json` | Run rouge d’une PR refusée : lien ajouté quand elle arrive | CP2 |
| Secret exposé | | | CP3 |
| IA qui sort de son thème | | | CP3 |
| Faille (`innerHTML`, injection) | | | CP4 |
| Contrôle désactivé | | | CP4 |
| Action destructrice | | | CP4 |

Chaque description de preuve est remplacée par le lien du run ou de la PR dès qu'il existe sur GitHub.
