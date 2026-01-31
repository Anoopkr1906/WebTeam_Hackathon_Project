import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaArrowLeft, FaExchangeAlt, FaTrashAlt, FaPrint, FaPlus } from 'react-icons/fa';

const CaseDetails = () => {
    const { id } = useParams();
    const { token, user } = useAuth();
    const navigate = useNavigate();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Modals
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [showDisposalModal, setShowDisposalModal] = useState(false);
    const [showAddPropertyModal, setShowAddPropertyModal] = useState(false);

    // Selected Property for Action
    const [selectedProperty, setSelectedProperty] = useState(null);

    // Forms
    const [transferData, setTransferData] = useState({ action: 'TRANSFER', toLocation: '', toOfficer: '', purpose: '', remarks: '' });
    const [disposalData, setDisposalData] = useState({ disposalType: 'RETURNED', courtOrderRef: '', remarks: '' });
    const [newPropertyData, setNewPropertyData] = useState({
        category: 'General', belongingTo: 'UNKNOWN', nature: '', quantity: '', location: '', description: '', image: null
    });

    useEffect(() => {
        fetchCaseDetails();
    }, [id]);

    const fetchCaseDetails = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/cases/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.message);
            setData(result);
        } catch (err) {
            console.error(err);
            alert('Failed to load case details');
        } finally {
            setLoading(false);
        }
    };

    const handleTransfer = async (e) => {
        e.preventDefault();
        if (!selectedProperty) return;
        if (!confirm('Update custody for this item?')) return;

        try {
            const res = await fetch('http://localhost:5000/api/custody', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    propertyId: selectedProperty._id,
                    caseId: data.case._id,
                    fromLocation: selectedProperty.location,
                    fromOfficer: 'Current Holder',
                    ...transferData
                })
            });

            if (!res.ok) throw new Error('Transfer failed');
            alert('Custody Updated');
            setShowTransferModal(false);
            fetchCaseDetails();
        } catch (err) { alert(err.message); }
    };

    const handleDisposal = async (e) => {
        e.preventDefault();
        if (!selectedProperty) return;
        if (!confirm('Permanently dispose this item?')) return;

        try {
            const res = await fetch('http://localhost:5000/api/disposal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    propertyId: selectedProperty._id,
                    caseId: data.case._id,
                    authorisedBy: user.username,
                    ...disposalData
                })
            });

            if (!res.ok) throw new Error('Disposal failed');
            alert('Property Disposed');
            setShowDisposalModal(false);
            fetchCaseDetails();
        } catch (err) { alert(err.message); }
    };

    const handleAddProperty = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        Object.keys(newPropertyData).forEach(key => {
            if (key !== 'image') formData.append(key, newPropertyData[key]);
        });
        if (newPropertyData.image) formData.append('image', newPropertyData.image);

        try {
            const res = await fetch(`http://localhost:5000/api/cases/${id}/properties`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            if (!res.ok) throw new Error('Failed to add property');
            alert('Property Added Successfully');
            setShowAddPropertyModal(false);
            fetchCaseDetails();
        } catch (err) { alert(err.message); }
        finally { setLoading(false); }
    };

    if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;
    if (!data) return <div style={{ padding: '2rem' }}>Case not found</div>;

    const { case: caseInfo, properties, logs } = data;

    return (
        <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <button onClick={() => navigate('/search')} className="btn-primary" style={{ padding: '0.5rem', background: 'transparent', border: '1px solid var(--glass-border)' }}> <FaArrowLeft /> </button>
                <h1>Case: <span style={{ color: 'var(--color-accent-blue)' }}>{caseInfo.caseId}</span></h1>
                <span style={{ marginLeft: 'auto', padding: '0.5rem 1rem', borderRadius: '20px', background: caseInfo.status === 'PENDING' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(34, 197, 94, 0.2)', color: caseInfo.status === 'PENDING' ? 'var(--color-accent-gold)' : 'var(--color-success)', fontWeight: 'bold' }}>{caseInfo.status}</span>

                {caseInfo.status === 'PENDING' && (
                    <button onClick={async () => {
                        if (confirm('Are you sure you want to mark this case as COMPLETED/CLOSED?')) {
                            try {
                                const res = await fetch(`http://localhost:5000/api/cases/${caseInfo.caseId}/status`, {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                                    body: JSON.stringify({ status: 'CLOSED' })
                                });
                                if (!res.ok) throw new Error('Failed to update status');
                                fetchCaseDetails();
                            } catch (err) { alert(err.message); }
                        }
                    }} className="btn-primary" style={{ marginLeft: '1rem', background: 'var(--color-success)', fontSize: '0.9rem' }}>
                        Mark as Completed
                    </button>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>

                {/* Left Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Case Info */}
                    <div className="glass-card" style={{ padding: '2rem' }}>
                        <h3 style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', marginBottom: '1rem' }}>Case Information</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div><strong>Crime No:</strong> {caseInfo.crimeNumber} / {caseInfo.crimeYear}</div>
                            <div><strong>Station:</strong> {caseInfo.stationName}</div>
                            <div><strong>IO:</strong> {caseInfo.investigatingOfficer} ({caseInfo.officerId})</div>
                            <div><strong>Act/Section:</strong> {caseInfo.actSection}</div>
                        </div>
                    </div>

                    {/* Properties List */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2>Seized Properties</h2>
                        {caseInfo.status !== 'CLOSED' && (
                            <button onClick={() => setShowAddPropertyModal(true)} className="btn-primary" style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}> <FaPlus /> Add Property </button>
                        )}
                    </div>

                    {properties && properties.map((prop, idx) => (
                        <div key={prop._id} className="glass-card" style={{ padding: '1.5rem', borderLeft: `4px solid ${prop.status === 'DISPOSED' ? 'var(--color-success)' : 'var(--color-accent-blue)'}` }}>
                            <div style={{ display: 'flex', gap: '1.5rem' }}>
                                {prop.photoPath ? (
                                    <img src={prop.photoPath} alt="Evidence" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
                                ) : <div style={{ width: '100px', height: '100px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No IMG</div>}

                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <h4>{prop.category} - {prop.nature}</h4>
                                        <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>{prop.status}</span>
                                    </div>
                                    <p style={{ fontSize: '0.9rem', margin: '0.5rem 0' }}>{prop.description}</p>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                                        <span>Loc: {prop.location}</span>
                                        <span>Qty: {prop.quantity}</span>
                                    </div>

                                    {prop.status !== 'DISPOSED' && (
                                        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                                            <button onClick={() => { setSelectedProperty(prop); setShowTransferModal(true); }} className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Move</button>
                                            <button onClick={() => { setSelectedProperty(prop); setShowDisposalModal(true); }} className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: 'var(--color-danger)' }}>Dispose</button>
                                            {prop.qrCodeData && (
                                                <button className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: 'var(--color-bg-card)', border: '1px solid var(--glass-border)' }} onClick={() => {
                                                    const win = window.open();
                                                    win.document.write(`<img src="${prop.qrCodeData}" style="width: 300px; border: 5px solid black;">`);
                                                    win.print();
                                                }}>Print QR</button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Timeline */}
                    <div className="glass-card" style={{ padding: '2rem' }}>
                        <h3>History Log</h3>
                        <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem' }}>
                            {logs.map((log) => (
                                <li key={log._id} style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <strong>{log.action}</strong> {log.purpose && <span style={{ background: 'var(--color-bg-card)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8rem', marginLeft: '0.5rem' }}>{log.purpose}</span>} <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>{new Date(log.timestamp).toLocaleString()}</span>
                                    <div style={{ fontSize: '0.9rem' }}>{log.remarks} (Item ID: ...{log.propertyId.slice(-4)})</div>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>
            </div>

            {/* Modals for Add Property, Transfer, Disposal (Simplified for brevity) */}
            {showAddPropertyModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div className="glass-card" style={{ width: '500px', padding: '2rem', background: '#1e293b' }}>
                        <h3>Add New Property</h3>
                        <form onSubmit={handleAddProperty} style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
                            <input placeholder="Category" className="input-field" value={newPropertyData.category} onChange={e => setNewPropertyData({ ...newPropertyData, category: e.target.value })} required />
                            <input placeholder="Nature (e.g. Explosive)" className="input-field" value={newPropertyData.nature} onChange={e => setNewPropertyData({ ...newPropertyData, nature: e.target.value })} required />
                            <input placeholder="Location" className="input-field" value={newPropertyData.location} onChange={e => setNewPropertyData({ ...newPropertyData, location: e.target.value })} required />
                            <input placeholder="Quantity" className="input-field" value={newPropertyData.quantity} onChange={e => setNewPropertyData({ ...newPropertyData, quantity: e.target.value })} />
                            <textarea placeholder="Description" className="input-field" value={newPropertyData.description} onChange={e => setNewPropertyData({ ...newPropertyData, description: e.target.value })} required />
                            <input type="file" className="input-field" onChange={e => setNewPropertyData({ ...newPropertyData, image: e.target.files[0] })} />
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                <button type="button" onClick={() => setShowAddPropertyModal(false)} className="btn-primary" style={{ background: 'transparent' }}>Cancel</button>
                                <button type="submit" className="btn-primary">Add</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Transfer Modal - Reused logic from previous step, just bound to selectedProperty */}
            {showTransferModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div className="glass-card" style={{ width: '400px', padding: '2rem', background: '#1e293b' }}>
                        <h3>Move Item</h3>
                        <form onSubmit={handleTransfer}>
                            {/* Fields same as before */}
                            <input placeholder="To Location" className="input-field" required value={transferData.toLocation} onChange={e => setTransferData({ ...transferData, toLocation: e.target.value })} />
                            <input placeholder="To Officer" className="input-field" required value={transferData.toOfficer} onChange={e => setTransferData({ ...transferData, toOfficer: e.target.value })} />

                            <select className="input-field" value={transferData.purpose} onChange={e => setTransferData({ ...transferData, purpose: e.target.value })}>
                                <option value="">Select Purpose</option>
                                <option value="Storage">Storage</option>
                                <option value="Court Hearing">Court Hearing</option>
                                <option value="FSL Analysis">FSL Analysis</option>
                                <option value="Investigation">Investigation</option>
                                <option value="Other">Other</option>
                            </select>

                            <textarea placeholder="Remarks" className="input-field" value={transferData.remarks} onChange={e => setTransferData({ ...transferData, remarks: e.target.value })} />
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setShowTransferModal(false)} className="btn-primary" style={{ background: 'transparent' }}>Cancel</button>
                                <button type="submit" className="btn-primary">Update</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Disposal Modal - Reused logic */}
            {showDisposalModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div className="glass-card" style={{ width: '400px', padding: '2rem', background: '#1e293b' }}>
                        <h3 style={{ color: 'var(--color-danger)' }}>Dispose Item</h3>
                        <form onSubmit={handleDisposal}>
                            <select className="input-field" value={disposalData.disposalType} onChange={e => setDisposalData({ ...disposalData, disposalType: e.target.value })}>
                                <option value="RETURNED">Returned</option>
                                <option value="DESTROYED">Destroyed</option>
                                <option value="AUCTIONED">Auctioned</option>
                            </select>
                            <input placeholder="Order Ref" className="input-field" required value={disposalData.courtOrderRef} onChange={e => setDisposalData({ ...disposalData, courtOrderRef: e.target.value })} />
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setShowDisposalModal(false)} className="btn-primary" style={{ background: 'transparent' }}>Cancel</button>
                                <button type="submit" className="btn-primary" style={{ background: 'var(--color-danger)' }}>Dispose</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default CaseDetails;
