
import React from 'react';
import { User } from '../types';
import { LogOut, BookOpen, User as UserIcon } from 'lucide-react';

interface NavbarProps {
  user: User;
  onLogout: () => void;
  onHome: () => void;
}

function Navbar({ user, onLogout, onHome }) {
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center cursor-pointer" onClick={onHome}>
            <div className="bg-indigo-600 p-2 rounded-lg">
              <BookOpen className="text-white h-6 w-6" />
            </div>
            <span className="ml-3 text-xl font-bold text-slate-900 tracking-tight">ExamPro</span>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center text-sm font-medium text-slate-600 bg-slate-50 px-3 py-1.5 rounded-full">
              <UserIcon className="h-4 w-4 mr-2" />
              <span>{user.name} ({user.role})</span>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center text-sm font-medium text-slate-500 hover:text-red-600 transition-colors"
            >
              <LogOut className="h-4 w-4 mr-1.5" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
