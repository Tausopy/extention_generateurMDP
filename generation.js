document.addEventListener("DOMContentLoaded", function() {
    console.log('Génération lancée.');

    // Fonction pour générer un mot de passe aléatoire
    function generatePassword(length, useSpecialChars) {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        const charset_deux = "-_*!/?,:@#$%^&";
        let selectedCharset = charset;

        if (useSpecialChars) {
            selectedCharset += charset_deux;
        }

        let password = "";
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * selectedCharset.length);
            password += selectedCharset.charAt(randomIndex);
        }
        console.log('mot de passe généré.');
        return password;
    }

    // Fonction pour réagir au clic sur le bouton "Générer"
    document.getElementById("generateButton").addEventListener("click", function() {
        const passwordLengthInput = document.getElementById("passwordLengthInput");
        const passwordLength = parseInt(passwordLengthInput.value);

        const specialCharsCheckbox = document.querySelector('input[name="specialChars"]:checked');
        const useSpecialChars = specialCharsCheckbox.value === 'specialChars_choice';

        const generatedPassword = generatePassword(passwordLength, useSpecialChars);
        // Copier le mot de passe dans le presse-papier
        const tempInput = document.createElement("input");
        document.body.appendChild(tempInput);
        tempInput.value = generatedPassword;
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);

        console.log('Mot de passe généré :', generatedPassword);
    });




});
