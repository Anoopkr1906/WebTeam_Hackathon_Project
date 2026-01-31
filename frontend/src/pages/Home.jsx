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
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
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
        <div style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            opacity: fadeIn ? 1 : 0,
            transform: fadeIn ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease'
        }}>

            <div style={{ marginBottom: '4rem' }}>
                <h1 style={{
                    fontSize: '3.5rem',
                    background: 'linear-gradient(to right, #fff, #94a3b8)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '1rem'
                }}>
                    Welcome to e-Malkhana
                </h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                    Secure Evidence Management System for {user?.stationName || 'Police Department'}.
                    <br />Digitizing the Chain of Custody.
                </p>
            </div>

            <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>

                <div
                    style={cardStyle}
                    className="feature-card"
                    onClick={() => navigate('/dashboard')}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(59, 130, 246, 0.2)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                    <FaBoxOpen style={iconStyle} />
                    <h3>Manage Evidence</h3>
                    <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Track inventory stats and recent seizures.</p>
                </div>

                <div
                    style={cardStyle}
                    className="feature-card"
                    onClick={() => user?.role === 'POLICE' ? navigate('/new-case') : alert('Authorized Access Only')}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(245, 158, 11, 0.2)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                    <FaFingerprint style={{ ...iconStyle, color: 'var(--color-accent-gold)' }} />
                    <h3>Register Case</h3>
                    <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Log new FIRs and generate QR codes.</p>
                </div>

                <div
                    style={cardStyle}
                    className="feature-card"
                    onClick={() => navigate('/search')}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(34, 197, 94, 0.2)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                    <FaShieldAlt style={{ ...iconStyle, color: 'var(--color-success)' }} />
                    <h3>Custody Chain</h3>
                    <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Securely track evidence movement.</p>
                </div>

            </div>

            <div style={{ marginTop: '5rem', opacity: 0.6 }}>
                <p style={{ fontSize: '0.9rem', letterSpacing: '2px' }}>OFFICIAL POLICE USE ONLY • SECURE SYSTEM</p>
            </div>

        </div>
    );
};

export default Home;
