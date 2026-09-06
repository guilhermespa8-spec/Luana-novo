import React, { useState, useEffect } from 'react';
import { X, User, Phone, Mail, Calendar, ShieldAlert, Sparkles, CheckCircle2, FileText, Activity } from 'lucide-react';
import { Client, SkinType } from '../../types';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (clientData: Omit<Client, 'id' | 'createdAt'>, existingId?: string) => void;
  initialClient?: Client | null;
}

const COMMON_GOALS = [
  'Acne e Cravos',
  'Manchas e Melasma',
  'Linhas de Expressão',
  'Flacidez Facial',
  'Olheiras',
  'Pele Desidratada',
  'Gordura Localizada',
  'Celulite',
  'Estrias',
  'Flacidez Corporal',
  'Retenção de Líquidos',
  'Tensão e Estresse',
];

export const ClientModal: React.FC<ClientModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialClient,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [cpf, setCpf] = useState('');
  const [skinType, setSkinType] = useState<SkinType>('Mista');
  const [mainGoals, setMainGoals] = useState<string[]>([]);
  const [allergies, setAllergies] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialClient) {
      setName(initialClient.name);
      setPhone(initialClient.phone);
      setEmail(initialClient.email || '');
      setBirthDate(initialClient.birthDate || '');
      setCpf(initialClient.cpf || '');
      setSkinType(initialClient.skinType || 'Mista');
      setMainGoals(initialClient.mainGoals || []);
      setAllergies(initialClient.allergies || '');
      setNotes(initialClient.notes || '');
    } else {
      setName('');
      setPhone('');
      setEmail('');
      setBirthDate('');
      setCpf('');
      setSkinType('Mista');
      setMainGoals(['Limpeza de Pele']);
      setAllergies('');
      setNotes('');
    }
  }, [isOpen, initialClient]);

  const toggleGoal = (goal: string) => {
    if (mainGoals.includes(goal)) {
      setMainGoals(mainGoals.filter((g) => g !== goal));
    } else {
      setMainGoals([...mainGoals, goal]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Por favor, informe o nome da cliente.');
      return;
    }
    if (!phone.trim()) {
      alert('Por favor, informe o telefone/WhatsApp.');
      return;
    }

    onSave(
      {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        birthDate: birthDate || undefined,
        cpf: cpf.trim() || undefined,
        skinType,
        mainGoals,
        allergies: allergies.trim() || undefined,
        notes: notes.trim() || undefined,
      },
      initialClient?.id
    );

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        id="client-modal-card"
        className="bg-white rounded-2xl shadow-xl w-full max-w-xl border border-stone-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-50 to-amber-50/60 px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900">
                {initialClient ? 'Editar Ficha da Cliente' : 'Cadastro de Nova Cliente'}
              </h3>
              <p className="text-xs text-stone-500">
                Informações de contato e anamnese estética essencial
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-sm max-h-[80vh] overflow-y-auto">
          {/* Section: Informações Pessoais */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-rose-500" />
              1. Dados Pessoais & Contato
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-stone-600 block mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Gabriela Monteiro Silva"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-stone-600 block mb-1 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-emerald-600" />
                  WhatsApp / Telefone *
                </label>
                <input
                  type="text"
                  required
                  placeholder="(11) 98765-4321"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-stone-600 block mb-1 flex items-center gap-1">
                  <Mail className="w-3 h-3 text-stone-400" />
                  E-mail
                </label>
                <input
                  type="email"
                  placeholder="cliente@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-stone-600 block mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-stone-400" />
                  Data de Nascimento
                </label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-stone-600 block mb-1">
                  CPF / Documento (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Section: Ficha de Anamnese Básica */}
          <div className="space-y-3 pt-3 border-t border-stone-200">
            <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-rose-500" />
              2. Ficha Estética Básica (Anamnese)
            </h4>

            {/* Tipo de Pele */}
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1.5">
                Tipo de Pele:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {(['Normal', 'Oleosa', 'Seca', 'Mista', 'Sensível'] as SkinType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSkinType(type)}
                    className={`py-2 px-2 text-xs font-semibold rounded-xl border transition-all text-center ${
                      skinType === type
                        ? 'bg-rose-500 text-white border-rose-600 shadow-xs'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Queixas e Objetivos */}
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1.5">
                Queixas Principais & Objetivos Estéticos:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {COMMON_GOALS.map((goal) => {
                  const isSelected = mainGoals.includes(goal);
                  return (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => toggleGoal(goal)}
                      className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all ${
                        isSelected
                          ? 'bg-rose-50 text-rose-800 border-rose-300 font-semibold'
                          : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {goal}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Alergias / Contraindicações */}
            <div>
              <label className="text-xs font-semibold text-rose-800 block mb-1 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                Alergias, Sensibilidades ou Restrições:
              </label>
              <input
                type="text"
                placeholder="Ex: Alergia a iodo, intolerância a ácidos fortes, gravidez, prótese metálica..."
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                className="w-full px-3.5 py-2 bg-rose-50/40 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm text-stone-800"
              />
              <span className="text-[11px] text-stone-500 mt-1 block">
                Fica destacado na ficha e agenda para segurança do procedimento.
              </span>
            </div>

            {/* Observações Gerais */}
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-stone-500" />
                Observações, Hábitos & Home Care:
              </label>
              <textarea
                rows={2}
                placeholder="Ex: Usa protetor solar diariamente, consome pouca água, prefere atendimentos às sextas..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2 bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-stone-600 hover:text-stone-900 text-sm font-medium hover:bg-stone-100 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-sm font-semibold rounded-xl shadow-sm transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              {initialClient ? 'Salvar Alterações' : 'Cadastrar Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
