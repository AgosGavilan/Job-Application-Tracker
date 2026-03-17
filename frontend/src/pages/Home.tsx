import { useState } from 'react';
import { ClipboardList } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useApplications } from '../hooks/useApplications';
import Navbar from '../components/NavBar';
import ApplicationTable from '../components/ApplicationTable';
import ApplicationForm from '../components/ApplicationForm';
import StatsPanel from '../components/StatsPanel';
import type { Application } from '../types';

const Home = () => {
  const { user } = useAuth();
  const {
    applications, loading, error,
    createApplication, updateApplication, deleteApplication,
    statsVersion,
  } = useApplications();

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

  return (
    <>
      <Navbar onNewApplication={() => setShowForm(true)} />

      <div style={{ padding: '28px 28px', maxWidth: 1200, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: 'var(--color-text-primary)', letterSpacing: '-0.03em' }}>
            Buen día, {user?.name.split(' ')[0]} 👋
          </h1>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 3 }}>
            {applications.length} postulaciones activas
          </p>
        </div>

        {/* Stats + gráficos */}
        <StatsPanel refetchTrigger={statsVersion} />

        {/* Tabla */}
        <div style={{
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '0.5px solid var(--color-border)',
          padding: '18px 20px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 13.5, fontWeight: 600 }}>Postulaciones</h2>
            <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
              {applications.length} en total
            </span>
          </div>

          {loading && <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>Cargando...</p>}
          {error && <p style={{ fontSize: 13, color: 'var(--color-red)' }}>{error}</p>}

          {!loading && applications.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--color-text-secondary)' }}>
              <ClipboardList size={36} color="var(--color-text-muted)" style={{ margin: '0 auto 12px', display: 'block' }} />
              <p style={{ fontSize: 15, fontWeight: 500 }}>Todavía no tenés postulaciones</p>
              <p style={{ fontSize: 13, marginTop: 4 }}>Usá el botón "Nueva postulación" para empezar</p>
            </div>
          )}

          <ApplicationTable
            applications={applications}
            onEdit={setEditing}
            onDelete={deleteApplication}
            onStatusChange={(id, status) => updateApplication(id, { status })}
          />
        </div>
      </div>

      {showForm && (
        <ApplicationForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editing && (
        <ApplicationForm
          initial={editing}
          onSubmit={handleUpdate}
          onCancel={() => setEditing(null)}
        />
      )}
    </>
  );
};

export default Home;