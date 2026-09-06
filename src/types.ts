export type SkinType = 'Normal' | 'Oleosa' | 'Seca' | 'Mista' | 'Sensível';

export type AestheticCategory = 'facial' | 'corporal';

export type AppointmentStatus = 'agendado' | 'confirmado' | 'concluido' | 'cancelado';

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  birthDate?: string;
  cpf?: string;
  skinType?: SkinType;
  mainGoals: string[]; // e.g., 'Acne', 'Manchas', 'Rejuvenescimento', 'Gordura Localizada', 'Celulite'
  allergies?: string;
  notes?: string;
  createdAt: string;
}

export interface Service {
  id: string;
  name: string;
  category: AestheticCategory;
  durationMinutes: number;
  price: number;
  description: string;
  benefits: string[];
  imageUrl: string;
}

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  serviceId: string;
  serviceName: string;
  category: AestheticCategory;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  durationMinutes: number;
  price: number;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
}

export interface ClinicInfo {
  name: string;
  tagline: string;
  ownerName: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  instagram: string;
  workingHours: string;
}
