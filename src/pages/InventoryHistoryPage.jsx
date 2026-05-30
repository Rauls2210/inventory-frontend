import { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useInventoryHistory } from '../hooks/useInventory';
import { PageLoader } from '../components/Spinner';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';
import { formatDate } from '../utils/format';

const LIMIT = 10;

export default function InventoryHistoryPage() {
  const [productId, setProductId] = useState('');
  const [page, setPage] = useState(1);

  const { data: productData } = useProducts({ page: 1, limit: 100 });
  const products = productData?.data || [];

  const { data, isLoading, isFetching } = useInventoryHistory(
    productId,
    { page, limit: LIMIT }
  );

  const rows = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Inventory History</h2>
        <p className="text-sm text-gray-500">Audit trail of all stock changes</p>
      </div>

      <div className="card p-5">
        <label className="label">Select Product</label>
        <select
          className="input max-w-sm"
          value={productId}
          onChange={(e) => {
            setProductId(e.target.value);
            setPage(1);
          }}
        >
          <option value="">— Choose a product —</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.sku})
            </option>
          ))}
        </select>
      </div>

      {!productId ? (
        <div className="card p-8 text-center text-sm text-gray-500">
          Select a product to view its inventory history.
        </div>
      ) : (
        <div className="card">
          {isLoading ? (
            <PageLoader label="Loading history..." />
          ) : rows.length === 0 ? (
            <EmptyState title="No history yet" message="This product has no recorded stock changes." />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Product</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Action</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Quantity</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Previous</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">New</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">User</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {rows.map((tx) => (
                      <tr key={tx.id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">{formatDate(tx.createdAt)}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{tx.product?.name}</td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              tx.action === 'ADD' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {tx.action}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">{tx.quantity}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{tx.previousStock}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{tx.newStock}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{tx.user?.name || '—'}</td>
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
      )}
    </div>
  );
}
