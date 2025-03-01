import { useCallback, useEffect, useState } from "react";

export function useAsync<T>(func: () => Promise<T>, dependencies: any[] = []) {
  const { execute, ...state } = useAsyncInterval<T>(func, dependencies, true);
  useEffect(() => {
    execute();
  }, [execute]);
  return state;
}

export function useAsyncFn<T>(
  func: (...args: any[]) => Promise<T>,
  dependencies: any[] = []
) {
  return useAsyncInterval<T>(func, dependencies, false);
}

export function useAsyncInterval<T>(
  func: (...args: any[]) => Promise<T>,
  dependencies: any[],
  initLoading = false
) {
  const [loading, setLoading] = useState(initLoading);
  const [error, setError] = useState(null);
  const [data, setData] = useState<T | null>(null);

  const execute = useCallback((...params: any[]) => {
    setLoading(true);

    return func(...params)
      .then((res) => {
        setData(res);
        setError(null);
        return res;
      })
      .catch((err) => {
        setError(err);
        setData(null);
        return Promise.reject(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, dependencies);
  return { loading, error, data, execute };
}
