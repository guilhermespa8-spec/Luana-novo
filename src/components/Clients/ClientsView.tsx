import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  ShieldAlert,
  Calendar,
  Sparkles,
  ExternalLink,
  Edit2,
  Trash2,
  Filter,
  UserCheck,
} from 'lucide-react';
import { Client, Appointment, SkinType } from '../../types';
import { createWhatsAppUrl, formatDatePtBR } from '../../utils/storage';

interface ClientsViewProps {
  clients: Client[];
  appointments: Appointment[];
  onOpenNewClient: () => void;
  onEditClient: (client: Client) => void;
  onDeleteClient: (id: string) => void;
  onViewClientDetail: (client: Client) => void;
  onNewAppointmentForClient: (clientId: string) => void;
}

export const ClientsView: React.FC<ClientsViewProps> = ({
  clients,
  appointments,
  onOpenNewClient,
  onEditClient,
  onDeleteClient,
  onViewClientDetail,
  onNewAppointmentForClient,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [skinTypeFilter, setSkinTypeFilter] = useState<string>('all');

  // Filter clients
  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery) ||
        (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (c.mainGoals && c.mainGoals.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchSkin = skinTypeFilter === 'all' || c.skinType === skinTypeFilter;

      return matchSearch && matchSkin;
    });
  }, [clients, searchQuery, skinTypeFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = clients.length;
    const withAllergies = clients.filter((c) => !!c.allergies).length;
    const activeThisMonth = new Set(
      appointments
        .filter((a) => a.status !== 'cancelado')
        .map((a) => a.clientId)
    ).size;

    return { total, withAllergies, activeThisMonth };
  }, [clients, appointments]);

  return (
    <div className="space-y-6">
      {/* Top Banner & Stats */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-bold text-stone-900">
              Cadastro de Clientes & Anamnese
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Gerencie fichas estéticas, histórico de procedimentos e contatos diretos
            </p>
          </div>

          <button
            onClick={onOpenNewClient}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Nova Cliente</span>
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5 pt-5 border-t border-stone-100">
          <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200/60 flex items-center justify-between">
            <div>
              <span className="text-xs text-stone-500 font-medium block">Total de Clientes</span>
              <span className="text-xl font-bold text-stone-900">{stats.total}</span>
            </div>
            <Users className="w-6 h-6 text-rose-500/60" />
          </div>

          <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200/60 flex items-center justify-between">
            <div>
              <span className="text-xs text-stone-500 font-medium block">Clientes em Atendimento</span>
              <span className="text-xl font-bold text-stone-900">{stats.activeThisMonth}</span>
            </div>
            <UserCheck className="w-6 h-6 text-emerald-500/60" />
          </div>

          <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200/60 flex items-center justify-between">
            <div>
              <span className="text-xs text-stone-500 font-medium block">Com Restrições / Alergias</span>
              <span className="text-xl font-bold text-rose-700">{stats.withAllergies}</span>
            </div>
            <ShieldAlert className="w-6 h-6 text-rose-500/60" />
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por nome, telefone, queixa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-400 font-medium text-stone-800"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Filter className="w-3.5 h-3.5 text-stone-400" />
          <span className="text-xs text-stone-500 font-medium">Tipo de Pele:</span>
          <select
            value={skinTypeFilter}
            onChange={(e) => setSkinTypeFilter(e.target.value)}
            className="px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-700 focus:outline-none focus:ring-1 focus:ring-rose-400"
          >
            <option value="all">Todas</option>
            <option value="Normal">Normal</option>
            <option value="Oleosa">Oleosa</option>
            <option value="Seca">Seca</option>
            <option value="Mista">Mista</option>
            <option value="Sensível">Sensível</option>
          </select>
        </div>
      </div>

      {/* Clients Cards Grid */}
      {filteredClients.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-stone-200 space-y-3">
          <Users className="w-10 h-10 text-stone-300 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-stone-700">Nenhuma cliente encontrada</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Tente buscar com outro termo ou cadastre uma nova cliente para iniciar o acompanhamento.
          </p>
          <button
            onClick={onOpenNewClient}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-semibold hover:bg-rose-700 transition-colors"
          >
            <Plus className="w-4 h-4" /> Cadastrar Cliente
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map((client) => {
            const clientApts = appointments.filter((a) => a.clientId === client.id);
            const totalApts = clientApts.length;

            return (
              <div
                key={client.id}
                className="bg-white rounded-2xl border border-stone-200 hover:border-rose-200 shadow-xs hover:shadow-sm transition-all p-5 flex flex-col justify-between"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-100 to-amber-100 text-rose-700 font-serif font-bold text-base flex items-center justify-center border border-rose-200/50">
                        {client.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 
                          onClick={() => onViewClientDetail(client)}
                          className="font-serif font-bold text-base text-stone-900 hover:text-rose-600 cursor-pointer transition-colors"
                        >
                          {client.name}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {client.skinType && (
                            <span className="text-[10px] font-semibold px-2 py-0.2 rounded-md bg-stone-100 text-stone-700 border border-stone-200">
                              Pele {client.skinType}
                            </span>
                          )}
                          <span className="text-[10px] text-stone-400 font-medium">
                            {totalApts} procedimento(s)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <button
                        onClick={() => onEditClient(client)}
                        className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
                        title="Editar cadastro"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Excluir o cadastro de ${client.name}?`)) {
                            onDeleteClient(client.id);
                          }
                        }}
                        className="p-1 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Excluir cadastro"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-1 text-xs text-stone-600 mb-3 bg-stone-50/70 p-2.5 rounded-xl border border-stone-100">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 font-medium">
                        <Phone className="w-3 h-3 text-emerald-600" />
                        {client.phone}
                      </span>
                      <a
                        href={createWhatsAppUrl(client.phone, `Olá, ${client.name}! Tudo bem? Lumina Estética por aqui.`)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] font-bold text-emerald-700 hover:underline bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200"
                      >
                        WhatsApp
                      </a>
                    </div>
                    {client.email && (
                      <div className="flex items-center gap-1 text-stone-500 truncate">
                        <Mail className="w-3 h-3 text-stone-400" />
                        <span className="truncate">{client.email}</span>
                      </div>
                    )}
                  </div>

                  {/* Allergies Warning */}
                  {client.allergies && (
                    <div className="mb-3 bg-rose-50 border border-rose-200/80 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 text-xs text-rose-800">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      <span className="font-semibold text-[11px] truncate">
                        Alerta: {client.allergies}
                      </span>
                    </div>
                  )}

                  {/* Aesthetic Goals Chips */}
                  {client.mainGoals && client.mainGoals.length > 0 && (
                    <div className="mb-3">
                      <span className="text-[10px] font-bold uppercase text-stone-400 tracking-wider block mb-1">
                        Queixas / Objetivos
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {client.mainGoals.slice(0, 3).map((goal) => (
                          <span
                            key={goal}
                            className="text-[10px] font-medium px-2 py-0.5 bg-rose-50 text-rose-700 rounded-md border border-rose-100"
                          >
                            {goal}
                          </span>
                        ))}
                        {client.mainGoals.length > 3 && (
                          <span className="text-[10px] text-stone-400 px-1 py-0.5">
                            +{client.mainGoals.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Footer Actions */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2 mt-2">
                  <button
                    onClick={() => onViewClientDetail(client)}
                    className="text-xs font-semibold text-stone-600 hover:text-stone-900 py-1 flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" /> Ficha Completa
                  </button>

                  <button
                    onClick={() => onNewAppointmentForClient(client.id)}
                    className="text-xs font-semibold px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Calendar className="w-3 h-3" /> Agendar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
