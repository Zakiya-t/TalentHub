import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, 
  Bookmark, 
  MapPin, 
  Briefcase, 
  Calendar, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ShieldCheck, 
  Share2, 
  FileText, 
  Send, 
  Building2, 
  Globe, 
  Users, 
  Sparkles,
  Info
} from 'lucide-react';

export const JobDetailsPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { 
    jobs, 
    currentStudent, 
    applications, 
    savedJobIds, 
    toggleSaveJob, 
    checkEligibility, 
    applyForJob 
  } = useApp();

  const [showApplyModal, setShowApplyModal] = useState(false);
  const [resumeConfirmed, setResumeConfirmed] = useState(true);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Locate the job listing (fallback to first job if not found)
  const job = jobs.find((j) => j.id === jobId) || jobs[0];
  const isSaved = savedJobIds.includes(job.id);

  // Check if student already applied for this job or company
  const existingApplication = applications.find(
    (app) => app.studentId === currentStudent.id && app.companyId === job.companyId
  );
  const alreadyApplied = Boolean(existingApplication);

  // Real-time eligibility evaluation
  const eligibility = checkEligibility(currentStudent, job);

  const handleApplyConfirm = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const res = applyForJob(job.id);
      setShowApplyModal(false);
      if (res.success) {
        navigate('/applications');
      }
    }, 700);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Breadcrumb & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8', fontSize: '0.875rem', fontWeight: 600 }}>
          <ArrowLeft size={16} />
          Back to All Opportunities
        </Link>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => toggleSaveJob(job.id)}
            className="btn btn-outline"
            style={{ fontSize: '0.8125rem', color: isSaved ? 'var(--lime-light)' : '#cbd5e1' }}
          >
            <Bookmark size={15} fill={isSaved ? 'var(--lime-light)' : 'none'} />
            {isSaved ? 'Bookmarked' : 'Save Drive'}
          </button>
        </div>
      </div>

      {/* Main Job Banner Card */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(14, 21, 38, 0.95)), #0e1526',
        borderTop: `4px solid ${job.companyColor}`,
        padding: '2.25rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
            <div style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: job.companyColor,
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.65rem',
              boxShadow: `0 8px 20px ${job.companyColor}40`
            }}>
              {job.companyLogo}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '1rem', color: '#cbd5e1', fontWeight: 600 }}>{job.companyName}</span>
                <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>{job.roleCategory}</span>
                {!job.isOpen && <span className="badge badge-rose">Drive Closed</span>}
              </div>
              <h1 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)', color: '#ffffff', marginBottom: '0.4rem' }}>
                {job.title}
              </h1>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', fontSize: '0.85rem', color: '#94a3b8' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <MapPin size={15} /> {job.location} ({job.workMode})
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Briefcase size={15} /> {job.type}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Clock size={15} /> Deadline: {job.deadline}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Users size={15} /> {job.vacancies} Campus Vacancies
                </span>
              </div>
            </div>
          </div>

          {/* CTC Compensation Highlight & Apply Trigger */}
          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Total Cost to Company</span>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--lime-light)', fontFamily: 'var(--font-heading)', lineHeight: 1.1 }}>
                ₹{job.packageLPA} LPA
              </div>
              {job.baseSalaryLPA && (
                <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
                  Base: ₹{job.baseSalaryLPA} LPA + Bonus: ₹{job.performanceBonusLPA || 0} LPA
                </div>
              )}
            </div>

            {/* Primary Action Button State */}
            {alreadyApplied ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', padding: '0.6rem 1.25rem', borderRadius: 10, border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <CheckCircle2 size={18} style={{ color: 'var(--status-emerald)' }} />
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#34d399' }}>
                  Application Submitted ({existingApplication?.status || 'Active'})
                </span>
              </div>
            ) : !job.isOpen ? (
              <button disabled className="btn btn-secondary" style={{ opacity: 0.6 }}>
                Recruitment Drive Closed
              </button>
            ) : eligibility.isEligible ? (
              <button
                onClick={() => setShowApplyModal(true)}
                className="btn btn-lime"
                style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}
              >
                Apply Now for this Drive
                <Send size={16} />
              </button>
            ) : (
              <button
                disabled
                className="btn btn-secondary"
                title={eligibility.primaryIneligibilityReason}
                style={{ opacity: 0.6 }}
              >
                Ineligible to Apply
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.9fr 1.1fr', gap: '2rem' }}>
        {/* Left Column: Job Description, Skills, Perks, Recruitment Rounds */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Section: Overview & Responsibilities */}
          <div className="card">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Role Description</h3>
            <p style={{ fontSize: '0.925rem', lineHeight: 1.7, color: '#cbd5e1', marginBottom: '1.5rem' }}>
              {job.description}
            </p>

            <h4 style={{ fontSize: '1.05rem', color: '#ffffff', marginBottom: '0.75rem' }}>Key Responsibilities</h4>
            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: '#cbd5e1' }}>
              {job.responsibilities.map((resp, idx) => (
                <li key={idx}>{resp}</li>
              ))}
            </ul>

            <h4 style={{ fontSize: '1.05rem', color: '#ffffff', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
              Candidate Requirements
            </h4>
            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: '#cbd5e1' }}>
              {job.requirements.map((req, idx) => (
                <li key={idx}>{req}</li>
              ))}
            </ul>
          </div>

          {/* Section: Required Skills */}
          <div className="card">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Required Technical Skills</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {job.skillsRequired.map((skill) => {
                const studentHasSkill = currentStudent.skills.includes(skill);
                return (
                  <span
                    key={skill}
                    className={`badge ${studentHasSkill ? 'badge-lime' : 'badge-neutral'}`}
                    style={{ fontSize: '0.8125rem', padding: '0.4rem 0.85rem' }}
                  >
                    {studentHasSkill && <CheckCircle2 size={13} />}
                    {skill}
                    {studentHasSkill && <span style={{ fontSize: '0.68rem', opacity: 0.8 }}>(Matched)</span>}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Section: Recruitment Rounds Timeline */}
          <div className="card">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Campus Recruitment Rounds</h3>
            <p style={{ fontSize: '0.8125rem', marginBottom: '1.25rem' }}>
              Sequential multi-stage evaluation schedule for this drive
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {job.rounds.map((round) => (
                <div
                  key={round.roundNumber}
                  style={{
                    background: '#090d16',
                    border: '1px solid var(--border-dark)',
                    borderRadius: 12,
                    padding: '1.1rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1rem'
                  }}
                >
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: 'var(--violet-bg)',
                    color: 'var(--violet-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    flexShrink: 0
                  }}>
                    R{round.roundNumber}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ color: '#ffffff', fontSize: '0.95rem' }}>{round.title}</strong>
                      <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                        Tentative: {round.tentativeDate}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.8125rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                      {round.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Perks & Benefits */}
          <div className="card">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Perks & Compensation Benefits</h3>
            <div className="grid-2">
              {job.perks.map((perk, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#cbd5e1' }}>
                  <Sparkles size={16} style={{ color: 'var(--lime-light)', flexShrink: 0 }} />
                  <span>{perk}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Eligibility Engine & Company Profile */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* THE LIVE ELIGIBILITY CHECKLIST */}
          <div className="card card-accent" style={{ background: '#0d1424' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={20} style={{ color: eligibility.isEligible ? 'var(--status-emerald)' : 'var(--status-rose)' }} />
                Eligibility Verification
              </h3>
              <span className={`badge ${eligibility.isEligible ? 'badge-emerald' : 'badge-rose'}`}>
                {eligibility.overallStatus}
              </span>
            </div>

            <p style={{ fontSize: '0.8125rem', marginBottom: '1.25rem', color: '#94a3b8' }}>
              Automated institutional rules evaluated for <strong>{currentStudent.name}</strong> ({currentStudent.branch}, CGPA: {currentStudent.cgpa.toFixed(2)})
            </p>

            {/* Checklist items with clear understandable explanations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {eligibility.reasons.map((r, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#090d16',
                    border: `1px solid ${r.isMet ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.25)'}`,
                    borderRadius: 10,
                    padding: '0.85rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#ffffff' }}>
                      {r.criterion}
                    </span>
                    {r.isMet ? (
                      <span style={{ fontSize: '0.72rem', color: 'var(--status-emerald)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <CheckCircle2 size={13} />
                        Satisfied
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.72rem', color: 'var(--status-rose)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <XCircle size={13} />
                        Disqualified
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.78rem', color: r.isMet ? '#cbd5e1' : '#fca5a5', lineHeight: 1.4 }}>
                    {r.explanation}
                  </p>
                </div>
              ))}
            </div>

            {/* Ineligibility Warning or Ready to Apply Banner */}
            {!eligibility.isEligible ? (
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                borderRadius: 10,
                padding: '0.85rem',
                marginTop: '1.25rem',
                display: 'flex',
                gap: '0.6rem'
              }}>
                <AlertCircle size={18} style={{ color: '#ef4444', flexShrink: 0, marginTop: 2 }} />
                <div style={{ fontSize: '0.78rem', color: '#fca5a5' }}>
                  <strong>Why you cannot apply:</strong> {eligibility.primaryIneligibilityReason}. University placement policies prevent submissions for disqualified drives.
                </div>
              </div>
            ) : alreadyApplied ? (
              <div style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: 10,
                padding: '0.85rem',
                marginTop: '1.25rem',
                display: 'flex',
                gap: '0.6rem'
              }}>
                <CheckCircle2 size={18} style={{ color: 'var(--status-emerald)', flexShrink: 0, marginTop: 2 }} />
                <div style={{ fontSize: '0.78rem', color: '#a7f3d0' }}>
                  You have already submitted an active application for this company. Duplicate applications within the same placement season are prohibited.
                </div>
              </div>
            ) : (
              <div style={{
                background: 'rgba(132, 204, 22, 0.1)',
                border: '1px solid rgba(132, 204, 22, 0.25)',
                borderRadius: 10,
                padding: '0.85rem',
                marginTop: '1.25rem',
                display: 'flex',
                gap: '0.6rem'
              }}>
                <CheckCircle2 size={18} style={{ color: 'var(--lime-primary)', flexShrink: 0, marginTop: 2 }} />
                <div style={{ fontSize: '0.78rem', color: '#bef264' }}>
                  <strong>All criteria met!</strong> Your academic standing qualifies for this drive. Submissions will transmit your active ATS resume directly to the recruiter.
                </div>
              </div>
            )}
          </div>

          {/* Company Information Card */}
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building2 size={18} style={{ color: 'var(--violet-light)' }} />
              About {job.companyName}
            </h3>

            <div style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              ApexCloud builds planetary-scale multi-cloud deployment meshes serving Fortune 500 enterprises across 40 countries.
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.8125rem', color: '#94a3b8' }}>
              <div>🏢 Industry: <strong style={{ color: '#ffffff' }}>Cloud Infrastructure & SaaS</strong></div>
              <div>📍 Locations: <strong style={{ color: '#ffffff' }}>Bengaluru / Hyderabad</strong></div>
              <div>👥 Campus Hiring Quota: <strong style={{ color: '#ffffff' }}>18 Engineers</strong></div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Confirmation Modal */}
      {showApplyModal && (
        <div className="modal-overlay" onClick={() => setShowApplyModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Confirm Drive Application</h3>
            <p style={{ fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              You are applying to <strong>{job.companyName}</strong> for <strong>{job.title}</strong> (CTC: ₹{job.packageLPA} LPA).
            </p>

            {/* Attached Resume confirmation */}
            <div style={{
              background: '#090d16',
              border: '1px solid var(--border-dark)',
              borderRadius: 12,
              padding: '1rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FileText size={20} style={{ color: 'var(--violet-light)' }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#ffffff' }}>{currentStudent.resumeFileName}</div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>ATS Verified • Score: {currentStudent.resumeAtsScore}/100</div>
                </div>
              </div>
              <span className="badge badge-emerald">Attached</span>
            </div>

            {/* Declaration terms */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-dark)',
              borderRadius: 12,
              padding: '1rem',
              marginBottom: '1.5rem'
            }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.8125rem', color: '#cbd5e1', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={termsAgreed}
                  onChange={(e) => setTermsAgreed(e.target.checked)}
                  style={{ accentColor: 'var(--violet-primary)', width: 17, height: 17, marginTop: 2, flexShrink: 0 }}
                />
                <span>
                  I declare that my academic details (CGPA {currentStudent.cgpa.toFixed(2)}, {currentStudent.activeBacklogs} active backlogs) are accurate and I commit to attending all scheduled assessment and interview rounds.
                </span>
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setShowApplyModal(false)}
                className="btn btn-outline"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyConfirm}
                className="btn btn-primary"
                disabled={!termsAgreed || isSubmitting}
              >
                {isSubmitting ? 'Transmitting Application...' : 'Submit Official Application'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          div[style*="grid-template-columns: 1.9fr 1.1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
