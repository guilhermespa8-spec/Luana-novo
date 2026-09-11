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
  'Freios',
  'Suspensão',
  'Motor',
  'Elétrica',
  'Filtros',
  'Acessórios',
];

export const initialAutoPartProducts: AutoPartProduct[] = [
  {
    id: 'part-1',
    name: 'Pastilha de Freio Dianteira',
    brand: 'Bosch',
    category: 'Freios',
    code: 'BOS-PF-2048',
    price: 149.9,
    stock: 12,
    description: 'Pastilha de freio dianteira com excelente desempenho e durabilidade.',
    compatibility: 'Volkswagen Gol, Voyage e Saveiro 2015 a 2022',
    imageUrl: 'https://picsum.photos/seed/brake-pads/800/600',
  },
  {
    id: 'part-2',
    name: 'Amortecedor Dianteiro',
    brand: 'Cofap',
    category: 'Suspensão',
    code: 'COF-AM-8831',
    price: 389.9,
    stock: 4,
    description: 'Amortecedor dianteiro para maior estabilidade, segurança e conforto.',
    compatibility: 'Chevrolet Onix e Prisma 2013 a 2019',
    imageUrl: 'https://picsum.photos/seed/shock-absorber/800/600',
  },
  {
    id: 'part-3',
    name: 'Kit Correia Dentada',
    brand: 'Dayco',
    category: 'Motor',
    code: 'DAY-KIT-1190',
    price: 279.9,
    stock: 0,
    description: 'Kit completo com correia e tensionador para manutenção preventiva do motor.',
    compatibility: 'Fiat Uno, Palio e Strada 1.0 e 1.4',
    imageUrl: 'https://picsum.photos/seed/timing-belt/800/600',
  },
  {
    id: 'part-4',
    name: 'Bateria Automotiva 60Ah',
    brand: 'Moura',
    category: 'Elétrica',
    code: 'MOU-BAT-60AH',
    price: 469.9,
    stock: 7,
    description: 'Bateria selada de alta performance para veículos nacionais e importados.',
    compatibility: 'Aplicação universal conforme especificação do veículo',
    imageUrl: 'https://picsum.photos/seed/car-battery/800/600',
  },
  {
    id: 'part-5',
    name: 'Filtro de Óleo',
    brand: 'Tecfil',
    category: 'Filtros',
    code: 'TEC-FO-3012',
    price: 34.9,
    stock: 28,
    description: 'Filtro de óleo desenvolvido para proteger o motor contra impurezas.',
    compatibility: 'Volkswagen, Fiat, Chevrolet e Ford',
    imageUrl: 'https://picsum.photos/seed/oil-filter/800/600',
  },
  {
    id: 'part-6',
    name: 'Lâmpada LED H7',
    brand: 'Osram',
    category: 'Acessórios',
    code: 'OSR-LED-H7',
    price: 119.9,
    stock: 3,
    description: 'Lâmpada LED automotiva com iluminação branca e instalação prática.',
    compatibility: 'Consulte a compatibilidade com o modelo do seu veículo',
    imageUrl: 'https://picsum.photos/seed/car-led/800/600',
  },
];