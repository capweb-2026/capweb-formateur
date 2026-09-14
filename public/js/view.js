// Boussole — affichage (TP09, CP2). Aucune règle de réponse ici : uniquement du texte.
import { persona } from './persona.js';

export function renderMessages(messages, container) {
  const lignes = messages.map((msg) => {
    const li = document.createElement('li');
    const etiquette = msg.role === 'user' ? 'Vous' : persona.nom;
    li.textContent = `${etiquette} : ${msg.text}`;
    if (msg.role === 'assistant') {
      li.classList.add('bot');
    }
    return li;
  });
  container.replaceChildren(...lignes);
}

// Identité : titre, message d'accueil et boutons de suggestion, tous remplis avec textContent.
export function renderIdentite(identite, { titre, accueil, suggestions }) {
  titre.textContent = `${identite.emoji} ${identite.nom}`;
  accueil.textContent = identite.accueil;
  const boutons = identite.suggestions.map((question) => {
    const bouton = document.createElement('button');
    bouton.type = 'button';
    bouton.textContent = question;
    bouton.dataset.suggestion = question;
    return bouton;
  });
  suggestions.replaceChildren(...boutons);
}

// L'accueil ne s'affiche que sur une conversation vide.
export function renderAccueil(accueil, conversationVide) {
  accueil.hidden = !conversationVide;
}
