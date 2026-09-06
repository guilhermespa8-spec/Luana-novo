import React, { useState } from 'react';
import { Sparkles, Clock, DollarSign, Plus, CheckCircle2, X, Filter } from 'lucide-react';
import { Service, AestheticCategory } from '../../types';
import { formatCurrency } from '../../utils/storage';

interface ServicesViewProps {
  services: Service[];
  onSelectServiceToSchedule: (serviceId: string) => void;
  onAddService: (newService: Omit<Service, 'id'>) => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({
  services,
  onSelectServiceToSchedule,
  onAddService,
}) => {
  const [filterCategory, setFilterCategory] = useState<'all' | 'facial' | 'corporal'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New service form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState<AestheticCategory>('facial');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [price, setPrice] = useState(180);
  const [description, setDescription] = useState('');
  const [benefitsText, setBenefitsText] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const filteredServices = services.filter((s) => {
    if (filterCategory === 'all') return true;
    return s.category === filterCategory;
  });

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const benefits = benefitsText
      .split('\n')
      .map((b) => b.trim())
      .filter(Boolean);

    onAddService({
      name: name.trim(),
      category,
      durationMinutes: Number(durationMinutes),
      price: Number(price),
      description: description.trim() || 'Procedimento estético profissional personalizado.',
      benefits: benefits.length > 0 ? benefits : ['Resultados visíveis', 'Cuidado profissional'],
      imageUrl:
        imageUrl.trim() ||
        (category === 'facial'
          ? 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80'
          : 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80'),
    });

    // Reset and close
    setName('');
    setDescription('');
    setBenefitsText('');
    setImageUrl('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-stone-900">
            Catálogo de Procedimentos
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Tratamentos faciais e corporais com durações e valores para a agenda
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Procedimento</span>
        </button>
      </div>

      {/* Categories Toggle */}
      <div className="flex items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-stone-200 shadow-xs">
        <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterCategory === 'all'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Todos ({services.length})
          </button>
          <button
            onClick={() => setFilterCategory('facial')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterCategory === 'facial'
                ? 'bg-white text-rose-800 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            ✨ Estética Facial ({services.filter((s) => s.category === 'facial').length})
          </button>
          <button
            onClick={() => setFilterCategory('corporal')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterCategory === 'corporal'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            🌿 Estética Corporal ({services.filter((s) => s.category === 'corporal').length})
          </button>
        </div>

        <span className="text-xs text-stone-500 hidden sm:inline">
          Exibindo {filteredServices.length} tratamentos disponíveis
        </span>
      </div>

      {/* Grid of Services */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredServices.map((service) => {
          const isFacial = service.category === 'facial';
          return (
            <div
              key={service.id}
              className="bg-white rounded-2xl border border-stone-200 hover:border-rose-300 shadow-xs hover:shadow-sm transition-all overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Photo */}
                <div className="relative h-44 w-full overflow-hidden bg-stone-100">
                  <img
                    src={service.imageUrl}
                    alt={service.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  
                  {/* Category badge */}
                  <span
                    className={`absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs ${
                      isFacial
                        ? 'bg-rose-500 text-white'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {isFacial ? '✨ Facial' : '🌿 Corporal'}
                  </span>

                  {/* Price overlay */}
                  <span className="absolute bottom-3 right-3 text-sm font-bold text-white bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-white/20">
                    {formatCurrency(service.price)}
                  </span>
                </div>

                {/* Body Content */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-stone-900 leading-tight">
                      {service.name}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-stone-500 mt-1 font-medium">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-rose-500" />
                        {service.durationMinutes} minutos
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                    {service.description}
                  </p>

                  {/* Benefits */}
                  {service.benefits && service.benefits.length > 0 && (
                    <div className="pt-2 border-t border-stone-100">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1.5">
                        Benefícios Principais:
                      </span>
                      <ul className="space-y-1">
                        {service.benefits.map((b, idx) => (
                          <li key={idx} className="text-xs text-stone-600 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                <span className="font-bold text-stone-900 text-base">
                  {formatCurrency(service.price)}
                </span>
                <button
                  onClick={() => onSelectServiceToSchedule(service.id)}
                  className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white rounded-xl text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Agendar na Agenda
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal to Add Custom Service */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-rose-50 to-amber-50/60 px-6 py-4 border-b border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-rose-500" />
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  Novo Procedimento Estético
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateService} className="p-6 space-y-4 text-sm">
              <div>
                <label className="text-xs font-semibold text-stone-600 block mb-1">
                  Nome do Tratamento *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Peeling de Algas, Hidratação Labial..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 focus:ring-2 focus:ring-rose-400 text-sm"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-600 block mb-1">
                    Categoria
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as AestheticCategory)}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 text-sm font-medium"
                  >
                    <option value="facial">Facial</option>
                    <option value="corporal">Corporal</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-600 block mb-1">
                    Duração (min)
                  </label>
                  <input
                    type="number"
                    min="15"
                    step="5"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-600 block mb-1">
                    Valor (R$)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-600 block mb-1">
                  Descrição do Procedimento
                </label>
                <textarea
                  rows={2}
                  placeholder="Explique os passos, o que a cliente pode esperar da sessão..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-600 block mb-1">
                  Benefícios (1 por linha)
                </label>
                <textarea
                  rows={2}
                  placeholder="Redução de oleosidade&#10;Efeito lifting&#10;Estimula circulação"
                  value={benefitsText}
                  onChange={(e) => setBenefitsText(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 text-sm font-mono text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-600 block mb-1">
                  URL da Foto (Opcional)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 text-sm"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-stone-600 text-xs font-semibold rounded-xl hover:bg-stone-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl shadow-xs"
                >
                  Cadastrar Procedimento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
