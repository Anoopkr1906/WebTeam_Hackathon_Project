import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../config';

const AddOfficer = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        stationName: '',
        officerId: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Admin Token
                },
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password,
                    stationName: formData.stationName,
                    officerId: formData.officerId
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            setSuccess('Officer Registered Successfully!');
            setFormData({
                username: '',
                password: '',
                confirmPassword: '',
                stationName: '',
                officerId: ''
            });

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Add New Officer 👮‍♂️</h1>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
                Register a new police officer to the system.
            </p>

            <div className="glass-card" style={{ padding: '2rem', maxWidth: '600px' }}>
                {error && (
                    <div style={{ color: 'var(--color-danger)', marginBottom: '1rem', textAlign: 'center', padding: '0.5rem', border: '1px solid var(--color-danger)' }}>
                        {error}
                    </div>
                )}
                {success && (
                    <div style={{ color: 'var(--color-success)', marginBottom: '1rem', textAlign: 'center', padding: '0.5rem', border: '1px solid var(--color-success)' }}>
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
                    <div>
                        <label>Username</label>
                        <input
                            type="text"
                            className="input-field"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            required
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label>Station Name</label>
                            <input
                                type="text"
                                className="input-field"
                                value={formData.stationName}
                                onChange={(e) => setFormData({ ...formData, stationName: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label>Officer ID</label>
                            <input
                                type="text"
                                className="input-field"
                                value={formData.officerId}
                                onChange={(e) => setFormData({ ...formData, officerId: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label>Password</label>
                            <input
                                type="password"
                                className="input-field"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                className="input-field"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>
                        Register Officer
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddOfficer;
