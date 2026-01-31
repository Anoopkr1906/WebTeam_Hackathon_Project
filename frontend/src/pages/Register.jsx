import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: 'USER',
        stationName: '',
        officerId: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            alert('Registration Successful! Please Login.');
            navigate('/login');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <div className="glass-card" style={{ padding: '2rem', width: '100%', maxWidth: '450px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--color-accent-blue)' }}>
                    Create Account
                </h2>

                {error && (
                    <div style={{ color: 'var(--color-danger)', marginBottom: '1rem', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Username</label>
                        <input
                            type="text"
                            className="input-field"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Password</label>
                        <input
                            type="password"
                            className="input-field"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Role</label>
                        <select
                            className="input-field"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        >
                            <option value="USER">Normal User</option>
                            <option value="POLICE">Police Officer</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Station Name {formData.role === 'USER' && '(Optional)'}</label>
                        <input
                            type="text"
                            className="input-field"
                            value={formData.stationName}
                            onChange={(e) => setFormData({ ...formData, stationName: e.target.value })}
                            required={formData.role === 'POLICE'}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Officer/User ID</label>
                        <input
                            type="text"
                            className="input-field"
                            value={formData.officerId}
                            onChange={(e) => setFormData({ ...formData, officerId: e.target.value })}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                        Register
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--color-text-secondary)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--color-accent-blue)' }}>Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
