import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  Filter, 
  Bookmark, 
  ArrowRight, 
  Clock, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  CheckCircle2, 
  XCircle, 
  RotateCcw,
  Sparkles,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Building
} from 'lucide-react';
import { Branch, WorkMode } from '../types';

export const ExploreJobsPage: React.FC = () => {
  const { jobs, currentStudent, savedJobIds, toggleSaveJob, checkEligibility } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  // Tab state: 'all' | 'eligible' | 'saved'
  const activeTab = searchParams.get('tab') || 'all';
  const urlSearch = searchParams.get('search') || '';

  // Filter states
  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [selectedCompany, setSelectedCompany] = useState<string>('ALL');
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>('ALL');
  const [selectedBranch, setSelectedBranch] = useState<string>('ALL');
  const [minPackage, setMinPackage] = useState<number>(0);
  const [maxCgpaCutoff, setMaxCgpaCutoff] = useState<number>(10);
  const [sortBy, setSortBy] = useState<'relevance' | 'package_desc' | 'newest' | 'deadline'>('relevance');

  // Reset filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCompany('ALL');
    setSelectedWorkMode('ALL');
    setSelectedBranch('ALL');
    setMinPackage(0);
    setMaxCgpaCutoff(10);
    setSortBy('relevance');
    setSearchParams({});
  };

  const handleTabChange = (tab: string) => {
    const params = new URLSearchParams(searchParams);
    if (tab === 'all') {
      params.delete('tab');
    } else {
      params.set('tab', tab);
    }
    setSearchParams(params);
  };

  // Filter and sort evaluation
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // 1. Tab filtering
      if (activeTab === 'saved' && !savedJobIds.includes(job.id)) {
        return false;
      }
      if (activeTab === 'eligible') {
        const elig = checkEligibility(currentStudent, job);
        if (!elig.isEligible) return false;
      }

      // 2. Search keyword
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = job.title.toLowerCase().includes(q);
        const matchesCompany = job.companyName.toLowerCase().includes(q);
        const matchesSkills = job.skillsRequired.some((s) => s.toLowerCase().includes(q));
        const matchesLocation = job.location.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCompany && !matchesSkills && !matchesLocation) {
          return false;
        }
      }

      // 3. Company filter
      if (selectedCompany !== 'ALL' && job.companyId !== selectedCompany) {
        return false;
      }

      // 4. Work mode
      if (selectedWorkMode !== 'ALL' && job.workMode !== selectedWorkMode) {
        return false;
      }

      // 5. Branch filter
      if (selectedBranch !== 'ALL') {
        if (job.allowedBranches.length > 0 && !job.allowedBranches.includes(selectedBranch as Branch)) {
          return false;
        }
      }

      // 6. Min Package
      if (minPackage > 0 && job.packageLPA < minPackage) {
        return false;
      }

      // 7. Max CGPA requirement cutoff
      if (job.minCgpa > maxCgpaCutoff) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'package_desc') {
        return b.packageLPA - a.packageLPA;
      }
      if (sortBy === 'deadline') {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      if (sortBy === 'newest') {
        return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
      }
      return 0; // relevance / natural order
    });
  }, [jobs, activeTab, savedJobIds, searchQuery, selectedCompany, selectedWorkMode, selectedBranch, minPackage, maxCgpaCutoff, sortBy, currentStudent, checkEligibility]);

  const uniqueCompanies = Array.from(new Set(jobs.map((j) => ({ id: j.companyId, name: j.companyName }))));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header & Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.35rem' }}>Explore Campus Recruitment Drives</h1>
          <p style={{ fontSize: '0.875rem' }}>
            Discover and apply to pre-vetted corporate recruitment drives with real-time eligibility checks
          </p>
        </div>

        {/* Tab Controls */}
        <div style={{
          display: 'inline-flex',
          background: '#090d16',
          border: '1px solid var(--border-dark)',
          borderRadius: 12,
          padding: '0.3rem',
          gap: '0.35rem'
        }}>
          <button
            onClick={() => handleTabChange('all')}
            className={`btn ${activeTab === 'all' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '0.45rem 1rem', fontSize: '0.8125rem', border: 'none' }}
          >
            All Opportunities ({jobs.length})
          </button>
          <button
            onClick={() => handleTabChange('eligible')}
            className={`btn ${activeTab === 'eligible' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '0.45rem 1rem', fontSize: '0.8125rem', border: 'none' }}
          >
            <ShieldCheck size={14} />
            Eligible for Me ({jobs.filter((j) => checkEligibility(currentStudent, j).isEligible).length})
          </button>
          <button
            onClick={() => handleTabChange('saved')}
            className={`btn ${activeTab === 'saved' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '0.45rem 1rem', fontSize: '0.8125rem', border: 'none' }}
          >
            <Bookmark size={14} />
            Saved Jobs ({savedJobIds.length})
          </button>
        </div>
      </div>

      {/* Filter Toolbar Card */}
      <div className="card" style={{ padding: '1.25rem 1.5rem', background: '#0e1526' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: '1rem', alignItems: 'flex-end' }}>
          {/* Search Input */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Search Drive or Keyword</label>
            <div className="input-with-icon">
              <Search size={16} className="input-icon" />
              <input
                type="text"
                className="form-input"
                placeholder="Job title, company, skills (Go, PyTorch, C++)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Company Dropdown */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Company</label>
            <select
              className="form-select"
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
            >
              <option value="ALL">All Companies</option>
              {uniqueCompanies.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Work Mode */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Work Mode</label>
            <select
              className="form-select"
              value={selectedWorkMode}
              onChange={(e) => setSelectedWorkMode(e.target.value)}
            >
              <option value="ALL">Any Work Mode</option>
              <option value="On-site">On-site</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Remote">Remote</option>
            </select>
          </div>

          {/* Min Package Filter */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Min Package: {minPackage > 0 ? `₹${minPackage} LPA` : 'Any'}</label>
            <select
              className="form-select"
              value={minPackage}
              onChange={(e) => setMinPackage(Number(e.target.value))}
            >
              <option value={0}>Any CTC</option>
              <option value={10}>₹10+ LPA</option>
              <option value={15}>₹15+ LPA</option>
              <option value={20}>₹20+ LPA</option>
              <option value={25}>₹25+ LPA</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Sort Order</label>
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="relevance">Featured & Relevant</option>
              <option value="package_desc">Highest Package (LPA)</option>
              <option value="newest">Newest Drives</option>
              <option value="deadline">Closing Soonest</option>
            </select>
          </div>
        </div>

        {/* Bottom Filter Controls (Reset, Count) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '0.85rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '0.8125rem' }}>
          <div style={{ color: '#94a3b8' }}>
            Showing <strong style={{ color: '#ffffff' }}>{filteredJobs.length}</strong> active opportunities matching criteria
          </div>
          <button
            onClick={handleResetFilters}
            className="btn btn-outline"
            style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem', gap: '0.35rem' }}
          >
            <RotateCcw size={12} />
            Reset All Filters
          </button>
        </div>
      </div>

      {/* Job Cards Grid */}
      {filteredJobs.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '1.5rem' }}>
          {filteredJobs.map((job) => {
            const eligibility = checkEligibility(currentStudent, job);
            const isSaved = savedJobIds.includes(job.id);

            return (
              <div
                key={job.id}
                className="card card-hover"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  background: '#0d1322',
                  borderTop: job.isOpen ? `3px solid ${job.companyColor}` : '3px solid #64748b',
                  opacity: job.isOpen ? 1 : 0.75
                }}
              >
                <div>
                  {/* Card Header: Company Logo, Title, Bookmark */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <div style={{
                        width: 46,
                        height: 46,
                        borderRadius: 12,
                        background: job.companyColor,
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '1.1rem',
                        boxShadow: `0 4px 12px ${job.companyColor}33`
                      }}>
                        {job.companyLogo}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.8125rem', color: '#94a3b8', fontWeight: 600 }}>{job.companyName}</div>
                        <h3 style={{ fontSize: '1.05rem', color: '#ffffff', lineHeight: 1.3 }}>{job.title}</h3>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleSaveJob(job.id)}
                      style={{
                        color: isSaved ? 'var(--lime-light)' : '#64748b',
                        padding: '0.35rem',
                        borderRadius: 6,
                        background: isSaved ? 'rgba(132, 204, 22, 0.1)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                      title={isSaved ? "Remove bookmark" : "Save opportunity"}
                      aria-label={isSaved ? "Remove bookmark" : "Save opportunity"}
                    >
                      <Bookmark size={18} fill={isSaved ? 'var(--lime-light)' : 'none'} />
                    </button>
                  </div>

                  {/* CTC Package & Work Details */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: '#090d16',
                    border: '1px solid var(--border-dark)',
                    borderRadius: 10,
                    padding: '0.65rem 0.9rem',
                    marginBottom: '1rem'
                  }}>
                    <div>
                      <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Total CTC Package</span>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--lime-light)', fontFamily: 'var(--font-heading)' }}>
                        ₹{job.packageLPA} LPA
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>{job.type}</span>
                      <div style={{ fontSize: '0.75rem', color: '#cbd5e1', marginTop: '0.2rem' }}>
                        {job.location} ({job.workMode})
                      </div>
                    </div>
                  </div>

                  {/* Skills tags preview */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
                    {job.skillsRequired.slice(0, 4).map((skill) => (
                      <span key={skill} className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                        {skill}
                      </span>
                    ))}
                    {job.skillsRequired.length > 4 && (
                      <span style={{ fontSize: '0.7rem', color: '#64748b', alignSelf: 'center' }}>
                        +{job.skillsRequired.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer: Eligibility Status & Action Button */}
                <div style={{ borderTop: '1px solid var(--border-dark)', paddingTop: '0.85rem', marginTop: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    {/* Eligibility Badge with explanation */}
                    {!job.isOpen ? (
                      <span className="badge badge-rose">
                        <XCircle size={13} />
                        Drive Closed
                      </span>
                    ) : eligibility.isEligible ? (
                      <span className="badge badge-emerald">
                        <CheckCircle2 size={13} />
                        Eligible for You
                      </span>
                    ) : (
                      <span className="badge badge-rose" title={eligibility.primaryIneligibilityReason}>
                        <XCircle size={13} />
                        Ineligible
                      </span>
                    )}

                    {/* Deadline Countdown */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem', color: '#94a3b8' }}>
                      <Clock size={12} />
                      <span>Closes {job.deadline}</span>
                    </div>
                  </div>

                  <Link
                    to={`/jobs/${job.id}`}
                    className={`btn ${eligibility.isEligible && job.isOpen ? 'btn-primary' : 'btn-outline'}`}
                    style={{ width: '100%', fontSize: '0.8125rem', padding: '0.55rem' }}
                  >
                    View Details & Eligibility Checklist
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem', background: '#0e1526' }}>
          <Briefcase size={44} style={{ color: '#64748b', margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No opportunities found</h3>
          <p style={{ fontSize: '0.875rem', maxWidth: 460, margin: '0 auto 1.5rem auto' }}>
            No recruitment drives match your current filter selection. Try adjusting the salary threshold, work mode, or clear the search keywords.
          </p>
          <button onClick={handleResetFilters} className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
            <RotateCcw size={14} />
            Reset All Filters
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          div[style*="grid-template-columns: 2fr 1fr 1fr 1fr 1fr"] {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 600px) {
          div[style*="grid-template-columns: 2fr 1fr 1fr 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
