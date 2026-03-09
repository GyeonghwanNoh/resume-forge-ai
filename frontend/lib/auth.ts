import { useEffect, useState } from 'react';
import api from './api';

export interface User {
  id: string;
  email: string;
  created_at: string;
  is_active: boolean;
  plan?: 'free' | 'pro';
  billing_status?: string | null;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);

    const raw = localStorage.getItem('user');
    if (!raw) return;

    try {
      setUser(JSON.parse(raw));
    } catch {
      localStorage.removeItem('user');
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  return {
    user,
    isAuthenticated,
    logout,
  };
}

export const authService = {
  signup: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/signup', { email, password });
    return response.data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export const resumeService = {
  uploadResume: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/api/resumes/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  listResumes: async () => {
    const response = await api.get('/api/resumes/list');
    return response.data;
  },

  analyzeResume: async (resumeId: string) => {
    const response = await api.post(`/api/resumes/analyze/${resumeId}`);
    return response.data;
  },

  analyzeForJob: async (resumeId: string, jobDescription: string) => {
    const response = await api.post('/api/resumes/analyze-for-job', {
      resume_id: resumeId,
      job_description: jobDescription,
    });
    return response.data;
  },

  rewriteBullets: async (bullets: string[]) => {
    const response = await api.post('/api/resumes/rewrite-bullets', {
      bullets,
    });
    return response.data;
  },

  improveResume: async (resumeId: string, issuesToFix: string[]) => {
    const response = await api.post('/api/resumes/improve', {
      resume_id: resumeId,
      issues_to_fix: issuesToFix,
    });
    return response.data;
  },

  generateCoverLetter: async (resumeId: string, jobDescription: string) => {
    const response = await api.post('/api/resumes/cover-letter', {
      resume_id: resumeId,
      job_description: jobDescription,
    });
    return response.data;
  },

  generateInterviewQuestions: async (jobDescription: string) => {
    const response = await api.post('/api/resumes/interview-questions', {
      job_description: jobDescription,
    });
    return response.data;
  },

  getUsageSummary: async () => {
    const response = await api.get('/api/usage/summary');
    return response.data;
  },
};
