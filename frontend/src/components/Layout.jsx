import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <div style={{ marginLeft: '280px', padding: '2rem', width: '100%' }}>
                {children}
            </div>
        </div>
    );
};

export default Layout;
