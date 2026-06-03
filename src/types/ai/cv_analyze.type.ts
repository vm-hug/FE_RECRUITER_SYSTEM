export interface Summary {
  recommendation: string;
  summary_text: string;
}

export interface InterviewSuggestion {
  title: string;
  description: string;
}

export interface CVAnalysisResult {
  match_percentage: number;

  ats_pass_rate: number;

  summary: Summary;

  matched_skills: string[];

  missing_skills: string[];

  strengths: string[];

  points_to_note: string[];

  interview_suggestions: InterviewSuggestion[];
}

export interface AnalyzeCVPayload {
  jobDescription: string;

  file: File;
}
