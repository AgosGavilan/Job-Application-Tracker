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
        company: initial?.company || '',
        position: initial?.position || '',
        status: initial?.status || 'applied',
        channel: initial?.channel || 'other',
        applied_at: initial?.applied_at?.slice(0, 10) || new Date().toISOString().slice(0, 10),
        notes: initial?.notes || '',
        follow_up_date: initial?.follow_up_date?.slice(0, 10) || '',
    });

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initial) {
            setForm({
                company: initial.company,
                position: initial.position,
                status: initial.status,
                channel: initial.channel,
                applied_at: initial.applied_at.slice(0, 10),
                notes: initial.notes || '',
                follow_up_date: initial.follow_up_date?.slice(0, 10) || '',
            });
        }
    }, [initial]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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

    const fieldStyle = {
        display: 'block', width: '100%', padding: '8px 10px',
        marginTop: 4, borderRadius: 6, border: '1px solid #D1D5DB',
        fontSize: 14, boxSizing: 'border-box' as const,
    };

    const labelStyle = { fontSize: 13, fontWeight: 600, color: '#374151' };

    return (
        <div style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
        }}>
            <div style={{
                backgroundColor: '#fff', borderRadius: 12, padding: 32,
                width: '100%', maxWidth: 500, maxHeight: '90vh', overflowY: 'auto',
            }}>
                <h2 style={{ margin: '0 0 24px' }}>
                    {initial ? 'Editar postulación' : 'Nueva postulación'}
                </h2>

                {error && <p style={{ color: 'red', marginBottom: 16 }}>{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: 16 }}>
                        <label style={labelStyle}>Empresa *</label>
                        <input name="company" value={form.company} onChange={handleChange} required style={fieldStyle} />
                    </div>

                    <div style={{ marginBottom: 16 }}>
                        <label style={labelStyle}>Puesto *</label>
                        <input name="position" value={form.position} onChange={handleChange} required style={fieldStyle} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                        <div>
                            <label style={labelStyle}>Estado</label>
                            <select name="status" value={form.status} onChange={handleChange} style={fieldStyle}>
                                {Object.entries(statusLabels).map(([value, label]) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={labelStyle}>Canal</label>
                            <select name="channel" value={form.channel} onChange={handleChange} style={fieldStyle}>
                                {Object.entries(channelLabels).map(([value, label]) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                        <div>
                            <label style={labelStyle}>Fecha de postulación *</label>
                            <input type="date" name="applied_at" value={form.applied_at} onChange={handleChange} required style={fieldStyle} />
                        </div>

                        <div>
                            <label style={labelStyle}>Seguimiento (opcional)</label>
                            <input type="date" name="follow_up_date" value={form.follow_up_date} onChange={handleChange} style={fieldStyle} />
                        </div>
                    </div>

                    <div style={{ marginBottom: 24 }}>
                        <label style={labelStyle}>Notas (opcional)</label>
                        <textarea
                            name="notes" value={form.notes} onChange={handleChange}
                            rows={3} style={{ ...fieldStyle, resize: 'vertical' }}
                            placeholder="Preguntas de entrevista, contactos, feedback..."
                        />
                    </div>

                    <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                        <button
                            type="button" onClick={onCancel}
                            style={{ padding: '8px 20px', borderRadius: 6, border: '1px solid #D1D5DB', backgroundColor: '#fff', cursor: 'pointer' }}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit" disabled={loading}
                            style={{ padding: '8px 20px', borderRadius: 6, border: 'none', backgroundColor: '#3B82F6', color: '#fff', cursor: 'pointer', fontWeight: 600 }}
                        >
                            {loading ? 'Guardando...' : initial ? 'Guardar cambios' : 'Crear postulación'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ApplicationForm;