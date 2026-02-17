import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '@shared/api';
import type { TeacherProfile, Class } from '@shared/types';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

const PublicTeacherProfile = () => {
  const { teacherSlug } = useParams<{ teacherSlug: string }>();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState<TeacherProfile | null>(null);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTeacherProfile = async () => {
      if (!teacherSlug) return;

      try {
        setLoading(true);
        const teacherData = await apiClient.getPublicTeacherProfile(teacherSlug);
        setTeacher(teacherData as any);

        // Fetch teacher's classes
        const classesData = await apiClient.getPublicTeacherClasses(teacherSlug);
        setClasses(classesData as any);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load teacher profile');
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherProfile();
  }, [teacherSlug]);

  const handleRegister = () => {
    navigate(`/register/${teacherSlug}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (error || !teacher) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <Card className="max-w-md">
          <div className="card-body">
            <h2 className="card-title text-error">Error</h2>
            <p>{error || 'Teacher not found'}</p>
            <div className="card-actions justify-end">
              <Button onClick={() => navigate('/teachers')}>Browse Teachers</Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const teacherData = teacher as any;

  return (
    <div className="min-h-screen bg-base-200">
      {/* Hero Section */}
      <div className="relative">
        {teacherData.coverImage && (
          <div
            className="h-64 bg-cover bg-center"
            style={{ backgroundImage: `url(${teacherData.coverImage})` }}
          />
        )}
        <div className={`${teacherData.coverImage ? 'absolute bottom-0 left-0 right-0' : ''} bg-base-100 p-6`}>
          <div className="container mx-auto flex items-end gap-6">
            {teacherData.image && (
              <div className="avatar">
                <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img src={teacherData.image} alt={teacherData.firstName} />
                </div>
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold">
                {teacherData.firstName} {teacherData.lastName}
              </h1>
              {teacherData.tagline && (
                <p className="text-lg text-base-content/70 mt-1">{teacherData.tagline}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            {teacherData.bio && (
              <Card>
                <div className="card-body">
                  <h2 className="card-title">About</h2>
                  <p className="text-base-content/80 whitespace-pre-line">{teacherData.bio}</p>
                </div>
              </Card>
            )}

            {/* Subjects & Grades */}
            <Card>
              <div className="card-body">
                <h2 className="card-title">Subjects & Grades</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Subjects:</h3>
                    <div className="flex flex-wrap gap-2">
                      {teacherData.subjects?.map((subject: string) => (
                        <span key={subject} className="badge badge-primary badge-lg">
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Grades:</h3>
                    <div className="flex flex-wrap gap-2">
                      {teacherData.grades?.map((grade: string) => (
                        <span key={grade} className="badge badge-secondary badge-lg">
                          Grade {grade}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Classes Section */}
            {classes.length > 0 && (
              <Card>
                <div className="card-body">
                  <h2 className="card-title">Available Classes</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {classes.map((classItem) => (
                      <div key={classItem._id} className="card bg-base-200">
                        <div className="card-body p-4">
                          <h3 className="card-title text-lg">{classItem.title}</h3>
                          <p className="text-sm text-base-content/70">{classItem.description}</p>
                          <div className="flex gap-2 mt-2">
                            <span className="badge">{classItem.subject}</span>
                            <span className="badge badge-outline">Grade {classItem.grade}</span>
                          </div>
                          {classItem.fee && (
                            <p className="text-lg font-semibold mt-2">₹{classItem.fee}/month</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Register CTA */}
            <Card>
              <div className="card-body">
                <h2 className="card-title">Ready to Start Learning?</h2>
                <p className="text-sm text-base-content/70">
                  Register with {teacherData.firstName} to get started with personalized tutoring.
                </p>
                <div className="card-actions mt-4">
                  <Button className="w-full" onClick={handleRegister}>
                    Register with {teacherData.firstName}
                  </Button>
                </div>
              </div>
            </Card>

            {/* Contact Info */}
            {teacherData.contact && (
              <Card>
                <div className="card-body">
                  <h2 className="card-title">Contact</h2>
                  {teacherData.contact.email && (
                    <p className="text-sm">
                      <span className="font-semibold">Email:</span> {teacherData.contact.email}
                    </p>
                  )}
                  {teacherData.contact.phone && (
                    <p className="text-sm">
                      <span className="font-semibold">Phone:</span> {teacherData.contact.phone}
                    </p>
                  )}
                </div>
              </Card>
            )}

            {/* Location */}
            {teacherData.location && (
              <Card>
                <div className="card-body">
                  <h2 className="card-title">Location</h2>
                  <p className="text-sm">
                    {teacherData.location.city && `${teacherData.location.city}, `}
                    {teacherData.location.state && `${teacherData.location.state}, `}
                    {teacherData.location.country}
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicTeacherProfile;
