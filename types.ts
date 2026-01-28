
export type Role = 'TEACHER' | 'STUDENT';

export interface User {
  id: string;
  name: string;
  role: Role;
  rollNo?: string;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
  marks: number;
  negativeMarks: number;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  startTime: string; // ISO string
  durationMinutes: number;
  questions: Question[];
  creatorId: string;
  isStopped?: boolean;
}

export interface Attempt {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  startTime: string;
  endTime: string;
  answers: Record<string, number>; // questionId -> selectedIndex
  score: number;
  maxScore: number;
  tabSwitchCount: number;
}

export interface ExamAnalytics {
  examId: string;
  totalAttempts: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  passCount: number;
  failCount: number;
  averageTimeTaken: number; // in seconds
  minTimeTaken: number;
  maxTimeTaken: number;
  questionStats: {
    questionId: string;
    correctCount: number;
    wrongCount: number;
    text: string;
  }[];
}
