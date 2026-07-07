import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { api } from '../services/api';
import styles from './Page.module.css';

export const Plans = () => {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [form, setForm] = useState({
    name: '',
    price: '',
    currency: 'USD',
    maxRequestsPerWindow: '100',
    features: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/plans');
      setPlans(res.data.data);
    } catch (error) {
      console.error('Failed to fetch plans', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClick = () => {
    setIsEditing(false);
    setSelectedPlan(null);
    setForm({
      name: '',
      price: '',
      currency: 'USD',
      maxRequestsPerWindow: '100',
      features: ''
    });
    setIsModalOpen(true);
  };

  const handleEditClick = (plan: any) => {
    setIsEditing(true);
    setSelectedPlan(plan);
    setForm({
      name: plan.name,
      price: plan.price.toString(),
      currency: plan.currency || 'USD',
      maxRequestsPerWindow: plan.maxRequestsPerWindow?.toString() || '100',
      features: plan.features ? plan.features.join('\n') : ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (planId: string) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) return;
    try {
      await api.delete(`/admin/plans/${planId}`);
      setPlans(plans.filter((p) => p._id !== planId));
    } catch (error) {
      console.error('Failed to delete plan', error);
      alert('Failed to delete plan');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Convert features text area to array
    const featuresArray = form.features
      .split('\n')
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    const payload = {
      ...form,
      price: Number(form.price),
      maxRequestsPerWindow: Number(form.maxRequestsPerWindow),
      features: featuresArray
    };

    try {
      if (isEditing) {
        const res = await api.put(`/admin/plans/${selectedPlan._id}`, payload);
        setPlans(plans.map((p) => (p._id === selectedPlan._id ? res.data.data : p)));
      } else {
        const res = await api.post('/admin/plans', payload);
        setPlans([...plans, res.data.data]);
      }
      setIsModalOpen(false);
    } catch (error: any) {
      console.error('Failed to save plan', error);
      alert(error.response?.data?.message || 'Failed to save plan');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Plans</h1>
          <p className={styles.subtitle}>Manage subscription plans.</p>
        </div>
        <Button onClick={handleCreateClick}>Create Plan</Button>
      </div>

      <div className={styles.grid}>
        {loading ? (
           <p>Loading plans...</p>
        ) : plans.map((plan) => (
          <Card key={plan._id}>
            <CardHeader className={styles.cardHeaderRow}>
              <CardTitle>{plan.name}</CardTitle>
              <button 
                onClick={() => handleDelete(plan._id)} 
                className={styles.deleteIconBtn}
                title="Delete Plan"
                aria-label={`Delete ${plan.name} plan`}
              >
                ✕
              </button>
            </CardHeader>
            <CardContent>
              <div className={styles.price}>
                {plan.currency === 'USD' ? '$' : plan.currency}{plan.price}<span className={styles.priceSuffix}>/mo</span>
              </div>
              <ul className={styles.featureList}>
                {plan.features?.map((f: string, i: number) => <li key={i}>{f}</li>)}
              </ul>
              <Button variant="outline" className={styles.fullWidth} onClick={() => handleEditClick(plan)}>Edit Plan</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditing ? 'Edit Plan' : 'Create Plan'}>
        <form onSubmit={handleSave} className={styles.formCol}>
          <Input 
            label="Plan Name" 
            value={form.name} 
            onChange={(e) => setForm({ ...form, name: e.target.value })} 
            required 
          />
          <div className={styles.formRow}>
            <div className={styles.formFlex1}>
              <Input 
                label="Price" 
                type="number" 
                min="0"
                step="0.01"
                value={form.price} 
                onChange={(e) => setForm({ ...form, price: e.target.value })} 
                required 
              />
            </div>
            <div className={styles.formFlex1}>
              <Input 
                label="Currency" 
                value={form.currency} 
                onChange={(e) => setForm({ ...form, currency: e.target.value })} 
                required 
              />
            </div>
          </div>
          <Input 
            label="Max Requests Per Window" 
            type="number" 
            min="1"
            value={form.maxRequestsPerWindow} 
            onChange={(e) => setForm({ ...form, maxRequestsPerWindow: e.target.value })} 
            required 
          />
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="features-textarea">Features (one per line)</label>
            <textarea 
              id="features-textarea"
              name="features"
              title="Features"
              placeholder="e.g., Priority Support"
              value={form.features}
              onChange={(e) => setForm({ ...form, features: e.target.value })}
              className={styles.textarea}
            />
          </div>

          <div className={styles.formActions}>
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Plan'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
