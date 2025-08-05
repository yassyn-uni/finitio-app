// ✅ src/components/Dashboard.jsx
export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Bienvenue sur votre tableau de bord</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">📁 Projets</div>
        <div className="bg-white p-6 rounded-lg shadow">📋 Tâches</div>
        <div className="bg-white p-6 rounded-lg shadow">💬 Notifications</div>
        <div className="bg-white p-6 rounded-lg shadow">🛠️ Prestataires</div>
        <div className="bg-white p-6 rounded-lg shadow">💰 Paiements</div>
        <div className="bg-white p-6 rounded-lg shadow">🔧 Produits</div>
      </div>
    </div>
  );
}
