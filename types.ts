
export interface GapAnalysis {
  detectedGaps: string[];
  missingPrerequisites: string[];
  learningPath: string[];
  whyThisPath: string;
  isInsufficient: boolean;
  rawResponse: string;
}

export interface AnalysisState {
  syllabus: string;
  studentInput: string;
  isAnalyzing: boolean;
  result: GapAnalysis | null;
  error: string | null;
}
