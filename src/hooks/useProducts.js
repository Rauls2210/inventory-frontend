import { toast } from 'react-toastify';
import { productService } from '../services/product.service';
import { getErrorMessage } from '../utils/format';
import { useApiQuery } from './useApiQuery';
import { useApiMutation } from './useApiMutation';

// Invalidation tags shared with the inventory hooks.
export const PRODUCTS_TAG = 'products';
export const DASHBOARD_TAG = 'dashboard';

export function useProducts(params) {
  return useApiQuery(() => productService.list(params), {
    key: ['products', params],
    tags: [PRODUCTS_TAG],
  });
}

export function useProduct(id) {
  return useApiQuery(() => productService.get(id), {
    key: ['product', id],
    enabled: !!id,
    tags: [PRODUCTS_TAG],
  });
}

export function useCreateProduct() {
  return useApiMutation((payload) => productService.create(payload), {
    invalidates: [PRODUCTS_TAG, DASHBOARD_TAG],
    onSuccess: () => toast.success('Product created'),
    onError: (err) => toast.error(getErrorMessage(err)),
  });
}

export function useUpdateProduct() {
  return useApiMutation(({ id, payload }) => productService.update(id, payload), {
    invalidates: [PRODUCTS_TAG, DASHBOARD_TAG],
    onSuccess: () => toast.success('Product updated'),
    onError: (err) => toast.error(getErrorMessage(err)),
  });
}

export function useDeleteProduct() {
  return useApiMutation((id) => productService.remove(id), {
    invalidates: [PRODUCTS_TAG, DASHBOARD_TAG],
    onSuccess: () => toast.success('Product deleted'),
    onError: (err) => toast.error(getErrorMessage(err)),
  });
}
