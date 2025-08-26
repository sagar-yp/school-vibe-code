import { StudentProfile, StudentMasteryGraph, ConceptRelationshipGraph, AssessmentQuestion, VideoRecommendation } from '../types/student';

export const studentProfiles: Record<string, StudentProfile> = {
  priya: {
    id: "student_in_001",
    name: "Priya Sharma",
    grade: "Class 9",
    curriculum: "CBSE",
    location: "Bengaluru, India",
    avatar: "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    subjects: ["Physics", "Mathematics", "Chemistry"],
    learningStyle: "Visual + Reading/Writing",
    strugglingConcept: "inertia",
    previousAssessments: {
      physicsStrengths: ["Basic measurements", "Simple forces"],
      physicsWeaknesses: ["Inertia applications", "Newton's laws", "Momentum"],
      overallConfidence: 58,
      lastAssessmentScore: 45
    },
    culturalContext: {
      examSystem: "Board-focused",
      languagePreference: "English with Hindi support",
      studyPattern: "Evening study sessions"
    }
  },
  james: {
    id: "student_uk_001",
    name: "James Wilson",
    grade: "Year 10",
    curriculum: "GCSE Physics",
    location: "Manchester, UK",
    avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    subjects: ["Physics", "Mathematics", "Computer Science"],
    learningStyle: "Kinesthetic + Visual",
    strugglingConcept: "inertia",
    previousAssessments: {
      physicsStrengths: ["Practical experiments", "Graph analysis"],
      physicsWeaknesses: ["Theoretical concepts", "Inertia", "Abstract thinking"],
      overallConfidence: 62,
      lastAssessmentScore: 52
    },
    culturalContext: {
      examSystem: "Coursework + Exams",
      languagePreference: "British English",
      studyPattern: "After-school study groups"
    }
  }
};

export const studentMasteryGraphs: Record<string, StudentMasteryGraph> = {
  priya: {
    basic_forces: {
      masteryLevel: 75,
      confidence: 80,
      lastAssessed: "2024-08-20",
      visualStatus: "green",
      attempts: 3,
      avgScore: 78
    },
    balanced_unbalanced_forces: {
      masteryLevel: 68,
      confidence: 70,
      lastAssessed: "2024-08-22",
      visualStatus: "yellow",
      attempts: 2,
      avgScore: 65
    },
    inertia_concept: {
      masteryLevel: 35,
      confidence: 25,
      lastAssessed: "2024-08-23",
      visualStatus: "red",
      attempts: 4,
      avgScore: 38,
      specificStruggles: ["Real-world applications", "Mathematical connections"]
    },
    newtons_first_law: {
      masteryLevel: 28,
      confidence: 30,
      lastAssessed: "2024-08-23",
      visualStatus: "red",
      attempts: 2,
      avgScore: 32
    },
    newtons_second_law: {
      masteryLevel: 15,
      confidence: 20,
      lastAssessed: "2024-08-21",
      visualStatus: "red",
      attempts: 1,
      avgScore: 18
    },
    momentum: {
      masteryLevel: 12,
      confidence: 15,
      lastAssessed: "2024-08-19",
      visualStatus: "red",
      attempts: 1,
      avgScore: 15
    }
  },
  james: {
    basic_forces: {
      masteryLevel: 72,
      confidence: 75,
      lastAssessed: "2024-08-19",
      visualStatus: "green",
      attempts: 2,
      avgScore: 74
    },
    balanced_unbalanced_forces: {
      masteryLevel: 65,
      confidence: 68,
      lastAssessed: "2024-08-21",
      visualStatus: "yellow",
      attempts: 3,
      avgScore: 67
    },
    inertia_concept: {
      masteryLevel: 38,
      confidence: 32,
      lastAssessed: "2024-08-22",
      visualStatus: "red",
      attempts: 3,
      avgScore: 41,
      specificStruggles: ["Theoretical understanding", "Abstract concepts"]
    },
    newtons_first_law: {
      masteryLevel: 31,
      confidence: 35,
      lastAssessed: "2024-08-22",
      visualStatus: "red",
      attempts: 2,
      avgScore: 34
    },
    newtons_second_law: {
      masteryLevel: 18,
      confidence: 25,
      lastAssessed: "2024-08-20",
      visualStatus: "red",
      attempts: 1,
      avgScore: 20
    },
    momentum: {
      masteryLevel: 16,
      confidence: 18,
      lastAssessed: "2024-08-18",
      visualStatus: "red",
      attempts: 1,
      avgScore: 18
    }
  }
};

