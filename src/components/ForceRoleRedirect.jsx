import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function ForceRoleRedirect() {
  const [checking, setChecking] = useState(true);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    checkUserAndRedirect();
  }, []);

  const checkUserAndRedirect = async () => {
    try {
      console.log('🔍 ForceRoleRedirect: Vérification utilisateur...');
      
      // Récupérer l'utilisateur connecté
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error('❌ Erreur Auth:', authError);
        window.location.href = '/connexion';
        return;
      }

      if (!user) {
        console.log('❌ Aucun utilisateur connecté - redirection vers connexion');
        window.location.href = '/connexion';
        return;
      }

      console.log('✅ Utilisateur connecté:', user.email);
      console.log('🆔 UUID:', user.id);

      // Récupérer le profil utilisateur
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      console.log('👤 Profil récupéré:', profile);
      console.log('❌ Erreur profil:', profileError);

      if (profileError) {
        console.error('❌ Erreur récupération profil:', profileError);
        
        // Essayer de chercher par email si UUID ne fonctionne pas
        const { data: profileByEmail, error: emailError } = await supabase
          .from('users')
          .select('*')
          .eq('email', user.email)
          .single();

        console.log('🔍 Recherche par email:', profileByEmail);
        
        if (profileByEmail) {
          console.log('✅ Profil trouvé par email');
          redirectByRole(profileByEmail.role, user.email);
          return;
        } else {
          console.error('❌ Aucun profil trouvé - redirection vers dashboard général');
          window.location.href = '/dashboard';
          return;
        }
      }

      if (profile?.role) {
        console.log('✅ Rôle trouvé:', profile.role);
        redirectByRole(profile.role, user.email);
      } else {
        console.log('❌ Aucun rôle défini - redirection vers dashboard général');
        window.location.href = '/dashboard';
      }

    } catch (error) {
      console.error('💥 Erreur générale:', error);
      window.location.href = '/connexion';
    } finally {
      setChecking(false);
    }
  };

  const redirectByRole = (role, email) => {
    const normalizedRole = role?.toLowerCase();
    console.log('🎯 Redirection pour rôle:', normalizedRole, 'utilisateur:', email);

    // Stocker le rôle dans localStorage
    localStorage.setItem('user_role', normalizedRole);

    switch (normalizedRole) {
      case 'client':
        console.log('➡️ Redirection vers dashboard client');
        window.location.href = '/dashboard-client';
        break;
      case 'architecte':
        console.log('➡️ Redirection vers dashboard architecte');
        window.location.href = '/dashboard-architecte';
        break;
      case 'prestataire':
        console.log('➡️ Redirection vers dashboard prestataire');
        window.location.href = '/dashboard-prestataire';
        break;
      case 'fournisseur':
        console.log('➡️ Redirection vers dashboard fournisseur');
        window.location.href = '/dashboard-fournisseur';
        break;
      default:
        console.log('❌ Rôle non reconnu:', normalizedRole, '- redirection vers dashboard général');
        window.location.href = '/dashboard';
        break;
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Vérification de votre profil...</h2>
          <p className="text-gray-500">Redirection en cours selon votre rôle</p>
          {userInfo && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg text-left max-w-md mx-auto">
              <h3 className="font-medium text-blue-900 mb-2">Informations de débogage :</h3>
              <pre className="text-xs text-blue-700 whitespace-pre-wrap">{JSON.stringify(userInfo, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
