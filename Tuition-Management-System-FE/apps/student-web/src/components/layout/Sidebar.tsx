import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/classes', label: 'My Classes', icon: '📚' },
    { path: '/calendar', label: 'Calendar', icon: '📅' },
    { path: '/messages', label: 'Messages', icon: '💬' },
  ];

  return (
    <aside className="w-64 bg-base-100 shadow-lg">
      <div className="p-4">
        <h2 className="text-xl font-bold">Student Portal</h2>
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
