// 🔍 Utilitaire de validation des données
class DataValidator {
  
  // Validation email
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validation mot de passe
  static isValidPassword(password) {
    return password && password.length >= 6;
  }

  // Validation téléphone français/marocain
  static isValidPhone(phone) {
    const phoneRegex = /^(?:\+33|0)[1-9](?:[0-9]{8})$|^(?:\+212|0)[5-7](?:[0-9]{8})$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }

  // Validation nom/prénom
  static isValidName(name) {
    return name && name.trim().length >= 2 && /^[a-zA-ZÀ-ÿ\s-']+$/.test(name);
  }

  // Validation budget
  static isValidBudget(budget) {
    const num = parseFloat(budget);
    return !isNaN(num) && num > 0;
  }

  // Validation date
  static isValidDate(date) {
    const dateObj = new Date(date);
    return dateObj instanceof Date && !isNaN(dateObj) && dateObj > new Date();
  }

  // Validation formulaire inscription
  static validateSignupForm(formData) {
    const errors = {};

    if (!this.isValidEmail(formData.email)) {
      errors.email = 'Adresse email invalide';
    }

    if (!this.isValidPassword(formData.password)) {
      errors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    if (!this.isValidName(formData.prenom)) {
      errors.prenom = 'Prénom invalide (minimum 2 caractères, lettres uniquement)';
    }

    if (!this.isValidName(formData.nom)) {
      errors.nom = 'Nom invalide (minimum 2 caractères, lettres uniquement)';
    }

    if (formData.telephone && !this.isValidPhone(formData.telephone)) {
      errors.telephone = 'Numéro de téléphone invalide';
    }

    if (!['client', 'prestataire', 'architecte'].includes(formData.role)) {
      errors.role = 'Veuillez sélectionner un rôle valide';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  // Validation formulaire connexion
  static validateLoginForm(formData) {
    const errors = {};

    if (!this.isValidEmail(formData.email)) {
      errors.email = 'Adresse email invalide';
    }

    if (!formData.password) {
      errors.password = 'Mot de passe requis';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  // Validation projet
  static validateProject(projectData) {
    const errors = {};

    if (!projectData.titre || projectData.titre.trim().length < 5) {
      errors.titre = 'Le titre doit contenir au moins 5 caractères';
    }

    if (!projectData.description || projectData.description.trim().length < 20) {
      errors.description = 'La description doit contenir au moins 20 caractères';
    }

    if (!this.isValidBudget(projectData.budget)) {
      errors.budget = 'Budget invalide';
    }

    if (!this.isValidDate(projectData.date_debut)) {
      errors.date_debut = 'Date de début invalide';
    }

    if (!projectData.localisation || projectData.localisation.trim().length < 3) {
      errors.localisation = 'Localisation requise (minimum 3 caractères)';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  // Sanitize input (protection XSS basique)
  static sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  // Validation générique
  static validate(value, rules) {
    const errors = [];

    if (rules.required && (!value || value.toString().trim() === '')) {
      errors.push('Ce champ est requis');
    }

    if (rules.minLength && value && value.length < rules.minLength) {
      errors.push(`Minimum ${rules.minLength} caractères requis`);
    }

    if (rules.maxLength && value && value.length > rules.maxLength) {
      errors.push(`Maximum ${rules.maxLength} caractères autorisés`);
    }

    if (rules.pattern && value && !rules.pattern.test(value)) {
      errors.push(rules.patternMessage || 'Format invalide');
    }

    return errors;
  }
}

export default DataValidator;
