# 🏗️ GUIDE D'IMPLÉMENTATION - FINITIO DESIGN SYSTEM

## 🎨 Palette de couleurs BTP Tech Premium

### Couleurs principales
- **Bleu nuit** : `var(--primary-600)` #0284c7 - Navigation, liens
- **Orange construction** : `var(--construction-500)` #f97316 - CTA, accents
- **Neutres** : `var(--neutral-600)` #525252 - Textes principaux

## 🎯 Boutons CTA - Exemples d'utilisation

### 1. Bouton Principal (CTA primaire)
```html
<button class="btn-cta-primary">
  <span>🚀</span>
  Commencer gratuitement
</button>
```
**Usage** : Actions principales, inscriptions, démarrages de projets

### 2. Bouton Secondaire (Bleu nuit)
```html
<button class="btn-cta-secondary">
  <span>📞</span>
  Demander une démo
</button>
```
**Usage** : Actions secondaires, démonstrations, contact

### 3. Bouton Outline (Subtil)
```html
<button class="btn-cta-outline">
  <span>📋</span>
  En savoir plus
</button>
```
**Usage** : Actions tertiaires, informations complémentaires

### 4. Bouton Ghost (Minimal)
```html
<button class="btn-cta-ghost">
  Annuler
</button>
```
**Usage** : Actions d'annulation, navigation secondaire

## 🏗️ Sections et arrière-plans

### Hero Section
```html
<section class="hero-premium">
  <div class="container">
    <h1 class="heading-1">Votre titre principal</h1>
    <p class="body-large">Description engageante</p>
    <div class="stats-premium">
      <div class="stat-item">
        <div class="stat-number">2500+</div>
        <div class="stat-label">Projets réalisés</div>
      </div>
    </div>
  </div>
</section>
```

### Section claire
```html
<section class="section-light">
  <div class="container">
    <h2 class="heading-2">Fonctionnalités</h2>
    <div class="card-premium">
      <h3 class="heading-3">Titre de la carte</h3>
      <p class="body-base">Description de la fonctionnalité</p>
    </div>
  </div>
</section>
```

## 📊 Éléments spécifiques BTP

### Badge construction
```html
<span class="construction-badge">
  <span>🏗️</span>
  Nouveau projet
</span>
```

### Statistiques premium
```html
<div class="stats-premium">
  <div class="stat-item">
    <div class="stat-number">98.5%</div>
    <div class="stat-label">Satisfaction client</div>
  </div>
  <div class="stat-item">
    <div class="stat-number">24h</div>
    <div class="stat-label">Support réactif</div>
  </div>
</div>
```

## 🎨 Classes utilitaires

### Couleurs de texte
- `.text-construction` - Orange construction
- `.text-primary` - Bleu nuit
- `.text-success` - Vert succès
- `.text-warning` - Jaune warning
- `.text-error` - Rouge erreur

### Typographie
- `.heading-1` - Titre principal (48px)
- `.heading-2` - Titre section (36px)
- `.heading-3` - Sous-titre (24px)
- `.body-large` - Texte large (18px)
- `.body-base` - Texte standard (16px)

## 📱 Responsive

Le design system s'adapte automatiquement :
- Boutons plus petits sur mobile
- Typographie réduite
- Espacements ajustés

## ♿ Accessibilité WCAG AAA

- Contrastes respectés (4.5:1 minimum)
- Focus states visibles
- Tailles de clic suffisantes (44px minimum)
- Couleurs non comme seul moyen d'information

## 🚀 Intégration rapide

1. Importer le design system :
```javascript
import './styles/finitio-design-system.css';
```

2. Remplacer les anciens boutons :
```html
<!-- Ancien -->
<button class="bg-blue-600 text-white px-4 py-2">Action</button>

<!-- Nouveau -->
<button class="btn-cta-primary">Action</button>
```

3. Appliquer les nouvelles sections :
```html
<!-- Ancien -->
<section class="bg-gradient-to-r from-blue-500 to-purple-600">

<!-- Nouveau -->
<section class="hero-premium">
```
