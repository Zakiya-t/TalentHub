import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  Briefcase, 
  FileText, 
  Calendar, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  Building, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

export const StudentDashboardPage: React.FC = () => {
  const { currentStudent, jobs, applications, interviews, offers, checkEligibility } = useApp();
  const navigate = useNavigate();

  // Metrics calculation
  const myApplications = applications.filter((a) => a.studentId === currentStudent.id);
  const eligibleJobs = jobs.filter((j) => checkEligibility(currentStudent, j).isEligible);
  const upcomingInterviews = interviews.filter((i) => i.studentId === currentStudent.id && i.status === 'Scheduled');
  const myOffers = offers.filter((o) => o.studentId === currentStudent.id);

  // Recommended jobs (eligible jobs where student hasn't applied yet)
  const appliedJobIds = new Set(myApplications.map((a) => a.jobId));
  const recommendedJobs = eligibleJobs.filter((j) => !appliedJobIds.has(j.id)).slice(0, 3);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(132, 204, 22, 0.08)), #0e1526',
        border: '1px solid var(--border-dark)',
        borderRadius: 20,
        padding: '2rem 2.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--lime-light)', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            <Sparkles size={14} />
            <span>Placement Season 2025–2026 Active</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.4rem)', marginBottom: '0.4rem' }}>
            Welcome back, {currentStudent.name}!
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '0.925rem' }}>
            {currentStudent.branch} Engineering • CGPA: <strong>{currentStudent.cgpa.toFixed(2)}</strong> • USN: {currentStudent.usn}
          </p>
        </div>

        {/* Profile Completion Meter */}
        <div style={{
          background: '#090d16',
          border: '1px solid var(--border-dark)',
          borderRadius: 14,
          padding: '1.25rem',
          minWidth: 260
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#e2e8f0' }}>Profile Readiness</span>
            <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--lime-light)' }}>
              {currentStudent.profileCompletionPercentage}%
            </span>
          </div>
          <div className="progress-bar" style={{ height: 8, marginBottom: '0.5rem' }}>
            <div className="progress-fill" style={{ width: `${currentStudent.profileCompletionPercentage}%` }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Verified ATS Resume attached</span>
            <Link to="/profile" style={{ fontSize: '0.75rem', color: 'var(--violet-light)', fontWeight: 600 }}>
              Edit Profile →
            </Link>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid-4">
        <Link to="/jobs?tab=eligible" className="card card-hover card-accent" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#94a3b8' }}>Eligible Drives</span>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--violet-bg)', color: 'var(--violet-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Briefcase size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-heading)' }}>
            {eligibleJobs.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--lime-light)', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <CheckCircle2 size={13} />
            <span>Passed all CGPA & Branch checks</span>
          </div>
        </Link>

        <Link to="/applications" className="card card-hover" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#94a3b8' }}>Applications Submitted</span>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(56, 189, 248, 0.12)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-heading)' }}>
            {myApplications.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.35rem' }}>
            {myApplications.filter(a => a.status === 'Shortlisted').length} in active review
          </div>
        </Link>

        <Link to="/interviews" className="card card-hover" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#94a3b8' }}>Upcoming Interviews</span>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(245, 158, 11, 0.12)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-heading)' }}>
            {upcomingInterviews.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#fbbf24', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Clock size={13} />
            <span>Next: Tomorrow 11:00 AM</span>
          </div>
        </Link>

        <Link to="/offers" className="card card-hover card-lime" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#94a3b8' }}>Official Offers</span>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--lime-bg)', color: 'var(--lime-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--lime-light)', fontFamily: 'var(--font-heading)' }}>
            {myOffers.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--status-emerald)', marginTop: '0.35rem' }}>
            {currentStudent.hasAcceptedOffer ? '1 Accepted (Locked)' : 'Action required (Pending)'}
          </div>
        </Link>
      </div>

      {/* Main Grid: Recommended Opportunities & Right Sidebar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '2rem' }}>
        {/* Left Column: Recommended Jobs & Recent Activity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Recommended Jobs */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem' }}>Recommended for Your Profile</h3>
                <p style={{ fontSize: '0.8125rem' }}>Matching your skills in {currentStudent.skills.slice(0, 3).join(', ')}</p>
              </div>
              <Link to="/jobs" className="btn btn-outline" style={{ fontSize: '0.78rem', padding: '0.4rem 0.85rem' }}>
                View All ({jobs.length})
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {recommendedJobs.map((job) => (
                <div
                  key={job.id}
                  style={{
                    background: '#090d16',
                    border: '1px solid var(--border-dark)',
                    borderRadius: 14,
                    padding: '1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: job.companyColor,
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '1.15rem'
                    }}>
                      {job.companyLogo}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1rem', color: '#ffffff' }}>{job.title}</h4>
                      <div style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>
                        {job.companyName} • {job.location} ({job.workMode})
                      </div>
                      <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.4rem' }}>
                        <span className="badge badge-lime">₹{job.packageLPA} LPA</span>
                        <span className="badge badge-neutral">Min CGPA: {job.minCgpa}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.6rem' }}>
                    <Link to={`/jobs/${job.id}`} className="btn btn-primary" style={{ fontSize: '0.8125rem', padding: '0.45rem 1rem' }}>
                      Check & Apply
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Application Activity */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.25rem' }}>Recent Application Status</h3>
              <Link to="/applications" style={{ fontSize: '0.8125rem', color: 'var(--violet-light)', fontWeight: 600 }}>
                View Full Tracking →
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {myApplications.map((app) => (
                <div
                  key={app.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1rem',
                    background: '#090d16',
                    border: '1px solid var(--border-dark)',
                    borderRadius: 12
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#ffffff' }}>{app.companyName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{app.jobTitle} • Applied {app.appliedDate}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span className={`badge ${
                      app.status === 'Offered' ? 'badge-lime' :
                      app.status === 'Interview Scheduled' ? 'badge-amber' :
                      app.status === 'Shortlisted' ? 'badge-sky' : 'badge-neutral'
                    }`}>
                      {app.status}
                    </span>
                    <Link to="/applications" style={{ color: '#64748b' }}>
                      <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Upcoming Interview & Career Readiness Checklist */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Upcoming Interview Highlight */}
          <div className="card card-accent">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Calendar size={18} style={{ color: 'var(--violet-light)' }} />
              <h3 style={{ fontSize: '1.15rem' }}>Next Scheduled Interview</h3>
            </div>

            {upcomingInterviews.length > 0 ? (
              <div>
                <div style={{
                  background: '#090d16',
                  border: '1px solid var(--border-dark)',
                  borderRadius: 12,
                  padding: '1.25rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#ffffff', marginBottom: '0.25rem' }}>
                    {upcomingInterviews[0].companyName}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--violet-light)', fontWeight: 600, marginBottom: '0.75rem' }}>
                    {upcomingInterviews[0].roundTitle}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <div>📅 {upcomingInterviews[0].date} ({upcomingInterviews[0].time})</div>
                    <div>👤 Interviewer: {upcomingInterviews[0].interviewerName}</div>
                    <div>🔗 Format: {upcomingInterviews[0].venue}</div>
                  </div>
                </div>

                <Link to="/interviews" className="btn btn-primary" style={{ width: '100%', fontSize: '0.85rem' }}>
                  Open Interview Dossier & Notes
                  <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '1.5rem', color: '#94a3b8', fontSize: '0.85rem' }}>
                No pending interviews scheduled today.
              </div>
            )}
          </div>

          {/* Career Readiness Checklist */}
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Career Readiness Checklist</h3>
            <p style={{ fontSize: '0.8125rem', marginBottom: '1.25rem' }}>
              Institutional placement credentials
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {[
                { title: 'Academic CGPA Verified', desc: '8.75 CGPA validated by Registrar Office', done: true },
                { title: 'Zero Active Backlogs', desc: 'Active backlogs: 0 (Cleared: 1)', done: true },
                { title: 'ATS Resume Scored', desc: `Resume score: ${currentStudent.resumeAtsScore}/100`, done: true },
                { title: 'Placement Policy Signed', desc: 'Single-offer rule accepted', done: true },
                { title: 'Technical Mock Interview', desc: 'Completed algorithm mock assessment', done: true },
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <CheckCircle2 size={18} style={{ color: item.done ? 'var(--status-emerald)' : '#64748b', marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff' }}>{item.title}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-dark)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <Link to="/jobs" className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.5rem' }}>
                Browse Drives
              </Link>
              <Link to="/profile" className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.5rem' }}>
                Update Resume
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          div[style*="grid-template-columns: 1.8fr 1.2fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
