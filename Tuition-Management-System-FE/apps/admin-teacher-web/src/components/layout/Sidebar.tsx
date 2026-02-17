import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const isTeacher = user?.role === 'TEACHER';

  const adminNavItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/teachers', label: 'Teachers', icon: '👨‍🏫' },
    { path: '/admin/students', label: 'Students', icon: '👨‍🎓' },
    { path: '/admin/classes', label: 'Classes', icon: '📚' },
    { path: '/admin/settings', label: 'Settings', icon: '⚙️' },
  ];

  const teacherNavItems = [
    { path: '/teacher/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/teacher/classes', label: 'Classes', icon: '📚' },
    { path: '/teacher/sessions', label: 'Sessions', icon: '📅' },
    { path: '/teacher/students', label: 'Students', icon: '👨‍🎓' },
    { path: '/teacher/content', label: 'Content', icon: '📝' },
    { path: '/teacher/messaging', label: 'Messages', icon: '💬' },
    { path: '/teacher/website', label: 'Website', icon: '🌐' },
  ];

  const navItems = isAdmin ? adminNavItems : teacherNavItems;
  const basePath = isAdmin ? '/admin' : '/teacher';

  return (
    <aside className="w-64 bg-base-100 shadow-lg">
      <div className="p-4">
        <h2 className="text-xl font-bold">
          {isAdmin ? 'Admin Portal' : 'Teacher Portal'}
        </h2>
      </div>
      <nav className="mt-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 hover:bg-base-200 transition-colors ${
                isActive ? 'bg-primary text-primary-content' : ''
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
