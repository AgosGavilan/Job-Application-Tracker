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
    const [showFilters, setShowFilters] = useState(false);

    const activeFilters = (filterStatus !== 'all' ? 1 : 0) + (filterChannel !== 'all' ? 1 : 0);

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

    const pillBtn = (active: boolean): React.CSSProperties => ({
        padding: '6px 14px',
        borderRadius: 'var(--radius-full)',
        border: '0.5px solid var(--color-border)',
        background: active ? 'var(--color-primary)' : 'var(--color-bg)',
        color: active ? '#fff' : 'var(--color-text-primary)',
        fontSize: 13, fontWeight: active ? 500 : 400,
        cursor: 'pointer', fontFamily: 'var(--font)',
    });

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
                    alignItems: 'center',
                    flexWrap: 'wrap',
                }}>

                    {/* Búsqueda — siempre visible */}
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
                                boxSizing: 'border-box' as const,
                            }}
                        />
                    </div>

                    {/* Desktop — selects */}
                    {!isMobile && (
                        <>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <Filter size={13} color="var(--color-text-secondary)" />
                                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={selectStyle}>
                                    <option value="all">Todos los estados</option>
                                    {Object.entries(statusLabels).map(([value, label]) => (
                                        <option key={value} value={value}>{label}</option>
                                    ))}
                                </select>
                            </div>

                            <select value={filterChannel} onChange={e => setFilterChannel(e.target.value)} style={selectStyle}>
                                <option value="all">Todos los canales</option>
                                {Object.entries(channelLabels).map(([value, label]) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>

                            {(search || filterStatus !== 'all' || filterChannel !== 'all') && (
                                <button
                                    onClick={() => { setSearch(''); setFilterStatus('all'); setFilterChannel('all'); }}
                                    style={{
                                        padding: '8px 12px', borderRadius: 'var(--radius-md)',
                                        border: '0.5px solid var(--color-border)',
                                        background: 'var(--color-bg)',
                                        color: 'var(--color-text-secondary)',
                                        fontSize: 12.5, cursor: 'pointer', fontFamily: 'var(--font)',
                                    }}
                                >
                                    Limpiar
                                </button>
                            )}
                        </>
                    )}

                    {/* Mobile — botón filtros */}
                    {isMobile && (
                        <button
                            onClick={() => setShowFilters(true)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 6,
                                padding: '8px 12px',
                                borderRadius: 'var(--radius-md)',
                                border: '0.5px solid var(--color-border)',
                                background: activeFilters > 0 ? 'var(--color-primary-light)' : 'var(--color-bg)',
                                color: activeFilters > 0 ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                                fontSize: 13, fontWeight: activeFilters > 0 ? 500 : 400,
                                cursor: 'pointer', fontFamily: 'var(--font)',
                                flexShrink: 0,
                            }}
                        >
                            <Filter size={14} />
                            Filtros
                            {activeFilters > 0 && (
                                <span style={{
                                    width: 18, height: 18, borderRadius: '50%',
                                    background: 'var(--color-primary)',
                                    color: '#fff', fontSize: 10, fontWeight: 600,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    {activeFilters}
                                </span>
                            )}
                        </button>
                    )}
                </div>

                {/* Tabla */}
                <div style={{
                    background: 'var(--color-surface)',
                    borderRadius: 'var(--radius-lg)',
                    border: '0.5px solid var(--color-border)',
                    padding: isMobile ? '14px' : '18px 20px',
                    maxHeight: isMobile ? '60vh' : '65vh',
                    overflowY: 'auto',
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

            {/* Modales — fuera del div principal */}
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

            {/* Modal filtros mobile */}
            {isMobile && showFilters && (
                <>
                    <div
                        onClick={() => setShowFilters(false)}
                        style={{
                            position: 'fixed', inset: 0,
                            background: 'rgba(0,0,0,0.4)',
                            zIndex: 100,
                        }}
                    />
                    <div style={{
                        position: 'fixed', bottom: 0, left: 0, right: 0,
                        background: 'var(--color-surface)',
                        borderRadius: '16px 16px 0 0',
                        border: '0.5px solid var(--color-border)',
                        padding: '20px 20px 32px',
                        zIndex: 101,
                        boxShadow: 'var(--shadow-md)',
                    }}>

                        {/* Handle */}
                        <div style={{
                            width: 36, height: 4, borderRadius: 99,
                            background: 'var(--color-border)',
                            margin: '0 auto 20px',
                        }} />

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text-primary)' }}>Filtros</span>
                            {activeFilters > 0 && (
                                <button
                                    onClick={() => { setFilterStatus('all'); setFilterChannel('all'); }}
                                    style={{
                                        fontSize: 12.5, color: 'var(--color-primary)',
                                        background: 'none', border: 'none',
                                        cursor: 'pointer', fontFamily: 'var(--font)',
                                    }}
                                >
                                    Limpiar todo
                                </button>
                            )}
                        </div>

                        {/* Estado */}
                        <div style={{ marginBottom: 20 }}>
                            <label style={{
                                fontSize: 12, fontWeight: 500, color: 'var(--color-text-secondary)',
                                display: 'block', marginBottom: 8,
                                letterSpacing: '0.04em', textTransform: 'uppercase' as const,
                            }}>
                                Estado
                            </label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                {[{ value: 'all', label: 'Todos' }, ...Object.entries(statusLabels).map(([value, label]) => ({ value, label }))].map(({ value, label }) => (
                                    <button key={value} onClick={() => setFilterStatus(value)} style={pillBtn(filterStatus === value)}>
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Canal */}
                        <div style={{ marginBottom: 24 }}>
                            <label style={{
                                fontSize: 12, fontWeight: 500, color: 'var(--color-text-secondary)',
                                display: 'block', marginBottom: 8,
                                letterSpacing: '0.04em', textTransform: 'uppercase' as const,
                            }}>
                                Canal
                            </label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                {[{ value: 'all', label: 'Todos' }, ...Object.entries(channelLabels).map(([value, label]) => ({ value, label }))].map(({ value, label }) => (
                                    <button key={value} onClick={() => setFilterChannel(value)} style={pillBtn(filterChannel === value)}>
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Botón aplicar */}
                        <button
                            onClick={() => setShowFilters(false)}
                            style={{
                                width: '100%', padding: '12px',
                                background: 'var(--color-primary)', color: '#fff',
                                border: 'none', borderRadius: 'var(--radius-md)',
                                fontSize: 14, fontWeight: 500, cursor: 'pointer',
                                fontFamily: 'var(--font)',
                            }}
                        >
                            Ver {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
                        </button>
                    </div>
                </>
            )}
        </>
    );
};

export default Applications;