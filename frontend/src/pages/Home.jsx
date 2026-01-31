import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaShieldAlt, FaFingerprint, FaBoxOpen } from 'react-icons/fa';

const Home = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [fadeIn, setFadeIn] = useState(false);

    useEffect(() => {
        setFadeIn(true);
    }, []);

    const cardStyle = {
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(10px)',
        border: '1px solid var(--glass-border)',
        borderRadius: '16px',
        padding: '2rem',
        textAlign: 'center',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        cursor: 'pointer',
        flex: 1
    };

    const iconStyle = {
        fontSize: '3rem',
        marginBottom: '1rem',
        color: 'var(--color-accent-blue)'
    };

    return (
        <div className="home-container" style={{ opacity: fadeIn ? 1 : 0, transform: fadeIn ? 'translateY(0)' : 'translateY(20px)' }}>

            <div style={{ marginBottom: '4rem' }}>
                <h1 className="home-title">
                    Welcome to e-Malkhana
                </h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                    Secure Evidence Management System for {user?.stationName || 'Police Department'}.
                    <br />Digitizing the Chain of Custody.
                </p>
            </div>

            <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>

                <div
                    className="feature-card"
                    onClick={() => navigate('/dashboard')}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.boxShadow = 'var(--glass-shadow)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                    <FaBoxOpen className="feature-icon" style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--color-accent-blue)' }} />
                    <h3>Manage Evidence</h3>
                    <p>Track inventory stats and recent seizures.</p>
                </div>

                <div
                    className="feature-card"
                    onClick={() => user?.role === 'POLICE' ? navigate('/new-case') : alert('Authorized Access Only')}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.boxShadow = 'var(--glass-shadow)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                    <FaFingerprint style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--color-accent-gold)' }} />
                    <h3>Register Case</h3>
                    <p>Log new FIRs and generate QR codes.</p>
                </div>

                <div
                    className="feature-card"
                    onClick={() => navigate('/search')}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.boxShadow = 'var(--glass-shadow)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                    <FaShieldAlt style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--color-success)' }} />
                    <h3>Custody Chain</h3>
                    <p>Securely track evidence movement.</p>
                </div>

            </div>

            <div style={{ marginTop: '5rem', opacity: 0.6 }}>
                <p style={{ fontSize: '0.9rem', letterSpacing: '2px' }}>OFFICIAL POLICE USE ONLY • SECURE SYSTEM</p>
            </div>

        </div>
    );
};

export default Home;
