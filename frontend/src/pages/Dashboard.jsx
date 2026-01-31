import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user, token, logout } = useAuth(); // Added logout here
    const [stats, setStats] = useState({ totalCases: 0, pendingCases: 0, disposedCases: 0, recentActivity: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/dashboard/stats', {
                    headers: {
                        'Authorization': `Bearer ${token}` // In case backend needs it later
                    }
                });
                const data = await res.json();
                setStats(data);
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [token]);

    if (loading) return <div style={{ padding: '2rem' }}>Loading Stats...</div>; // Added padding for consistency

    return (
        <div style={{ padding: '2rem' }}> {/* Added padding to the main div */}
            <h1 style={{ marginBottom: '2rem' }}>Station Overview</h1>
            <p>Welcome, {user?.username} ({user?.role})</p> {/* Added back user info */}
            <p>Station: {user?.stationName}</p> {/* Added back user info */}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem', marginTop: '2rem' }}> {/* Added marginTop */}
                <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h3 style={{ color: 'var(--color-text-secondary)', margin: 0 }}>Total Cases</h3>
                    <span style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--color-accent-blue)' }}>{stats.totalCases}</span>
                </div>
                <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h3 style={{ color: 'var(--color-text-secondary)', margin: 0 }}>Pending</h3>
                    <span style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--color-accent-gold)' }}>{stats.pendingCases}</span>
                </div>
                <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h3 style={{ color: 'var(--color-text-secondary)', margin: 0 }}>Disposed</h3>
                    <span style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--color-success)' }}>{stats.disposedCases}</span>
                </div>
            </div>

            <h2 style={{ marginBottom: '1rem' }}>Recent Activity</h2>
            <div className="glass-card" style={{ padding: '1rem' }}>
                {stats.recentActivity.length === 0 ? (
                    <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>No recent cases logged.</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)' }}>
                                <th style={{ padding: '0.5rem' }}>Crime #</th>
                                <th style={{ padding: '0.5rem' }}>Year</th>
                                <th style={{ padding: '0.5rem' }}>Date</th>
                                <th style={{ padding: '0.5rem' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.recentActivity.map(item => (
                                <tr key={item._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                    <td style={{ padding: '0.8rem' }}>{item.crimeNumber}</td>
                                    <td style={{ padding: '0.8rem' }}>{item.crimeYear}</td>
                                    <td style={{ padding: '0.8rem' }}>{new Date(item.createdAt).toLocaleDateString()}</td>
                                    <td style={{ padding: '0.8rem' }}>
                                        <span style={{
                                            padding: '0.2rem 0.6rem',
                                            borderRadius: '20px',
                                            fontSize: '0.8rem',
                                            background: item.status === 'PENDING' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                                            color: item.status === 'PENDING' ? 'var(--color-accent-gold)' : 'var(--color-success)'
                                        }}>
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <button onClick={logout} className="btn-primary" style={{ marginTop: '2rem', background: 'var(--color-danger)' }}>
                Logout
            </button>
        </div>
    );
};

export default Dashboard;
