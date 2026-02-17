import { useState, useEffect } from 'react';
import apiClient from '@shared/api';
import type { PaginatedResponse, Class } from '@shared/types';

export const useClasses = (params?: Record<string, any>) => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.browseClasses(params);
        setClasses(response.data);
        setPagination(response.pagination);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load classes');
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [JSON.stringify(params)]);

  return { classes, pagination, loading, error };
};
