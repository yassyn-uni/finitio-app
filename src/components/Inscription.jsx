// ✅ src/components/Inscription.jsx
import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Inscription() {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    motDePasse: '',
    role: 'client', // valeur par défaut
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { nom, email, motDePasse, role } = formData;

    const { data, error } = await supabase.auth.signUp({
      email,
      password: motDePasse,
    });

    if (error) {
      alert("❌ Erreur d'inscription : " + error.message);
      return;
    }

    const { user } = data;

    const { error: insertError } = await supabase
      .from('users')
      .insert([
        {
          id: user.id,
          nom,
          email,
          role, // client, prestataire, architecte
        },
      ]);

    if (insertError) {
      alert("⚠️ Compte créé mais erreur dans la table users : " + insertError.message);
    } else {
      alert('✅ Inscription réussie ! Vérifie ton email.');
      setFormData({ nom: '', email: '', motDePasse: '', role: 'client' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6] px-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#1e3a8a]">Créer un compte</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 font-semibold">Nom</label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Mot de passe</label>
            <input
              type="password"
              name="motDePasse"
              value={formData.motDePasse}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Rôle</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="client">Client</option>
              <option value="prestataire">Prestataire / Fournisseur</option>
              <option value="architecte">Architecte</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-[#10b981] text-white py-2 rounded-lg hover:bg-[#059669] transition"
          >
            S'inscrire
          </button>
        </form>
      </div>
    </div>
  );
}
