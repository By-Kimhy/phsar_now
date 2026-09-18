import { useMutation } from '@tanstack/react-query';

import { queryClient } from '@/api/query-client';
import { queryKeys } from '@/api/query-keys';
import { useFavoriteStore } from '@/store/favorite-store';
import { impactHaptic } from '@/utils/haptics';

export function useToggleFavorite() {
  const toggle = useFavoriteStore((state) => state.toggle);

  return useMutation({
    mutationFn: async (productId: string) => {
      await impactHaptic();
      return toggle(productId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
}
