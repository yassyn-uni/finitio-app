import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { trackEvent, trackLogin } from '../utils/analytics';
import ErrorHandler from '../utils/errorHandler';

export default function Connexion() {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErreur('');

    // 📊 Tracker la tentative de connexion
    trackEvent('login_attempt', {
      email_domain: email.split('@')[1] || 'unknown',
      timestamp: new Date().toISOString()
    });

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: motDePasse,
      });

      if (error) {
        // 🚨 Tracker l'échec de connexion
        trackEvent('login_failed', {
          error_type: error.message,
          email_domain: email.split('@')[1] || 'unknown',
          timestamp: new Date().toISOString()
        });
        throw error;
      }

      if (data.user) {
        // 🎯 Récupérer le profil utilisateur pour le tracking
        const { data: userProfile } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        // ✅ Tracker la connexion réussie
        await trackLogin(data.user.id, {
          email: data.user.email,
          role: userProfile?.role || 'unknown',
          nom: userProfile?.nom || 'Unknown User',
          login_method: 'email_password',
          user_agent: navigator.userAgent,
          timestamp: new Date().toISOString()
        });

        // 📱 Tracker l'événement de connexion réussie
        trackEvent('login_success', {
          user_role: userProfile?.role || 'unknown',
          login_method: 'email_password',
          email_domain: email.split('@')[1] || 'unknown',
          timestamp: new Date().toISOString()
        });

        // Stocker le début de session pour calculer la durée
        localStorage.setItem('session_start', Date.now().toString());

        // Redirection selon le rôle
        const dashboardPath = userProfile?.role ? `/dashboard-${userProfile.role}` : '/dashboard';
        navigate(dashboardPath);
      }
    } catch (error) {
      ErrorHandler.log(error, 'Connexion');
      ErrorHandler.showUserError('Erreur de connexion. Vérifiez vos identifiants.');
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
      page: 'login',
      timestamp: new Date().toISOString()
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6] px-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#1e3a8a]">Se connecter</h2>

        {erreur && (
          <div className="text-red-600 font-semibold mb-4 flex items-center">
            ❌ <span className="ml-2">{erreur}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
              required
              onFocus={() => trackEvent('form_field_focus', { field: 'email', page: 'login' })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Mot de passe</label>
            <input
              type="password"
              name="motDePasse"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
              required
              onFocus={() => trackEvent('form_field_focus', { field: 'password', page: 'login' })}
            />
            <div className="mt-2 text-right">
              <Link 
                to="/reset-password" 
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                onClick={() => handleLinkClick('Mot de passe oublié', '/reset-password')}
              >
                Mot de passe oublié ?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#10b981] text-white py-2 rounded-lg hover:bg-[#059669] transition duration-300"
            onClick={() => trackEvent('login_button_click', { timestamp: new Date().toISOString() })}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}
