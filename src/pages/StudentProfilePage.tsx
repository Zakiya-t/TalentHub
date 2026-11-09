import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User, 
  Mail, 
  Phone, 
  Globe, 
  GraduationCap, 
  Award, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  Plus, 
  X, 
  Save, 
  RotateCcw, 
  Eye, 
  ShieldCheck, 
  AlertCircle,
  Briefcase,
  Sparkles
} from 'lucide-react';
import { Branch } from '../types';

export const StudentProfilePage: React.FC = () => {
  const { currentStudent, updateCurrentStudent, showToast } = useApp();

  // Form state initialized with current student
  const [name, setName] = useState(currentStudent.name);
  const [email, setEmail] = useState(currentStudent.email);
  const [phone, setPhone] = useState(currentStudent.phone);
  const [usn, setUsn] = useState(currentStudent.usn);
  const [branch, setBranch] = useState<Branch>(currentStudent.branch);
  const [graduationYear, setGraduationYear] = useState(currentStudent.graduationYear);
  const [cgpa, setCgpa] = useState(currentStudent.cgpa.toString());
  const [activeBacklogs, setActiveBacklogs] = useState(currentStudent.activeBacklogs.toString());
  const [clearedBacklogs, setClearedBacklogs] = useState(currentStudent.clearedBacklogs.toString());
  const [bio, setBio] = useState(currentStudent.bio);
  const [linkedin, setLinkedin] = useState(currentStudent.linkedin);
  const [github, setGithub] = useState(currentStudent.github);
  const [visibility, setVisibility] = useState(currentStudent.visibilityPreference);

  // Skills
  const [skills, setSkills] = useState<string[]>([...currentStudent.skills]);
  const [newSkillInput, setNewSkillInput] = useState('');

  // Resume upload simulator state
  const [resumeFileName, setResumeFileName] = useState(currentStudent.resumeFileName);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkillInput.trim() && !skills.includes(newSkillInput.trim())) {
      setSkills([...skills, newSkillInput.trim()]);
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError('');
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setUploadError('Invalid file type: Please upload your resume in PDF format only.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size limit exceeded: Resume PDF must be less than 5 MB.');
      return;
    }

    setIsUploading(true);
    setTimeout(() => {
      setResumeFileName(file.name);
      setIsUploading(false);
      showToast('Resume Uploaded', `Successfully updated active ATS resume: ${file.name}`, 'success');
    }, 800);
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedCgpa = parseFloat(cgpa);
    const parsedActiveBacklogs = parseInt(activeBacklogs) || 0;
    const parsedClearedBacklogs = parseInt(clearedBacklogs) || 0;

    if (isNaN(parsedCgpa) || parsedCgpa < 0 || parsedCgpa > 10) {
      showToast('Validation Error', 'CGPA must be a valid number between 0.00 and 10.00', 'error');
      return;
    }

    updateCurrentStudent({
      name,
      email,
      phone,
      usn,
      branch,
      graduationYear,
      cgpa: parsedCgpa,
      activeBacklogs: parsedActiveBacklogs,
      clearedBacklogs: parsedClearedBacklogs,
      bio,
      linkedin,
      github,
      skills,
      resumeFileName,
      resumeLastUpdated: new Date().toISOString().split('T')[0],
      visibilityPreference: visibility,
      profileCompletionPercentage: 96
    });
  };

  const handleResetToCurrent = () => {
    setName(currentStudent.name);
    setEmail(currentStudent.email);
    setPhone(currentStudent.phone);
    setUsn(currentStudent.usn);
    setBranch(currentStudent.branch);
    setGraduationYear(currentStudent.graduationYear);
    setCgpa(currentStudent.cgpa.toString());
    setActiveBacklogs(currentStudent.activeBacklogs.toString());
    setClearedBacklogs(currentStudent.clearedBacklogs.toString());
    setBio(currentStudent.bio);
    setLinkedin(currentStudent.linkedin);
    setGithub(currentStudent.github);
    setSkills([...currentStudent.skills]);
    setVisibility(currentStudent.visibilityPreference);
    showToast('Changes Reverted', 'Profile form reset to currently saved values.', 'info');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', marginBottom: '0.25rem' }}>Student Profile & ATS Resume</h1>
          <p style={{ fontSize: '0.875rem' }}>Manage your verified academic profile and credentials visible to campus recruiters</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button type="button" onClick={handleResetToCurrent} className="btn btn-outline" style={{ fontSize: '0.85rem' }}>
            <RotateCcw size={15} />
            Discard Changes
          </button>
          <button type="button" onClick={handleSaveAll} className="btn btn-primary" style={{ fontSize: '0.85rem' }}>
            <Save size={15} />
            Save Profile Updates
          </button>
        </div>
      </div>

      {/* Two Column Layout on Desktop */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Left Column: Form Details */}
        <form onSubmit={handleSaveAll} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Card 1: Personal & Contact Information */}
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={18} style={{ color: 'var(--violet-light)' }} />
              Personal & Contact Details
            </h3>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">College Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">USN / University ID</label>
                <input
                  type="text"
                  className="form-input"
                  value={usn}
                  onChange={(e) => setUsn(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Professional Summary & Bio</label>
              <textarea
                className="form-textarea"
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">LinkedIn Profile URL</label>
                <input
                  type="text"
                  className="form-input"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">GitHub Profile URL</label>
                <input
                  type="text"
                  className="form-input"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Card 2: Verified Academic Details */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <GraduationCap size={18} style={{ color: 'var(--lime-light)' }} />
                Academic Standing & Verification
              </h3>
              <span className="badge badge-emerald">Verified by Registrar</span>
            </div>

            <div className="grid-3">
              <div className="form-group">
                <label className="form-label">Department / Branch</label>
                <select
                  className="form-select"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value as Branch)}
                >
                  <option value="CSE">CSE</option>
                  <option value="ISE">ISE</option>
                  <option value="AI & DS">AI & DS</option>
                  <option value="ECE">ECE</option>
                  <option value="EEE">EEE</option>
                  <option value="MECH">MECH</option>
                  <option value="CIVIL">CIVIL</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Graduation Year</label>
                <select
                  className="form-select"
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(Number(e.target.value))}
                >
                  <option value={2026}>2026 (Senior)</option>
                  <option value={2027}>2027</option>
                  <option value={2025}>2025</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Cumulative CGPA</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  className="form-input"
                  value={cgpa}
                  onChange={(e) => setCgpa(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Active Backlogs (Live Arrears)</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  className="form-input"
                  value={activeBacklogs}
                  onChange={(e) => setActiveBacklogs(e.target.value)}
                />
                <span style={{ fontSize: '0.7rem', color: '#f87171' }}>
                  Only active backlogs affect campus drive eligibility
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">Cleared Backlogs (Past Arrears)</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  className="form-input"
                  value={clearedBacklogs}
                  onChange={(e) => setClearedBacklogs(e.target.value)}
                />
                <span style={{ fontSize: '0.7rem', color: 'var(--status-emerald)' }}>
                  Rule: Cleared backlogs do not disqualify you from drives
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Skills & Technical Competencies */}
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={18} style={{ color: 'var(--violet-light)' }} />
              Technical Skills & Tags
            </h3>

            {/* Current Skills Chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
              {skills.map((skill) => (
                <span
                  key={skill}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    background: '#090d16',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    color: '#c7d2fe',
                    padding: '0.35rem 0.75rem',
                    borderRadius: 8,
                    fontSize: '0.8125rem',
                    fontWeight: 600
                  }}
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    style={{ color: '#64748b', display: 'flex', alignItems: 'center' }}
                    aria-label={`Remove skill ${skill}`}
                  >
                    <X size={13} />
                  </button>
                </span>
              ))}
            </div>

            {/* Add Skill Tag Input */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Add a skill (e.g. Kubernetes, Rust, System Design)..."
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (newSkillInput.trim() && !skills.includes(newSkillInput.trim())) {
                      setSkills([...skills, newSkillInput.trim()]);
                      setNewSkillInput('');
                    }
                  }
                }}
              />
              <button
                type="button"
                onClick={() => {
                  if (newSkillInput.trim() && !skills.includes(newSkillInput.trim())) {
                    setSkills([...skills, newSkillInput.trim()]);
                    setNewSkillInput('');
                  }
                }}
                className="btn btn-secondary"
                style={{ flexShrink: 0 }}
              >
                <Plus size={16} />
                Add
              </button>
            </div>
          </div>

          {/* Card 4: Projects & Experience Overview */}
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Briefcase size={18} style={{ color: 'var(--lime-light)' }} />
              Projects & Internships
            </h3>

            {currentStudent.projects.map((proj) => (
              <div
                key={proj.id}
                style={{
                  background: '#090d16',
                  border: '1px solid var(--border-dark)',
                  borderRadius: 12,
                  padding: '1rem',
                  marginBottom: '0.75rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <strong style={{ color: '#ffffff', fontSize: '0.95rem' }}>{proj.title}</strong>
                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    {proj.tech.map((t) => (
                      <span key={t} className="badge badge-neutral" style={{ fontSize: '0.68rem' }}>{t}</span>
                    ))}
                  </div>
                </div>
                <p style={{ fontSize: '0.8125rem', marginTop: '0.4rem', color: '#cbd5e1' }}>{proj.description}</p>
              </div>
            ))}
          </div>
        </form>

        {/* Right Column: Resume Upload, ATS Preview & Preferences */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Resume Upload Card */}
          <div className="card card-accent">
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={18} style={{ color: 'var(--violet-light)' }} />
              Active ATS Resume
            </h3>
            <p style={{ fontSize: '0.8125rem', marginBottom: '1.25rem' }}>
              This document is shared with companies upon submitting drive applications.
            </p>

            {/* Current Resume Metadata Preview */}
            <div style={{
              background: '#090d16',
              border: '1px solid var(--border-dark)',
              borderRadius: 14,
              padding: '1.25rem',
              marginBottom: '1.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.75rem' }}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: 'rgba(99, 102, 241, 0.15)',
                  color: 'var(--violet-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FileText size={22} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#ffffff', wordBreak: 'break-all' }}>
                    {resumeFileName}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                    PDF Format • 1.4 MB • Updated {currentStudent.resumeLastUpdated}
                  </div>
                </div>
              </div>

              {/* ATS Score Indicator */}
              <div style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: 8,
                padding: '0.6rem 0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#a7f3d0' }}>
                  <Sparkles size={14} />
                  <span>TalentHub ATS Parse Score</span>
                </div>
                <strong style={{ color: 'var(--lime-light)', fontSize: '0.9rem' }}>
                  {currentStudent.resumeAtsScore}/100
                </strong>
              </div>
            </div>

            {/* Upload Drag & Drop Area */}
            <label style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px dashed var(--border-dark)',
              borderRadius: 14,
              padding: '1.5rem',
              textAlign: 'center',
              cursor: 'pointer',
              background: 'rgba(255, 255, 255, 0.01)',
              transition: 'all 150ms ease'
            }}>
              <UploadCloud size={28} style={{ color: 'var(--violet-light)', marginBottom: '0.5rem' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff' }}>
                {isUploading ? 'Validating & Uploading...' : 'Upload New Resume PDF'}
              </span>
              <span style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.2rem' }}>
                PDF only, max 5 MB (Auto ATS parsing)
              </span>
              <input
                type="file"
                accept=".pdf"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
                disabled={isUploading}
              />
            </label>

            {uploadError && (
              <div style={{ fontSize: '0.75rem', color: '#f87171', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <AlertCircle size={13} />
                <span>{uploadError}</span>
              </div>
            )}
          </div>

          {/* Visibility Preferences */}
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Eye size={18} style={{ color: 'var(--lime-light)' }} />
              Recruiter Visibility Preferences
            </h3>
            <p style={{ fontSize: '0.8125rem', marginBottom: '1rem' }}>
              Control who can discover your candidate profile in campus talent searches.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { id: 'All Recruiters', label: 'All Registered Enterprise Recruiters', desc: 'Allows companies visiting campus to preview your profile and extend interview invites.' },
                { id: 'Only Eligible Drives', label: 'Only Drives Where I am Fully Eligible', desc: 'Hides your profile from recruiters if your CGPA or branch does not match their criteria.' },
                { id: 'Anonymous until Interview', label: 'Anonymized until Shortlisted', desc: 'Only displays anonymized stats (GPA, skills) until the recruiter shortlists you.' }
              ].map((opt) => (
                <label
                  key={opt.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    background: visibility === opt.id ? 'rgba(99, 102, 241, 0.08)' : '#090d16',
                    border: visibility === opt.id ? '1px solid var(--violet-primary)' : '1px solid var(--border-dark)',
                    borderRadius: 10,
                    padding: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="radio"
                    name="visibility"
                    checked={visibility === opt.id}
                    onChange={() => setVisibility(opt.id as any)}
                    style={{ accentColor: 'var(--violet-primary)', marginTop: 2 }}
                  />
                  <div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#ffffff' }}>{opt.label}</div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.15rem' }}>{opt.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          div[style*="grid-template-columns: 2fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
