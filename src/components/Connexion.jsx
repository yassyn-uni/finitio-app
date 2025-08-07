import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import ErrorHandler from '../utils/errorHandler';

export default function Connexion() {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState('');
  const navigate = useNavigate();

  // Charger les données sauvegardées au montage
  useEffect(() => {
    const savedEmail = localStorage.getItem('finitio_saved_email');
    const savedRemember = localStorage.getItem('finitio_remember_me') === 'true';
    
    if (savedEmail && savedRemember) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErreur('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: motDePasse,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        // Gérer "Se souvenir de moi"
        if (rememberMe) {
          localStorage.setItem('finitio_saved_email', email);
          localStorage.setItem('finitio_remember_me', 'true');
        } else {
          localStorage.removeItem('finitio_saved_email');
          localStorage.removeItem('finitio_remember_me');
        }

        // Stocker le début de session pour calculer la durée
        localStorage.setItem('session_start', Date.now().toString());

        // Récupérer le profil utilisateur pour déterminer le rôle
        const { data: profile } = await supabase
          .from('users')
          .select('role')
          .eq('id', data.user.id)
          .single();

        // Stocker le rôle pour affichage du bouton Dashboard approprié
        if (profile?.role) {
          localStorage.setItem('user_role', profile.role);
          
          // Redirection directe vers le dashboard spécifique selon le rôle
          switch (profile.role.toLowerCase()) {
            case 'client':
              navigate('/dashboard-client');
              break;
            case 'architecte':
              navigate('/dashboard-architecte');
              break;
            case 'prestataire':
              navigate('/dashboard-prestataire');
              break;
            case 'fournisseur':
              navigate('/dashboard-fournisseur');
              break;
            default:
              navigate('/dashboard');
              break;
          }
        } else {
          // Si pas de rôle défini, rediriger vers le dashboard général
          navigate('/dashboard');
        }
      }
    } catch (error) {
      ErrorHandler.log(error, 'Connexion');
      ErrorHandler.showUserError('Erreur de connexion. Vérifiez vos identifiants.');
      setErreur(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setResetLoading(true);
    setResetMessage('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }

      setResetMessage('✅ Email de récupération envoyé ! Vérifiez votre boîte mail.');
      setTimeout(() => {
        setShowForgotPassword(false);
        setResetMessage('');
        setResetEmail('');
      }, 3000);
    } catch (error) {
      setResetMessage(`❌ Erreur : ${error.message}`);
    } finally {
      setResetLoading(false);
    }
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6] px-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-[#1e3a8a]">Mot de passe oublié</h2>
            <p className="text-gray-600 mt-2">Entrez votre email pour recevoir un lien de récupération</p>
          </div>

          {resetMessage && (
            <div className={`font-semibold mb-4 flex items-center p-3 rounded-lg ${
              resetMessage.includes('✅') 
                ? 'text-green-700 bg-green-50 border border-green-200' 
                : 'text-red-700 bg-red-50 border border-red-200'
            }`}>
              <span>{resetMessage}</span>
            </div>
          )}

          <form onSubmit={handleForgotPassword} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse email
              </label>
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent transition-all"
                placeholder="votre@email.com"
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Retour
              </button>
              <button
                type="submit"
                disabled={resetLoading}
                className="flex-1 bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] text-white py-3 px-4 rounded-lg hover:from-[#1e40af] hover:to-[#2563eb] transition-all disabled:opacity-50"
              >
                {resetLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Envoi...
                  </div>
                ) : (
                  'Envoyer le lien'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6] px-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-[#1e3a8a]">Se connecter</h2>
          <p className="text-gray-600 mt-2">Accédez à votre espace Finitio</p>
        </div>

        {erreur && (
          <div className="text-red-600 font-semibold mb-4 flex items-center p-3 rounded-lg bg-red-50 border border-red-200">
            ❌ <span className="ml-2">{erreur}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adresse email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent transition-all"
              placeholder="votre@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent transition-all"
                placeholder="Votre mot de passe"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-gray-300 text-[#1e3a8a] focus:ring-[#1e3a8a] mr-2"
              />
              <span className="text-sm text-gray-600">Se souvenir de moi</span>
            </label>
            
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-sm text-[#1e3a8a] hover:text-[#1e40af] font-medium transition-colors"
            >
              Mot de passe oublié ?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] text-white py-3 px-4 rounded-lg hover:from-[#1e40af] hover:to-[#2563eb] transition-all disabled:opacity-50 font-medium"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Connexion...
              </div>
            ) : (
              'Se connecter'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Pas encore de compte ?{' '}
            <Link to="/inscription" className="text-[#1e3a8a] hover:text-[#1e40af] font-medium transition-colors">
              S'inscrire gratuitement
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
