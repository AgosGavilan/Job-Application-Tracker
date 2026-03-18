import { Trash2 } from 'lucide-react';

interface Props {
  company: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal = ({ company, onConfirm, onCancel }: Props) => {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.35)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 200,
    }}>
      <div style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '0.5px solid var(--color-border)',
        padding: '28px 28px 24px',
        width: '100%', maxWidth: 380,
        boxShadow: 'var(--shadow-md)',
      }}>

        {/* Ícono */}
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: 'var(--color-red-light)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 16,
        }}>
          <Trash2 size={20} color="var(--color-red)" />
        </div>

        {/* Texto */}
        <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 8, letterSpacing: '-0.02em' }}>
          Eliminar postulación
        </h3>
        <p style={{ fontSize: 13.5, color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
          ¿Estás seguro que querés eliminar la postulación en{' '}
          <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{company}</span>?
          Esta acción no se puede deshacer.
        </p>

        {/* Botones */}
        <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius-md)',
              border: '0.5px solid var(--color-border)',
              background: 'var(--color-surface)',
              fontSize: 13.5, fontWeight: 500,
              color: 'var(--color-text-primary)',
              cursor: 'pointer',
              fontFamily: 'var(--font)',
            }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: 'var(--color-red)',
              fontSize: 13.5, fontWeight: 500,
              color: '#fff',
              cursor: 'pointer',
              fontFamily: 'var(--font)',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <Trash2 size={13} />
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;