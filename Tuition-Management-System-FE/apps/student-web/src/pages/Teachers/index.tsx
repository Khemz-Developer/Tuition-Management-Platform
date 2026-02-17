import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '@shared/api';
import type { TeacherProfile } from '@shared/types';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

const TeachersPage = () => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState<TeacherProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        const params: Record<string, any> = {};
        if (search) params.search = search;
        if (subjectFilter) params.subject = subjectFilter;
        if (gradeFilter) params.grade = gradeFilter;

        // Note: Public teachers endpoint returns { teachers: [] } not paginated
        const response = await apiClient.get<{ teachers: TeacherProfile[] }>('/public/teachers', { params });
        setTeachers(response.teachers || []);
      } catch (error) {
        console.error('Failed to fetch teachers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, [search, subjectFilter, gradeFilter]);

  const handleTeacherClick = (teacher: TeacherProfile) => {
    navigate(`/t/${teacher.slug}`);
  };

  // Get unique subjects and grades from teachers
  const allSubjects = Array.from(
    new Set(teachers.flatMap((t) => t.subjects || []))
  ).sort();
  const allGrades = Array.from(
    new Set(teachers.flatMap((t) => t.grades || []))
  ).sort();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Browse Teachers</h1>
        <p className="text-base-content/70">
          Find the perfect teacher for your learning needs
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">
                <span className="label-text">Search</span>
              </label>
              <Input
                type="text"
                placeholder="Search by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Subject</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
              >
                <option value="">All Subjects</option>
                {allSubjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">
                <span className="label-text">Grade</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value)}
              >
                <option value="">All Grades</option>
                {allGrades.map((grade) => (
                  <option key={grade} value={grade}>
                    Grade {grade}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Teachers Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      ) : teachers.length === 0 ? (
        <Card>
          <div className="card-body text-center py-12">
            <p className="text-base-content/70">No teachers found matching your criteria.</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachers.map((teacher) => (
            <Card
              key={teacher._id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleTeacherClick(teacher)}
            >
              <div className="card-body">
                <div className="flex items-start gap-4">
                  {teacher.image && (
                    <div className="avatar">
                      <div className="w-16 rounded-full">
                        <img src={teacher.image} alt={teacher.firstName} />
                      </div>
                    </div>
                  )}
                  <div className="flex-1">
                    <h2 className="card-title text-lg">
                      {teacher.firstName} {teacher.lastName}
                    </h2>
                    {teacher.tagline && (
                      <p className="text-sm text-base-content/70 mt-1">{teacher.tagline}</p>
                    )}
                  </div>
                </div>

                {teacher.subjects && teacher.subjects.length > 0 && (
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {teacher.subjects.slice(0, 3).map((subject) => (
                        <span key={subject} className="badge badge-primary badge-sm">
                          {subject}
                        </span>
                      ))}
                      {teacher.subjects.length > 3 && (
                        <span className="badge badge-ghost badge-sm">
                          +{teacher.subjects.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {teacher.grades && teacher.grades.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-base-content/60">
                      Grades: {teacher.grades.join(', ')}
                    </p>
                  </div>
                )}

                <div className="card-actions mt-4">
                  <Button
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTeacherClick(teacher);
                    }}
                  >
                    View Profile
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

export default TeachersPage;
