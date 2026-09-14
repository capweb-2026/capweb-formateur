import { test, expect } from '@playwright/test';
import { persona } from '../public/js/persona.js';
/* global localStorage -- callbacks exécutés dans la page */

// Critères 1 à 5 de SPEC.md, vérifiés dans le navigateur.
async function pageNeuve(page) {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
}

async function envoyer(page, texte) {
  await page.locator('#message').fill(texte);
  await page.getByRole('button', { name: /envoyer/i }).click();
}

test.describe('Identité de l’assistant', () => {
  test('le titre affiche l’emoji et le nom (critères 1 et 2)', async ({ page }) => {
    await pageNeuve(page);
    const titre = page.getByRole('heading', { level: 1 });
    await expect(titre).toContainText(persona.nom);
    await expect(titre).toContainText(persona.emoji);
  });

  test('l’accueil s’affiche sur une conversation vide, hors de la liste, et revient après effacement (critère 3)', async ({ page }) => {
    await pageNeuve(page);
    const accueil = page.locator('#accueil');
    await expect(accueil).toBeVisible();
    await expect(accueil).toContainText(persona.nom);
    await expect(page.locator('#messages #accueil')).toHaveCount(0);
    await envoyer(page, 'salut');
    await expect(accueil).toBeHidden();
    page.once('dialog', (d) => d.accept());
    await page.locator('#effacer').click();
    await expect(accueil).toBeVisible();
  });

  test('trois suggestions ; un clic remplit le champ sans envoyer (critère 4)', async ({ page }) => {
    await pageNeuve(page);
    const boutons = page.locator('#suggestions button');
    await expect(boutons).toHaveCount(3);
    await boutons.nth(1).click();
    await expect(page.locator('#message')).toHaveValue(persona.suggestions[1]);
    await expect(page.locator('#messages li')).toHaveCount(0);
  });

  test('les réponses sont signées du nom de l’assistant (critère 5)', async ({ page }) => {
    await pageNeuve(page);
    await envoyer(page, 'aide');
    await expect(page.locator('#messages li').nth(1)).toContainText(`${persona.nom} :`);
  });
});
