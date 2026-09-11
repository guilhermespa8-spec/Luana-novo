import React, { useState, useEffect } from 'react';
import { AutoPartsCatalog } from './components/AutoParts/AutoPartsCatalog';
import { Navbar } from './components/Navbar';
import { AgendaView } from './components/Agenda/AgendaView';
import { AppointmentModal } from './components/Agenda/AppointmentModal';
import { ClientsView } from './components/Clients/ClientsView';
import { ClientModal } from './components/Clients/ClientModal';
import { ClientDetailModal } from './components/Clients/ClientDetailModal';
import { Client, Appointment, AppointmentStatus, ClinicInfo } from './types';
import {
  getStoredClients,
  saveStoredClients,
  getStoredAppointments,
  saveStoredAppointments,
  getStoredClinicInfo,
} from './utils/storage';

export default function App() {
  return <AutoPartsCatalog />;

  // Navigation: strictly personal Agenda and Clients
  const [activeTab, setActiveTab] = useState<'agenda' | 'clients'>('agenda');

  // Core Data
  const [clients, setClients] = useState<Client[]>(getStoredClients);
  const [appointments, setAppointments] = useState<Appointment[]>(getStoredAppointments);
  const [clinicInfo] = useState<ClinicInfo>(getStoredClinicInfo);

  // Persistence effects
  useEffect(() => {
    saveStoredClients(clients);
  }, [clients]);

  useEffect(() => {
    saveStoredAppointments(appointments);
  }, [appointments]);

  // Modals state
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [appointmentPreDate, setAppointmentPreDate] = useState<string | undefined>();
  const [appointmentPreTime, setAppointmentPreTime] = useState<string | undefined>();
  const [appointmentPreClientId, setAppointmentPreClientId] = useState<string | undefined>();
  const [appointmentPreProcedureName, setAppointmentPreProcedureName] = useState<string | undefined>();

  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [selectedClientDetail, setSelectedClientDetail] = useState<Client | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Appointment Actions
  const handleOpenNewAppointment = (date?: string, time?: string, clientId?: string, procedureName?: string) => {
    setEditingAppointment(null);
    setAppointmentPreDate(date);
    setAppointmentPreTime(time);
    setAppointmentPreClientId(clientId);
    setAppointmentPreProcedureName(procedureName);
    setIsAppointmentModalOpen(true);
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setIsAppointmentModalOpen(true);
  };

  const handleSaveAppointment = (
    data: Omit<Appointment, 'id' | 'createdAt'>,
    existingId?: string
  ) => {
    if (existingId) {
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === existingId
            ? { ...a, ...data }
            : a
        )
      );
      showToast(`Horário de ${data.clientName} atualizado com sucesso!`);
    } else {
      const newApt: Appointment = {
        id: `apt-${Date.now()}`,
        ...data,
        createdAt: new Date().toISOString(),
      };
      setAppointments((prev) => [newApt, ...prev]);

      // If client doesn't exist in client list, auto-register them
      const exists = clients.some(
        (c) => c.id === data.clientId || c.name.toLowerCase() === data.clientName.toLowerCase()
      );
      if (!exists) {
        const newClient: Client = {
          id: data.clientId,
          name: data.clientName,
          phone: data.clientPhone,
          email: '',
          skinType: 'Mista',
          mainGoals: [data.serviceName],
          createdAt: new Date().toISOString(),
        };
        setClients((prev) => [newClient, ...prev]);
      }

      showToast(`Novo horário para ${data.clientName} registrado na agenda!`);
    }
  };

  const handleDeleteAppointment = (id: string) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
    showToast('Agendamento excluído da agenda.');
  };

  const handleUpdateStatus = (id: string, newStatus: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
    showToast(`Status atualizado para "${newStatus}".`);
  };

  // Client Actions
  const handleOpenNewClient = () => {
    setEditingClient(null);
    setIsClientModalOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setIsClientModalOpen(true);
  };

  const handleSaveClient = (
    data: Omit<Client, 'id' | 'createdAt'>,
    existingId?: string
  ) => {
    if (existingId) {
      setClients((prev) =>
        prev.map((c) => (c.id === existingId ? { ...c, ...data } : c))
      );
      if (selectedClientDetail?.id === existingId) {
        setSelectedClientDetail((prev) => (prev ? { ...prev, ...data } : null));
      }
      showToast(`Ficha de ${data.name} atualizada com sucesso!`);
    } else {
      const newClient: Client = {
        id: `cli-${Date.now()}`,
        ...data,
        createdAt: new Date().toISOString(),
      };
      setClients((prev) => [newClient, ...prev]);
      showToast(`Cliente ${data.name} cadastrada com sucesso!`);
    }
  };

  const handleDeleteClient = (id: string) => {
    setClients((prev) => prev.filter((c) => c.id !== id));
    showToast('Cadastro de cliente excluído.');
  };

  // Calculate today appointments count
  const todayIso = new Date().toISOString().split('T')[0];
  const appointmentsTodayCount = appointments.filter((a) => a.date === todayIso && a.status !== 'cancelado').length;

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-800 font-sans flex flex-col">
      {/* Professional Management Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        clinicInfo={clinicInfo}
        onOpenNewAppointment={() => handleOpenNewAppointment()}
        onOpenNewClient={handleOpenNewClient}
        appointmentsTodayCount={appointmentsTodayCount}
        totalClientsCount={clients.length}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'agenda' && (
          <AgendaView
            appointments={appointments}
            clients={clients}
            onNewAppointment={(date, time) => handleOpenNewAppointment(date, time)}
            onEditAppointment={handleEditAppointment}
            onDeleteAppointment={handleDeleteAppointment}
            onUpdateStatus={handleUpdateStatus}
          />
        )}

        {activeTab === 'clients' && (
          <ClientsView
            clients={clients}
            appointments={appointments}
            onOpenNewClient={handleOpenNewClient}
            onEditClient={handleEditClient}
            onDeleteClient={handleDeleteClient}
            onViewClientDetail={(client) => setSelectedClientDetail(client)}
            onNewAppointmentForClient={(clientId) =>
              handleOpenNewAppointment(undefined, undefined, clientId)
            }
          />
        )}
      </main>

      {/* Appointment Modal (Registrar / Editar na Agenda) */}
      <AppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={() => {
          setIsAppointmentModalOpen(false);
          setEditingAppointment(null);
        }}
        onSave={handleSaveAppointment}
        clients={clients}
        initialAppointment={editingAppointment}
        initialDate={appointmentPreDate}
        initialTime={appointmentPreTime}
        initialClientId={appointmentPreClientId}
        initialProcedureName={appointmentPreProcedureName}
      />

      {/* Client Modal (Cadastro / Edição de Cliente com dados adicionais de anamnese) */}
      <ClientModal
        isOpen={isClientModalOpen}
        onClose={() => {
          setIsClientModalOpen(false);
          setEditingClient(null);
        }}
        onSave={handleSaveClient}
        initialClient={editingClient}
      />

      {/* Client Detail Dossier Modal */}
      <ClientDetailModal
        isOpen={!!selectedClientDetail}
        onClose={() => setSelectedClientDetail(null)}
        client={selectedClientDetail}
        clientAppointments={
          selectedClientDetail
            ? appointments.filter((a) => a.clientId === selectedClientDetail.id)
            : []
        }
        onNewAppointmentForClient={(clientId) => {
          setSelectedClientDetail(null);
          handleOpenNewAppointment(undefined, undefined, clientId);
        }}
        onEditClient={(client) => {
          setSelectedClientDetail(null);
          handleEditClient(client);
        }}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-stone-900 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2.5 text-xs font-medium border border-stone-700 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span className="w-2 h-2 rounded-full bg-rose-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
