// Boussole — câblage (TP07 à TP10, CP2) : lire le formulaire, mettre à jour l'historique, demander l'affichage.
import { validateMessage, replyTo } from './brain.js';
import { persona } from './persona.js';
import { renderAccueil, renderIdentite, renderMessages } from './view.js';

const formulaire = document.querySelector('#chat-form');
const champ = document.querySelector('#message');
const liste = document.querySelector('#messages');
const statut = document.querySelector('#status');
const effacer = document.querySelector('#effacer');
const versionElt = document.querySelector('#version');
const titre = document.querySelector('#titre');
const accueil = document.querySelector('#accueil');
const suggestions = document.querySelector('#suggestions');

const CLE = 'capweb.historique';
const historique = [];

function sauvegarder() {
  localStorage.setItem(CLE, JSON.stringify(historique));
}

function charger() {
  const brut = localStorage.getItem(CLE);
  if (brut === null) {
    return;
  }
  try {
    const donnees = JSON.parse(brut);
    if (Array.isArray(donnees)) {
      historique.push(...donnees);
    }
  } catch {
    statut.textContent = 'Conversation précédente illisible : nouvelle conversation.';
  }
}

function afficher() {
  renderMessages(historique, liste);
  renderAccueil(accueil, historique.length === 0);
}

formulaire.addEventListener('submit', (event) => {
  event.preventDefault();
  const controle = validateMessage(champ.value);
  if (!controle.ok) {
    statut.textContent = controle.error;
    champ.focus();
    return;
  }
  historique.push({ role: 'user', text: controle.value });
  historique.push({ role: 'assistant', text: replyTo(controle.value) });
  sauvegarder();
  afficher();
  champ.value = '';
  statut.textContent = '';
  champ.focus();
});

effacer.addEventListener('click', () => {
  if (!confirm('Effacer toute la conversation ?')) {
    return;
  }
  historique.length = 0;
  localStorage.removeItem(CLE);
  afficher();
  statut.textContent = 'Conversation effacée.';
});

// Une suggestion remplit le champ sans envoyer : l'utilisateur garde la main.
suggestions.addEventListener('click', (event) => {
  const bouton = event.target.closest('button[data-suggestion]');
  if (!bouton) {
    return;
  }
  champ.value = bouton.dataset.suggestion;
  champ.focus();
});

renderIdentite(persona, { titre, accueil, suggestions });
charger();
afficher();

fetch('/version.json', { headers: { accept: 'application/json' } })
  .then((reponse) => (reponse.ok ? reponse.json() : null))
  .then((donnees) => {
    if (donnees && typeof donnees.version === 'string' && versionElt) {
      versionElt.textContent = `version ${donnees.version}`;
    }
  })
  .catch(() => {});
