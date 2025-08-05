// ✅ src/components/Inscription.jsx - Version modernisée avec glassmorphism et validations avancées
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { FinitioLogo } from '../assets/FinitioAssets';
import ErrorHandler from '../utils/errorHandler';

export default function Inscription() {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    motDePasse: '',
    confirmMotDePasse: '',
    role: 'client',
    telephone: '',
    ville: ''
  });
  
  const [validation, setValidation] = useState({
    nom: { valid: false, message: '' },
    prenom: { valid: false, message: '' },
    email: { valid: false, message: '' },
    motDePasse: { valid: false, message: '', strength: 0 },
    confirmMotDePasse: { valid: false, message: '' },
    telephone: { valid: true, message: '' },
    ville: { valid: true, message: '' }
  });
  
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState('');
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  // Validation en temps réel
  const validateField = (name, value) => {
    let isValid = false;
    let message = '';
    let strength = 0;

    switch (name) {
      case 'nom':
      case 'prenom':
        isValid = value.trim().length >= 2;
        message = isValid ? '' : `Le ${name} doit contenir au moins 2 caractères`;
        break;
        
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailRegex.test(value);
        message = isValid ? '' : 'Adresse email invalide';
        break;
        
      case 'motDePasse':
        strength = calculatePasswordStrength(value);
        isValid = strength >= 3;
        message = getPasswordMessage(strength);
        break;
        
      case 'confirmMotDePasse':
        isValid = value === formData.motDePasse && value.length > 0;
        message = isValid ? '' : 'Les mots de passe ne correspondent pas';
        break;
        
      case 'telephone':
        const phoneRegex = /^(\+212|0)[5-7][0-9]{8}$/;
        isValid = value === '' || phoneRegex.test(value.replace(/\s/g, ''));
        message = isValid ? '' : 'Numéro de téléphone marocain invalide';
        break;
        
      case 'ville':
        isValid = value === '' || value.trim().length >= 2;
        message = isValid ? '' : 'Nom de ville invalide';
        break;
        
      default:
        isValid = true;
    }

    return { valid: isValid, message, strength };
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getPasswordMessage = (strength) => {
    const messages = [
      'Mot de passe très faible',
      'Mot de passe faible',
      'Mot de passe moyen',
      'Mot de passe fort',
      'Mot de passe très fort'
    ];
    return messages[strength] || '';
  };

  const getPasswordColor = (strength) => {
    const colors = [
      'bg-red-500',
      'bg-orange-500',
      'bg-yellow-500',
      'bg-blue-500',
      'bg-green-500'
    ];
    return colors[strength] || 'bg-gray-300';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validation en temps réel
    const fieldValidation = validateField(name, value);
    setValidation(prev => ({
      ...prev,
      [name]: fieldValidation
    }));

    // Revalider la confirmation du mot de passe si le mot de passe change
    if (name === 'motDePasse' && formData.confirmMotDePasse) {
      const confirmValidation = validateField('confirmMotDePasse', formData.confirmMotDePasse);
      setValidation(prev => ({
        ...prev,
        confirmMotDePasse: confirmValidation
      }));
    }
  };

  const isStepValid = (stepNumber) => {
    switch (stepNumber) {
      case 1:
        return validation.nom.valid && validation.prenom.valid && validation.email.valid;
      case 2:
        return validation.motDePasse.valid && validation.confirmMotDePasse.valid;
      case 3:
        return validation.telephone.valid && validation.ville.valid;
      default:
        return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErreur('');

    try {
      // Vérifier si l'email existe déjà
      const { data: existingUser } = await supabase
        .from('users')
        .select('email')
        .eq('email', formData.email)
        .single();

      if (existingUser) {
        setErreur('Cette adresse email est déjà utilisée');
        setLoading(false);
        return;
      }

      // Créer le compte utilisateur
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.motDePasse,
        options: {
          data: {
            nom: formData.nom,
            prenom: formData.prenom,
            role: formData.role,
            telephone: formData.telephone,
            ville: formData.ville
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Créer le profil utilisateur
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: authData.user.id,
              nom: formData.nom,
              prenom: formData.prenom,
              email: formData.email,
              role: formData.role,
              telephone: formData.telephone,
              ville: formData.ville,
              created_at: new Date().toISOString()
            }
          ]);

        if (profileError) throw profileError;

        // Stocker le début de session
        localStorage.setItem('session_start', Date.now().toString());

        // Message de succès et redirection vers l'accueil
        alert('🎉 Inscription réussie ! Bienvenue sur Finitio. Vérifiez votre email pour confirmer votre compte.');
        
        // Redirection vers l'accueil
        navigate('/');
      }
    } catch (error) {
      ErrorHandler.log(error, 'Inscription');
      setErreur(error.message || 'Erreur lors de l\'inscription. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (isStepValid(step)) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const roleOptions = [
    { 
      value: 'client', 
      label: 'Client', 
      description: 'J\'ai des projets de construction',
      icon: '🏠',
      color: 'from-blue-500 to-indigo-600'
    },
    { 
      value: 'architecte', 
      label: 'Architecte', 
      description: 'Je conçois et supervise des projets',
      icon: '🏛️',
      color: 'from-emerald-500 to-teal-600'
    },
    { 
      value: 'prestataire', 
      label: 'Prestataire', 
      description: 'Je réalise des travaux de construction',
      icon: '🔨',
      color: 'from-orange-500 to-red-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Particules flottantes */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Header avec logo */}
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-4">
              <FinitioLogo className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Rejoignez Finitio
            </h2>
            <p className="text-blue-200">
              Créez votre compte en quelques étapes
            </p>
          </div>

          {/* Indicateur de progression */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              {[1, 2, 3].map((stepNumber) => (
                <div
                  key={stepNumber}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                    step >= stepNumber
                      ? 'bg-white text-blue-900'
                      : 'bg-white/20 text-white/60'
                  }`}
                >
                  {stepNumber}
                </div>
              ))}
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 transition-all duration-500 ease-out"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>

          {/* Formulaire avec glassmorphism */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Étape 1: Informations personnelles */}
              {step === 1 && (
                <div className="space-y-4 animate-fadeInUp">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Informations personnelles
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">
                        Prénom *
                      </label>
                      <input
                        type="text"
                        name="prenom"
                        required
                        className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 transition-all duration-300 ${
                          validation.prenom.valid ? 'border-green-400 focus:ring-green-400' : 
                          formData.prenom && !validation.prenom.valid ? 'border-red-400 focus:ring-red-400' :
                          'border-white/30 focus:ring-blue-400'
                        }`}
                        placeholder="Votre prénom"
                        value={formData.prenom}
                        onChange={handleChange}
                      />
                      {formData.prenom && !validation.prenom.valid && (
                        <p className="text-red-300 text-xs mt-1">{validation.prenom.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">
                        Nom *
                      </label>
                      <input
                        type="text"
                        name="nom"
                        required
                        className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 transition-all duration-300 ${
                          validation.nom.valid ? 'border-green-400 focus:ring-green-400' : 
                          formData.nom && !validation.nom.valid ? 'border-red-400 focus:ring-red-400' :
                          'border-white/30 focus:ring-blue-400'
                        }`}
                        placeholder="Votre nom"
                        value={formData.nom}
                        onChange={handleChange}
                      />
                      {formData.nom && !validation.nom.valid && (
                        <p className="text-red-300 text-xs mt-1">{validation.nom.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      Adresse email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 transition-all duration-300 ${
                        validation.email.valid ? 'border-green-400 focus:ring-green-400' : 
                        formData.email && !validation.email.valid ? 'border-red-400 focus:ring-red-400' :
                        'border-white/30 focus:ring-blue-400'
                      }`}
                      placeholder="votre@email.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    {formData.email && !validation.email.valid && (
                      <p className="text-red-300 text-xs mt-1">{validation.email.message}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Étape 2: Mot de passe */}
              {step === 2 && (
                <div className="space-y-4 animate-fadeInUp">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Sécurité du compte
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      Mot de passe *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="motDePasse"
                        required
                        className={`w-full px-4 py-3 pr-12 bg-white/10 border rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 transition-all duration-300 ${
                          validation.motDePasse.valid ? 'border-green-400 focus:ring-green-400' : 
                          formData.motDePasse && !validation.motDePasse.valid ? 'border-red-400 focus:ring-red-400' :
                          'border-white/30 focus:ring-blue-400'
                        }`}
                        placeholder="Mot de passe sécurisé"
                        value={formData.motDePasse}
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? '🙈' : '👁️'}
                      </button>
                    </div>
                    
                    {/* Indicateur de force du mot de passe */}
                    {formData.motDePasse && (
                      <div className="mt-2">
                        <div className="flex space-x-1 mb-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                i < validation.motDePasse.strength 
                                  ? getPasswordColor(validation.motDePasse.strength)
                                  : 'bg-white/20'
                              }`}
                            />
                          ))}
                        </div>
                        <p className={`text-xs ${
                          validation.motDePasse.valid ? 'text-green-300' : 'text-yellow-300'
                        }`}>
                          {validation.motDePasse.message}
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      Confirmer le mot de passe *
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmMotDePasse"
                        required
                        className={`w-full px-4 py-3 pr-12 bg-white/10 border rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 transition-all duration-300 ${
                          validation.confirmMotDePasse.valid ? 'border-green-400 focus:ring-green-400' : 
                          formData.confirmMotDePasse && !validation.confirmMotDePasse.valid ? 'border-red-400 focus:ring-red-400' :
                          'border-white/30 focus:ring-blue-400'
                        }`}
                        placeholder="Confirmez votre mot de passe"
                        value={formData.confirmMotDePasse}
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? '🙈' : '👁️'}
                      </button>
                    </div>
                    {formData.confirmMotDePasse && !validation.confirmMotDePasse.valid && (
                      <p className="text-red-300 text-xs mt-1">{validation.confirmMotDePasse.message}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Étape 3: Rôle et informations complémentaires */}
              {step === 3 && (
                <div className="space-y-6 animate-fadeInUp">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Finalisation du profil
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-4">
                      Quel est votre profil ? *
                    </label>
                    <div className="space-y-3">
                      {roleOptions.map((role) => (
                        <div
                          key={role.value}
                          className={`relative rounded-xl border-2 p-4 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                            formData.role === role.value
                              ? 'border-white bg-white/20 shadow-lg'
                              : 'border-white/30 hover:border-white/50 bg-white/5'
                          }`}
                          onClick={() => setFormData(prev => ({ ...prev, role: role.value }))}
                        >
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${role.color} flex items-center justify-center text-2xl`}>
                              {role.icon}
                            </div>
                            <div className="flex-1">
                              <h4 className="text-white font-medium">{role.label}</h4>
                              <p className="text-white/70 text-sm">{role.description}</p>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${
                              formData.role === role.value
                                ? 'border-white bg-white'
                                : 'border-white/50'
                            }`}>
                              {formData.role === role.value && (
                                <div className="w-full h-full rounded-full bg-blue-600 scale-50" />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">
                        Téléphone (optionnel)
                      </label>
                      <input
                        type="tel"
                        name="telephone"
                        className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 transition-all duration-300 ${
                          validation.telephone.valid ? 'border-white/30 focus:ring-blue-400' : 
                          'border-red-400 focus:ring-red-400'
                        }`}
                        placeholder="+212 6 XX XX XX XX"
                        value={formData.telephone}
                        onChange={handleChange}
                      />
                      {!validation.telephone.valid && (
                        <p className="text-red-300 text-xs mt-1">{validation.telephone.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">
                        Ville (optionnel)
                      </label>
                      <input
                        type="text"
                        name="ville"
                        className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 transition-all duration-300 ${
                          validation.ville.valid ? 'border-white/30 focus:ring-blue-400' : 
                          'border-red-400 focus:ring-red-400'
                        }`}
                        placeholder="Casablanca, Rabat, Marrakech..."
                        value={formData.ville}
                        onChange={handleChange}
                      />
                      {!validation.ville.valid && (
                        <p className="text-red-300 text-xs mt-1">{validation.ville.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Message d'erreur */}
              {erreur && (
                <div className="bg-red-500/20 border border-red-400/50 rounded-lg p-4 animate-shake">
                  <div className="text-red-200 text-sm">{erreur}</div>
                </div>
              )}

              {/* Boutons de navigation */}
              <div className="flex justify-between pt-6">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-300 flex items-center space-x-2"
                  >
                    <span>←</span>
                    <span>Précédent</span>
                  </button>
                )}
                
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!isStepValid(step)}
                    className={`ml-auto px-6 py-3 rounded-lg transition-all duration-300 flex items-center space-x-2 ${
                      isStepValid(step)
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105'
                        : 'bg-gray-500/50 text-gray-300 cursor-not-allowed'
                    }`}
                  >
                    <span>Suivant</span>
                    <span>→</span>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading || !isStepValid(3)}
                    className={`ml-auto px-8 py-3 rounded-lg transition-all duration-300 flex items-center space-x-2 ${
                      loading || !isStepValid(3)
                        ? 'bg-gray-500/50 text-gray-300 cursor-not-allowed'
                        : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 transform hover:scale-105'
                    }`}
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Création...</span>
                      </>
                    ) : (
                      <>
                        <span>🎉</span>
                        <span>Créer mon compte</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>

            {/* Lien vers connexion */}
            <div className="text-center mt-6 pt-6 border-t border-white/20">
              <p className="text-white/70 text-sm">
                Vous avez déjà un compte ?{' '}
                <Link
                  to="/connexion"
                  className="text-blue-300 hover:text-blue-200 font-medium transition-colors duration-200"
                >
                  Connectez-vous
                </Link>
              </p>
            </div>

            {/* Conditions d'utilisation */}
            <div className="text-center mt-4">
              <p className="text-white/50 text-xs">
                En créant un compte, vous acceptez nos{' '}
                <Link 
                  to="/conditions" 
                  className="text-blue-300 hover:text-blue-200 transition-colors duration-200"
                >
                  conditions d'utilisation
                </Link>
                {' '}et notre{' '}
                <Link 
                  to="/confidentialite" 
                  className="text-blue-300 hover:text-blue-200 transition-colors duration-200"
                >
                  politique de confidentialité
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
