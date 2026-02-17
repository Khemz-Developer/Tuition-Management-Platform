import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '@shared/api';
import type { RegisterRequest, TeacherProfile } from '@shared/types';

const Register = () => {
  const { teacherSlug } = useParams<{ teacherSlug?: string }>();
  const [teacher, setTeacher] = useState<TeacherProfile | null>(null);
  const [formData, setFormData] = useState<RegisterRequest>({
    email: '',
    password: '',
    role: 'STUDENT',
    firstName: '',
    lastName: '',
    teacherSlug: teacherSlug,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingTeacher, setLoadingTeacher] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeacher = async () => {
      if (!teacherSlug) return;

      try {
        setLoadingTeacher(true);
        const teacherData = await apiClient.getPublicTeacherProfile(teacherSlug);
        setTeacher(teacherData as any);
        setFormData((prev) => ({ ...prev, teacherSlug }));
      } catch (err) {
        console.error('Failed to load teacher:', err);
      } finally {
        setLoadingTeacher(false);
      }
    };

    fetchTeacher();
  }, [teacherSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData);
      // Redirect to dashboard instead of login since user is now authenticated
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">Student Register</h2>
          {teacher && (
            <div className="alert alert-info mb-4">
              <div className="flex items-center gap-2">
                {teacher.image && (
                  <div className="avatar">
                    <div className="w-8 rounded-full">
                      <img src={teacher.image} alt={teacher.firstName} />
                    </div>
                  </div>
                )}
                <span>
                  Registering with <strong>{teacher.firstName} {teacher.lastName}</strong>
                </span>
              </div>
            </div>
          )}
          {error && (
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          )}
          {loadingTeacher && (
            <div className="alert alert-info">
              <span className="loading loading-spinner loading-sm"></span>
              <span>Loading teacher information...</span>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">First Name</span>
              </label>
              <input
                type="text"
                placeholder="John"
                className="input input-bordered"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                required
              />
            </div>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Last Name</span>
              </label>
              <input
                type="text"
                placeholder="Doe"
                className="input input-bordered"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                required
              />
            </div>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="email@example.com"
                className="input input-bordered"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="password"
                className="input input-bordered"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </div>
            <div className="form-control mt-6">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Registering...
                  </>
                ) : (
                  'Register'
                )}
              </button>
            </div>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm">
              Already have an account?{' '}
              <a href="/login" className="link link-primary">
                Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
