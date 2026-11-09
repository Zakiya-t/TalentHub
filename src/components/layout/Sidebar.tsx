import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  UserCircle, 
  Search, 
  FileText, 
  Calendar, 
  Award, 
  Briefcase, 
  Layers, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { role, currentStudent, applications, interviews, offers } = useApp();

  const activeAppCount = applications.filter(a => a.studentId === currentStudent.id).length;
  const scheduledInterviewCount = interviews.filter(i => i.status === 'Scheduled').length;
  const offerCount = offers.length;

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { to: '/profile', label: 'Profile & Resume', icon: UserCircle, badge: `${currentStudent.profileCompletionPercentage}%` },
    { to: '/jobs', label: 'Explore Jobs', icon: Search, badge: '8 New' },
    { to: '/applications', label: 'My Applications', icon: FileText, badge: activeAppCount > 0 ? activeAppCount : null },
    { to: '/interviews', label: 'Interview Center', icon: Calendar, badge: scheduledInterviewCount > 0 ? scheduledInterviewCount : null },
    { to: '/offers', label: 'Offers & Insights', icon: Award, badge: offerCount > 0 ? `${offerCount} Ready` : null },
  ];

  const adminItems = [
    { to: '/recruiter', label: 'Recruiter Workspace', icon: Briefcase, badge: 'Drive' },
    { to: '/coordinator', label: 'Coordinator Console', icon: Layers, badge: 'Admin' }
  ];

  return (
    <aside style={{
      width: collapsed ? 76 : 260,
      background: '#0a0f1c',
      borderRight: '1px solid var(--border-dark)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '1.25rem 0.75rem',
      transition: 'width 200ms ease',
      flexShrink: 0,
      minHeight: 'calc(100vh - 80px)'
    }}>
      <div>
        {/* Toggle Collapse Button */}
        <div style={{ display: 'flex', justifyContent: collapsed ? 'center' : 'flex-end', marginBottom: '1rem', padding: '0 0.5rem' }}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              padding: '0.3rem',
              borderRadius: 6,
              background: '#131b2e',
              border: '1px solid var(--border-dark)',
              color: '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
          </button>
        </div>

        {/* Section Title */}
        {!collapsed && (
          <div style={{
            fontSize: '0.6875rem',
            fontWeight: 700,
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            padding: '0 0.75rem',
            marginBottom: '0.5rem'
          }}>
            Student Career Space
          </div>
        )}

        {/* Navigation Links */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to || (item.to === '/jobs' && location.pathname.startsWith('/jobs'));
            return (
              <NavLink
                key={item.to}
                to={item.to}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: collapsed ? 'center' : 'space-between',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 10,
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: isActive ? '#ffffff' : '#94a3b8',
                  background: isActive ? 'linear-gradient(90deg, rgba(99,102,241,0.18), rgba(99,102,241,0.05))' : 'transparent',
                  borderLeft: isActive ? '3px solid var(--violet-primary)' : '3px solid transparent',
                  textDecoration: 'none',
                  transition: 'all 150ms ease'
                }}
                title={collapsed ? item.label : undefined}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Icon size={18} style={{ color: isActive ? 'var(--violet-light)' : '#64748b', flexShrink: 0 }} />
                  {!collapsed && <span>{item.label}</span>}
                </div>
                {!collapsed && item.badge && (
                  <span className={`badge ${item.to === '/offers' ? 'badge-lime' : 'badge-violet'}`} style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Recruiter & Coordinator Section */}
        <div style={{ marginTop: '1.75rem' }}>
          {!collapsed && (
            <div style={{
              fontSize: '0.6875rem',
              fontWeight: 700,
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              padding: '0 0.75rem',
              marginBottom: '0.5rem'
            }}>
              Management Hubs
            </div>
          )}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {adminItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: collapsed ? 'center' : 'space-between',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 10,
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: isActive ? '#ffffff' : '#94a3b8',
                    background: isActive ? 'linear-gradient(90deg, rgba(132,204,22,0.15), rgba(132,204,22,0.04))' : 'transparent',
                    borderLeft: isActive ? '3px solid var(--lime-primary)' : '3px solid transparent',
                    textDecoration: 'none'
                  }}
                  title={collapsed ? item.label : undefined}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Icon size={18} style={{ color: isActive ? 'var(--lime-light)' : '#64748b', flexShrink: 0 }} />
                    {!collapsed && <span>{item.label}</span>}
                  </div>
                  {!collapsed && (
                    <span className="badge badge-neutral" style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}>
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mini Profile Completion card at bottom */}
      {!collapsed && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-dark)',
          borderRadius: 12,
          padding: '0.9rem',
          marginTop: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#e2e8f0' }}>Profile Readiness</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--lime-light)' }}>
              {currentStudent.profileCompletionPercentage}%
            </span>
          </div>
          <div className="progress-bar" style={{ height: 6 }}>
            <div className="progress-fill" style={{ width: `${currentStudent.profileCompletionPercentage}%` }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.5rem', fontSize: '0.7rem', color: '#94a3b8' }}>
            <ShieldCheck size={12} style={{ color: 'var(--status-emerald)' }} />
            <span>Academic records verified</span>
          </div>
        </div>
      )}
    </aside>
  );
};
