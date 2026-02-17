import { useStudentDashboard } from '../hooks/useStudentDashboard';
import { StatsCard } from '../components/ui/StatsCard';

const Dashboard = () => {
  const { stats, loading, error } = useStudentDashboard();

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Student Dashboard</h1>
        <p className="text-base-content/70">Welcome back! Here's your overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Enrolled Classes"
          value={stats?.enrolledClasses || 0}
          icon="📚"
        />
        <StatsCard
          title="Upcoming Sessions"
          value={stats?.upcomingSessions || 0}
          icon="📅"
        />
        <StatsCard
          title="New Materials"
          value={stats?.newMaterials || 0}
          icon="📝"
        />
        <StatsCard
          title="Unread Messages"
          value={stats?.unreadMessages || 0}
          icon="💬"
        />
      </div>
    </div>
  );
};

export default Dashboard;
