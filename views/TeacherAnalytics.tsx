
import React, { useMemo } from 'react';
import { Exam, Attempt } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowLeft, Users, Target, Clock, AlertTriangle, TrendingUp, HelpCircle, CheckCircle } from 'lucide-react';

interface TeacherAnalyticsProps {
  exam: Exam;
  attempts: Attempt[];
  onBack: () => void;
}

const TeacherAnalytics: React.FC<TeacherAnalyticsProps> = ({ exam, attempts, onBack }) => {
  const stats = useMemo(() => {
    if (attempts.length === 0) return null;

    const totalScores = attempts.reduce((acc, a) => acc + a.score, 0);
    const avgScore = totalScores / attempts.length;
    const scores = attempts.map(a => a.score);
    const maxScoreVal = Math.max(...scores);
    const minScoreVal = Math.min(...scores);

    // Pass/Fail (Assuming 40% as passing)
    const passThreshold = exam.questions.reduce((acc, q) => acc + q.marks, 0) * 0.4;
    const passCount = attempts.filter(a => a.score >= passThreshold).length;
    const failCount = attempts.length - passCount;

    // Time Taken
    const durations = attempts.map(a => {
      const start = new Date(a.startTime).getTime();
      const end = new Date(a.endTime).getTime();
      return (end - start) / 1000; // seconds
    });
    const avgTime = durations.reduce((acc, d) => acc + d, 0) / durations.length;

    // Question Stats
    const qStats = exam.questions.map((q, index) => {
      const attemptedQ = attempts.filter(a => a.answers[q.id] !== undefined);
      const correctOnes = attemptedQ.filter(a => a.answers[q.id] === q.correctOptionIndex);
      return {
        id: q.id,
        qLabel: `Question ${index + 1}`,
        text: q.text,
        correctCount: correctOnes.length,
        wrongCount: attemptedQ.length - correctOnes.length,
        successRate: (correctOnes.length / (attemptedQ.length || 1)) * 100
      };
    });

    const mostCorrectQ = [...qStats].sort((a, b) => b.correctCount - a.correctCount)[0];
    const mostWrongQ = [...qStats].sort((a, b) => b.wrongCount - a.wrongCount)[0];

    return {
      avgScore,
      maxScoreVal,
      minScoreVal,
      passCount,
      failCount,
      avgTime,
      minTime: Math.min(...durations),
      maxTime: Math.max(...durations),
      mostCorrectQ,
      mostWrongQ,
      qStats
    };
  }, [attempts, exam]);

  if (!stats) {
    return (
      <div className="text-center py-20">
        <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-900">No attempts yet</h2>
        <p className="text-slate-500 mt-2">Wait for students to participate to see insights.</p>
        <button onClick={onBack} className="mt-8 text-indigo-600 font-bold flex items-center justify-center mx-auto">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to dashboard
        </button>
      </div>
    );
  }

  const pieData = [
    { name: 'Passed', value: stats.passCount, color: '#10b981' },
    { name: 'Failed', value: stats.failCount, color: '#f43f5e' }
  ];

  return (
    <div className="space-y-10 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <button onClick={onBack} className="flex items-center text-slate-500 hover:text-slate-900 mb-4 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-slate-900">Analytics: {exam.title}</h1>
          <p className="text-slate-500">Comprehensive overview of student performance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Users className="h-5 w-5" /></div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Attendance</span>
          </div>
          <p className="text-3xl font-black text-slate-900">{attempts.length}</p>
          <p className="text-sm text-slate-400 mt-1">Students Participated</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-50 text-green-600 rounded-lg"><Target className="h-5 w-5" /></div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Average Score</span>
          </div>
          <p className="text-3xl font-black text-slate-900">{stats.avgScore.toFixed(1)}</p>
          <p className="text-sm text-slate-400 mt-1">Overall Performance</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Clock className="h-5 w-5" /></div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Avg Time</span>
          </div>
          <p className="text-3xl font-black text-slate-900">{(stats.avgTime / 60).toFixed(1)} <span className="text-sm font-normal">min</span></p>
          <p className="text-sm text-slate-400 mt-1">Completion Speed</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-red-50 text-red-600 rounded-lg"><AlertTriangle className="h-5 w-5" /></div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Violations</span>
          </div>
          <p className="text-3xl font-black text-slate-900">{attempts.reduce((acc, a) => acc + a.tabSwitchCount, 0)}</p>
          <p className="text-sm text-slate-400 mt-1">Total Tab Switches Detected</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-8 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-indigo-600" /> Score Distribution
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.qStats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="qLabel" hide />
                <YAxis />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="correctCount" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Correct Answers" />
                <Bar dataKey="wrongCount" fill="#94a3b8" radius={[4, 4, 0, 0]} name="Wrong Answers" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-slate-900 mb-8 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-green-600" /> Pass vs Fail
          </h3>
          <div className="flex-grow flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="text-center">
              <p className="text-2xl font-black text-green-600">{stats.passCount}</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Passed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-red-500">{stats.failCount}</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Failed</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center space-x-2 text-slate-900 mb-2">
            <HelpCircle className="h-5 w-5 text-indigo-600" />
            <h3 className="text-lg font-bold">Top Insights</h3>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase mb-2">Most Answered Correctly</p>
              <p className="text-sm font-semibold text-slate-700 leading-relaxed mb-2 line-clamp-1">"{stats.mostCorrectQ.text}"</p>
              <div className="flex items-center text-xs text-green-600 font-bold">
                <Target className="h-3 w-3 mr-1" /> {stats.mostCorrectQ.successRate.toFixed(1)}% success rate
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase mb-2">Critical Learning Gap</p>
              <p className="text-sm font-semibold text-slate-700 leading-relaxed mb-2 line-clamp-1">"{stats.mostWrongQ.text}"</p>
              <div className="flex items-center text-xs text-red-500 font-bold">
                <AlertTriangle className="h-3 w-3 mr-1" /> Only {stats.mostWrongQ.successRate.toFixed(1)}% could answer
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-2 text-slate-900 mb-6">
            <Clock className="h-5 w-5 text-indigo-600" />
            <h3 className="text-lg font-bold">Time Analysis</h3>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl transition-colors">
              <span className="text-sm text-slate-500 font-medium">Fastest Submission</span>
              <span className="text-lg font-bold text-slate-900">{(stats.minTime / 60).toFixed(1)}m</span>
            </div>
            <div className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl transition-colors">
              <span className="text-sm text-slate-500 font-medium">Longest Submission</span>
              <span className="text-lg font-bold text-slate-900">{(stats.maxTime / 60).toFixed(1)}m</span>
            </div>
            <div className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl transition-colors">
              <span className="text-sm text-slate-500 font-medium">Average Pace</span>
              <span className="text-lg font-bold text-indigo-600">{(stats.avgTime / 60).toFixed(1)} min/user</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-900">Participant Records</h3>
          <span className="text-xs font-bold text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-100">{attempts.length} Total</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase text-[10px] font-black tracking-widest border-b border-slate-100">
                <th className="px-8 py-4">Student</th>
                <th className="px-8 py-4">Roll No</th>
                <th className="px-8 py-4">Score</th>
                <th className="px-8 py-4">Pace</th>
                <th className="px-8 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {attempts.map(a => {
                const passThreshold = exam.questions.reduce((acc, q) => acc + q.marks, 0) * 0.4;
                const passed = a.score >= passThreshold;
                const duration = (new Date(a.endTime).getTime() - new Date(a.startTime).getTime()) / 60000;

                return (
                  <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-8 py-4 font-bold text-slate-700">{a.studentName}</td>
                    <td className="px-8 py-4 text-slate-500 font-mono text-sm">{a.rollNo}</td>
                    <td className="px-8 py-4">
                      <span className={`font-black ${passed ? 'text-green-600' : 'text-red-500'}`}>
                        {a.score}
                      </span>
                      <span className="text-slate-300 ml-1">/ {a.maxScore}</span>
                    </td>
                    <td className="px-8 py-4 text-slate-500 text-sm">{duration.toFixed(1)} min</td>
                    <td className="px-8 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                        {passed ? 'Passed' : 'Failed'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeacherAnalytics;
