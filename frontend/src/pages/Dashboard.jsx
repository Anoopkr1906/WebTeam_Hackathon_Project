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

    const handleExport = () => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Dashboard Summary Report</title>
                    <style>
                        body { font-family: 'Times New Roman', serif; padding: 2rem; color: #000; }
                        .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 1rem; margin-bottom: 2rem; }
                        .logo { font-size: 24px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }
                        .sub-header { margin-top: 5px; font-size: 14px; }
                        .report-title { text-align: center; font-size: 18px; font-weight: bold; text-decoration: underline; margin: 2rem 0; }
                        
                        .section { margin-bottom: 2rem; }
                        .section-title { font-weight: bold; font-size: 16px; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 10px; }
                        
                        .stats-grid { display: flex; justify-content: space-between; margin-bottom: 2rem; border: 1px solid #000; padding: 1rem; }
                        .stat-box { text-align: center; border-right: 1px solid #ccc; flex: 1; }
                        .stat-box:last-child { border-right: none; }
                        .stat-value { font-size: 20px; font-weight: bold; margin-top: 5px; }
                        .stat-label { font-size: 12px; text-transform: uppercase; }

                        table { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 10px; }
                        th, td { border: 1px solid #000; padding: 8px; text-align: left; }
                        th { background-color: #f0f0f0; font-weight: bold; }
                        
                        .footer { margin-top: 4rem; display: flex; justify-content: space-between; page-break-inside: avoid; }
                        .signature-box { text-align: center; width: 40%; }
                        .signature-line { border-top: 1px solid #000; margin-top: 3rem; padding-top: 5px; font-weight: bold; }

                        @media print {
                            body { -webkit-print-color-adjust: exact; }
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div class="logo">e-Malkhana Evidence Management System</div>
                        <div class="sub-header">Dashboard Summary & Activity Report</div>
                        <div class="sub-header">Generated on: ${new Date().toLocaleString()}</div>
                    </div>

                    <div class="report-title">EXECUTIVE SUMMARY</div>

                    <div class="section">
                        <div class="section-title">1. CURRENT STATISTICS</div>
                        <div class="stats-grid">
                            <div class="stat-box">
                                <div class="stat-label">Total Cases</div>
                                <div class="stat-value">${stats.totalCases}</div>
                            </div>
                            <div class="stat-box">
                                <div class="stat-label">Pending</div>
                                <div class="stat-value">${stats.pendingCases}</div>
                            </div>
                            <div class="stat-box">
                                <div class="stat-label">Disposed</div>
                                <div class="stat-value">${stats.disposedCases}</div>
                            </div>
                            <div class="stat-box">
                                <div class="stat-label">High Alerts</div>
                                <div class="stat-value">${stats.alerts ? stats.alerts.longPending : 0}</div>
                            </div>
                        </div>
                    </div>

                    <div class="section">
                        <div class="section-title">2. RECENT ACTIVITY LOG</div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Title / Case ID</th>
                                    <th>Station</th>
                                    <th>Crime No.</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${stats.recentActivity.map(c => `
                                    <tr>
                                        <td>${c.caseId}</td>
                                        <td>${c.stationName}</td>
                                        <td>${c.crimeNumber}/${c.crimeYear}</td>
                                        <td>${c.status}</td>
                                        <td>${new Date(c.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>

                    <div class="footer">
                        <div class="signature-box">
                            <div class="signature-line">Report Generated By</div>
                            <small>${user?.username || 'System User'}</small>
                        </div>
                        <div class="signature-box">
                            <div class="signature-line">Verified By</div>
                            <small>Station House Officer (SHO)</small>
                        </div>
                    </div>

                    <script>
                        window.onload = function() { window.print(); }
                    </script>
                </body>
            </html>
        `);
        printWindow.document.close();
    };

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ margin: 0 }}>Dashboard</h1>
                    <p style={{ color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>Welcome back, {user?.username} <span style={{ fontSize: '0.8rem', background: 'var(--color-accent-blue)', padding: '2px 8px', borderRadius: '40px', color: 'white' }}>{user?.role}</span></p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button onClick={handleExport} className="btn-primary" style={{ border: '1px solid var(--glass-border)' }}>
                        🖨️ Print Dashboard Report
                    </button>
                </div>
            </div>

            <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <h3>Total Cases</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-accent-blue)' }}>{stats.totalCases}</p>
                </div>
                <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <h3>Pending</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-accent-gold)' }}>{stats.pendingCases}</p>
                </div>
                <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <h3>Disposed</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-success)' }}>{stats.disposedCases}</p>
                </div>
            </div>

            {/* High Alert Section */}
            <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem', border: '1px solid var(--color-danger)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <h3 style={{ color: 'var(--color-danger)', margin: 0 }}>High Alert: Long Pending Cases</h3>
                    <p style={{ margin: '0.5rem 0 0', color: 'var(--color-text-secondary)' }}>Cases pending implementation for more than 30 days requires immediate attention.</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-danger)', margin: 0 }}>{stats.alerts ? stats.alerts.longPending : 0}</p>
                    <small style={{ color: 'var(--color-text-secondary)' }}>Cases</small>
                </div>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem' }}>
                <h3>Recent Activity</h3>
                {stats.recentActivity.length === 0 ? (
                    <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', marginTop: '1rem' }}>No recent cases logged.</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', color: 'var(--color-text-secondary)' }}>
                                <th style={{ padding: '0.5rem' }}>Case ID</th>
                                <th style={{ padding: '0.5rem' }}>Station</th>
                                <th style={{ padding: '0.5rem' }}>Status</th>
                                <th style={{ padding: '0.5rem' }}>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.recentActivity.map(c => (
                                <tr key={c._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                    <td style={{ padding: '1rem', color: 'var(--color-text-primary)' }}>{c.caseId}</td>
                                    <td style={{ padding: '1rem', color: 'var(--color-text-secondary)' }}>{c.stationName}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.2rem 0.6rem',
                                            borderRadius: '20px',
                                            fontSize: '0.8rem',
                                            background: c.status === 'PENDING' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                                            color: c.status === 'PENDING' ? 'var(--color-accent-gold)' : 'var(--color-success)'
                                        }}>
                                            {c.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', color: 'var(--color-text-secondary)' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
