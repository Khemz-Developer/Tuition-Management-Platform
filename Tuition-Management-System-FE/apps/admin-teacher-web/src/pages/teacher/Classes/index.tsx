import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClasses } from '../../../hooks/useClasses';
import { Table } from '../../../components/ui/Table';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import apiClient from '@shared/api';
import type { Class, CreateClassRequest, ClassStatus, ClassVisibility } from '@shared/types';

const ClassesPage = () => {
  const navigate = useNavigate();
  const { classes, loading, error } = useClasses({}, true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState<CreateClassRequest>({
    title: '',
    description: '',
    subject: '',
    grade: '',
    fee: undefined,
    capacity: undefined,
    visibility: ClassVisibility.PUBLIC,
    status: ClassStatus.ACTIVE,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async () => {
    try {
      setSubmitting(true);
      await apiClient.createClass(formData);
      setCreateModalOpen(false);
      setFormData({
        title: '',
        description: '',
        subject: '',
        grade: '',
        fee: undefined,
        capacity: undefined,
        visibility: ClassVisibility.PUBLIC,
        status: ClassStatus.ACTIVE,
      });
      window.location.reload();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create class');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      key: 'title',
      header: 'Class Name',
      render: (item: Class) => (
        <div>
          <div className="font-semibold">{item.title}</div>
          {item.description && (
            <div className="text-sm text-base-content/70">{item.description}</div>
          )}
        </div>
      ),
    },
    {
      key: 'subject',
      header: 'Subject',
    },
    {
      key: 'grade',
      header: 'Grade',
    },
    {
      key: 'fee',
      header: 'Fee',
      render: (item: Class) => item.fee ? `₹${item.fee}` : 'Free',
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: Class) => (
        <span className={`badge ${item.status === 'ACTIVE' ? 'badge-success' : item.status === 'DRAFT' ? 'badge-warning' : 'badge-error'}`}>
          {item.status}
        </span>
      ),
    },
    {
      key: 'visibility',
      header: 'Visibility',
      render: (item: Class) => (
        <span className={`badge ${item.visibility === 'PUBLIC' ? 'badge-primary' : 'badge-secondary'}`}>
          {item.visibility}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: Class) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="primary"
            onClick={() => navigate(`/teacher/classes/${item._id}`)}
          >
            View
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Classes</h1>
          <p className="text-base-content/70">Manage your tuition classes</p>
        </div>
        <Button variant="primary" onClick={() => setCreateModalOpen(true)}>
          + Create Class
        </Button>
      </div>

      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <Card>
          <Table
            data={classes}
            columns={columns}
            keyExtractor={(item) => item._id}
            emptyMessage="No classes found. Create your first class!"
          />
        </Card>
      )}

      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Class"
        size="lg"
        actions={
          <>
            <Button variant="outline" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreate} loading={submitting}>
              Create Class
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Class Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g., Mathematics Grade 10"
            required
          />
          <div>
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Class description..."
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="e.g., Mathematics"
              required
            />
            <Input
              label="Grade"
              value={formData.grade}
              onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
              placeholder="e.g., Grade 10"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Fee (₹)"
              type="number"
              value={formData.fee || ''}
              onChange={(e) => setFormData({ ...formData, fee: e.target.value ? Number(e.target.value) : undefined })}
              placeholder="Optional"
            />
            <Input
              label="Capacity"
              type="number"
              value={formData.capacity || ''}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value ? Number(e.target.value) : undefined })}
              placeholder="Optional"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">
                <span className="label-text">Visibility</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={formData.visibility}
                onChange={(e) => setFormData({ ...formData, visibility: e.target.value as ClassVisibility })}
              >
                <option value={ClassVisibility.PUBLIC}>Public</option>
                <option value={ClassVisibility.PRIVATE}>Private</option>
              </select>
            </div>
            <div>
              <label className="label">
                <span className="label-text">Status</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as ClassStatus })}
              >
                <option value={ClassStatus.DRAFT}>Draft</option>
                <option value={ClassStatus.ACTIVE}>Active</option>
              </select>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ClassesPage;
