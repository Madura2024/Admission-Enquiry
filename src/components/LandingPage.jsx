import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', flexDirection: 'column' }}>
            {/* Logo Section */}
            <div style={{ padding: '1rem 5%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <img src="/logo.png" alt="KGiSL Logo" style={{ height: '60px', objectFit: 'contain' }} />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => navigate('/login')} className="btn" style={{ background: 'var(--primary)', color: '#fff' }}>Login Portal</button>
                </div>
            </div>

            {/* Dark Navigation Bar */}
            <nav className="dark-nav">
                <Link to="/" className="dark-nav-link" style={{ color: '#f97316' }}>Home</Link>
                <Link to="/enquiry" className="dark-nav-link">Enquiry</Link>
                <Link to="/login" className="dark-nav-link">Dashboard</Link>
            </nav>

            {/* Hero Section with Campus Background */}
            <main style={{ height: '80vh', position: 'relative', overflow: 'hidden' }}>
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundImage: 'url("/hero-bg.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }} />

                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, width: '100%', height: '100%',
                    background: 'linear-gradient(to right, rgba(255,255,255,0.9) 30%, transparent 100%)',
                    display: 'flex', alignItems: 'center', paddingLeft: '8%', zIndex: 2
                }}>
                    <div className="animate-in" style={{ maxWidth: '600px' }}>
                        <h2 className="font-display" style={{
                            fontSize: '4.5rem', fontWeight: '900', lineHeight: 1.1, color: '#1e3a8a', marginBottom: '1.5rem'
                        }}>
                            Co-Kreating<br />
                            <span style={{ color: '#f97316' }}>Geniuses</span>
                        </h2>
                        <p style={{ fontSize: '1.25rem', color: '#64748b', marginBottom: '2.5rem', fontWeight: 500 }}>
                            Join the next generation of innovators at KGiSL Institutions. Start your enquiry process today.
                        </p>
                        <div style={{ display: 'flex', gap: '1.5rem' }}>
                            <button onClick={() => navigate('/enquiry')} className="btn btn-primary" style={{ padding: '1.25rem 3.5rem', fontSize: '1.2rem', background: '#f97316', border: 'none', borderRadius: '1rem', fontWeight: '900', boxShadow: '0 10px 25px rgba(249, 115, 22, 0.4)' }}>Apply Now</button>
                        </div>
                    </div>
                </div>
            </main>

            {/* WhatsApp Floating Icon */}
            <div style={{
                position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 100,
                background: '#25d366', width: '64px', height: '64px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)', cursor: 'pointer',
                transition: 'transform 0.3s ease'
            }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WA" style={{ width: '35px', filter: 'brightness(0) invert(1)' }} />
            </div>

            {/* Footer */}
            <footer style={{ background: '#1e3a8a', padding: '3rem 5%', color: '#fff', textAlign: 'center', marginTop: 'auto' }}>
                <h3 className="font-outfit" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>KGiSL Institute of Technology</h3>
                <p style={{ opacity: 0.7, marginBottom: '2rem' }}>Saravanampatti, Coimbatore - 641 035</p>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem', fontSize: '0.875rem', opacity: 0.5 }}>
                    © 2026 Admissions Portal • Built for Academic Excellence
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
