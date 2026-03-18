import { useState, useEffect } from 'react';
import type { Application } from '../types';
import { statusLabels, channelLabels } from '../utils/statusHelpers';

interface Props {
  initial?: Application | null;
  onSubmit: (data: Partial<Application>) => Promise<{ success: boolean; error?: string }>;
  onCancel: () => void;
}

const ApplicationForm = ({ initial, onSubmit, onCancel }: Props) => {
  const [form, setForm] = useState({
    company:        initial?.company || '',
    position:       initial?.position || '',
    status:         initial?.status || 'applied',
    channel:        initial?.channel || 'other',
    applied_at:     initial?.applied_at?.slice(0, 10) || new Date().toISOString().slice(0, 10),
    notes:          initial?.notes || '',
    follow_up_date: initial?.follow_up_date?.slice(0, 10) || '',
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initial) {
      setForm({
        company:        initial.company,
        position:       initial.position,
        status:         initial.status,
        channel:        initial.channel,
        applied_at:     initial.applied_at.slice(0, 10),
        notes:          initial.notes || '',
        follow_up_date: initial.follow_up_date?.slice(0, 10) || '',
      });
    }
  }, [initial]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await onSubmit({
      ...form,
      follow_up_date: form.follow_up_date || null,
      notes: form.notes || null,
    } as Partial<Application>);

    setLoading(false);
    if (!result.success) {
      setError(result.error || 'Error al guardar');
    }
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 500,
    color: 'var(--color-text-primary)',
    display: 'block',
    marginBottom: 6,
  };

  const inputStyle: React.CSSProperties = {
    display: 'block',
    width: '100%',
    padding: '9px 12px',
    borderRadius: 'var(--radius-md)',
    border: '0.5px solid var(--color-border)',
    fontSize: 13.5,
    background: 'var(--color-bg)',
    color: 'var(--color-text-primary)',
    outline: 'none',
    fontFamily: 'var(--font)',
    boxSizing: 'border-box',
  };

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 100, padding: '16px',
    }}>
      <div style={{
        background: 'var(--color-surface)',
        border: '0.5px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '28px 28px',
        width: '100%', maxWidth: 500,
        maxHeight: '90vh', overflowY: 'auto',
        boxShadow: 'var(--shadow-md)',
      }}>
        <h2 style={{
          fontSize: 17, fontWeight: 600,
          color: 'var(--color-text-primary)',
          letterSpacing: '-0.02em',
          marginBottom: 22,
        }}>
          {initial ? 'Editar postulación' : 'Nueva postulación'}
        </h2>

        {error && (
          <div style={{
            background: 'var(--color-red-light)',
            color: 'var(--color-red)',
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            fontSize: 13, marginBottom: 18,
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Empresa */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Empresa *</label>
            <input
              name="company"
              value={form.company}
              onChange={handleChange}
              required
              placeholder="Ej: Google, Mercado Libre..."
              style={inputStyle}
            />
          </div>

          {/* Puesto */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Puesto *</label>
            <input
              name="position"
              value={form.position}
              onChange={handleChange}
              required
              placeholder="Ej: Frontend Developer"
              style={inputStyle}
            />
          </div>

          {/* Estado y Canal */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>Estado</label>
              <select name="status" value={form.status} onChange={handleChange} style={inputStyle}>
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Canal</label>
              <select name="channel" value={form.channel} onChange={handleChange} style={inputStyle}>
                {Object.entries(channelLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Fechas */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>Fecha de postulación *</label>
              <input
                type="date"
                name="applied_at"
                value={form.applied_at}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Follow-up (opcional)</label>
              <input
                type="date"
                name="follow_up_date"
                value={form.follow_up_date}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Notas */}
          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>Notas (opcional)</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Preguntas de entrevista, contactos, feedback..."
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          {/* Botones */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onCancel}
              style={{
                padding: '9px 20px',
                borderRadius: 'var(--radius-md)',
                border: '0.5px solid var(--color-border)',
                background: 'var(--color-surface)',
                color: 'var(--color-text-primary)',
                fontSize: 13.5, fontWeight: 500,
                cursor: 'pointer',
                fontFamily: 'var(--font)',
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '9px 20px',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                background: 'var(--color-primary)',
                color: '#fff',
                fontSize: 13.5, fontWeight: 500,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                fontFamily: 'var(--font)',
              }}
            >
              {loading ? 'Guardando...' : initial ? 'Guardar cambios' : 'Crear postulación'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;