import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Users, CreditCard, Activity } from 'lucide-react';
import { api } from '../services/api';
import styles from './Dashboard.module.css';

export const Dashboard = () => {
  const [statsData, setStatsData] = useState<{ totalUsers: number, activeSubscriptions: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/dashboard-stats');
        setStatsData(res.data.data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { title: 'Total Users', value: loading ? '...' : statsData?.totalUsers ?? '0', icon: Users },
    { title: 'Active Subscriptions', value: loading ? '...' : statsData?.activeSubscriptions ?? '0', icon: CreditCard },
    { title: 'System Status', value: 'Healthy', icon: Activity },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>Welcome to the Prepiqo admin overview.</p>
      </div>

      <div className={styles.statsGrid}>
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i}>
              <CardHeader className={styles.cardHeaderRow}>
                <CardTitle className={styles.cardTitle}>{stat.title}</CardTitle>
                <Icon size={16} className={styles.cardIcon} />
              </CardHeader>
              <CardContent>
                <div className={styles.statValue}>{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
