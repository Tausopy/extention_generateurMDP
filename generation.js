'use strict';
    
/**
 * Génère un entier aléatoire dans l'intervalle [0, max-1] sans introduire de biais
 * grâce au rejection sampling.
 *
 * @param {number} max - La borne supérieure exclusive.
 * @return {number} Un entier aléatoire dans [0, max-1].
 */
function secureRandomIndex(max) {
  const maxRange = Math.floor((0xFFFFFFFF + 1) / max) * max;
  let rand;
  do {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    rand = array[0];
  } while (rand >= maxRange);
  return rand % max;
}

/**
 * Génère un mot de passe sécurisé en construisant dynamiquement le jeu
 * de caractères en fonction des options choisies.
 *
 * @param {number} length - La longueur du mot de passe à générer.
 * @param {boolean} includeUppercase - Vrai pour inclure les majuscules.
 * @param {boolean} includeSpecials - Vrai pour inclure les caractères spéciaux.
 * @return {string} Le mot de passe généré.
 */
function generatePasswordSecure(length, includeUppercase, includeSpecials) {
  let charset = "abcdefghijklmnopqrstuvwxyz";
  charset += includeUppercase ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ" : "";
  charset += "0123456789";
  charset += includeSpecials ? "!@#$%^&*()" : "";
  
  if (charset.length === 0) {
    throw new Error("Le jeu de caractères est vide.");
  }
  
  let password = "";
  for (let i = 0; i < length; i++) {
    const index = secureRandomIndex(charset.length);
    password += charset[index];
  }
  return password;
}

// Met à jour l'affichage de la valeur du slider
function updateSliderValue() {
  const slider = document.getElementById('length');
  const display = document.getElementById('sliderValue');
  display.textContent = slider.value;
}

document.addEventListener('DOMContentLoaded', function () {
  const slider = document.getElementById('length');
  const generateButton = document.getElementById('generate');
  const resultElement = document.getElementById('result');
  
  // Affichage initial de la valeur du slider
  updateSliderValue();
  
  // Mise à jour en temps réel lors du déplacement du slider
  slider.addEventListener('input', updateSliderValue);
  
  // Gestion des flèches gauche et droite sur le slider pour ajuster la valeur de ±1
  slider.addEventListener('keydown', function(event) {
    let value = parseInt(slider.value, 10);
    const min = parseInt(slider.min, 10);
    const max = parseInt(slider.max, 10);
    if (event.key === "ArrowLeft") {
      if (value > min) {
        slider.value = value - 1;
        updateSliderValue();
      }
      event.preventDefault();
    } else if (event.key === "ArrowRight") {
      if (value < max) {
        slider.value = value + 1;
        updateSliderValue();
      }
      event.preventDefault();
    }
  });
  
  // Déclenche la génération en appuyant sur la touche "Entrée"
  document.addEventListener('keydown', function(event) {
    if (event.key === "Enter") {
      generateButton.click();
      event.preventDefault();
    }
  });
  
  // Au clic sur "Générer", on récupère les options et on affiche le mot de passe généré
  generateButton.addEventListener('click', function () {
    const length = parseInt(slider.value, 10);
    const includeUppercase = document.getElementById('includeUppercase').checked;
    const includeSpecials = document.getElementById('includeSpecials').checked;
  
    try {
      const password = generatePasswordSecure(length, includeUppercase, includeSpecials);
      resultElement.textContent = password;
  
      // Copier le mot de passe dans le presse-papier en utilisant l'API moderne
      navigator.clipboard.writeText(password)
        .then(() => {
          console.log('Mot de passe copié dans le presse-papier');
        })
        .catch(err => {
          console.error('Erreur lors de la copie dans le presse-papier :', err);
        });
  
    } catch (error) {
      resultElement.textContent = error.message;
    }
  });
});