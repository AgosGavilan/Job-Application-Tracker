import { useState } from 'react';
import { ClipboardList, Users, TrendingUp, Star, Clock, BarChart2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStats } from '../hooks/useStats';
import { statusLabels } from '../utils/statusHelpers';
import type { Application } from '../types';
import { useWindowSize } from '../hooks/useWindowSize';

interface Props {
  refetchTrigger?: number;
  applications: Application[];
}

const STATUS_COLORS: Record<string, string> = {
  applied:     '#F97316',
  in_progress: '#D08A00',
  interview:   '#2E6FD9',
  rejected:    '#E5432A',
  offer:       '#1B9B5E',
};

// ─── Calendario ───────────────────────────────────────────────
const Calendar = ({ applications }: { applications: Application[] }) => {
  const today = new Date();
  const [current, setCurrent] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year = current.getFullYear();
  const month = current.getMonth();

  const monthName = current.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });
  const capitalized = monthName.charAt(0).toUpperCase() + monthName.slice(1);

  // Contar postulaciones por día
  const countsByDay: Record<string, number> = {};
  applications.forEach(app => {
    const d = new Date(app.applied_at + 'T00:00:00');
    if (d.getFullYear() === year && d.getMonth() === month) {
      const key = d.getDate().toString();
      countsByDay[key] = (countsByDay[key] || 0) + 1;
    }
  });

  // Primer día del mes (0=Dom, ajustamos a Lun=0)
  const firstDay = new Date(year, month, 1).getDay();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells: { day: number; type: 'prev' | 'current' | 'next' }[] = [];

  for (let i = startOffset - 1; i >= 0; i--) {
    cells.push({ day: daysInPrevMonth - i, type: 'prev' });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    cells.push({ day: i, type: 'current' });
  }
  while (cells.length % 7 !== 0) {
    cells.push({ day: cells.filter(c => c.type === 'next').length + 1, type: 'next' });
  }

  const isToday = (day: number) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const prevMonth = () => setCurrent(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrent(new Date(year, month + 1, 1));

  const dayLabels = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-primary)' }}>
          {capitalized}
        </span>
        <div style={{ display: 'flex', gap: 3 }}>
          <button
            onClick={prevMonth}
            style={{
              width: 22, height: 22, borderRadius: 6,
              border: '0.5px solid var(--color-border)',
              background: 'var(--color-bg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <ChevronLeft size={12} color="var(--color-text-secondary)" />
          </button>
          <button
            onClick={nextMonth}
            style={{
              width: 22, height: 22, borderRadius: 6,
              border: '0.5px solid var(--color-border)',
              background: 'var(--color-bg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <ChevronRight size={12} color="var(--color-text-secondary)" />
          </button>
        </div>
      </div>

      {/* Grilla */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>

        {/* Labels días */}
        {dayLabels.map(d => (
          <div key={d} style={{
            fontSize: 9.5, color: 'var(--color-text-muted)',
            textAlign: 'center', paddingBottom: 4, fontWeight: 500,
          }}>
            {d}
          </div>
        ))}

        {/* Celdas */}
        {cells.map((cell, i) => {
          const count = cell.type === 'current' ? (countsByDay[cell.day.toString()] || 0) : 0;
          const isCurrentToday = cell.type === 'current' && isToday(cell.day);

          return (
            <div
              key={i}
              style={{
                aspectRatio: '1',
                borderRadius: 6,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10.5,
                fontWeight: isCurrentToday ? 600 : 400,
                color: cell.type !== 'current'
                  ? 'var(--color-text-muted)'
                  : isCurrentToday
                    ? 'var(--color-primary)'
                    : 'var(--color-text-primary)',
                background: isCurrentToday ? 'var(--color-primary-light)' : 'transparent',
                position: 'relative',
              }}
            >
              {cell.day}

              {/* Punto */}
              {count > 0 && (
                <div style={{
                  position: 'absolute',
                  bottom: 2,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: count > 1 ? 5 : 4,
                  height: count > 1 ? 5 : 4,
                  borderRadius: '50%',
                  background: count > 1 ? '#EA580C' : 'var(--color-primary)',
                }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── StatCard ─────────────────────────────────────────────────
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
      <div style={{
        fontSize: 18, fontWeight: 600,
        color: 'var(--color-text-primary)',
        letterSpacing: '-0.03em', lineHeight: 1,
      }}>
        {value}
      </div>
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

// ─── StatsPanel ───────────────────────────────────────────────
const StatsPanel = ({ refetchTrigger, applications }: Props) => {
  const { summary, loading } = useStats(refetchTrigger);
  const { isMobile } = useWindowSize();

  if (loading) return (
    <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 24 }}>
      Cargando estadísticas...
    </p>
  );

  if (!summary) return null;

  const barData = summary.byStatus.map(({ status, count }: { status: string; count: number }) => ({
    name: statusLabels[status as keyof typeof statusLabels] || status,
    count,
    color: STATUS_COLORS[status] || '#A8A49E',
  }));

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 230px',
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

        {summary.total === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--color-text-secondary)' }}>
            <BarChart2 size={32} color="var(--color-text-muted)" style={{ margin: '0 auto 10px', display: 'block' }} />
            <p style={{ fontSize: 14, fontWeight: 500 }}>Sin datos todavía</p>
            <p style={{ fontSize: 12.5, marginTop: 4 }}>
              Agregá tu primera postulación para ver el análisis
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 16 : 24 }}>

            {/* Barras horizontales */}
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: 10.5, color: 'var(--color-text-secondary)',
                fontWeight: 500, letterSpacing: '0.04em',
                textTransform: 'uppercase', marginBottom: 12,
              }}>
                Por estado
              </div>
              {barData.map(({ name, count, color }: { name: string; count: number; color: string }) => {
                const pct = summary.total > 0 ? Math.round((count / summary.total) * 100) : 0;
                return (
                  <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 9 }}>
                    <div style={{ fontSize: 11.5, color: '#4A4640', width: 76, flexShrink: 0 }}>{name}</div>
                    <div style={{ flex: 1, height: 7, background: '#F3F2F0', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{
                        width: `${pct}%`, height: '100%',
                        background: color, borderRadius: 99,
                        transition: 'width 0.4s ease',
                      }} />
                    </div>
                    <div style={{
                      fontSize: 11, color: 'var(--color-text-secondary)',
                      width: 16, textAlign: 'right', fontWeight: 500,
                    }}>
                      {count}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Separador */}
            <div style={{ width: '0.5px', background: 'var(--color-border)', flexShrink: 0 }} />

            {/* Calendario */}
            <div style={{ width: 168, flexShrink: 0 }}>
              <div style={{
                fontSize: 10.5, color: 'var(--color-text-secondary)',
                fontWeight: 500, letterSpacing: '0.04em',
                textTransform: 'uppercase', marginBottom: 12,
              }}>
                Actividad mensual
              </div>
              <Calendar applications={applications} />
            </div>
          </div>
        )}
      </div>

      {/* DERECHA — Stat cards */}
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
          value={summary.byStatus.find((s: any) => s.status === 'interview')?.count || 0}
          delta={summary.byStatus.find((s: any) => s.status === 'interview')?.count
            ? `+${summary.byStatus.find((s: any) => s.status === 'interview')?.count}`
            : null}
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
          value={summary.byStatus.find((s: any) => s.status === 'offer')?.count || 0}
          delta={summary.byStatus.find((s: any) => s.status === 'offer')?.count ? '¡nuevo!' : null}
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