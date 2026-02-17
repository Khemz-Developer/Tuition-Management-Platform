import { useState, useEffect } from 'react';
import apiClient from '@shared/api';
import type { TeacherDashboardStats } from '@shared/types';

export const useTeacherDashboard = () => {
  const [stats, setStats] = useState<TeacherDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiClient.getTeacherDashboard();
        setStats(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
};
