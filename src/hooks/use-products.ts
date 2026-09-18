import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/api/query-keys';
import { productService } from '@/services';
import type { ProductFilters } from '@/types';

export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: queryKeys.products.list(filters),
    queryFn: () => productService.getProducts(filters),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => productService.getProductById(id),
    enabled: Boolean(id),
  });
}
