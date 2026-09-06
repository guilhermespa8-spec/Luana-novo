import { Client, Service, Appointment, ClinicInfo } from '../types';
import { initialClients, initialServices, getInitialAppointments, initialClinicInfo } from '../data/mockData';

const KEYS = {
  CLIENTS: 'estetica_clients_v1',
  SERVICES: 'estetica_services_v1',
  APPOINTMENTS: 'estetica_appointments_v1',
  CLINIC: 'estetica_clinic_info_v1',
};

export const getStoredClients = (): Client[] => {
  try {
    const item = localStorage.getItem(KEYS.CLIENTS);
    return item ? JSON.parse(item) : initialClients;
  } catch (e) {
    console.error('Failed to load clients', e);
    return initialClients;
  }
};

export const saveStoredClients = (clients: Client[]): void => {
  try {
    localStorage.setItem(KEYS.CLIENTS, JSON.stringify(clients));
  } catch (e) {
    console.error('Failed to save clients', e);
  }
};

export const getStoredServices = (): Service[] => {
  try {
    const item = localStorage.getItem(KEYS.SERVICES);
    return item ? JSON.parse(item) : initialServices;
  } catch (e) {
    console.error('Failed to load services', e);
    return initialServices;
  }
};

export const saveStoredServices = (services: Service[]): void => {
  try {
    localStorage.setItem(KEYS.SERVICES, JSON.stringify(services));
  } catch (e) {
    console.error('Failed to save services', e);
  }
};

export const getStoredAppointments = (): Appointment[] => {
  try {
    const item = localStorage.getItem(KEYS.APPOINTMENTS);
    return item ? JSON.parse(item) : getInitialAppointments();
  } catch (e) {
    console.error('Failed to load appointments', e);
    return getInitialAppointments();
  }
};

export const saveStoredAppointments = (appointments: Appointment[]): void => {
  try {
    localStorage.setItem(KEYS.APPOINTMENTS, JSON.stringify(appointments));
  } catch (e) {
    console.error('Failed to save appointments', e);
  }
};

export const getStoredClinicInfo = (): ClinicInfo => {
  try {
    const item = localStorage.getItem(KEYS.CLINIC);
    return item ? JSON.parse(item) : initialClinicInfo;
  } catch (e) {
    return initialClinicInfo;
  }
};

export const saveStoredClinicInfo = (info: ClinicInfo): void => {
  try {
    localStorage.setItem(KEYS.CLINIC, JSON.stringify(info));
  } catch (e) {
    console.error('Failed to save clinic info', e);
  }
};

export const formatCurrency = (val: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(val);
};

export const formatDatePtBR = (dateStr: string): string => {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  if (!y || !m || !d) return dateStr;
  return `${d}/${m}/${y}`;
};

export const getStatusBadgeClass = (status: string): { bg: string; text: string; border: string; label: string } => {
  switch (status) {
    case 'confirmado':
      return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Confirmado' };
    case 'concluido':
      return { bg: 'bg-stone-100', text: 'text-stone-700', border: 'border-stone-300', label: 'Concluído' };
    case 'cancelado':
      return { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', label: 'Cancelado' };
    case 'agendado':
    default:
      return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: 'Agendado' };
  }
};

export const createWhatsAppUrl = (phone: string, text: string): string => {
  const cleanPhone = phone.replace(/\D/g, '');
  const target = cleanPhone.length <= 11 ? `55${cleanPhone}` : cleanPhone;
  return `https://wa.me/${target}?text=${encodeURIComponent(text)}`;
};
