import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useApplications } from '../hooks/useApplications';
import ApplicationCard from '../components/ApplicationCard';
import ApplicationForm from '../components/ApplicationForm';
import StatsPanel from '../components/StatsPanel';
import type { Application } from '../types';

const Home = () => {
  const { user, logout } = useAuth();
  const { applications, loading, error, createApplication, updateApplication, deleteApplication, statsVersion } = useApplications();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Application | null>(null);

  const handleCreate = async (data: Partial<Application>) => {
    const result = await createApplication(data);
    if (result.success) setShowForm(false);
    return result;
  };

  const handleUpdate = async (data: Partial<Application>) => {
    if (!editing) return { success: false };
    const result = await updateApplication(editing.id, data);
    if (result.success) setEditing(null);
    return result;
  };

  const handleStatusChange = async (id: number, status: Application['status']) => {
    await updateApplication(id, { status });
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 20px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 28 }}>Mis postulaciones</h1>
          <p style={{ margin: '4px 0 0', color: '#6B7280' }}>Hola, {user?.name} 👋</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={() => setShowForm(true)}
            style={{
              padding: '8px 20px', borderRadius: 8, border: 'none',
              backgroundColor: '#3B82F6', color: '#fff', cursor: 'pointer',
              fontWeight: 600, fontSize: 14,
            }}
          >
            + Nueva postulación
          </button>
          <button
            onClick={logout}
            style={{
              padding: '8px 16px', borderRadius: 8, border: '1px solid #D1D5DB',
              backgroundColor: '#fff', cursor: 'pointer', fontSize: 14,
            }}
          >
            Salir
          </button>
        </div>
      </div>

      {/* Resumen rápido */}
      <StatsPanel refetchTrigger={statsVersion} />

      {/* Lista */}
      {loading && <p style={{ color: '#6B7280' }}>Cargando...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && applications.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#9CA3AF' }}>
          <p style={{ fontSize: 48 }}>📋</p>
          <p style={{ fontSize: 18 }}>Todavía no tenés postulaciones</p>
          <p style={{ fontSize: 14 }}>Hacé clic en "Nueva postulación" para empezar</p>
        </div>
      )}

      {applications.map((app) => (
        <ApplicationCard
          key={app.id}
          application={app}
          onEdit={(app) => setEditing(app)}
          onDelete={deleteApplication}
          onStatusChange={handleStatusChange}
        />
      ))}

      {/* Modal crear */}
      {showForm && (
        <ApplicationForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Modal editar */}
      {editing && (
        <ApplicationForm
          initial={editing}
          onSubmit={handleUpdate}
          onCancel={() => setEditing(null)}
        />
      )}
    </div>
  );
};

export default Home;