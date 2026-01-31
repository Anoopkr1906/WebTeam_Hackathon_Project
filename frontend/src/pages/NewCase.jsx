import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config';

const NewCase = () => {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [successData, setSuccessData] = useState(null);

    const [formData, setFormData] = useState({
        crimeNumber: '',
        crimeYear: new Date().getFullYear(),
        stationName: user?.stationName || '',
        investigatingOfficer: user?.username || '',
        officerId: '',
        dateOfFIR: '',
        dateOfSeizure: '',
        actSection: '',
        lawSection: '',
        description: '',
        // Property
        propertyCategory: 'General',
        propertyBelongingTo: 'UNKNOWN',
        propertyDescription: '',
        propertyLocation: '',
        propertyQuantity: '',
        propertyNature: '',
        image: null
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        // Append all text fields
        Object.keys(formData).forEach(key => {
            if (key !== 'image') {
                data.append(key, formData[key]);
            }
        });
        // Append image
        if (formData.image) {
            data.append('image', formData.image);
        }

        try {
            const res = await fetch(`${API_BASE_URL}/api/cases`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: data
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.message || 'Failed to create case');

            setSuccessData(result);
            setStep(3); // Go to success step
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (step === 3 && successData) {
        return (
            <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
                <h2 style={{ color: 'var(--color-success)' }}>Case Registered Successfully!</h2>
                <p>Case ID: <strong>{successData.case.caseId}</strong></p>

                <div style={{ marginTop: '2rem' }}>
                    <h3>Property QR Code</h3>
                    <img src={successData.qrCode} alt="QR Code" style={{ border: '5px solid white', borderRadius: '8px' }} />
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginTop: '1rem' }}>
                        Print and attach this QR code to the seized property.
                    </p>
                </div>

                <button onClick={() => navigate('/dashboard')} className="btn-primary" style={{ marginTop: '2rem' }}>
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>New Case Entry</h1>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ flex: 1, padding: '1rem', background: step === 1 ? 'var(--color-accent-blue)' : 'rgba(255,255,255,0.1)', borderRadius: '8px', textAlign: 'center' }}>1. Case Details</div>
                <div style={{ flex: 1, padding: '1rem', background: step === 2 ? 'var(--color-accent-blue)' : 'rgba(255,255,255,0.1)', borderRadius: '8px', textAlign: 'center' }}>2. Property Details</div>
            </div>

            <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '2rem' }}>

                {step === 1 && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <label>Crime Number</label>
                            <input type="text" name="crimeNumber" value={formData.crimeNumber} onChange={handleChange} className="input-field" required />
                        </div>
                        <div>
                            <label>Year</label>
                            <input type="number" name="crimeYear" value={formData.crimeYear} onChange={handleChange} className="input-field" required />
                        </div>
                        <div>
                            <label>Station Name</label>
                            <input type="text" name="stationName" value={formData.stationName} onChange={handleChange} className="input-field" required />
                        </div>
                        <div>
                            <label>Investigating Officer</label>
                            <input type="text" name="investigatingOfficer" value={formData.investigatingOfficer} onChange={handleChange} className="input-field" required />
                        </div>
                        <div>
                            <label>Date of FIR</label>
                            <input type="date" name="dateOfFIR" value={formData.dateOfFIR} onChange={handleChange} className="input-field" required />
                        </div>
                        <div>
                            <label>Date of Seizure</label>
                            <input type="date" name="dateOfSeizure" value={formData.dateOfSeizure} onChange={handleChange} className="input-field" required />
                        </div>
                        <div>
                            <label>Act & Section</label>
                            <input type="text" name="actSection" value={formData.actSection} onChange={handleChange} className="input-field" placeholder="IPC 302..." required />
                        </div>
                        <div>
                            <label>Officer ID</label>
                            <input type="text" name="officerId" value={formData.officerId} onChange={handleChange} className="input-field" required />
                        </div>

                        <div style={{ gridColumn: 'span 2', marginTop: '1rem', textAlign: 'right' }}>
                            <button type="button" onClick={() => setStep(2)} className="btn-primary">Next: Add Property</button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <label>Category</label>
                            <select name="propertyCategory" value={formData.propertyCategory} onChange={handleChange} className="input-field">
                                <option value="General">General</option>
                                <option value="Biological">Biological</option>
                                <option value="Weapon">Weapon</option>
                                <option value="Narcotics">Narcotics</option>
                                <option value="Documents">Documents</option>
                                <option value="Liquor">Liquor</option>
                                <option value="Vehicle">Vehicle</option>
                                <option value="Cash/Jewelry">Cash/Jewelry</option>
                            </select>
                        </div>
                        <div>
                            <label>Belonging To</label>
                            <select name="propertyBelongingTo" value={formData.propertyBelongingTo} onChange={handleChange} className="input-field">
                                <option value="UNKNOWN">Unknown</option>
                                <option value="ACCUSED">Accused</option>
                                <option value="COMPLAINANT">Complainant</option>
                            </select>
                        </div>
                        <div>
                            <label>Nature of Property</label>
                            <input type="text" name="propertyNature" value={formData.propertyNature} onChange={handleChange} className="input-field" placeholder="e.g. Perishable, Explosive" required />
                        </div>
                        <div>
                            <label>Storage Location (Rack/Locker)</label>
                            <input type="text" name="propertyLocation" value={formData.propertyLocation} onChange={handleChange} className="input-field" placeholder="e.g. Locker A-12" required />
                        </div>
                        <div>
                            <label>Quantity / Units</label>
                            <input type="text" name="propertyQuantity" value={formData.propertyQuantity} onChange={handleChange} className="input-field" placeholder="e.g. 1 KG / 2 Pcs" />
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label>Property Description</label>
                            <textarea name="propertyDescription" value={formData.propertyDescription} onChange={handleChange} className="input-field" rows="3" required></textarea>
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label>Upload Photo</label>
                            <input type="file" onChange={handleFileChange} className="input-field" accept="image/*" />
                        </div>

                        <div style={{ gridColumn: 'span 2', marginTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                            <button type="button" onClick={() => setStep(1)} className="btn-primary" style={{ background: 'var(--color-bg-card)' }}>Back</button>
                            <button type="submit" disabled={loading} className="btn-primary">
                                {loading ? 'Registering...' : 'Submit Case & Generate QR'}
                            </button>
                        </div>
                    </div>
                )}

            </form>
        </div>
    );
};

export default NewCase;
