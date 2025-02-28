// Base de données simulée (dans la pratique, utilisez un backend réel)
// Les mots de passe sont stockés avec un hachage simulé pour l'exemple
let users = [
    { id: 1, username: 'admin', email: 'admin@example.com', password: 'bcrypt$admin123' },
    { id: 2, username: 'user', email: 'user@example.com', password: 'bcrypt$user123' }
];

// Référence aux éléments du DOM
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const dashboard = document.getElementById('dashboard');
const errorMessage = document.getElementById('error-message');
const regErrorMessage = document.getElementById('reg-error-message');
const userName = document.getElementById('user-name');

// Boutons
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const logoutBtn = document.getElementById('logout-btn');
const registerLink = document.getElementById('register-link');
const loginLink = document.getElementById('login-link');

// Champs de saisie
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const regUsernameInput = document.getElementById('reg-username');
const regEmailInput = document.getElementById('reg-email');
const regPasswordInput = document.getElementById('reg-password');
const regConfirmPasswordInput = document.getElementById('reg-confirm-password');

// Fonction de hachage simulée (en production, utilisez bcrypt ou similaire)
function hashPassword(password) {
    // Ceci est une simulation - NE PAS UTILISER en production!
    return 'bcrypt$' + password;
}

// Fonction de vérification de mot de passe simulée
function verifyPassword(plainPassword, hashedPassword) {
    // Ceci est une simulation - NE PAS UTILISER en production!
    return hashedPassword === 'bcrypt$' + plainPassword;
}

// Gestion de la connexion
loginBtn.addEventListener('click', function() {
    const username = usernameInput.value;
    const password = passwordInput.value;

    // Validation des champs
    if (!username || !password) {
        showError(errorMessage, 'Veuillez remplir tous les champs');
        return;
    }

    // Recherche de l'utilisateur
    const user = users.find(u => u.username === username);
    
    // Vérification des identifiants
    if (!user || !verifyPassword(password, user.password)) {
        showError(errorMessage, 'Nom d\'utilisateur ou mot de passe incorrect');
        return;
    }

    // Connexion réussie
    login(user);
});

// Gestion de l'inscription
registerBtn.addEventListener('click', function() {
    const username = regUsernameInput.value;
    const email = regEmailInput.value;
    const password = regPasswordInput.value;
    const confirmPassword = regConfirmPasswordInput.value;

    // Validation des champs
    if (!username || !email || !password || !confirmPassword) {
        showError(regErrorMessage, 'Veuillez remplir tous les champs');
        return;
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError(regErrorMessage, 'Veuillez entrer un email valide');
        return;
    }

    // Vérification de la correspondance des mots de passe
    if (password !== confirmPassword) {
        showError(regErrorMessage, 'Les mots de passe ne correspondent pas');
        return;
    }

    // Vérification de la longueur du mot de passe
    if (password.length < 6) {
        showError(regErrorMessage, 'Le mot de passe doit contenir au moins 6 caractères');
        return;
    }

    // Vérification si l'utilisateur existe déjà
    if (users.some(u => u.username === username)) {
        showError(regErrorMessage, 'Ce nom d\'utilisateur est déjà pris');
        return;
    }

    if (users.some(u => u.email === email)) {
        showError(regErrorMessage, 'Cet email est déjà utilisé');
        return;
    }

    // Création du nouvel utilisateur
    const newUser = {
        id: users.length + 1,
        username,
        email,
        password: hashPassword(password)
    };

    // Ajout à notre "base de données"
    users.push(newUser);

    // Connexion automatique après inscription
    login(newUser);
});

// Déconnexion
logoutBtn.addEventListener('click', function() {
    logout();
});

// Navigation entre les formulaires
registerLink.addEventListener('click', function(e) {
    e.preventDefault();
    showRegisterForm();
});

loginLink.addEventListener('click', function(e) {
    e.preventDefault();
    showLoginForm();
});

// Fonction pour afficher les erreurs
function showError(element, message) {
    element.textContent = message;
    element.style.visibility = 'visible';
    
    // Masquer le message après 3 secondes
    setTimeout(() => {
        element.style.visibility = 'hidden';
    }, 3000);
}

// Fonction de connexion
function login(user) {
    // Stockage de la session
    sessionStorage.setItem('currentUser', JSON.stringify({
        id: user.id,
        username: user.username,
        email: user.email
    }));

    // Mise à jour de l'interface
    userName.textContent = user.username;
    
    // Masquer les formulaires et afficher le tableau de bord
    loginForm.style.display = 'none';
    registerForm.style.display = 'none';
    dashboard.style.display = 'block';
    
    // Réinitialiser les formulaires
    usernameInput.value = '';
    passwordInput.value = '';
    regUsernameInput.value = '';
    regEmailInput.value = '';
    regPasswordInput.value = '';
    regConfirmPasswordInput.value = '';
}

// Fonction de déconnexion
function logout() {
    // Supprimer la session
    sessionStorage.removeItem('currentUser');
    
    // Retour à l'écran de connexion
    dashboard.style.display = 'none';
    loginForm.style.display = 'block';
}

// Afficher le formulaire d'inscription
function showRegisterForm() {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
    dashboard.style.display = 'none';
    errorMessage.style.visibility = 'hidden';
    regErrorMessage.style.visibility = 'hidden';
}

// Afficher le formulaire de connexion
function showLoginForm() {
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    dashboard.style.display = 'none';
    errorMessage.style.visibility = 'hidden';
    regErrorMessage.style.visibility = 'hidden';
}

// Vérifier si un utilisateur est déjà connecté au chargement de la page
window.addEventListener('load', function() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (currentUser) {
        userName.textContent = currentUser.username;
        loginForm.style.display = 'none';
        registerForm.style.display = 'none';
        dashboard.style.display = 'block';
    }
});