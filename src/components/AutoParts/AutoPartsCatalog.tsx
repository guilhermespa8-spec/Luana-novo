import React, { useMemo, useState } from 'react';
import {
  CarFront,
  ChevronRight,
  CircleAlert,
  Filter,
  PackageSearch,
  Search,
  ShoppingBag,
  X,
} from 'lucide-react';
import {
  AutoPartProduct,
  autoPartCategories,
  initialAutoPartProducts,
} from '../../data/autoPartsMockData';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

const getStockInfo = (stock: number) => {
  if (stock === 0) {
    return {
      label: 'Esgotado',
      className: 'bg-stone-100 text-stone-600 border-stone-200',
    };
  }

  if (stock <= 5) {
    return {
      label: `Últimas ${stock} unidades`,
      className: 'bg-amber-50 text-amber-800 border-amber-200',
    };
  }

  return {
    label: 'Em estoque',
    className: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  };
};

export const AutoPartsCatalog: React.FC = () => {
  const [products] = useState<AutoPartProduct[]>(initialAutoPartProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedProduct, setSelectedProduct] = useState<AutoPartProduct | null>(null);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === 'Todos' || product.category === selectedCategory;

      const searchableText = [
        product.name,
        product.brand,
        product.code,
        product.category,
        product.compatibility,
      ]
        .join(' ')
        .toLowerCase();

      return matchesCategory && searchableText.includes(normalizedQuery);
    });
  }, [products, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-600 text-white shadow-sm">
              <CarFront className="h-6 w-6" />
            </div>
            <div>
              <p className="font-serif text-xl font-bold tracking-tight text-stone-900">
                AutoMais Peças
              </p>
              <p className="text-xs font-medium text-stone-500">
                Peças e acessórios para o seu veículo
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-2 text-xs font-medium text-stone-500 sm:flex">
            <PackageSearch className="h-4 w-4 text-rose-500" />
            Catálogo atualizado
          </div>
        </div>
      </header>

      <main>
        <section className="border-b border-stone-200 bg-gradient-to-br from-stone-100 via-rose-50/60 to-amber-50/50">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8">
            <div>
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/80 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-rose-700">
                <ShoppingBag className="h-3.5 w-3.5" />
                Catálogo de autopeças
              </span>

              <h1 className="max-w-2xl font-serif text-4xl font-bold leading-tight text-stone-900 sm:text-5xl">
                Encontre a peça certa para manter seu carro em movimento.
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-relaxed text-stone-600 sm:text-base">
                Consulte nosso catálogo de peças, veja a disponibilidade em estoque
                e encontre produtos para manutenção, segurança e desempenho.
              </p>

              <div className="relative mt-7 max-w-xl">
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-stone-400" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Busque por peça, marca, código ou veículo..."
                  className="w-full rounded-2xl border border-stone-200 bg-white py-3.5 pl-12 pr-4 text-sm shadow-sm outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-200"
                />
              </div>
            </div>

            <div className="hidden overflow-hidden rounded-3xl border-4 border-white bg-stone-200 shadow-xl lg:block">
              <img
                src="https://picsum.photos/seed/auto-parts-store/1000/700"
                alt="Peças automotivas"
                className="h-72 w-full object-cover"
              />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-serif text-2xl font-bold text-stone-900">
                Produtos disponíveis
              </h2>
              <p className="mt-1 text-xs text-stone-500">
                {filteredProducts.length} produto(s) encontrado(s)
              </p>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <Filter className="h-4 w-4 shrink-0 text-stone-400" />
              {autoPartCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`whitespace-nowrap rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                    selectedCategory === category
                      ? 'border-rose-600 bg-rose-600 text-white'
                      : 'border-stone-200 bg-white text-stone-600 hover:border-rose-200 hover:text-rose-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
              <PackageSearch className="mx-auto h-10 w-10 text-stone-300" />
              <h3 className="mt-3 font-serif text-lg font-bold text-stone-800">
                Nenhum produto encontrado
              </h3>
              <p className="mt-1 text-xs text-stone-500">
                Tente buscar por outro termo ou selecione outra categoria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => {
                const stockInfo = getStockInfo(product.stock);

                return (
                  <article
                    key={product.id}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-rose-200 hover:shadow-md"
                  >
                    <div className="relative h-48 overflow-hidden bg-stone-100">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <span className="absolute left-3 top-3 rounded-lg bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-700 shadow-sm">
                        {product.category}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-serif text-lg font-bold leading-tight text-stone-900">
                            {product.name}
                          </h3>
                          <p className="mt-1 text-xs font-medium text-stone-500">
                            {product.brand} · Código {product.code}
                          </p>
                        </div>
                      </div>

                      <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-stone-600">
                        {product.description}
                      </p>

                      <div className="mt-4 flex items-center justify-between gap-2">
                        <span className="text-lg font-bold text-rose-700">
                          {formatCurrency(product.price)}
                        </span>
                        <span
                          className={`rounded-lg border px-2 py-1 text-[10px] font-bold ${stockInfo.className}`}
                        >
                          {stockInfo.label}
                        </span>
                      </div>

                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs font-bold text-rose-700 transition hover:bg-rose-100"
                      >
                        Ver detalhes
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-stone-900/60 p-4 backdrop-blur-sm"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative h-56 bg-stone-100">
              <img
                src={selectedProduct.imageUrl}
                alt={selectedProduct.name}
                className="h-full w-full object-cover"
              />
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute right-3 top-3 rounded-xl bg-white/90 p-2 text-stone-500 transition hover:bg-white hover:text-stone-900"
                aria-label="Fechar detalhes"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 p-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-rose-600">
                  {selectedProduct.brand} · {selectedProduct.code}
                </p>
                <h2 className="mt-1 font-serif text-2xl font-bold text-stone-900">
                  {selectedProduct.name}
                </h2>
              </div>

              <p className="text-sm leading-relaxed text-stone-600">
                {selectedProduct.description}
              </p>

              <div className="rounded-xl border border-stone-200 bg-stone-50 p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                  Compatibilidade
                </p>
                <p className="mt-1 text-sm font-medium text-stone-800">
                  {selectedProduct.compatibility}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-stone-200 pt-4">
                <div>
                  <p className="text-xs text-stone-500">Preço sugerido</p>
                  <p className="text-2xl font-bold text-rose-700">
                    {formatCurrency(selectedProduct.price)}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-stone-500">Disponibilidade</p>
                  <p className="text-sm font-bold text-stone-800">
                    {selectedProduct.stock > 0
                      ? `${selectedProduct.stock} unidade(s)`
                      : 'Sem estoque'}
                  </p>
                </div>
              </div>

              {selectedProduct.stock === 0 && (
                <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs font-medium text-amber-900">
                  <CircleAlert className="h-4 w-4 shrink-0" />
                  Produto sem estoque no momento. Consulte a previsão de reposição.
                </div>
              )}

              <button
                onClick={() => setSelectedProduct(null)}
                className="w-full rounded-xl bg-rose-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-rose-700"
              >
                Fechar detalhes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};