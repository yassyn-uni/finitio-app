import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import OptimizedAnalytics from '../utils/optimizedAnalytics';

// Hook personnalisé pour tracker les vues de pages avec système optimisé
export const usePageTracking = (pageName, additionalData = {}) => {
  const location = useLocation();

  useEffect(() => {
    // Tracker la vue de page avec le système optimisé
    OptimizedAnalytics.trackPageView(
      pageName || 'unknown',
      location.pathname,
      document.title
    );

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

// Hook pour tracker les changements de route avec système optimisé
export const useRouteTracking = (analyticsSystem = OptimizedAnalytics) => {
  const location = useLocation();

  useEffect(() => {
    // Extraire le nom de la page depuis le pathname
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const pageName = pathSegments[0] || 'accueil';
    
    // Tracker avec le système optimisé
    analyticsSystem.trackPageView(
      pageName,
      location.pathname,
      document.title
    );

    // Tracker également comme événement de navigation
    analyticsSystem.trackEvent('page_navigation', {
      from: document.referrer || 'direct',
      to: location.pathname,
      search: location.search,
      hash: location.hash
    });

  }, [location.pathname, location.search, location.hash, analyticsSystem]);
};

export default usePageTracking;
