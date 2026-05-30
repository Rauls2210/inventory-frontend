// A tiny pub/sub used to mimic React Query's cache invalidation. Queries
// subscribe to one or more string "tags"; mutations `invalidate(tags)` after
// they succeed, which re-runs every subscribed query — even across pages.
const listeners = new Map(); // tag -> Set<callback>

export function subscribe(tag, callback) {
  if (!listeners.has(tag)) listeners.set(tag, new Set());
  listeners.get(tag).add(callback);
  // Return an unsubscribe function.
  return () => {
    listeners.get(tag)?.delete(callback);
  };
}

export function invalidate(tags) {
  const list = Array.isArray(tags) ? tags : [tags];
  list.forEach((tag) => {
    listeners.get(tag)?.forEach((cb) => cb());
  });
}
