import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <div style={{ marginLeft: '320px', padding: '2rem', width: 'calc(100% - 320px)' }}>
                {children}
            </div>
        </div>
    );
};

export default Layout;
