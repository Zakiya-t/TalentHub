import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Briefcase, 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Award, 
  Clock, 
  ToggleLeft, 
  ToggleRight, 
  ArrowRight, 
  UserCheck, 
  Send,
  Building,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Application, ApplicationStatus, JobListing } from '../types';

export const RecruiterWorkspacePage: React.FC = () => {
  const { 
    jobs, 
    applications, 
    updateApplicationStatus, 
    scheduleInterview, 
    issueOffer, 
    createJob, 
    toggleJobStatus,
    showToast
  } = useApp();

  // Company identity for current recruiter view: ApexCloud Technologies
  const recruiterCompanyId = 'comp_apex';
  const myCompanyJobs = jobs.filter((j) => j.companyId === recruiterCompanyId);

  // Selected job for candidate management (defaults to first job)
  const [selectedJobId, setSelectedJobId] = useState<string>(myCompanyJobs[0]?.id || 'job_apex_01');
  const [stageFilter, setStageFilter] = useState<string>('ALL');
  const [candidateSearch, setCandidateSearch] = useState('');

  // Modals state
  const [showCreateJobModal, setShowCreateJobModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState<Application | null>(null);
  const [showIssueOfferModal, setShowIssueOfferModal] = useState<Application | null>(null);

  // Create Job Form State
  const [newTitle, setNewTitle] = useState('');
  const [newPackage, setNewPackage] = useState('22.0');
  const [newMinCgpa, setNewMinCgpa] = useState('8.0');
  const [newLocation, setNewLocation] = useState('Bengaluru');
  const [newWorkMode, setNewWorkMode] = useState<'Hybrid' | 'On-site' | 'Remote'>('Hybrid');
  const [newVacancies, setNewVacancies] = useState('15');
  const [newDeadline, setNewDeadline] = useState('2026-11-20');

  // Schedule Interview Form State
  const [intDate, setIntDate] = useState('2026-10-15');
  const [intTime, setIntTime] = useState('02:00 PM - 03:00 PM IST');
  const [intRound, setIntRound] = useState(2);
  const [intRoundTitle, setIntRoundTitle] = useState('Technical Round 2: System Design');
  const [intInterviewer, setIntInterviewer] = useState('Arvind Swaminathan (Lead SRE)');
  const [intLink, setIntLink] = useState('https://meet.google.com/recruiter-apex-demo');

  // Issue Offer Form State
  const [offerPackage, setOfferPackage] = useState('24.0');
  const [offerBase, setOfferBase] = useState('19.5');
  const [offerBonus, setOfferBonus] = useState('4.5');
  const [offerDeadline, setOfferDeadline] = useState('2026-10-25');

  // Filter candidates for selected job
  const jobApplications = applications.filter((a) => a.jobId === selectedJobId);
  const filteredCandidates = jobApplications.filter((app) => {
    if (stageFilter !== 'ALL' && app.status !== stageFilter) return false;
    if (candidateSearch.trim()) {
      const q = candidateSearch.toLowerCase();
      return (
        app.studentName.toLowerCase().includes(q) ||
        app.studentUsn.toLowerCase().includes(q) ||
        app.studentBranch.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const selectedJob = jobs.find((j) => j.id === selectedJobId);

  const handleCreateJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    createJob({
      companyId: recruiterCompanyId,
      companyName: 'ApexCloud Technologies',
      companyLogo: 'AC',
      companyColor: '#6366f1',
      title: newTitle,
      packageLPA: parseFloat(newPackage) || 18,
      minCgpa: parseFloat(newMinCgpa) || 7.5,
      location: newLocation,
      workMode: newWorkMode,
      vacancies: parseInt(newVacancies) || 10,
      deadline: newDeadline
    });

    setShowCreateJobModal(false);
    setNewTitle('');
  };

  const handleConfirmSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showScheduleModal) return;

    scheduleInterview({
      applicationId: showScheduleModal.id,
      jobId: showScheduleModal.jobId,
      studentId: showScheduleModal.studentId,
      studentName: showScheduleModal.studentName,
      companyId: showScheduleModal.companyId,
      companyName: showScheduleModal.companyName,
      jobTitle: showScheduleModal.jobTitle,
      roundNumber: intRound,
      roundTitle: intRoundTitle,
      date: intDate,
      time: intTime,
      durationMinutes: 60,
      interviewerName: intInterviewer,
      interviewerTitle: 'Staff Architect, ApexCloud',
      meetingLink: intLink,
      venue: 'Google Meet Virtual Video Call',
      status: 'Scheduled',
      notes: 'Evaluates systems concurrency and operational incident handling',
      studentChecklistCompleted: false
    });

    setShowScheduleModal(null);
  };

  const handleConfirmOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showIssueOfferModal) return;

    const res = issueOffer({
      applicationId: showIssueOfferModal.id,
      jobId: showIssueOfferModal.jobId,
      studentId: showIssueOfferModal.studentId,
      studentName: showIssueOfferModal.studentName,
      companyId: showIssueOfferModal.companyId,
      companyName: showIssueOfferModal.companyName,
      jobTitle: showIssueOfferModal.jobTitle,
      packageLPA: parseFloat(offerPackage) || 24,
      baseSalaryLPA: parseFloat(offerBase) || 20,
      retentionBonusLPA: parseFloat(offerBonus) || 4,
      location: 'Bengaluru (Hybrid)',
      offerDate: new Date().toISOString().split('T')[0],
      acceptanceDeadline: offerDeadline,
      letterUrl: '/documents/ApexCloud_Formal_Offer.pdf',
      termsSummary: 'Includes health cover (₹10L), relocation assistance, and home office grant.',
      policyWarningNotice: 'Season placement rule applies upon formal acceptance.'
    });

    if (res.success) {
      setShowIssueOfferModal(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header Bar */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(11, 15, 25, 0.95)), #0e1526',
        border: '1px solid var(--border-dark)',
        borderRadius: 20,
        padding: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: 60,
            height: 60,
            borderRadius: 16,
            background: '#6366f1',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1.5rem'
          }}>
            AC
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="badge badge-violet">Enterprise Recruiter Suite</span>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Campus Drive Portal</span>
            </div>
            <h1 style={{ fontSize: '1.75rem', marginTop: '0.2rem', marginBottom: '0.2rem' }}>
              ApexCloud Technologies
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
              Logged in as: <strong>Deepak Narayanan</strong> (Head of University Talent)
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowCreateJobModal(true)}
          className="btn btn-lime"
          style={{ padding: '0.65rem 1.25rem', fontSize: '0.875rem' }}
        >
          <Plus size={16} />
          Publish New Campus Drive
        </button>
      </div>

      {/* Recruiter Job Listings Selector */}
      <div className="card" style={{ background: '#0d1322' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h3 style={{ fontSize: '1.15rem' }}>Active Recruitment Drives ({myCompanyJobs.length})</h3>
          <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Select a drive to manage its candidate applicant funnel</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
          {myCompanyJobs.map((j) => {
            const isSelected = j.id === selectedJobId;
            const appCount = applications.filter((a) => a.jobId === j.id).length;

            return (
              <div
                key={j.id}
                onClick={() => setSelectedJobId(j.id)}
                style={{
                  background: isSelected ? 'rgba(99, 102, 241, 0.12)' : '#090d16',
                  border: isSelected ? '2px solid var(--violet-primary)' : '1px solid var(--border-dark)',
                  borderRadius: 14,
                  padding: '1.25rem',
                  cursor: 'pointer',
                  transition: 'all 150ms ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h4 style={{ fontSize: '1rem', color: '#ffffff' }}>{j.title}</h4>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleJobStatus(j.id);
                    }}
                    style={{ fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                    title="Toggle open/closed"
                  >
                    {j.isOpen ? (
                      <span className="badge badge-emerald">OPEN</span>
                    ) : (
                      <span className="badge badge-rose">CLOSED</span>
                    )}
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: '#94a3b8', marginTop: '0.5rem' }}>
                  <span>Package: <strong style={{ color: 'var(--lime-light)' }}>₹{j.packageLPA} LPA</strong></span>
                  <span>Applicants: <strong style={{ color: '#ffffff' }}>{appCount}</strong></span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.35rem' }}>
                  Min CGPA: {j.minCgpa} • Closes: {j.deadline}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Job Funnel & Candidate Table */}
      {selectedJob && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem' }}>Candidate Funnel: {selectedJob.title}</h3>
              <p style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>
                Review, shortlist, interview, and extend official offers to qualified senior candidates
              </p>
            </div>

            {/* Stage filter pills */}
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
              {['ALL', 'Applied', 'Shortlisted', 'Interview Scheduled', 'Interviewed', 'Offered', 'Rejected'].map((stg) => (
                <button
                  key={stg}
                  onClick={() => setStageFilter(stg)}
                  className={`btn ${stageFilter === stg ? 'btn-primary' : 'btn-outline'}`}
                  style={{ fontSize: '0.72rem', padding: '0.3rem 0.65rem' }}
                >
                  {stg} ({stg === 'ALL' ? jobApplications.length : jobApplications.filter(a => a.status === stg).length})
                </button>
              ))}
            </div>
          </div>

          {/* Search bar */}
          <div className="input-with-icon" style={{ maxWidth: 380, marginBottom: '1.25rem' }}>
            <Search size={15} className="input-icon" />
            <input
              type="text"
              className="form-input"
              placeholder="Search candidate by name, USN, or branch..."
              value={candidateSearch}
              onChange={(e) => setCandidateSearch(e.target.value)}
            />
          </div>

          {/* Candidate Table */}
          {filteredCandidates.length > 0 ? (
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Candidate</th>
                    <th>Branch</th>
                    <th>CGPA</th>
                    <th>Application Date</th>
                    <th>Current Status</th>
                    <th>Recruiter Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCandidates.map((cand) => (
                    <tr key={cand.id}>
                      <td>
                        <strong style={{ color: '#ffffff' }}>{cand.studentName}</strong>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{cand.studentUsn} • {cand.studentEmail}</div>
                      </td>
                      <td>
                        <span className="badge badge-neutral">{cand.studentBranch}</span>
                      </td>
                      <td>
                        <strong style={{ color: cand.studentCgpa >= selectedJob.minCgpa ? 'var(--status-emerald)' : '#f87171' }}>
                          {cand.studentCgpa.toFixed(2)}
                        </strong>
                      </td>
                      <td>{cand.appliedDate}</td>
                      <td>
                        <span className={`badge ${
                          cand.status === 'Offered' ? 'badge-lime' :
                          cand.status === 'Interview Scheduled' ? 'badge-amber' :
                          cand.status === 'Interviewed' ? 'badge-sky' :
                          cand.status === 'Shortlisted' ? 'badge-violet' :
                          cand.status === 'Rejected' ? 'badge-rose' : 'badge-neutral'
                        }`}>
                          {cand.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                          {/* Shortlist action if currently Applied */}
                          {cand.status === 'Applied' && (
                            <button
                              onClick={() => updateApplicationStatus(cand.id, 'Shortlisted', 'Profile screened and shortlisted by campus talent committee')}
                              className="btn btn-outline"
                              style={{ fontSize: '0.72rem', padding: '0.25rem 0.55rem' }}
                            >
                              <UserCheck size={12} />
                              Shortlist
                            </button>
                          )}

                          {/* Schedule Interview action if Shortlisted */}
                          {(cand.status === 'Shortlisted' || cand.status === 'Applied') && (
                            <button
                              onClick={() => setShowScheduleModal(cand)}
                              className="btn btn-outline"
                              style={{ fontSize: '0.72rem', padding: '0.25rem 0.55rem', color: '#fbbf24', borderColor: 'rgba(251, 191, 36, 0.4)' }}
                            >
                              <Calendar size={12} />
                              Schedule Interview
                            </button>
                          )}

                          {/* Advance Interview outcome if Scheduled */}
                          {cand.status === 'Interview Scheduled' && (
                            <button
                              onClick={() => updateApplicationStatus(cand.id, 'Interviewed', 'Candidate completed live technical system design round successfully')}
                              className="btn btn-outline"
                              style={{ fontSize: '0.72rem', padding: '0.25rem 0.55rem', color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.4)' }}
                            >
                              <CheckCircle2 size={12} />
                              Mark Interviewed
                            </button>
                          )}

                          {/* Issue Offer action only if Interviewed (Rule 8) */}
                          {cand.status === 'Interviewed' && !cand.hasOffer && (
                            <button
                              onClick={() => setShowIssueOfferModal(cand)}
                              className="btn btn-lime"
                              style={{ fontSize: '0.72rem', padding: '0.25rem 0.65rem' }}
                            >
                              <Award size={12} />
                              Issue Offer
                            </button>
                          )}

                          {/* Reject control */}
                          {cand.status !== 'Rejected' && cand.status !== 'Accepted' && (
                            <button
                              onClick={() => updateApplicationStatus(cand.id, 'Rejected', 'Candidate did not meet threshold benchmark for this stage')}
                              className="btn btn-danger"
                              style={{ fontSize: '0.72rem', padding: '0.25rem 0.45rem' }}
                              title="Reject candidate"
                            >
                              <XCircle size={12} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2.5rem', color: '#94a3b8', fontSize: '0.85rem' }}>
              No candidates in the "{stageFilter}" stage for this drive.
            </div>
          )}
        </div>
      )}

      {/* Modal: Publish New Drive */}
      {showCreateJobModal && (
        <div className="modal-overlay" onClick={() => setShowCreateJobModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '0.35rem' }}>Create Campus Placement Drive</h3>
            <p style={{ fontSize: '0.8125rem', marginBottom: '1.25rem' }}>
              Publish an official opportunity for verified university students
            </p>

            <form onSubmit={handleCreateJobSubmit}>
              <div className="form-group">
                <label className="form-label">Role Title *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Distributed Systems Associate"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Total CTC Package (LPA) *</label>
                  <input
                    type="number"
                    step="0.5"
                    className="form-input"
                    value={newPackage}
                    onChange={(e) => setNewPackage(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Minimum CGPA Cutoff *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    className="form-input"
                    value={newMinCgpa}
                    onChange={(e) => setNewMinCgpa(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid-3">
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Work Mode</label>
                  <select
                    className="form-select"
                    value={newWorkMode}
                    onChange={(e) => setNewWorkMode(e.target.value as any)}
                  >
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Campus Vacancies</label>
                  <input
                    type="number"
                    className="form-input"
                    value={newVacancies}
                    onChange={(e) => setNewVacancies(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Application Deadline</label>
                <input
                  type="date"
                  className="form-input"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowCreateJobModal(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-lime">
                  Publish Drive Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Schedule Interview */}
      {showScheduleModal && (
        <div className="modal-overlay" onClick={() => setShowScheduleModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '0.35rem' }}>Schedule Technical Interview</h3>
            <p style={{ fontSize: '0.8125rem', marginBottom: '1.25rem' }}>
              Assign assessment round slot for <strong>{showScheduleModal.studentName}</strong> ({showScheduleModal.studentBranch}, CGPA: {showScheduleModal.studentCgpa.toFixed(2)})
            </p>

            <form onSubmit={handleConfirmSchedule}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Interview Date *</label>
                  <input
                    type="date"
                    className="form-input"
                    value={intDate}
                    onChange={(e) => setIntDate(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Time Window *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={intTime}
                    onChange={(e) => setIntTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Round Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={intRoundTitle}
                  onChange={(e) => setIntRoundTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Interviewer Name & Role</label>
                <input
                  type="text"
                  className="form-input"
                  value={intInterviewer}
                  onChange={(e) => setIntInterviewer(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Virtual Meeting Link</label>
                <input
                  type="text"
                  className="form-input"
                  value={intLink}
                  onChange={(e) => setIntLink(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowScheduleModal(null)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirm & Notify Candidate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Issue Offer */}
      {showIssueOfferModal && (
        <div className="modal-overlay" onClick={() => setShowIssueOfferModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '0.35rem' }}>Extend Official Placement Offer</h3>
            <p style={{ fontSize: '0.8125rem', marginBottom: '1.25rem' }}>
              Issue formal compensation letter to <strong>{showIssueOfferModal.studentName}</strong> ({showIssueOfferModal.studentUsn})
            </p>

            <form onSubmit={handleConfirmOffer}>
              <div className="grid-3">
                <div className="form-group">
                  <label className="form-label">Total CTC (LPA) *</label>
                  <input
                    type="number"
                    step="0.5"
                    className="form-input"
                    value={offerPackage}
                    onChange={(e) => setOfferPackage(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Base Pay (LPA) *</label>
                  <input
                    type="number"
                    step="0.5"
                    className="form-input"
                    value={offerBase}
                    onChange={(e) => setOfferBase(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Annual Bonus (LPA)</label>
                  <input
                    type="number"
                    step="0.5"
                    className="form-input"
                    value={offerBonus}
                    onChange={(e) => setOfferBonus(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Acceptance Deadline</label>
                <input
                  type="date"
                  className="form-input"
                  value={offerDeadline}
                  onChange={(e) => setOfferDeadline(e.target.value)}
                  required
                />
              </div>

              <div style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: 10,
                padding: '0.85rem',
                fontSize: '0.78rem',
                color: '#a7f3d0',
                marginBottom: '1.5rem'
              }}>
                <ShieldCheck size={16} style={{ display: 'inline', marginRight: 4 }} />
                Extending this offer adheres to Business Rule 8 (candidate has completed technical rounds) and will update their student portal instantaneously.
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setShowIssueOfferModal(null)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-lime">
                  Issue Digital Offer Letter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
