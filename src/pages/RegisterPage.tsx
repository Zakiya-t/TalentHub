import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { BrandLogo } from '../components/common/BrandLogo';
import { 
  User, 
  Mail, 
  Hash, 
  GraduationCap, 
  Calendar, 
  Award, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { Branch } from '../types';

export const RegisterPage: React.FC = () => {
  const { setRole, updateCurrentStudent, showToast } = useApp();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [usn, setUsn] = useState('');
  const [branch, setBranch] = useState<Branch>('CSE');
  const [gradYear, setGradYear] = useState<number>(2026);
  const [cgpa, setCgpa] = useState<string>('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [hasConsented, setHasConsented] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Password strength calculator
  const calculatePasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: 'Empty', color: '#64748b' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 25, label: 'Weak', color: '#ef4444' };
    if (score === 2) return { score: 50, label: 'Fair', color: '#f59e0b' };
    if (score === 3) return { score: 75, label: 'Good', color: '#3b82f6' };
    return { score: 100, label: 'Strong', color: 'var(--lime-primary)' };
  };

  const strength = calculatePasswordStrength(password);

  const fillSyntheticData = () => {
    setFullName('Aarav Deshmukh');
    setEmail('aarav.d@college.edu');
    setUsn('1MS22CS014');
    setBranch('CSE');
    setGradYear(2026);
    setCgpa('8.65');
    setPassword('TalentHub#2026Secure');
    setConfirmPassword('TalentHub#2026Secure');
    setHasConsented(true);
    setErrorMsg('');
    showToast('Demo Profile Loaded', 'Prefilled verified synthetic registration values.', 'info');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim() || !email.trim() || !usn.trim() || !cgpa.trim() || !password) {
      setErrorMsg('Please complete all mandatory academic profile fields.');
      return;
    }

    if (!email.includes('@college.edu') && !email.includes('@')) {
      setErrorMsg('Please use an accredited institutional email address.');
      return;
    }

    const parsedCgpa = parseFloat(cgpa);
    if (isNaN(parsedCgpa) || parsedCgpa < 0 || parsedCgpa > 10) {
      setErrorMsg('CGPA must be a valid numeric score between 0.00 and 10.00.');
      return;
    }

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Password and confirm password entries do not match.');
      return;
    }

    if (!hasConsented) {
      setErrorMsg('You must consent to the university placement season terms and single-offer rule.');
      return;
    }

    // Update session state
    updateCurrentStudent({
      name: fullName,
      email: email,
      usn: usn.toUpperCase(),
      branch: branch,
      graduationYear: gradYear,
      cgpa: parsedCgpa
    });

    setRole('student');
    showToast('Registration Complete', 'Your student profile is active. Welcome to TalentHub!', 'success');
    navigate('/dashboard');
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 120px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1.5rem',
      background: 'radial-gradient(ellipse at 50% 10%, rgba(132, 204, 22, 0.08) 0%, rgba(9, 13, 22, 0) 70%), #090d16'
    }}>
      <div style={{
        width: '100%',
        maxWidth: 680,
        background: '#0e1526',
        border: '1px solid var(--border-dark)',
        borderRadius: 20,
        boxShadow: 'var(--shadow-xl)',
        padding: '2.5rem 2.25rem',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
          <div>
            <BrandLogo size="md" />
            <h2 style={{ fontSize: '1.65rem', marginTop: '0.75rem', marginBottom: '0.25rem' }}>
              Student Registration
            </h2>
            <p style={{ fontSize: '0.875rem' }}>Create your official campus placement candidate profile</p>
          </div>
          <button
            type="button"
            onClick={fillSyntheticData}
            className="btn btn-outline"
            style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem', gap: '0.35rem' }}
          >
            <Sparkles size={13} style={{ color: 'var(--lime-light)' }} />
            Fill Synthetic Demo Data
          </button>
        </div>

        {errorMsg && (
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
            marginBottom: '1.5rem'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div className="grid-2">
            {/* Full Name */}
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <div className="input-with-icon">
                <User size={16} className="input-icon" />
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Rohan Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* College Email */}
            <div className="form-group">
              <label className="form-label">College Email *</label>
              <div className="input-with-icon">
                <Mail size={16} className="input-icon" />
                <input
                  type="email"
                  className="form-input"
                  placeholder="student@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid-2">
            {/* USN / Student ID */}
            <div className="form-group">
              <label className="form-label">USN / University Roll No. *</label>
              <div className="input-with-icon">
                <Hash size={16} className="input-icon" />
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 1MS22CS142"
                  value={usn}
                  onChange={(e) => setUsn(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Branch */}
            <div className="form-group">
              <label className="form-label">Academic Department *</label>
              <div className="input-with-icon">
                <GraduationCap size={16} className="input-icon" />
                <select
                  className="form-select"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value as Branch)}
                  style={{ paddingLeft: '2.5rem' }}
                >
                  <option value="CSE">Computer Science & Engineering (CSE)</option>
                  <option value="ISE">Information Science & Engineering (ISE)</option>
                  <option value="AI & DS">Artificial Intelligence & Data Science (AI & DS)</option>
                  <option value="ECE">Electronics & Communication (ECE)</option>
                  <option value="EEE">Electrical & Electronics (EEE)</option>
                  <option value="MECH">Mechanical Engineering (MECH)</option>
                  <option value="CIVIL">Civil Engineering (CIVIL)</option>
                  <option value="BIOTECH">Biotechnology (BIOTECH)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid-2">
            {/* Graduation Year */}
            <div className="form-group">
              <label className="form-label">Graduation Year *</label>
              <div className="input-with-icon">
                <Calendar size={16} className="input-icon" />
                <select
                  className="form-select"
                  value={gradYear}
                  onChange={(e) => setGradYear(Number(e.target.value))}
                  style={{ paddingLeft: '2.5rem' }}
                >
                  <option value={2026}>Class of 2026 (Final Year Senior)</option>
                  <option value={2027}>Class of 2027 (Pre-final Year)</option>
                  <option value={2025}>Class of 2025 (Immediate Graduate)</option>
                </select>
              </div>
            </div>

            {/* Cumulative CGPA */}
            <div className="form-group">
              <label className="form-label">Cumulative CGPA (out of 10.0) *</label>
              <div className="input-with-icon">
                <Award size={16} className="input-icon" />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  className="form-input"
                  placeholder="e.g. 8.75"
                  value={cgpa}
                  onChange={(e) => setCgpa(e.target.value)}
                  required
                />
              </div>
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Must match your official university grade transcript</span>
            </div>
          </div>

          {/* Password Fields */}
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Create Password *</label>
              <div className="input-with-icon">
                <Lock size={16} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ paddingRight: '2.5rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '0.75rem', color: '#64748b' }}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              {/* Password strength indicator */}
              {password && (
                <div style={{ marginTop: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: '0.2rem' }}>
                    <span style={{ color: '#94a3b8' }}>Password Security:</span>
                    <strong style={{ color: strength.color }}>{strength.label}</strong>
                  </div>
                  <div className="progress-bar" style={{ height: 4 }}>
                    <div style={{
                      width: `${strength.score}%`,
                      height: '100%',
                      background: strength.color,
                      borderRadius: 9999,
                      transition: 'all 200ms ease'
                    }} />
                  </div>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <div className="input-with-icon">
                <Lock size={16} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Placement Terms & Consent */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-dark)',
            borderRadius: 12,
            padding: '1rem',
            marginBottom: '1.75rem'
          }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.8125rem', color: '#cbd5e1', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={hasConsented}
                onChange={(e) => setHasConsented(e.target.checked)}
                style={{ accentColor: 'var(--violet-primary)', width: 18, height: 18, marginTop: 2, flexShrink: 0 }}
              />
              <span>
                I agree to the university's <strong>Placement Policy</strong>. I understand that accepting an offer during the placement season will lock me from subsequent drives, and that my academic credentials will be verified against official university transcripts.
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.8rem', fontSize: '0.95rem' }}
          >
            Complete Registration & Open Dashboard
            <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.85rem', color: '#94a3b8' }}>
          Already have an active candidate account?{' '}
          <Link to="/signin" style={{ color: 'var(--violet-light)', fontWeight: 600 }}>
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};
