import React from 'react';
import { Download, Search, X, FileText } from 'lucide-react';

const SpreadsheetView = ({ data, searchTerm, setSearchTerm, onClose }) => {
    const filteredData = data.filter(item => {
        const s = searchTerm.toLowerCase();
        return (
            (item.studentName || '').toLowerCase().includes(s) ||
            (item.appNumber || '').toLowerCase().includes(s) ||
            (item.course || '').toLowerCase().includes(s) ||
            (item.district || '').toLowerCase().includes(s) ||
            (item.remarks || '').toLowerCase().includes(s)
        );
    });

    const exportToCSV = () => {
        if (!data || data.length === 0) return;

        // Find all unique keys across all records
        const headers = Array.from(new Set(data.flatMap(o => Object.keys(o))));
        const csvContent = [
            headers.join(','),
            ...data.map(row => headers.map(fieldName => {
                let val = row[fieldName];
                if (val === undefined || val === null) return '""';
                if (typeof val === 'object') {
                    return `"${JSON.stringify(val).replace(/"/g, '""')}"`;
                }
                return `"${val.toString().replace(/"/g, '""')}"`;
            }).join(','))
        ].join('\n');

        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `Admissions_Records_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: '#fff',
            zIndex: 3000,
            display: 'flex',
            flexDirection: 'column',
            fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
        }}>
            {/* Toolbar */}
            <div style={{
                padding: '0.75rem 1.5rem',
                borderBottom: '1px solid #e0e0e0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: '#f8f9fa'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1e3a8a' }}>
                        <FileText size={20} />
                        <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>Admissions Spreadsheet</span>
                    </div>
                    <div style={{ position: 'relative', width: '300px' }}>
                        <Search style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={16} />
                        <input
                            type="text"
                            placeholder="Search spreadsheet..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.4rem 0.75rem 0.4rem 2.5rem',
                                borderRadius: '4px',
                                border: '1px solid #cbd5e1',
                                fontSize: '0.9rem'
                            }}
                        />
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button onClick={exportToCSV} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.4rem 1rem',
                        background: '#166534',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: '600'
                    }}>
                        <Download size={16} /> Export to Excel (CSV)
                    </button>
                    <button onClick={onClose} style={{
                        padding: '0.4rem',
                        background: '#f1f5f9',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        color: '#64748b'
                    }}>
                        <X size={24} />
                    </button>
                </div>
            </div>

            {/* Table Area */}
            <div style={{ flex: 1, overflow: 'auto', padding: '0' }}>
                <table style={{
                    width: 'max-content',
                    minWidth: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '0.85rem',
                    color: '#334155'
                }}>
                    <thead style={{ position: 'sticky', top: 0, zIndex: 10, background: '#f1f5f9' }}>
                        <tr>
                            <th style={headerStyle}>#</th>
                            <th style={headerStyle}>App Number</th>
                            <th style={headerStyle}>Student Name</th>
                            <th style={headerStyle}>Status</th>
                            <th style={{ ...headerStyle, minWidth: '250px', background: '#fffbeb', color: '#92400e' }}>Official Remarks</th>
                            <th style={headerStyle}>Course</th>
                            <th style={headerStyle}>Institution</th>
                            <th style={headerStyle}>Date</th>
                            <th style={headerStyle}>Gender</th>
                            <th style={headerStyle}>DOB</th>
                            <th style={headerStyle}>Aadhaar No</th>
                            <th style={headerStyle}>Quota</th>
                            <th style={headerStyle}>Community</th>
                            <th style={headerStyle}>Annual Income</th>
                            <th style={headerStyle}>District</th>
                            <th style={headerStyle}>Address</th>
                            <th style={headerStyle}>Pincode</th>
                            <th style={headerStyle}>Phone 1 (Student WA)</th>
                            <th style={headerStyle}>Phone 2 (Parent WA)</th>
                            <th style={headerStyle}>Phone 3 (Alt)</th>
                            <th style={headerStyle}>Father Name</th>
                            <th style={headerStyle}>Father Occupation</th>
                            <th style={headerStyle}>Mother Name</th>
                            <th style={headerStyle}>Mother Occupation</th>
                            <th style={headerStyle}>School Name</th>
                            <th style={headerStyle}>School Type</th>
                            <th style={headerStyle}>Board</th>
                            <th style={headerStyle}>Medium</th>
                            <th style={headerStyle}>10th Total</th>
                            <th style={headerStyle}>10th Maths</th>
                            <th style={headerStyle}>10th Science</th>
                            <th style={headerStyle}>11th Total</th>
                            <th style={headerStyle}>11th Marks</th>
                            <th style={headerStyle}>12th Total</th>
                            <th style={headerStyle}>12th Cutoff</th>
                            <th style={headerStyle}>12th Reg No</th>
                            <th style={headerStyle}>Hostel Req</th>
                            <th style={headerStyle}>Bus Req</th>
                            <th style={headerStyle}>Bus Point</th>
                            <th style={headerStyle}>First Grad</th>
                            <th style={headerStyle}>PMSS</th>
                            <th style={headerStyle}>Laptop</th>
                            <th style={headerStyle}>Submitted At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((item, index) => (
                            <tr key={item.id} style={{
                                borderBottom: '1px solid #e2e8f0',
                                background: index % 2 === 0 ? '#fff' : '#f8fafc'
                            }}>
                                <td style={{ ...cellStyle, color: '#94a3b8', textAlign: 'center', fontWeight: '500' }}>{index + 1}</td>
                                <td style={{ ...cellStyle, fontWeight: '700', color: '#1e3a8a' }}>{item.appNumber}</td>
                                <td style={{ ...cellStyle, fontWeight: '600' }}>{item.studentName}</td>
                                <td style={cellStyle}>
                                    <span style={{
                                        padding: '0.1rem 0.5rem',
                                        borderRadius: '4px',
                                        fontSize: '0.7rem',
                                        fontWeight: '700',
                                        background: item.status === 'Approved' ? '#dcfce7' : '#fef3c7',
                                        color: item.status === 'Approved' ? '#166534' : '#92400e'
                                    }}>
                                        {(item.status || 'Pending').toUpperCase()}
                                    </span>
                                </td>
                                <td style={{ ...cellStyle, background: '#fffbeb', fontWeight: '500', color: '#78350f', whiteSpace: 'normal', minWidth: '250px' }}>
                                    {item.remarks || '---'}
                                </td>
                                <td style={cellStyle}>{item.course}</td>
                                <td style={cellStyle}>{item.institution}</td>
                                <td style={cellStyle}>{item.date}</td>
                                <td style={cellStyle}>{item.gender}</td>
                                <td style={cellStyle}>{item.dob}</td>
                                <td style={cellStyle}>{item.aadhaarNo}</td>
                                <td style={cellStyle}>{item.quota}</td>
                                <td style={cellStyle}>{item.community}</td>
                                <td style={cellStyle}>{item.annualIncome}</td>
                                <td style={cellStyle}>{item.district}</td>
                                <td style={{ ...cellStyle, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }} title={item.address}>{item.address}</td>
                                <td style={cellStyle}>{item.pincode}</td>
                                <td style={cellStyle}>{item.phone1}</td>
                                <td style={cellStyle}>{item.phone2}</td>
                                <td style={cellStyle}>{item.phone3}</td>
                                <td style={cellStyle}>{item.fatherName}</td>
                                <td style={cellStyle}>{item.fatherOccupation}</td>
                                <td style={cellStyle}>{item.motherName}</td>
                                <td style={cellStyle}>{item.motherOccupation}</td>
                                <td style={cellStyle}>{item.schoolName}</td>
                                <td style={cellStyle}>{item.schoolType}</td>
                                <td style={cellStyle}>{item.boardOfStudy}</td>
                                <td style={cellStyle}>{item.mediumOfInstruction}</td>
                                <td style={cellStyle}>{item.marks10th?.total}</td>
                                <td style={cellStyle}>{item.marks10th?.maths}</td>
                                <td style={cellStyle}>{item.marks10th?.science}</td>
                                <td style={cellStyle}>{item.marks11th?.total}</td>
                                <td style={cellStyle}>
                                    P/E: {item.marks11th?.phyEco}, C/C: {item.marks11th?.cheComm}, M/A: {item.marks11th?.mathsAccs}, C/B: {item.marks11th?.compBio}
                                </td>
                                <td style={cellStyle}>{item.marks12th?.total}</td>
                                <td style={{ ...cellStyle, fontWeight: '700', color: 'var(--primary)' }}>{item.marks12th?.cutoff || 'N/A'}</td>
                                <td style={cellStyle}>{item.marks12th?.regNo}</td>
                                <td style={cellStyle}>{item.hostel}</td>
                                <td style={cellStyle}>{item.bus}</td>
                                <td style={cellStyle}>{item.busPoint}</td>
                                <td style={cellStyle}>{item.firstGrad}</td>
                                <td style={cellStyle}>{item.pmss}</td>
                                <td style={cellStyle}>{item.laptop}</td>
                                <td style={cellStyle}>{item.submittedAt ? new Date(item.submittedAt).toLocaleString() : 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer / Status bar */}
            <div style={{
                padding: '0.4rem 1rem',
                borderTop: '1px solid #e0e0e0',
                background: '#f8f9fa',
                fontSize: '0.75rem',
                color: '#64748b',
                display: 'flex',
                gap: '1.5rem'
            }}>
                <span>Total Records: <strong>{data.length}</strong></span>
                <span>Filtered: <strong>{filteredData.length}</strong></span>
                <span>Ready</span>
            </div>
        </div>
    );
};

const headerStyle = {
    padding: '0.75rem 1rem',
    textAlign: 'left',
    borderRight: '1px solid #e2e8f0',
    borderBottom: '2px solid #cbd5e1',
    fontWeight: '700',
    color: '#475569',
    whiteSpace: 'nowrap'
};

const cellStyle = {
    padding: '0.6rem 1rem',
    borderRight: '1px solid #e2e8f0',
    whiteSpace: 'nowrap'
};

export default SpreadsheetView;
