import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, Sparkles, DollarSign, FileText, CheckCircle2 } from 'lucide-react';
import { Appointment, Client, AppointmentStatus, AestheticCategory } from '../../types';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appointment: Omit<Appointment, 'id' | 'createdAt'>, existingId?: string) => void;
  clients: Client[];
  initialAppointment?: Appointment | null;
  initialDate?: string;
  initialTime?: string;
  initialClientId?: string;
  initialProcedureName?: string;
}

const COMMON_PROCEDURES: { name: string; category: AestheticCategory; duration: number; defaultPrice: number }[] = [
  { name: 'Limpeza de Pele Profunda', category: 'facial', duration: 75, defaultPrice: 150 },
  { name: 'Peeling Químico / Renovação', category: 'facial', duration: 45, defaultPrice: 180 },
  { name: 'Microagulhamento Facial', category: 'facial', duration: 60, defaultPrice: 240 },
  { name: 'Revitalização & Glow Facial', category: 'facial', duration: 50, defaultPrice: 160 },
  { name: 'Drenagem Linfática Corporal', category: 'corporal', duration: 60, defaultPrice: 130 },
  { name: 'Massagem Modeladora / Redutora', category: 'corporal', duration: 50, defaultPrice: 140 },
  { name: 'Radiofrequência Corporal', category: 'corporal', duration: 45, defaultPrice: 170 },
  { name: 'Massagem Relaxante & Terapêutica', category: 'corporal', duration: 60, defaultPrice: 130 },
];

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  clients,
  initialAppointment,
  initialDate,
  initialTime,
  initialClientId,
  initialProcedureName,
}) => {
  const [clientId, setClientId] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [isNewClientMode, setIsNewClientMode] = useState(false);
  const [procedureName, setProcedureName] = useState('Limpeza de Pele Profunda');
  const [category, setCategory] = useState<AestheticCategory>('facial');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('09:00');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [price, setPrice] = useState(150);
  const [status, setStatus] = useState<AppointmentStatus>('agendado');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialAppointment) {
      setClientId(initialAppointment.clientId);
      setClientName(initialAppointment.clientName);
      setClientPhone(initialAppointment.clientPhone);
      setIsNewClientMode(false);
      setProcedureName(initialAppointment.serviceName);
      setCategory(initialAppointment.category || 'facial');
      setDate(initialAppointment.date);
      setTime(initialAppointment.time);
      setDurationMinutes(initialAppointment.durationMinutes);
      setPrice(initialAppointment.price);
      setStatus(initialAppointment.status);
      setNotes(initialAppointment.notes || '');
    } else {
      const today = new Date().toISOString().split('T')[0];
      setDate(initialDate || today);
      setTime(initialTime || '09:00');
      setStatus('agendado');
      setNotes('');
      if (initialProcedureName) {
        setProcedureName(initialProcedureName);
      }

      if (initialClientId) {
        const found = clients.find(c => c.id === initialClientId);
        if (found) {
          setClientId(found.id);
          setClientName(found.name);
          setClientPhone(found.phone);
          setIsNewClientMode(false);
        }
      } else if (clients.length > 0) {
        setClientId(clients[0].id);
        setClientName(clients[0].name);
        setClientPhone(clients[0].phone);
        setIsNewClientMode(false);
      } else {
        setIsNewClientMode(true);
      }
    }
  }, [isOpen, initialAppointment, initialDate, initialTime, initialClientId, initialProcedureName, clients]);

  const handleClientSelect = (id: string) => {
    if (id === 'NEW') {
      setIsNewClientMode(true);
      setClientId('');
      setClientName('');
      setClientPhone('');
    } else {
      setIsNewClientMode(false);
      const c = clients.find(item => item.id === id);
      if (c) {
        setClientId(c.id);
        setClientName(c.name);
        setClientPhone(c.phone);
      }
    }
  };

  const handleSelectQuickProcedure = (proc: typeof COMMON_PROCEDURES[0]) => {
    setProcedureName(proc.name);
    setCategory(proc.category);
    setDurationMinutes(proc.duration);
    setPrice(proc.defaultPrice);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) {
      alert('Por favor, informe o nome da cliente.');
      return;
    }
    if (!procedureName.trim()) {
      alert('Por favor, informe o procedimento.');
      return;
    }
    if (!date || !time) {
      alert('Por favor, informe data e horário.');
      return;
    }

    onSave(
      {
        clientId: clientId || `cli-quick-${Date.now()}`,
        clientName: clientName.trim(),
        clientPhone: clientPhone.trim(),
        serviceId: `proc-${Date.now()}`,
        serviceName: procedureName.trim(),
        category,
        date,
        time,
        durationMinutes: Number(durationMinutes) || 60,
        price: Number(price) || 0,
        status,
        notes: notes.trim(),
      },
      initialAppointment?.id
    );

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        id="appointment-modal-card"
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-stone-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-50 to-amber-50/60 px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900">
                {initialAppointment ? 'Editar Agendamento' : 'Registrar Horário na Agenda'}
              </h3>
              <p className="text-xs text-stone-500">
                Adicione o procedimento e horário do atendimento
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm">
          {/* Client Selection */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-rose-500" />
                Cliente
              </label>
              <button
                type="button"
                onClick={() => {
                  if (isNewClientMode) {
                    if (clients.length > 0) handleClientSelect(clients[0].id);
                  } else {
                    handleClientSelect('NEW');
                  }
                }}
                className="text-xs text-rose-600 hover:text-rose-700 font-medium underline"
              >
                {isNewClientMode ? 'Escolher da lista existente' : '+ Digitar nova cliente'}
              </button>
            </div>

            {isNewClientMode ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-stone-50 rounded-xl border border-stone-200">
                <div>
                  <label className="text-xs text-stone-500 block mb-1">Nome da Cliente *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Amanda Silva"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-stone-500 block mb-1">WhatsApp / Telefone</label>
                  <input
                    type="text"
                    placeholder="(11) 99999-9999"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm"
                  />
                </div>
              </div>
            ) : (
              <select
                value={clientId}
                onChange={(e) => handleClientSelect(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-400 font-medium text-stone-800 text-sm"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.phone ? `(${c.phone})` : ''} - Pele {c.skinType || 'Não inf.'}
                  </option>
                ))}
                <option value="NEW">+ Digitar Outra Cliente...</option>
              </select>
            )}
          </div>

          {/* Procedure Name & Category */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                Procedimento Estético *
              </label>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setCategory('facial')}
                  className={`text-xs px-2 py-0.5 rounded-md font-semibold transition-all ${
                    category === 'facial'
                      ? 'bg-rose-100 text-rose-800 border border-rose-300'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  ✨ Facial
                </button>
                <button
                  type="button"
                  onClick={() => setCategory('corporal')}
                  className={`text-xs px-2 py-0.5 rounded-md font-semibold transition-all ${
                    category === 'corporal'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  🌿 Corporal
                </button>
              </div>
            </div>

            <input
              type="text"
              required
              placeholder="Ex: Limpeza de Pele, Drenagem Linfática, Peeling..."
              value={procedureName}
              onChange={(e) => setProcedureName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-400 font-medium text-stone-800 text-sm"
            />

            {/* Quick Procedure Suggestions Chips */}
            <div className="flex flex-wrap gap-1 pt-1">
              <span className="text-[11px] text-stone-400 py-0.5 pr-1">Sugestões:</span>
              {COMMON_PROCEDURES.map((proc) => (
                <button
                  key={proc.name}
                  type="button"
                  onClick={() => handleSelectQuickProcedure(proc)}
                  className={`text-[11px] px-2 py-0.5 rounded-md border transition-all ${
                    procedureName === proc.name
                      ? 'bg-rose-50 text-rose-800 border-rose-300 font-semibold'
                      : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {proc.name}
                </button>
              ))}
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-600 flex items-center gap-1.5 mb-1.5">
                <Calendar className="w-3.5 h-3.5 text-rose-500" />
                Data *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-600 flex items-center gap-1.5 mb-1.5">
                <Clock className="w-3.5 h-3.5 text-rose-500" />
                Horário *
              </label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm"
              />
            </div>
          </div>

          {/* Duration, Price & Status */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs font-medium text-stone-600 block mb-1">
                Duração (min)
              </label>
              <input
                type="number"
                min="10"
                step="5"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-stone-600 block mb-1">
                Valor (R$)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full pl-7 pr-2 py-2 bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm"
                />
                <span className="absolute left-2.5 top-2.5 text-xs text-stone-400 font-medium">R$</span>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-stone-600 block mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as AppointmentStatus)}
                className="w-full px-2.5 py-2 bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm font-medium"
              >
                <option value="agendado">Agendado</option>
                <option value="confirmado">Confirmado</option>
                <option value="concluido">Concluído</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
          </div>

          {/* Notes / Special care */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-600 flex items-center gap-1.5 mb-1.5">
              <FileText className="w-3.5 h-3.5 text-rose-500" />
              Anotações da Sessão (Opcional)
            </label>
            <textarea
              rows={2}
              placeholder="Ex: Pele sensível, foco na extração de cravos, recomendada hidratação home care..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-stone-600 hover:text-stone-900 text-sm font-medium hover:bg-stone-100 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-sm font-semibold rounded-xl shadow-xs transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              {initialAppointment ? 'Atualizar Agendamento' : 'Salvar na Agenda'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
