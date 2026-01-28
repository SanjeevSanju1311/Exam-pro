
import React, { useState } from 'react';
import { Exam, Question } from '../types';
import { Storage } from '../storage';
import { Save, X, Plus, Trash2, ArrowLeft, Settings2, HelpCircle, PlusCircle } from 'lucide-react';

interface ExamCreatorProps {
  onCancel: () => void;
  onSave: () => void;
}

const ExamCreator: React.FC<ExamCreatorProps> = ({ onCancel, onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState(60);
  const [questions, setQuestions] = useState<Question[]>([]);

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Math.random().toString(36).substr(2, 9),
      text: '',
      options: ['', '', '', ''],
      correctOptionIndex: 0,
      marks: 1,
      negativeMarks: 0,
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const updateOption = (qId: string, optIdx: number, val: string) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        const newOptions = [...q.options];
        newOptions[optIdx] = val;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (questions.length === 0) {
      alert("Please add at least one question to the exam.");
      return;
    }

    const exam: Exam = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      description,
      startTime,
      durationMinutes: duration,
      questions,
      creatorId: Storage.getCurrentUser()?.id || 'anonymous'
    };

    Storage.saveExam(exam);
    onSave();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <button onClick={onCancel} className="flex items-center text-slate-500 hover:text-slate-900 transition-colors font-medium">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Dashboard
        </button>
        <h2 className="text-2xl font-bold text-slate-900">New Examination</h2>
        <div className="w-20 hidden md:block" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 pb-20">
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-8">
          <div className="flex items-center space-x-2 text-indigo-600 mb-2">
            <Settings2 className="h-5 w-5" />
            <h3 className="text-lg font-bold">Exam Configuration</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="col-span-full">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Title of Examination</label>
              <input
                required
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400"
                placeholder="e.g. Advanced Calculus - Final Term"
              />
            </div>
            
            <div className="col-span-full">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Instructions / Description</label>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-28 resize-none placeholder:text-slate-400"
                placeholder="Important rules, syllabus coverage, and passing criteria..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Start Schedule</label>
              <input
                required
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Duration in Minutes</label>
              <input
                required
                type="number"
                min="1"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center bg-slate-100/50 p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center space-x-2">
              <HelpCircle className="h-5 w-5 text-indigo-600" />
              <h3 className="text-lg font-bold text-slate-900">Questions Bank ({questions.length})</h3>
            </div>
            <p className="text-xs font-medium text-slate-500 italic">Add questions using the button at the bottom</p>
          </div>

          {questions.map((q, idx) => (
            <div key={q.id} className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-6 relative overflow-hidden group animate-in slide-in-from-bottom-2 duration-300">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-200 group-hover:bg-indigo-600 transition-all"></div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <span className="bg-slate-100 text-slate-500 w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs">#{idx + 1}</span>
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Question Details</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeQuestion(q.id)}
                  className="text-slate-300 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                <textarea
                  required
                  value={q.text}
                  onChange={(e) => updateQuestion(q.id, { text: e.target.value })}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-24 resize-none font-semibold text-lg"
                  placeholder="Type your question here..."
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {q.options.map((opt, optIdx) => (
                    <div key={optIdx} className="relative group/opt">
                      <div className={`flex items-center p-1 rounded-2xl border-2 transition-all ${
                        q.correctOptionIndex === optIdx ? 'border-indigo-600 bg-indigo-50/30' : 'border-slate-100'
                      }`}>
                        <div className="flex-shrink-0 ml-3">
                          <input
                            type="radio"
                            name={`correct-${q.id}`}
                            checked={q.correctOptionIndex === optIdx}
                            onChange={() => updateQuestion(q.id, { correctOptionIndex: optIdx })}
                            className="w-5 h-5 text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"
                          />
                        </div>
                        <input
                          required
                          type="text"
                          value={opt}
                          onChange={(e) => updateOption(q.id, optIdx, e.target.value)}
                          className="flex-grow px-4 py-3 bg-transparent outline-none font-medium placeholder:text-slate-300"
                          placeholder={`Answer Choice ${optIdx + 1}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-8 pt-6 border-t border-slate-100">
                  <div className="flex items-center space-x-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Correct Weight:</label>
                    <input
                      type="number"
                      min="0"
                      value={q.marks}
                      onChange={(e) => updateQuestion(q.id, { marks: parseInt(e.target.value) || 0 })}
                      className="w-12 bg-transparent text-center font-black text-indigo-600 focus:ring-0 outline-none"
                    />
                  </div>
                  <div className="flex items-center space-x-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Negative Penalty:</label>
                    <input
                      type="number"
                      min="0"
                      step="0.25"
                      value={q.negativeMarks}
                      onChange={(e) => updateQuestion(q.id, { negativeMarks: parseFloat(e.target.value) || 0 })}
                      className="w-12 bg-transparent text-center font-black text-red-500 focus:ring-0 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* New Add MCQ Button at the end */}
          <button
            type="button"
            onClick={addQuestion}
            className="w-full py-10 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group"
          >
            <PlusCircle className="h-10 w-10 mb-2 group-hover:scale-110 transition-transform" />
            <span className="font-bold">Add Next MCQ Question</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-10 border-t border-slate-200">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all"
          >
            Discard Changes
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto px-12 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center justify-center"
          >
            <Save className="h-5 w-5 mr-2" />
            Publish Examination
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExamCreator;
