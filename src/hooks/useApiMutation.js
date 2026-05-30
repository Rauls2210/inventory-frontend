import { useCallback, useState } from 'react';
import { invalidate } from './invalidationBus';

/**
 * Generic mutation hook — a small stand-in for React Query's useMutation.
 *
 * @param {Function} mutationFn  async function performing the mutation
 * @param {Object}   options
 * @param {string[]} options.invalidates  tags to invalidate on success
 * @param {Function} options.onSuccess    hook-level success handler (e.g. toast)
 * @param {Function} options.onError      hook-level error handler (e.g. toast)
 *
 * Returns { mutate, mutateAsync, isPending, error }.
 * `mutateAsync` resolves/rejects so callers can await it.
 * `mutate(vars, { onSuccess })` is fire-and-forget; its per-call onSuccess runs
 * after the hook-level one (matching React Query semantics).
 */
export function useApiMutation(mutationFn, { invalidates = [], onSuccess, onError } = {}) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  const mutateAsync = useCallback(
    async (variables) => {
      setIsPending(true);
      setError(null);
      try {
        const data = await mutationFn(variables);
        invalidate(invalidates);
        onSuccess?.(data, variables);
        return data;
      } catch (e) {
        setError(e);
        onError?.(e, variables);
        throw e;
      } finally {
        setIsPending(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const mutate = useCallback(
    (variables, opts = {}) => {
      mutateAsync(variables)
        .then((data) => opts.onSuccess?.(data, variables))
        // Errors are already surfaced via the hook-level onError; swallow here
        // so fire-and-forget calls don't produce unhandled rejections.
        .catch(() => {});
    },
    [mutateAsync]
  );

  return { mutate, mutateAsync, isPending, error };
}
