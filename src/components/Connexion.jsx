import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Connexion() {
  const [formData, setFormData] = useState({
    email: '',
    motDePasse: '',
  });

  const [erreur, setErreur] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur('');

    const { email, motDePasse } = formData;

    try {
      // 🔐 Étape 1 : Auth Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password: motDePasse,
      });
     console.log("✅ Résultat signIn:", { user: authData?.user, session: authData?.session });
console.log("❌ Erreur auth:", authError);


      if (authError || !authData?.user) {
        setErreur("❌ Email ou mot de passe incorrect.");
        return;
      }

      // 🔍 Étape 2 : Rôle depuis la table "users"
      const { data: userData, error: roleError } = await supabase
        .from('users')
        .select('role')
        .eq('id', authData.user.id)
        .single();

      if (roleError || !userData) {
        setErreur("⚠️ Connexion réussie, mais rôle non trouvé.");
        return;
      }

      const role = userData.role;

      // 🚀 Étape 3 : Redirection selon le rôle
      if (role === 'client') {
        navigate('/dashboard-client');
      } else if (role === 'prestataire') {
        navigate('/dashboard-prestataire');
      } else if (role === 'architecte') {
        navigate('/dashboard-architecte');
      } else {
        setErreur("❌ Rôle inconnu. Contactez l’administrateur.");
      }

    } catch (err) {
      setErreur("Une erreur est survenue. Veuillez réessayer.");
      console.error(err);
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
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Mot de passe</label>
            <input
              type="password"
              name="motDePasse"
              value={formData.motDePasse}
              onChange={handleChange}
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
            className="w-full bg-[#10b981] text-white py-2 rounded-lg hover:bg-[#059669] transition duration-300"
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}
