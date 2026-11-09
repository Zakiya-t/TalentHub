import React from 'react';
import { Link } from 'react-router-dom';
import { BrandLogo } from '../common/BrandLogo';
import { ShieldCheck, Heart, Sparkles, Building, GraduationCap, Compass } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer style={{
      background: '#070a13',
      borderTop: '1px solid var(--border-dark)',
      padding: '3.5rem 2rem 2rem 2rem',
      marginTop: 'auto',
      color: '#94a3b8'
    }}>
      <div style={{ maxWidth: 1440, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1.2fr',
          gap: '3rem',
          marginBottom: '3rem'
        }}>
          {/* Column 1: Brand & Identity */}
          <div>
            <BrandLogo size="md" showTagline={true} />
            <p style={{ marginTop: '1rem', fontSize: '0.875rem', lineHeight: 1.6, maxWidth: 360 }}>
              TalentHub is the next-generation campus placement OS bridging academic excellence with high-growth careers. Delivering radical transparency, automated eligibility, and seamless recruiting.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '1.25rem', fontSize: '0.78rem', color: '#64748b' }}>
              <ShieldCheck size={14} style={{ color: 'var(--lime-primary)' }} />
              <span>Accredited Academic Career Management Standard</span>
            </div>
          </div>

          {/* Column 2: For Students */}
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
              For Students
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
              <li><Link to="/jobs" style={{ color: '#cbd5e1' }}>Explore Drives & Jobs</Link></li>
              <li><Link to="/dashboard" style={{ color: '#cbd5e1' }}>Student Dashboard</Link></li>
              <li><Link to="/profile" style={{ color: '#cbd5e1' }}>Profile & ATS Resume</Link></li>
              <li><Link to="/applications" style={{ color: '#cbd5e1' }}>Application Tracking</Link></li>
              <li><Link to="/interviews" style={{ color: '#cbd5e1' }}>Interview Center</Link></li>
              <li><Link to="/offers" style={{ color: '#cbd5e1' }}>Offers & Insights</Link></li>
            </ul>
          </div>

          {/* Column 3: For Recruiters & Campus */}
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
              Campus & Enterprise
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
              <li><Link to="/recruiter" style={{ color: '#cbd5e1' }}>Recruiter Workspace</Link></li>
              <li><Link to="/coordinator" style={{ color: '#cbd5e1' }}>Placement Coordinator Console</Link></li>
              <li><Link to="/coordinator" style={{ color: '#cbd5e1' }}>Shortlist Simulator</Link></li>
              <li><Link to="/signin" style={{ color: '#cbd5e1' }}>Corporate Sign In</Link></li>
              <li><Link to="/register" style={{ color: '#cbd5e1' }}>Student Onboarding</Link></li>
            </ul>
          </div>

          {/* Column 4: Institutional Policy & Office */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-dark)',
            borderRadius: 14,
            padding: '1.25rem'
          }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem' }}>
              Placement Season Policy
            </h4>
            <p style={{ fontSize: '0.78rem', lineHeight: 1.5, color: '#94a3b8' }}>
              Students who formally accept a campus placement offer are locked from subsequent drives in accordance with equal opportunity regulations.
            </p>
            <div style={{ marginTop: '0.85rem', paddingTop: '0.85rem', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.75rem', color: '#64748b' }}>
              Need coordinator support? <span style={{ color: 'var(--violet-light)' }}>placement-support@college.edu</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid var(--border-dark)',
          paddingTop: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.78rem'
        }}>
          <div>
            © 2026 TalentHub Technologies. All rights reserved. Built for modern campus recruitment.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Privacy Policy</span>
            <span>Placement Code of Conduct</span>
            <span>Terms of Service</span>
            <span style={{ color: 'var(--lime-light)' }}>Live Demo Application</span>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          footer > div > div:first-child {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 600px) {
          footer > div > div:first-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
};
