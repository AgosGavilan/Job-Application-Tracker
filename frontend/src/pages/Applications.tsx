import { useState, useMemo } from 'react';
import { Search, Filter } from 'lucide-react';
import { useApplications } from '../hooks/useApplications';
import { useWindowSize } from '../hooks/useWindowSize';
import Navbar from '../components/NavBar';
import ApplicationTable from '../components/ApplicationTable';
import ApplicationForm from '../components/ApplicationForm';
import type { Application } from '../types';
import { statusLabels, channelLabels } from '../utils/statusHelpers';

const Applications = () => {
    const { isMobile } = useWindowSize();
    const {
        applications, loading, error,
        createApplication, updateApplication, deleteApplication,
    } = useApplications();

    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Application | null>(null);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [filterChannel, setFilterChannel] = useState<string>('all');

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

    // Filtrado
    const filtered = useMemo(() => {
        return applications.filter(app => {
            const matchSearch =
                app.company.toLowerCase().includes(search.toLowerCase()) ||
                app.position.toLowerCase().includes(search.toLowerCase());
            const matchStatus = filterStatus === 'all' || app.status === filterStatus;
            const matchChannel = filterChannel === 'all' || app.channel === filterChannel;
            return matchSearch && matchStatus && matchChannel;
        });
    }, [applications, search, filterStatus, filterChannel]);

    const selectStyle: React.CSSProperties = {
        padding: '8px 12px',
        borderRadius: 'var(--radius-md)',
        border: '0.5px solid var(--color-border)',
        background: 'var(--color-surface)',
        color: 'var(--color-text-primary)',
        fontSize: 13, cursor: 'pointer',
        fontFamily: 'var(--font)',
        outline: 'none',
    };

    return (
        <>
            <Navbar onNewApplication={() => setShowForm(true)} />

            <div style={{
                padding: isMobile ? '72px 16px 16px' : '28px 28px',
                maxWidth: 1200, margin: '0 auto',
            }}>

                {/* Header */}
                <div style={{ marginBottom: 24 }}>
                    <h1 style={{
                        fontSize: isMobile ? 20 : 22, fontWeight: 600,
                        color: 'var(--color-text-primary)', letterSpacing: '-0.03em',
                    }}>
                        Postulaciones
                    </h1>
                    <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 3 }}>
                        {applications.length} en total · {filtered.length} mostradas
                    </p>
                </div>

                {/* Filtros */}
                <div style={{
                    background: 'var(--color-surface)',
                    border: '0.5px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '14px 16px',
                    marginBottom: 14,
                    display: 'flex',
                    gap: 10,
                    flexWrap: 'wrap',
                    alignItems: 'center',
                }}>

                    {/* Búsqueda */}
                    <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
                        <Search
                            size={14}
                            color="var(--color-text-secondary)"
                            style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }}
                        />
                        <input
                            type="text"
                            placeholder="Buscar empresa o puesto..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{
                                width: '100%', padding: '8px 12px 8px 32px',
                                borderRadius: 'var(--radius-md)',
                                border: '0.5px solid var(--color-border)',
                                background: 'var(--color-bg)',
                                color: 'var(--color-text-primary)',
                                fontSize: 13, outline: 'none',
                                fontFamily: 'var(--font)',
                                boxSizing: 'border-box',
                            }}
                        />
                    </div>

                    {/* Filtro estado */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Filter size={13} color="var(--color-text-secondary)" />
                        <select
                            value={filterStatus}
                            onChange={e => setFilterStatus(e.target.value)}
                            style={selectStyle}
                        >
                            <option value="all">Todos los estados</option>
                            {Object.entries(statusLabels).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Filtro canal */}
                    <select
                        value={filterChannel}
                        onChange={e => setFilterChannel(e.target.value)}
                        style={selectStyle}
                    >
                        <option value="all">Todos los canales</option>
                        {Object.entries(channelLabels).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>

                    {/* Limpiar filtros */}
                    {(search || filterStatus !== 'all' || filterChannel !== 'all') && (
                        <button
                            onClick={() => { setSearch(''); setFilterStatus('all'); setFilterChannel('all'); }}
                            style={{
                                padding: '8px 12px',
                                borderRadius: 'var(--radius-md)',
                                border: '0.5px solid var(--color-border)',
                                background: 'var(--color-bg)',
                                color: 'var(--color-text-secondary)',
                                fontSize: 12.5, cursor: 'pointer',
                                fontFamily: 'var(--font)',
                            }}
                        >
                            Limpiar
                        </button>
                    )}
                </div>

                {/* Tabla */}
                <div style={{
                    background: 'var(--color-surface)',
                    borderRadius: 'var(--radius-lg)',
                    border: '0.5px solid var(--color-border)',
                    padding: isMobile ? '14px' : '18px 20px',
                }}>

                    {loading && (
                        <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>Cargando...</p>
                    )}

                    {error && (
                        <p style={{ fontSize: 13, color: 'var(--color-red)' }}>{error}</p>
                    )}

                    {!loading && filtered.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--color-text-secondary)' }}>
                            <Search size={32} color="var(--color-text-muted)" style={{ margin: '0 auto 12px', display: 'block' }} />
                            <p style={{ fontSize: 15, fontWeight: 500 }}>
                                {applications.length === 0 ? 'Todavía no tenés postulaciones' : 'No hay resultados'}
                            </p>
                            <p style={{ fontSize: 13, marginTop: 4 }}>
                                {applications.length === 0
                                    ? 'Usá el botón "Nueva postulación" para empezar'
                                    : 'Probá cambiando los filtros o la búsqueda'
                                }
                            </p>
                        </div>
                    )}

                    <ApplicationTable
                        applications={filtered}
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

export default Applications;