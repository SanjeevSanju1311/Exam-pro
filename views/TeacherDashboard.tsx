
import React, { useState, useEffect } from 'react';
import { Storage } from '../storage';
import { Exam, Attempt } from '../types';
import { Plus, BarChart2, Calendar, Clock, ArrowRight, Trash2, StopCircle } from 'lucide-react';

interface TeacherDashboardProps {
  onCreateExam: () => void;
  onViewAnalytics: (exam: Exam) => void;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onCreateExam, onViewAnalytics }) => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000); // Refresh data every 5s to see new attempts
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    setExams(Storage.getExams());
    setAttempts(Storage.getAttempts());
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent card click
    if (window.confirm("Are you sure you want to delete this exam? This action cannot be undone.")) {
      Storage.deleteExam(id);
      loadData();
    }
  };

  const handleStopExam = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent card click
    if (window.confirm("Stop this exam immediately? All active student sessions will be submitted automatically.")) {
      Storage.updateExam(id, { isStopped: true });
      loadData();
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Teacher Dashboard</h1>
          <p className="text-slate-500 mt-1">Monitor, create and manage student examinations</p>
        </div>
        <button
          onClick={onCreateExam}
          className="w-full sm:w-auto bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center shadow-lg shadow-indigo-100"
        >
          <Plus className="mr-2 h-5 w-5" />
          Create New Exam
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.length > 0 ? (
          exams.map((exam) => {
            const examAttempts = attempts.filter(a => a.examId === exam.id);
            const startTime = new Date(exam.startTime);
            const now = new Date();
            const endTime = new Date(startTime.getTime() + exam.durationMinutes * 60000);
            const isLive = now >= startTime && now <= endTime && !exam.isStopped;
            const hasEnded = now > endTime || exam.isStopped;
            
            return (
              <div 
                key={exam.id} 
                className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-xl hover:border-indigo-100 transition-all group flex flex-col h-full relative"
                onClick={() => onViewAnalytics(exam)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      isLive ? 'bg-green-100 text-green-700' : 
                      hasEnded ? 'bg-slate-100 text-slate-500' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {isLive ? 'Live Now' : hasEnded ? 'Ended' : 'Scheduled'}
                    </span>
                    {exam.isStopped && (
                       <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700">
                        Terminated
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={(e) => handleDelete(e, exam.id)}
                    className="text-slate-300 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">{exam.title}</h3>
                <p className="text-slate-500 text-sm mb-6 flex-grow line-clamp-2">{exam.description}</p>

                <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="flex items-center text-xs text-slate-600 font-medium">
                    <Calendar className="h-3.5 w-3.5 mr-2 text-indigo-500" />
                    {startTime.toLocaleDateString()} at {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="flex items-center text-xs text-slate-600 font-medium">
                    <Clock className="h-3.5 w-3.5 mr-2 text-indigo-500" />
                    {exam.durationMinutes} Minutes Session
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex items-center justify-between mt-auto gap-2">
                  <div className="flex flex-col">
                    <span className="text-xl font-black text-indigo-600 leading-none">{examAttempts.length}</span>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter mt-1">Submissions</span>
                  </div>
                  <div className="flex gap-2">
                    {isLive && (
                      <button
                        onClick={(e) => handleStopExam(e, exam.id)}
                        className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-sm flex items-center group/stop"
                        title="Stop Exam Immediately"
                      >
                        <StopCircle className="h-5 w-5" />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewAnalytics(exam);
                      }}
                      className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-800 transition-all flex items-center group/btn"
                    >
                      Results
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
            <div className="bg-slate-50 p-6 rounded-full mb-6 ring-8 ring-slate-50/50">
              <BarChart2 className="h-12 w-12 text-slate-300" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">No examinations yet</h3>
            <p className="text-slate-500 mt-2 max-w-sm mx-auto">Your dashboard is empty. Ready to evaluate your students with a professional assessment?</p>
            <button
              onClick={onCreateExam}
              className="mt-8 bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-600 transition-all shadow-lg"
            >
              Create First Exam
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
