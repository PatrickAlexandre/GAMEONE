// Attendre que le document soit complètement chargé avant d'exécuter le code
document.addEventListener('DOMContentLoaded', () => {
    initializeModalControls(); // Initialiser les contrôles du modal
    initializePostStatusButton(); // Initialiser le bouton de publication de statut
    loadFormDataFromCookie(); // Charger les données du formulaire à partir du cookie
    addFormChangeListeners(); // Ajouter des écouteurs d'événements aux éléments du formulaire
});

// Fonction pour initialiser les contrôles du modal
function initializeModalControls() {
    const openModalBtn = document.getElementById('openModalBtn'); // Bouton pour ouvrir le modal
    const metabolismModal = document.getElementById('metabolismModal'); // Le modal lui-même
    const closeModalElems = document.querySelectorAll('.close-modal'); // Éléments pour fermer le modal

    // Ajouter un écouteur d'événement pour ouvrir le modal
    openModalBtn.addEventListener('click', () => metabolismModal.classList.remove('hidden'));

    // Ajouter des écouteurs d'événements pour fermer le modal
    closeModalElems.forEach(elem => elem.addEventListener('click', () => metabolismModal.classList.add('hidden')));
}

// Fonction pour initialiser le bouton de publication de statut
function initializePostStatusButton() {
    const postStatusBtn = document.getElementById('postStatusBtn'); // Bouton de publication de statut

    // Ajouter un écouteur d'événement pour publier le statut
    postStatusBtn.addEventListener('click', () => {
        const status = document.querySelector('p[contenteditable="true"]').innerText; // Récupérer le texte du statut
        alert(`Status Posted: ${status}`); // Afficher une alerte avec le statut publié
    });
}

// Fonction pour calculer l'âge à partir de la date de naissance
function calculateAge(dob) {
    const birthDate = new Date(dob); // Convertir la date de naissance en objet Date
    const today = new Date(); // Obtenir la date actuelle
    let age = today.getFullYear() - birthDate.getFullYear(); // Calculer l'âge en années
    const monthDiff = today.getMonth() - birthDate.getMonth(); // Différence de mois entre aujourd'hui et la date de naissance

    // Ajuster l'âge si l'anniversaire n'a pas encore eu lieu cette année
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age; // Retourner l'âge calculé
}

// Fonction pour calculer les points hauts faits en fonction de l'âge et du niveau d'activité
function calculatePointsHautsFaits(age, activityLevel) {
    return Math.floor(age * activityLevel); // Calculer et retourner les points hauts faits
}

// Fonction pour calculer le pourcentage de vie restante en fonction de l'âge et de l'espérance de vie
function calculateRemainingLifePercentage(age, lifeExpectancy) {
    const remainingLifePercentage = ((lifeExpectancy - age) / lifeExpectancy) * 100; // Calculer le pourcentage de vie restante
    return remainingLifePercentage.toFixed(2); // Retourner le pourcentage arrondi à deux décimales
}

// Fonction pour mettre à jour la barre de progression de l'âge
function updateAgeProgressBar(age, chromosome) {
    const lifeExpectancy = (chromosome === 'XY') ? 76 : 81; // Déterminer l'espérance de vie en fonction du chromosome
    const agePercentage = ((age / lifeExpectancy) * 100).toFixed(2); // Calculer le pourcentage d'âge atteint
    const ageProgressBarContainer = document.getElementById('ageProgressBarContainer'); // Conteneur de la barre de progression

    // Mettre à jour le contenu HTML de la barre de progression
    ageProgressBarContainer.innerHTML = `
    <div class="rounded bg-green-500 relative overflow-hidden">
        <div class="bg-green-700 text-black text-lg px-2 rounded" style="width: ${agePercentage}%; max-width: 100%; white-space: nowrap;">
            (${agePercentage}%) ${age} / ${lifeExpectancy}
        </div>
    </div>
    `;
}

// Fonction pour sauvegarder les données du formulaire dans un cookie
function saveFormDataToCookie() {
    const formData = {
        prenom: document.getElementById('prenom').value, // Récupérer la valeur du prénom
        nom: document.getElementById('nom').value, // Récupérer la valeur du nom
        contact: document.getElementById('contact').value, // Récupérer la valeur du contact
        dob: document.getElementById('dob').value, // Récupérer la date de naissance
        chromosome: document.getElementById('chromosome').value, // Récupérer le chromosome
        mbti: document.getElementById('mbti-select').value, // Récupérer la valeur MBTI
        height: document.getElementById('height').value, // Récupérer la taille
        weight: document.getElementById('weight').value, // Récupérer le poids
        activity: parseFloat(document.getElementById('activity-level').value) // Récupérer et convertir le niveau d'activité
    };
    document.cookie = `formData=${JSON.stringify(formData)}; path=/`; // Sauvegarder les données du formulaire dans un cookie
    displayFormData(formData); // Afficher les données du formulaire
}

// Fonction pour ajouter des écouteurs de changement aux éléments du formulaire
function addFormChangeListeners() {
    const formElements = document.querySelectorAll('#mb-form input, #mb-form select'); // Sélectionner tous les éléments du formulaire
    formElements.forEach(element => element.addEventListener('change', saveFormDataToCookie)); // Ajouter un écouteur d'événement de changement
}

// Fonction pour récupérer les données du formulaire à partir du cookie
function getFormDataFromCookie() {
    const cookies = document.cookie.split('; '); // Diviser les cookies en tableau
    const formDataCookie = cookies.find(cookie => cookie.startsWith('formData=')); // Trouver le cookie contenant les données du formulaire
    return formDataCookie ? JSON.parse(formDataCookie.split('=')[1]) : null; // Retourner les données du formulaire ou null
}

// Fonction pour afficher les données du formulaire
function displayFormData(formData) {
    const age = calculateAge(formData.dob); // Calculer l'âge
    const pointsHautsFaits = calculatePointsHautsFaits(age, formData.activity); // Calculer les points hauts faits

    // Mettre à jour les éléments du DOM avec les données du formulaire
    document.getElementById('prenomResult').innerText = formData.prenom;
    document.getElementById('nomResult').innerText = formData.nom;
    document.getElementById('contactResult').innerText = `📞 ${formData.contact}`;
    document.getElementById('dobResult').innerText = `🎂 ${formData.dob}`;
    document.getElementById('chromosomeResult').innerText = `${formData.chromosome === 'XX' ? '👩' : '👨'}`;
    document.getElementById('mbtiResult').innerText = `🧠 ${formData.mbti}`;
    document.getElementById('heightResult').innerText = `📏 ${formData.height} cm`;
    document.getElementById('weightResult').innerText = `⚖️ ${formData.weight} kg`;
    document.getElementById('activityResult').innerText = `${formData.activity}`;
    document.getElementById('points-hauts-faits').innerHTML = `${pointsHautsFaits}`;
    document.getElementById('age').innerText = age;

    updateAgeProgressBar(age, formData.chromosome); // Mettre à jour la barre de progression de l'âge
}

// Fonction pour charger les données du formulaire à partir du cookie
function loadFormDataFromCookie() {
    const formData = getFormDataFromCookie(); // Récupérer les données du formulaire à partir du cookie
    if (formData) displayFormData(formData); // Afficher les données du formulaire si elles existent
}
