import { useDashboard } from '../hooks/useDashboard';
import StatCard from '../components/StatCard';
import { getErrorMessage } from '../utils/format';

const icons = {
  products: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  stock: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2" />
    </svg>
  ),
  low: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M5.07 19h13.86a2 2 0 001.74-3L13.74 4a2 2 0 00-3.48 0L3.34 16a2 2 0 001.73 3z" />
    </svg>
  ),
  tx: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-6h13M9 17H4l3-3m0 6l-3-3m11-7V1m0 0L11 4m3-3l3 3" />
    </svg>
  ),
};

export default function DashboardPage() {
  const { data, isLoading, isError, error } = useDashboard();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-sm text-gray-500">Overview of your inventory</p>
      </div>

      {isError && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {getErrorMessage(error, 'Failed to load dashboard')}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Products" value={data?.totalProducts ?? 0} icon={icons.products} accent="brand" loading={isLoading} />
        <StatCard title="Total Stock" value={data?.totalStock ?? 0} icon={icons.stock} accent="green" loading={isLoading} />
        <StatCard title="Low Stock Products" value={data?.lowStockProducts ?? 0} icon={icons.low} accent="amber" loading={isLoading} />
        <StatCard title="Transactions" value={data?.totalTransactions ?? 0} icon={icons.tx} accent="purple" loading={isLoading} />
      </div>

      <div className="card p-6">
        <h3 className="text-base font-semibold text-gray-900">About low stock</h3>
        <p className="mt-1 text-sm text-gray-500">
          Products with fewer than <span className="font-medium">5</span> units in stock are flagged
          as low stock. Keep an eye on this number to avoid running out.
        </p>
      </div>
    </div>
  );
}
