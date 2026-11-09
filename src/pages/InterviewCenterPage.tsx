import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  MapPin, 
  CheckCircle2, 
  User, 
  ExternalLink, 
  FileCheck, 
  Bell, 
  Sparkles, 
  AlertCircle,
  List,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { InterviewSlot } from '../types';

export const InterviewCenterPage: React.FC = () => {
  const { interviews, currentStudent, showToast } = useApp();

  const [viewMode, setViewMode] = useState<'agenda' | 'calendar'>('agenda');
  const [selectedRoundFilter, setSelectedRoundFilter] = useState<'ALL' | 'Scheduled' | 'Completed'>('ALL');
  
  // Interactive preparation checklist state
  const [checklist, setChecklist] = useState([
    { id: '1', task: 'Revise Core DSA: Trees, HashMaps, and Dynamic Programming', completed: true },
    { id: '2', task: 'Review System Design: Rate Limiting & Distributed Caching', completed: true },
    { id: '3', task: 'Hardware Check: Test HD Webcam, Noise-Cancelling Mic, and Lighting', completed: true },
    { id: '4', task: 'Study Company Products: Review ApexCloud multi-region whitepapers', completed: false },
    { id: '5', task: 'Prepare STAR Stories: Leadership and conflict resolution examples', completed: false }
  ]);

  // Reminder preferences
  const [emailAlert, setEmailAlert] = useState(true);
  const [smsAlert, setSmsAlert] = useState(true);
  const [calendarSync, setCalendarSync] = useState(true);

  // Student's interviews
  const studentInterviews = interviews.filter((i) => i.studentId === currentStudent.id);

  const filteredInterviews = studentInterviews.filter((i) => {
    if (selectedRoundFilter === 'ALL') return true;
    return i.status === selectedRoundFilter;
  });

  const toggleChecklistItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const handleCopyLink = (link: string) => {
    navigator.clipboard?.writeText(link);
    showToast('Meeting Link Copied', 'Virtual interview URL copied to clipboard', 'info');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header & View Toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', marginBottom: '0.25rem' }}>Campus Interview Center</h1>
          <p style={{ fontSize: '0.875rem' }}>
            Manage scheduled technical rounds, video meeting links, interviewer dossiers, and preparation checklists
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {/* Status Filter */}
          <select
            className="form-select"
            value={selectedRoundFilter}
            onChange={(e) => setSelectedRoundFilter(e.target.value as any)}
            style={{ width: 'auto', fontSize: '0.8125rem' }}
          >
            <option value="ALL">All Rounds ({studentInterviews.length})</option>
            <option value="Scheduled">Upcoming / Scheduled</option>
            <option value="Completed">Completed Past Rounds</option>
          </select>

          {/* Agenda vs Calendar View Toggle */}
          <div style={{
            display: 'inline-flex',
            background: '#090d16',
            border: '1px solid var(--border-dark)',
            borderRadius: 10,
            padding: '0.25rem'
          }}>
            <button
              onClick={() => setViewMode('agenda')}
              className={`btn ${viewMode === 'agenda' ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem', border: 'none' }}
            >
              <List size={14} />
              Agenda
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`btn ${viewMode === 'calendar' ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem', border: 'none' }}
            >
              <CalendarIcon size={14} />
              Calendar
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Interview Listings & Prep Hub */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.9fr 1.1fr', gap: '2rem' }}>
        {/* Left Column: Agenda Cards or Calendar Matrix */}
        <div>
          {viewMode === 'agenda' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {filteredInterviews.length > 0 ? (
                filteredInterviews.map((slot) => {
                  const isScheduled = slot.status === 'Scheduled';
                  return (
                    <div
                      key={slot.id}
                      className="card"
                      style={{
                        background: '#0d1322',
                        borderLeft: isScheduled ? '4px solid var(--violet-primary)' : '4px solid var(--status-emerald)'
                      }}
                    >
                      {/* Top Row: Company, Round Badge & Status */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <h3 style={{ fontSize: '1.2rem', color: '#ffffff' }}>{slot.companyName}</h3>
                            <span className={`badge ${isScheduled ? 'badge-amber' : 'badge-emerald'}`}>
                              {slot.status}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.9rem', color: 'var(--violet-light)', fontWeight: 600, marginTop: '0.15rem' }}>
                            Round {slot.roundNumber}: {slot.roundTitle}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                            Role: {slot.jobTitle}
                          </div>
                        </div>

                        {/* Date and Time Badge */}
                        <div style={{
                          background: '#090d16',
                          border: '1px solid var(--border-dark)',
                          borderRadius: 10,
                          padding: '0.5rem 0.85rem',
                          textAlign: 'right'
                        }}>
                          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>
                            {slot.date}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '0.25rem', justifyContent: 'flex-end' }}>
                            <Clock size={12} />
                            {slot.time}
                          </div>
                        </div>
                      </div>

                      {/* Interviewer Dossier & Venue */}
                      <div style={{
                        background: '#090d16',
                        border: '1px solid var(--border-dark)',
                        borderRadius: 12,
                        padding: '1rem',
                        marginBottom: '1rem',
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '1rem'
                      }}>
                        <div>
                          <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Interviewer</span>
                          <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#ffffff' }}>{slot.interviewerName}</div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{slot.interviewerTitle}</div>
                        </div>

                        <div>
                          <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Venue & Format</span>
                          <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#ffffff' }}>{slot.venue}</div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Duration: {slot.durationMinutes} Minutes</div>
                        </div>
                      </div>

                      {/* Technical Notes / Instructions */}
                      {slot.notes && (
                        <div style={{
                          background: 'rgba(99, 102, 241, 0.05)',
                          border: '1px solid rgba(99, 102, 241, 0.15)',
                          borderRadius: 10,
                          padding: '0.75rem 1rem',
                          fontSize: '0.8125rem',
                          color: '#cbd5e1',
                          marginBottom: '1.25rem'
                        }}>
                          <strong style={{ color: 'var(--violet-light)' }}>Focus Areas & Preparation Notes:</strong> {slot.notes}
                        </div>
                      )}

                      {/* Meeting Links & Quick Actions */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                        {isScheduled ? (
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <a
                              href={slot.meetingLink}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-lime"
                              style={{ fontSize: '0.8125rem', padding: '0.45rem 1.1rem' }}
                            >
                              <Video size={15} />
                              Join Virtual Meeting
                            </a>
                            <button
                              onClick={() => handleCopyLink(slot.meetingLink)}
                              className="btn btn-outline"
                              style={{ fontSize: '0.75rem', padding: '0.45rem 0.75rem' }}
                            >
                              Copy Link
                            </button>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--status-emerald)', fontSize: '0.8125rem', fontWeight: 600 }}>
                            <CheckCircle2 size={16} />
                            <span>Round Completed • Feedback recorded by committee</span>
                          </div>
                        )}

                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          Campus Drive ID: {slot.jobId}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem', background: '#0e1526' }}>
                  <CalendarIcon size={40} style={{ color: '#64748b', margin: '0 auto 1rem auto' }} />
                  <h3 style={{ fontSize: '1.15rem', marginBottom: '0.35rem' }}>No interviews found</h3>
                  <p style={{ fontSize: '0.85rem' }}>There are no interviews matching the current filter.</p>
                </div>
              )}
            </div>
          ) : (
            /* Calendar Matrix View */
            <div className="card" style={{ background: '#0d1322' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.15rem' }}>October 2026 Interview Calendar</h3>
                <span className="badge badge-violet">Final Year Placement Drive Schedule</span>
              </div>

              {/* Calendar Grid Representation */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: '0.5rem',
                textAlign: 'center',
                fontSize: '0.8125rem'
              }}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} style={{ fontWeight: 700, color: '#64748b', padding: '0.5rem 0' }}>{day}</div>
                ))}

                {/* Days 1 to 31 mock representation with highlighted interview days */}
                {Array.from({ length: 31 }, (_, i) => i + 1).map((date) => {
                  const isOct12 = date === 12; // ApexCloud interview
                  const isOct6 = date === 6;   // FinVerve past round

                  return (
                    <div
                      key={date}
                      style={{
                        padding: '0.75rem 0.25rem',
                        background: isOct12 ? 'rgba(99, 102, 241, 0.25)' : isOct6 ? 'rgba(16, 185, 129, 0.15)' : '#090d16',
                        border: isOct12 ? '1px solid var(--violet-primary)' : isOct6 ? '1px solid var(--status-emerald)' : '1px solid var(--border-dark)',
                        borderRadius: 8,
                        minHeight: 65,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <span style={{ fontWeight: 700, color: isOct12 ? 'var(--lime-light)' : '#ffffff' }}>{date}</span>
                      {isOct12 && (
                        <span style={{ fontSize: '0.62rem', background: 'var(--violet-primary)', color: '#ffffff', padding: '0.1rem 0.3rem', borderRadius: 4, fontWeight: 700 }}>
                          ApexCloud 11AM
                        </span>
                      )}
                      {isOct6 && (
                        <span style={{ fontSize: '0.62rem', background: '#10b981', color: '#090d16', padding: '0.1rem 0.3rem', borderRadius: 4, fontWeight: 700 }}>
                          FinVerve HR
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Interactive Prep Checklist & Notification Reminders */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Prep Checklist Card */}
          <div className="card card-accent">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <h3 style={{ fontSize: '1.15rem' }}>Interview Preparation Checklist</h3>
              <span className="badge badge-lime">
                {checklist.filter(c => c.completed).length} / {checklist.length} Completed
              </span>
            </div>
            <p style={{ fontSize: '0.8125rem', marginBottom: '1.25rem' }}>
              Mark off items before logging into your technical interview room
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {checklist.map((item) => (
                <label
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.65rem',
                    background: item.completed ? 'rgba(16, 185, 129, 0.05)' : '#090d16',
                    border: item.completed ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid var(--border-dark)',
                    borderRadius: 10,
                    padding: '0.75rem 0.85rem',
                    cursor: 'pointer',
                    fontSize: '0.8125rem',
                    color: item.completed ? '#e2e8f0' : '#cbd5e1'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => toggleChecklistItem(item.id)}
                    style={{ accentColor: 'var(--lime-primary)', width: 16, height: 16, marginTop: 2, flexShrink: 0 }}
                  />
                  <span style={{ textDecoration: item.completed ? 'line-through' : 'none', opacity: item.completed ? 0.75 : 1 }}>
                    {item.task}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Reminder Preferences Card */}
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bell size={18} style={{ color: 'var(--violet-light)' }} />
              Interview Alert Preferences
            </h3>
            <p style={{ fontSize: '0.8125rem', marginBottom: '1.25rem' }}>
              Configure proactive notifications for upcoming rounds
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.85rem' }}>
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                <div>
                  <div style={{ fontWeight: 600, color: '#ffffff' }}>College Email Alerts</div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Send meeting invite 2 hours before round</div>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlert}
                  onChange={(e) => setEmailAlert(e.target.checked)}
                  style={{ accentColor: 'var(--violet-primary)', width: 18, height: 18 }}
                />
              </label>

              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                <div>
                  <div style={{ fontWeight: 600, color: '#ffffff' }}>SMS Emergency Reminder</div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>15-minute SMS alert to verified mobile number</div>
                </div>
                <input
                  type="checkbox"
                  checked={smsAlert}
                  onChange={(e) => setSmsAlert(e.target.checked)}
                  style={{ accentColor: 'var(--violet-primary)', width: 18, height: 18 }}
                />
              </label>

              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                <div>
                  <div style={{ fontWeight: 600, color: '#ffffff' }}>Google / Apple Calendar Sync</div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Automatically export .ics meeting appointments</div>
                </div>
                <input
                  type="checkbox"
                  checked={calendarSync}
                  onChange={(e) => setCalendarSync(e.target.checked)}
                  style={{ accentColor: 'var(--violet-primary)', width: 18, height: 18 }}
                />
              </label>
            </div>
          </div>
        </div>
      </div>

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
