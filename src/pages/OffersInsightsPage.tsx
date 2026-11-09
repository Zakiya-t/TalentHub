import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  FileText, 
  Download, 
  TrendingUp, 
  DollarSign, 
  Building2, 
  ShieldCheck, 
  Sparkles, 
  Lock,
  ArrowRight,
  Info
} from 'lucide-react';
import { Offer } from '../types';

export const OffersInsightsPage: React.FC = () => {
  const { 
    offers, 
    currentStudent, 
    acceptOffer, 
    declineOffer, 
    applications, 
    showToast 
  } = useApp();

  const [selectedOfferForPreview, setSelectedOfferForPreview] = useState<Offer | null>(null);
  const [selectedOfferForAccept, setSelectedOfferForAccept] = useState<Offer | null>(null);
  const [hasAcknowledgedPolicy, setHasAcknowledgedPolicy] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Student's offers
  const studentOffers = offers.filter((o) => o.studentId === currentStudent.id);

  // Career Insights Calculation
  const totalApplied = applications.filter((a) => a.studentId === currentStudent.id).length;
  const totalInterviews = applications.filter(
    (a) => a.studentId === currentStudent.id && 
    (a.status === 'Interview Scheduled' || a.status === 'Interviewed' || a.status === 'Offered' || a.status === 'Accepted')
  ).length;
  const totalOffers = studentOffers.length;

  const appToInterviewConversion = totalApplied > 0 ? Math.round((totalInterviews / totalApplied) * 100) : 0;
  const interviewToOfferConversion = totalInterviews > 0 ? Math.round((totalOffers / totalInterviews) * 100) : 0;

  const handleConfirmAccept = () => {
    if (!selectedOfferForAccept) return;
    setIsProcessing(true);
    setTimeout(() => {
      acceptOffer(selectedOfferForAccept.id);
      setIsProcessing(false);
      setSelectedOfferForAccept(null);
      setHasAcknowledgedPolicy(false);
    }, 600);
  };

  const handleDecline = (offerId: string) => {
    declineOffer(offerId);
  };

  const handleDownloadOfferLetter = (offer: Offer) => {
    // Generate synthetic download
    const element = document.createElement('a');
    const file = new Blob([
      `TALENTHUB OFFICIAL CAMPUS PLACEMENT OFFER LETTER\n` +
      `Date: ${offer.offerDate}\n` +
      `Candidate Name: ${offer.studentName}\n` +
      `USN: ${currentStudent.usn}\n` +
      `Company: ${offer.companyName}\n` +
      `Designation: ${offer.jobTitle}\n` +
      `Total Annual CTC: INR ${offer.packageLPA} LPA\n` +
      `Base Pay: INR ${offer.baseSalaryLPA} LPA\n` +
      `Joining Location: ${offer.location}\n\n` +
      `This offer is extended through the TalentHub Accredited Campus Recruitment Program.\n`
    ], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${offer.companyName.replace(/\s+/g, '_')}_Offer_Letter_${currentStudent.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    showToast('Document Downloaded', `Generated formal offer letter for ${offer.companyName}`, 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(132, 204, 22, 0.12), rgba(99, 102, 241, 0.08)), #0e1526',
        border: '1px solid var(--border-dark)',
        borderRadius: 20,
        padding: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--lime-light)', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.35rem' }}>
            <Award size={16} />
            <span>Campus Offer Portal</span>
          </div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.35rem' }}>
            Offers & Placement Career Insights
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '0.875rem' }}>
            Inspect compensation terms, compare competitive offers, and make informed career commitments
          </p>
        </div>

        {/* Status Lock Warning if Already Accepted */}
        {currentStudent.hasAcceptedOffer ? (
          <div style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            borderRadius: 14,
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <Lock size={22} style={{ color: 'var(--status-emerald)' }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#34d399' }}>
                Placement Status: SECURED & LOCKED
              </div>
              <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
                You have accepted an offer this season per college single-offer regulations.
              </div>
            </div>
          </div>
        ) : (
          <div style={{
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: 14,
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <AlertTriangle size={22} style={{ color: '#fbbf24' }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fbbf24' }}>
                Active Offers Awaiting Decision
              </div>
              <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
                Review before deadline date to secure your college placement.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Offers Overview List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h2 style={{ fontSize: '1.35rem', color: '#ffffff' }}>Extended Job Offers ({studentOffers.length})</h2>

        {studentOffers.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.5rem' }}>
            {studentOffers.map((offer) => {
              const isAccepted = offer.status === 'Accepted';
              const isDeclined = offer.status === 'Declined';
              const isPending = offer.status === 'Pending Decision';

              return (
                <div
                  key={offer.id}
                  className="card"
                  style={{
                    background: '#0d1322',
                    borderTop: isAccepted 
                      ? '4px solid var(--status-emerald)' 
                      : isDeclined 
                      ? '4px solid #64748b' 
                      : '4px solid var(--lime-primary)'
                  }}
                >
                  {/* Card Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <h3 style={{ fontSize: '1.25rem', color: '#ffffff' }}>{offer.companyName}</h3>
                        <span className={`badge ${isAccepted ? 'badge-emerald' : isDeclined ? 'badge-neutral' : 'badge-lime'}`}>
                          {offer.status}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                        {offer.jobTitle} • {offer.location}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Total CTC</span>
                      <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--lime-light)', fontFamily: 'var(--font-heading)' }}>
                        ₹{offer.packageLPA} LPA
                      </div>
                    </div>
                  </div>

                  {/* Compensation Breakdown Grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '0.75rem',
                    background: '#090d16',
                    border: '1px solid var(--border-dark)',
                    borderRadius: 12,
                    padding: '0.85rem',
                    marginBottom: '1.25rem',
                    fontSize: '0.8125rem'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Base Salary</div>
                      <div style={{ fontWeight: 700, color: '#ffffff' }}>₹{offer.baseSalaryLPA} LPA</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Retention Bonus</div>
                      <div style={{ fontWeight: 700, color: '#ffffff' }}>₹{offer.retentionBonusLPA} LPA</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Equity Grants</div>
                      <div style={{ fontWeight: 700, color: '#ffffff' }}>{offer.stockOptionsValue || 'N/A'}</div>
                    </div>
                  </div>

                  {/* Terms & Placement Season Policy Warning Notice */}
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-dark)',
                    borderRadius: 10,
                    padding: '0.85rem',
                    fontSize: '0.78rem',
                    color: '#cbd5e1',
                    marginBottom: '1.25rem',
                    lineHeight: 1.5
                  }}>
                    <strong style={{ color: '#ffffff' }}>Placement Policy Notice: </strong>
                    {offer.policyWarningNotice}
                  </div>

                  {/* Actions Row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', borderTop: '1px solid var(--border-dark)', paddingTop: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => setSelectedOfferForPreview(offer)}
                        className="btn btn-outline"
                        style={{ fontSize: '0.78rem', padding: '0.45rem 0.85rem' }}
                      >
                        <FileText size={14} />
                        View Letter
                      </button>
                      <button
                        onClick={() => handleDownloadOfferLetter(offer)}
                        className="btn btn-outline"
                        style={{ fontSize: '0.78rem', padding: '0.45rem 0.85rem' }}
                        title="Download official digital copy"
                      >
                        <Download size={14} />
                        Download
                      </button>
                    </div>

                    {/* Accept / Decline Controls */}
                    {isPending && !currentStudent.hasAcceptedOffer && (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleDecline(offer.id)}
                          className="btn btn-danger"
                          style={{ fontSize: '0.78rem', padding: '0.45rem 0.85rem' }}
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => setSelectedOfferForAccept(offer)}
                          className="btn btn-lime"
                          style={{ fontSize: '0.78rem', padding: '0.45rem 1.1rem' }}
                        >
                          <CheckCircle2 size={14} />
                          Accept Offer
                        </button>
                      </div>
                    )}

                    {isAccepted && (
                      <span className="badge badge-emerald" style={{ fontSize: '0.78rem' }}>
                        <CheckCircle2 size={14} />
                        Accepted on {offer.offerDate}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem', background: '#0e1526' }}>
            <Award size={40} style={{ color: '#64748b', margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.35rem' }}>No offers extended yet</h3>
            <p style={{ fontSize: '0.85rem', maxWidth: 420, margin: '0 auto' }}>
              Complete scheduled interviews to unlock official compensation offers from visiting companies.
            </p>
          </div>
        )}
      </div>

      {/* Side-by-Side Offer Comparison Matrix (when applicable) */}
      <div className="card" style={{ background: '#0d1322' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Multi-Offer Benchmark & Comparison Matrix</h3>
        <p style={{ fontSize: '0.8125rem', marginBottom: '1.25rem' }}>
          Evaluate role compensation, tech stack, and career growth potential
        </p>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Company & Role</th>
                <th>Total CTC</th>
                <th>Base Component</th>
                <th>Location & Mode</th>
                <th>Tech Stack</th>
                <th>Career Trajectory</th>
                <th>Decision Deadline</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong style={{ color: '#ffffff' }}>FinVerve Systems</strong>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Core FinTech Engineer</div>
                </td>
                <td><strong style={{ color: 'var(--lime-light)' }}>₹18.5 LPA</strong></td>
                <td>₹15.0 LPA</td>
                <td>Bengaluru (On-site)</td>
                <td>Java, Kafka, ScyllaDB</td>
                <td>High-throughput Banking</td>
                <td>Oct 20, 2026</td>
              </tr>
              <tr>
                <td>
                  <strong style={{ color: '#ffffff' }}>ApexCloud Technologies</strong>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Cloud Platform Engineer</div>
                </td>
                <td><strong style={{ color: 'var(--violet-light)' }}>₹24.0 LPA (Projected)</strong></td>
                <td>₹19.5 LPA</td>
                <td>Bengaluru (Hybrid)</td>
                <td>Go, Kubernetes, AWS</td>
                <td>Distributed Systems</td>
                <td>Post-Round 2</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Career Conversion & Readiness Analytics */}
      <div className="grid-3">
        {/* Metric 1 */}
        <div className="card card-accent">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>Application-to-Interview Conversion</span>
            <TrendingUp size={16} style={{ color: 'var(--violet-light)' }} />
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-heading)' }}>
            {appToInterviewConversion}%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--status-emerald)', marginTop: '0.25rem' }}>
            College Average benchmark: 32%
          </div>
        </div>

        {/* Metric 2 */}
        <div className="card card-lime">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>Interview-to-Offer Conversion</span>
            <Award size={16} style={{ color: 'var(--lime-light)' }} />
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--lime-light)', fontFamily: 'var(--font-heading)' }}>
            {interviewToOfferConversion}%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--lime-light)', marginTop: '0.25rem' }}>
            Top 10% percentile across Senior CSE batch
          </div>
        </div>

        {/* Metric 3 */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>Skill Development Suggestion</span>
            <Sparkles size={16} style={{ color: '#38bdf8' }} />
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginTop: '0.25rem' }}>
            High-Yield Market Skills:
          </div>
          <p style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: '0.35rem' }}>
            Strengthen <strong>Kubernetes Operators</strong> and <strong>gRPC microservices</strong> to optimize Tier-1 CTC potential.
          </p>
        </div>
      </div>

      {/* Accept Offer Confirmation Dialog with Season Policy Warning */}
      {selectedOfferForAccept && (
        <div className="modal-overlay" onClick={() => setSelectedOfferForAccept(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: 'rgba(245, 158, 11, 0.15)',
                color: '#fbbf24',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.35rem', color: '#ffffff' }}>Confirm Offer Acceptance</h3>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                  {selectedOfferForAccept.companyName} • ₹{selectedOfferForAccept.packageLPA} LPA
                </div>
              </div>
            </div>

            {/* University Placement Policy Warning Box */}
            <div style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              borderRadius: 12,
              padding: '1.25rem',
              marginBottom: '1.5rem',
              color: '#fca5a5',
              fontSize: '0.85rem',
              lineHeight: 1.5
            }}>
              <strong style={{ color: '#ffffff', display: 'block', marginBottom: '0.35rem' }}>
                CRITICAL UNIVERSITY PLACEMENT SEASON RULE:
              </strong>
              According to the University Career Center Charter: <strong>Accepting this offer will formally mark your candidate status as "Placed".</strong> You will immediately become ineligible for any upcoming placement drives or pending assessments in order to ensure fair recruitment access for your fellow students.
            </div>

            {/* Checkbox Acknowledgment */}
            <label style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              background: '#090d16',
              border: '1px solid var(--border-dark)',
              borderRadius: 10,
              padding: '1rem',
              marginBottom: '1.75rem',
              cursor: 'pointer',
              fontSize: '0.8125rem',
              color: '#ffffff'
            }}>
              <input
                type="checkbox"
                checked={hasAcknowledgedPolicy}
                onChange={(e) => setHasAcknowledgedPolicy(e.target.checked)}
                style={{ accentColor: 'var(--lime-primary)', width: 18, height: 18, marginTop: 2, flexShrink: 0 }}
              />
              <span>
                I acknowledge the single-offer placement rule and formally accept the employment terms offered by <strong>{selectedOfferForAccept.companyName}</strong>.
              </span>
            </label>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setSelectedOfferForAccept(null)}
                className="btn btn-outline"
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAccept}
                className="btn btn-lime"
                disabled={!hasAcknowledgedPolicy || isProcessing}
              >
                {isProcessing ? 'Locking Placement...' : 'Confirm & Accept Binding Offer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Offer Letter Document Preview Modal */}
      {selectedOfferForPreview && (
        <div className="modal-overlay" onClick={() => setSelectedOfferForPreview(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 640 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-dark)', paddingBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: '#ffffff' }}>Official Offer Letter</h3>
                <div style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>Ref: TH-OFFER-{selectedOfferForPreview.id.toUpperCase()}</div>
              </div>
              <button
                onClick={() => handleDownloadOfferLetter(selectedOfferForPreview)}
                className="btn btn-outline"
                style={{ fontSize: '0.78rem', padding: '0.4rem 0.8rem' }}
              >
                <Download size={14} /> Download PDF
              </button>
            </div>

            {/* Document Body */}
            <div style={{
              background: '#090d16',
              border: '1px solid var(--border-dark)',
              borderRadius: 12,
              padding: '1.5rem',
              fontFamily: 'monospace',
              fontSize: '0.8125rem',
              color: '#cbd5e1',
              lineHeight: 1.6,
              marginBottom: '1.5rem'
            }}>
              <div style={{ textAlign: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
                <strong style={{ fontSize: '1rem', color: '#ffffff' }}>{selectedOfferForPreview.companyName.toUpperCase()}</strong>
                <div>Campus Recruitment Program 2026</div>
              </div>

              <div>Dear {selectedOfferForPreview.studentName},</div>
              <br />
              <div>We are delighted to extend an offer of employment for the role of <strong>{selectedOfferForPreview.jobTitle}</strong>.</div>
              <br />
              <div>• Total Annual Compensation (CTC): ₹{selectedOfferForPreview.packageLPA} LPA</div>
              <div>• Fixed Base Salary: ₹{selectedOfferForPreview.baseSalaryLPA} LPA</div>
              <div>• Performance & Retention Bonus: ₹{selectedOfferForPreview.retentionBonusLPA} LPA</div>
              <div>• Work Location: {selectedOfferForPreview.location}</div>
              <br />
              <div>Terms & Benefits: {selectedOfferForPreview.termsSummary}</div>
              <br />
              <div>Please confirm your acceptance before {selectedOfferForPreview.acceptanceDeadline}.</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setSelectedOfferForPreview(null)} className="btn btn-secondary">
                Close Document Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
