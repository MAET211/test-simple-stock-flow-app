import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { Product } from '../../domain/models/Product';
import { ErrorMessage } from '../../shared/components/ErrorMessage';

interface ProductDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (productId: string) => Promise<void>;
  product: Product | null;
}

export const ProductDeleteModal: React.FC<ProductDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  product,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<unknown>(null);

  if (!isOpen || !product) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      await onConfirm(product.id);
      onClose();
    } catch (err: unknown) {
      setError(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-red-50/50">
          <div className="flex items-center gap-2 text-red-700">
            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold">Dar de baja producto</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-lg hover:bg-slate-100"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <ErrorMessage error={error as Error} onDismiss={() => setError(null)} />

          <p className="text-sm text-slate-600 leading-relaxed">
            ¿Estás seguro de que deseas retirar del catálogo el producto{' '}
            <span className="font-bold text-slate-900">{product.name}</span>?
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
            <strong>Nota:</strong> Esta acción realiza una baja lógica. El producto ya no se ofrecerá para nuevas ventas ni búsquedas en el catálogo, pero su histórico contable permanecerá protegido.
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-5 py-2 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 active:bg-red-800 transition-all shadow-sm disabled:opacity-50"
            >
              {isDeleting ? 'Retirando...' : 'Confirmar Baja'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
