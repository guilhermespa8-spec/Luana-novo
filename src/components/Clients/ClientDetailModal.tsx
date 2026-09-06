import React from 'react';
import { X, User, Phone, Mail, Calendar, ShieldAlert, Sparkles, Plus, Clock, CheckCircle2 } from 'lucide-react';
import { Client, Appointment } from '../../types';
import { formatDatePtBR, formatCurrency, getStatusBadgeClass, createWhatsAppUrl } from '../../utils/storage';

interface ClientDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
  clientAppointments: Appointment[];
  onNewAppointmentForClient: (clientId: string) => void;
  onEditClient: (client: Client) => void;
}

export const ClientDetailModal: React.FC<ClientDetailModalProps> = ({
  isOpen,
  onClose,
  client,
  clientAppointments,
  onNewAppointmentForClient,
  onEditClient,
}) => {
  if (!isOpen || !client) return null;

  const handleWhatsApp = () => {
    const text = `Olá, ${client.name}! ✨ Tudo bem? Passando para conversar sobre seus cuidados estéticos na Lumina Estética. Como sua pele está reagindo?`;
    window.open(createWhatsAppUrl(client.phone, text), '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        id="client-detail-card"
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl border border-stone-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-50 to-amber-50/60 px-6 py-5 border-b border-stone-200 flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white font-serif font-bold text-xl flex items-center justify-center shadow-xs">
              {client.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  {client.name}
                </h3>
                {client.skinType && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-white border border-rose-200 text-rose-800">
                    Pele {client.skinType}
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Cliente desde {new Date(client.createdAt).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-white/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-sm">
          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-stone-50 p-3.5 rounded-xl border border-stone-200/80">
            <div className="flex items-center gap-2">
              <button
                onClick={handleWhatsApp}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                Conversar no WhatsApp
              </button>
              <button
                onClick={() => onEditClient(client)}
                className="px-3 py-1.5 bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 text-xs font-semibold rounded-lg transition-colors"
              >
                Editar Ficha
              </button>
            </div>

            <button
              onClick={() => {
                onClose();
                onNewAppointmentForClient(client.id);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Agendar Novo Procedimento
            </button>
          </div>

          {/* Contact and Basics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/60">
              <span className="text-[11px] font-semibold text-stone-500 uppercase block mb-1">Telefone</span>
              <span className="font-semibold text-stone-900">{client.phone}</span>
            </div>
            <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/60">
              <span className="text-[11px] font-semibold text-stone-500 uppercase block mb-1">E-mail</span>
              <span className="font-medium text-stone-800 truncate block">{client.email || 'Não informado'}</span>
            </div>
            <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/60">
              <span className="text-[11px] font-semibold text-stone-500 uppercase block mb-1">Nascimento</span>
              <span className="font-medium text-stone-800">
                {client.birthDate ? formatDatePtBR(client.birthDate) : 'Não informado'}
              </span>
            </div>
          </div>

          {/* Allergies / Safety Alert */}
          {client.allergies ? (
            <div className="bg-rose-50 border border-rose-200 p-3.5 rounded-xl flex items-start gap-2.5">
              <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-xs text-rose-900 uppercase tracking-wider block">
                  Alergias & Restrições Registradas
                </span>
                <p className="text-xs text-rose-800 mt-0.5">{client.allergies}</p>
              </div>
            </div>
          ) : (
            <div className="bg-stone-50 border border-stone-200 p-2.5 rounded-xl text-xs text-stone-500 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Nenhuma alergia ou contraindicação relatada.
            </div>
          )}

          {/* Goals and Complaints */}
          <div>
            <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Queixas Principais & Objetivos
            </h4>
            {client.mainGoals && client.mainGoals.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {client.mainGoals.map((g) => (
                  <span
                    key={g}
                    className="text-xs font-medium px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 border border-rose-200"
                  >
                    ✨ {g}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-xs text-stone-400 italic">Nenhum objetivo específico listado.</span>
            )}
          </div>

          {/* General Notes */}
          {client.notes && (
            <div>
              <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Observações & Home Care
              </h4>
              <p className="text-xs text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-200/60 leading-relaxed">
                {client.notes}
              </p>
            </div>
          )}

          {/* History of Appointments */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-rose-500" />
                Histórico de Procedimentos ({clientAppointments.length})
              </h4>
            </div>

            {clientAppointments.length === 0 ? (
              <div className="text-center py-6 bg-stone-50 rounded-xl border border-dashed border-stone-200 text-xs text-stone-500">
                Esta cliente ainda não possui procedimentos registrados.
              </div>
            ) : (
              <div className="space-y-2">
                {clientAppointments
                  .sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time))
                  .map((apt) => {
                    const badge = getStatusBadgeClass(apt.status);
                    return (
                      <div
                        key={apt.id}
                        className="p-3 bg-stone-50/80 rounded-xl border border-stone-200 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-stone-900 font-serif">
                              {apt.serviceName}
                            </span>
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.2 rounded-md border ${badge.bg} ${badge.text} ${badge.border}`}
                            >
                              {badge.label}
                            </span>
                          </div>
                          <span className="text-stone-500 mt-0.5 block">
                            {formatDatePtBR(apt.date)} às {apt.time} ({apt.durationMinutes} min)
                          </span>
                        </div>
                        <span className="font-semibold text-stone-800 text-sm">
                          {formatCurrency(apt.price)}
                        </span>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-stone-700 hover:bg-stone-200/70 text-xs font-semibold rounded-xl transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
