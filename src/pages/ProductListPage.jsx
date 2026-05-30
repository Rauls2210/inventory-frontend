import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProducts, useDeleteProduct } from '../hooks/useProducts';
import { PageLoader } from '../components/Spinner';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';
import ConfirmDialog from '../components/ConfirmDialog';
import { formatCurrency } from '../utils/format';

const LIMIT = 10;

export default function ProductListPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [toDelete, setToDelete] = useState(null);

  // Debounce the search input so we don't fire a request on every keystroke.
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const { data, isLoading, isFetching } = useProducts({ page, limit: LIMIT, search });
  const deleteProduct = useDeleteProduct();

  const products = data?.data || [];
  const pagination = data?.pagination;

  const confirmDelete = async () => {
    await deleteProduct.mutateAsync(toDelete.id);
    setToDelete(null);
    // If we deleted the last item on a page, step back.
    if (products.length === 1 && page > 1) setPage((p) => p - 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Products</h2>
          <p className="text-sm text-gray-500">Manage your product catalog</p>
        </div>
        <Link to="/products/new" className="btn-primary">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </Link>
      </div>

      <div className="card">
        <div className="border-b border-gray-200 p-4">
          <div className="relative max-w-sm">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
              </svg>
            </span>
            <input
              type="text"
              className="input pl-10"
              placeholder="Search by name or SKU..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <PageLoader label="Loading products..." />
        ) : products.length === 0 ? (
          <EmptyState
            title="No products found"
            message={search ? 'Try a different search term.' : 'Get started by adding your first product.'}
            action={
              !search && (
                <Link to="/products/new" className="btn-primary">
                  Add Product
                </Link>
              )
            }
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">SKU</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Price</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Stock</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-500">#{p.id}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{p.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{p.sku}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{formatCurrency(p.price)}</td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            p.stock < 5 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {p.stock} in stock
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-sm">
                        <div className="flex justify-end gap-2">
                          <button
                            className="rounded-md px-2 py-1 text-brand-600 hover:bg-brand-50"
                            onClick={() => navigate(`/products/${p.id}/edit`)}
                          >
                            Edit
                          </button>
                          <button
                            className="rounded-md px-2 py-1 text-red-600 hover:bg-red-50"
                            onClick={() => setToDelete(p)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              page={pagination?.page || 1}
              totalPages={pagination?.totalPages || 1}
              onChange={setPage}
            />
          </>
        )}

        {isFetching && !isLoading && (
          <div className="px-4 py-2 text-xs text-gray-400">Updating…</div>
        )}
      </div>

      <ConfirmDialog
        open={!!toDelete}
        title="Delete product"
        message={`Are you sure you want to delete "${toDelete?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        loading={deleteProduct.isPending}
        onConfirm={confirmDelete}
        onClose={() => setToDelete(null)}
      />
    </div>
  );
}
