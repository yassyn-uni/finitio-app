import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
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

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: motDePasse,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        // Stocker le début de session pour calculer la durée
        localStorage.setItem('session_start', Date.now().toString());

        // Récupérer le profil utilisateur pour déterminer le rôle
        const { data: profile } = await supabase
          .from('users')
          .select('role')
          .eq('id', data.user.id)
          .single();

        // Redirection selon le rôle
        let dashboardPath = '/dashboard'; // Fallback par défaut
        
        if (profile?.role) {
          switch (profile.role.toLowerCase()) {
            case 'client':
              dashboardPath = '/dashboard-client';
              break;
            case 'architecte':
              dashboardPath = '/dashboard-architecte';
              break;
            case 'prestataire':
              dashboardPath = '/dashboard-prestataire';
              break;
            default:
              dashboardPath = '/dashboard';
          }
        }
        
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
            />
            <div className="mt-2 text-right">
              <Link 
                to="/reset-password" 
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                Mot de passe oublié ?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#10b981] text-white py-2 rounded-lg hover:bg-[#059669] transition duration-300"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}
