import { useTeacherDashboard } from '../../hooks/useTeacherDashboard';
import { StatsCard } from '../../components/ui/StatsCard';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { useNavigate } from 'react-router-dom';
import type { ClassStats } from '@shared/types';

const TeacherDashboard = () => {
  const { stats, loading, error } = useTeacherDashboard();
  const navigate = useNavigate();

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

  const classColumns = [
    { key: 'className', header: 'Class Name' },
    { key: 'studentCount', header: 'Students' },
    { key: 'attendancePercentage', header: 'Attendance', render: (item: ClassStats) => `${item.attendancePercentage}%` },
    { key: 'upcomingSessions', header: 'Upcoming Sessions' },
    { key: 'unreadMessages', header: 'Unread Messages' },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: ClassStats) => (
        <button
          className="btn btn-sm btn-primary"
          onClick={() => navigate(`/teacher/classes/${item.classId}`)}
        >
          View
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Teacher Dashboard</h1>
        <p className="text-base-content/70">Overview of your classes and students</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Classes"
          value={stats?.totalClasses || 0}
          icon="📚"
        />
        <StatsCard
          title="Total Students"
          value={stats?.totalStudents || 0}
          icon="👨‍🎓"
        />
        <StatsCard
          title="Upcoming Sessions"
          value={stats?.upcomingSessions || 0}
          icon="📅"
        />
        <StatsCard
          title="Unread Messages"
          value={stats?.unreadMessages || 0}
          icon="💬"
        />
      </div>

      <Card title="Class Overview">
        {stats?.classStats && stats.classStats.length > 0 ? (
          <Table
            data={stats.classStats}
            columns={classColumns}
            keyExtractor={(item) => item.classId}
          />
        ) : (
          <div className="text-center py-8">
            <p className="text-base-content/60 mb-4">No classes yet</p>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/teacher/classes/create')}
            >
              Create Your First Class
            </button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default TeacherDashboard;
