import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Sparkles,
  Phone,
  MessageCircle,
  Plus,
  CheckCircle2,
  AlertCircle,
  Filter,
  Check,
  X,
  Edit2,
  Trash2,
} from 'lucide-react';
import { Appointment, Client, Service, AppointmentStatus, AestheticCategory } from '../../types';
import { formatCurrency, getStatusBadgeClass, createWhatsAppUrl } from '../../utils/storage';

interface AgendaViewProps {
  appointments: Appointment[];
  clients: Client[];
  services?: Service[];
  onNewAppointment: (date?: string, time?: string) => void;
  onEditAppointment: (appointment: Appointment) => void;
  onDeleteAppointment: (id: string) => void;
  onUpdateStatus: (id: string, newStatus: AppointmentStatus) => void;
}

export const AgendaView: React.FC<AgendaViewProps> = ({
  appointments,
  clients,
  onNewAppointment,
  onEditAppointment,
  onDeleteAppointment,
  onUpdateStatus,
}) => {
  // Current selected date (default to today)
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'list'>('day');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Navigate date
  const handleDateShift = (days: number) => {
    const parts = selectedDate.split('-').map(Number);
    const d = new Date(parts[0], parts[1] - 1, parts[2]);
    d.setDate(d.getDate() + days);
    const newStr = d.toISOString().split('T')[0];
    setSelectedDate(newStr);
  };

  const handleGoToday = () => {
    setSelectedDate(todayStr);
  };

  // Date formatting in Portuguese
  const formattedSelectedDate = useMemo(() => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    return new Intl.DateTimeFormat('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(dateObj);
  }, [selectedDate]);

  // Appointments for the selected date
  const dayAppointments = useMemo(() => {
    return appointments
      .filter((a) => a.date === selectedDate)
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [appointments, selectedDate]);

  // Filtered day appointments based on category/status
  const filteredDayAppointments = useMemo(() => {
    return dayAppointments.filter((a) => {
      const matchStatus = statusFilter === 'all' || a.status === statusFilter;
      const matchCat = categoryFilter === 'all' || a.category === categoryFilter;
      return matchStatus && matchCat;
    });
  }, [dayAppointments, statusFilter, categoryFilter]);

  // Metrics for today / selected day
  const dayMetrics = useMemo(() => {
    const total = dayAppointments.length;
    const confirmed = dayAppointments.filter((a) => a.status === 'confirmado').length;
    const completed = dayAppointments.filter((a) => a.status === 'concluido').length;
    const revenue = dayAppointments
      .filter((a) => a.status !== 'cancelado')
      .reduce((sum, a) => sum + (a.price || 0), 0);

    return { total, confirmed, completed, revenue };
  }, [dayAppointments]);

  // Week appointments calculation
  const weekDays = useMemo(() => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const current = new Date(y, m - 1, d);
    const dayOfWeek = current.getDay(); // 0 is Sunday, 1 is Monday...
    // Start week on Monday
    const diff = current.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const monday = new Date(current.setDate(diff));

    const days = [];
    for (let i = 0; i < 7; i++) {
      const dCopy = new Date(monday);
      dCopy.setDate(monday.getDate() + i);
      const iso = dCopy.toISOString().split('T')[0];
      const weekdayName = new Intl.DateTimeFormat('pt-BR', { weekday: 'short' }).format(dCopy);
      days.push({
        dateStr: iso,
        dayNum: dCopy.getDate(),
        monthNum: dCopy.getMonth() + 1,
        weekday: weekdayName.toUpperCase().replace('.', ''),
        isToday: iso === todayStr,
        isSelected: iso === selectedDate,
      });
    }
    return days;
  }, [selectedDate, todayStr]);

  // Hours array for Day View (08:00 to 19:00)
  const hourSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
  ];

  // WhatsApp reminder message builder
  const handleSendReminder = (apt: Appointment) => {
    const [y, m, d] = apt.date.split('-');
    const dateFormatted = `${d}/${m}`;
    const msg = `Olá, ${apt.clientName}! ✨ Passando para confirmar seu procedimento de *${apt.serviceName}* na Lumina Estética agendado para o dia *${dateFormatted}* às *${apt.time}*.\n\nPor favor, responda com *Sim* para confirmar ou avise caso precise remarcar. Estamos ansiosas para te receber com todo carinho! 🌸`;
    window.open(createWhatsAppUrl(apt.clientPhone, msg), '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Day Metrics Bar */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Date Selector & Navigation */}
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200">
              <button
                onClick={() => handleDateShift(-1)}
                className="p-1.5 hover:bg-white text-stone-600 rounded-lg transition-colors"
                title="Dia anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleGoToday}
                className="px-2.5 py-1 text-xs font-semibold text-stone-700 hover:bg-white rounded-lg transition-colors"
              >
                Hoje
              </button>
              <button
                onClick={() => handleDateShift(1)}
                className="p-1.5 hover:bg-white text-stone-600 rounded-lg transition-colors"
                title="Próximo dia"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="relative">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-400 cursor-pointer"
              />
            </div>

            <div>
              <h2 className="font-serif text-lg md:text-xl font-bold text-stone-900 capitalize">
                {formattedSelectedDate}
              </h2>
              <span className="text-xs text-stone-500">
                {dayAppointments.length} agendamento(s) para esta data
              </span>
            </div>
          </div>

          {/* View Mode & New Appointment Button */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs font-medium">
              <button
                onClick={() => setViewMode('day')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'day' ? 'bg-white text-stone-900 shadow-xs font-semibold' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Visão Diária
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'week' ? 'bg-white text-stone-900 shadow-xs font-semibold' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Visão Semanal
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'list' ? 'bg-white text-stone-900 shadow-xs font-semibold' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Lista Geral
              </button>
            </div>

            <button
              onClick={() => onNewAppointment(selectedDate)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Novo Horário</span>
            </button>
          </div>
        </div>

        {/* Quick Day Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-stone-100">
          <div className="bg-stone-50/80 rounded-xl p-3 border border-stone-100">
            <span className="text-xs text-stone-500 font-medium block">Atendimentos no Dia</span>
            <span className="text-lg font-bold text-stone-900">{dayMetrics.total}</span>
          </div>
          <div className="bg-emerald-50/60 rounded-xl p-3 border border-emerald-100">
            <span className="text-xs text-emerald-600 font-medium block">Confirmados</span>
            <span className="text-lg font-bold text-emerald-800">{dayMetrics.confirmed}</span>
          </div>
          <div className="bg-stone-50/80 rounded-xl p-3 border border-stone-100">
            <span className="text-xs text-stone-500 font-medium block">Concluídos</span>
            <span className="text-lg font-bold text-stone-700">{dayMetrics.completed}</span>
          </div>
          <div className="bg-rose-50/60 rounded-xl p-3 border border-rose-100">
            <span className="text-xs text-rose-600 font-medium block">Previsão Financeira</span>
            <span className="text-lg font-bold text-rose-900">{formatCurrency(dayMetrics.revenue)}</span>
          </div>
        </div>
      </div>

      {/* FILTER CONTROLS */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white px-4 py-2.5 rounded-xl border border-stone-200">
        <div className="flex items-center gap-2 text-xs font-medium text-stone-600">
          <Filter className="w-3.5 h-3.5 text-stone-400" />
          <span>Filtros:</span>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1 bg-stone-50 rounded-lg border border-stone-200 text-xs focus:ring-1 focus:ring-rose-400 font-medium"
          >
            <option value="all">Todos os Status</option>
            <option value="agendado">Apenas Agendados</option>
            <option value="confirmado">Apenas Confirmados</option>
            <option value="concluido">Apenas Concluídos</option>
            <option value="cancelado">Apenas Cancelados</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1 bg-stone-50 rounded-lg border border-stone-200 text-xs focus:ring-1 focus:ring-rose-400 font-medium"
          >
            <option value="all">Todas as Áreas (Facial & Corporal)</option>
            <option value="facial">✨ Apenas Facial</option>
            <option value="corporal">🌿 Apenas Corporal</option>
          </select>
        </div>

        <div className="text-xs text-stone-500">
          Exibindo {filteredDayAppointments.length} agendamento(s)
        </div>
      </div>

      {/* VIEW: DAY TIMELINE */}
      {viewMode === 'day' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="divide-y divide-stone-100">
            {hourSlots.map((hour) => {
              // Find appointments starting in this hour (e.g. 09:00 - 09:59)
              const hourHour = hour.split(':')[0];
              const slotAppointments = filteredDayAppointments.filter((a) => {
                const aHour = a.time.split(':')[0];
                return aHour === hourHour;
              });

              return (
                <div key={hour} className="flex flex-col md:flex-row group hover:bg-stone-50/50 transition-colors">
                  {/* Time label column */}
                  <div className="w-24 p-4 border-r border-stone-100 flex md:flex-col items-center justify-between md:justify-start bg-stone-50/40">
                    <span className="font-semibold text-stone-700 text-sm font-mono">{hour}</span>
                    <button
                      onClick={() => onNewAppointment(selectedDate, hour)}
                      className="mt-1 opacity-0 group-hover:opacity-100 text-[10px] text-rose-600 hover:text-rose-700 font-medium transition-opacity flex items-center gap-0.5"
                    >
                      <Plus className="w-3 h-3" /> Agendar
                    </button>
                  </div>

                  {/* Appointments slot column */}
                  <div className="flex-1 p-3 min-h-[72px]">
                    {slotAppointments.length === 0 ? (
                      <div 
                        onClick={() => onNewAppointment(selectedDate, hour)}
                        className="h-full flex items-center justify-between text-xs text-stone-300 hover:text-rose-600 hover:bg-rose-50/40 px-3 py-2 rounded-xl transition-all cursor-pointer border border-transparent hover:border-dashed hover:border-rose-200"
                      >
                        <span className="italic">Horário disponível</span>
                        <span className="opacity-0 group-hover:opacity-100 font-medium text-rose-600 flex items-center gap-1">
                          <Plus className="w-3 h-3" /> Agendar sessão às {hour}
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {slotAppointments.map((apt) => {
                          const badge = getStatusBadgeClass(apt.status);
                          const isFacial = apt.category === 'facial';

                          return (
                            <div
                              key={apt.id}
                              className={`p-3.5 rounded-xl border transition-all ${
                                apt.status === 'cancelado'
                                  ? 'bg-stone-50 border-stone-200 opacity-60'
                                  : isFacial
                                  ? 'bg-rose-50/40 border-rose-200 hover:border-rose-300'
                                  : 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-300'
                              } shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3`}
                            >
                              {/* Left Info */}
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-mono text-xs font-bold text-stone-800 bg-white px-2 py-0.5 rounded-md border border-stone-200 shadow-2xs">
                                    {apt.time} ({apt.durationMinutes} min)
                                  </span>

                                  <span
                                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${badge.bg} ${badge.text} ${badge.border}`}
                                  >
                                    {badge.label}
                                  </span>

                                  <span
                                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                                      isFacial
                                        ? 'bg-rose-100/70 text-rose-800'
                                        : 'bg-emerald-100/70 text-emerald-800'
                                    }`}
                                  >
                                    {isFacial ? '✨ Facial' : '🌿 Corporal'}
                                  </span>
                                </div>

                                <div className="flex items-baseline gap-2">
                                  <span className="font-serif font-bold text-stone-900 text-base">
                                    {apt.serviceName}
                                  </span>
                                  <span className="text-xs font-semibold text-stone-600">
                                    {formatCurrency(apt.price)}
                                  </span>
                                </div>

                                <div className="flex items-center gap-3 text-xs text-stone-600">
                                  <span className="flex items-center gap-1 font-medium text-stone-800">
                                    <User className="w-3.5 h-3.5 text-rose-500" />
                                    {apt.clientName}
                                  </span>
                                  {apt.clientPhone && (
                                    <span className="flex items-center gap-1 text-stone-500">
                                      <Phone className="w-3 h-3" />
                                      {apt.clientPhone}
                                    </span>
                                  )}
                                </div>

                                {apt.notes && (
                                  <p className="text-xs text-stone-500 italic bg-white/70 px-2 py-1 rounded-md border border-stone-200/50 mt-1 max-w-xl">
                                    Obs: {apt.notes}
                                  </p>
                                )}
                              </div>

                              {/* Right Actions */}
                              <div className="flex items-center gap-1.5 flex-wrap">
                                {/* Quick status updates */}
                                {apt.status !== 'confirmado' && apt.status !== 'concluido' && (
                                  <button
                                    onClick={() => onUpdateStatus(apt.id, 'confirmado')}
                                    className="px-2.5 py-1 text-xs font-medium text-emerald-700 bg-white hover:bg-emerald-50 border border-emerald-200 rounded-lg transition-colors flex items-center gap-1"
                                    title="Marcar como Confirmado"
                                  >
                                    <Check className="w-3 h-3 text-emerald-600" /> Confirmar
                                  </button>
                                )}

                                {apt.status === 'confirmado' && (
                                  <button
                                    onClick={() => onUpdateStatus(apt.id, 'concluido')}
                                    className="px-2.5 py-1 text-xs font-medium text-stone-700 bg-white hover:bg-stone-100 border border-stone-300 rounded-lg transition-colors flex items-center gap-1"
                                    title="Marcar como Concluído"
                                  >
                                    <CheckCircle2 className="w-3 h-3 text-stone-500" /> Concluir
                                  </button>
                                )}

                                {/* WhatsApp Reminder */}
                                {apt.clientPhone && (
                                  <button
                                    onClick={() => handleSendReminder(apt)}
                                    className="px-2.5 py-1 text-xs font-medium text-emerald-800 bg-emerald-100/80 hover:bg-emerald-200 rounded-lg transition-colors flex items-center gap-1"
                                    title="Enviar lembrete via WhatsApp com mensagem pronta"
                                  >
                                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                                    WhatsApp
                                  </button>
                                )}

                                {/* Edit & Delete */}
                                <button
                                  onClick={() => onEditAppointment(apt)}
                                  className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-white rounded-lg border border-transparent hover:border-stone-200 transition-colors"
                                  title="Editar agendamento"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`Deseja cancelar/excluir o agendamento de ${apt.clientName}?`)) {
                                      onDeleteAppointment(apt.id);
                                    }
                                  }}
                                  className="p-1.5 text-rose-400 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                                  title="Excluir agendamento"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW: WEEK OVERVIEW */}
      {viewMode === 'week' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-3">
            {weekDays.map((day) => {
              const dayApts = appointments.filter((a) => a.date === day.dateStr);
              return (
                <div
                  key={day.dateStr}
                  onClick={() => {
                    setSelectedDate(day.dateStr);
                    setViewMode('day');
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer min-h-[160px] flex flex-col justify-between ${
                    day.isSelected
                      ? 'bg-rose-50/60 border-rose-300 ring-2 ring-rose-200'
                      : day.isToday
                      ? 'bg-stone-50 border-rose-200'
                      : 'bg-stone-50/50 border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-stone-500">
                        {day.weekday}
                      </span>
                      {day.isToday && (
                        <span className="text-[9px] bg-rose-500 text-white font-bold px-1.5 py-0.2 rounded-full">
                          HOJE
                        </span>
                      )}
                    </div>
                    <span className="text-xl font-serif font-bold text-stone-900 block mb-2">
                      {day.dayNum}
                    </span>

                    {/* Mini appointment pills */}
                    <div className="space-y-1">
                      {dayApts.slice(0, 3).map((a) => (
                        <div
                          key={a.id}
                          className="text-[11px] px-1.5 py-0.5 rounded bg-white border border-stone-200 text-stone-700 truncate"
                        >
                          <span className="font-mono font-bold text-stone-900">{a.time}</span> {a.serviceName}
                        </div>
                      ))}
                      {dayApts.length > 3 && (
                        <span className="text-[10px] text-rose-600 font-semibold block">
                          +{dayApts.length - 3} outros
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-200/60 mt-2 text-[11px] text-stone-500 flex justify-between items-center">
                    <span>{dayApts.length} sessões</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNewAppointment(day.dateStr);
                      }}
                      className="text-rose-600 hover:text-rose-700 font-bold text-xs"
                      title="Agendar neste dia"
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW: FULL LIST */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-stone-50 border-b border-stone-200 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Data & Horário</th>
                  <th className="py-3 px-4">Cliente</th>
                  <th className="py-3 px-4">Procedimento</th>
                  <th className="py-3 px-4">Valor</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {appointments
                  .sort((a, b) => b.date.localeCompare(a.date) || a.time.localeCompare(b.time))
                  .map((apt) => {
                    const badge = getStatusBadgeClass(apt.status);
                    const [y, m, d] = apt.date.split('-');
                    return (
                      <tr key={apt.id} className="hover:bg-stone-50/60 transition-colors">
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="font-semibold text-stone-900 block font-mono">
                            {d}/{m}/{y}
                          </span>
                          <span className="text-xs text-stone-500 font-mono">
                            {apt.time} ({apt.durationMinutes} min)
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-stone-900 block">
                            {apt.clientName}
                          </span>
                          <span className="text-xs text-stone-500">
                            {apt.clientPhone}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-stone-900 block">
                            {apt.serviceName}
                          </span>
                          <span className="text-xs text-stone-500 capitalize">
                            {apt.category === 'facial' ? '✨ Estética Facial' : '🌿 Estética Corporal'}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-semibold text-stone-800 whitespace-nowrap">
                          {formatCurrency(apt.price)}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span
                            className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${badge.bg} ${badge.text} ${badge.border}`}
                          >
                            {badge.label}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap space-x-1">
                          {apt.clientPhone && (
                            <button
                              onClick={() => handleSendReminder(apt)}
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors inline-flex"
                              title="Lembrete WhatsApp"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => onEditAppointment(apt)}
                            className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors inline-flex"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Excluir agendamento de ${apt.clientName}?`)) {
                                onDeleteAppointment(apt.id);
                              }
                            }}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors inline-flex"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
