import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../config';

const SearchCases = () => {
    const { token } = useAuth();
    const [cases, setCases] = useState([]);
    const [filteredCases, setFilteredCases] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCases();
    }, [token]);

    const fetchCases = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/cases`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            setCases(data);
            setFilteredCases(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);

        if (!term) {
            setFilteredCases(cases);
            return;
        }

        const filtered = cases.filter(c =>
            c.caseId.toLowerCase().includes(term) ||
            c.crimeNumber.toLowerCase().includes(term) ||
            c.stationName.toLowerCase().includes(term)
        );
        setFilteredCases(filtered);
    };

    if (loading) return <div style={{ padding: '2rem' }}>Loading Cases...</div>;

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Manage Entries</h1>
                <input
                    type="text"
                    placeholder="Search by Case ID, Crime #..."
                    className="input-field"
                    style={{ width: '300px', margin: 0 }}
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>

            <div className="glass-card" style={{ padding: '1rem' }}>
                <div className="table-responsive">
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)', color: 'var(--color-text-secondary)' }}>
                                <th style={{ padding: '1rem' }}>Case ID</th>
                                <th style={{ padding: '1rem' }}>Station</th>
                                <th style={{ padding: '1rem' }}>Crime Year</th>
                                <th style={{ padding: '1rem' }}>Officer ID</th>
                                <th style={{ padding: '1rem' }}>Status</th>
                                <th style={{ padding: '1rem' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCases.map(item => (
                                <tr key={item._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                    <td style={{ padding: '1rem', fontWeight: 'bold', color: 'var(--color-accent-blue)' }}>{item.caseId}</td>
                                    <td style={{ padding: '1rem' }}>{item.stationName}</td>
                                    <td style={{ padding: '1rem' }}>{item.crimeYear}</td>
                                    <td style={{ padding: '1rem' }}>{item.officerId}</td>
                                    <td style={{ padding: '1rem' }}>
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
                                    <td style={{ padding: '1rem' }}>
                                        <Link to={`/cases/${item.caseId}`}>
                                            <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                                                View
                                            </button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredCases.length === 0 && (
                    <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-secondary)' }}>No cases found.</p>
                )}
            </div>
        </div>
    );
};

export default SearchCases;
