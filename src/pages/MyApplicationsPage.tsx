import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  FileText, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Award, 
  XCircle, 
  ChevronRight, 
  AlertCircle, 
  ExternalLink,
  RotateCcw,
  Eye,
  Info
} from 'lucide-react';
import { Application, ApplicationStatus } from '../types';

export const MyApplicationsPage: React.FC = () => {
  const { applications, currentStudent } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  // Student applications
  const studentApps = applications.filter((a) => a.studentId === currentStudent.id);

  // Filtered applications
  const filteredApps = studentApps.filter((app) => {
    if (statusFilter !== 'ALL' && app.status !== statusFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        app.companyName.toLowerCase().includes(q) ||
        app.jobTitle.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const orderedStages: ApplicationStatus[] = [
    'Applied',
    'Shortlisted',
    'Interview Scheduled',
    'Interviewed',
    'Offered',
    'Accepted'
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', marginBottom: '0.25rem' }}>My Applications & Timeline</h1>
          <p style={{ fontSize: '0.875rem' }}>
            Track the end-to-end recruitment lifecycle and stage progressions for all your campus drive submissions
          </p>
        </div>

        <Link to="/jobs" className="btn btn-primary" style={{ fontSize: '0.8125rem' }}>
          Explore More Drives
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '1rem 1.5rem', background: '#0e1526' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="input-with-icon" style={{ flex: 1, minWidth: 260 }}>
            <Search size={16} className="input-icon" />
            <input
              type="text"
              className="form-input"
              placeholder="Search by company or role title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>Status:</span>
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: 'auto', minWidth: 160 }}
            >
              <option value="ALL">All Stages ({studentApps.length})</option>
              <option value="Applied">Applied</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview Scheduled">Interview Scheduled</option>
              <option value="Interviewed">Interviewed</option>
              <option value="Offered">Offered</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {(statusFilter !== 'ALL' || searchQuery) && (
            <button
              onClick={() => {
                setStatusFilter('ALL');
                setSearchQuery('');
              }}
              className="btn btn-outline"
              style={{ fontSize: '0.75rem', padding: '0.45rem 0.75rem' }}
            >
              <RotateCcw size={12} />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Applications List with Visual Timeline Steppers */}
      {filteredApps.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {filteredApps.map((app) => {
            const currentStageIdx = orderedStages.indexOf(app.status);
            const isRejected = app.status === 'Rejected';

            return (
              <div
                key={app.id}
                className="card card-hover"
                style={{
                  background: '#0d1322',
                  borderLeft: app.status === 'Offered' 
                    ? '4px solid var(--lime-primary)' 
                    : app.status === 'Interview Scheduled' 
                    ? '4px solid var(--status-amber)' 
                    : isRejected
                    ? '4px solid var(--status-rose)'
                    : '4px solid var(--violet-primary)'
                }}
              >
                {/* Header row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <h3 style={{ fontSize: '1.2rem', color: '#ffffff' }}>{app.companyName}</h3>
                      <span className={`badge ${
                        app.status === 'Offered' ? 'badge-lime' :
                        app.status === 'Accepted' ? 'badge-emerald' :
                        app.status === 'Interview Scheduled' ? 'badge-amber' :
                        app.status === 'Interviewed' ? 'badge-sky' :
                        app.status === 'Shortlisted' ? 'badge-violet' :
                        isRejected ? 'badge-rose' : 'badge-neutral'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                      {app.jobTitle} • Package: <strong style={{ color: 'var(--lime-light)' }}>₹{app.packageLPA} LPA</strong>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      Applied on {app.appliedDate}
                    </div>
                    <button
                      onClick={() => setSelectedApp(app)}
                      className="btn btn-outline"
                      style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', marginTop: '0.4rem' }}
                    >
                      <Eye size={13} />
                      View Full Audit History
                    </button>
                  </div>
                </div>

                {/* VISUAL STEP TIMELINE */}
                {!isRejected ? (
                  <div style={{
                    background: '#090d16',
                    borderRadius: 12,
                    padding: '1.25rem 1rem',
                    border: '1px solid var(--border-dark)',
                    marginBottom: '1rem'
                  }}>
                    <div className="timeline-stepper">
                      {orderedStages.map((stage, idx) => {
                        const isCompleted = currentStageIdx >= idx;
                        const isCurrent = currentStageIdx === idx;

                        return (
                          <div
                            key={stage}
                            className={`timeline-step ${isCompleted && !isCurrent ? 'completed' : ''} ${isCurrent ? 'active' : ''}`}
                          >
                            <div className="timeline-step-circle">
                              {isCompleted && !isCurrent ? (
                                <CheckCircle2 size={16} />
                              ) : (
                                idx + 1
                              )}
                            </div>
                            <div className="timeline-step-label">
                              {stage}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  /* Rejection Banner */
                  <div style={{
                    background: 'rgba(239, 68, 68, 0.08)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    borderRadius: 10,
                    padding: '1rem',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem'
                  }}>
                    <XCircle size={18} style={{ color: 'var(--status-rose)', marginTop: 2, flexShrink: 0 }} />
                    <div>
                      <strong style={{ color: '#f87171', fontSize: '0.85rem' }}>Application Status: Ineligible / Closed</strong>
                      <p style={{ fontSize: '0.8125rem', color: '#fca5a5', marginTop: '0.2rem' }}>
                        {app.rejectionReason || 'Candidate profile did not meet company cutoff criteria during this drive round.'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Latest Timeline Note */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: '#94a3b8' }}>
                  <div>
                    Last activity:{' '}
                    <span style={{ color: '#cbd5e1' }}>
                      {app.timeline[app.timeline.length - 1]?.notes || 'Application queued for review'}
                    </span>
                  </div>

                  {app.hasOffer && (
                    <Link to="/offers" style={{ color: 'var(--lime-light)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Award size={14} />
                      Inspect & Accept Offer Letter →
                    </Link>
                  )}

                  {app.status === 'Interview Scheduled' && (
                    <Link to="/interviews" style={{ color: '#fbbf24', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Calendar size={14} />
                      View Meeting Link & Dossier →
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem', background: '#0e1526' }}>
          <FileText size={44} style={{ color: '#64748b', margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No applications found</h3>
          <p style={{ fontSize: '0.875rem', maxWidth: 440, margin: '0 auto 1.5rem auto' }}>
            {statusFilter !== 'ALL'
              ? `You do not have any applications currently in the "${statusFilter}" stage.`
              : 'You have not submitted applications to any campus drives yet.'}
          </p>
          <Link to="/jobs" className="btn btn-primary" style={{ fontSize: '0.85rem' }}>
            Browse Campus Drives
          </Link>
        </div>
      )}

      {/* Application Detail Modal with Historical Log */}
      {selectedApp && (
        <div className="modal-overlay" onClick={() => setSelectedApp(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.35rem', color: '#ffffff' }}>{selectedApp.companyName}</h3>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{selectedApp.jobTitle}</div>
              </div>
              <span className="badge badge-lime">₹{selectedApp.packageLPA} LPA</span>
            </div>

            <h4 style={{ fontSize: '0.95rem', color: '#cbd5e1', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Sequential Audit Trail
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
              {selectedApp.timeline.map((entry, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.85rem',
                    background: '#090d16',
                    border: '1px solid var(--border-dark)',
                    borderRadius: 10,
                    padding: '0.85rem'
                  }}
                >
                  <div style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: 'var(--violet-bg)',
                    color: 'var(--violet-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <CheckCircle2 size={16} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ color: '#ffffff', fontSize: '0.85rem' }}>{entry.stage}</strong>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{entry.timestamp}</span>
                    </div>
                    {entry.notes && (
                      <p style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: '0.2rem' }}>
                        {entry.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setSelectedApp(null)} className="btn btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
