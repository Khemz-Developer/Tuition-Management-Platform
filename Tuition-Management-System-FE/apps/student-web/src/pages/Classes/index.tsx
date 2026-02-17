import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClasses } from '../../hooks/useClasses';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import apiClient from '@shared/api';
import type { Class } from '@shared/types';

const ClassesPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState('');
  const [requesting, setRequesting] = useState<string | null>(null);

  const params: Record<string, any> = {};
  if (search) params.search = search;
  if (subject) params.subject = subject;
  if (grade) params.grade = grade;

  const { classes, loading, error } = useClasses(params);

  const handleRequestEnrollment = async (classId: string) => {
    try {
      setRequesting(classId);
      await apiClient.requestEnrollment({ classId });
      alert('Enrollment request sent successfully!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to request enrollment');
    } finally {
      setRequesting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Browse Classes</h1>
        <p className="text-base-content/70">Find and join classes that interest you</p>
      </div>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Input
            label="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search classes..."
          />
          <Input
            label="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g., Mathematics"
          />
          <Input
            label="Grade"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            placeholder="e.g., Grade 10"
          />
        </div>
      </Card>

      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : classes.length === 0 ? (
        <Card>
          <div className="text-center py-8 text-base-content/60">
            No classes found. Try adjusting your search filters.
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((classItem: Class) => (
            <Card key={classItem._id} className="hover:shadow-xl transition-shadow">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold mb-2">{classItem.title}</h3>
                  {classItem.description && (
                    <p className="text-sm text-base-content/70 line-clamp-2">
                      {classItem.description}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="badge badge-primary">{classItem.subject}</span>
                  <span className="badge badge-secondary">{classItem.grade}</span>
                  {classItem.fee && (
                    <span className="badge badge-outline">₹{classItem.fee}</span>
                  )}
                  <span className={`badge ${classItem.visibility === 'PUBLIC' ? 'badge-success' : 'badge-warning'}`}>
                    {classItem.visibility}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/classes/${classItem._id}`)}
                  >
                    View Details
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleRequestEnrollment(classItem._id)}
                    loading={requesting === classItem._id}
                  >
                    Request to Join
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClassesPage;
