
import React, { useState, useEffect } from 'react';
import { Storage } from './storage';
import { User, Exam, Attempt } from './types';
import Login from './views/Login';
import TeacherDashboard from './views/TeacherDashboard';
import StudentDashboard from './views/StudentDashboard';
import ExamCreator from './views/ExamCreator';
import ExamTaker from './views/ExamTaker';
import TeacherAnalytics from './views/TeacherAnalytics';
import Navbar from './components/Navbar';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'dashboard' | 'create-exam' | 'take-exam' | 'analytics'>('dashboard');
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [attempts, setAttempts] = useState<Attempt[]>([]);

  useEffect(() => {
    const savedUser = Storage.getCurrentUser();
    if (savedUser) setUser(savedUser);
    
    // Initial sync of attempts
    setAttempts(Storage.getAttempts());
  }, []);

  const handleLogin = (name: string, role: User['role'], rollNo?: string) => {
    const newUser: User = { id: Math.random().toString(36).substr(2, 9), name, role, rollNo };
    setUser(newUser);
    Storage.setCurrentUser(newUser);
  };

  const handleLogout = () => {
    setUser(null);
    Storage.setCurrentUser(null);
    setView('dashboard');
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} onLogout={handleLogout} onHome={() => setView('dashboard')} />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {view === 'dashboard' && (
          user.role === 'TEACHER' ? (
            <TeacherDashboard 
              onCreateExam={() => setView('create-exam')} 
              onViewAnalytics={(exam) => {
                setSelectedExam(exam);
                setView('analytics');
              }}
            />
          ) : (
            <StudentDashboard 
              onTakeExam={(exam) => {
                setSelectedExam(exam);
                setView('take-exam');
              }}
            />
          )
        )}

        {view === 'create-exam' && user.role === 'TEACHER' && (
          <ExamCreator 
            onCancel={() => setView('dashboard')} 
            onSave={() => setView('dashboard')} 
          />
        )}

        {view === 'take-exam' && selectedExam && (
          <ExamTaker 
            exam={selectedExam} 
            user={user}
            onComplete={() => {
              setView('dashboard');
              setAttempts(Storage.getAttempts());
            }} 
          />
        )}

        {view === 'analytics' && selectedExam && (
          <TeacherAnalytics 
            exam={selectedExam} 
            attempts={attempts.filter(a => a.examId === selectedExam.id)}
            onBack={() => setView('dashboard')}
          />
        )}
      </main>
    </div>
  );
};

export default App;
