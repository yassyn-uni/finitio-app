// ✅ src/components/Inscription.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { trackSignup, trackEvent, trackConversion } from '../utils/analytics';

export default function Inscription() {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    motDePasse: '',
    role: 'client'
  });
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // 📊 Tracker les interactions avec les champs
    trackEvent('form_field_change', {
      field: name,
      value: name === 'role' ? value : 'hidden', // Ne pas tracker les données sensibles
      page: 'signup',
      timestamp: new Date().toISOString()
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErreur('');

    // 📊 Tracker la tentative d'inscription
    trackEvent('signup_attempt', {
      role: formData.role,
      email_domain: formData.email.split('@')[1] || 'unknown',
      timestamp: new Date().toISOString()
    });

    try {
      // Créer le compte utilisateur
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.motDePasse,
      });

      if (authError) {
        // 🚨 Tracker l'échec d'inscription
        trackEvent('signup_failed', {
          error_type: authError.message,
          role: formData.role,
          email_domain: formData.email.split('@')[1] || 'unknown',
          timestamp: new Date().toISOString()
        });
        throw authError;
      }

      if (authData.user) {
        // Créer le profil utilisateur
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: authData.user.id,
              nom: formData.nom,
              email: formData.email,
              role: formData.role,
            }
          ]);

        if (profileError) {
          // 🚨 Tracker l'erreur de création de profil
          trackEvent('profile_creation_failed', {
            error_type: profileError.message,
            role: formData.role,
            user_id: authData.user.id,
            timestamp: new Date().toISOString()
          });
          throw profileError;
        }

        // ✅ Tracker l'inscription réussie
        await trackSignup(authData.user.id, {
          email: formData.email,
          role: formData.role,
          nom: formData.nom,
          signup_method: 'email_password',
          user_agent: navigator.userAgent,
          timestamp: new Date().toISOString()
        });

        // 🎯 Tracker la conversion (inscription = conversion)
        await trackConversion(authData.user.id, 'signup', {
          conversion_value: 1,
          role: formData.role,
          source: 'direct',
          timestamp: new Date().toISOString()
        });

        // 📱 Tracker l'événement d'inscription réussie
        trackEvent('signup_success', {
          user_role: formData.role,
          signup_method: 'email_password',
          email_domain: formData.email.split('@')[1] || 'unknown',
          timestamp: new Date().toISOString()
        });

        // Stocker le début de session
        localStorage.setItem('session_start', Date.now().toString());

        // Message de succès et redirection
        alert('Inscription réussie ! Vérifiez votre email pour confirmer votre compte.');
        
        // Redirection vers le dashboard approprié
        const dashboardPath = `/dashboard-${formData.role}`;
        navigate(dashboardPath);
      }
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      setErreur(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔗 Tracker les clics sur les liens
  const handleLinkClick = (linkName, linkPath) => {
    trackEvent('auth_navigation', {
      link_name: linkName,
      link_path: linkPath,
      page: 'signup',
      timestamp: new Date().toISOString()
    });
  };

  // 🎯 Tracker la sélection de rôle
  const handleRoleSelect = (role) => {
    setFormData(prev => ({ ...prev, role }));
    trackEvent('role_selection', {
      selected_role: role,
      page: 'signup',
      timestamp: new Date().toISOString()
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Créer votre compte
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ou{' '}
            <Link
              to="/connexion"
              className="font-medium text-indigo-600 hover:text-indigo-500"
              onClick={() => handleLinkClick('Connexion', '/connexion')}
            >
              connectez-vous à votre compte existant
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
                Nom complet
              </label>
              <input
                id="nom"
                name="nom"
                type="text"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Votre nom complet"
                value={formData.nom}
                onChange={handleChange}
                onFocus={() => trackEvent('form_field_focus', { field: 'nom', page: 'signup' })}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Adresse email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="votre@email.com"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => trackEvent('form_field_focus', { field: 'email', page: 'signup' })}
              />
            </div>

            <div>
              <label htmlFor="motDePasse" className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <input
                id="motDePasse"
                name="motDePasse"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Mot de passe sécurisé"
                value={formData.motDePasse}
                onChange={handleChange}
                onFocus={() => trackEvent('form_field_focus', { field: 'password', page: 'signup' })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Je suis un(e)
              </label>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { value: 'client', label: 'Client', description: 'J\'ai des projets de construction' },
                  { value: 'prestataire', label: 'Prestataire', description: 'Je réalise des travaux' },
                  { value: 'architecte', label: 'Architecte', description: 'Je conçois et supervise' }
                ].map((role) => (
                  <div
                    key={role.value}
                    className={`relative rounded-lg border p-4 cursor-pointer transition-all duration-200 ${
                      formData.role === role.value
                        ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => handleRoleSelect(role.value)}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="role"
                        value={role.value}
                        checked={formData.role === role.value}
                        onChange={handleChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <div className="ml-3">
                        <label className="block text-sm font-medium text-gray-900">
                          {role.label}
                        </label>
                        <p className="text-sm text-gray-500">{role.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {erreur && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{erreur}</div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              onClick={() => trackEvent('signup_button_click', { 
                role: formData.role,
                timestamp: new Date().toISOString() 
              })}
            >
              {loading ? 'Création du compte...' : 'Créer mon compte'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              En créant un compte, vous acceptez nos{' '}
              <Link 
                to="/conditions" 
                className="text-indigo-600 hover:text-indigo-500"
                onClick={() => handleLinkClick('Conditions', '/conditions')}
              >
                conditions d'utilisation
              </Link>
              {' '}et notre{' '}
              <Link 
                to="/confidentialite" 
                className="text-indigo-600 hover:text-indigo-500"
                onClick={() => handleLinkClick('Confidentialité', '/confidentialite')}
              >
                politique de confidentialité
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
