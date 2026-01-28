
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Exam, Attempt, User } from '../types';
import { Storage } from '../storage';
import { Clock, ChevronRight, ChevronLeft, AlertCircle, CheckCircle, Save } from 'lucide-react';

interface ExamTakerProps {
  exam: Exam;
  user: User;
  onComplete: () => void;
}

const ExamTaker: React.FC<ExamTakerProps> = ({ exam: initialExam, user, onComplete }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(initialExam.durationMinutes * 60);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const startTimeRef = useRef(new Date().toISOString());
  const finishedRef = useRef(false);
  const tabSwitchCountRef = useRef(0);

  useEffect(() => {
    finishedRef.current = finished;
  }, [finished]);

  useEffect(() => {
    tabSwitchCountRef.current = tabSwitchCount;
  }, [tabSwitchCount]);

  const calculateResults = (currentAnswers: Record<string, number>) => {
    let totalScore = 0;
    let possibleScore = 0;
    
    initialExam.questions.forEach(q => {
      possibleScore += q.marks;
      const selectedIdx = currentAnswers[q.id];
      if (selectedIdx === q.correctOptionIndex) {
        totalScore += q.marks;
      } else if (selectedIdx !== undefined) {
        totalScore -= q.negativeMarks;
      }
    });

    return { score: totalScore, maxScore: possibleScore };
  };

  const performSubmission = useCallback((currentAnswers: Record<string, number>, reason: string) => {
    if (finishedRef.current) return;
    
    setIsSyncing(true);
    console.log(`Submitting exam. Reason: ${reason}`);

    const results = calculateResults(currentAnswers);
    
    const attempt: Attempt = {
      id: Math.random().toString(36).substr(2, 9),
      examId: initialExam.id,
      studentId: user.id,
      studentName: user.name,
      rollNo: user.rollNo || 'N/A',
      startTime: startTimeRef.current,
      endTime: new Date().toISOString(),
      answers: currentAnswers,
      score: results.score,
      maxScore: results.maxScore,
      tabSwitchCount: tabSwitchCountRef.current
    };

    try {
      Storage.saveAttempt(attempt);
      setFinalScore(results.score);
      setMaxScore(results.maxScore);
      setFinished(true);
      console.log("Submission successful");
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Failed to save your exam attempt. Please try again.");
    } finally {
      setIsSyncing(false);
    }
  }, [initialExam, user]);

  const handleManualSubmit = () => {
    const totalQuestions = initialExam.questions.length;
    const answeredCount = Object.keys(answers).length;
    const unansweredCount = totalQuestions - answeredCount;

    let confirmationMessage = "Are you sure you want to submit your exam?";
    
    if (unansweredCount > 0) {
      confirmationMessage = `WARNING: You have ${unansweredCount} unanswered question(s).\n\nAre you sure you want to submit and end the exam? You will not be able to return to this screen.`;
    } else {
      confirmationMessage = "You have answered all questions. Submit and finish the exam now?";
    }

    if (window.confirm(confirmationMessage)) {
      performSubmission(answers, "Manual Submission");
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (timeLeft === 0 && !finished) {
      performSubmission(answers, "Time Expired");
    }
  }, [timeLeft, finished, performSubmission, answers]);

  useEffect(() => {
    const pollInterval = setInterval(() => {
      const exams = Storage.getExams();
      const currentExam = exams.find(e => e.id === initialExam.id);
      if (currentExam?.isStopped && !finishedRef.current) {
        alert("The examiner has ended this session. Your progress is being saved now.");
        performSubmission(answers, "Teacher Terminated");
      }
    }, 5000);

    const handleVisibilityChange = () => {
      if (document.hidden && !finishedRef.current) {
        setTabSwitchCount(prev => prev + 1);
      }
    };

    const handleBlur = () => {
        if (!finishedRef.current) {
            setTabSwitchCount(prev => prev + 1);
        }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    return () => {
      clearInterval(pollInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, [initialExam.id, performSubmission, answers]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (finished) {
    return (
      <div className="max-w-md mx-auto py-16 text-center animate-in zoom-in duration-300">
        <div className="bg-white rounded-3xl p-10 shadow-xl border border-slate-100">
          <div className="bg-green-100 p-5 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-600 h-10 w-10" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Exam Result</h2>
          <p className="text-slate-500 mb-8">Your exam has been successfully recorded.</p>
          
          <div className="bg-slate-50 rounded-2xl p-6 mb-8 grid grid-cols-2 gap-4 border border-slate-100">
            <div className="text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Marks Obtained</p>
              <p className="text-3xl font-black text-slate-900">{finalScore.toFixed(1)}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Max Score</p>
              <p className="text-3xl font-black text-slate-400">{maxScore}</p>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex justify-between text-xs font-bold mb-1.5">
              <span className="text-slate-400 uppercase">Performance</span>
              <span className="text-indigo-600 font-black">{Math.max(0, Math.round((finalScore / (maxScore || 1)) * 100))}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
               <div 
                className="h-full bg-indigo-600 transition-all duration-1000"
                style={{ width: `${Math.max(0, Math.round((finalScore / (maxScore || 1)) * 100))}%` }}
               />
            </div>
          </div>

          <button
            onClick={onComplete}
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = initialExam.questions[currentIdx];

  return (
    <div className="max-w-5xl mx-auto pb-20">
      {/* Header Sticky Bar - The Main Submit Button */}
      <div className="sticky top-20 z-40 bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl p-4 shadow-sm mb-8 flex justify-between items-center">
        <div className="flex items-center">
          <div className={`p-2 rounded-lg mr-3 ${timeLeft < 60 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-indigo-100 text-indigo-600'}`}>
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Time Remaining</p>
            <p className={`text-xl font-bold font-mono ${timeLeft < 60 ? 'text-red-600' : 'text-slate-900'}`}>
              {formatTime(timeLeft)}
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-2">
          {initialExam.questions.map((_, i) => (
            <div
              key={i}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold border-2 transition-all cursor-pointer ${
                i === currentIdx ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 
                answers[initialExam.questions[i].id] !== undefined ? 'bg-slate-900 border-slate-900 text-white' : 'border-slate-100 text-slate-300'
              }`}
              onClick={() => setCurrentIdx(i)}
            >
              {i + 1}
            </div>
          ))}
        </div>

        <button
          onClick={handleManualSubmit}
          disabled={isSyncing}
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center group"
        >
          {isSyncing ? "Syncing..." : "Submit Exam"}
          <Save className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 md:p-12 min-h-[550px] flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
               <CheckCircle className="h-40 w-40" />
            </div>

            <div className="flex justify-between items-start mb-10">
              <div>
                <span className="text-sm font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">
                  Question {currentIdx + 1} of {initialExam.questions.length}
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-6 leading-relaxed max-w-2xl">
                  {currentQuestion.text}
                </h2>
              </div>
              <div className="flex flex-col items-end text-right min-w-[100px]">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Weightage</span>
                <span className="text-xl font-black text-slate-900">+{currentQuestion.marks}</span>
                {currentQuestion.negativeMarks > 0 && (
                  <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded mt-1">-{currentQuestion.negativeMarks} Penalty</span>
                )}
              </div>
            </div>

            <div className="space-y-4 mb-12 flex-grow">
              {currentQuestion.options.map((opt, optIdx) => (
                <button
                  key={optIdx}
                  onClick={() => setAnswers(prev => ({ ...prev, [currentQuestion.id]: optIdx }))}
                  className={`w-full text-left p-6 rounded-2xl border-2 transition-all flex items-center group relative overflow-hidden ${
                    answers[currentQuestion.id] === optIdx 
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-sm ring-1 ring-indigo-600' 
                      : 'border-slate-100 bg-white hover:border-slate-200'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black mr-5 transition-all ${
                    answers[currentQuestion.id] === optIdx 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-600'
                  }`}>
                    {String.fromCharCode(65 + optIdx)}
                  </div>
                  <span className={`text-lg font-bold ${answers[currentQuestion.id] === optIdx ? 'text-indigo-900' : 'text-slate-600'}`}>
                    {opt}
                  </span>
                  {answers[currentQuestion.id] === optIdx && (
                    <div className="ml-auto">
                       <CheckCircle className="h-6 w-6 text-indigo-600" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="mt-auto pt-10 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
              <button
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx(prev => prev - 1)}
                className={`w-full sm:w-auto flex items-center justify-center font-bold px-8 py-3 rounded-xl transition-all ${
                  currentIdx === 0 ? 'text-slate-300 bg-slate-50 cursor-not-allowed' : 'text-slate-600 bg-white border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <ChevronLeft className="mr-2 h-5 w-5" /> Previous Question
              </button>
              
              <button
                disabled={currentIdx === initialExam.questions.length - 1}
                onClick={() => setCurrentIdx(prev => prev + 1)}
                className={`w-full sm:w-auto flex items-center justify-center font-bold px-10 py-3 rounded-xl transition-all ${
                  currentIdx === initialExam.questions.length - 1 ? 'text-slate-300 bg-slate-50 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg'
                }`}
              >
                Next Question <ChevronRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Integrity Monitor</h4>
            <div className={`flex items-start p-4 rounded-2xl border ${tabSwitchCount > 0 ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
              <AlertCircle className={`h-5 w-5 mr-3 flex-shrink-0 mt-0.5 ${tabSwitchCount > 0 ? 'text-red-600' : 'text-green-600'}`} />
              <div>
                <p className={`text-xs font-bold ${tabSwitchCount > 0 ? 'text-red-800' : 'text-green-800'}`}>Violations: {tabSwitchCount}</p>
                <p className={`text-[10px] mt-1 uppercase font-semibold ${tabSwitchCount > 0 ? 'text-red-500' : 'text-green-500'}`}>
                  {tabSwitchCount > 0 ? "Potential Cheat Alert" : "Integrity Maintained"}
                </p>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 mt-4 leading-relaxed font-medium">
              Examination logic is strictly monitored. Focus on this window for the entire duration.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Exam Details</h4>
             <div className="space-y-4">
               <div>
                 <p className="text-[10px] font-bold text-slate-400 uppercase">Subject</p>
                 <p className="text-sm font-bold text-slate-700 truncate">{initialExam.title}</p>
               </div>
               <div>
                 <p className="text-[10px] font-bold text-slate-400 uppercase">Candidate</p>
                 <p className="text-sm font-bold text-slate-700">{user.name}</p>
               </div>
               <div>
                 <p className="text-[10px] font-bold text-slate-400 uppercase">Index/Roll</p>
                 <p className="text-sm font-bold text-slate-700 font-mono">{user.rollNo}</p>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamTaker;
