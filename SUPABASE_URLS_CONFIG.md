# Configuration URLs de Redirection Supabase

## 🔧 Étapes pour corriger les URLs de redirection :

### 1. Aller dans Supabase Dashboard
- Connectez-vous à https://supabase.com
- Sélectionnez votre projet Finitio

### 2. Configuration Authentication
- Allez dans **Authentication** → **URL Configuration**
- Ou **Settings** → **Authentication**

### 3. Mettre à jour les URLs autorisées

#### Site URL (URL principale) :
```
https://finitio-app.vercel.app
```

#### Redirect URLs (URLs de redirection autorisées) :
```
https://finitio-app.vercel.app
https://finitio-app.vercel.app/auth/callback
https://finitio-app.vercel.app/reset-password
https://finitio-app.vercel.app/connexion
```

#### Pour le développement local (optionnel) :
```
http://localhost:3000
http://localhost:5173
http://localhost:3000/auth/callback
http://localhost:5173/auth/callback
```

### 4. Sauvegarder les changements
- Cliquez sur **Save** ou **Update**
- Les changements prennent effet immédiatement

## 🎯 URLs importantes à configurer :
- **Site URL** : URL principale de votre app
- **Redirect URLs** : Toutes les URLs où Supabase peut rediriger
- **Logout URL** : URL après déconnexion (optionnel)

## ⚠️ Important :
- Utilisez HTTPS pour la production
- N'oubliez pas le `/auth/callback` pour OAuth
- Testez après chaque modification
