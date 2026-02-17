import { useState, useEffect } from 'react';
import apiClient from '@shared/api';
import type { PaginatedResponse, TeacherProfile } from '@shared/types';

export const useTeachers = (params?: Record<string, any>) => {
  const [teachers, setTeachers] = useState<TeacherProfile[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.getTeachers(params);
        setTeachers(response.data);
        setPagination(response.pagination);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load teachers');
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, [JSON.stringify(params)]);

  return { teachers, pagination, loading, error };
};
