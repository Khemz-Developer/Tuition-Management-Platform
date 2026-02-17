import { useState } from 'react';
import { useTeachers } from '../../../hooks/useTeachers';
import { Table } from '../../../components/ui/Table';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import apiClient from '@shared/api';
import type { TeacherProfile, TeacherStatus } from '@shared/types';

const TeachersPage = () => {
  const [statusFilter, setStatusFilter] = useState<TeacherStatus | 'ALL'>('ALL');
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherProfile | null>(null);
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const params = statusFilter !== 'ALL' ? { status: statusFilter } : {};
  const { teachers, pagination, loading: teachersLoading, error } = useTeachers(params);

  const handleApprove = async () => {
    if (!selectedTeacher) return;
    try {
      setLoading(true);
      await apiClient.approveTeacher({ teacherId: selectedTeacher._id, reason });
      setApproveModalOpen(false);
      setReason('');
      setSelectedTeacher(null);
      window.location.reload(); // Refresh the list
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to approve teacher');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedTeacher || !reason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    try {
      setLoading(true);
      await apiClient.rejectTeacher({ teacherId: selectedTeacher._id, reason });
      setRejectModalOpen(false);
      setReason('');
      setSelectedTeacher(null);
      window.location.reload(); // Refresh the list
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to reject teacher');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Name',
      render: (item: TeacherProfile) => `${item.firstName} ${item.lastName}`,
    },
    {
      key: 'email',
      header: 'Email',
      render: (item: TeacherProfile) => item.userId, // This should be the user email
    },
    {
      key: 'subjects',
      header: 'Subjects',
      render: (item: TeacherProfile) => item.subjects.join(', ') || 'N/A',
    },
    {
      key: 'grades',
      header: 'Grades',
      render: (item: TeacherProfile) => item.grades.join(', ') || 'N/A',
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: TeacherProfile) => (
        <span className={`badge ${item.status === 'APPROVED' ? 'badge-success' : item.status === 'PENDING' ? 'badge-warning' : 'badge-error'}`}>
          {item.status}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: TeacherProfile) => (
        <div className="flex gap-2">
          {item.status === 'PENDING' && (
            <>
              <Button
                size="sm"
                variant="primary"
                onClick={() => {
                  setSelectedTeacher(item);
                  setApproveModalOpen(true);
                }}
              >
                Approve
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={() => {
                  setSelectedTeacher(item);
                  setRejectModalOpen(true);
                }}
              >
                Reject
              </Button>
            </>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => window.open(`/admin/teachers/${item._id}`, '_blank')}
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
          <h1 className="text-3xl font-bold mb-2">Teachers Management</h1>
          <p className="text-base-content/70">Manage teacher applications and profiles</p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant={statusFilter === 'ALL' ? 'primary' : 'outline'}
          onClick={() => setStatusFilter('ALL')}
        >
          All
        </Button>
        <Button
          variant={statusFilter === 'PENDING' ? 'primary' : 'outline'}
          onClick={() => setStatusFilter('PENDING')}
        >
          Pending
        </Button>
        <Button
          variant={statusFilter === 'APPROVED' ? 'primary' : 'outline'}
          onClick={() => setStatusFilter('APPROVED')}
        >
          Approved
        </Button>
        <Button
          variant={statusFilter === 'REJECTED' ? 'primary' : 'outline'}
          onClick={() => setStatusFilter('REJECTED')}
        >
          Rejected
        </Button>
      </div>

      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      {teachersLoading ? (
        <div className="flex items-center justify-center py-12">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <Table
          data={teachers}
          columns={columns}
          keyExtractor={(item) => item._id}
          emptyMessage="No teachers found"
        />
      )}

      <Modal
        isOpen={approveModalOpen}
        onClose={() => {
          setApproveModalOpen(false);
          setReason('');
          setSelectedTeacher(null);
        }}
        title="Approve Teacher"
        actions={
          <>
            <Button variant="outline" onClick={() => setApproveModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleApprove} loading={loading}>
              Approve
            </Button>
          </>
        }
      >
        <p className="mb-4">
          Are you sure you want to approve <strong>{selectedTeacher?.firstName} {selectedTeacher?.lastName}</strong>?
        </p>
        <Input
          label="Reason (optional)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Optional reason for approval"
        />
      </Modal>

      <Modal
        isOpen={rejectModalOpen}
        onClose={() => {
          setRejectModalOpen(false);
          setReason('');
          setSelectedTeacher(null);
        }}
        title="Reject Teacher"
        actions={
          <>
            <Button variant="outline" onClick={() => setRejectModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleReject} loading={loading}>
              Reject
            </Button>
          </>
        }
      >
        <p className="mb-4">
          Are you sure you want to reject <strong>{selectedTeacher?.firstName} {selectedTeacher?.lastName}</strong>?
        </p>
        <Input
          label="Reason (required)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Please provide a reason for rejection"
          required
        />
      </Modal>
    </div>
  );
};

export default TeachersPage;
