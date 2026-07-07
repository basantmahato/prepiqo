import React, { useEffect, useState } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { api } from '../services/api';
import styles from './Page.module.css';

export const Users = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', role: '' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/users');
      setUsers(res.data.data);
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (user: any) => {
    setSelectedUser(user);
    setEditForm({ name: user.name, email: user.email, role: user.role });
    setIsEditModalOpen(true);
  };

  const handleDelete = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers(users.filter((u) => u._id !== userId));
    } catch (error) {
      console.error('Failed to delete user', error);
      alert('Failed to delete user');
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await api.put(`/admin/users/${selectedUser._id}`, editForm);
      setUsers(users.map((u) => (u._id === selectedUser._id ? res.data.data : u)));
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Failed to update user', error);
      alert('Failed to update user');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Users</h1>
          <p className={styles.subtitle}>Manage your platform users.</p>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Verified</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className={styles.textCenter}>Loading...</TableCell>
              </TableRow>
            ) : users.map((user) => (
              <TableRow key={user._id}>
                <TableCell className={styles.fontMedium}>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.currentSubscription?.plan?.name || 'Free'}</TableCell>
                <TableCell>{user.isVerified ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <div className={styles.actionButtons}>
                    <Button variant="outline" size="sm" onClick={() => handleEditClick(user)}>Edit</Button>
                    <Button variant="ghost" size="sm" className={styles.deleteTextBtn} onClick={() => handleDelete(user._id)}>Delete</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit User">
        <form onSubmit={handleSaveEdit}>
          <Input 
            label="Name" 
            value={editForm.name} 
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} 
            required 
          />
          <Input 
            label="Email" 
            type="email" 
            value={editForm.email} 
            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} 
            required 
          />
          
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="role-select">Role</label>
            <select 
              id="role-select"
              name="role"
              title="Role"
              value={editForm.role}
              onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
              className={styles.select}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className={styles.formActions}>
            <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Changes'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
