import { ClipboardList, Users, TrendingUp, Star, Clock } from 'lucide-react';
import {
  XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Area, AreaChart
} from 'recharts';
import { useStats } from '../hooks/useStats';
import { statusLabels } from '../utils/statusHelpers';

interface Props {
  refetchTrigger?: number;
}

const STATUS_COLORS: Record<string, string> = {
  applied:     '#F97316',
  in_progress: '#D08A00',
  interview:   '#2E6FD9',
  rejected:    '#E5432A',
  offer:       '#1B9B5E',
};

const StatCard = ({ icon: Icon, iconBg, iconColor, label, value, delta, deltaUp }: any) => (
  <div style={{
    background: 'var(--color-surface)',
    borderRadius: 10,
    border: '0.5px solid var(--color-border)',
    padding: '10px 14px',
    display: 'flex', alignItems: 'center', gap: 10,
  }}>
    <div style={{
      width: 32, height: 32, borderRadius: 8,
      background: iconBg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <Icon size={14} color={iconColor} />
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--color-text-primary)', letterSpacing: '-0.03em', lineHeight: 1 }}>{value}</div>
    </div>
    {delta && (
      <span style={{
        fontSize: 10, padding: '2px 6px',
        borderRadius: 'var(--radius-full)', fontWeight: 500,
        background: deltaUp ? 'var(--color-green-light)' : 'var(--color-primary-light)',
        color: deltaUp ? 'var(--color-green)' : 'var(--color-primary)',
        flexShrink: 0, whiteSpace: 'nowrap',
      }}>
        {delta}
      </span>
    )}
  </div>
);

const StatsPanel = ({ refetchTrigger }: Props) => {
  const { summary, weekly, loading } = useStats(refetchTrigger);

  if (loading) return <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>Cargando estadísticas...</p>;
  if (!summary) return null;

  const barData = summary.byStatus.map(({ status, count }) => ({
    name: statusLabels[status as keyof typeof statusLabels] || status,
    count,
    color: STATUS_COLORS[status] || '#A8A49E',
  }));

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 230px',
      gap: 14,
      marginBottom: 24,
    }}>

      {/* CENTRO — Gráficos */}
      <div style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '0.5px solid var(--color-border)',
        padding: '18px 20px',
      }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 16 }}>
          Análisis de postulaciones
        </div>

        <div style={{ display: 'flex', gap: 20 }}>

          {/* Barras horizontales por estado */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10.5, color: 'var(--color-text-secondary)', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 12 }}>
              Por estado
            </div>
            {barData.map(({ name, count, color }) => {
              const pct = summary.total > 0 ? Math.round((count / summary.total) * 100) : 0;
              return (
                <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 9 }}>
                  <div style={{ fontSize: 11.5, color: '#4A4640', width: 76, flexShrink: 0 }}>{name}</div>
                  <div style={{ flex: 1, height: 7, background: '#F3F2F0', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 99, transition: 'width 0.4s ease' }} />
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', width: 16, textAlign: 'right', fontWeight: 500 }}>{count}</div>
                </div>
              );
            })}
          </div>

          {/* Línea tendencia semanal */}
          <div style={{ width: 160, flexShrink: 0 }}>
            <div style={{ fontSize: 10.5, color: 'var(--color-text-secondary)', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 12 }}>
              Tendencia semanal
            </div>
            {weekly.length > 0 ? (
              <ResponsiveContainer width="100%" height={90}>
                <AreaChart data={weekly} margin={{ top: 4, right: 4, left: -30, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F97316" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="#F97316" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F2F0" vertical={false} />
                  <XAxis dataKey="week" tick={{ fontSize: 9, fill: '#C8C5BF' }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: '#C8C5BF' }} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: '0.5px solid var(--color-border)', fontSize: 12 }}
                    formatter={(v) => [`${v} postulaciones`, '']}
                  />
                  <Area type="monotone" dataKey="count" stroke="#F97316" strokeWidth={2} fill="url(#colorGrad)" dot={{ r: 3, fill: '#F97316', strokeWidth: 0 }} activeDot={{ r: 4 }} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <p style={{ fontSize: 11.5, color: 'var(--color-text-secondary)', marginTop: 8 }}>
                Agregá postulaciones con distintas fechas para ver la tendencia.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* DERECHA — Stat cards compactas */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <StatCard
          icon={ClipboardList}
          iconBg="var(--color-primary-light)"
          iconColor="var(--color-primary)"
          label="Postulaciones"
          value={summary.total}
          delta="total"
          deltaUp={false}
        />
        <StatCard
          icon={Users}
          iconBg="var(--color-green-light)"
          iconColor="var(--color-green)"
          label="Entrevistas"
          value={summary.byStatus.find(s => s.status === 'interview')?.count || 0}
          delta={summary.byStatus.find(s => s.status === 'interview')?.count ? `+${summary.byStatus.find(s => s.status === 'interview')?.count}` : null}
          deltaUp={true}
        />
        <StatCard
          icon={TrendingUp}
          iconBg="var(--color-amber-light)"
          iconColor="var(--color-amber)"
          label="Tasa de respuesta"
          value={`${summary.responseRate}%`}
          delta={summary.responseRate > 0 ? `↑${summary.responseRate}%` : null}
          deltaUp={true}
        />
        <StatCard
          icon={Star}
          iconBg="var(--color-green-light)"
          iconColor="var(--color-green)"
          label="Ofertas recibidas"
          value={summary.byStatus.find(s => s.status === 'offer')?.count || 0}
          delta={summary.byStatus.find(s => s.status === 'offer')?.count ? '¡nuevo!' : null}
          deltaUp={true}
        />
        <StatCard
          icon={Clock}
          iconBg="var(--color-primary-light)"
          iconColor="var(--color-primary)"
          label="Días prom. respuesta"
          value={`${summary.avgResponseDays}d`}
          delta="prom."
          deltaUp={false}
        />
      </div>
    </div>
  );
};

export default StatsPanel;