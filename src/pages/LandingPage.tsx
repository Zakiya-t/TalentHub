import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  Building2, 
  CheckCircle2, 
  Award, 
  GraduationCap, 
  Users, 
  Briefcase, 
  Layers, 
  ChevronRight,
  Star,
  Clock,
  Compass,
  FileCheck,
  Calendar
} from 'lucide-react';
import { sampleCompanies, platformStats } from '../data/mockData';

export const LandingPage: React.FC = () => {
  const { setRole } = useApp();
  const navigate = useNavigate();
  const [activeAudienceTab, setActiveAudienceTab] = useState<'students' | 'recruiters' | 'coordinators'>('students');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', overflowX: 'hidden' }}>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        padding: '5rem 2rem 6rem 2rem',
        background: 'radial-gradient(ellipse at 80% 20%, rgba(99, 102, 241, 0.14) 0%, rgba(9, 13, 22, 0) 65%), radial-gradient(ellipse at 20% 80%, rgba(132, 204, 22, 0.08) 0%, rgba(9, 13, 22, 0) 60%), #090d16',
        borderBottom: '1px solid var(--border-dark)'
      }}>
        <div style={{ maxWidth: 1440, margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.15fr 0.85fr',
            gap: '4rem',
            alignItems: 'center'
          }}>
            {/* Left Hero Column */}
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(99, 102, 241, 0.12)',
                border: '1px solid rgba(99, 102, 241, 0.28)',
                padding: '0.35rem 0.85rem',
                borderRadius: 9999,
                fontSize: '0.8125rem',
                color: 'var(--violet-light)',
                fontWeight: 600,
                marginBottom: '1.5rem'
              }}>
                <Sparkles size={14} />
                <span>Next-Generation Campus Placement Platform</span>
              </div>

              <h1 style={{
                fontSize: 'clamp(2.5rem, 5vw, 4.25rem)',
                lineHeight: 1.08,
                fontWeight: 800,
                letterSpacing: '-0.035em',
                marginBottom: '1.5rem'
              }}>
                Your Next <span style={{
                  background: 'linear-gradient(135deg, #ffffff 40%, #818cf8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>Opportunity</span> Starts Here.
              </h1>

              <p style={{
                fontSize: '1.125rem',
                lineHeight: 1.65,
                color: '#94a3b8',
                marginBottom: '2.25rem',
                maxWidth: 580
              }}>
                TalentHub connects collegiate talent with visionary enterprise employers. Experience transparent drives, automated CGPA eligibility checks, live multi-round interview tracking, and equitable offer governance.
              </p>

              {/* Calls to Action */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '2.5rem' }}>
                <Link to="/jobs" className="btn btn-lime" style={{ padding: '0.8rem 1.6rem', fontSize: '0.95rem' }}>
                  Explore Opportunities
                  <ArrowRight size={17} />
                </Link>
                <Link to="/register" className="btn btn-secondary" style={{ padding: '0.8rem 1.6rem', fontSize: '0.95rem' }}>
                  Join TalentHub
                </Link>
                <Link to="/signin" className="btn btn-outline" style={{ padding: '0.8rem 1.25rem', fontSize: '0.95rem' }}>
                  Sign In
                </Link>
              </div>

              {/* Trust Badges */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap', paddingTop: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldCheck size={18} style={{ color: 'var(--lime-primary)' }} />
                  <span style={{ fontSize: '0.8125rem', color: '#cbd5e1' }}>100% Verified College Records</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={18} style={{ color: 'var(--violet-light)' }} />
                  <span style={{ fontSize: '0.8125rem', color: '#cbd5e1' }}>Automated Single-Offer Policy</span>
                </div>
              </div>
            </div>

            {/* Right Hero Column: Abstract Growth Symbol + Floating Dashboard Preview */}
            <div style={{ position: 'relative' }}>
              {/* Outer decorative glow container */}
              <div style={{
                background: 'linear-gradient(145deg, #12192c, #0c1220)',
                border: '1px solid var(--border-dark)',
                borderRadius: 24,
                padding: '2rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px -5px var(--violet-glow)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Background decorative graph grid line */}
                <svg width="100%" height="160" viewBox="0 0 400 160" fill="none" style={{ position: 'absolute', top: 0, right: 0, opacity: 0.15, pointerEvents: 'none' }}>
                  <path d="M0 140Q100 120 180 80T400 20" stroke="url(#heroGrad)" strokeWidth="3" fill="none" />
                  <defs>
                    <linearGradient id="heroGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop stopColor="#6366f1" />
                      <stop offset="1" stopColor="#84cc16" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Dashboard Preview Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
                    <span style={{ fontSize: '0.75rem', color: '#64748b', marginLeft: '0.5rem', fontWeight: 600 }}>talenthub.workspace / rohan-sharma</span>
                  </div>
                  <span className="badge badge-emerald">Live Drive In Progress</span>
                </div>

                {/* Floating Widget 1: Official Offer Card */}
                <div style={{
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  borderRadius: 14,
                  padding: '1rem',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div style={{
                      width: 42,
                      height: 42,
                      borderRadius: 10,
                      background: '#10b981',
                      color: '#071611',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '1rem'
                    }}>
                      FV
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#a7f3d0', fontWeight: 600 }}>OFFER EXTENDED</div>
                      <div style={{ fontSize: '0.925rem', fontWeight: 700, color: '#ffffff' }}>FinVerve Systems</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Core FinTech Software Engineer</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--lime-light)', fontFamily: 'var(--font-heading)' }}>₹18.5 LPA</div>
                    <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>Pending Decision</span>
                  </div>
                </div>

                {/* Floating Widget 2: Upcoming Interview Slot */}
                <div style={{
                  background: 'rgba(99, 102, 241, 0.08)',
                  border: '1px solid rgba(99, 102, 241, 0.22)',
                  borderRadius: 14,
                  padding: '1rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Clock size={14} style={{ color: 'var(--violet-light)' }} />
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#c7d2fe' }}>NEXT INTERVIEW TOMORROW</span>
                    </div>
                    <span className="badge badge-violet" style={{ fontSize: '0.7rem' }}>Round 2: Systems</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#ffffff' }}>ApexCloud Technologies</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Oct 12, 11:00 AM IST • Google Meet</div>
                    </div>
                    <Link to="/interviews" className="btn btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>
                      Prep Checklist
                    </Link>
                  </div>
                </div>

                {/* Floating Widget 3: Live Verification Status */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-dark)',
                  borderRadius: 12,
                  padding: '0.85rem'
                }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>CGPA Verification</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#ffffff' }}>8.75 / 10.0</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--status-emerald)' }}>✓ 0 Active Backlogs</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Drive Eligibility</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#ffffff' }}>18 Eligible</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--lime-light)' }}>CSE Branch Approved</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>ATS Resume</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#ffffff' }}>94/100 Score</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--violet-light)' }}>Verified PDF</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Statistics Section (Clearly labeled sample data) */}
      <section style={{
        padding: '3rem 2rem',
        background: '#070a13',
        borderBottom: '1px solid var(--border-dark)'
      }}>
        <div style={{ maxWidth: 1440, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Campus Placement Season Benchmarks (Sample Institutional Data)
            </span>
            <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
              Audited 2025-2026 Season
            </span>
          </div>

          <div className="grid-4">
            <div className="card card-accent" style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '0.8125rem', color: '#94a3b8', marginBottom: '0.35rem' }}>Placement Rate</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-heading)' }}>
                {platformStats.placementRatePercentage}%
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--status-emerald)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
                <TrendingUp size={13} />
                <span>+4.2% over previous academic cycle</span>
              </div>
            </div>

            <div className="card card-lime" style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '0.8125rem', color: '#94a3b8', marginBottom: '0.35rem' }}>Highest Package</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--lime-light)', fontFamily: 'var(--font-heading)' }}>
                ₹{platformStats.highestPackageLPA} LPA
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                Average: ₹{platformStats.averagePackageLPA} LPA (Median ₹{platformStats.medianPackageLPA} LPA)
              </div>
            </div>

            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '0.8125rem', color: '#94a3b8', marginBottom: '0.35rem' }}>Participating Recruiters</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-heading)' }}>
                {platformStats.participatingCompanies}+
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--violet-light)', marginTop: '0.25rem' }}>
                Fortune 500 & high-growth Tech Unicorns
              </div>
            </div>

            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '0.8125rem', color: '#94a3b8', marginBottom: '0.35rem' }}>Active Offers Issued</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-heading)' }}>
                {platformStats.totalOffersIssued.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--status-emerald)', marginTop: '0.25rem' }}>
                Across {platformStats.registeredStudents} registered seniors
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Companies Section */}
      <section style={{
        padding: '4rem 2rem',
        background: '#090d16',
        borderBottom: '1px solid var(--border-dark)'
      }}>
        <div style={{ maxWidth: 1440, margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            fontSize: '0.8125rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: 'var(--violet-light)',
            letterSpacing: '0.08em',
            marginBottom: '0.5rem'
          }}>
            Trusted Enterprise Network
          </div>
          <h2 style={{ fontSize: '2rem', marginBottom: '2.5rem' }}>
            Top Companies Hiring Through TalentHub
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.25rem'
          }}>
            {sampleCompanies.slice(0, 8).map((comp) => (
              <div
                key={comp.id}
                className="card card-hover"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1.1rem 1.25rem',
                  background: '#0e1526'
                }}
              >
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: comp.color,
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1rem',
                  flexShrink: 0
                }}>
                  {comp.logo}
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.925rem', color: '#ffffff' }}>{comp.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{comp.industry}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Benefits by Role (Interactive Tabs) */}
      <section style={{
        padding: '5rem 2rem',
        background: '#0c1220',
        borderBottom: '1px solid var(--border-dark)'
      }}>
        <div style={{ maxWidth: 1440, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 3rem auto' }}>
            <span className="badge badge-violet" style={{ marginBottom: '0.75rem' }}>One Unified Platform</span>
            <h2 style={{ fontSize: '2.4rem', marginBottom: '1rem' }}>
              Engineered for Every Placement Stakeholder
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1rem' }}>
              Whether you are a student discovering your first job, a recruiter building top engineering teams, or a coordinator orchestrating university drives.
            </p>

            {/* Audience Tabs */}
            <div style={{
              display: 'inline-flex',
              background: '#070a13',
              border: '1px solid var(--border-dark)',
              borderRadius: 12,
              padding: '0.35rem',
              marginTop: '1.5rem',
              gap: '0.35rem'
            }}>
              <button
                onClick={() => setActiveAudienceTab('students')}
                className={`btn ${activeAudienceTab === 'students' ? 'btn-primary' : 'btn-outline'}`}
                style={{ padding: '0.45rem 1.25rem', fontSize: '0.85rem', border: 'none' }}
              >
                <GraduationCap size={15} />
                For Students
              </button>
              <button
                onClick={() => setActiveAudienceTab('recruiters')}
                className={`btn ${activeAudienceTab === 'recruiters' ? 'btn-primary' : 'btn-outline'}`}
                style={{ padding: '0.45rem 1.25rem', fontSize: '0.85rem', border: 'none' }}
              >
                <Briefcase size={15} />
                For Recruiters
              </button>
              <button
                onClick={() => setActiveAudienceTab('coordinators')}
                className={`btn ${activeAudienceTab === 'coordinators' ? 'btn-primary' : 'btn-outline'}`}
                style={{ padding: '0.45rem 1.25rem', fontSize: '0.85rem', border: 'none' }}
              >
                <Layers size={15} />
                For Placement Heads
              </button>
            </div>
          </div>

          {/* Benefits Grid Content */}
          {activeAudienceTab === 'students' && (
            <div className="grid-3">
              <div className="card">
                <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--violet-bg)', color: 'var(--violet-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <ShieldCheck size={22} />
                </div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Transparent Eligibility Engine</h3>
                <p style={{ fontSize: '0.875rem' }}>
                  No more mystery rejections. See crystal-clear explanations of CGPA cutoffs, active backlog checks, and departmental criteria before submitting.
                </p>
              </div>

              <div className="card">
                <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--lime-bg)', color: 'var(--lime-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <Calendar size={22} />
                </div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Dedicated Interview Center</h3>
                <p style={{ fontSize: '0.875rem' }}>
                  Synchronized calendar and agenda view for technical rounds, Google Meet/Zoom links, interviewer dossiers, and preparation checklists.
                </p>
              </div>

              <div className="card">
                <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(16, 185, 129, 0.12)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <Award size={22} />
                </div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Smart Offer Comparison</h3>
                <p style={{ fontSize: '0.875rem' }}>
                  Analyze CTC breakdowns (base, bonuses, stock grants), inspect official offer letters, and make informed career commitments with confidence.
                </p>
              </div>
            </div>
          )}

          {activeAudienceTab === 'recruiters' && (
            <div className="grid-3">
              <div className="card">
                <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--violet-bg)', color: 'var(--violet-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <Users size={22} />
                </div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Pre-Vetted Candidate Pipeline</h3>
                <p style={{ fontSize: '0.875rem' }}>
                  Instantly filter senior applicants by verified GPA, department, and technical skills without sorting through unverified CV submissions.
                </p>
              </div>

              <div className="card">
                <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--lime-bg)', color: 'var(--lime-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <Clock size={22} />
                </div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Multi-Stage Drive Workflow</h3>
                <p style={{ fontSize: '0.875rem' }}>
                  Transition applicants across Shortlisted, Technical Interview, and Management rounds with 1-click scheduling and outcome logging.
                </p>
              </div>

              <div className="card">
                <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(16, 185, 129, 0.12)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <Award size={22} />
                </div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Seamless Offer Issuance</h3>
                <p style={{ fontSize: '0.875rem' }}>
                  Issue binding digital offers with transparent compensation packages directly adhering to university placement quotas and timelines.
                </p>
              </div>
            </div>
          )}

          {activeAudienceTab === 'coordinators' && (
            <div className="grid-3">
              <div className="card">
                <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--violet-bg)', color: 'var(--violet-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <Compass size={22} />
                </div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Live Shortlist Simulator</h3>
                <p style={{ fontSize: '0.875rem' }}>
                  Run instant criterion tests against 1,500+ student profiles to project eligible candidate cohorts and download audited CSVs before company visits.
                </p>
              </div>

              <div className="card">
                <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--lime-bg)', color: 'var(--lime-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <ShieldCheck size={22} />
                </div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Automated Policy Enforcement</h3>
                <p style={{ fontSize: '0.875rem' }}>
                  Strict single-offer locks and backlog validations ensure equitable distribution of recruitment drives across the entire student batch.
                </p>
              </div>

              <div className="card">
                <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(16, 185, 129, 0.12)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <TrendingUp size={22} />
                </div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Institutional Funnel Analytics</h3>
                <p style={{ fontSize: '0.875rem' }}>
                  Track department-wise placement velocity, average salary growth, company retention, and unplaced student interventions in real time.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* How It Works (4-Step Flow) */}
      <section style={{
        padding: '5rem 2rem',
        background: '#090d16',
        borderBottom: '1px solid var(--border-dark)'
      }}>
        <div style={{ maxWidth: 1440, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="badge badge-lime" style={{ marginBottom: '0.5rem' }}>The Placement Journey</span>
            <h2 style={{ fontSize: '2.25rem', marginBottom: '0.75rem' }}>How TalentHub Works</h2>
            <p style={{ color: '#94a3b8' }}>A structured, step-by-step career gateway from campus orientation to corporate onboarding.</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1.5rem',
            position: 'relative'
          }}>
            {[
              {
                step: '01',
                title: 'Register & Verify',
                desc: 'Onboard with institutional credentials, upload your ATS-optimized resume, and verify semester CGPA and backlogs.'
              },
              {
                step: '02',
                title: 'Discover & Check',
                desc: 'Browse curated campus drives. Our dynamic eligibility engine validates your department, GPA, and policy compliance instantly.'
              },
              {
                step: '03',
                title: 'Interview & Excel',
                desc: 'Track online assessments, technical rounds, and leadership interviews with synchronized agendas and prep checklists.'
              },
              {
                step: '04',
                title: 'Accept & Launch',
                desc: 'Review digital compensation letters, compare competing offers, and formally secure your career milestone.'
              }
            ].map((st) => (
              <div key={st.step} className="card" style={{ background: '#0e1526' }}>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 800,
                  color: 'var(--violet-light)',
                  fontFamily: 'var(--font-heading)',
                  marginBottom: '0.5rem',
                  opacity: 0.8
                }}>
                  {st.step}
                </div>
                <h4 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '0.5rem' }}>{st.title}</h4>
                <p style={{ fontSize: '0.8125rem', lineHeight: 1.6 }}>{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section (Fictional Examples) */}
      <section style={{
        padding: '5rem 2rem',
        background: '#0c1220',
        borderBottom: '1px solid var(--border-dark)'
      }}>
        <div style={{ maxWidth: 1440, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="badge badge-neutral" style={{ marginBottom: '0.5rem' }}>Campus Voices</span>
            <h2 style={{ fontSize: '2.25rem' }}>What Our Community Says</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>(Representative feedback from pilot campus placement drives)</p>
          </div>

          <div className="grid-3">
            <div className="card" style={{ background: '#090d16' }}>
              <div style={{ display: 'flex', gap: '0.25rem', color: '#fbbf24', marginBottom: '1rem' }}>
                <Star size={16} fill="#fbbf24" /><Star size={16} fill="#fbbf24" /><Star size={16} fill="#fbbf24" /><Star size={16} fill="#fbbf24" /><Star size={16} fill="#fbbf24" />
              </div>
              <p style={{ fontSize: '0.9rem', fontStyle: 'italic', marginBottom: '1.25rem', color: '#cbd5e1' }}>
                "TalentHub eliminated all the panic from placement season. Seeing my exact eligibility status for ApexCloud before applying gave me the confidence to prepare specifically for the round."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #a3e635)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#090d16' }}>
                  RS
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#ffffff' }}>Rohan Sharma</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>CSE Senior, Placed at FinVerve</div>
                </div>
              </div>
            </div>

            <div className="card" style={{ background: '#090d16' }}>
              <div style={{ display: 'flex', gap: '0.25rem', color: '#fbbf24', marginBottom: '1rem' }}>
                <Star size={16} fill="#fbbf24" /><Star size={16} fill="#fbbf24" /><Star size={16} fill="#fbbf24" /><Star size={16} fill="#fbbf24" /><Star size={16} fill="#fbbf24" />
              </div>
              <p style={{ fontSize: '0.9rem', fontStyle: 'italic', marginBottom: '1.25rem', color: '#cbd5e1' }}>
                "We hired 18 exceptional cloud platform associates in 48 hours. The candidate shortlisting and live interview tracking saved our campus talent team over 60 engineering hours."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#ffffff' }}>
                  DN
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#ffffff' }}>Deepak Narayanan</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Head of University Recruiting, ApexCloud</div>
                </div>
              </div>
            </div>

            <div className="card" style={{ background: '#090d16' }}>
              <div style={{ display: 'flex', gap: '0.25rem', color: '#fbbf24', marginBottom: '1rem' }}>
                <Star size={16} fill="#fbbf24" /><Star size={16} fill="#fbbf24" /><Star size={16} fill="#fbbf24" /><Star size={16} fill="#fbbf24" /><Star size={16} fill="#fbbf24" />
              </div>
              <p style={{ fontSize: '0.9rem', fontStyle: 'italic', marginBottom: '1.25rem', color: '#cbd5e1' }}>
                "The live simulation engine alone transformed our operations. We can audit criteria, handle exceptions with full transparency, and generate verified shortlists with one click."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#090d16' }}>
                  SK
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#ffffff' }}>Dr. S. K. Murthy</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Chief Placement Officer & Professor</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Role-Specific Entry Points Section */}
      <section style={{
        padding: '5rem 2rem',
        background: '#070a13'
      }}>
        <div style={{ maxWidth: 1440, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>Direct Portals & Quick Launch</h2>
            <p style={{ color: '#94a3b8' }}>Jump directly into any dedicated workspace designed for your responsibilities.</p>
          </div>

          <div className="grid-3">
            <div className="card card-accent" style={{ padding: '2rem' }}>
              <GraduationCap size={32} style={{ color: 'var(--violet-light)', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem' }}>Student Portal</h3>
              <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                Access verified opportunities, submit applications, track multi-round interviews, and accept official offers.
              </p>
              <button
                onClick={() => {
                  setRole('student');
                  navigate('/dashboard');
                }}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                Launch Student Dashboard
                <ArrowRight size={15} />
              </button>
            </div>

            <div className="card card-lime" style={{ padding: '2rem' }}>
              <Briefcase size={32} style={{ color: 'var(--lime-light)', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem' }}>Recruiter Workspace</h3>
              <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                Publish job openings, screen student profiles, schedule technical assessments, and extend compensation packages.
              </p>
              <button
                onClick={() => {
                  setRole('recruiter');
                  navigate('/recruiter');
                }}
                className="btn btn-lime"
                style={{ width: '100%' }}
              >
                Launch Recruiter Workspace
                <ArrowRight size={15} />
              </button>
            </div>

            <div className="card" style={{ padding: '2rem', borderTop: '3px solid #38bdf8' }}>
              <Layers size={32} style={{ color: '#38bdf8', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem' }}>Placement Coordinator</h3>
              <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                Administer campus drives, run eligibility simulations, enforce single-offer rules, and export audited shortlists.
              </p>
              <button
                onClick={() => {
                  setRole('coordinator');
                  navigate('/coordinator');
                }}
                className="btn btn-secondary"
                style={{ width: '100%', borderColor: 'rgba(56, 189, 248, 0.4)' }}
              >
                Launch Admin Console
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
