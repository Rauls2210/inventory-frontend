import api from '../api/axios';

export const inventoryService = {
  add: (payload) => api.post('/inventory/add', payload).then((r) => r.data),
  deduct: (payload) => api.post('/inventory/deduct', payload).then((r) => r.data),
  stock: (productId) => api.get(`/inventory/stock/${productId}`).then((r) => r.data),
  history: (productId, params) =>
    api.get(`/inventory/history/${productId}`, { params }).then((r) => r.data),
};
