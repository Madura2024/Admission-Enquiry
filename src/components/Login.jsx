import React, { useState } from 'react';
import { User, ShieldCheck, Headphones, LogIn, Hash, Eye, EyeOff } from 'lucide-react';

const Login = ({ onLogin, isSidePanel }) => {
    const [role, setRole] = useState('student');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [appNumber, setAppNumber] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (role === 'student') {
            const studentRegex = /^KITE-2026-\d{4}$/i;
            if (!studentRegex.test(appNumber.trim())) {
                setError('Invalid format. Use KITE-2026-XXXX');
                return;
            }
            onLogin({ username: appNumber.toUpperCase(), role, appNumber: appNumber.toUpperCase() });
        } else {
            // Enforce domain for admin/staff
            let fullUsername = username.trim();
            if (!fullUsername.endsWith('@kgkite.ac.in')) {
                setError('Username must end with @kgkite.ac.in');
                return;
            }

            if (role === 'admin') {
                if (password === 'kite@123') {
                    onLogin({ username: fullUsername, role });
                } else {
                    setError('Wrong password');
                }
            } else {
                // For staff/counselor, we can keep it flexible or set another default
                if (username && password) {
                    onLogin({ username: fullUsername, role });
                } else {
                    setError('Please enter credentials');
                }
            }
        }
    };

    const loginCard = (
        <div className="glass-card animate-fade-in" style={{ width: '100%', padding: isSidePanel ? '1.5rem' : '2.5rem' }}>
            <h2 className="font-outfit" style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: isSidePanel ? '1.5rem' : '2rem' }}>
                {isSidePanel ? 'Portal Login' : 'Welcome Back'}
            </h2>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <button
                    className={`btn ${role === 'student' ? 'btn-primary' : ''}`}
                    onClick={() => setRole('student')}
                    style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem', background: role === 'student' ? '' : 'var(--glass-bg)' }}
                >
                    <User size={14} /> Student
                </button>
                <button
                    className={`btn ${role === 'admin' ? 'btn-primary' : ''}`}
                    onClick={() => setRole('admin')}
                    style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem', background: role === 'admin' ? '' : 'var(--glass-bg)' }}
                >
                    <ShieldCheck size={14} /> Admin
                </button>
                <button
                    className={`btn ${role === 'counselor' ? 'btn-primary' : ''}`}
                    onClick={() => setRole('counselor')}
                    style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem', background: role === 'counselor' ? '' : 'var(--glass-bg)' }}
                >
                    <Headphones size={14} /> Staff
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                {error && (
                    <div style={{
                        color: 'var(--error)',
                        background: 'rgba(239, 68, 68, 0.1)',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        marginBottom: '1rem',
                        fontSize: '0.875rem',
                        textAlign: 'center',
                        border: '1px solid rgba(239, 68, 68, 0.2)'
                    }}>
                        {error}
                    </div>
                )}
                {role === 'student' ? (
                    <div className="input-group" style={{ marginBottom: '1.5rem' }}>
                        <label className="input-label">Application Number</label>
                        <div style={{ position: 'relative' }}>
                            <Hash size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="text"
                                className="input-field"
                                style={{ paddingLeft: '3rem' }}
                                placeholder="KITE-2026-XXXX"
                                value={appNumber}
                                onChange={(e) => setAppNumber(e.target.value.toUpperCase())}
                            />
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="input-group">
                            <label className="input-label">Username</label>
                            <div style={{ position: 'relative' }}>
                                <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type="text"
                                    className="input-field"
                                    style={{ paddingLeft: '3rem' }}
                                    placeholder="name@kgkite.ac.in"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value.toLowerCase())}
                                />
                            </div>
                        </div>
                        <div className="input-group" style={{ marginBottom: '1.5rem' }}>
                            <label className="input-label">Password</label>
                            <div style={{ position: 'relative' }}>
                                <ShieldCheck size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="input-field"
                                    style={{ paddingLeft: '3rem', paddingRight: '3rem' }}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '1rem',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        color: 'var(--text-muted)',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '0.25rem'
                                    }}
                                    title={showPassword ? "Hide Password" : "Show Password"}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                    </>
                )}

                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                    <LogIn size={18} /> {role === 'student' ? 'Track Application Status' : `Login as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
                </button>
            </form>

            <p style={{ marginTop: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                Secure Portal: Please use your official credentials
            </p>
        </div>
    );

    if (isSidePanel) return loginCard;

    return (
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
            <div style={{ maxWidth: '400px', width: '100%' }}>
                {loginCard}
            </div>
        </div>
    );
};

export default Login;
