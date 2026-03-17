import type { Application } from '../types';
import { statusLabels, statusColors, channelLabels } from '../utils/statusHelpers';

interface Props {
    application: Application;
    onEdit: (application: Application) => void;
    onDelete: (id: number) => void;
    onStatusChange: (id: number, status: Application['status']) => void
}

const ApplicationCard = ({ application, onEdit, onDelete, onStatusChange }: Props) => {
    const { id, company, position, status, channel, applied_at, notes } = application;

    const formattedDate = new Date(applied_at).toLocaleDateString('es-AR', {
        day: '2-digit', month: 'short', year: 'numeric'
    });

    return (
        <div style={{
            border: '1px solid #E5E7EB',
            borderRadius: 8,
            padding: 20,
            marginBottom: 12,
            backgroundColor: '#fff',
            borderLeft: `4px solid ${statusColors[status]}`,
        }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h3 style={{ margin: 0, fontSize: 18 }}>{company}</h3>
                    <p style={{ margin: '4px 0 0', color: '#6B7280', fontSize: 14 }}>{position}</p>
                </div>

                {/* Badge de estado */}
                <span style={{
                    backgroundColor: statusColors[status],
                    color: '#fff',
                    padding: '4px 10px',
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                }}>
                    {statusLabels[status]}
                </span>
            </div>

            {/* Info */}
            <div style={{ marginTop: 12, display: 'flex', gap: 16, fontSize: 13, color: '#6B7280' }}>
                <span>📅 {formattedDate}</span>
                <span>📌 {channelLabels[channel]}</span>
            </div>

            {/* Notas */}
            {notes && (
                <p style={{
                    marginTop: 10, fontSize: 13, color: '#374151',
                    backgroundColor: '#F9FAFB', padding: '8px 12px',
                    borderRadius: 6, borderLeft: '3px solid #E5E7EB'
                }}>
                    {notes}
                </p>
            )}

            {/* Acciones */}
            <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>

                {/* Cambiar estado */}
                <select
                    value={status}
                    onChange={(e) => onStatusChange(id, e.target.value as Application['status'])}
                    style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 13 }}
                >
                    {Object.entries(statusLabels).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                    ))}
                </select>

                <button
                    onClick={() => onEdit(application)}
                    style={{
                        padding: '4px 14px', borderRadius: 6, border: '1px solid #D1D5DB',
                        backgroundColor: '#fff', cursor: 'pointer', fontSize: 13,
                    }}
                >
                    ✏️ Editar
                </button>

                <button
                    onClick={() => {
                        if (confirm(`¿Eliminar la postulación en ${company}?`)) {
                            onDelete(id);
                        }
                    }}
                    style={{
                        padding: '4px 14px', borderRadius: 6, border: '1px solid #FCA5A5',
                        backgroundColor: '#FEF2F2', color: '#EF4444', cursor: 'pointer', fontSize: 13,
                    }}
                >
                    🗑️ Eliminar
                </button>
            </div>
        </div>
    );
}

export default ApplicationCard