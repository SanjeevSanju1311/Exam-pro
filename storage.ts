
import { Exam, Attempt, User } from './types';

const KEYS = {
  EXAMS: 'exampro_exams',
  ATTEMPTS: 'exampro_attempts',
  CURRENT_USER: 'exampro_current_user',
};

export const Storage = {
  getExams: (): Exam[] => {
    try {
      const data = localStorage.getItem(KEYS.EXAMS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Storage Error: Failed to fetch exams", e);
      return [];
    }
  },
  saveExam: (exam: Exam) => {
    const exams = Storage.getExams();
    localStorage.setItem(KEYS.EXAMS, JSON.stringify([...exams, exam]));
  },
  updateExam: (id: string, updates: Partial<Exam>) => {
    const exams = Storage.getExams();
    const updated = exams.map(e => e.id === id ? { ...e, ...updates } : e);
    localStorage.setItem(KEYS.EXAMS, JSON.stringify(updated));
  },
  deleteExam: (id: string) => {
    const exams = Storage.getExams();
    const filtered = exams.filter(e => e.id !== id);
    localStorage.setItem(KEYS.EXAMS, JSON.stringify(filtered));
  },
  getAttempts: (examId?: string): Attempt[] => {
    try {
      const data = localStorage.getItem(KEYS.ATTEMPTS);
      const attempts: Attempt[] = data ? JSON.parse(data) : [];
      return examId ? attempts.filter(a => a.examId === examId) : attempts;
    } catch (e) {
      console.error("Storage Error: Failed to fetch attempts", e);
      return [];
    }
  },
  saveAttempt: (attempt: Attempt) => {
    const attempts = Storage.getAttempts();
    localStorage.setItem(KEYS.ATTEMPTS, JSON.stringify([...attempts, attempt]));
  },
  getCurrentUser: (): User | null => {
    try {
      const data = localStorage.getItem(KEYS.CURRENT_USER);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },
  setCurrentUser: (user: User | null) => {
    if (user) {
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(KEYS.CURRENT_USER);
    }
  },
  clearAll: () => {
    localStorage.clear();
    window.location.reload();
  }
};
