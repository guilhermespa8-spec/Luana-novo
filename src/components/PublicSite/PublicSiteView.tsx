import React, { useState } from 'react';
import {
  Sparkles,
  Calendar,
  Clock,
  Phone,
  MapPin,
  Instagram,
  CheckCircle2,
  Heart,
  ShieldCheck,
  Award,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';
import { ClinicInfo, Service, Appointment } from '../../types';
import { formatCurrency, createWhatsAppUrl } from '../../utils/storage';

interface PublicSiteViewProps {
  clinicInfo: ClinicInfo;
  services: Service[];
  onClientBookOnline: (bookingData: {
    clientName: string;
    clientPhone: string;
    serviceId: string;
    date: string;
    time: string;
    notes?: string;
  }) => void;
  onBackToAdmin: () => void;
}

export const PublicSiteView: React.FC<PublicSiteViewProps> = ({
  clinicInfo,
  services,
  onClientBookOnline,
  onBackToAdmin,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'facial' | 'corporal'>('facial');
  const [selectedServiceId, setSelectedServiceId] = useState(services[0]?.id || '');
  const [bookDate, setBookDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [bookTime, setBookTime] = useState('10:00');
  const [bookName, setBookName] = useState('');
  const [bookPhone, setBookPhone] = useState('');
  const [bookNotes, setBookNotes] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const filteredServices = services.filter((s) => s.category === selectedCategory);
  const activeService = services.find((s) => s.id === selectedServiceId) || services[0];

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookName.trim() || !bookPhone.trim() || !selectedServiceId) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    onClientBookOnline({
      clientName: bookName.trim(),
      clientPhone: bookPhone.trim(),
      serviceId: selectedServiceId,
      date: bookDate,
      time: bookTime,
      notes: bookNotes.trim(),
    });

    setBookingSuccess(true);
  };

  const handleDirectWhatsApp = () => {
    const msg = `Olá! Estava no site da ${clinicInfo.name} e gostaria de mais informações sobre os procedimentos faciais e corporais. ✨`;
    window.open(createWhatsAppUrl(clinicInfo.whatsapp, msg), '_blank');
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 selection:bg-rose-100 selection:text-rose-900 pb-16">
      {/* Top Professional Admin Return Bar */}
      <div className="bg-stone-900 text-stone-300 px-4 py-2 text-xs flex items-center justify-between border-b border-stone-800">
        <span className="flex items-center gap-1.5 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Modo Vitrine: Esta é a visualização que suas clientes veem online.
        </span>
        <button
          onClick={onBackToAdmin}
          className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-md transition-colors"
        >
          Voltar ao Painel da Clínica & Agenda
        </button>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-stone-100 via-rose-50/40 to-stone-50 py-16 md:py-24 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-100/80 border border-rose-200 text-rose-800 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Clínica Especializada em Estética Facial & Corporal</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-900 leading-[1.15] tracking-tight">
                Cuidar de você é uma arte de{' '}
                <span className="text-rose-600 italic font-normal">harmonia e bem-estar.</span>
              </h1>

              <p className="text-stone-600 text-base sm:text-lg leading-relaxed max-w-xl">
                Protocolos exclusivos, tecnologias dermatológicas de ponta e um atendimento acolhedor feito sob medida para realçar a sua beleza natural.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#agendamento-online"
                  className="px-6 py-3.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-semibold rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Agendar Sessão Online</span>
                </a>

                <button
                  onClick={handleDirectWhatsApp}
                  className="px-5 py-3.5 bg-white hover:bg-stone-100 text-stone-800 font-semibold rounded-xl border border-stone-300 shadow-xs transition-colors flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Falar no WhatsApp</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-stone-200/80 text-xs text-stone-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-rose-500 shrink-0" />
                  <span className="font-medium">Biossegurança Rigorosa</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-rose-500 shrink-0" />
                  <span className="font-medium">Profissionais Certificados</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-500 shrink-0" />
                  <span className="font-medium">+1.500 Clientes Felizes</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-stone-200 aspect-4/5">
                  <img
                    src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1000&q=80"
                    alt="Estética Facial e Corporal"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Floating highlight card */}
                <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur p-4 rounded-2xl shadow-xl border border-stone-100 max-w-xs space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-stone-900 font-serif">
                      Horários Abertos Hoje
                    </span>
                  </div>
                  <p className="text-xs text-stone-500">
                    Limpeza profunda, massagens e radiofrequência com horários flexíveis.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Procedures Catalog Showcase */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-rose-600">
            Nossos Tratamentos
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            Procedimentos Faciais & Corporais
          </h2>
          <p className="text-stone-600 text-sm">
            Escolha uma das categorias abaixo para conhecer nossos protocolos individualizados.
          </p>

          {/* Toggle category */}
          <div className="inline-flex p-1 bg-stone-200/80 rounded-xl mt-4">
            <button
              onClick={() => setSelectedCategory('facial')}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                selectedCategory === 'facial'
                  ? 'bg-white text-rose-700 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              ✨ Estética Facial
            </button>
            <button
              onClick={() => setSelectedCategory('corporal')}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                selectedCategory === 'corporal'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              🌿 Estética Corporal
            </button>
          </div>
        </div>

        {/* Procedures Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl border border-stone-200 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="h-44 overflow-hidden relative">
                  <img
                    src={service.imageUrl}
                    alt={service.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2 right-2 text-xs font-bold bg-black/60 text-white px-2.5 py-1 rounded-lg backdrop-blur-xs">
                    {formatCurrency(service.price)}
                  </span>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-serif font-bold text-base text-stone-900">
                    {service.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-stone-500">
                    <Clock className="w-3.5 h-3.5 text-rose-500" />
                    <span>Duração: {service.durationMinutes} minutos</span>
                  </div>
                  <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0">
                <a
                  href="#agendamento-online"
                  onClick={() => setSelectedServiceId(service.id)}
                  className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs rounded-xl border border-rose-200 transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Agendar Este</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Online Booking Interactive Form */}
      <section id="agendamento-online" className="py-16 bg-white border-y border-stone-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-rose-600">
              Facilidade & Praticidade
            </span>
            <h2 className="font-serif text-3xl font-bold text-stone-900">
              Agende sua Sessão Online
            </h2>
            <p className="text-stone-500 text-sm max-w-lg mx-auto">
              Selecione o procedimento desejado, data e horário. Seu agendamento será registrado imediatamente na agenda da clínica!
            </p>
          </div>

          {bookingSuccess ? (
            <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-3xl text-center space-y-4 max-w-xl mx-auto">
              <div className="w-14 h-14 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-emerald-900">
                Agendamento Solicitado com Sucesso!
              </h3>
              <p className="text-sm text-emerald-800 leading-relaxed">
                Obrigada, <strong>{bookName}</strong>! Seu horário para{' '}
                <strong>{activeService.name}</strong> no dia{' '}
                <strong>{bookDate.split('-').reverse().join('/')}</strong> às{' '}
                <strong>{bookTime}</strong> foi enviado para a clínica.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => {
                    const msg = `Olá! Acabei de fazer um agendamento online de *${activeService.name}* para *${bookDate.split('-').reverse().join('/')}* às *${bookTime}*. Meu nome é ${bookName}.`;
                    window.open(createWhatsAppUrl(clinicInfo.whatsapp, msg), '_blank');
                  }}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4" />
                  Confirmar no WhatsApp da Clínica
                </button>
                <button
                  onClick={() => setBookingSuccess(false)}
                  className="px-4 py-2 bg-white text-stone-700 hover:bg-stone-100 text-xs font-semibold rounded-xl border border-stone-200"
                >
                  Fazer Outro Agendamento
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleBookingSubmit}
              className="bg-stone-50 rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Choose procedure */}
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1.5">
                    1. Escolha o Procedimento Desejado *
                  </label>
                  <select
                    value={selectedServiceId}
                    onChange={(e) => setSelectedServiceId(e.target.value)}
                    className="w-full px-4 py-3 bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-stone-900 font-medium text-sm"
                  >
                    <optgroup label="✨ Estética Facial">
                      {services
                        .filter((s) => s.category === 'facial')
                        .map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name} - {s.durationMinutes} min ({formatCurrency(s.price)})
                          </option>
                        ))}
                    </optgroup>
                    <optgroup label="🌿 Estética Corporal">
                      {services
                        .filter((s) => s.category === 'corporal')
                        .map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name} - {s.durationMinutes} min ({formatCurrency(s.price)})
                          </option>
                        ))}
                    </optgroup>
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-rose-500" />
                    2. Data Desejada *
                  </label>
                  <input
                    type="date"
                    required
                    value={bookDate}
                    onChange={(e) => setBookDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm font-medium text-stone-800"
                  />
                </div>

                {/* Time */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-rose-500" />
                    3. Horário Desejado *
                  </label>
                  <select
                    value={bookTime}
                    onChange={(e) => setBookTime(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm font-medium text-stone-800"
                  >
                    {['08:30', '09:30', '10:30', '11:30', '14:00', '15:00', '16:00', '17:00', '18:00'].map(
                      (h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      )
                    )}
                  </select>
                </div>

                {/* Name */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1.5">
                    4. Seu Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Amanda Silva"
                    value={bookName}
                    onChange={(e) => setBookName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm"
                  />
                </div>

                {/* Phone / WhatsApp */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    5. Seu WhatsApp com DDD *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="(11) 98765-4321"
                    value={bookPhone}
                    onChange={(e) => setBookPhone(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm"
                  />
                </div>

                {/* Notes */}
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-stone-600 block mb-1.5">
                    Observações ou Dúvidas sobre sua pele/corpo (Opcional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ex: É minha primeira vez fazendo limpeza, tenho pele sensível..."
                    value={bookNotes}
                    onChange={(e) => setBookNotes(e.target.value)}
                    className="w-full px-4 py-2 bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm"
                  />
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-stone-200">
                <span className="text-xs text-stone-500">
                  Total estimado: <strong className="text-stone-900 text-base">{formatCurrency(activeService.price)}</strong> ({activeService.durationMinutes} min)
                </span>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirmar Pré-Agendamento</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* Footer & Location info */}
      <footer className="pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-rose-500 text-white flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-serif font-bold text-lg text-stone-900">
                {clinicInfo.name}
              </span>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed">
              {clinicInfo.tagline}. Responsável técnica: {clinicInfo.ownerName}.
            </p>
          </div>

          <div>
            <h4 className="font-serif font-bold text-stone-900 text-sm mb-3">
              Atendimento & Contato
            </h4>
            <ul className="space-y-2 text-xs text-stone-600">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-rose-500" />
                <span>{clinicInfo.phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Instagram className="w-3.5 h-3.5 text-rose-500" />
                <span>{clinicInfo.instagram}</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-rose-500" />
                <span>{clinicInfo.workingHours}</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-bold text-stone-900 text-sm mb-3">
              Localização
            </h4>
            <p className="text-xs text-stone-600 flex items-start gap-2">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{clinicInfo.address}</span>
            </p>
            <button
              onClick={handleDirectWhatsApp}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-lg border border-emerald-200 hover:bg-emerald-100 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Pedir Localização via WhatsApp
            </button>
          </div>
        </div>

        <div className="pt-6 text-center text-xs text-stone-400">
          © {new Date().getFullYear()} {clinicInfo.name}. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
};
