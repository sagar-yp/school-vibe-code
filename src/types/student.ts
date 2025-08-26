export interface StudentProfile {
  id: string;
  name: string;
  grade: string;
  curriculum: string;
  location: string;
  subjects: string[];
  learningStyle: string;
  strugglingConcept: string;
  avatar: string;
  previousAssessments: {
    physicsStrengths: string[];
    physicsWeaknesses: string[];
    overallConfidence: number;
    lastAssessmentScore: number;
  };
  culturalContext: {
    examSystem: string;
    languagePreference: string;
    studyPattern: string;
  };
}

export interface ConceptMastery {
  masteryLevel: number;
  confidence: number;
  lastAssessed: string;
  visualStatus: 'green' | 'yellow' | 'red';
  attempts: number;
  avgScore: number;
  specificStruggles?: string[];
}

export interface StudentMasteryGraph {
  [conceptId: string]: ConceptMastery;
}

export interface ConceptRelationship {
  prerequisites: string[];
  difficulty: number;
  relatedConcepts: string[];
  leads_to: string[];
  keyInsights?: string[];
  realWorldExamples?: string[];
}

export interface ConceptRelationshipGraph {
  [conceptId: string]: ConceptRelationship;
}

export interface AssessmentQuestion {
  id: string;
  difficulty: 'bridge' | 'discovery' | 'foundation';
  topic: string;
  culturalVariant: {
    india: CulturalQuestion;
    uk: CulturalQuestion;
  };
  expectedInsight: string;
  gentleHints?: string[];
  misconceptionAlert?: string;
}

export interface CulturalQuestion {
  question: string;
  context: string;
  visualAid: string;
  encouragement: string;
}

export interface AIReasoning {
  step: string;
  analysis: string;
  confidence: number;
  nextAction: string;
}

export interface VideoRecommendation {
  title: string;
  channel: string;
  topicRelevance: number;
  culturalFit: number;
  learningStyleMatch: number;
  reason: string;
  thumbnail: string;
  duration: string;
}

interface Node {
  id: string;
  name: string;
  x: number;
  y: number;
  connections: string[];
  prerequisites: string[];
}