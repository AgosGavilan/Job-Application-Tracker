import { useWindowSize } from '../hooks/useWindowSize';
import { useStats } from '../hooks/useStats';
import { useApplications } from '../hooks/useApplications';
import Navbar from '../components/NavBar';
import ApplicationForm from '../components/ApplicationForm';
import { useState } from 'react';
import type { Application } from '../types';
import { statusLabels, statusColors, statusBgColors, channelLabels } from '../utils/statusHelpers';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  AreaChart, Area,
} from 'recharts';
import { ClipboardList, TrendingUp, Users, Clock } from 'lucide-react';

const CHANNEL_COLORS: Record<string, string> = {
  linkedin: '#F97316',
  web:      '#2E6FD9',
  referral: '#1B9B5E',
  other:    '#A8A49E',
};

const KpiCard = ({ icon: Icon, iconBg, iconColor, label, value, delta, deltaUp }: any) => (
  <div style={{
    background: 'var(--color-surface)',
    borderRadius: 'var(--radius-lg)',
    border: '0.5px solid var(--color-border)',
    padding: '14px 16px',
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={15} color={iconColor} />
      </div>
      {delta && (
        <span style={{
          fontSize: 10, padding: '2px 7px', borderRadius: 'var(--radius-full)', fontWeight: 500,
          background: deltaUp ? 'var(--color-green-light)' : 'var(--color-primary-light)',
          color: deltaUp ? 'var(--color-green)' : 'var(--color-primary)',
        }}>
          {delta}
        </span>
      )}
    </div>
    <div style={{ fontSize: 26, fontWeight: 600, color: 'var(--color-text-primary)', letterSpacing: '-0.04em', lineHeight: 1 }}>{value}</div>
    <div style={{ fontSize: 11.5, color: 'var(--color-text-secondary)', marginTop: 4 }}>{label}</div>
  </div>
);

const Panel = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{
    background: 'var(--color-surface)',
    borderRadius: 'var(--radius-lg)',
    border: '0.5px solid var(--color-border)',
    padding: '18px 20px',
  }}>
    <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 16 }}>{title}</div>
    {children}
  </div>
);

