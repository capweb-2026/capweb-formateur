// Boussole — identité de l'assistant (CP2). Données et règles de validation, sans accès à la page.

export const persona = {
  nom: 'Boussole',
  emoji: '🧭',
  accueil: 'Bonjour, je suis Boussole : je vous oriente dans la formation Renforcement web.',
  suggestions: [
    'Quel est le programme de mardi ?',
    'C’est quoi, un harnais ?',
    'Comment se passe la soutenance ?'
  ]
};

const segmenteur = new Intl.Segmenter('fr', { granularity: 'grapheme' });

// Un emoji peut compter plusieurs points de code (🛡️) : on compte les caractères visibles.
function estUnSeulEmoji(texte) {
  return [...segmenteur.segment(texte)].length === 1 && /\p{Extended_Pictographic}/u.test(texte);
}

export function validatePersona(p) {
  const erreurs = [];
  const nom = typeof p?.nom === 'string' ? p.nom.trim() : '';
  if (nom.length < 2 || nom.length > 20) {
    erreurs.push('Le nom doit faire entre 2 et 20 caractères.');
  }
  if (typeof p?.emoji !== 'string' || !estUnSeulEmoji(p.emoji)) {
    erreurs.push('L’emoji doit être un seul emoji.');
  }
  if (typeof p?.accueil !== 'string' || nom === '' || !p.accueil.includes(nom)) {
    erreurs.push('Le message d’accueil doit contenir le nom.');
  }
  const suggestions = Array.isArray(p?.suggestions) ? p.suggestions : [];
  if (suggestions.length !== 3 || suggestions.some((s) => typeof s !== 'string' || s.trim() === '')) {
    erreurs.push('Il faut exactement trois questions suggérées, non vides.');
  }
  return erreurs.length === 0 ? { ok: true } : { ok: false, erreurs };
}
