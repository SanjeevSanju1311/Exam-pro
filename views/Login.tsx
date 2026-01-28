
import React, { useState } from 'react';
import { Role } from '../types';
import { ShieldCheck, GraduationCap, ChevronRight } from 'lucide-react';

interface LoginProps {
  onLogin: (name: string, role: Role, rollNo?: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [role, setRole] = useState<Role>('STUDENT');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onLogin(name, role, role === 'STUDENT' ? rollNo : undefined);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-slate-200 border border-slate-100 overflow-hidden">
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="bg-indigo-600 p-4 rounded-2xl shadow-lg shadow-indigo-100">
              <GraduationCap className="text-white h-10 w-10" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-2">Welcome Back</h2>
          <p className="text-center text-slate-500 mb-8">Securely access your examination dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Your Name</label>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                placeholder="Enter full name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole('STUDENT')}
                className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                  role === 'STUDENT' 
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-600' 
                    : 'border-slate-100 bg-white text-slate-500 hover:border-slate-300'
                }`}
              >
                <GraduationCap className="h-6 w-6 mb-2" />
                <span className="font-semibold text-sm">Student</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('TEACHER')}
                className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                  role === 'TEACHER' 
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-600' 
                    : 'border-slate-100 bg-white text-slate-500 hover:border-slate-300'
                }`}
              >
                <ShieldCheck className="h-6 w-6 mb-2" />
                <span className="font-semibold text-sm">Teacher</span>
              </button>
            </div>

            {role === 'STUDENT' && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Roll Number</label>
                <input
                  required
                  type="text"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                  placeholder="e.g. CS2024001"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center group shadow-lg shadow-slate-200"
            >
              Sign In
              <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
      </div>
      
      <p className="mt-8 text-slate-400 text-sm">
        Powered by <span className="text-slate-600 font-medium">ExamPro Enterprise</span>
      </p>
    </div>
  );
};

export default Login;