export const conceptRelationshipGraph: ConceptRelationshipGraph = {
  basic_motion: {
    prerequisites: [],
    difficulty: 1,
    relatedConcepts: ["speed", "velocity", "distance"],
    leads_to: ["basic_forces", "acceleration"]
  },
  basic_forces: {
    prerequisites: ["basic_motion"],
    difficulty: 2,
    relatedConcepts: ["push", "pull", "contact_forces"],
    leads_to: ["balanced_unbalanced_forces", "friction"]
  },
  balanced_unbalanced_forces: {
    prerequisites: ["basic_forces"],
    difficulty: 3,
    relatedConcepts: ["equilibrium", "net_force"],
    leads_to: ["inertia_concept", "acceleration_basics"]
  },
  inertia_concept: {
    prerequisites: ["balanced_unbalanced_forces", "basic_motion"],
    difficulty: 4,
    relatedConcepts: ["resistance_to_change", "mass_property", "rest_motion_tendency"],
    leads_to: ["newtons_first_law", "mass_inertia_relationship"],
    keyInsights: ["Objects resist changes in motion", "Mass measures inertia"],
    realWorldExamples: ["Car braking", "Bus acceleration", "Coin-card trick"]
  },
  mass_inertia_relationship: {
    prerequisites: ["inertia_concept"],
    difficulty: 5,
    relatedConcepts: ["weight_vs_mass", "inertial_mass"],
    leads_to: ["newtons_first_law", "newtons_second_law"]
  },
  newtons_first_law: {
    prerequisites: ["inertia_concept", "mass_inertia_relationship"],
    difficulty: 6,
    relatedConcepts: ["law_of_inertia", "uniform_motion"],
    leads_to: ["newtons_second_law", "reference_frames"]
  },
  newtons_second_law: {
    prerequisites: ["newtons_first_law", "acceleration_basics"],
    difficulty: 7,
    relatedConcepts: ["force_acceleration", "F_ma", "proportionality"],
    leads_to: ["momentum", "impulse", "problem_solving"]
  },
  momentum: {
    prerequisites: ["newtons_second_law", "mass_velocity"],
    difficulty: 8,
    relatedConcepts: ["mass_velocity_product", "vector_quantity"],
    leads_to: ["conservation_momentum", "impulse", "collisions"]
  }
};

export const assessmentQuestions: AssessmentQuestion[] = [
  {
    id: "inertia_001",
    difficulty: "bridge",
    topic: "Inertia Introduction",
    culturalVariant: {
      india: {
        question: "You're traveling in a bus and it suddenly stops. What happens to you and why?",
        context: "Familiar Indian public transport experience",
        visualAid: "Bus stopping animation with passenger movement",
        encouragement: "Think about your daily bus rides - your body knows this!"
      },
      uk: {
        question: "When you're in a car and it brakes suddenly, what happens to your body?",
        context: "Common UK driving experience",
        visualAid: "Car braking scenario with seatbelt importance",
        encouragement: "You've probably felt this - trust your experience!"
      }
    },
    expectedInsight: "Body continues moving when vehicle stops",
    gentleHints: [
      "Think about what your body wants to do...",
      "Remember, your body wasn't expecting the stop...",
      "What if there were no seatbelts or handles to hold?"
    ]
  },
  {
    id: "inertia_002",
    difficulty: "discovery",
    topic: "Inertia in Space",
    culturalVariant: {
      india: {
        question: "Imagine a cricket ball floating in space where there's no air to slow it down. If Virat Kohli hits it once, what would happen to the ball?",
        context: "Cricket is familiar & exciting for Indian students",
        visualAid: "Space animation with cricket ball",
        encouragement: "Think about it - no air resistance, no gravity to pull it down!"
      },
      uk: {
        question: "Picture a football in outer space with no air resistance. If you kick it once, what happens next?",
        context: "Football reference familiar to UK students",
        visualAid: "Space animation with football",
        encouragement: "No air to slow it down, no ground to stop it - what would you expect?"
      }
    },
    expectedInsight: "Object continues moving forever in same direction",
    misconceptionAlert: "Many think it would eventually stop naturally"
  }
];

export const videoRecommendations: Record<string, VideoRecommendation[]> = {
  priya: [
    {
      title: "Inertia Experiments You Can Do at Home",
      channel: "PhysicsWallah",
      topicRelevance: 94,
      culturalFit: 96,
      learningStyleMatch: 91,
      reason: "Hindi-English mix, CBSE aligned, uses familiar objects like coins and cards",
      thumbnail: "https://images.pexels.com/photos/8471899/pexels-photo-8471899.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      duration: "12:45"
    },
    {
      title: "Newton's Laws Made Simple with Indian Examples",
      channel: "Vedantu",
      topicRelevance: 89,
      culturalFit: 93,
      learningStyleMatch: 87,
      reason: "Uses cricket, bus, and train examples familiar to Indian students",
      thumbnail: "https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      duration: "15:22"
    }
  ],
  james: [
    {
      title: "Forces and Motion: Real World Physics",
      channel: "BBC Bitesize",
      topicRelevance: 92,
      culturalFit: 95,
      learningStyleMatch: 89,
      reason: "GCSE curriculum aligned, British examples, practical demonstrations",
      thumbnail: "https://images.pexels.com/photos/8471932/pexels-photo-8471932.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      duration: "10:18"
    },
    {
      title: "Understanding Inertia Through Experiments",
      channel: "Physics Online",
      topicRelevance: 88,
      culturalFit: 90,
      learningStyleMatch: 94,
      reason: "Hands-on experiments perfect for kinesthetic learners, clear British accent",
      thumbnail: "https://images.pexels.com/photos/8471870/pexels-photo-8471870.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      duration: "8:45"
    }
  ]
};