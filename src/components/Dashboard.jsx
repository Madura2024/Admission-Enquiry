import React, { useState, useEffect } from 'react';
import { LogOut, Users, Search, Download, CheckCircle, Clock, Eye, Smartphone, GraduationCap, Clipboard, X, Briefcase, MapPin, Calendar, Award, BookOpen, Calculator, Printer, ShieldCheck, Home, User, Phone, Map, School, Filter, PieChart, TrendingUp, Send, MessageSquare, UserCheck, Bus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- Sub-Components ---

const DetailItem = ({ label, value, icon: Icon }) => (
    <div style={{ marginBottom: '1.25rem' }}>
        <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.7rem',
            fontWeight: '800',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '0.25rem'
        }}>
            {Icon && <Icon size={12} />} {label}
        </label>
        <div style={{ fontSize: '1rem', color: 'var(--text)', fontWeight: '600' }}>
            {value || 'Not Disclosed'}
        </div>
    </div>
);

/** STAFF CHATBOT VIEW - Smart Query Terminal */
const StaffDashboardChatbot = ({ admissions, onUpdateRemarks }) => {
    const [messages, setMessages] = useState([
        { role: 'ai', text: 'Welcome Staff Terminal. Please enter the Student Application Number to fetch dossier or add official remarks.' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [lastFoundStudent, setLastFoundStudent] = useState(null);
    const [remarkInput, setRemarkInput] = useState('');

    const handleSend = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const userMsg = inputValue.trim();
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setInputValue('');
        setIsTyping(true);

        setTimeout(() => {
            const student = admissions.find(a => a.appNumber.toUpperCase() === userMsg.toUpperCase());

            if (student) {
                setLastFoundStudent(student);
                setMessages(prev => [...prev, {
                    role: 'ai',
                    text: `Found Record for ${student.studentName}.`,
                    data: student
                }]);
            } else {
                setMessages(prev => [...prev, { role: 'ai', text: `No record found for ID: ${userMsg}. Please verify the application format (e.g., APP-2026-6138).` }]);
                setLastFoundStudent(null);
            }
            setIsTyping(false);
        }, 800);
    };

    const handleAddRemark = () => {
        if (!remarkInput.trim() || !lastFoundStudent) return;

        onUpdateRemarks(lastFoundStudent.id, remarkInput.trim());
        setMessages(prev => [...prev, { role: 'ai', text: `Remark successfully cataloged for ${lastFoundStudent.studentName}: "${remarkInput.trim()}"` }]);

        // Update local last found student object to show the new remark immediately if searched again
        setLastFoundStudent({ ...lastFoundStudent, remarks: remarkInput.trim() });
        setRemarkInput('');
    };

    return (
        <div className="glass-card animate-fade-in" style={{ height: '75vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0, background: '#fff' }}>
            {/* Chat header */}
            <div style={{ padding: '1.5rem', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <MessageSquare size={24} />
                <div>
                    <h3 style={{ margin: 0 }}>Staff Enquiry Bot</h3>
                    <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.8 }}>Enter Application Number to view and add remarks</p>
                </div>
            </div>

            {/* Chat area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {messages.map((m, i) => (
                    <div key={i} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                        <div style={{
                            padding: '1rem 1.5rem',
                            borderRadius: '1.25rem',
                            background: m.role === 'user' ? 'var(--primary)' : '#f1f5f9',
                            color: m.role === 'user' ? '#fff' : 'var(--text)',
                            fontSize: '1rem',
                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                        }}>
                            {m.text}
                        </div>

                        {m.data && (
                            <div className="glass-card" style={{ marginTop: '1rem', padding: '1.5rem', background: '#fff', border: '1px solid #e2e8f0', minWidth: '300px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <DetailItem label="Student" value={m.data.studentName} icon={User} />
                                    <DetailItem label="App No" value={m.data.appNumber} icon={Clipboard} />
                                    <DetailItem label="Status" value={m.data.status || 'Pending'} icon={CheckCircle} />
                                    <DetailItem label="Course" value={m.data.course} icon={BookOpen} />
                                </div>

                                {m.data.remarks && (
                                    <div style={{ marginTop: '1rem', padding: '1rem', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '0.75rem' }}>
                                        <label style={{ fontSize: '0.65rem', fontWeight: 900, color: '#92400e' }}>CURRENT REMARKS</label>
                                        <div style={{ fontSize: '0.9rem', color: '#78350f', marginTop: '0.25rem' }}>{m.data.remarks}</div>
                                    </div>
                                )}

                                <div style={{ marginTop: '1.5rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Update/Add Remarks</label>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <input
                                            type="text"
                                            className="input-field"
                                            placeholder="Type new remark..."
                                            style={{ flex: 1, padding: '0.5rem 1rem' }}
                                            value={remarkInput}
                                            onChange={(e) => setRemarkInput(e.target.value)}
                                        />
                                        <button onClick={handleAddRemark} className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Update</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                {isTyping && <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Searching records...</div>}
            </div>

            {/* Input area */}
            <form onSubmit={handleSend} style={{ padding: '1.5rem', borderTop: '1px solid #eee', display: 'flex', gap: '1rem' }}>
                <input
                    type="text"
                    className="input-field"
                    placeholder="Enter Application ID (e.g. APP-2026-XXXX)..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '0 2rem' }}>
                    <Search size={18} />
                </button>
            </form>
        </div>
    );
};

/** FORMAL PRINTABLE TABLE FORM */
const StudentPrintableForm = ({ admission, onClose }) => {
    if (!admission) return null;
    const thStyle = { background: '#f8fafc', fontWeight: '900', padding: '12px', border: '1.5px solid #000', textAlign: 'left', fontSize: '11px', textTransform: 'uppercase' };
    const tdStyle = { padding: '12px', border: '1.5px solid #000', fontSize: '13px', color: '#000' };

    return (
        <div className="animate-scale-in" style={{
            width: '95%', maxWidth: '950px', maxHeight: '90vh', background: '#fff',
            borderRadius: '1rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            display: 'flex', flexDirection: 'column'
        }} onClick={e => e.stopPropagation()}>
            <div className="no-print" style={{ padding: '1.5rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.25rem', color: 'var(--primary)', fontWeight: 800 }}>Formal Admission Form Preview</h2>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => window.print()} className="btn btn-primary"><Printer size={18} /> Download / Print Form</button>
                    <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}><X size={28} /></button>
                </div>
            </div>
            <div id="printable-document" style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
                <div id="printable-form" style={{ fontFamily: '"Times New Roman", serif', color: '#000' }}>
                    <div style={{ textAlign: 'center', marginBottom: '1.5rem', border: '2px solid #000', padding: '20px' }}>
                        <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '900' }}>KGiSL INSTITUTIONS</h1>
                        <p style={{ margin: '5px 0', fontSize: '14px' }}>Coimbatore - 641 035, Tamil Nadu, India</p>
                        <hr style={{ margin: '15px 0', border: '0', borderTop: '1px solid #000' }} />
                        <h2 style={{ margin: 0, fontSize: '18px', textTransform: 'uppercase' }}>Admission Enquiry Form - Academic Year 2026</h2>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                        <tbody>
                            <tr>
                                <th style={thStyle}>Application Number</th>
                                <td style={tdStyle}>{admission.appNumber}</td>
                                <th style={thStyle}>Verification Status</th>
                                <td style={tdStyle}><strong style={{ textTransform: 'uppercase' }}>{admission.status || 'Pending'}</strong></td>
                            </tr>
                            <tr>
                                <th style={thStyle}>Date of Submission</th>
                                <td style={tdStyle}>{admission.submittedAt ? new Date(admission.submittedAt).toLocaleString() : 'N/A'}</td>
                                <th style={thStyle}>Date of Approval</th>
                                <td style={tdStyle}>{admission.approvedAt ? new Date(admission.approvedAt).toLocaleString() : '---'}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div style={{ background: '#000', color: '#fff', padding: '5px 15px', fontWeight: '900', fontSize: '13px' }}>1. CANDIDATE PERSONAL DETAILS</div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                        <tbody>
                            <tr>
                                <th style={thStyle} width="20%">Student Name</th>
                                <td style={tdStyle} width="30%">{admission.studentName}</td>
                                <th style={thStyle} width="20%">Gender</th>
                                <td style={tdStyle} width="30%">{admission.gender}</td>
                            </tr>
                            <tr>
                                <th style={thStyle}>Date of Birth</th>
                                <td style={tdStyle}>{admission.dob}</td>
                                <th style={thStyle}>Aadhaar No</th>
                                <td style={tdStyle}>{admission.aadhaarNo}</td>
                            </tr>
                            <tr>
                                <th style={thStyle}>Community</th>
                                <td style={tdStyle}>{admission.community}</td>
                                <th style={thStyle}>Caste</th>
                                <td style={tdStyle}>{admission.caste || 'N/A'}</td>
                            </tr>
                            <tr>
                                <th style={thStyle}>Religion</th>
                                <td style={tdStyle} colSpan="3">{admission.religion || 'N/A'}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div style={{ background: '#000', color: '#fff', padding: '5px 15px', fontWeight: '900', fontSize: '13px' }}>2. CONTACT & RESIDENCY</div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                        <tbody>
                            <tr>
                                <th style={thStyle} width="20%">Mobile 1</th>
                                <td style={tdStyle} width="30%">{admission.phone1}</td>
                                <th style={thStyle} width="20%">Mobile 2</th>
                                <td style={tdStyle} width="30%">{admission.phone2 || 'N/A'}</td>
                            </tr>
                            <tr>
                                <th style={thStyle}>District</th>
                                <td style={tdStyle}>{admission.district}</td>
                                <th style={thStyle}>Pincode</th>
                                <td style={tdStyle}>{admission.pincode}</td>
                            </tr>
                            <tr>
                                <th style={thStyle}>Full Address</th>
                                <td style={tdStyle} colSpan="3">{admission.address}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div style={{ background: '#000', color: '#fff', padding: '5px 15px', fontWeight: '900', fontSize: '13px' }}>3. COURSE OF CHOICE</div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                        <tbody>
                            <tr>
                                <th style={thStyle} width="20%">Institution</th>
                                <td style={tdStyle}>{admission.institution}</td>
                                <th style={thStyle} width="20%">Course</th>
                                <td style={tdStyle}>{admission.course}</td>
                            </tr>
                            <tr>
                                <th style={thStyle}>Transport</th>
                                <td style={tdStyle} colSpan="3">
                                    {admission.bus === 'Yes' ? 'Bus Transport' : (admission.hostel === 'Yes' ? 'Hostel Facility' : 'Day Scholar')}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div style={{ background: '#000', color: '#fff', padding: '5px 15px', fontWeight: '900', fontSize: '13px' }}>4. ACADEMIC & FAMILY DETAILS</div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                        <tbody>
                            <tr>
                                <th style={thStyle} width="20%">Father Name</th>
                                <td style={tdStyle}>{admission.fatherName}</td>
                                <th style={thStyle} width="20%">Occupation</th>
                                <td style={tdStyle}>{admission.fatherOccupation}</td>
                            </tr>
                            <tr>
                                <th style={thStyle}>Mother Name</th>
                                <td style={tdStyle}>{admission.motherName}</td>
                                <th style={thStyle}>Annual Income</th>
                                <td style={tdStyle}>Rs. {admission.annualIncome || 'N/A'}</td>
                            </tr>
                            <tr>
                                <th style={thStyle}>School Name</th>
                                <td style={tdStyle}>{admission.schoolName}</td>
                                <th style={thStyle}>12th Cutoff</th>
                                <td style={tdStyle}><strong style={{ fontSize: '18px' }}>{admission.marks12th?.cutoff || '---'}</strong></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

/** ADMIN Dossier Viewer */
const AdminDetailDossier = ({ admission, onClose, onApprove }) => (
    <div className="animate-scale-in" style={{
        width: '95%', maxWidth: '1100px', height: '90vh', background: '#f8fafc',
        borderRadius: '1.5rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
        display: 'flex', flexDirection: 'column'
    }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '2rem', background: 'linear-gradient(135deg, #1e3a8a 0%, #312e81 100%)', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
                <h2 style={{ margin: 0, fontSize: '1.75rem' }}>Full Application Details</h2>
                <p style={{ opacity: 0.8 }}>Viewing records for {admission.studentName} ({admission.appNumber})</p>
            </div>
            <button onClick={onClose} style={{ border: 'none', background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '0.5rem', borderRadius: '50%', cursor: 'pointer' }}><X size={28} /></button>
        </div>
        <div style={{ flex: 1, padding: '2.5rem', overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            <div className="glass-card" style={{ padding: '1.5rem', background: '#fff' }}>
                <h3 style={{ color: 'var(--primary)', borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Personal & Demographic</h3>
                <DetailItem label="Full Name" value={admission.studentName} icon={User} />
                <DetailItem label="Gender" value={admission.gender} />
                <DetailItem label="Date of Birth" value={admission.dob} />
                <DetailItem label="Aadhaar" value={admission.aadhaarNo} />
                <DetailItem label="Community" value={admission.community} />
                <DetailItem label="Caste" value={admission.caste} />
            </div>
            <div className="glass-card" style={{ padding: '1.5rem', background: '#fff' }}>
                <h3 style={{ color: 'var(--primary)', borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Contact Details</h3>
                <DetailItem label="Phone 1 (Main)" value={admission.phone1} icon={Phone} />
                <DetailItem label="District" value={admission.district} icon={MapPin} />
                <DetailItem label="Address" value={admission.address} />
            </div>
            <div className="glass-card" style={{ padding: '1.5rem', background: '#fff' }}>
                <h3 style={{ color: 'var(--primary)', borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Preferences</h3>
                <DetailItem label="Course" value={admission.course} icon={BookOpen} />
                <DetailItem label="Cutoff" value={admission.marks12th?.cutoff} />
                <DetailItem label="Transport" value={admission.bus === 'Yes' ? 'Bus' : (admission.hostel === 'Yes' ? 'Hostel' : 'Day Scholar')} />
            </div>
            <div className="glass-card" style={{ padding: '1.5rem', background: '#fff' }}>
                <h3 style={{ color: 'var(--primary)', borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Family Records</h3>
                <DetailItem label="Father Name" value={admission.fatherName} />
                <DetailItem label="Mother Name" value={admission.motherName} />
                <DetailItem label="Income" value={`Rs. ${admission.annualIncome}`} />
            </div>
        </div>
        <div style={{ padding: '2rem', background: '#fff', borderTop: '2px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button onClick={onClose} className="btn" style={{ background: '#f1f5f9' }}>Close Access</button>
            {admission.status !== 'Approved' && (
                <button onClick={() => onApprove(admission.id)} className="btn btn-primary" style={{ padding: '1rem 3rem' }}>VERIFY & APPROVE STUDENT NOW</button>
            )}
        </div>
    </div>
);

// --- Main Dashboard ---

const Dashboard = ({ user, onLogout }) => {
    const [admissions, setAdmissions] = useState([]);
    const [selectedAdmission, setSelectedAdmission] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const navigate = useNavigate();

    useEffect(() => {
        const load = () => setAdmissions(JSON.parse(localStorage.getItem('admissions') || '[]'));
        load();
        const interval = setInterval(load, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleApprove = (id) => {
        const data = JSON.parse(localStorage.getItem('admissions') || '[]');
        const updated = data.map(a => a.id === id ? { ...a, status: 'Approved', approvedAt: new Date().toISOString() } : a);
        localStorage.setItem('admissions', JSON.stringify(updated));
        setAdmissions(updated);
        if (selectedAdmission?.id === id) setSelectedAdmission({ ...selectedAdmission, status: 'Approved', approvedAt: new Date().toISOString() });
    };

    const handleUpdateRemarks = (id, remarks) => {
        const data = JSON.parse(localStorage.getItem('admissions') || '[]');
        const updated = data.map(a => a.id === id ? { ...a, remarks } : a);
        localStorage.setItem('admissions', JSON.stringify(updated));
        setAdmissions(updated);
    };

    const studentAdmission = admissions.find(a => a.appNumber === user.appNumber || a.studentUsername === user.username);
    const adminFiltered = admissions.filter(a => {
        const s = searchTerm.toLowerCase();
        const matchesSearch = (a.studentName || '').toLowerCase().includes(s) || (a.appNumber || '').toLowerCase().includes(s) || (a.district || '').toLowerCase().includes(s);
        const matchesStatus = statusFilter === 'All' || (statusFilter === 'Approved' ? a.status === 'Approved' : a.status !== 'Approved');
        return matchesSearch && matchesStatus;
    });

    const totalCount = admissions.length;
    const getAvgCutoff = () => {
        const cutoffs = admissions.map(a => parseFloat(a.marks12th?.cutoff)).filter(v => !isNaN(v));
        return cutoffs.length ? (cutoffs.reduce((a, b) => a + b, 0) / cutoffs.length).toFixed(2) : '0.0';
    };

    const getStats = (key) => {
        const counts = admissions.reduce((acc, a) => {
            const val = a[key] || 'Other';
            acc[val] = (acc[val] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(counts).map(([label, count]) => ({
            label, count, percent: ((count / totalCount) * 100).toFixed(1)
        }));
    };

    const genderStats = admissions.reduce((acc, a) => {
        const g = a.gender === 'Male' ? 'Males' : (a.gender === 'Female' ? 'Females' : 'Other');
        acc[g] = (acc[g] || 0) + 1;
        return acc;
    }, {});

    const transportStats = admissions.reduce((acc, a) => {
        const type = a.bus === 'Yes' ? 'Bus Req.' : (a.hostel === 'Yes' ? 'Hostel Req.' : 'Day Scholar');
        acc[type] = (acc[type] || 0) + 1;
        return acc;
    }, {});

    return (
        <div className="container animate-fade-in">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }} className="no-print">
                <div>
                    <h1 className="font-outfit" style={{ fontSize: '2.5rem', color: 'var(--primary)', fontWeight: '900' }}>
                        {user.role === 'admin' ? 'Strategic Admin Terminal' : (user.role === 'counselor' ? 'Staff Smart Terminal' : 'Student Dashboard')}
                    </h1>
                    <p style={{ color: 'var(--text-muted)' }}>Welcome, <strong style={{ color: 'var(--text)' }}>{user.username}</strong></p>
                </div>
                <button onClick={onLogout} className="btn" style={{ background: '#fee2e2', color: '#ef4444', fontWeight: 800 }}>Logout</button>
            </header>

            {user.role === 'student' ? (
                <div className="no-print">
                    {studentAdmission ? (
                        <div className="glass-card" style={{ padding: '4rem', textAlign: 'center' }}>
                            <ShieldCheck size={64} color="var(--primary)" style={{ marginBottom: '1.5rem' }} />
                            <h2 style={{ fontSize: '3rem', fontWeight: 900 }}>{studentAdmission.studentName}</h2>
                            <p style={{ fontSize: '1.5rem', color: 'var(--text-light)', marginBottom: '3rem' }}>App ID: {studentAdmission.appNumber} | Status: <strong style={{ color: studentAdmission.status === 'Approved' ? '#059669' : '#d97706' }}>{studentAdmission.status?.toUpperCase() || 'IN REVIEW'}</strong></p>
                            <button onClick={() => setSelectedAdmission(studentAdmission)} className="btn btn-primary" style={{ width: '100%', padding: '2rem', fontSize: '1.5rem' }}>
                                <Printer size={24} /> Download Official Printed Form
                            </button>
                        </div>
                    ) : (
                        <div className="glass-card" style={{ padding: '5rem', textAlign: 'center' }}>
                            <h2>No Enquiry Found</h2>
                            <button onClick={() => navigate('/enquiry')} className="btn btn-primary" style={{ marginTop: '2rem' }}>Apply for Admission</button>
                        </div>
                    )}
                </div>
            ) : user.role === 'counselor' ? (
                <StaffDashboardChatbot admissions={admissions} onUpdateRemarks={handleUpdateRemarks} />
            ) : (
                <div className="no-print">
                    {/* TOP STATS CARDS - IMAGE 1 STYLE */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                        <div className="glass-card" style={{ padding: '2rem', background: '#fff', borderLeft: '10px solid var(--primary)', position: 'relative' }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--text-light)', textTransform: 'uppercase' }}>Total Enquiries</div>
                            <div style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--primary)' }}>{totalCount}</div>
                            <Users size={48} color="var(--primary)" style={{ position: 'absolute', right: '2rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.1 }} />
                        </div>
                        <div className="glass-card" style={{ padding: '2rem', background: '#fff', borderLeft: '10px solid #8b5cf6', position: 'relative' }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--text-light)', textTransform: 'uppercase' }}>Global Avg Cutoff</div>
                            <div style={{ fontSize: '3.5rem', fontWeight: 900, color: '#8b5cf6' }}>{getAvgCutoff()}</div>
                            <TrendingUp size={48} color="#8b5cf6" style={{ position: 'absolute', right: '2rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.1 }} />
                        </div>
                    </div>

                    {/* LIVE INSTITUTIONAL STATISTICS - IMAGE 0 STYLE */}
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h2 className="font-outfit" style={{ fontSize: '2.5rem', fontWeight: 900, color: '#1e3a8a' }}>Live Institutional Statistics</h2>
                        <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Real-time transparency of the 2026 Admissions Enquiry Process</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
                        {/* Avg Cutoff Card */}
                        <div className="glass-card" style={{ padding: '2.5rem', background: '#fff', borderTop: '6px solid #f97316' }}>
                            <TrendingUp size={32} color="#f97316" style={{ marginBottom: '1.5rem' }} />
                            <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase' }}>Average Enquiry Cutoff</div>
                            <div style={{ fontSize: '3.5rem', fontWeight: 900, color: '#1e3a8a' }}>{getAvgCutoff()}</div>
                            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>From {totalCount} total enquiries</div>
                        </div>

                        {/* Gender Stats */}
                        <div className="glass-card" style={{ padding: '2.5rem', background: '#fff', borderTop: '6px solid #1e3a8a' }}>
                            <Users size={32} color="#1e3a8a" style={{ marginBottom: '1.5rem' }} />
                            <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase' }}>Gender Diversity</div>
                            <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem' }}>
                                <div>
                                    <div style={{ fontSize: '2.5rem', fontWeight: 900 }}>{genderStats.Males || 0}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Males</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '2.5rem', fontWeight: 900 }}>{genderStats.Females || 0}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Females</div>
                                </div>
                            </div>
                        </div>

                        {/* Transport Stats */}
                        <div className="glass-card" style={{ padding: '2.5rem', background: '#fff', borderTop: '6px solid #10b981' }}>
                            <Bus size={32} color="#10b981" style={{ marginBottom: '1.5rem' }} />
                            <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase' }}>Transport Choice</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1rem' }}>
                                <div>
                                    <div style={{ fontSize: '2.5rem', fontWeight: 900 }}>{transportStats['Bus Req.'] || 0}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Bus Req.</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '2.5rem', fontWeight: 900 }}>{transportStats['Hostel Req.'] || 0}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Hostel Req.</div>
                                </div>
                            </div>
                        </div>

                        {/* Community Diversity */}
                        <div className="glass-card" style={{ padding: '2.5rem', background: '#fff', borderTop: '6px solid #8b5cf6', gridColumn: 'span 1' }}>
                            <GraduationCap size={32} color="#8b5cf6" style={{ marginBottom: '1.5rem' }} />
                            <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase' }}>Community Diversity</div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                                {getStats('community').map(s => (
                                    <div key={s.label} style={{ background: '#f1f5f9', padding: '0.75rem 1.25rem', borderRadius: '1rem', fontSize: '0.95rem', fontWeight: 800 }}>
                                        {s.label}: {s.count}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Regional & Intelligence Feed - IMAGE 1 STYLE */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '2rem', marginBottom: '3.5rem' }}>
                        {/* Regional Distribution */}
                        <div className="glass-card" style={{ padding: '2rem', background: '#fff' }}>
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}><MapPin size={22} /> Regional Distribution (% District wise)</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
                                {getStats('district').map(stat => (
                                    <div key={stat.label} style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-light)' }}>{stat.label.toUpperCase()}</div>
                                        <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--primary)', margin: '0.25rem 0' }}>{stat.percent}%</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{stat.count} Applicants</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Demographic Intelligence */}
                        <div className="glass-card" style={{ padding: '2rem', background: '#fff' }}>
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}><Users size={22} /> Demographic Intelligence (% Statistics)</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                {/* Gender Split Sub-Card */}
                                <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '1.25rem', border: '1px solid #e2e8f0' }}>
                                    <div style={{ fontWeight: 900, fontSize: '0.8rem', marginBottom: '1rem', color: 'var(--text-muted)', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>GENDER SPLIT</div>
                                    {getStats('gender').map(s => (
                                        <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '1rem' }}>
                                            <span style={{ fontWeight: 500 }}>{s.label}</span>
                                            <strong style={{ color: 'var(--primary)' }}>{s.percent}%</strong>
                                        </div>
                                    ))}
                                </div>
                                {/* Logistics Sub-Card */}
                                <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '1.25rem', border: '1px solid #e2e8f0' }}>
                                    <div style={{ fontWeight: 900, fontSize: '0.8rem', marginBottom: '1rem', color: 'var(--text-muted)', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>LOGISTICS / TRANSPORT</div>
                                    {Object.entries(transportStats).map(([label, count]) => (
                                        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '1rem' }}>
                                            <span style={{ fontWeight: 500 }}>{label.split(' ')[0]}</span>
                                            <strong style={{ color: 'var(--primary)' }}>{((count / totalCount) * 100).toFixed(1)}%</strong>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div style={{ marginTop: '1.5rem', padding: '1.5rem', background: '#fdf4ff', borderRadius: '1.25rem', border: '1px solid #f5d0fe' }}>
                                <div style={{ fontWeight: 900, fontSize: '0.8rem', marginBottom: '1rem', color: '#a21caf' }}>COMMUNITY DIVERSITY (%)</div>
                                <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                                    {getStats('community').map(s => (
                                        <div key={s.label} style={{ textAlign: 'center', minWidth: '80px' }}>
                                            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#a21caf' }}>{s.percent}%</div>
                                            <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#d946ef' }}>{s.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* TABLE LIST */}
                    <div className="glass-card" style={{ padding: '2.5rem', background: '#fff' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                {['All', 'Pending', 'Approved'].map(tab => (
                                    <button key={tab} onClick={() => setStatusFilter(tab)} className="btn" style={{ padding: '0.75rem 2rem', fontSize: '0.9rem', background: statusFilter === tab ? 'var(--primary)' : '#f1f5f9', color: statusFilter === tab ? '#fff' : 'var(--text)', borderRadius: '1rem' }}>{tab}</button>
                                ))}
                            </div>
                            <div style={{ position: 'relative', width: '350px' }}>
                                <Search style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)' }} size={18} />
                                <input type="text" placeholder="Search records..." className="input-field" style={{ paddingLeft: '3.5rem', borderRadius: '1.25rem' }} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                            </div>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', color: 'var(--text-light)', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', borderBottom: '2px solid #f1f5f9' }}>
                                        <th style={{ padding: '1.5rem 1rem' }}>App ID</th>
                                        <th style={{ padding: '1.5rem 1rem' }}>Name</th>
                                        <th style={{ padding: '1.5rem 1rem' }}>Location</th>
                                        <th style={{ padding: '1.5rem 1rem' }}>Status</th>
                                        <th style={{ padding: '1.5rem 1rem', textAlign: 'center' }}>View</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {adminFiltered.map(item => (
                                        <tr key={item.id} style={{ borderBottom: '1px solid #f8fafc' }} className="table-row-hover">
                                            <td style={{ padding: '1.5rem 1rem', fontWeight: 900, color: 'var(--primary)' }}>{item.appNumber}</td>
                                            <td style={{ padding: '1.5rem 1rem', fontWeight: 700 }}>{item.studentName}</td>
                                            <td style={{ padding: '1.5rem 1rem' }}>{item.district}</td>
                                            <td style={{ padding: '1.5rem 1rem' }}>
                                                <span style={{ padding: '0.4rem 1.25rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 900, background: item.status === 'Approved' ? '#dcfce7' : '#fef3c7', color: item.status === 'Approved' ? '#166534' : '#92400e' }}>
                                                    {item.status?.toUpperCase() || 'PENDING'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1.5rem 1rem', textAlign: 'center' }}>
                                                <button onClick={() => setSelectedAdmission(item)} className="btn" style={{ padding: '0.6rem', background: '#f1f5f9', borderRadius: '50%' }}><Eye size={20} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL LAYER */}
            {selectedAdmission && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)',
                    zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem'
                }} onClick={() => setSelectedAdmission(null)}>
                    {user.role === 'student' ? (
                        <StudentPrintableForm admission={selectedAdmission} onClose={() => setSelectedAdmission(null)} />
                    ) : (
                        <AdminDetailDossier admission={selectedAdmission} onClose={() => setSelectedAdmission(null)} onApprove={handleApprove} />
                    )}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
