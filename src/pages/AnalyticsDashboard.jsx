import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { FinitioIcon } from '../assets/FinitioAssets';

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState({
    dailyStats: [],
    conversionStats: [],
    popularPages: [],
    deviceStats: [],
    trafficSources: [],
    topEvents: [],
    loading: true
  });

  const [timeRange, setTimeRange] = useState('30'); // 7, 30, 90 jours
  const [selectedMetric, setSelectedMetric] = useState('sessions');

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  // 📊 Charger toutes les données analytics
  const loadAnalyticsData = async () => {
    try {
      setStats(prev => ({ ...prev, loading: true }));

      // Charger les statistiques quotidiennes
      const { data: dailyStats } = await supabase
        .from('analytics_daily_stats')
        .select('*')
        .limit(parseInt(timeRange));

      // Charger les statistiques de conversion
      const { data: conversionStats } = await supabase
        .from('analytics_conversion_stats')
        .select('*')
        .limit(parseInt(timeRange));

      // Charger les pages populaires
      const { data: popularPages } = await supabase
        .from('analytics_popular_pages')
        .select('*')
        .limit(10);

      // Charger les statistiques par appareil
      const { data: deviceStats } = await supabase
        .from('analytics_device_stats')
        .select('*')
        .limit(10);

      // Charger les sources de trafic
      const { data: trafficSources } = await supabase
        .from('analytics_traffic_sources')
        .select('*')
        .limit(10);

      // Charger les événements populaires
      const { data: topEvents } = await supabase
        .from('analytics_top_events')
        .select('*')
        .limit(10);

      setStats({
        dailyStats: dailyStats || [],
        conversionStats: conversionStats || [],
        popularPages: popularPages || [],
        deviceStats: deviceStats || [],
        trafficSources: trafficSources || [],
        topEvents: topEvents || [],
        loading: false
      });

    } catch (error) {
      console.error('❌ Erreur chargement analytics:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  // 📈 Calculer les totaux
  const getTotals = () => {
    const totalSessions = stats.dailyStats.reduce((sum, day) => sum + (day.unique_sessions || 0), 0);
    const totalUsers = stats.dailyStats.reduce((sum, day) => sum + (day.unique_users || 0), 0);
    const totalPageViews = stats.dailyStats.reduce((sum, day) => sum + (day.total_page_views || 0), 0);
    const totalSignups = stats.conversionStats.reduce((sum, day) => sum + (day.signups || 0), 0);
    const avgConversionRate = stats.conversionStats.length > 0 
      ? stats.conversionStats.reduce((sum, day) => sum + (day.conversion_rate || 0), 0) / stats.conversionStats.length 
      : 0;

    return {
      totalSessions,
      totalUsers,
      totalPageViews,
      totalSignups,
      avgConversionRate: avgConversionRate.toFixed(2)
    };
  };

  const totals = getTotals();

  if (stats.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-6">
      <div className="container mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            📊 Analytics Finitio
          </h1>
          <p className="text-xl text-gray-600">
            Tableau de bord des performances et conversions
          </p>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-2">
              {['7', '30', '90'].map((days) => (
                <button
                  key={days}
                  onClick={() => setTimeRange(days)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    timeRange === days
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {days} jours
                </button>
              ))}
            </div>
            
            <div className="text-sm text-gray-500">
              Dernière mise à jour : {new Date().toLocaleString('fr-FR')}
            </div>
          </div>
        </div>

        {/* Métriques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <FinitioIcon type="analytics" size="md" className="filter brightness-0 invert" />
              <span className="text-blue-200 text-sm">Sessions</span>
            </div>
            <div className="text-3xl font-bold mb-2">{totals.totalSessions.toLocaleString()}</div>
            <div className="text-blue-200 text-sm">Sessions uniques</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <FinitioIcon type="users" size="md" className="filter brightness-0 invert" />
              <span className="text-green-200 text-sm">Utilisateurs</span>
            </div>
            <div className="text-3xl font-bold mb-2">{totals.totalUsers.toLocaleString()}</div>
            <div className="text-green-200 text-sm">Utilisateurs uniques</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <FinitioIcon type="pages" size="md" className="filter brightness-0 invert" />
              <span className="text-purple-200 text-sm">Pages vues</span>
            </div>
            <div className="text-3xl font-bold mb-2">{totals.totalPageViews.toLocaleString()}</div>
            <div className="text-purple-200 text-sm">Vues totales</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <FinitioIcon type="signup" size="md" className="filter brightness-0 invert" />
              <span className="text-orange-200 text-sm">Inscriptions</span>
            </div>
            <div className="text-3xl font-bold mb-2">{totals.totalSignups.toLocaleString()}</div>
            <div className="text-orange-200 text-sm">Nouveaux utilisateurs</div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <FinitioIcon type="conversion" size="md" className="filter brightness-0 invert" />
              <span className="text-red-200 text-sm">Conversion</span>
            </div>
            <div className="text-3xl font-bold mb-2">{totals.avgConversionRate}%</div>
            <div className="text-red-200 text-sm">Taux moyen</div>
          </div>
        </div>

        {/* Graphiques et tableaux */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Pages populaires */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">📄 Pages les plus visitées</h3>
            <div className="space-y-4">
              {stats.popularPages.slice(0, 5).map((page, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{page.page_path}</div>
                    <div className="text-sm text-gray-500">{page.page_title}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-600">{page.views}</div>
                    <div className="text-sm text-gray-500">vues</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sources de trafic */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">🔍 Sources de trafic</h3>
            <div className="space-y-4">
              {stats.trafficSources.map((source, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${
                      source.source === 'Direct' ? 'bg-blue-500' :
                      source.source === 'Google' ? 'bg-green-500' :
                      source.source === 'Facebook' ? 'bg-blue-600' :
                      source.source === 'LinkedIn' ? 'bg-blue-700' :
                      'bg-gray-500'
                    }`}></div>
                    <span className="font-semibold text-gray-900">{source.source}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-600">{source.sessions}</div>
                    <div className="text-sm text-gray-500">sessions</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Statistiques par appareil */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">📱 Appareils</h3>
            <div className="space-y-3">
              {stats.deviceStats.map((device, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-700">{device.device_type}</span>
                  <span className="font-semibold text-blue-600">{device.sessions}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">🌐 Navigateurs</h3>
            <div className="space-y-3">
              {stats.deviceStats.slice(0, 5).map((device, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-700">{device.browser}</span>
                  <span className="font-semibold text-green-600">{device.sessions}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">🎯 Événements populaires</h3>
            <div className="space-y-3">
              {stats.topEvents.slice(0, 5).map((event, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-700">{event.event_name}</span>
                  <span className="font-semibold text-purple-600">{event.event_count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Graphique de conversion */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">📈 Évolution des conversions</h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {stats.conversionStats.slice(0, 14).map((day, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg min-h-[4px]"
                  style={{ 
                    height: `${Math.max((day.conversion_rate || 0) * 4, 4)}px` 
                  }}
                ></div>
                <div className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-left">
                  {new Date(day.date).toLocaleDateString('fr-FR', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center text-sm text-gray-500">
            Taux de conversion quotidien (%)
          </div>
        </div>
      </div>
    </div>
  );
}
