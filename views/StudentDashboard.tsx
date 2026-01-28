
import React, { useState, useEffect } from 'react';
import { Storage } from '../storage';
import { Exam, Attempt } from '../types';
import { Calendar, Clock, ChevronRight, CheckCircle, Lock, Trophy, BarChart3 } from 'lucide-react';

interface StudentDashboardProps {
  onTakeExam: (exam: Exam) => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ onTakeExam }) => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const currentUser = Storage.getCurrentUser();

  useEffect(() => {
    setExams(Storage.getExams());
    setAttempts(Storage.getAttempts().filter(a => a.studentId === currentUser?.id));
  }, [currentUser?.id]);

  const getExamStatus = (exam: Exam) => {
    const startTime = new Date(exam.startTime).getTime();
    const now = new Date().getTime();
    const endTime = startTime + (exam.durationMinutes * 60 * 1000);
    
    if (now < startTime) return 'UPCOMING';
    if (now >= startTime && now <= endTime) return 'LIVE';
    return 'FINISHED';
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Student Dashboard</h1>
          <p className="text-slate-500 mt-1">Ready for your next challenge, {currentUser?.name}?</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 flex items-center shadow-sm">
            <Trophy className="h-5 w-5 text-amber-500 mr-2" />
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Completed</p>
              <p className="text-sm font-bold text-slate-700">{attempts.length} Exams</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-indigo-600" />
            Active & Upcoming Exams
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {exams.length > 0 ? (
              exams.map((exam) => {
                const status = getExamStatus(exam);
                const alreadyAttempted = attempts.some(a => a.examId === exam.id);
                
                return (
                  <div key={exam.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col group hover:border-indigo-200 transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        status === 'LIVE' ? 'bg-green-100 text-green-700' : 
                        status === 'UPCOMING' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {status}
                      </span>
                      {alreadyAttempted && (
                        <span className="flex items-center text-xs text-green-600 font-bold">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Attempted
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 mb-2">{exam.title}</h3>
                    <p className="text-slate-500 text-sm mb-6 line-clamp-2">{exam.description}</p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div className="flex items-center text-[10px] text-slate-400 font-bold uppercase mb-1">
                          <Calendar className="h-3 w-3 mr-1" /> Date
                        </div>
                        <div className="text-xs font-semibold text-slate-700">
                          {new Date(exam.startTime).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div className="flex items-center text-[10px] text-slate-400 font-bold uppercase mb-1">
                          <Clock className="h-3 w-3 mr-1" /> Duration
                        </div>
                        <div className="text-xs font-semibold text-slate-700">
                          {exam.durationMinutes} mins
                        </div>
                      </div>
                    </div>

                    {status === 'LIVE' && !alreadyAttempted ? (
                      <button
                        onClick={() => onTakeExam(exam)}
                        className="mt-auto w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-indigo-600 transition-all flex items-center justify-center group shadow-md"
                      >
                        Start Exam
                        <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    ) : status === 'UPCOMING' ? (
                      <button disabled className="mt-auto w-full bg-slate-100 text-slate-400 font-bold py-3 rounded-xl flex items-center justify-center cursor-not-allowed border border-slate-200">
                        <Lock className="mr-2 h-4 w-4" />
                        Locked
                      </button>
                    ) : (
                      <div className="mt-auto py-3 text-center bg-slate-50 text-slate-400 rounded-xl font-bold text-sm border border-slate-100">
                        Exam Unavailable
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 text-center">
                <Calendar className="h-10 w-10 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">No examinations scheduled yet.</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-indigo-600" />
            Your Performance
          </h2>
          
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Recent Results</p>
            </div>
            {attempts.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {attempts.slice().reverse().map(attempt => {
                  const exam = exams.find(e => e.id === attempt.examId);
                  const percentage = Math.round((attempt.score / (attempt.maxScore || 1)) * 100);
                  
                  return (
                    <div key={attempt.id} className="p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-slate-800 text-sm truncate pr-4">
                          {exam?.title || 'Unknown Exam'}
                        </h4>
                        <span className={`text-xs font-bold ${percentage >= 40 ? 'text-green-600' : 'text-red-500'}`}>
                          {percentage}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">
                          {new Date(attempt.endTime).toLocaleDateString()}
                        </span>
                        <span className="text-xs font-black text-slate-700">
                          {attempt.score}/{attempt.maxScore}
                        </span>
                      </div>
                      <div className="mt-2 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${percentage >= 40 ? 'bg-green-500' : 'bg-red-500'}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-sm text-slate-400">No records found yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
