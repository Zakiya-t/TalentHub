/**
 * TalentHub API Client Service
 * Connects the React Frontend to the FastAPI + SQLite/PostgreSQL Relational Backend
 */

export const API_BASE_URL = 'http://localhost:8000/api';

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('talenthub_jwt_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('talenthub_jwt_token', token);
    } else {
      localStorage.removeItem('talenthub_jwt_token');
    }
  }

  getToken(): string | null {
    return this.token || localStorage.getItem('talenthub_jwt_token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Network request failed' }));
      throw new Error(errorData.detail || `HTTP Error ${response.status}`);
    }

    return response.json();
  }

  // Health
  async checkHealth(): Promise<{ status: string; tables: number }> {
    return this.request('/health');
  }

  // Auth
  async login(email: string, password: string) {
    const data = await this.request<{
      access_token: string;
      token_type: string;
      role: string;
      email: string;
      student_id?: number;
      company_id?: number;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(data.access_token);
    return data;
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // Jobs
  async getJobs() {
    return this.request<any[]>('/jobs');
  }

  async getJobById(id: number | string) {
    return this.request<any>(`/jobs/${id}`);
  }

  // Eligibility Evaluation (Part B - Recorded in Table 11)
  async checkEligibility(jobId: number | string, studentId?: number | string) {
    return this.request<{
      id: number;
      student_id: number;
      job_id: number;
      eligible: boolean;
      reason: string;
      checked_at: string;
    }>(`/jobs/${jobId}/check-eligibility${studentId ? `?student_id=${studentId}` : ''}`, {
      method: 'POST',
    });
  }

  // Applications (Table 5 & Table 10)
  async getApplications() {
    return this.request<any[]>('/applications');
  }

  async applyToJob(jobId: number | string) {
    return this.request<any>('/applications', {
      method: 'POST',
      body: JSON.stringify({ job_id: Number(jobId) }),
    });
  }

  async updateApplicationStatus(id: number | string, newStatus: string, notes?: string) {
    return this.request<any>(`/applications/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ new_status: newStatus, notes }),
    });
  }

  // Offers (Table 7)
  async getOffers() {
    return this.request<any[]>('/offers');
  }

  async issueOffer(applicationId: number | string, packageLpa: number) {
    return this.request<any>('/offers', {
      method: 'POST',
      body: JSON.stringify({ application_id: Number(applicationId), package_lpa: packageLpa }),
    });
  }

  async acceptOffer(offerId: number | string) {
    return this.request<any>(`/offers/${offerId}/accept`, {
      method: 'POST',
    });
  }

  // Student Consents (Table 9)
  async getConsents() {
    return this.request<any[]>('/consents');
  }

  async submitConsent(purpose: string, version: string = 'v1.0') {
    return this.request<any>('/consents', {
      method: 'POST',
      body: JSON.stringify({ purpose, consent_version: version, consent_given: true }),
    });
  }

  async withdrawConsent(id: number | string) {
    return this.request<any>(`/consents/${id}`, {
      method: 'DELETE',
    });
  }

  // Audits (Table 10 & 11)
  async getStatusHistory(applicationId?: number | string) {
    return this.request<any[]>(`/audits/status-history${applicationId ? `?application_id=${applicationId}` : ''}`);
  }

  async getEligibilityDecisions(studentId?: number | string, jobId?: number | string) {
    const params = new URLSearchParams();
    if (studentId) params.append('student_id', String(studentId));
    if (jobId) params.append('job_id', String(jobId));
    return this.request<any[]>(`/audits/eligibility-decisions?${params.toString()}`);
  }
}

export const apiService = new ApiService();

