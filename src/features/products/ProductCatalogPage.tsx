import React, { useState } from 'react';
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Image as ImageIcon,
  ShoppingCart,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { Product } from '../../domain/models/Product';
import { useProducts } from '../../application/hooks/useProducts';
import { useCategories } from '../../application/hooks/useCategories';
import { useAuth } from '../../application/state/AuthContext';
import { useCart } from '../../application/state/CartContext';
import { ProductModal } from './ProductModal';
import { ProductImageModal } from './ProductImageModal';
import { ProductDeleteModal } from './ProductDeleteModal';
import { Pagination } from '../../shared/components/Pagination';
import { ErrorMessage } from '../../shared/components/ErrorMessage';
import { CreateProductRequestDto, UpdateProductRequestDto } from '../../infrastructure/http/dto/api.dto';

export const ProductCatalogPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const { addItem } = useCart();
  const { categories } = useCategories();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const {
    products,
    pagination,
    isLoading,
    error,
    params,
    setParams,
    refetch,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadImage,
  } = useProducts({
    search: undefined,
    categoryId: undefined,
    page: 1,
    size: 15,
  });

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imageProduct, setImageProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setParams({
      ...params,
      search: searchTerm.trim() || undefined,
      categoryId: selectedCategory || undefined,
      page: 1,
    });
  };

  const handleCategoryFilter = (catId: string) => {
    setSelectedCategory(catId);
    setParams({
      ...params,
      search: searchTerm.trim() || undefined,
      categoryId: catId || undefined,
      page: 1,
    });
  };

  const handlePageChange = (newPage: number) => {
    setParams({
      ...params,
      page: newPage,
    });
  };

  const handleSaveProduct = async (data: CreateProductRequestDto | UpdateProductRequestDto) => {
    if (editingProduct) {
      await updateProduct(editingProduct.id, data as UpdateProductRequestDto);
      setActionSuccess(`Producto "${data.name}" actualizado con éxito.`);
    } else {
      await createProduct(data as CreateProductRequestDto);
      setActionSuccess(`Producto "${data.name}" creado con éxito.`);
    }
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleDeleteProduct = async (productId: string) => {
    await deleteProduct(productId);
    setActionSuccess('Producto dado de baja correctamente.');
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleUploadImage = async (productId: string, file: File) => {
    await uploadImage(productId, file);
    setActionSuccess('Imagen actualizada correctamente.');
    setTimeout(() => setActionSuccess(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Catálogo de Productos</h1>
          <p className="text-sm text-slate-500">Gestión de inventario, precios y existencias en tiempo real</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Producto</span>
          </button>
        )}
      </div>

      {actionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-medium animate-in fade-in">
          {actionSuccess}
        </div>
      )}

      <ErrorMessage error={error} onDismiss={() => refetch()} />

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <form onSubmit={handleSearch} className="flex-1 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre de producto..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            Buscar
          </button>
        </form>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryFilter(e.target.value)}
            aria-label="Filtrar por categoría"
            className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="">Todas las categorías</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => refetch()}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            title="Actualizar catálogo"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/80 text-xs font-semibold text-slate-700 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Producto</th>
                <th className="px-6 py-3.5">Categoría</th>
                <th className="px-6 py-3.5">Precio (COP)</th>
                <th className="px-6 py-3.5">Stock</th>
                <th className="px-6 py-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading && products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
                    Cargando productos...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-500">
                    <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    No se encontraron productos en el catálogo.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex-shrink-0 flex items-center justify-center overflow-hidden">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="w-6 h-6 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{product.name}</div>
                          <div className="text-xs text-slate-400 font-mono">ID: {product.id.substring(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                        {product.categoryName}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {product.price.format()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`font-semibold ${
                            product.stock === 0
                              ? 'text-red-600'
                              : product.stock < 5
                              ? 'text-amber-600'
                              : 'text-slate-800'
                          }`}
                        >
                          {product.stock} un.
                        </span>
                        {product.stock === 0 ? (
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-red-100 text-red-700">Agotado</span>
                        ) : product.stock < 5 ? (
                          <span title="Bajo inventario">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => addItem(product, 1)}
                          disabled={product.stock <= 0}
                          className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          title="Añadir a la venta"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Vender</span>
                        </button>

                        {isAdmin && (
                          <>
                            <button
                              onClick={() => setImageProduct(product)}
                              className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition-colors"
                              title="Subir / cambiar imagen"
                            >
                              <ImageIcon className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => setEditingProduct(product)}
                              className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-slate-100 rounded-lg transition-colors"
                              title="Editar producto"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => setDeletingProduct(product)}
                              className="p-1.5 text-slate-500 hover:text-red-700 hover:bg-slate-100 rounded-lg transition-colors"
                              title="Dar de baja"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pagination && (
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            size={pagination.size}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {/* Modals */}
      <ProductModal
        isOpen={isCreateModalOpen || editingProduct !== null}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
        product={editingProduct}
        categories={categories}
      />

      <ProductImageModal
        isOpen={imageProduct !== null}
        onClose={() => setImageProduct(null)}
        onUpload={handleUploadImage}
        product={imageProduct}
      />

      <ProductDeleteModal
        isOpen={deletingProduct !== null}
        onClose={() => setDeletingProduct(null)}
        onConfirm={handleDeleteProduct}
        product={deletingProduct}
      />
    </div>
  );
};
