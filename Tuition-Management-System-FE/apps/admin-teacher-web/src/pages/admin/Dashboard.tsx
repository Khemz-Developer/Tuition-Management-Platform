import { useAdminDashboard } from '../../hooks/useAdminDashboard';
import { StatsCard } from '../../components/ui/StatsCard';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import type { TeacherStats } from '@shared/types';

const AdminDashboard = () => {
  const { stats, loading, error } = useAdminDashboard();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span>{error}</span>
      </div>
    );
  }

  const teacherColumns = [
    { key: 'teacherName', header: 'Teacher' },
    { key: 'subjects', header: 'Subjects', render: (item: TeacherStats) => item.subjects.join(', ') },
    { key: 'activeClasses', header: 'Active Classes' },
    { key: 'totalStudents', header: 'Total Students' },
    { key: 'attendanceAverage', header: 'Avg Attendance', render: (item: TeacherStats) => `${item.attendanceAverage}%` },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-base-content/70">Overview of platform statistics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Teachers"
          value={stats?.totalTeachers || 0}
          icon="👨‍🏫"
        />
        <StatsCard
          title="Pending Approvals"
          value={stats?.pendingTeachers || 0}
          icon="⏳"
        />
        <StatsCard
          title="Total Students"
          value={stats?.totalStudents || 0}
          icon="👨‍🎓"
        />
        <StatsCard
          title="Total Classes"
          value={stats?.totalClasses || 0}
          icon="📚"
        />
      </div>

      <Card title="Teacher Statistics">
        {stats?.teacherStats && stats.teacherStats.length > 0 ? (
          <Table
            data={stats.teacherStats}
            columns={teacherColumns}
            keyExtractor={(item) => item.teacherId}
          />
        ) : (
          <p className="text-center text-base-content/60 py-4">No teacher statistics available</p>
        )}
      </Card>
    </div>
  );
};

export default AdminDashboard;
