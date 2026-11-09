import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BrandLogo } from '../common/BrandLogo';
import { useApp } from '../../context/AppContext';
import { 
  Bell, 
  Search, 
  User, 
  LogOut, 
  CheckCircle2, 
  Briefcase, 
  Calendar, 
  Award, 
  Settings, 
  Menu, 
  X,
  Sparkles,
  Layers
} from 'lucide-react';

export const Header: React.FC = () => {
  const { role, setRole, currentStudent, applications, interviews, offers } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isPublicPage = location.pathname === '/' || location.pathname === '/signin' || location.pathname === '/register';

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  // Recent notifications derived from state
  const unreadCount = 3;
  const sampleNotifications = [
    { id: '1', title: 'Offer Letter Ready', desc: 'FinVerve Systems has extended an offer of ₹18.5 LPA', time: '1h ago', type: 'offer' },
    { id: '2', title: 'Interview Scheduled', desc: 'ApexCloud Technical Round 2 scheduled for Oct 12', time: '4h ago', type: 'interview' },
    { id: '3', title: 'Application Screened', desc: 'Lumina HealthTech moved you to Shortlisted stage', time: '1d ago', type: 'status' }
  ];

  return (
    <header style={{
      background: 'rgba(11, 15, 25, 0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-dark)',
      position: 'sticky',
      top: '38px', // directly beneath demo top bar
      zIndex: 90,
      width: '100%'
    }}>
      <div style={{
        maxWidth: 1440,
        margin: '0 auto',
        padding: '0.75rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem'
      }}>
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <BrandLogo size="md" showTagline={false} />

          {/* Search bar on desktop */}
          {!isPublicPage && (
            <form onSubmit={handleSearchSubmit} className="input-with-icon" style={{ width: 280, display: 'none' }} id="header-search-form">
              <Search size={15} className="input-icon" />
              <input
                type="text"
                className="form-input"
                placeholder="Search jobs, companies, skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ height: 38, fontSize: '0.8125rem', borderRadius: 8 }}
              />
            </form>
          )}
        </div>

        {/* Desktop Nav Items */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {isPublicPage ? (
            <>
              <Link to="/jobs" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#cbd5e1' }}>
                Explore Jobs
              </Link>
              <Link to="/coordinator" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#cbd5e1' }}>
                For Colleges
              </Link>
              <Link to="/recruiter" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#cbd5e1' }}>
                For Recruiters
              </Link>
              <div style={{ width: 1, height: 20, background: 'var(--border-dark)' }} />
              <Link to="/signin" className="btn btn-outline" style={{ padding: '0.45rem 1rem', fontSize: '0.8125rem' }}>
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.45rem 1.1rem', fontSize: '0.8125rem' }}>
                Join TalentHub
              </Link>
            </>
          ) : (
            <>
              {/* Dynamic Workspace Links */}
              <Link 
                to="/dashboard" 
                style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: 600, 
                  color: location.pathname === '/dashboard' ? 'var(--violet-light)' : '#cbd5e1' 
                }}
              >
                Dashboard
              </Link>
              <Link 
                to="/jobs" 
                style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: 600, 
                  color: location.pathname === '/jobs' ? 'var(--violet-light)' : '#cbd5e1' 
                }}
              >
                Explore Jobs
              </Link>
              <Link 
                to="/applications" 
                style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: 600, 
                  color: location.pathname === '/applications' ? 'var(--violet-light)' : '#cbd5e1' 
                }}
              >
                Applications ({applications.filter(a => a.studentId === currentStudent.id).length})
              </Link>
              <Link 
                to="/interviews" 
                style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: 600, 
                  color: location.pathname === '/interviews' ? 'var(--violet-light)' : '#cbd5e1' 
                }}
              >
                Interviews ({interviews.filter(i => i.status === 'Scheduled').length})
              </Link>
              <Link 
                to="/offers" 
                style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: 600, 
                  color: location.pathname === '/offers' ? 'var(--lime-light)' : '#cbd5e1' 
                }}
              >
                Offers ({offers.length})
              </Link>

              {/* Notification Center Trigger */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setShowProfileMenu(false);
                  }}
                  style={{
                    position: 'relative',
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: '#131b2e',
                    border: '1px solid var(--border-dark)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#cbd5e1'
                  }}
                  aria-label="Notifications"
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: 6,
                      right: 6,
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: 'var(--lime-primary)',
                      boxShadow: '0 0 6px var(--lime-glow)'
                    }} />
                  )}
                </button>

                {/* Notifications Dropdown Modal */}
                {showNotifications && (
                  <div style={{
                    position: 'absolute',
                    right: 0,
                    top: 48,
                    width: 340,
                    background: '#111a2e',
                    border: '1px solid var(--border-dark)',
                    borderRadius: 14,
                    boxShadow: 'var(--shadow-xl)',
                    padding: '1rem',
                    zIndex: 100
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#ffffff' }}>Notifications</span>
                      <span className="badge badge-lime" style={{ fontSize: '0.7rem' }}>{unreadCount} New</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {sampleNotifications.map((notif) => (
                        <div key={notif.id} style={{
                          padding: '0.65rem',
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                          borderRadius: 8,
                          fontSize: '0.8125rem'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <strong style={{ color: '#ffffff' }}>{notif.title}</strong>
                            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{notif.time}</span>
                          </div>
                          <p style={{ fontSize: '0.75rem', marginTop: '0.2rem', color: '#cbd5e1' }}>{notif.desc}</p>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => setShowNotifications(false)}
                      style={{
                        width: '100%',
                        textAlign: 'center',
                        fontSize: '0.75rem',
                        color: 'var(--violet-light)',
                        marginTop: '0.75rem',
                        padding: '0.3rem',
                        fontWeight: 600
                      }}
                    >
                      Close Notifications
                    </button>
                  </div>
                )}
              </div>

              {/* Profile Avatar & Dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => {
                    setShowProfileMenu(!showProfileMenu);
                    setShowNotifications(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.25rem 0.5rem',
                    borderRadius: 10,
                    background: '#131b2e',
                    border: '1px solid var(--border-dark)',
                    color: '#ffffff'
                  }}
                >
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6366f1, #84cc16)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.8125rem',
                    color: '#0b0f19'
                  }}>
                    {role === 'student' ? 'RS' : role === 'recruiter' ? 'AC' : 'PC'}
                  </div>
                  <div style={{ textAlign: 'left', lineHeight: 1.1 }}>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
                      {role === 'student' ? currentStudent.name.split(' ')[0] : role === 'recruiter' ? 'ApexCloud' : 'Placement Head'}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                      {role === 'student' ? `${currentStudent.branch} '${currentStudent.graduationYear.toString().slice(2)}` : role.toUpperCase()}
                    </div>
                  </div>
                </button>

                {showProfileMenu && (
                  <div style={{
                    position: 'absolute',
                    right: 0,
                    top: 48,
                    width: 220,
                    background: '#111a2e',
                    border: '1px solid var(--border-dark)',
                    borderRadius: 14,
                    boxShadow: 'var(--shadow-xl)',
                    padding: '0.6rem',
                    zIndex: 100
                  }}>
                    <Link
                      to="/profile"
                      onClick={() => setShowProfileMenu(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.6rem',
                        borderRadius: 8,
                        fontSize: '0.8125rem',
                        color: '#cbd5e1'
                      }}
                      className="hover-subtle"
                    >
                      <User size={15} />
                      Student Profile & Resume
                    </Link>

                    <Link
                      to="/recruiter"
                      onClick={() => {
                        setRole('recruiter');
                        setShowProfileMenu(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.6rem',
                        borderRadius: 8,
                        fontSize: '0.8125rem',
                        color: '#cbd5e1'
                      }}
                    >
                      <Briefcase size={15} />
                      Recruiter Workspace
                    </Link>

                    <Link
                      to="/coordinator"
                      onClick={() => {
                        setRole('coordinator');
                        setShowProfileMenu(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.6rem',
                        borderRadius: 8,
                        fontSize: '0.8125rem',
                        color: '#cbd5e1'
                      }}
                    >
                      <Layers size={15} />
                      Coordinator Console
                    </Link>

                    <div style={{ height: 1, background: 'var(--border-dark)', margin: '0.4rem 0' }} />

                    <Link
                      to="/"
                      onClick={() => {
                        setRole('guest');
                        setShowProfileMenu(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.6rem',
                        borderRadius: 8,
                        fontSize: '0.8125rem',
                        color: '#f87171'
                      }}
                    >
                      <LogOut size={15} />
                      Sign Out
                    </Link>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{ display: 'none', color: '#ffffff' }}
            id="mobile-nav-toggle"
            aria-label="Toggle navigation"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </div>

      {/* Responsive styling for header desktop vs mobile */}
      <style>{`
        @media (max-width: 900px) {
          #header-search-form { display: none !important; }
          #mobile-nav-toggle { display: block !important; }
        }
      `}</style>
    </header>
  );
};
