import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Role, 
  Student, 
  JobListing, 
  Application, 
  InterviewSlot, 
  Offer, 
  AuditLog, 
  EligibilityResult, 
  ApplicationStatus 
} from '../types';
import { 
  initialStudent, 
  sampleStudents, 
  sampleJobListings, 
  initialApplications, 
  initialInterviews, 
  initialOffers, 
  initialAuditLogs 
} from '../data/mockData';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  currentStudent: Student;
  updateCurrentStudent: (updates: Partial<Student>) => void;
  students: Student[];
  jobs: JobListing[];
  applications: Application[];
  interviews: InterviewSlot[];
  offers: Offer[];
  auditLogs: AuditLog[];
  savedJobIds: string[];
  toasts: ToastMessage[];
  showToast: (title: string, message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
  toggleSaveJob: (jobId: string) => void;
  checkEligibility: (student: Student, job: JobListing) => EligibilityResult;
  applyForJob: (jobId: string) => { success: boolean; message: string };
  updateApplicationStatus: (applicationId: string, newStatus: ApplicationStatus, notes?: string) => boolean;
  scheduleInterview: (slot: Omit<InterviewSlot, 'id'>) => boolean;
  issueOffer: (offerData: Omit<Offer, 'id' | 'status'>) => { success: boolean; message: string };
  acceptOffer: (offerId: string) => { success: boolean; message: string };
  declineOffer: (offerId: string) => { success: boolean; message: string };
  createJob: (newJob: Partial<JobListing>) => void;
  toggleJobStatus: (jobId: string) => void;
  simulateShortlisting: (jobId: string) => {
    totalStudents: number;
    eligibleCount: number;
    ineligibleCount: number;
    eligibleStudents: Student[];
    ineligibleDetails: { student: Student; reasons: string[] }[];
  };
  exportShortlistCSV: (jobId: string) => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'talenthub_v1_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Local storage state initialization with fallbacks
  const [role, setRoleState] = useState<Role>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}role`);
    return (saved as Role) || 'student';
  });

  const [currentStudent, setCurrentStudent] = useState<Student>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}current_student`);
    return saved ? JSON.parse(saved) : initialStudent;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}students`);
    return saved ? JSON.parse(saved) : sampleStudents;
  });

  const [jobs, setJobs] = useState<JobListing[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}jobs`);
    return saved ? JSON.parse(saved) : sampleJobListings;
  });

  const [applications, setApplications] = useState<Application[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}applications`);
    return saved ? JSON.parse(saved) : initialApplications;
  });

  const [interviews, setInterviews] = useState<InterviewSlot[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}interviews`);
    return saved ? JSON.parse(saved) : initialInterviews;
  });

  const [offers, setOffers] = useState<Offer[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}offers`);
    return saved ? JSON.parse(saved) : initialOffers;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}audit_logs`);
    return saved ? JSON.parse(saved) : initialAuditLogs;
  });

  const [savedJobIds, setSavedJobIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}saved_jobs`);
    return saved ? JSON.parse(saved) : ['job_apex_01', 'job_quantum_04'];
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}role`, role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}current_student`, JSON.stringify(currentStudent));
  }, [currentStudent]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}students`, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}jobs`, JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}applications`, JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}interviews`, JSON.stringify(interviews));
  }, [interviews]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}offers`, JSON.stringify(offers));
  }, [offers]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}audit_logs`, JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}saved_jobs`, JSON.stringify(savedJobIds));
  }, [savedJobIds]);

  const showToast = (title: string, message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    showToast('Role Switched', `Active workspace role updated to: ${newRole.toUpperCase()}`, 'info');
  };

  const updateCurrentStudent = (updates: Partial<Student>) => {
    setCurrentStudent((prev) => {
      const updated = { ...prev, ...updates };
      // Also update in students array
      setStudents((all) => all.map((s) => (s.id === prev.id ? updated : s)));
      return updated;
    });
    showToast('Profile Updated', 'Student profile details successfully saved', 'success');
  };

  const toggleSaveJob = (jobId: string) => {
    setSavedJobIds((prev) => {
      const isSaved = prev.includes(jobId);
      if (isSaved) {
        showToast('Bookmark Removed', 'Job removed from your saved list', 'info');
        return prev.filter((id) => id !== jobId);
      } else {
        showToast('Job Saved', 'Job bookmarked to your saved opportunities', 'success');
        return [...prev, jobId];
      }
    });
  };

  // Live Eligibility Evaluator enforcing strict business rules
  const checkEligibility = (student: Student, job: JobListing): EligibilityResult => {
    const reasons: { criterion: string; isMet: boolean; explanation: string }[] = [];
    let isEligible = true;
    let primaryIneligibilityReason: string | undefined;

    // Rule 6: Check if job is open
    if (!job.isOpen) {
      return {
        isEligible: false,
        overallStatus: 'Closed',
        reasons: [{ criterion: 'Drive Status', isMet: false, explanation: 'This recruitment drive has concluded and is no longer accepting submissions.' }],
        primaryIneligibilityReason: 'Recruitment drive is closed'
      };
    }

    // Rule 1: Student CGPA must be >= job.minCgpa (CGPA == minCgpa is explicitly ELIGIBLE!)
    const cgpaMet = student.cgpa >= job.minCgpa;
    reasons.push({
      criterion: 'Academic Cutoff (CGPA)',
      isMet: cgpaMet,
      explanation: cgpaMet
        ? `Your CGPA (${student.cgpa.toFixed(2)}) meets the minimum requirement of ${job.minCgpa.toFixed(2)}.`
        : `Your CGPA (${student.cgpa.toFixed(2)}) is below the required threshold of ${job.minCgpa.toFixed(2)}.`
    });
    if (!cgpaMet && isEligible) {
      isEligible = false;
      primaryIneligibilityReason = `CGPA ${student.cgpa.toFixed(2)} is below minimum cutoff of ${job.minCgpa.toFixed(2)}`;
    }

    // Rule 2: Active backlogs <= maxActiveBacklogsAllowed (Only active backlogs affect eligibility)
    const backlogsMet = student.activeBacklogs <= job.maxActiveBacklogsAllowed;
    reasons.push({
      criterion: 'Active Backlog Clearance',
      isMet: backlogsMet,
      explanation: backlogsMet
        ? `You have ${student.activeBacklogs} active backlogs (${student.clearedBacklogs} cleared backlogs do not disqualify you).`
        : `You have ${student.activeBacklogs} active backlogs. This drive permits at most ${job.maxActiveBacklogsAllowed} active backlogs.`
    });
    if (!backlogsMet && isEligible) {
      isEligible = false;
      primaryIneligibilityReason = `Has ${student.activeBacklogs} active backlog(s); 0 allowed`;
    }

    // Rule 4: Allowed branches (empty array = open to all)
    const branchMet = job.allowedBranches.length === 0 || job.allowedBranches.includes(student.branch);
    reasons.push({
      criterion: 'Branch Eligibility',
      isMet: branchMet,
      explanation: branchMet
        ? job.allowedBranches.length === 0
          ? 'This recruitment drive is open to students from all academic branches.'
          : `Your branch (${student.branch}) is included in eligible departments (${job.allowedBranches.join(', ')}).`
        : `Your branch (${student.branch}) is not in the company's approved departments: ${job.allowedBranches.join(', ')}.`
    });
    if (!branchMet && isEligible) {
      isEligible = false;
      primaryIneligibilityReason = `Branch (${student.branch}) is not in allowed departments`;
    }

    // Rule 3: Season Accepted Offer Rule
    const offerPolicyMet = !student.hasAcceptedOffer || job.allowAcceptedOfferHolders;
    reasons.push({
      criterion: 'Placement Season Policy',
      isMet: offerPolicyMet,
      explanation: offerPolicyMet
        ? 'You have not accepted a binding job offer in the current placement season.'
        : 'Under university placement rules: you have already accepted an offer this season and cannot apply to further drives to ensure fair opportunity distribution.'
    });
    if (!offerPolicyMet && isEligible) {
      isEligible = false;
      primaryIneligibilityReason = 'Already accepted an offer this placement season (Placement Policy)';
    }

    // Rule 5: Cannot apply to same company more than once during season
    const existingCompanyApp = applications.find(
      (app) => app.studentId === student.id && app.companyId === job.companyId
    );
    if (existingCompanyApp) {
      reasons.push({
        criterion: 'Single Company Application Limit',
        isMet: false,
        explanation: `You have already submitted an active application for ${job.companyName} (${existingCompanyApp.jobTitle}) on ${existingCompanyApp.appliedDate}.`
      });
      isEligible = false;
      primaryIneligibilityReason = `Already applied to ${job.companyName} this season`;
    }

    return {
      isEligible,
      overallStatus: isEligible ? 'Eligible' : 'Ineligible',
      reasons,
      primaryIneligibilityReason
    };
  };

  const applyForJob = (jobId: string): { success: boolean; message: string } => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) {
      return { success: false, message: 'Drive listing not found.' };
    }

    const eligibility = checkEligibility(currentStudent, job);
    if (!eligibility.isEligible) {
      showToast('Application Ineligible', eligibility.primaryIneligibilityReason || 'You do not meet the criteria.', 'error');
      return { success: false, message: eligibility.primaryIneligibilityReason || 'Eligibility criteria not met.' };
    }

    const newApp: Application = {
      id: `app_${Date.now()}`,
      jobId: job.id,
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      studentEmail: currentStudent.email,
      studentUsn: currentStudent.usn,
      studentBranch: currentStudent.branch,
      studentCgpa: currentStudent.cgpa,
      companyId: job.companyId,
      companyName: job.companyName,
      jobTitle: job.title,
      packageLPA: job.packageLPA,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Applied',
      lastUpdated: new Date().toISOString().split('T')[0],
      hasOffer: false,
      timeline: [
        {
          stage: 'Applied',
          timestamp: new Date().toLocaleString(),
          notes: `Application submitted with resume: ${currentStudent.resumeFileName}`
        }
      ]
    };

    setApplications((prev) => [newApp, ...prev]);

    // Add audit log
    const newLog: AuditLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      actor: currentStudent.name,
      actorRole: 'Student',
      action: 'Application Submitted',
      target: `${job.companyName} (${job.title})`,
      details: `CGPA ${currentStudent.cgpa.toFixed(2)}, Branch ${currentStudent.branch}`
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    showToast('Application Submitted!', `Successfully applied to ${job.companyName} for ${job.title}`, 'success');
    return { success: true, message: 'Application submitted successfully!' };
  };

  // Rule 7: Status must progress in ordered sequence
  const orderedStages: ApplicationStatus[] = [
    'Applied',
    'Shortlisted',
    'Interview Scheduled',
    'Interviewed',
    'Offered',
    'Accepted'
  ];

  const updateApplicationStatus = (
    applicationId: string, 
    newStatus: ApplicationStatus, 
    notes?: string
  ): boolean => {
    const targetApp = applications.find((a) => a.id === applicationId);
    if (!targetApp) return false;

    // Check progression unless rejecting
    if (newStatus !== 'Rejected') {
      const currentIndex = orderedStages.indexOf(targetApp.status);
      const targetIndex = orderedStages.indexOf(newStatus);
      if (currentIndex !== -1 && targetIndex !== -1 && targetIndex < currentIndex) {
        showToast('Invalid Stage Progression', `Application status cannot move backwards from ${targetApp.status} to ${newStatus}.`, 'warning');
        return false;
      }
    }

    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== applicationId) return app;
        const newTimeline = [
          ...app.timeline,
          {
            stage: newStatus,
            timestamp: new Date().toLocaleString(),
            notes: notes || `Application transitioned to ${newStatus}`
          }
        ];
        return {
          ...app,
          status: newStatus,
          lastUpdated: new Date().toISOString().split('T')[0],
          timeline: newTimeline
        };
      })
    );

    // Audit log
    const newLog: AuditLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      actor: role === 'recruiter' ? 'Recruiter Team' : 'Placement Coordinator',
      actorRole: role,
      action: `Status Updated to ${newStatus}`,
      target: `${targetApp.studentName} — ${targetApp.companyName}`,
      details: notes || `Stage transition: ${newStatus}`
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    showToast('Status Updated', `Application moved to "${newStatus}"`, 'success');
    return true;
  };

  const scheduleInterview = (slotData: Omit<InterviewSlot, 'id'>): boolean => {
    const newSlot: InterviewSlot = {
      ...slotData,
      id: `int_${Date.now()}`
    };

    setInterviews((prev) => [newSlot, ...prev]);

    // Also advance the application status if currently Shortlisted or Applied
    updateApplicationStatus(
      slotData.applicationId, 
      'Interview Scheduled', 
      `Interview scheduled: Round ${slotData.roundNumber} on ${slotData.date} at ${slotData.time}`
    );

    showToast('Interview Scheduled', `Interview confirmed for ${slotData.studentName} on ${slotData.date}`, 'success');
    return true;
  };

  // Rule 8 & 9: Issue Offer
  const issueOffer = (offerData: Omit<Offer, 'id' | 'status'>): { success: boolean; message: string } => {
    const app = applications.find((a) => a.id === offerData.applicationId);
    if (!app) return { success: false, message: 'Application not found' };

    // Rule 9: An application may have at most one offer
    if (app.hasOffer) {
      showToast('Offer Already Issued', 'An active offer has already been issued for this application.', 'warning');
      return { success: false, message: 'Offer already issued' };
    }

    // Rule 8: An offer may be issued only after the interview stage is completed
    if (app.status !== 'Interviewed') {
      showToast('Interview Required', `Cannot issue offer while application is in '${app.status}'. Interviews must be completed first.`, 'warning');
      return { success: false, message: 'Candidate must complete interview round before offer issuance.' };
    }

    const offerId = `off_${Date.now()}`;
    const newOffer: Offer = {
      ...offerData,
      id: offerId,
      status: 'Pending Decision'
    };

    setOffers((prev) => [newOffer, ...prev]);

    // Update application
    setApplications((prev) =>
      prev.map((a) => {
        if (a.id === offerData.applicationId) {
          return {
            ...a,
            status: 'Offered',
            hasOffer: true,
            offerId: offerId,
            timeline: [
              ...a.timeline,
              {
                stage: 'Offered',
                timestamp: new Date().toLocaleString(),
                notes: `Official compensation offer extended: ₹${offerData.packageLPA.toFixed(2)} LPA`
              }
            ]
          };
        }
        return a;
      })
    );

    // Audit log
    setAuditLogs((prev) => [
      {
        id: `log_${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        actor: 'Recruiter',
        actorRole: 'recruiter',
        action: 'Offer Extended',
        target: `${offerData.studentName} (${offerData.companyName})`,
        details: `CTC: ₹${offerData.packageLPA} LPA`
      },
      ...prev
    ]);

    showToast('Offer Issued!', `Extended official offer of ₹${offerData.packageLPA} LPA to ${offerData.studentName}`, 'success');
    return { success: true, message: 'Offer successfully extended.' };
  };

  // Rule 3: Offer Acceptance & Season Placement Lock
  const acceptOffer = (offerId: string): { success: boolean; message: string } => {
    const targetOffer = offers.find((o) => o.id === offerId);
    if (!targetOffer) return { success: false, message: 'Offer not found' };

    // Update offer status
    setOffers((prev) =>
      prev.map((o) => (o.id === offerId ? { ...o, status: 'Accepted' as const } : o))
    );

    // Update current student (or student in array)
    setCurrentStudent((prev) => ({
      ...prev,
      hasAcceptedOffer: true,
      acceptedOfferCompanyId: targetOffer.companyId
    }));
    setStudents((prev) =>
      prev.map((s) =>
        s.id === targetOffer.studentId
          ? { ...s, hasAcceptedOffer: true, acceptedOfferCompanyId: targetOffer.companyId }
          : s
      )
    );

    // Update application
    updateApplicationStatus(
      targetOffer.applicationId, 
      'Accepted', 
      `Candidate formally accepted the offer of ₹${targetOffer.packageLPA} LPA. Placement status locked.`
    );

    // Audit log
    setAuditLogs((prev) => [
      {
        id: `log_${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        actor: targetOffer.studentName,
        actorRole: 'Student',
        action: 'Offer Accepted & Placement Locked',
        target: targetOffer.companyName,
        details: `Accepted package of ₹${targetOffer.packageLPA} LPA. Student now locked from further drives per college placement policy.`
      },
      ...prev
    ]);

    showToast(
      'Congratulations!', 
      `You accepted the offer from ${targetOffer.companyName}! Your placement status is now locked.`, 
      'success'
    );
    return { success: true, message: 'Offer accepted successfully.' };
  };

  const declineOffer = (offerId: string): { success: boolean; message: string } => {
    const targetOffer = offers.find((o) => o.id === offerId);
    if (!targetOffer) return { success: false, message: 'Offer not found' };

    setOffers((prev) =>
      prev.map((o) => (o.id === offerId ? { ...o, status: 'Declined' as const } : o))
    );

    showToast('Offer Declined', `You declined the offer from ${targetOffer.companyName}.`, 'info');
    return { success: true, message: 'Offer declined.' };
  };

  const createJob = (newJobData: Partial<JobListing>) => {
    const newJob: JobListing = {
      id: `job_${Date.now()}`,
      companyId: newJobData.companyId || 'comp_apex',
      companyName: newJobData.companyName || 'ApexCloud Technologies',
      companyLogo: newJobData.companyLogo || 'AC',
      companyColor: newJobData.companyColor || '#6366f1',
      title: newJobData.title || 'Software Engineer',
      roleCategory: newJobData.roleCategory || 'Software Engineering',
      type: newJobData.type || 'Full-Time FTE',
      workMode: newJobData.workMode || 'Hybrid',
      location: newJobData.location || 'Bengaluru',
      packageLPA: Number(newJobData.packageLPA) || 15.0,
      baseSalaryLPA: Number(newJobData.baseSalaryLPA) || 12.0,
      performanceBonusLPA: Number(newJobData.performanceBonusLPA) || 3.0,
      minCgpa: Number(newJobData.minCgpa) || 7.0,
      allowedBranches: newJobData.allowedBranches || [],
      maxActiveBacklogsAllowed: 0,
      allowAcceptedOfferHolders: false,
      deadline: newJobData.deadline || '2026-11-30',
      postedDate: new Date().toISOString().split('T')[0],
      isOpen: true,
      vacancies: Number(newJobData.vacancies) || 10,
      description: newJobData.description || 'Exciting engineering role on cutting-edge systems.',
      responsibilities: newJobData.responsibilities || ['Develop scalable microservices', 'Maintain automated tests'],
      requirements: newJobData.requirements || ['Proficiency in programming and CS fundamentals'],
      skillsRequired: newJobData.skillsRequired || ['JavaScript', 'Python', 'SQL'],
      perks: newJobData.perks || ['Health insurance', 'Learning allowance'],
      rounds: newJobData.rounds || [
        { roundNumber: 1, title: 'Online Assessment', type: 'Online Assessment', description: '60 mins', tentativeDate: '2026-12-05' }
      ]
    };

    setJobs((prev) => [newJob, ...prev]);
    showToast('Job Published', `New listing "${newJob.title}" is now open for students`, 'success');
  };

  const toggleJobStatus = (jobId: string) => {
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id === jobId) {
          const updatedState = !j.isOpen;
          showToast('Drive Status Toggled', `${j.title} is now ${updatedState ? 'OPEN' : 'CLOSED'}`, 'info');
          return { ...j, isOpen: updatedState };
        }
        return j;
      })
    );
  };

  // Live Shortlisting Simulation Engine for Coordinator Console
  const simulateShortlisting = (jobId: string) => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) {
      return {
        totalStudents: students.length,
        eligibleCount: 0,
        ineligibleCount: 0,
        eligibleStudents: [],
        ineligibleDetails: []
      };
    }

    const eligibleStudents: Student[] = [];
    const ineligibleDetails: { student: Student; reasons: string[] }[] = [];

    students.forEach((student) => {
      const studentReasons: string[] = [];

      // 1. CGPA Check
      if (student.cgpa < job.minCgpa) {
        studentReasons.push(`CGPA ${student.cgpa.toFixed(2)} is lower than required minimum ${job.minCgpa.toFixed(2)}`);
      }

      // 2. Active backlogs check
      if (student.activeBacklogs > job.maxActiveBacklogsAllowed) {
        studentReasons.push(`Active backlogs (${student.activeBacklogs}) exceed limit of ${job.maxActiveBacklogsAllowed}`);
      }

      // 3. Branch check
      if (job.allowedBranches.length > 0 && !job.allowedBranches.includes(student.branch)) {
        studentReasons.push(`Branch ${student.branch} is not in approved list: [${job.allowedBranches.join(', ')}]`);
      }

      // 4. Accepted offer check
      if (student.hasAcceptedOffer && !job.allowAcceptedOfferHolders) {
        studentReasons.push('Already accepted an offer this season (Placement Policy exclusion)');
      }

      if (studentReasons.length === 0) {
        eligibleStudents.push(student);
      } else {
        ineligibleDetails.push({ student, reasons: studentReasons });
      }
    });

    return {
      totalStudents: students.length,
      eligibleCount: eligibleStudents.length,
      ineligibleCount: ineligibleDetails.length,
      eligibleStudents,
      ineligibleDetails
    };
  };

  const exportShortlistCSV = (jobId: string) => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return;

    const sim = simulateShortlisting(jobId);
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'USN,Full Name,College Email,Branch,CGPA,Active Backlogs,Cleared Backlogs,Eligibility Status,Disqualification Notes\n';

    sim.eligibleStudents.forEach((s) => {
      csvContent += `"${s.usn}","${s.name}","${s.email}","${s.branch}",${s.cgpa},${s.activeBacklogs},${s.clearedBacklogs},"ELIGIBLE","Meets all criteria"\n`;
    });

    sim.ineligibleDetails.forEach(({ student: s, reasons }) => {
      csvContent += `"${s.usn}","${s.name}","${s.email}","${s.branch}",${s.cgpa},${s.activeBacklogs},${s.clearedBacklogs},"INELIGIBLE","${reasons.join('; ')}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TalentHub_Shortlist_${job.companyName.replace(/\s+/g, '_')}_${job.title.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Shortlist Exported', `Downloaded CSV for ${job.title} (${sim.eligibleCount} eligible candidates)`, 'success');
  };

  const resetDemoData = () => {
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}role`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}current_student`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}students`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}jobs`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}applications`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}interviews`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}offers`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}audit_logs`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}saved_jobs`);

    setRoleState('student');
    setCurrentStudent(initialStudent);
    setStudents(sampleStudents);
    setJobs(sampleJobListings);
    setApplications(initialApplications);
    setInterviews(initialInterviews);
    setOffers(initialOffers);
    setAuditLogs(initialAuditLogs);
    setSavedJobIds(['job_apex_01', 'job_quantum_04']);

    showToast('Demo State Reset', 'Pristine demo datasets and rules restored.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        currentStudent,
        updateCurrentStudent,
        students,
        jobs,
        applications,
        interviews,
        offers,
        auditLogs,
        savedJobIds,
        toasts,
        showToast,
        removeToast,
        toggleSaveJob,
        checkEligibility,
        applyForJob,
        updateApplicationStatus,
        scheduleInterview,
        issueOffer,
        acceptOffer,
        declineOffer,
        createJob,
        toggleJobStatus,
        simulateShortlisting,
        exportShortlistCSV,
        resetDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
