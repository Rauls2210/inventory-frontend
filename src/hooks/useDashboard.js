import { dashboardService } from '../services/dashboard.service';
import { useApiQuery } from './useApiQuery';
import { DASHBOARD_TAG } from './useProducts';

export function useDashboard() {
  return useApiQuery(() => dashboardService.stats(), {
    key: ['dashboard'],
    tags: [DASHBOARD_TAG],
  });
}
