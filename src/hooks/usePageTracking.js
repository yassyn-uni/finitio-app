import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../utils/analytics';

// 🎯 Hook personnalisé pour tracker les vues de pages
export const usePageTracking = (pageName, additionalData = {}) => {
  const location = useLocation();

  useEffect(() => {
    // Tracker la vue de page
    trackPageView(pageName, {
      path: location.pathname,
      search: location.search,
      hash: location.hash,
      referrer: document.referrer,
      timestamp: new Date().toISOString(),
      ...additionalData
    });

    // Mettre à jour le titre de la page pour le tracking
    const originalTitle = document.title;
    if (pageName && !document.title.includes(pageName)) {
      document.title = `${pageName} - Finitio`;
    }

    // Nettoyer le titre au démontage
    return () => {
      document.title = originalTitle;
    };
  }, [location.pathname, location.search, pageName]);
};

// 🔄 Hook pour tracker les changements de route
export const useRouteTracking = () => {
  const location = useLocation();

  useEffect(() => {
    // Tracker le changement de route
    trackPageView('Route Change', {
      from: sessionStorage.getItem('lastPath') || 'direct',
      to: location.pathname,
      timestamp: new Date().toISOString()
    });

    // Sauvegarder le chemin actuel
    sessionStorage.setItem('lastPath', location.pathname);
  }, [location.pathname]);
};

export default usePageTracking;
