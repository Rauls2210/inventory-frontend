import { toast } from 'react-toastify';
import { inventoryService } from '../services/inventory.service';
import { getErrorMessage } from '../utils/format';
import { useApiQuery } from './useApiQuery';
import { useApiMutation } from './useApiMutation';
import { PRODUCTS_TAG, DASHBOARD_TAG } from './useProducts';

export const INVENTORY_TAG = 'inventory';

export function useStock(productId) {
  return useApiQuery(() => inventoryService.stock(productId), {
    key: ['stock', productId],
    enabled: !!productId,
    tags: [INVENTORY_TAG],
  });
}

export function useInventoryHistory(productId, params) {
  return useApiQuery(() => inventoryService.history(productId, params), {
    key: ['history', productId, params],
    enabled: !!productId,
    tags: [INVENTORY_TAG],
  });
}

// A stock change touches the product's stock, the dashboard totals, and the
// history — invalidate all three so every mounted query refreshes.
const STOCK_INVALIDATES = [INVENTORY_TAG, PRODUCTS_TAG, DASHBOARD_TAG];

export function useAddStock() {
  return useApiMutation((payload) => inventoryService.add(payload), {
    invalidates: STOCK_INVALIDATES,
    onSuccess: () => toast.success('Stock added'),
    onError: (err) => toast.error(getErrorMessage(err)),
  });
}

export function useDeductStock() {
  return useApiMutation((payload) => inventoryService.deduct(payload), {
    invalidates: STOCK_INVALIDATES,
    onSuccess: () => toast.success('Stock deducted'),
    onError: (err) => toast.error(getErrorMessage(err)),
  });
}
