console.log('Génération lancée.');

//Fonction pour générer un mot de passe aléatoire
function generatePassword(length) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_*!/?,:";
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset.charAt(randomIndex);
    }
    console.log('mot de passe généré.');
    return password;
}

// Fonction pour réagir au clic sur le bouton "Générer"
document.getElementById("generateButton").addEventListener("click", function() {
    const passwordLength = 18; // Longueur du mot de passe à générer
    const generatedPassword = generatePassword(passwordLength);

    // Copier le mot de passe dans le presse-papier
    const tempInput = document.createElement("input");
    document.body.appendChild(tempInput);
    tempInput.value = generatedPassword;
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);

    console.log('Mot de passe copié.');
});

