'use strict';

/* =========================================================
 *  RANDOM CRYPTO SANS BIAIS
 * ========================================================= */

/**
 * Génère un entier aléatoire sécurisé dans [0, max-1]
 * sans biais (rejection sampling)
 */
function secureRandomIndex(max) {
  const maxRange = Math.floor((0xFFFFFFFF + 1) / max) * max;
  let rand;
  do {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    rand = array[0];
  } while (rand >= maxRange);
  return rand % max;
}

/* =========================================================
 *  GENERATION DE MOT DE PASSE
 * ========================================================= */

function generatePasswordSecure(length, includeUppercase, includeSpecials) {
  let charset = 'abcdefghijklmnopqrstuvwxyz';
  if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  charset += '0123456789';
  if (includeSpecials) charset += '!@#$%^&*()-_=+[]{}<>?';

  if (!charset.length) {
    throw new Error('Jeu de caractères vide');
  }

  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset[secureRandomIndex(charset.length)];
  }
  return password;
}

/* =========================================================
 *  SHA-1 VIA WEB CRYPTO (HIBP)
 * ========================================================= */

async function sha1Hex(input) {
  const buffer = await crypto.subtle.digest(
    'SHA-1',
    new TextEncoder().encode(input)
  );

  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();
}

/* =========================================================
 *  VERIFICATION HIBP (k-Anonymity)
 * ========================================================= */

async function isPasswordPwned(password) {
  const sha1 = await sha1Hex(password);
  const prefix = sha1.slice(0, 5);
  const suffix = sha1.slice(5);

  const response = await fetch(
    `https://api.pwnedpasswords.com/range/${prefix}`,
    {
      headers: {
        'User-Agent': 'GautierPasswordGenerator/4.0'
      }
    }
  );

  if (!response.ok) {
    throw new Error('Erreur HIBP');
  }

  const body = await response.text();

  return body.split('\n').some(line => {
    const [hashSuffix] = line.trim().split(':');
    return hashSuffix === suffix;
  });
}

/* =========================================================
 *  GENERATION SAFE (ANTI-PWNED)
 * ========================================================= */

async function generateSafePassword(
  length,
  includeUppercase,
  includeSpecials
) {
  const MAX_ATTEMPTS = 10;

  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    const password = generatePasswordSecure(
      length,
      includeUppercase,
      includeSpecials
    );

    const compromised = await isPasswordPwned(password);
    if (!compromised) {
      return password;
    }
  }

  throw new Error('Impossible de générer un mot de passe sain');
}

/* =========================================================
 *  UI / EVENTS
 * ========================================================= */

function updateSliderValue() {
  const slider = document.getElementById('length');
  document.getElementById('sliderValue').textContent = slider.value;
}

document.addEventListener('DOMContentLoaded', () => {
  const slider = document.getElementById('length');
  const generateButton = document.getElementById('generate');
  const resultElement = document.getElementById('result');

  updateSliderValue();
  slider.addEventListener('input', updateSliderValue);

  generateButton.addEventListener('click', async () => {
    const length = parseInt(slider.value, 10);
    const includeUppercase = document.getElementById('includeUppercase').checked;
    const includeSpecials = document.getElementById('includeSpecials').checked;

    resultElement.textContent = 'Analyse sécurité…';

    try {
      const password = await generateSafePassword(
        length,
        includeUppercase,
        includeSpecials
      );

      resultElement.textContent = password;
      await navigator.clipboard.writeText(password);

    } catch (err) {
      resultElement.textContent = err.message;
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Enter') generateButton.click();
  });
});
