export type Role = 'student' | 'recruiter' | 'coordinator' | 'guest';

export type Branch = 'CSE' | 'ISE' | 'ECE' | 'EEE' | 'MECH' | 'CIVIL' | 'AI & DS' | 'BIOTECH';

export type ApplicationStatus = 
  | 'Applied' 
  | 'Shortlisted' 
  | 'Interview Scheduled' 
  | 'Interviewed' 
  | 'Offered' 
  | 'Accepted' 
  | 'Rejected';

export type JobType = 'Full-Time FTE' | 'Internship + PPO' | '6-Month Internship' | 'Summer Internship';
export type WorkMode = 'On-site' | 'Hybrid' | 'Remote';

export interface Student {
  id: string;
  name: string;
  email: string;
  usn: string;
  branch: Branch;
  graduationYear: number;
  cgpa: number;
  activeBacklogs: number;
  clearedBacklogs: number;
  skills: string[];
  bio: string;
  phone: string;
  linkedin: string;
  github: string;
  resumeFileName: string;
  resumeLastUpdated: string;
  resumeAtsScore: number;
  hasAcceptedOffer: boolean;
  acceptedOfferCompanyId?: string;
  profileCompletionPercentage: number;
  visibilityPreference: 'All Recruiters' | 'Only Eligible Drives' | 'Anonymous until Interview';
  projects: {
    id: string;
    title: string;
    tech: string[];
    description: string;
    link?: string;
  }[];
  certifications: {
    id: string;
    name: string;
    issuer: string;
    year: number;
  }[];
  experience: {
    id: string;
    role: string;
    company: string;
    duration: string;
    description: string;
  }[];
}

export interface Company {
  id: string;
  name: string;
  tagline: string;
  logo: string; // monogram or url
  color: string;
  industry: string;
  location: string;
  website: string;
  size: string;
  description: string;
}

export interface JobListing {
  id: string;
  companyId: string;
  companyName: string;
  companyLogo: string;
  companyColor: string;
  title: string;
  roleCategory: string;
  type: JobType;
  workMode: WorkMode;
  location: string;
  packageLPA: number;
  stipendPerMonth?: number;
  baseSalaryLPA?: number;
  performanceBonusLPA?: number;
  minCgpa: number;
  allowedBranches: Branch[]; // empty array means open to all
  maxActiveBacklogsAllowed: number; // default 0
  allowAcceptedOfferHolders: boolean; // default false (season rule)
  deadline: string; // ISO date or formatted
  postedDate: string;
  isOpen: boolean;
  vacancies: number;
  description: string;
  responsibilities: string[];
  requirements: string[];
  skillsRequired: string[];
  perks: string[];
  rounds: {
    roundNumber: number;
    title: string;
    type: 'Online Assessment' | 'Technical Round 1' | 'Technical Round 2' | 'System Design' | 'HR & Leadership';
    description: string;
    tentativeDate: string;
  }[];
}

export interface Application {
  id: string;
  jobId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentUsn: string;
  studentBranch: Branch;
  studentCgpa: number;
  companyId: string;
  companyName: string;
  jobTitle: string;
  packageLPA: number;
  appliedDate: string;
  status: ApplicationStatus;
  lastUpdated: string;
  timeline: {
    stage: ApplicationStatus;
    timestamp: string;
    notes?: string;
  }[];
  rejectionReason?: string;
  interviewFeedback?: string;
  hasOffer: boolean;
  offerId?: string;
}

export interface InterviewSlot {
  id: string;
  applicationId: string;
  jobId: string;
  studentId: string;
  studentName: string;
  companyId: string;
  companyName: string;
  jobTitle: string;
  roundNumber: number;
  roundTitle: string;
  date: string;
  time: string;
  durationMinutes: number;
  interviewerName: string;
  interviewerTitle: string;
  meetingLink: string;
  venue: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  notes: string;
  studentChecklistCompleted: boolean;
}

export interface Offer {
  id: string;
  applicationId: string;
  jobId: string;
  studentId: string;
  studentName: string;
  companyId: string;
  companyName: string;
  jobTitle: string;
  packageLPA: number;
  baseSalaryLPA: number;
  retentionBonusLPA: number;
  stockOptionsValue?: string;
  location: string;
  offerDate: string;
  acceptanceDeadline: string;
  status: 'Pending Decision' | 'Accepted' | 'Declined' | 'Expired';
  letterUrl: string;
  termsSummary: string;
  policyWarningNotice: string;
}

export interface EligibilityResult {
  isEligible: boolean;
  overallStatus: 'Eligible' | 'Ineligible' | 'Closed';
  reasons: {
    criterion: string;
    isMet: boolean;
    explanation: string;
  }[];
  primaryIneligibilityReason?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  action: string;
  target: string;
  details: string;
}
