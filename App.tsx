
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { AnalysisResult } from './components/AnalysisResult';
import { analyzeLearningGap } from './services/geminiService';
import { AnalysisState } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<AnalysisState>({
    syllabus: '',
    studentInput: '',
    isAnalyzing: false,
    result: null,
    error: null,
  });

  const handleAnalyze = async () => {
    if (!state.syllabus.trim() || !state.studentInput.trim()) {
      setState(prev => ({ ...prev, error: 'Please provide both the syllabus context and the student doubt.' }));
      return;
    }

    setState(prev => ({ ...prev, isAnalyzing: true, error: null, result: null }));

    try {
      const result = await analyzeLearningGap(state.syllabus, state.studentInput);
      setState(prev => ({ ...prev, result, isAnalyzing: false }));
    } catch (err: any) {
      setState(prev => ({ 
        ...prev, 
        isAnalyzing: false, 
        error: err.message || 'An unexpected error occurred.' 
      }));
    }
  };

  const handleClear = () => {
    setState({
      syllabus: '',
      studentInput: '',
      isAnalyzing: false,
      result: null,
      error: null,
    });
  };

  return (
    <div className="min-h-screen pb-20">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Input Panel */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  1. Syllabus Context
                </label>
                <p className="text-xs text-slate-500 mb-3">Paste the specific curriculum or list of topics related to the subject.</p>
                <textarea
                  className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-sm leading-relaxed"
                  placeholder="e.g. Unit 1: Algebra Basis, Unit 2: Linear Equations, Unit 3: Quadratics..."
                  value={state.syllabus}
                  onChange={(e) => setState(prev => ({ ...prev, syllabus: e.target.value, error: null }))}
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  2. Student Doubt or Explanation
                </label>
                <p className="text-xs text-slate-500 mb-3">What is the student confused about? Or paste their incorrect explanation.</p>
                <textarea
                  className="w-full h-40 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-sm leading-relaxed"
                  placeholder="e.g. I don't understand why the variable goes to the other side with a different sign..."
                  value={state.studentInput}
                  onChange={(e) => setState(prev => ({ ...prev, studentInput: e.target.value, error: null }))}
                />
              </div>

              {state.error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium">
                  {state.error}
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={handleAnalyze}
                  disabled={state.isAnalyzing}
                  className="flex-grow bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-3 px-6 rounded-xl transition-colors flex items-center justify-center"
                >
                  {state.isAnalyzing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Mapping Gaps...
                    </>
                  ) : (
                    'Run Analysis'
                  )}
                </button>
                <button
                  onClick={handleClear}
                  className="px-6 py-3 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl">
              <h4 className="text-indigo-900 font-bold text-sm mb-2 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                How it works
              </h4>
              <p className="text-xs text-indigo-700 leading-relaxed">
                GapMapper doesn't just answer the question. It uses the provided syllabus to trace the confusion back to its foundational origins, ensuring the student builds a strong conceptual base.
              </p>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-7">
            {!state.result && !state.isAnalyzing && (
              <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
                <div className="bg-slate-100 p-4 rounded-full mb-4">
                  <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Ready for Analysis</h3>
                <p className="text-slate-500 max-w-sm text-sm">
                  Provide context on the left to generate a personalized learning path and gap report.
                </p>
              </div>
            )}

            {state.isAnalyzing && (
              <div className="space-y-6 animate-pulse">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white border border-slate-200 rounded-xl p-8 h-48">
                    <div className="h-4 bg-slate-100 rounded w-1/4 mb-4"></div>
                    <div className="space-y-3">
                      <div className="h-3 bg-slate-50 rounded w-full"></div>
                      <div className="h-3 bg-slate-50 rounded w-5/6"></div>
                      <div className="h-3 bg-slate-50 rounded w-4/6"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {state.result && <AnalysisResult analysis={state.result} />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
