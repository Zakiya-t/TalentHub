import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Layers, 
  Users, 
  Building2, 
  Briefcase, 
  Award, 
  TrendingUp, 
  Calendar, 
  Download, 
  Play, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Clock, 
  Search,
  Filter,
  BarChart3,
  Sliders,
  ChevronRight
} from 'lucide-react';
import { platformStats } from '../data/mockData';
import { Student } from '../types';

export const CoordinatorConsolePage: React.FC = () => {
  const { 
    jobs, 
    students, 
    applications, 
    auditLogs, 
    simulateShortlisting, 
    exportShortlistCSV,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'simulation' | 'students' | 'drives' | 'audit'>('simulation');
  const [selectedJobIdForSim, setSelectedJobIdForSim] = useState<string>(jobs[0]?.id || 'job_apex_01');
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<string>('ALL');

  // Simulation execution results
  const simulation = simulateShortlisting(selectedJobIdForSim);
  const selectedJob = jobs.find((j) => j.id === selectedJobIdForSim);

  // Student directory filtering
  const filteredStudents = students.filter((s) => {
    if (selectedBranchFilter !== 'ALL' && s.branch !== selectedBranchFilter) return false;
    if (studentSearch.trim()) {
      const q = studentSearch.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.usn.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Console Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.12), rgba(99, 102, 241, 0.08)), #0e1526',
        border: '1px solid var(--border-dark)',
        borderRadius: 20,
        padding: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#38bdf8', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.35rem' }}>
            <Layers size={16} />
            <span>Placement Office Administrative Console</span>
          </div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.35rem' }}>
            Placement Coordinator Console
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '0.875rem' }}>
            Season 2025–2026 Governance • Lead Administrator: <strong>Dr. S. K. Murthy</strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => exportShortlistCSV(selectedJobIdForSim)}
            className="btn btn-lime"
            style={{ fontSize: '0.85rem' }}
          >
            <Download size={15} />
            Export Shortlist to CSV
          </button>
        </div>
      </div>

      {/* Season KPIs Grid */}
      <div className="grid-4">
        <div className="card card-accent">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>Registered Candidates</span>
            <Users size={16} style={{ color: 'var(--violet-light)' }} />
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-heading)' }}>
            {platformStats.registeredStudents.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
            Across 8 Engineering Departments
          </div>
        </div>

        <div className="card card-lime">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>Participating Companies</span>
            <Building2 size={16} style={{ color: 'var(--lime-light)' }} />
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--lime-light)', fontFamily: 'var(--font-heading)' }}>
            {platformStats.participatingCompanies}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--status-emerald)', marginTop: '0.25rem' }}>
            {jobs.length} Active Placement Drives
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>Overall Placement Rate</span>
            <TrendingUp size={16} style={{ color: 'var(--status-emerald)' }} />
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-heading)' }}>
            {platformStats.placementRatePercentage}%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--status-emerald)', marginTop: '0.25rem' }}>
            {platformStats.totalOffersIssued} Total Offers Extended
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>Highest CTC Package</span>
            <Award size={16} style={{ color: '#fbbf24' }} />
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-heading)' }}>
            ₹{platformStats.highestPackageLPA} LPA
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
            Average: ₹{platformStats.averagePackageLPA} LPA
          </div>
        </div>
      </div>

      {/* Recruitment Funnel Visualizer */}
      <div className="card" style={{ background: '#0d1322' }}>
        <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Placement Funnel Velocity (Season-to-Date)</h3>
        <p style={{ fontSize: '0.8125rem', marginBottom: '1.25rem', color: '#94a3b8' }}>
          Conversion across all stages with automated eligibility gating
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '0.75rem',
          textAlign: 'center'
        }}>
          {[
            { label: 'Applications', count: '3,840', pct: '100%', color: '#6366f1' },
            { label: 'Screened & Eligible', count: '2,910', pct: '75.8%', color: '#818cf8' },
            { label: 'Shortlisted', count: '1,420', pct: '37.0%', color: '#38bdf8' },
            { label: 'Interviews Conducted', count: '512', pct: '13.3%', color: '#fbbf24' },
            { label: 'Offers Extended', count: '348', pct: '9.1%', color: '#a3e635' },
            { label: 'Offers Accepted', count: '295', pct: '7.7%', color: '#10b981' },
          ].map((step, idx) => (
            <div
              key={step.label}
              style={{
                background: '#090d16',
                border: '1px solid var(--border-dark)',
                borderRadius: 12,
                padding: '1rem 0.5rem',
                position: 'relative'
              }}
            >
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.35rem' }}>{step.label}</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: step.color, fontFamily: 'var(--font-heading)' }}>
                {step.count}
              </div>
              <span className="badge badge-neutral" style={{ fontSize: '0.68rem', marginTop: '0.35rem' }}>
                {step.pct}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Coordinator Tabs Navigation */}
      <div style={{
        display: 'inline-flex',
        background: '#090d16',
        border: '1px solid var(--border-dark)',
        borderRadius: 12,
        padding: '0.35rem',
        gap: '0.35rem',
        alignSelf: 'flex-start'
      }}>
        <button
          onClick={() => setActiveTab('simulation')}
          className={`btn ${activeTab === 'simulation' ? 'btn-primary' : 'btn-outline'}`}
          style={{ padding: '0.45rem 1.1rem', fontSize: '0.8125rem', border: 'none' }}
        >
          <Play size={14} />
          Shortlist Simulator
        </button>
        <button
          onClick={() => setActiveTab('students')}
          className={`btn ${activeTab === 'students' ? 'btn-primary' : 'btn-outline'}`}
          style={{ padding: '0.45rem 1.1rem', fontSize: '0.8125rem', border: 'none' }}
        >
          <Users size={14} />
          Student Directory ({students.length})
        </button>
        <button
          onClick={() => setActiveTab('drives')}
          className={`btn ${activeTab === 'drives' ? 'btn-primary' : 'btn-outline'}`}
          style={{ padding: '0.45rem 1.1rem', fontSize: '0.8125rem', border: 'none' }}
        >
          <Briefcase size={14} />
          Drive Listings ({jobs.length})
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`btn ${activeTab === 'audit' ? 'btn-primary' : 'btn-outline'}`}
          style={{ padding: '0.45rem 1.1rem', fontSize: '0.8125rem', border: 'none' }}
        >
          <Clock size={14} />
          Audit & Policy Log ({auditLogs.length})
        </button>
      </div>

      {/* TAB 1: SHORTLIST SIMULATION ENGINE */}
      {activeTab === 'simulation' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          <div className="card" style={{ background: '#0e1526' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem' }}>Run Drive Shortlisting Simulation</h3>
                <p style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>
                  Simulate company criteria (CGPA cutoff, allowed branches, active backlog tolerance, single-offer policy) across all student profiles.
                </p>
              </div>

              {/* Job Selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.8125rem', color: '#cbd5e1', fontWeight: 600 }}>Select Drive:</span>
                <select
                  className="form-select"
                  value={selectedJobIdForSim}
                  onChange={(e) => setSelectedJobIdForSim(e.target.value)}
                  style={{ width: 'auto', minWidth: 260 }}
                >
                  {jobs.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.companyName} — {j.title} (Min CGPA: {j.minCgpa})
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => exportShortlistCSV(selectedJobIdForSim)}
                  className="btn btn-lime"
                  style={{ fontSize: '0.8125rem', padding: '0.55rem 1rem' }}
                >
                  <Download size={14} />
                  Download CSV
                </button>
              </div>
            </div>

            {/* Simulation Summary KPIs */}
            {selectedJob && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '1rem',
                marginBottom: '1.5rem',
                background: '#090d16',
                border: '1px solid var(--border-dark)',
                borderRadius: 14,
                padding: '1.25rem'
              }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase' }}>Total Students</span>
                  <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#ffffff' }}>{simulation.totalStudents}</div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Verified cohort</div>
                </div>

                <div>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase' }}>Eligible Pool</span>
                  <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--lime-light)' }}>{simulation.eligibleCount}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--status-emerald)' }}>
                    {Math.round((simulation.eligibleCount / simulation.totalStudents) * 100)}% Pass Rate
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase' }}>Disqualified Cohort</span>
                  <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#f87171' }}>{simulation.ineligibleCount}</div>
                  <div style={{ fontSize: '0.72rem', color: '#fca5a5' }}>Filtered by criteria</div>
                </div>

                <div>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase' }}>Cutoff Thresholds</span>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#cbd5e1', marginTop: '0.25rem' }}>
                    CGPA ≥ {selectedJob.minCgpa.toFixed(2)}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                    {selectedJob.allowedBranches.length > 0 ? selectedJob.allowedBranches.join(', ') : 'All Branches'}
                  </div>
                </div>
              </div>
            )}

            {/* Breakdown Lists */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
              {/* Eligible Candidates Table */}
              <div>
                <h4 style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--status-emerald)' }} />
                  Eligible Students ({simulation.eligibleCount})
                </h4>

                <div className="data-table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Candidate</th>
                        <th>Branch</th>
                        <th>CGPA</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {simulation.eligibleStudents.map((s) => (
                        <tr key={s.id}>
                          <td>
                            <strong style={{ color: '#ffffff' }}>{s.name}</strong>
                            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{s.usn}</div>
                          </td>
                          <td><span className="badge badge-neutral">{s.branch}</span></td>
                          <td><strong style={{ color: 'var(--status-emerald)' }}>{s.cgpa.toFixed(2)}</strong></td>
                          <td><span className="badge badge-emerald">Eligible</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Ineligible Breakdown with Detailed Reasons */}
              <div>
                <h4 style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <XCircle size={16} style={{ color: 'var(--status-rose)' }} />
                  Disqualification Explanations ({simulation.ineligibleCount})
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {simulation.ineligibleDetails.map(({ student: s, reasons }) => (
                    <div
                      key={s.id}
                      style={{
                        background: '#090d16',
                        border: '1px solid rgba(239, 68, 68, 0.25)',
                        borderRadius: 10,
                        padding: '0.85rem'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <strong style={{ color: '#ffffff', fontSize: '0.85rem' }}>{s.name}</strong>
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginLeft: '0.5rem' }}>
                            ({s.branch}, CGPA {s.cgpa.toFixed(2)}, {s.activeBacklogs} backlogs)
                          </span>
                        </div>
                        <span className="badge badge-rose" style={{ fontSize: '0.68rem' }}>Ineligible</span>
                      </div>

                      <div style={{ marginTop: '0.4rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        {reasons.map((r, idx) => (
                          <div key={idx} style={{ fontSize: '0.75rem', color: '#fca5a5' }}>
                            • {r}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STUDENT DIRECTORY */}
      {activeTab === 'students' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem' }}>Institutional Student Registry</h3>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <div className="input-with-icon" style={{ width: 240 }}>
                <Search size={14} className="input-icon" />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search student or USN..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                />
              </div>

              <select
                className="form-select"
                value={selectedBranchFilter}
                onChange={(e) => setSelectedBranchFilter(e.target.value)}
                style={{ width: 'auto' }}
              >
                <option value="ALL">All Branches</option>
                <option value="CSE">CSE</option>
                <option value="ISE">ISE</option>
                <option value="AI & DS">AI & DS</option>
                <option value="ECE">ECE</option>
                <option value="MECH">MECH</option>
              </select>
            </div>
          </div>

          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>USN</th>
                  <th>Branch</th>
                  <th>CGPA</th>
                  <th>Backlogs (Active / Cleared)</th>
                  <th>ATS Resume</th>
                  <th>Placement Season Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <strong style={{ color: '#ffffff' }}>{s.name}</strong>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{s.email}</div>
                    </td>
                    <td>{s.usn}</td>
                    <td><span className="badge badge-neutral">{s.branch}</span></td>
                    <td><strong style={{ color: s.cgpa >= 8.0 ? 'var(--status-emerald)' : '#cbd5e1' }}>{s.cgpa.toFixed(2)}</strong></td>
                    <td>
                      <span style={{ color: s.activeBacklogs > 0 ? '#f87171' : 'var(--status-emerald)' }}>
                        {s.activeBacklogs} active
                      </span> / {s.clearedBacklogs} cleared
                    </td>
                    <td>
                      <span className="badge badge-violet">{s.resumeAtsScore}/100</span>
                    </td>
                    <td>
                      {s.hasAcceptedOffer ? (
                        <span className="badge badge-emerald">PLACED & LOCKED</span>
                      ) : (
                        <span className="badge badge-neutral">Actively Participating</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: DRIVE LISTINGS MANAGEMENT */}
      {activeTab === 'drives' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem' }}>Campus Recruitment Drives Master Directory</h3>
            <span style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>{jobs.length} Published Drives</span>
          </div>

          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Package (LPA)</th>
                  <th>Min CGPA</th>
                  <th>Allowed Branches</th>
                  <th>Deadline</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((j) => (
                  <tr key={j.id}>
                    <td><strong style={{ color: '#ffffff' }}>{j.companyName}</strong></td>
                    <td>{j.title}</td>
                    <td><strong style={{ color: 'var(--lime-light)' }}>₹{j.packageLPA} LPA</strong></td>
                    <td>{j.minCgpa.toFixed(2)}</td>
                    <td>
                      {j.allowedBranches.length > 0 ? (
                        <span style={{ fontSize: '0.78rem' }}>{j.allowedBranches.join(', ')}</span>
                      ) : (
                        <span className="badge badge-neutral">All Departments</span>
                      )}
                    </td>
                    <td>{j.deadline}</td>
                    <td>
                      {j.isOpen ? (
                        <span className="badge badge-emerald">Active / Open</span>
                      ) : (
                        <span className="badge badge-rose">Closed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT LOG */}
      {activeTab === 'audit' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem' }}>Placement Activity & Regulatory Audit Log</h3>
            <span style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>Immutable Timestamped Trail</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {auditLogs.map((log) => (
              <div
                key={log.id}
                style={{
                  background: '#090d16',
                  border: '1px solid var(--border-dark)',
                  borderRadius: 12,
                  padding: '1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  flexWrap: 'wrap'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                    <strong style={{ color: '#ffffff', fontSize: '0.9rem' }}>{log.action}</strong>
                    <span className="badge badge-violet" style={{ fontSize: '0.68rem' }}>{log.actorRole}</span>
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: '#cbd5e1' }}>
                    Target: <strong style={{ color: '#ffffff' }}>{log.target}</strong>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                    {log.details}
                  </div>
                </div>

                <div style={{ fontSize: '0.75rem', color: '#64748b', textAlign: 'right' }}>
                  {log.timestamp}
                  <div style={{ color: '#cbd5e1', fontWeight: 600 }}>Actor: {log.actor}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          div[style*="grid-template-columns: 1.2fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
          div[style*="grid-template-columns: repeat(6, 1fr)"] {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
};
