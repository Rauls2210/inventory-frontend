import { useNavigate, Link } from 'react-router-dom';
import { useCreateProduct } from '../hooks/useProducts';
import ProductForm from '../components/ProductForm';

export default function AddProductPage() {
  const navigate = useNavigate();
  const createProduct = useCreateProduct();

  const handleSubmit = async (payload) => {
    await createProduct.mutateAsync(payload);
    navigate('/products');
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link to="/products" className="text-sm text-brand-600 hover:underline">
          ← Back to products
        </Link>
        <h2 className="mt-2 text-2xl font-bold text-gray-900">Add Product</h2>
      </div>

      <div className="card p-6">
        <ProductForm
          mode="create"
          submitting={createProduct.isPending}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/products')}
        />
      </div>
    </div>
  );
}
