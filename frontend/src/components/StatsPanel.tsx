import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer
} from 'recharts';
import { useStats } from '../hooks/useStats';
import { statusLabels } from '../utils/statusHelpers';

interface Props {
    refetchTrigger?: number;
  }
  

const StatsPanel = ({ refetchTrigger }: Props) => {
    const { summary, weekly, loading } = useStats(refetchTrigger);

    if (loading) return <p style={{ color: '#6B7280' }}>Cargando estadísticas...</p>;
    if (!summary) return null;

    return (
        <div style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 20, marginBottom: 20 }}>Estadísticas</h2>

            {/* Tarjetas de resumen */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap' }}>

                <div style={cardStyle}>
                    <p style={{ ...numberStyle, color: '#3B82F6' }}>{summary.total}</p>
                    <p style={labelStyle}>Total postulaciones</p>
                </div>

                <div style={cardStyle}>
                    <p style={{ ...numberStyle, color: '#10B981' }}>{summary.responseRate}%</p>
                    <p style={labelStyle}>Tasa de respuesta</p>
                </div>

                <div style={cardStyle}>
                    <p style={{ ...numberStyle, color: '#8B5CF6' }}>{summary.avgResponseDays}</p>
                    <p style={labelStyle}>Días promedio de respuesta</p>
                </div>

            </div>

            {/* Desglose por estado */}
            <div style={{ marginBottom: 32 }}>
                <h3 style={{ fontSize: 15, color: '#374151', marginBottom: 12 }}>Por estado</h3>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {summary.byStatus.map(({ status, count }) => (
                        <div key={status} style={{
                            padding: '8px 16px', borderRadius: 8,
                            backgroundColor: '#F3F4F6', fontSize: 13,
                        }}>
                            <span style={{ fontWeight: 600 }}>{count}</span>
                            {' '}{statusLabels[status as keyof typeof statusLabels] || status}
                        </div>
                    ))}
                </div>
            </div>

            {/* Gráfico semanal */}
            {weekly.length > 0 && (
                <div>
                    <h3 style={{ fontSize: 15, color: '#374151', marginBottom: 12 }}>
                        Postulaciones por semana (últimas 8 semanas)
                    </h3>
                    <div style={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, padding: 20 }}>
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={weekly} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                                <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#6B7280' }} />
                                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 13 }}
                                    formatter={(value) => [`${value} postulaciones`, '']}
                                />
                                <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {weekly.length === 0 && (
                <p style={{ color: '#9CA3AF', fontSize: 14 }}>
                    Todavía no hay datos semanales. Agregá postulaciones con distintas fechas para ver el gráfico.
                </p>
            )}
        </div>
    );
};

const cardStyle: React.CSSProperties = {
    flex: 1, minWidth: 140, padding: '16px 20px',
    borderRadius: 8, backgroundColor: '#fff',
    border: '1px solid #E5E7EB', textAlign: 'center',
};

const numberStyle: React.CSSProperties = {
    margin: 0, fontSize: 32, fontWeight: 700,
};

const labelStyle: React.CSSProperties = {
    margin: '4px 0 0', fontSize: 12, color: '#6B7280',
};

export default StatsPanel;