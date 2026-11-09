import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { BrandLogo } from '../components/common/BrandLogo';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  GraduationCap, 
  Briefcase, 
  Layers, 
  AlertCircle,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { Role } from '../types';

export const SignInPage: React.FC = () => {
  const { setRole, showToast } = useApp();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<Role>('student');
  const [email, setEmail] = useState('rohan.sharma@college.edu');
  const [password, setPassword] = useState('TalentHub@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  // Quick preset accounts for evaluation
  const setDemoAccount = (roleType: Role) => {
    setSelectedRole(roleType);
    setErrorMessage('');
    if (roleType === 'student') {
      setEmail('rohan.sharma@college.edu');
      setPassword('TalentHub@2026');
    } else if (roleType === 'recruiter') {
      setEmail('recruiter@apexcloud.io');
      setPassword('ApexRecruit@2026');
    } else if (roleType === 'coordinator') {
      setEmail('coordinator@college.edu');
      setPassword('AdminPlacement@2026');
    }
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please fill in both your email address and password.');
      return;
    }

    if (!email.includes('@')) {
      setErrorMessage('Please provide a valid institutional email address.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setRole(selectedRole);

      showToast('Authentication Successful', `Welcome back to TalentHub as ${selectedRole.toUpperCase()}!`, 'success');

      if (selectedRole === 'student') {
        navigate('/dashboard');
      } else if (selectedRole === 'recruiter') {
        navigate('/recruiter');
      } else if (selectedRole === 'coordinator') {
        navigate('/coordinator');
      }
    }, 700);
  };

  const handleDemoSSO = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setRole('student');
      showToast('Single Sign-On Verified', 'Authenticated via Campus Google Identity Workspace.', 'success');
      navigate('/dashboard');
    }, 600);
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.includes('@')) {
      showToast('Invalid Email', 'Enter a valid institutional email address', 'error');
      return;
    }
    setResetSuccess(true);
    setTimeout(() => {
      setShowForgotPasswordModal(false);
      setResetSuccess(false);
      setForgotEmail('');
      showToast('Recovery Email Sent', 'Password reset instructions have been dispatched to your inbox.', 'info');
    }, 1800);
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 120px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1.5rem',
      background: 'radial-gradient(ellipse at 50% 10%, rgba(99, 102, 241, 0.12) 0%, rgba(9, 13, 22, 0) 70%), #090d16'
    }}>
      <div style={{
        width: '100%',
        maxWidth: 480,
        background: '#0e1526',
        border: '1px solid var(--border-dark)',
        borderRadius: 20,
        boxShadow: 'var(--shadow-xl)',
        padding: '2.5rem 2rem',
        position: 'relative'
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-block', marginBottom: '0.75rem' }}>
            <BrandLogo size="md" />
          </div>
          <h2 style={{ fontSize: '1.65rem', marginBottom: '0.35rem' }}>Welcome Back</h2>
          <p style={{ fontSize: '0.875rem' }}>Access your personalized placement workspace</p>
        </div>

        {/* Role Selector Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.35rem',
          background: '#090d16',
          border: '1px solid var(--border-dark)',
          borderRadius: 12,
          padding: '0.3rem',
          marginBottom: '1.75rem'
        }}>
          <button
            type="button"
            onClick={() => setDemoAccount('student')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              padding: '0.5rem 0.25rem',
              borderRadius: 8,
              fontSize: '0.78rem',
              fontWeight: 600,
              background: selectedRole === 'student' ? 'var(--violet-primary)' : 'transparent',
              color: selectedRole === 'student' ? '#ffffff' : '#94a3b8'
            }}
          >
            <GraduationCap size={14} />
            Student
          </button>
          <button
            type="button"
            onClick={() => setDemoAccount('recruiter')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              padding: '0.5rem 0.25rem',
              borderRadius: 8,
              fontSize: '0.78rem',
              fontWeight: 600,
              background: selectedRole === 'recruiter' ? 'var(--violet-primary)' : 'transparent',
              color: selectedRole === 'recruiter' ? '#ffffff' : '#94a3b8'
            }}
          >
            <Briefcase size={14} />
            Recruiter
          </button>
          <button
            type="button"
            onClick={() => setDemoAccount('coordinator')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              padding: '0.5rem 0.25rem',
              borderRadius: 8,
              fontSize: '0.78rem',
              fontWeight: 600,
              background: selectedRole === 'coordinator' ? 'var(--violet-primary)' : 'transparent',
              color: selectedRole === 'coordinator' ? '#ffffff' : '#94a3b8'
            }}
          >
            <Layers size={14} />
            Admin
          </button>
        </div>

        {/* Error notification banner */}
        {errorMessage && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 10,
            padding: '0.75rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            color: '#f87171',
            fontSize: '0.8125rem',
            marginBottom: '1.25rem'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Sign In Form */}
        <form onSubmit={handleSignIn}>
          <div className="form-group">
            <label className="form-label" htmlFor="signin-email">
              {selectedRole === 'student' ? 'College Email Address' : selectedRole === 'recruiter' ? 'Company Work Email' : 'Administrative Email'}
            </label>
            <div className="input-with-icon">
              <Mail size={16} className="input-icon" />
              <input
                id="signin-email"
                type="email"
                className="form-input"
                placeholder={selectedRole === 'student' ? 'name@college.edu' : 'recruiter@company.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <label className="form-label" htmlFor="signin-password" style={{ marginBottom: 0 }}>Password</label>
              <button
                type="button"
                onClick={() => setShowForgotPasswordModal(true)}
                style={{ fontSize: '0.75rem', color: 'var(--violet-light)', fontWeight: 600 }}
              >
                Forgot Password?
              </button>
            </div>
            <div className="input-with-icon">
              <Lock size={16} className="input-icon" />
              <input
                id="signin-password"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingRight: '2.5rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  color: '#64748b',
                  display: 'flex',
                  alignItems: 'center'
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#94a3b8', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: 'var(--violet-primary)', width: 15, height: 15 }}
              />
              Remember this device
            </label>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Demo prefilled</span>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.75rem', fontSize: '0.925rem' }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
                Authenticating...
              </>
            ) : (
              <>
                Sign In as {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          margin: '1.5rem 0',
          color: '#64748b',
          fontSize: '0.78rem'
        }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border-dark)' }} />
          <span>OR CONTINUE WITH</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border-dark)' }} />
        </div>

        {/* Google Single Sign-on Demo Button */}
        <button
          type="button"
          onClick={handleDemoSSO}
          className="btn btn-secondary"
          style={{ width: '100%', gap: '0.75rem', fontSize: '0.85rem' }}
          disabled={isLoading}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.94H1.26v3.15C3.25 21.36 7.33 24 12 24z"/>
            <path fill="#FBBC05" d="M5.28 14.26c-.25-.72-.38-1.49-.38-2.26s.13-1.54.38-2.26V6.59H1.26C.46 8.21 0 10.05 0 12s.46 3.79 1.26 5.41l4.02-3.15z"/>
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.25 2.64 1.26 6.59l4.02 3.15c.95-2.84 3.6-4.99 6.72-4.99z"/>
          </svg>
          Demo Single Sign-On (Google Campus ID)
        </button>

        {/* Footer Link to Register */}
        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.85rem', color: '#94a3b8' }}>
          New student registering for the placement season?{' '}
          <Link to="/register" style={{ color: 'var(--lime-light)', fontWeight: 600 }}>
            Create Account
          </Link>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className="modal-overlay" onClick={() => setShowForgotPasswordModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 440 }}>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem' }}>Password Recovery</h3>
            <p style={{ fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              Enter your verified college email to receive an institutional reset link.
            </p>

            {resetSuccess ? (
              <div style={{
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: 12,
                padding: '1.25rem',
                textAlign: 'center',
                color: '#34d399'
              }}>
                <CheckCircle2 size={32} style={{ margin: '0 auto 0.5rem auto' }} />
                <div style={{ fontWeight: 700 }}>Dispatching Recovery Link...</div>
                <div style={{ fontSize: '0.78rem', marginTop: '0.25rem' }}>Check your campus inbox shortly.</div>
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit}>
                <div className="form-group">
                  <label className="form-label">College Email</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="student@college.edu"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                  />
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setShowForgotPasswordModal(false)}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
