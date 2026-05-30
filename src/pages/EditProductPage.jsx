import { useNavigate, useParams, Link } from 'react-router-dom';
import { useProduct, useUpdateProduct } from '../hooks/useProducts';
import ProductForm from '../components/ProductForm';
import { PageLoader } from '../components/Spinner';
import EmptyState from '../components/EmptyState';

export default function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useProduct(id);
  const updateProduct = useUpdateProduct();

  const product = data?.data;

  const handleSubmit = async (payload) => {
    await updateProduct.mutateAsync({ id, payload });
    navigate('/products');
  };

  if (isLoading) return <PageLoader label="Loading product..." />;
  if (isError || !product) {
    return (
      <EmptyState
        title="Product not found"
        message="The product you are looking for does not exist."
        action={
          <Link to="/products" className="btn-primary">
            Back to products
          </Link>
        }
      />
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link to="/products" className="text-sm text-brand-600 hover:underline">
          ← Back to products
        </Link>
        <h2 className="mt-2 text-2xl font-bold text-gray-900">Edit Product</h2>
        <p className="text-sm text-gray-500">{product.name}</p>
      </div>

      <div className="card p-6">
        <ProductForm
          mode="edit"
          submitting={updateProduct.isPending}
          defaultValues={{
            name: product.name,
            sku: product.sku,
            price: product.price,
            stock: product.stock,
          }}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/products')}
        />
      </div>
    </div>
  );
}
