import { useState } from 'react';
import Sidebar from './Sidebar';
import { FaBars } from 'react-icons/fa';

const Layout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div style={{ display: 'flex' }}>
            {/* Mobile Toggle Button */}
            <button
                className="mobile-menu-btn"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
                <FaBars size={24} />
            </button>

            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            <div className="main-content" style={{ marginLeft: '320px', padding: '2rem', width: '100%', transition: 'margin 0.3s' }}>
                {children}
            </div>

            {/* Overlay for mobile when sidebar is open */}
            {isSidebarOpen && (
                <div
                    onClick={() => setIsSidebarOpen(false)}
                    style={{
                        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 900
                    }}
                    className="mobile-overlay"
                />
            )}
        </div>
    );
};

export default Layout;
