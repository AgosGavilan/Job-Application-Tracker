import type { Application } from '../types';

export const statusLabels: Record<Application['status'], string> = {
  applied:     'Aplicado',
  in_progress: 'En proceso',
  interview:   'Entrevista',
  rejected:    'Rechazado',
  offer:       'Oferta',
};

export const statusColors: Record<Application['status'], string> = {
  applied:     'var(--color-primary)',
  in_progress: 'var(--color-amber)',
  interview:   'var(--color-blue)',
  rejected:    'var(--color-red)',
  offer:       'var(--color-green)',
};

export const statusBgColors: Record<Application['status'], string> = {
  applied:     'var(--color-primary-light)',
  in_progress: 'var(--color-amber-light)',
  interview:   'var(--color-blue-light)',
  rejected:    'var(--color-red-light)',
  offer:       'var(--color-green-light)',
};

export const channelLabels: Record<Application['channel'], string> = {
  linkedin: 'LinkedIn',
  web:      'Web',
  referral: 'Referido',
  other:    'Otro',
};
//Record<Application['status'], string>
//se traduce a:
//{
//    applied: string;
//    in_progress: string;
//    interview: string;
//    rejected: string;
//    offer: string;
//  }