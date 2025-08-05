// Système d'assets Finitio avec logos et images SVG intégrés
export const FinitioAssets = {
  // Logo principal Finitio
  logo: {
    main: `<svg viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#8B5CF6;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect x="10" y="10" width="40" height="40" rx="12" fill="url(#logoGradient)" />
      <text x="65" y="35" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="url(#logoGradient)">Finitio</text>
      <circle cx="30" cy="30" r="8" fill="white" opacity="0.3" />
      <rect x="25" y="25" width="10" height="10" rx="2" fill="white" />
    </svg>`,
    
    icon: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#8B5CF6;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect x="10" y="10" width="40" height="40" rx="12" fill="url(#iconGradient)" />
      <circle cx="30" cy="30" r="8" fill="white" opacity="0.3" />
      <rect x="25" y="25" width="10" height="10" rx="2" fill="white" />
    </svg>`
  },

  // Illustrations pour les pages
  illustrations: {
    construction: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="buildingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:0.8" />
          <stop offset="100%" style="stop-color:#1E40AF;stop-opacity:0.6" />
        </linearGradient>
      </defs>
      <!-- Bâtiment principal -->
      <rect x="100" y="100" width="200" height="150" fill="url(#buildingGradient)" rx="8" />
      <!-- Fenêtres -->
      <rect x="120" y="120" width="30" height="40" fill="white" opacity="0.8" rx="4" />
      <rect x="170" y="120" width="30" height="40" fill="white" opacity="0.8" rx="4" />
      <rect x="220" y="120" width="30" height="40" fill="white" opacity="0.8" rx="4" />
      <rect x="120" y="180" width="30" height="40" fill="white" opacity="0.8" rx="4" />
      <rect x="170" y="180" width="30" height="40" fill="white" opacity="0.8" rx="4" />
      <rect x="220" y="180" width="30" height="40" fill="white" opacity="0.8" rx="4" />
      <!-- Porte -->
      <rect x="270" y="200" width="20" height="50" fill="white" opacity="0.9" rx="2" />
      <!-- Grue -->
      <line x1="50" y1="50" x2="50" y2="200" stroke="#F59E0B" stroke-width="4" />
      <line x1="50" y1="80" x2="150" y2="80" stroke="#F59E0B" stroke-width="3" />
      <rect x="140" y="75" width="20" height="10" fill="#EF4444" />
      <!-- Nuages -->
      <circle cx="80" cy="40" r="15" fill="white" opacity="0.7" />
      <circle cx="95" cy="35" r="20" fill="white" opacity="0.7" />
      <circle cx="110" cy="40" r="15" fill="white" opacity="0.7" />
    </svg>`,

    renovation: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="renovationGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#10B981;stop-opacity:0.8" />
          <stop offset="100%" style="stop-color:#059669;stop-opacity:0.6" />
        </linearGradient>
      </defs>
      <!-- Maison -->
      <rect x="150" y="150" width="100" height="100" fill="url(#renovationGradient)" />
      <!-- Toit -->
      <polygon points="140,150 200,100 260,150" fill="#8B5CF6" />
      <!-- Outils -->
      <rect x="80" y="180" width="40" height="8" fill="#F59E0B" rx="4" />
      <circle cx="90" cy="170" r="8" fill="#EF4444" />
      <rect x="280" y="200" width="6" height="40" fill="#8B4513" />
      <rect x="275" y="195" width="16" height="10" fill="#6B7280" />
      <!-- Échelle -->
      <rect x="120" y="120" width="4" height="80" fill="#8B4513" />
      <rect x="110" y="130" width="24" height="3" fill="#8B4513" />
      <rect x="110" y="150" width="24" height="3" fill="#8B4513" />
      <rect x="110" y="170" width="24" height="3" fill="#8B4513" />
    </svg>`,

    planning: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="planningGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#8B5CF6;stop-opacity:0.8" />
          <stop offset="100%" style="stop-color:#7C3AED;stop-opacity:0.6" />
        </linearGradient>
      </defs>
      <!-- Tableau -->
      <rect x="100" y="80" width="200" height="140" fill="white" stroke="url(#planningGradient)" stroke-width="3" rx="8" />
      <!-- Grille -->
      <line x1="130" y1="80" x2="130" y2="220" stroke="#E5E7EB" stroke-width="1" />
      <line x1="160" y1="80" x2="160" y2="220" stroke="#E5E7EB" stroke-width="1" />
      <line x1="190" y1="80" x2="190" y2="220" stroke="#E5E7EB" stroke-width="1" />
      <line x1="220" y1="80" x2="220" y2="220" stroke="#E5E7EB" stroke-width="1" />
      <line x1="250" y1="80" x2="250" y2="220" stroke="#E5E7EB" stroke-width="1" />
      <line x1="280" y1="80" x2="280" y2="220" stroke="#E5E7EB" stroke-width="1" />
      <!-- Tâches -->
      <rect x="105" y="100" width="20" height="15" fill="#3B82F6" rx="2" />
      <rect x="135" y="120" width="20" height="15" fill="#10B981" rx="2" />
      <rect x="165" y="140" width="20" height="15" fill="#F59E0B" rx="2" />
      <rect x="195" y="160" width="20" height="15" fill="#EF4444" rx="2" />
      <!-- Calendrier -->
      <rect x="50" y="50" width="60" height="50" fill="white" stroke="#8B5CF6" stroke-width="2" rx="4" />
      <rect x="50" y="50" width="60" height="15" fill="#8B5CF6" rx="4" />
      <text x="80" y="85" text-anchor="middle" font-size="12" fill="#374151">15</text>
    </svg>`,

    team: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <!-- Personnes -->
      <circle cx="150" cy="120" r="25" fill="#3B82F6" />
      <rect x="130" y="145" width="40" height="50" fill="#3B82F6" rx="20" />
      
      <circle cx="200" cy="120" r="25" fill="#10B981" />
      <rect x="180" y="145" width="40" height="50" fill="#10B981" rx="20" />
      
      <circle cx="250" cy="120" r="25" fill="#F59E0B" />
      <rect x="230" y="145" width="40" height="50" fill="#F59E0B" rx="20" />
      
      <!-- Bulles de dialogue -->
      <circle cx="120" cy="80" r="15" fill="white" stroke="#3B82F6" stroke-width="2" />
      <circle cx="280" cy="80" r="15" fill="white" stroke="#F59E0B" stroke-width="2" />
    </svg>`
  },

  // Icônes métier
  icons: {
    architect: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="architectGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#10B981;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#059669;stop-opacity:1" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="40" fill="url(#architectGradient)" />
      <rect x="35" y="35" width="30" height="20" fill="white" rx="2" />
      <rect x="30" y="60" width="40" height="3" fill="white" />
      <rect x="25" y="68" width="50" height="3" fill="white" />
    </svg>`,

    contractor: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="contractorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#F59E0B;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#D97706;stop-opacity:1" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="40" fill="url(#contractorGradient)" />
      <rect x="35" y="40" width="30" height="6" fill="white" rx="3" />
      <rect x="40" y="50" width="4" height="20" fill="white" />
      <rect x="45" y="55" width="15" height="8" fill="white" rx="4" />
    </svg>`,

    client: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="clientGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1E40AF;stop-opacity:1" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="40" fill="url(#clientGradient)" />
      <circle cx="50" cy="40" r="12" fill="white" />
      <path d="M30 70 Q50 55 70 70" fill="white" />
    </svg>`
  },

  // Patterns de fond
  patterns: {
    construction: `<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="constructionPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="20" height="20" fill="none" />
          <rect x="5" y="5" width="10" height="10" fill="#3B82F6" opacity="0.1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#constructionPattern)" />
    </svg>`,

    geometric: `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="geometricPattern" x="0" y="0" width="25" height="25" patternUnits="userSpaceOnUse">
          <polygon points="12.5,0 25,12.5 12.5,25 0,12.5" fill="#8B5CF6" opacity="0.05" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#geometricPattern)" />
    </svg>`
  }
};

// Composant pour afficher les logos
export const FinitioLogo = ({ variant = 'main', className = '', size = 'md' }) => {
  const sizes = {
    sm: 'w-24 h-8',
    md: 'w-32 h-10',
    lg: 'w-48 h-16',
    xl: 'w-64 h-20'
  };

  return (
    <div 
      className={`${sizes[size]} ${className}`}
      dangerouslySetInnerHTML={{ __html: FinitioAssets.logo[variant] }}
    />
  );
};

// Composant pour afficher les illustrations
export const FinitioIllustration = ({ type, className = '', size = 'md' }) => {
  const sizes = {
    sm: 'w-32 h-24',
    md: 'w-48 h-36',
    lg: 'w-64 h-48',
    xl: 'w-80 h-60'
  };

  return (
    <div 
      className={`${sizes[size]} ${className}`}
      dangerouslySetInnerHTML={{ __html: FinitioAssets.illustrations[type] }}
    />
  );
};

// Composant pour afficher les icônes métier
export const FinitioIcon = ({ type, className = '', size = 'md' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  return (
    <div 
      className={`${sizes[size]} ${className}`}
      dangerouslySetInnerHTML={{ __html: FinitioAssets.icons[type] }}
    />
  );
};

export default FinitioAssets;