const Stats = () => {
  const { isMobile } = useWindowSize();
  const { applications, createApplication } = useApplications();
  const { summary, weekly, loading } = useStats();
  const [showForm, setShowForm] = useState(false);

  const handleCreate = async (data: Partial<Application>) => {
    const result = await createApplication(data);
    if (result.success) setShowForm(false);
    return result;
  };

  if (loading) return (
    <>
      <Navbar onNewApplication={() => setShowForm(true)} />
      <div style={{ padding: isMobile ? '72px 16px' : '28px 28px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
        Cargando estadísticas...
      </div>
    </>
  );

  // Datos por estado para BarChart
  const statusData = summary?.byStatus.map(({ status, count }: any) => ({
    name: statusLabels[status as keyof typeof statusLabels] || status,
    count,
    color: statusColors[status as keyof typeof statusColors] || '#A8A49E',
  })) || [];

  // Datos por canal para PieChart
  const channelData = Object.entries(
    applications.reduce((acc, app) => {
      acc[app.channel] = (acc[app.channel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([channel, count]) => ({
    name: channelLabels[channel as keyof typeof channelLabels] || channel,
    value: count,
    color: CHANNEL_COLORS[channel] || '#A8A49E',
  }));

  // Postulaciones activas (no rechazadas)
  const active = applications
    .filter(a => a.status !== 'rejected')
    .slice(0, 5);

  const interviews = summary?.byStatus.find((s: any) => s.status === 'interview')?.count || 0;
  //const offers = summary?.byStatus.find((s: any) => s.status === 'offer')?.count || 0;

  const customTooltipStyle = {
    background: 'var(--color-surface)',
    border: '0.5px solid var(--color-border)',
    borderRadius: 8,
    fontSize: 12,
    color: 'var(--color-text-primary)',
  };

  return (
    <>
      <Navbar onNewApplication={() => setShowForm(true)} />

      <div style={{ padding: isMobile ? '72px 16px 16px' : '28px 28px', maxWidth: 1200, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: isMobile ? 20 : 22, fontWeight: 600, color: 'var(--color-text-primary)', letterSpacing: '-0.03em' }}>
            Estadísticas
          </h1>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 3 }}>
            Resumen completo de tu búsqueda laboral
          </p>
        </div>

        {/* KPIs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap: 10, marginBottom: 16,
        }}>
          <KpiCard icon={ClipboardList} iconBg="var(--color-primary-light)" iconColor="var(--color-primary)" label="Total postulaciones" value={summary?.total || 0} delta="total" deltaUp={false} />
          <KpiCard icon={TrendingUp} iconBg="var(--color-green-light)" iconColor="var(--color-green)" label="Tasa de respuesta" value={`${summary?.responseRate || 0}%`} delta={summary?.responseRate ? `↑${summary.responseRate}%` : null} deltaUp={true} />
          <KpiCard icon={Users} iconBg="var(--color-blue-light)" iconColor="var(--color-blue)" label="Entrevistas" value={interviews} delta={interviews > 0 ? `+${interviews}` : null} deltaUp={true} />
          <KpiCard icon={Clock} iconBg="var(--color-primary-light)" iconColor="var(--color-primary)" label="Días prom. respuesta" value={`${summary?.avgResponseDays || 0} d`} delta="promedio" deltaUp={false} />
        </div>

        {/* Gráficos */}
        {summary?.total === 0 ? (
          <div style={{
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '0.5px solid var(--color-border)',
            padding: '60px 20px', textAlign: 'center',
            color: 'var(--color-text-secondary)',
          }}>
            <ClipboardList size={36} color="var(--color-text-muted)" style={{ margin: '0 auto 12px', display: 'block' }} />
            <p style={{ fontSize: 15, fontWeight: 500 }}>Sin datos todavía</p>
            <p style={{ fontSize: 13, marginTop: 4 }}>Agregá postulaciones para ver las estadísticas</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: 12,
          }}>

            {/* Por estado */}
            <Panel title="Postulaciones por estado">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={statusData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F2F0" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6B6860' }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#6B6860' }} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={customTooltipStyle} formatter={(v) => [`${v} postulaciones`, '']} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {statusData.map((entry: any, index: number) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Panel>

            {/* Por canal */}
            <Panel title="Por canal">
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <ResponsiveContainer width="50%" height={160}>
                  <PieChart>
                    <Pie
                      data={channelData}
                      cx="50%" cy="50%"
                      innerRadius={45} outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {channelData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={customTooltipStyle} formatter={(v) => [`${v} postulaciones`, '']} />
                  </PieChart>
                </ResponsiveContainer>

                {/* Leyenda manual */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {channelData.map((entry, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: entry.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: 'var(--color-text-secondary)', flex: 1 }}>{entry.name}</span>
                      <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-text-primary)' }}>{entry.value}</span>
                      <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>
                        {Math.round((entry.value / applications.length) * 100)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Panel>

            {/* Tendencia semanal */}
            <Panel title="Tendencia semanal">
              {weekly.length > 0 ? (
                <ResponsiveContainer width="100%" height={160}>
                  <AreaChart data={weekly} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                    <defs>
                      <linearGradient id="statsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#F97316" stopOpacity={0.15} />
                        <stop offset="100%" stopColor="#F97316" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F2F0" vertical={false} />
                    <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#6B6860' }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#6B6860' }} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip contentStyle={customTooltipStyle} formatter={(v) => [`${v} postulaciones`, '']} />
                    <Area type="monotone" dataKey="count" stroke="#F97316" strokeWidth={2} fill="url(#statsGrad)" dot={{ r: 3, fill: '#F97316', strokeWidth: 0 }} activeDot={{ r: 4 }} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <p style={{ fontSize: 12.5, color: 'var(--color-text-secondary)', textAlign: 'center', padding: '40px 0' }}>
                  Agregá postulaciones con distintas fechas para ver la tendencia
                </p>
              )}
            </Panel>

            {/* Postulaciones activas */}
            <Panel title="Postulaciones activas">
              {active.length === 0 ? (
                <p style={{ fontSize: 12.5, color: 'var(--color-text-secondary)', textAlign: 'center', padding: '40px 0' }}>
                  No hay postulaciones activas
                </p>
              ) : (
                <div>
                  {active.map((app, i) => (
                    <div key={app.id} style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '8px 0',
                      borderBottom: i < active.length - 1 ? '0.5px solid var(--color-border)' : 'none',
                    }}>
                      <span style={{ fontSize: 11, color: 'var(--color-text-secondary)', width: 14, flexShrink: 0 }}>{i + 1}</span>
                      <div style={{
                        width: 28, height: 28, borderRadius: 7,
                        background: 'var(--color-primary-light)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 9, fontWeight: 600, color: 'var(--color-primary)',
                        flexShrink: 0,
                      }}>
                        {app.company.slice(0, 2).toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)' }}>{app.company}</div>
                        <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 1 }}>{app.position}</div>
                      </div>
                      <span style={{
                        padding: '3px 9px', borderRadius: 'var(--radius-full)',
                        fontSize: 10.5, fontWeight: 500, flexShrink: 0,
                        background: statusBgColors[app.status],
                        color: statusColors[app.status],
                      }}>
                        {statusLabels[app.status]}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Panel>

          </div>
        )}
      </div>

      {showForm && (
        <ApplicationForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}
    </>
  );
};

export default Stats;