import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { persona, validatePersona } from '../public/js/persona.js';

// Critères 1 à 4 de SPEC.md : l'identité de l'assistant respecte ses règles.
const valide = { nom: 'Boussole', emoji: '🧭', accueil: 'Bonjour, je suis Boussole.', suggestions: ['Un ?', 'Deux ?', 'Trois ?'] };

describe('Identité — validatePersona', () => {
  it('accepte l’identité de l’assistant', () => {
    assert.deepEqual(validatePersona(persona), { ok: true });
  });

  it('refuse un nom de 1 ou de 21 caractères (critère 1)', () => {
    for (const nom of ['B', 'B'.repeat(21)]) {
      assert.equal(validatePersona({ ...valide, nom, accueil: `Bonjour, je suis ${nom}.` }).ok, false, nom);
    }
  });

  it('accepte un nom de 2 et de 20 caractères (critère 1)', () => {
    for (const nom of ['Bo', 'B'.repeat(20)]) {
      assert.deepEqual(validatePersona({ ...valide, nom, accueil: `Bonjour, je suis ${nom}.` }), { ok: true }, nom);
    }
  });

  it('refuse deux emojis, du texte ou une chaîne vide (critère 2)', () => {
    for (const emoji of ['🧭🧭', 'ab', '']) {
      assert.equal(validatePersona({ ...valide, emoji }).ok, false, emoji);
    }
  });

  it('accepte un emoji fait de plusieurs points de code mais d’un seul caractère visible (critère 2)', () => {
    assert.deepEqual(validatePersona({ ...valide, emoji: '🛡️' }), { ok: true });
  });

  it('refuse un accueil qui ne contient pas le nom (critère 3)', () => {
    assert.equal(validatePersona({ ...valide, accueil: 'Bonjour à vous.' }).ok, false);
  });

  it('refuse deux suggestions ou une suggestion vide (critère 4)', () => {
    assert.equal(validatePersona({ ...valide, suggestions: ['Un ?', 'Deux ?'] }).ok, false);
    assert.equal(validatePersona({ ...valide, suggestions: ['Un ?', '  ', 'Trois ?'] }).ok, false);
  });

  it('explique chaque refus par un message', () => {
    const r = validatePersona({ nom: 'B', emoji: '', accueil: '', suggestions: [] });
    assert.equal(r.ok, false);
    assert.equal(r.erreurs.length, 4);
    for (const erreur of r.erreurs) {
      assert.equal(typeof erreur, 'string');
    }
  });
});
