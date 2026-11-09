import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { RotateCcw, ShieldCheck, UserCheck, Briefcase, GraduationCap, Compass, Database } from 'lucide-react';
import { Role } from '../../types';
import { apiService } from '../../services/api';

export const DemoBanner: React.FC = () => {
  const { role, setRole, resetDemoData } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [dbConnected, setDbConnected] = useState<boolean | null>(null);

  useEffect(() => {
    apiService.checkHealth()
      .then((res) => {
        if (res.status === 'ok') setDbConnected(true);
      })
      .catch(() => setDbConnected(false));
  }, []);

  const pages = [
    { path: '/', label: 'P1: Landing Page' },
    { path: '/signin', label: 'P2: Sign In' },
    { path: '/register', label: 'P3: Student Registration' },
    { path: '/dashboard', label: 'P4: Student Dashboard' },
    { path: '/profile', label: 'P5: Profile & Resume' },
    { path: '/jobs', label: 'P6: Explore Jobs' },
    { path: '/jobs/job_apex_01', label: 'P7: Job Details & Eligibility' },
    { path: '/applications', label: 'P8: My Applications' },
    { path: '/interviews', label: 'P9: Interview Center' },
    { path: '/offers', label: 'P10: Offers & Insights' },
    { path: '/recruiter', label: 'P11: Recruiter Workspace' },
    { path: '/coordinator', label: 'P12: Coordinator Console' },
  ];

  const handleRoleSelect = (newRole: Role) => {
    setRole(newRole);
    if (newRole === 'recruiter') {
      navigate('/recruiter');
    } else if (newRole === 'coordinator') {
      navigate('/coordinator');
    } else if (newRole === 'student') {
      if (location.pathname === '/recruiter' || location.pathname === '/coordinator') {
        navigate('/dashboard');
      }
    }
  };

  return (
    <aside aria-label="Demo Navigation Toolbar" className="demo-top-bar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
        <span className="pill">
          <ShieldCheck size={13} />
          <span>Interactive Demo Mode</span>
        </span>
        {dbConnected === true && (
          <span className="pill" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <Database size={12} />
            <span>SQLite DB Active (11 Tables)</span>
          </span>
        )}
        {dbConnected === false && (
          <span className="pill" style={{ background: 'rgba(234, 179, 8, 0.15)', color: '#facc15', border: '1px solid rgba(234, 179, 8, 0.3)' }} title="Run 'python backend/run.py' to connect the FastAPI + SQLite backend">
            <Database size={12} />
            <span>Browser Cache Mode</span>
          </span>
        )}
        <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>
          Role: <strong style={{ color: '#ffffff' }}>{role.toUpperCase()}</strong>
        </span>
        <div style={{ display: 'flex', gap: '0.35rem' }}>
          <button 
            className={`role-switcher-btn ${role === 'student' ? 'active' : ''}`}
            onClick={() => handleRoleSelect('student')}
            title="Switch to Student view (Rohan Sharma)"
          >
            <GraduationCap size={12} style={{ display: 'inline', marginRight: 4 }} />
            Student
          </button>
          <button 
            className={`role-switcher-btn ${role === 'recruiter' ? 'active' : ''}`}
            onClick={() => handleRoleSelect('recruiter')}
            title="Switch to Recruiter view (ApexCloud Technologies)"
          >
            <Briefcase size={12} style={{ display: 'inline', marginRight: 4 }} />
            Recruiter
          </button>
          <button 
            className={`role-switcher-btn ${role === 'coordinator' ? 'active' : ''}`}
            onClick={() => handleRoleSelect('coordinator')}
            title="Switch to Placement Coordinator Admin Console"
          >
            <UserCheck size={12} style={{ display: 'inline', marginRight: 4 }} />
            Coordinator
          </button>
        </div>
      </div>

      <div className="demo-quick-nav">
        {/* Jump to any of the 12 pages */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Compass size={14} style={{ color: 'var(--lime-light)' }} />
          <select
            value={location.pathname.startsWith('/jobs/') && location.pathname !== '/jobs' ? '/jobs/job_apex_01' : location.pathname}
            onChange={(e) => navigate(e.target.value)}
            style={{
              background: '#131b2e',
              color: '#f8fafc',
              border: '1px solid var(--border-dark)',
              borderRadius: '6px',
              padding: '0.25rem 0.5rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {pages.map((p) => (
              <option key={p.path} value={p.path}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        <button 
          onClick={resetDemoData}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.25rem 0.6rem',
            fontSize: '0.72rem',
            background: 'rgba(239, 68, 68, 0.1)',
            color: '#fca5a5',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            borderRadius: '6px'
          }}
          title="Reset all demo applications, interviews, offers, and profiles to pristine initial state"
        >
          <RotateCcw size={11} />
          Reset Demo Data
        </button>
      </div>
    </aside>
  );
};
