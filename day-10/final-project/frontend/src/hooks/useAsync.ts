import { useCallback, useEffect, useState } from 'react';
import { friendlyError } from '../services/api';

export function useAsync<T>(load: () => Promise<T>, dependencies: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setData(await load());
    } catch (cause) {
      setError(friendlyError(cause));
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  useEffect(() => { void refresh(); }, [refresh]);
  return { data, loading, error, refresh, setData };
}
