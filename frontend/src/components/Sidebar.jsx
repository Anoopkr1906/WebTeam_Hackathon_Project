import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaHome, FaPlus, FaSearch, FaBox, FaSignOutAlt } from 'react-icons/fa';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <div className="sidebar glass-card" style={{
            width: '250px',
            height: '95vh',
            margin: '1rem',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed'
        }}>
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <h2 style={{ color: 'var(--color-accent-blue)', margin: 0 }}>e-Malkhana</h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                    {user?.stationName}
                </p>
            </div>

            <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
                    <FaHome /> Dashboard
                </Link>

                {user?.role === 'POLICE' && (
                    <>
                        <Link to="/new-case" className={`nav-link ${isActive('/new-case') ? 'active' : ''}`}>
                            <FaPlus /> New Case
                        </Link>
                    </>
                )}

                <Link to="/search" className={`nav-link ${isActive('/search') ? 'active' : ''}`}>
                    <FaSearch /> Manage Entries
                </Link>

                {user?.role === 'POLICE' && (
                    <Link to="/disposal" className={`nav-link ${isActive('/disposal') ? 'active' : ''}`}>
                        <FaBox /> Disposal Area
                    </Link>
                )}
            </nav>

            <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
                <div style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
                    <div style={{ color: 'white' }}>{user?.username}</div>
                    <div style={{ color: 'var(--color-accent-gold)', fontSize: '0.8rem' }}>{user?.role}</div>
                </div>
                <button onClick={logout} className="nav-link" style={{ width: '100%', background: 'transparent', border: 'none', color: 'var(--color-danger)' }}>
                    <FaSignOutAlt /> Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
