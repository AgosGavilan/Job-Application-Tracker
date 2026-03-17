import type { Application } from '../types';

export const statusLabels: Record<Application['status'], string> = {
  applied:     'Aplicado',
  in_progress: 'En proceso',
  interview:   'Entrevista',
  rejected:    'Rechazado',
  offer:       'Oferta',
};

export const statusColors: Record<Application['status'], string> = {
  applied:     '#3B82F6',  // azul
  in_progress: '#F59E0B',  // amarillo
  interview:   '#8B5CF6',  // violeta
  rejected:    '#EF4444',  // rojo
  offer:       '#10B981',  // verde
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