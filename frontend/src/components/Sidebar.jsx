import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FaHome, FaPlus, FaSearch, FaBox, FaSignOutAlt, FaSun, FaMoon } from 'react-icons/fa';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const isActive = (path) => location.pathname === path;

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        logout();
        setShowLogoutModal(false);
    };

    return (
        <>
            <div className={`sidebar glass-card ${isOpen ? 'open' : ''}`} style={{
                width: '250px',
                height: '95vh',
                margin: '1rem',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                transition: 'transform 0.3s ease'
            }}>
                <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <img src="/logo.png" alt="Logo" style={{ width: '80px', marginBottom: '0.5rem' }} />
                        <h2 style={{ color: 'var(--color-accent-blue)', margin: 0, fontSize: '1.5rem' }}>e-Malkhana</h2>
                    </Link>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                        {user?.stationName}
                    </p>
                </div>

                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
                        <FaHome /> Dashboard
                    </Link>

                    <Link to="/new-case" className={`nav-link ${isActive('/new-case') ? 'active' : ''}`}>
                        <FaPlus /> New Case
                    </Link>

                    <Link to="/search" className={`nav-link ${isActive('/search') ? 'active' : ''}`}>
                        <FaSearch /> Manage Entries
                    </Link>

                    <Link to="/disposal" className={`nav-link ${isActive('/disposal') ? 'active' : ''}`}>
                        <FaBox /> Disposal Area
                    </Link>

                    {user?.role === 'ADMIN' && (
                        <Link to="/add-officer" className={`nav-link ${isActive('/add-officer') ? 'active' : ''}`}>
                            <FaPlus /> Add Officer
                        </Link>
                    )}
                </nav>

                <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
                    <div style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
                        <div style={{ color: 'white' }}>{user?.username}</div>
                        <div style={{ color: 'var(--color-accent-gold)', fontSize: '0.8rem' }}>{user?.role}</div>
                    </div>
                    <button onClick={handleLogoutClick} className="nav-link" style={{ width: '100%', background: 'transparent', border: 'none', color: 'var(--color-danger)' }}>
                        <FaSignOutAlt /> Logout
                    </button>
                    <button onClick={toggleTheme} className="nav-link" style={{ width: '100%', background: 'transparent', border: 'none', color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>
                        {theme === 'dark' ? <FaSun /> : <FaMoon />} {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    </button>
                </div>
            </div>

            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2000
                }}>
                    <div className="glass-card" style={{ padding: '2rem', width: '300px', textAlign: 'center', background: 'var(--color-bg-card)' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Confirm Logout</h3>
                        <p style={{ marginBottom: '2rem', color: 'var(--color-text-secondary)' }}>Are you sure you want to log out?</p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                            <button onClick={() => setShowLogoutModal(false)} className="btn-primary" style={{ background: 'transparent', color: 'var(--color-text-primary)', border: '1px solid var(--glass-border)' }}>
                                Cancel
                            </button>
                            <button onClick={confirmLogout} className="btn-primary" style={{ background: 'var(--color-danger)' }}>
                                Yes, Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Sidebar;
