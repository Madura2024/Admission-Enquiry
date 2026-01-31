import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', flexDirection: 'column' }}>
            {/* Logo Section */}
            <div style={{ padding: '1.5rem 5%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <img src="/logo.png" alt="KGiSL Logo" style={{ height: '70px', objectFit: 'contain' }} />
                </div>
            </div>

            {/* Dark Navigation Bar */}
            <nav className="dark-nav">
                <Link to="/" className="dark-nav-link" style={{ color: '#f97316' }}>Home</Link>
                <Link to="/enquiry" className="dark-nav-link">Enquiry</Link>
                <Link to="/login" className="dark-nav-link">Login</Link>
            </nav>

            {/* Hero Section with Campus Background */}
            <main style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: 'url("/hero-bg.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }} />

                {/* Content overlay - Adjusted for natural fit with the background image */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '50%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: '8%',
                    zIndex: 2
                }}>
                    <div className="animate-in" style={{ maxWidth: '600px' }}>
                        <h2 className="font-display" style={{
                            fontSize: '4rem',
                            fontWeight: '900',
                            lineHeight: 1.1,
                            color: '#1e3a8a',
                            marginBottom: '1rem',
                            visibility: 'hidden' // Hide text if it clashes with image text, otherwise remove this line
                        }}>
                            Co-Kreating<br />
                            <span style={{ color: '#f97316' }}>Geniuses</span>
                        </h2>
                        <div style={{ marginTop: '2rem' }}>
                            <button onClick={() => navigate('/enquiry')} className="btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.2rem', background: '#f97316', fontWeight: 'bold', boxShadow: '0 10px 20px rgba(249, 115, 22, 0.3)' }}>Apply Now</button>
                        </div>
                    </div>
                </div>

                {/* WhatsApp Floating Icon floating like the image */}
                <div style={{
                    position: 'absolute',
                    bottom: '2rem',
                    left: '2rem',
                    zIndex: 10,
                    background: '#25d366',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    cursor: 'pointer'
                }}>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WA" style={{ width: '35px', filter: 'brightness(0) invert(1)' }} />
                </div>
            </main>

            {/* Footer */}
            <footer style={{ background: '#f8fafc', padding: '1.5rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem' }}>
                © 2026 KGiSL Institute of Technology Portal • KG-Admission Excellence
            </footer>
        </div>
    );
};

export default LandingPage;
