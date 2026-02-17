import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="bg-base-100 shadow-md px-6 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">Tuition Management</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="avatar placeholder">
            <div className="bg-neutral text-neutral-content rounded-full w-10">
              <span>{user?.email.charAt(0).toUpperCase()}</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium">{user?.email}</p>
            <p className="text-xs text-base-content/60">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="btn btn-sm btn-outline"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
