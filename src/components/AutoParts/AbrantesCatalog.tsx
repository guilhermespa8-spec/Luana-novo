import React, { useEffect, useMemo, useState } from 'react';
import {
  Camera,
  Car,
  PackagePlus,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  imageUrl: string;
  createdAt: string;
}

const STORAGE_KEY = 'abrantes-vonixx-products';

const defaultProducts: Product[] = [
  {
    id: 'vonixx-demo-1',
    name: 'V-Floc Shampoo',
    category: 'Lavagem',
    price: 0,
    description: 'Shampoo automotivo concentrado da Vonixx.',
    imageUrl: '',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'vonixx-demo-2',
    name: 'Sintra Pro',
    category: 'Limpeza interna',
    price: 0,
    description: 'Limpador multiuso para limpeza interna automotiva.',
    imageUrl: '',
    createdAt: new Date().toISOString(),
  },
];

const loadProducts = (): Product[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultProducts;
  } catch {
    return defaultProducts;
  }
};

export const AbrantesCatalog: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(loadProducts);
  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [form, setForm] = useState({
    name: '',
    category: 'Lavagem',
    price: '',
    description: '',
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  const filteredProducts = useMemo(() => {
    const term = search.toLowerCase().trim();

    if (!term) return products;

    return products.filter((product) =>
      `${product.name} ${product.category} ${product.description}`
        .toLowerCase()
        .includes(term),
    );
  }, [products, search]);

  const openNewProduct = () => {
    setEditingProduct(null);
    setForm({
      name: '',
      category: 'Lavagem',
      price: '',
      description: '',
    });
    setImagePreview('');
    setIsFormOpen(true);
  };

  const openEditProduct = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      category: product.category,
      price: product.price ? String(product.price) : '',
      description: product.description,
    });
    setImagePreview(product.imageUrl);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
    setImagePreview('');
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      window.alert('Selecione um arquivo de imagem válido.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setImagePreview(String(reader.result));
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.name.trim()) {
      window.alert('Informe o nome do produto.');
      return;
    }

    const productData = {
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price.replace(',', '.')) || 0,
      description: form.description.trim(),
      imageUrl: imagePreview,
    };

    if (editingProduct) {
      setProducts((current) =>
        current.map((product) =>
          product.id === editingProduct.id
            ? { ...product, ...productData }
            : product,
        ),
      );
    } else {
      setProducts((current) => [
        {
          id: `vonixx-${Date.now()}`,
          ...productData,
          createdAt: new Date().toISOString(),
        },
        ...current,
      ]);
    }

    closeForm();
  };

  const removeProduct = (id: string) => {
    if (!window.confirm('Deseja remover este produto do catálogo?')) return;

    setProducts((current) => current.filter((product) => product.id !== id));
  };

  const formatPrice = (price: number) =>
    price > 0
      ? price.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })
      : 'Preço sob consulta';

  return (
    <div className="min-h-screen bg-stone-100 text-stone-800">
      <header className="border-b border-stone-200 bg-stone-950 text-white shadow-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500 text-stone-950">
              <Car className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
                Abrantes Autopeças
              </h1>
              <p className="text-xs font-medium text-stone-300">
                Produtos Vonixx
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={openNewProduct}
            className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-3 py-2 text-sm font-bold text-stone-950 transition-colors hover:bg-amber-400 sm:px-4"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Adicionar produto</span>
            <span className="sm:hidden">Adicionar</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <section className="mb-6 rounded-2xl bg-stone-900 p-6 text-white shadow-sm sm:p-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-amber-400">
            Catálogo de produtos
          </p>
          <h2 className="max-w-2xl text-2xl font-bold sm:text-3xl">
            Produtos Vonixx para deixar seu veículo impecável.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-stone-300">
            Cadastre seus produtos manualmente e organize seu catálogo da
            Abrantes Autopeças.
          </p>
        </section>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar produto Vonixx..."
              className="w-full rounded-xl border border-stone-300 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
            />
          </div>
          <p className="text-sm text-stone-500">
            {filteredProducts.length} produto(s) no catálogo
          </p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
            <PackagePlus className="mx-auto mb-3 h-10 w-10 text-stone-400" />
            <h3 className="font-bold text-stone-800">
              Nenhum produto encontrado
            </h3>
            <p className="mt-1 text-sm text-stone-500">
              Adicione um produto ou altere sua busca.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="relative flex h-52 items-center justify-center bg-stone-100">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-stone-400">
                      <Camera className="mx-auto mb-2 h-9 w-9" />
                      <span className="text-xs">Sem foto cadastrada</span>
                    </div>
                  )}
                  <span className="absolute left-3 top-3 rounded-full bg-stone-950 px-2.5 py-1 text-[11px] font-bold text-amber-400">
                    VONIXX
                  </span>
                </div>

                <div className="p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">
                    {product.category}
                  </p>
                  <h3 className="mt-1 text-lg font-bold text-stone-900">
                    {product.name}
                  </h3>
                  <p className="mt-2 min-h-10 text-sm leading-5 text-stone-500">
                    {product.description || 'Sem descrição cadastrada.'}
                  </p>
                  <p className="mt-4 text-lg font-bold text-stone-900">
                    {formatPrice(product.price)}
                  </p>

                  <div className="mt-4 flex gap-2 border-t border-stone-100 pt-3">
                    <button
                      type="button"
                      onClick={() => openEditProduct(product)}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-stone-200 px-3 py-2 text-xs font-semibold text-stone-700 transition hover:bg-stone-100"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => removeProduct(product.id)}
                      aria-label={`Remover ${product.name}`}
                      className="rounded-lg border border-stone-200 px-3 py-2 text-stone-500 transition hover:border-red-200 hover:text-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 p-4">
          <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
              <div>
                <h2 className="text-lg font-bold text-stone-900">
                  {editingProduct ? 'Editar produto' : 'Novo produto Vonixx'}
                </h2>
                <p className="text-xs text-stone-500">
                  Preencha as informações do produto
                </p>
              </div>
              <button
                type="button"
                onClick={closeForm}
                className="rounded-lg p-2 text-stone-500 hover:bg-stone-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-5">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-stone-700">
                  Nome do produto *
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                  placeholder="Ex.: V-Floc Shampoo"
                  className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-stone-700">
                    Categoria
                  </label>
                  <select
                    value={form.category}
                    onChange={(event) =>
                      setForm({ ...form, category: event.target.value })
                    }
                    className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                  >
                    <option>Lavagem</option>
                    <option>Limpeza interna</option>
                    <option>Polimento</option>
                    <option>Proteção</option>
                    <option>Acessórios</option>
                    <option>Outros</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-stone-700">
                    Preço
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={form.price}
                    onChange={(event) =>
                      setForm({ ...form, price: event.target.value })
                    }
                    placeholder="Ex.: 49,90"
                    className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-stone-700">
                  Foto do produto
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-stone-900 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white"
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Pré-visualização do produto"
                    className="mt-3 h-36 w-full rounded-lg object-cover"
                  />
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-stone-700">
                  Descrição
                </label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(event) =>
                    setForm({ ...form, description: event.target.value })
                  }
                  placeholder="Descreva o produto, aplicação e benefícios..."
                  className="w-full resize-none rounded-lg border border-stone-300 px-3 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                />
              </div>

              <div className="flex gap-3 border-t border-stone-100 pt-4">
                <button
                  type="button"
                  onClick={closeForm}
                  className="flex-1 rounded-lg border border-stone-300 px-4 py-2.5 text-sm font-semibold text-stone-700 hover:bg-stone-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-stone-950 px-4 py-2.5 text-sm font-bold text-white hover:bg-stone-800"
                >
                  {editingProduct ? 'Salvar alterações' : 'Cadastrar produto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};