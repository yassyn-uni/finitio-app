import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useParams } from 'react-router-dom';

// Configuration des colonnes avec couleurs améliorées pour lisibilité
const COLUMNS = [
  { 
    id: 'todo', 
    statut: 'à faire', 
    nom: '📋 À faire', 
    color: 'bg-red-50 border-red-300 border-l-4 border-l-red-500',
    headerColor: 'bg-red-100 text-red-800 border-red-300',
    badgeColor: 'bg-red-500 text-white'
  },
  { 
    id: 'progress', 
    statut: 'en cours', 
    nom: '⚡ En cours', 
    color: 'bg-amber-50 border-amber-300 border-l-4 border-l-amber-500',
    headerColor: 'bg-amber-100 text-amber-800 border-amber-300',
    badgeColor: 'bg-amber-500 text-white'
  },
  { 
    id: 'done', 
    statut: 'terminée', 
    nom: '✅ Terminée', 
    color: 'bg-emerald-50 border-emerald-300 border-l-4 border-l-emerald-500',
    headerColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    badgeColor: 'bg-emerald-500 text-white'
  }
];

export default function EtapesKanban() {
  const { id } = useParams();
  const [etapes, setEtapes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [draggedItem, setDraggedItem] = useState(null);

  useEffect(() => {
    const fetchEtapes = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('etapes')
          .select('*')
          .eq('projet_id', id);
        
        if (error) {
          console.error('Erreur fetch étapes:', error);
          setEtapes([]);
        } else {
          setEtapes(data || []);
        }
      } catch (err) {
        console.error('Erreur:', err);
        setEtapes([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchEtapes();
    }
  }, [id]);

  // Drag & Drop handlers
  const handleDragStart = (e, etape) => {
    setDraggedItem(etape);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.outerHTML);
    e.target.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedItem(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, targetStatut) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem.statut === targetStatut) {
      return;
    }

    try {
      // Mise à jour optimiste
      setEtapes(prev =>
        prev.map(etape =>
          etape.id === draggedItem.id
            ? { ...etape, statut: targetStatut }
            : etape
        )
      );

      // Mise à jour en base
      const { error } = await supabase
        .from('etapes')
        .update({ statut: targetStatut })
        .eq('id', draggedItem.id);

      if (error) {
        console.error('Erreur mise à jour:', error);
        // Rollback
        setEtapes(prev =>
          prev.map(etape =>
            etape.id === draggedItem.id
              ? { ...etape, statut: draggedItem.statut }
              : etape
          )
        );
      }
    } catch (err) {
      console.error('Erreur drop:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-2 text-gray-500">Chargement des étapes...</p>
      </div>
    );
  }

  return (
    <div className="p-2 md:p-4">
      <h3 className="text-xl font-bold mb-6 text-gray-800">📌 Kanban des étapes</h3>
      
      {/* Layout en colonnes pour desktop, stack pour mobile */}
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
        {COLUMNS.map((column) => (
          <div 
            key={column.id} 
            className={`flex-1 rounded-xl border-2 ${column.color} p-4 min-h-[400px] shadow-sm hover:shadow-md transition-shadow`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.statut)}
          >
            <div className={`p-3 rounded-lg mb-4 ${column.headerColor} border`}>
              <h4 className="font-bold text-base flex items-center justify-between">
                <span>{column.nom}</span>
                <span className={`${column.badgeColor} px-3 py-1 rounded-full text-xs font-medium`}>
                  {etapes.filter(e => e.statut === column.statut).length}
                </span>
              </h4>
            </div>
            
            <div className="space-y-3">
              {etapes
                .filter(e => e.statut === column.statut)
                .map((etape) => (
                  <div
                    key={etape.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, etape)}
                    onDragEnd={handleDragEnd}
                    className="bg-white p-4 rounded-lg shadow-md border border-gray-300 hover:shadow-lg transition-all cursor-move hover:scale-[1.02] hover:border-blue-400"
                  >
                    <strong className="text-base block mb-2 text-gray-900 font-semibold leading-tight">
                      {etape.nom || etape.titre}
                    </strong>
                    {etape.description && (
                      <p className="text-sm text-gray-700 leading-relaxed mb-2">
                        {etape.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Ordre: {etape.ordre}</span>
                      {etape.budget_estime && (
                        <span className="text-blue-600 font-medium">
                          💰 {etape.budget_estime.toLocaleString()} MAD
                        </span>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Instructions améliorées */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <p className="text-sm text-blue-800 flex items-center">
          <span className="text-lg mr-2">💡</span>
          <strong>Instructions :</strong> 
          <span className="ml-1">Glissez-déposez les étapes entre les colonnes pour changer leur statut. Les modifications sont sauvegardées automatiquement.</span>
        </p>
      </div>
    </div>
  );
}
