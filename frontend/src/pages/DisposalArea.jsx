import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../config';

const DisposalArea = () => {
    const { token } = useAuth();
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDisposalRecords();
    }, []);

    const fetchDisposalRecords = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/disposal`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setRecords(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div style={{ padding: '2rem' }}>Loading Records...</div>;

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Disposal Area 🗑️</h1>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>History of all disposed properties.</p>

            <div className="glass-card" style={{ padding: '1rem' }}>
                <div className="table-responsive">
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)', color: 'var(--color-text-secondary)' }}>
                                <th style={{ padding: '1rem' }}>Date</th>
                                <th style={{ padding: '1rem' }}>Case ID</th>
                                <th style={{ padding: '1rem' }}>Property</th>
                                <th style={{ padding: '1rem' }}>Method</th>
                                <th style={{ padding: '1rem' }}>Order Ref</th>
                                <th style={{ padding: '1rem' }}>Authorised By</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map(rec => (
                                <tr key={rec._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                    <td style={{ padding: '1rem' }}>{new Date(rec.date).toLocaleDateString()}</td>
                                    <td style={{ padding: '1rem', color: 'var(--color-accent-blue)' }}>{rec.caseId?.caseId || 'N/A'}</td>
                                    <td style={{ padding: '1rem' }}>{rec.propertyId?.category} ({rec.propertyId?.quantity})</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.2rem 0.6rem',
                                            borderRadius: '20px',
                                            fontSize: '0.8rem',
                                            background: 'rgba(239, 68, 68, 0.2)',
                                            color: 'var(--color-danger)'
                                        }}>
                                            {rec.disposalType}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>{rec.courtOrderRef}</td>
                                    <td style={{ padding: '1rem' }}>{rec.authorisedBy}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {records.length === 0 && (
                    <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-secondary)' }}>No disposal records found.</p>
                )}
            </div>
        </div>
    );
};

export default DisposalArea;
