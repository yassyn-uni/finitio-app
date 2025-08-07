import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useParams } from 'react-router-dom';

// Configuration des colonnes
const COLUMNS = [
  { id: 'todo', statut: 'à faire', nom: '📋 À faire', color: 'bg-red-50 border-red-200' },
  { id: 'progress', statut: 'en cours', nom: '⚡ En cours', color: 'bg-yellow-50 border-yellow-200' },
  { id: 'done', statut: 'terminée', nom: '✅ Terminée', color: 'bg-green-50 border-green-200' }
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
      <h3 className="text-lg font-bold mb-4">📌 Kanban des étapes</h3>
      
      <div className="flex flex-col md:grid md:grid-cols-3 gap-2 md:gap-4">
        {COLUMNS.map((column) => (
          <div 
            key={column.id} 
            className={`rounded-lg border-2 ${column.color} p-2 md:p-3 min-h-[300px]`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.statut)}
          >
            <h4 className="font-semibold mb-3 text-sm md:text-base">
              {column.nom}
              <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                {etapes.filter(e => e.statut === column.statut).length}
              </span>
            </h4>
            
            <div className="space-y-2">
              {etapes
                .filter(e => e.statut === column.statut)
                .map((etape) => (
                  <div
                    key={etape.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, etape)}
                    onDragEnd={handleDragEnd}
                    className="bg-white p-2 md:p-3 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-move hover:scale-105"
                  >
                    <strong className="text-sm md:text-base block mb-2 text-gray-900 font-semibold">
                      {etape.nom || etape.titre}
                    </strong>
                    {etape.description && (
                      <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                        {etape.description}
                      </p>
                    )}
                    {etape.budget_estime && (
                      <div className="mt-2 text-xs text-blue-600 font-medium">
                        💰 {etape.budget_estime.toLocaleString()} MAD
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-700">
          💡 <strong>Instructions :</strong> Glissez-déposez les étapes entre les colonnes pour changer leur statut.
        </p>
      </div>
    </div>
  );
}
