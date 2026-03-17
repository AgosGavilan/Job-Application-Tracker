import { Pencil, Trash2 } from 'lucide-react';
import type { Application } from '../types';
import { statusLabels, statusColors, statusBgColors, channelLabels } from '../utils/statusHelpers';

interface Props {
  applications: Application[];
  onEdit: (application: Application) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: Application['status']) => void;
}

const ApplicationTable = ({ applications, onEdit, onDelete, onStatusChange }: Props) => {
  if (applications.length === 0) return null;

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {['Empresa', 'Estado', 'Canal', 'Fecha', ''].map((col) => (
              <th key={col} style={{
                fontSize: 11, fontWeight: 500,
                color: 'var(--color-text-secondary)',
                textAlign: 'left', padding: '0 10px 10px',
                borderBottom: '0.5px solid #F3F2F0',
              }}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => {
            const { id, company, position, status, channel, applied_at } = app;

            const formattedDate = new Date(applied_at).toLocaleDateString('es-AR', {
              day: '2-digit', month: 'short',
            });

            return (
              <tr key={id} style={{ borderBottom: '0.5px solid #F3F2F0' }}>

                {/* Empresa */}
                <td style={{ padding: '10px 10px', verticalAlign: 'middle' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 7,
                      background: 'var(--color-primary-light)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--color-primary)' }}>
                        {company.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{company}</div>
                      <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 1 }}>{position}</div>
                    </div>
                  </div>
                </td>

                {/* Estado */}
                <td style={{ padding: '10px 10px', verticalAlign: 'middle' }}>
                  <select
                    value={status}
                    onChange={(e) => onStatusChange(id, e.target.value as Application['status'])}
                    style={{
                      appearance: 'none',
                      background: statusBgColors[status],
                      color: statusColors[status],
                      border: 'none',
                      borderRadius: 'var(--radius-full)',
                      padding: '3px 10px',
                      fontSize: 11, fontWeight: 500,
                      cursor: 'pointer',
                      fontFamily: 'var(--font)',
                    }}
                  >
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </td>

                {/* Canal */}
                <td style={{ padding: '10px 10px', verticalAlign: 'middle', fontSize: 12, color: 'var(--color-text-secondary)' }}>
                  {channelLabels[channel]}
                </td>

                {/* Fecha */}
                <td style={{ padding: '10px 10px', verticalAlign: 'middle', fontSize: 12, color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>
                  {formattedDate}
                </td>

                {/* Acciones */}
                <td style={{ padding: '10px 10px', verticalAlign: 'middle' }}>
                  <div style={{ display: 'flex', gap: 5 }}>
                    <button
                      onClick={() => onEdit(app)}
                      style={{
                        width: 26, height: 26, borderRadius: 6,
                        border: '0.5px solid var(--color-border)',
                        background: 'var(--color-bg)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <Pencil size={11} color="var(--color-text-secondary)" />
                    </button>
                    <button
                      onClick={() => { if (confirm(`¿Eliminar la postulación en ${company}?`)) onDelete(id); }}
                      style={{
                        width: 26, height: 26, borderRadius: 6,
                        border: '0.5px solid var(--color-red-light)',
                        background: 'var(--color-red-light)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <Trash2 size={11} color="var(--color-red)" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicationTable;