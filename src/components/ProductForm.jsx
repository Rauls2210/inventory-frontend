import { useForm } from 'react-hook-form';
import Spinner from './Spinner';

// Reusable create/edit form. `mode` toggles whether the stock field is editable
// and what the submit button says.
export default function ProductForm({ defaultValues, onSubmit, submitting, mode = 'create', onCancel }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      sku: '',
      price: '',
      stock: 0,
      ...defaultValues,
    },
  });

  const submit = (values) =>
    onSubmit({
      name: values.name.trim(),
      sku: values.sku.trim(),
      price: Number(values.price),
      stock: Number(values.stock),
    });

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-5" noValidate>
      <div>
        <label className="label" htmlFor="name">Name</label>
        <input
          id="name"
          className="input"
          placeholder="Dell Laptop"
          {...register('name', { required: 'Name is required' })}
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <label className="label" htmlFor="sku">SKU</label>
        <input
          id="sku"
          className="input"
          placeholder="DELL01"
          {...register('sku', { required: 'SKU is required' })}
        />
        {errors.sku && <p className="mt-1 text-sm text-red-600">{errors.sku.message}</p>}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="price">Price</label>
          <input
            id="price"
            type="number"
            step="0.01"
            className="input"
            placeholder="55000"
            {...register('price', {
              required: 'Price is required',
              valueAsNumber: true,
              validate: (v) => v > 0 || 'Price must be greater than 0',
            })}
          />
          {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
        </div>

        <div>
          <label className="label" htmlFor="stock">
            {mode === 'create' ? 'Initial Stock' : 'Stock'}
          </label>
          <input
            id="stock"
            type="number"
            className="input"
            placeholder="10"
            {...register('stock', {
              valueAsNumber: true,
              validate: (v) => v >= 0 || 'Stock must be 0 or greater',
            })}
          />
          {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? <Spinner className="h-4 w-4" /> : mode === 'create' ? 'Create Product' : 'Save Changes'}
        </button>
        {onCancel && (
          <button type="button" className="btn-secondary" onClick={onCancel} disabled={submitting}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
