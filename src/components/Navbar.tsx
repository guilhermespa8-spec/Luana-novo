import React from 'react';
import { Sparkles, Calendar, Users, Plus } from 'lucide-react';
import { ClinicInfo } from '../types';

interface NavbarProps {
  activeTab: 'agenda' | 'clients';
  setActiveTab: (tab: 'agenda' | 'clients') => void;
  clinicInfo: ClinicInfo;
  onOpenNewAppointment: () => void;
  onOpenNewClient: () => void;
  appointmentsTodayCount: number;
  totalClientsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  clinicInfo,
  onOpenNewAppointment,
  onOpenNewClient,
  appointmentsTodayCount,
  totalClientsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-stone-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Brand */}
          <div 
            onClick={() => setActiveTab('agenda')}
            className="flex items-center gap-3 cursor-pointer group select-none"
            id="clinic-brand-header"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-rose-400 to-amber-300 flex items-center justify-center text-white shadow-xs transition-transform group-hover:scale-105">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-stone-900 block leading-tight">
                {clinicInfo.name || 'Estética Facial & Corporal'}
              </span>
              <span className="text-[11px] sm:text-xs text-stone-500 font-medium tracking-wide">
                Controle de Atendimentos & Clientes
              </span>
            </div>
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden sm:flex items-center gap-1.5 bg-stone-100 p-1.5 rounded-xl border border-stone-200/80">
            <button
              id="nav-tab-agenda"
              onClick={() => setActiveTab('agenda')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'agenda'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
              }`}
            >
              <Calendar className="w-4 h-4 text-rose-500" />
              <span>Agenda</span>
              {appointmentsTodayCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs font-semibold bg-rose-100 text-rose-700 rounded-full">
                  {appointmentsTodayCount} hoje
                </span>
              )}
            </button>

            <button
              id="nav-tab-clients"
              onClick={() => setActiveTab('clients')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'clients'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
              }`}
            >
              <Users className="w-4 h-4 text-rose-500" />
              <span>Clientes & Fichas</span>
              <span className="ml-1 px-1.5 py-0.5 text-xs font-semibold bg-stone-200 text-stone-700 rounded-full">
                {totalClientsCount}
              </span>
            </button>
          </nav>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              id="btn-quick-new-client"
              onClick={onOpenNewClient}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors border border-stone-200"
            >
              <Users className="w-3.5 h-3.5 text-stone-600" />
              <span className="hidden sm:inline">Nova Cliente</span>
              <span className="sm:hidden">Cliente</span>
            </button>

            <button
              id="btn-quick-new-appointment"
              onClick={onOpenNewAppointment}
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-lg shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Novo Horário</span>
              <span className="sm:hidden">Agendar</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex sm:hidden items-center justify-around py-2 border-t border-stone-100 gap-2">
          <button
            onClick={() => setActiveTab('agenda')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium rounded-lg ${
              activeTab === 'agenda' ? 'bg-rose-50 text-rose-700 font-semibold' : 'text-stone-600'
            }`}
          >
            <Calendar className="w-4 h-4 text-rose-500" />
            <span>Agenda</span>
            {appointmentsTodayCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] font-bold bg-rose-200 text-rose-800 rounded-full">
                {appointmentsTodayCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('clients')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium rounded-lg ${
              activeTab === 'clients' ? 'bg-rose-50 text-rose-700 font-semibold' : 'text-stone-600'
            }`}
          >
            <Users className="w-4 h-4 text-rose-500" />
            <span>Clientes ({totalClientsCount})</span>
          </button>
        </div>
      </div>
    </header>
  );
};
