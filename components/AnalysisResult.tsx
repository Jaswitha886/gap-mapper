
import React from 'react';
import { GapAnalysis } from '../types';

interface AnalysisResultProps {
  analysis: GapAnalysis;
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ analysis }) => {
  if (analysis.isInsufficient) {
    return (
      <div className="bg-amber-50 border border-amber-200 p-6 rounded-xl text-amber-800">
        <div className="flex items-center mb-4">
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-lg font-bold">Insufficient Context</h2>
        </div>
        <p className="text-sm">The provided syllabus content is insufficient to determine learning gaps for this specific doubt. Please provide more curriculum details.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="bg-red-50 border-b border-red-100 px-6 py-4">
          <h3 className="text-red-800 font-bold flex items-center">
            <span className="mr-2">🚨</span> Detected Learning Gaps
          </h3>
        </div>
        <div className="p-6">
          <ul className="space-y-3">
            {analysis.detectedGaps.map((gap, i) => (
              <li key={i} className="flex items-start text-slate-700">
                <span className="text-red-500 mr-2 mt-1">•</span>
                <span className="text-sm md:text-base leading-relaxed">{gap}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="bg-blue-50 border-b border-blue-100 px-6 py-4">
          <h3 className="text-blue-800 font-bold flex items-center">
            <span className="mr-2">🧩</span> Missing Prerequisite Concepts
          </h3>
        </div>
        <div className="p-6">
          <ul className="space-y-3">
            {analysis.missingPrerequisites.map((concept, i) => (
              <li key={i} className="flex items-start text-slate-700">
                <span className="text-blue-500 mr-2 mt-1">•</span>
                <span className="text-sm md:text-base leading-relaxed">{concept}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="bg-green-50 border-b border-green-100 px-6 py-4">
          <h3 className="text-green-800 font-bold flex items-center">
            <span className="mr-2">🛤️</span> Recommended Learning Path
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {analysis.learningPath.map((step, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm">
                  {i + 1}
                </div>
                <div className="flex-grow p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm font-medium text-slate-800">
                  {step}
                </div>
              </div>
            ))}
          </div>
          
          {analysis.whyThisPath && (
            <div className="mt-6 pt-6 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Why This Path?</h4>
              <p className="text-sm text-slate-600 italic leading-relaxed">
                "{analysis.whyThisPath}"
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
