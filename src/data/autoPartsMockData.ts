export interface AutoPartProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  code: string;
  price: number;
  stock: number;
  description: string;
  compatibility: string;
  imageUrl: string;
}

export const autoPartCategories = [
  'Todos',
  'Lavagem',
  'Polimento',
  'Proteção',
  'Interior',
  'Acessórios',
];

export const initialAutoPartProducts: AutoPartProduct[] = [
  {
    id: 'part-1',
    name: 'V-Floc Shampoo Automotivo',
    brand: 'Vonixx',
    category: 'Lavagem',
    code: 'VNX-VF-001',
    price: 39.9,
    stock: 12,
    description: 'Shampoo automotivo de alta performance para uma lavagem segura e eficiente.',
    compatibility: 'Indicado para todos os tipos de pintura automotiva',
    imageUrl: 'https://picsum.photos/seed/vonixx-shampoo/800/600',
  },
  {
    id: 'part-2',
    name: 'Sintra Pro Limpador Multiuso',
    brand: 'Vonixx',
    category: 'Interior',
    code: 'VNX-SI-002',
    price: 49.9,
    stock: 4,
    description: 'Limpador multiuso para higienização de superfícies internas e externas.',
    compatibility: 'Painéis, plásticos, borrachas, carpetes e superfícies automotivas',
    imageUrl: 'https://picsum.photos/seed/vonixx-cleaner/800/600',
  },
  {
    id: 'part-3',
    name: 'V80 Cera Líquida',
    brand: 'Vonixx',
    category: 'Proteção',
    code: 'VNX-V80-003',
    price: 69.9,
    stock: 0,
    description: 'Cera líquida que proporciona brilho intenso e proteção para a pintura.',
    compatibility: 'Compatível com pinturas automotivas novas ou vitrificadas',
    imageUrl: 'https://picsum.photos/seed/vonixx-wax/800/600',
  },
  {
    id: 'part-4',
    name: 'Blend Ceramic & Carnaúba',
    brand: 'Vonixx',
    category: 'Proteção',
    code: 'VNX-BL-004',
    price: 129.9,
    stock: 7,
    description: 'Cera premium com proteção cerâmica e carnaúba para acabamento sofisticado.',
    compatibility: 'Indicada para pintura automotiva e uso profissional',
    imageUrl: 'https://picsum.photos/seed/vonixx-ceramic/800/600',
  },
  {
    id: 'part-5',
    name: 'Polidor de Corte Forte',
    brand: 'Vonixx',
    category: 'Polimento',
    code: 'VNX-PC-005',
    price: 89.9,
    stock: 28,
    description: 'Composto polidor para remoção de riscos e marcas mais profundas na pintura.',
    compatibility: 'Uso com politriz em pinturas automotivas',
    imageUrl: 'https://picsum.photos/seed/vonixx-polish/800/600',
  },
  {
    id: 'part-6',
    name: 'Revelax Limpador de Pneus',
    brand: 'Vonixx',
    category: 'Acessórios',
    code: 'VNX-RE-006',
    price: 34.9,
    stock: 3,
    description: 'Produto para limpeza e renovação do aspecto dos pneus do veículo.',
    compatibility: 'Indicado para pneus e superfícies externas de borracha',
    imageUrl: 'https://picsum.photos/seed/vonixx-tire-cleaner/800/600',
  },
];