import { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useStock, useAddStock, useDeductStock } from '../hooks/useInventory';
import Spinner from '../components/Spinner';
import { formatCurrency } from '../utils/format';

function StockForm({ title, accent, buttonClass, busy, onSubmit }) {
  const [qty, setQty] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const n = Number(qty);
    if (!n || n <= 0) return;
    onSubmit(n, () => setQty(''));
  };

  return (
    <form onSubmit={submit} className="card p-5">
      <h3 className={`mb-3 text-base font-semibold ${accent}`}>{title}</h3>
      <label className="label">Quantity</label>
      <input
        type="number"
        min="1"
        className="input"
        placeholder="Enter quantity"
        value={qty}
        onChange={(e) => setQty(e.target.value)}
      />
      <button type="submit" className={`${buttonClass} mt-4 w-full`} disabled={busy}>
        {busy ? <Spinner className="h-4 w-4" /> : title}
      </button>
    </form>
  );
}

export default function InventoryPage() {
  const [productId, setProductId] = useState('');

  // Load all products (up to 100) for the dropdown.
  const { data: productData, isLoading: loadingProducts } = useProducts({ page: 1, limit: 100 });
  const products = productData?.data || [];

  const { data: stockData, isFetching: loadingStock } = useStock(productId);
  const stock = stockData?.data;

  const addStock = useAddStock();
  const deductStock = useDeductStock();

  const handleAdd = (quantity, reset) => {
    addStock.mutate(
      { productId: Number(productId), quantity },
      { onSuccess: reset }
    );
  };

  const handleDeduct = (quantity, reset) => {
    deductStock.mutate(
      { productId: Number(productId), quantity },
      { onSuccess: reset }
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Inventory</h2>
        <p className="text-sm text-gray-500">Add or deduct stock for a product</p>
      </div>

      <div className="card p-5">
        <label className="label">Select Product</label>
        <select
          className="input"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          disabled={loadingProducts}
        >
          <option value="">— Choose a product —</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.sku})
            </option>
          ))}
        </select>
      </div>

      {productId && (
        <>
          <div className="card flex items-center justify-between p-5">
            <div>
              <p className="text-sm font-medium text-gray-500">Current Stock</p>
              <p className="text-3xl font-bold text-gray-900">
                {loadingStock ? '…' : stock?.stock ?? 0}
              </p>
              {stock && (
                <p className="text-xs text-gray-500">
                  {stock.name} · {stock.sku}
                </p>
              )}
            </div>
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-xl ${
                (stock?.stock ?? 0) < 5 ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'
              }`}
            >
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2" />
              </svg>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <StockForm
              title="Add Stock"
              accent="text-green-700"
              buttonClass="btn-primary"
              busy={addStock.isPending}
              onSubmit={handleAdd}
            />
            <StockForm
              title="Deduct Stock"
              accent="text-red-700"
              buttonClass="btn-danger"
              busy={deductStock.isPending}
              onSubmit={handleDeduct}
            />
          </div>
        </>
      )}

      {!productId && (
        <div className="card p-8 text-center text-sm text-gray-500">
          Select a product above to manage its stock.
        </div>
      )}
    </div>
  );
}
