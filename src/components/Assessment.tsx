import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Lightbulb, Heart, Target, CheckCircle, Brain, Sparkles, MessageCircle, User, Bot } from 'lucide-react';
import { StudentProfile, AssessmentQuestion, AIReasoning, VideoRecommendation } from '../types/student';
import { assessmentQuestions, videoRecommendations } from '../data/studentData';
import AIAvatar from './AIAvatar';

interface ChatMessage {
  id: string;
  type: 'ai' | 'student';
  content: string;
  timestamp: Date;
  isThinking?: boolean;
  score?: number;
  reasoning?: string;
}

interface AssessmentProps {
  student: StudentProfile;
  onBack: () => void;
  onComplete: () => void;
  theme: string;
  onSoundEffect?: () => void;
}

const Assessment: React.FC<AssessmentProps> = ({ student, onBack, onComplete, theme, onSoundEffect }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [studentResponse, setStudentResponse] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [aiReasoning, setAiReasoning] = useState<AIReasoning[]>([]);
  const [showAIResponse, setShowAIResponse] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [assessmentComplete, setAssessmentComplete] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);

  // Refs for auto-scrolling
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const reasoningContainerRef = useRef<HTMLDivElement>(null);
  const getThemeClasses = () => {
    switch (theme) {
      case 'pastel':
        return {
          bg: 'bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50',
          text: 'text-gray-800',
          accent: 'text-purple-600',
          card: 'bg-white/80 backdrop-blur-sm shadow-xl border border-purple-200/50 rounded-3xl',
          button: 'bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white rounded-2xl shadow-lg hover:shadow-purple-300/50 transform hover:scale-105 transition-all duration-200',
          font: 'font-display'
        };
      case 'corporate':
        return {
          bg: 'bg-gradient-to-br from-slate-50 to-blue-50',
          text: 'text-gray-900',
          accent: 'text-blue-600',
          card: 'bg-white shadow-2xl border border-slate-200 rounded-xl',
          button: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg shadow-lg hover:shadow-blue-300/50 transform hover:scale-105 transition-all duration-200',
          font: 'font-corporate'
        };
      case 'nature':
        return {
          bg: 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50',
          text: 'text-gray-800',
          accent: 'text-emerald-600',
          card: 'bg-white/90 backdrop-blur-sm shadow-xl border border-emerald-200/50 rounded-2xl',
          button: 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl shadow-lg hover:shadow-emerald-300/50 transform hover:scale-105 transition-all duration-200',
          font: 'font-nature'
        };
      default: // neubrutalism
        return {
          bg: 'bg-pure-black scan-lines',
          text: 'text-pure-white',
          accent: 'text-neon-green',
          card: 'bg-pure-white neubrutalism-card',
          button: 'bg-neon-green text-pure-black border-4 border-pure-black font-black font-mono tracking-wide neubrutalism-button',
          font: 'font-mono'
        };
    }
  };

  const themeClasses = getThemeClasses();

  const culturalContext = student.location.includes('India') ? 'india' : 'uk';
  const currentQuestion = assessmentQuestions[currentQuestionIndex];
  const questionData = currentQuestion?.culturalVariant[culturalContext];

  const getColorScheme = () => {
    if (culturalContext === 'india') {
      return {
        primary: 'from-orange-500 to-red-500',
        secondary: 'from-teal-500 to-cyan-500',
        accent: 'from-yellow-400 to-orange-500',
        bg: 'bg-gradient-to-br from-orange-50 to-red-50'
      };
    }
    return {
      primary: 'from-blue-600 to-indigo-700',
      secondary: 'from-green-500 to-teal-600',
      accent: 'from-purple-500 to-pink-500',
      bg: 'bg-gradient-to-br from-blue-50 to-indigo-50'
    };
  };

  const colors = getColorScheme();

  // Initialize chat with AI greeting
  useEffect(() => {
    const greeting = culturalContext === 'india' 
      ? `Hello ${student.name}! I'm your AI tutor. I can see you've been working hard on physics. Let's explore inertia together - I'll guide you step by step. Ready to start? 😊`
      : `Hi ${student.name}! I'm your AI learning companion. I notice you have a good grasp of practical physics. Let's connect those observations to inertia concepts. Shall we begin? 🚀`;
    
    setChatMessages([{
      id: '1',
      type: 'ai',
      content: greeting,
      timestamp: new Date()
    }]);
  }, [student.name, culturalContext]);

  // Add first question after greeting
  useEffect(() => {
    if (chatMessages.length === 1 && currentQuestion) {
      setTimeout(() => {
        const questionData = currentQuestion.culturalVariant[culturalContext];
        setChatMessages(prev => [...prev, {
          id: '2',
          type: 'ai',
          content: questionData.question,
          timestamp: new Date()
        }]);
      }, 2000);
    }
  }, [chatMessages.length, currentQuestion, culturalContext]);

  // Auto-scroll chat to bottom when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Auto-scroll reasoning sidebar to bottom when new reasoning is added
  useEffect(() => {
    if (reasoningContainerRef.current) {
      reasoningContainerRef.current.scrollTop = reasoningContainerRef.current.scrollHeight;
    }
  }, [aiReasoning]);
  const simulateScoring = (response: string): number => {
    const lowerResponse = response.toLowerCase();
    
    // Simulate scoring based on keywords and understanding
    if (lowerResponse.includes('keep moving') || lowerResponse.includes('continue') || lowerResponse.includes('same direction')) {
      return 85; // High score
    } else if (lowerResponse.includes('forward') || lowerResponse.includes('motion') || lowerResponse.includes('inertia')) {
      return 70; // Good score
    } else if (lowerResponse.includes('move') || lowerResponse.includes('force')) {
      return 45; // Medium score
    } else {
      return 25; // Low score
    }
  };

  const getAIResponseBasedOnScore = (score: number, response: string): string => {
    const responses = culturalContext === 'india' ? {
      perfect: "Absolutely brilliant, Priya! 🌟 You've understood inertia perfectly! Objects in motion stay in motion unless acted upon by a force. You're thinking like a true physicist!",
      hint: "Great start, Priya! You're on the right track. Here's a hint: think about what happens when there are NO forces acting on the object - no friction, no air resistance. What would the cricket ball do then? 🏏",
      easier: "Let me ask this differently, Priya. Imagine you're sitting in a bus that suddenly stops. What happens to your body? This will help us understand inertia! 🚌",
      prerequisite: "Let's step back and build your foundation first, Priya. Tell me: when you push a book across a table, what makes it eventually stop moving? Understanding this will help us with inertia! 📚"
    } : {
      perfect: "Excellent work, James! 🚀 You've grasped inertia completely! Objects continue their motion unless a force changes it. Your understanding is spot on!",
      hint: "Good thinking, James! You're getting there. Here's a hint: imagine if we could remove ALL forces - no air resistance, no friction. What would happen to the football then? ⚽",
      easier: "Let me try a different approach, James. When you're in a car that brakes suddenly, what happens to your body? This everyday experience shows inertia in action! 🚗",
      prerequisite: "Let's build from basics first, James. When you roll a ball on the ground, what eventually makes it stop? Understanding this will help us grasp inertia! ⚽"
    };

    if (score > 80) return responses.perfect;
    if (score >= 60) return responses.hint;
    if (score >= 30) return responses.easier;
    return responses.prerequisite;
  };

  const simulateAIProcessing = () => {
    setIsProcessing(true);
    setAiReasoning([]);

    // Simulate scoring
    const score = simulateScoring(studentResponse);
    setCurrentScore(score);

    const processingSteps: AIReasoning[] = [
      { 
        step: "1. Response Analysis", 
        analysis: `Parsing student input: "${studentResponse.substring(0, 50)}..." | Keywords detected | Length: ${studentResponse.length} chars`, 
        confidence: 88, 
        nextAction: "Calculate comprehension score" 
      },
      { 
        step: "2. Scoring Algorithm", 
        analysis: `Concept understanding: ${score}/100 | Key indicators found: ${score > 70 ? 'Strong grasp' : score > 40 ? 'Partial understanding' : 'Misconceptions detected'}`, 
        confidence: 92, 
        nextAction: "Evaluate against learning objectives" 
      },
      { 
        step: "3. Learning Evaluation", 
        analysis: `Student profile: ${student.learningStyle} learner | Current mastery: 35% → Predicted: ${Math.min(100, 35 + Math.floor(score/10))}% | Gap analysis complete`, 
        confidence: 89, 
        nextAction: "Apply decision tree logic" 
      },
      { 
        step: "4. Decision Tree Branch", 
        analysis: score > 80 ? "BRANCH: Mastery Achieved → Celebrate + Advance" : score >= 60 ? "BRANCH: Good Progress → Hint + Encourage" : score >= 30 ? "BRANCH: Struggling → Simplify + Support" : "BRANCH: Prerequisite Gap → Backtrack + Rebuild", 
        confidence: 95, 
        nextAction: "Select pedagogical strategy" 
      },
      { 
        step: "5. Cultural Adaptation", 
        analysis: `Adapting for ${culturalContext === 'india' ? 'Indian context: Cricket/Bus examples' : 'UK context: Football/Car examples'} | Language: ${student.culturalContext.languagePreference}`, 
        confidence: 91, 
        nextAction: "Generate culturally relevant response" 
      },
      { 
        step: "6. Emotional Intelligence", 
        analysis: `Confidence level: ${student.previousAssessments.overallConfidence}% | Tone: ${score > 60 ? 'Encouraging + Celebratory' : 'Supportive + Motivational'} | Building self-efficacy`, 
        confidence: 87, 
        nextAction: "Craft personalized feedback" 
      },
      { 
        step: "7. Response Generation", 
        analysis: `Final response crafted | Difficulty adjusted | Next question prepared | Learning path updated`, 
        confidence: 94, 
        nextAction: "Deliver to student" 
      }
    ];

    processingSteps.forEach((step, index) => {
      setTimeout(() => {
        setAiReasoning(prev => [...prev, step]);
        if (index === processingSteps.length - 1) {
          setTimeout(() => {
            const aiResponseText = getAIResponseBasedOnScore(score, studentResponse);
            setAiResponse(aiResponseText);
            
            // Add AI response to chat
            setChatMessages(prev => [...prev, {
              id: Date.now().toString(),
              type: 'ai',
              content: aiResponseText,
              timestamp: new Date(),
              score: score,
              reasoning: `Score: ${score}/100 - ${score > 80 ? 'Perfect understanding' : score >= 60 ? 'Good progress, hint provided' : score >= 30 ? 'Easier question needed' : 'Prerequisite concept required'}`
            }]);
            
            setIsProcessing(false);
            setShowAIResponse(true);
          }, 1000);
        }
      }, (index + 1) * 1500);
    });
  };

  const handleSubmitResponse = () => {
    if (!studentResponse.trim()) return;
    
    // Add student message to chat
    setChatMessages(prev => [...prev, {
      id: Date.now().toString(),
      type: 'student',
      content: studentResponse,
      timestamp: new Date()
    }]);
    
    simulateAIProcessing();
    setStudentResponse('');
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < assessmentQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setStudentResponse('');
      setAiReasoning([]);
      setShowAIResponse(false);
      setAiResponse('');
    } else {
      setAssessmentComplete(true);
      setShowResults(true);
    }
  };

  const handleCompleteAssessment = () => {
    onComplete();
  };

  if (showResults) {
    return (
      <div className={`min-h-screen ${colors.bg} p-6`}>
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">Assessment Complete!</h1>
                  <p className="text-gray-600">You're making excellent progress, {student.name}!</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Progress Update */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                <h3 className="text-xl font-semibold text-green-800 mb-4 flex items-center">
                  <Sparkles className="w-6 h-6 mr-2" />
                  Your Learning Journey
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-green-700 font-medium">Inertia Understanding</span>
                      <span className="text-green-800 font-bold">35% → 48% ⬆️</span>
                    </div>
                    <div className="w-full bg-green-200 rounded-full h-3">
                      <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full transition-all duration-1000" style={{ width: '48%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-green-700 font-medium">Confidence Level</span>
                      <span className="text-green-800 font-bold">25% → 42% ⬆️</span>
                    </div>
                    <div className="w-full bg-green-200 rounded-full h-3">
                      <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full transition-all duration-1000" style={{ width: '42%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-green-700 font-medium">Connected Concepts</span>
                      <span className="text-green-800 font-bold">2 → 4 ⬆️</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Encouraging Feedback */}
              <div className={`bg-gradient-to-br ${colors.bg} rounded-xl p-6 border-2 border-orange-200`}>
                <h3 className="text-xl font-semibold text-orange-800 mb-4 flex items-center">
                  <Heart className="w-6 h-6 mr-2" />
                  What's Growing Stronger
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                    <p className="text-gray-700">Connecting familiar ideas to new concepts <span className="text-green-600 font-semibold">(+15%)</span></p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                    <p className="text-gray-700">Visual thinking about physics situations <span className="text-green-600 font-semibold">(+18%)</span></p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                    <p className="text-gray-700">Asking thoughtful questions <span className="text-green-600 font-semibold">(+20%)</span></p>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Recommendations */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Target className="w-6 h-6 mr-2" />
                Videos Chosen Just for You
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {videoRecommendations[student.id.includes('in') ? 'priya' : 'james'].map((video, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">{video.title}</h4>
                      <p className="text-gray-600 mb-4">{video.channel} • {video.duration}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Topic Relevance:</span>
                          <span className="font-semibold text-green-600">{video.topicRelevance}/100</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Cultural Fit:</span>
                          <span className="font-semibold text-blue-600">{video.culturalFit}/100</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Learning Style:</span>
                          <span className="font-semibold text-purple-600">{video.learningStyleMatch}/100</span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-700">
                          <strong>Why this video:</strong> {video.reason}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy Assurance */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-200 mb-8">
              <h3 className="text-lg font-semibold text-indigo-800 mb-4">🔒 Your Privacy Matters</h3>
              <div className="grid sm:grid-cols-2 gap-4 text-sm text-indigo-700">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  All data processed locally on your device
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  No personal information shared with third parties
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  AI recommendations based only on learning patterns
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  You can delete your data anytime
                </div>
              </div>
            </div>

            {/* Study Tips */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">📚 Study Tips for You</h3>
              <div className="space-y-4">
                <div className="flex items-start p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mt-2 mr-4"></div>
                  <p className="text-gray-700 font-medium">
                    {student.learningStyle.includes('Visual') 
                      ? "Use diagrams and animations to visualize physics concepts - your visual learning style is a superpower!"
                      : "Try hands-on experiments to feel the physics principles - your kinesthetic learning style helps you understand through experience!"
                    }
                  </p>
                </div>
                <div className="flex items-start p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                  <div className="w-3 h-3 bg-green-500 rounded-full mt-2 mr-4"></div>
                  <p className="text-gray-700 font-medium">
                    Practice with {student.location.includes('India') ? 'cricket and bus' : 'football and car'} examples - familiar contexts make learning easier!
                  </p>
                </div>
                <div className="flex items-start p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mt-2 mr-4"></div>
                  <p className="text-gray-700 font-medium">
                    Study during your {student.culturalContext.studyPattern.toLowerCase()} - consistency builds understanding!
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={handleCompleteAssessment}
                className={`px-8 py-4 bg-gradient-to-r ${colors.primary} text-white rounded-xl font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200`}
              >
                Continue Learning Journey
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Assessment Complete!</h2>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${themeClasses.bg}`}>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className={`flex items-center px-6 py-3 ${
              theme === 'neubrutalism' 
                ? 'bg-hot-pink text-pure-white border-4 border-pure-black neubrutalism-button font-mono' 
                : themeClasses.button
            } font-black ${themeClasses.font} tracking-wide`}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span>BACK TO DASHBOARD</span>
          </button>
          
          <div className="text-center">
            <h1 className={`text-3xl font-black ${themeClasses.accent} ${themeClasses.font} tracking-tight`}>
              AI TUTOR SESSION
            </h1>
            <p className={`${themeClasses.text} ${themeClasses.font} font-bold`}>
              PERSONALIZED LEARNING WITH {student.name.toUpperCase()}
            </p>
          </div>

          <AIAvatar 
            isThinking={isProcessing} 
            expression={currentScore > 80 ? 'celebrating' : currentScore > 60 ? 'encouraging' : 'neutral'} 
            size="large"
            showPulse={isProcessing}
          />
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Main Assessment Panel */}
          <div className="lg:col-span-3">
            {/* Chat Interface */}
            <div className={`${themeClasses.card} h-[800px] flex flex-col ${
              theme === 'neubrutalism' ? 'border-4 border-pure-black' : ''
            }`}>
              {/* Chat Header */}
              <div className={`p-6 ${
                theme === 'neubrutalism' 
                  ? 'border-b-4 border-pure-black bg-electric-blue' 
                  : theme === 'pastel'
                  ? 'border-b border-purple-200/50 bg-gradient-to-r from-purple-400 to-pink-400'
                  : theme === 'corporate'
                  ? 'border-b border-slate-200 bg-gradient-to-r from-blue-600 to-indigo-600'
                  : 'border-b border-emerald-200/50 bg-gradient-to-r from-emerald-500 to-teal-500'
              }`}>
                <div className="flex items-center">
                  <AIAvatar isThinking={false} expression="encouraging" size="small" />
                  <div className="ml-4">
                    <h3 className={`text-lg font-black text-white ${themeClasses.font} tracking-wide`}>
                      AI PHYSICS TUTOR
                    </h3>
                    <p className={`text-sm text-white ${themeClasses.font} font-bold`}>
                      HELPING {student.name.toUpperCase()} MASTER INERTIA CONCEPTS
                    </p>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div 
                ref={chatContainerRef}
                className="flex-1 p-6 overflow-y-auto space-y-4 max-h-[500px] scroll-smooth"
              >
                {chatMessages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === 'student' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] ${message.type === 'student' ? 'order-2' : 'order-1'}`}>
                      <div className={`flex items-start space-x-3 ${message.type === 'student' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${message.type === 'student' ? 'bg-blue-500' : 'bg-gradient-to-br from-violet-500 to-purple-600'}`}>
                          {message.type === 'student' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                        </div>
                        <div className={`px-4 py-3 ${
                          theme === 'neubrutalism' 
                            ? `border-2 border-pure-black ${message.type === 'student' ? 'bg-neon-green text-pure-black' : 'bg-pure-white text-pure-black'}` 
                            : theme === 'pastel'
                            ? `${message.type === 'student' ? 'bg-purple-100 border border-purple-200 text-purple-900' : 'bg-pink-100 border border-pink-200 text-pink-900'} rounded-3xl`
                            : theme === 'corporate'
                            ? `${message.type === 'student' ? 'bg-blue-100 border border-blue-200 text-blue-900' : 'bg-slate-100 border border-slate-200 text-slate-900'} rounded-xl`
                            : `${message.type === 'student' ? 'bg-emerald-100 border border-emerald-200 text-emerald-900' : 'bg-teal-100 border border-teal-200 text-teal-900'} rounded-2xl`
                        }`}>
                          <p className={`text-sm leading-relaxed ${themeClasses.font} font-bold`}>
                            {message.content}
                          </p>
                          {message.score && (
                            <div className={`mt-2 text-xs ${themeClasses.font} font-bold`}>
                              SCORE: {message.score}/100 • {message.reasoning}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className={`text-xs ${
                        theme === 'neubrutalism' ? 'text-pure-black' : 'text-gray-500'
                      } mt-1 ${themeClasses.font} font-bold ${message.type === 'student' ? 'text-right' : 'text-left'}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isProcessing && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-3">
                      <div className={`w-8 h-8 ${
                        theme === 'neubrutalism' 
                          ? 'bg-electric-blue border-2 border-pure-black' 
                          : theme === 'gaming'
                          ? 'bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full'
                          : theme === 'minimal'
                          ? 'bg-gradient-to-br from-amber-500 to-orange-500 rounded-full'
                          : 'bg-gradient-to-br from-purple-500 to-pink-500 rounded-full'
                      } flex items-center justify-center`}>
                        <Bot className="w-4 h-4 text-white" strokeWidth={3} />
                      </div>
                      <div className={`px-4 py-3 ${
                        theme === 'neubrutalism' 
                          ? 'bg-pure-white border-2 border-pure-black' 
                          : theme === 'pastel'
                          ? 'bg-purple-100 border border-purple-200 rounded-3xl'
                          : theme === 'corporate'
                          ? 'bg-slate-100 border border-slate-200 rounded-xl'
                          : 'bg-emerald-100 border border-emerald-200 rounded-2xl'
                      }`}>
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className={`w-2 h-2 ${
                              theme === 'neubrutalism' ? 'bg-electric-blue' : 'bg-emerald-400'
                            } animate-bounce`}></div>
                            <div className={`w-2 h-2 ${
                              theme === 'neubrutalism' ? 'bg-neon-green' : 'bg-teal-400'
                            } animate-bounce`} style={{ animationDelay: '0.1s' }}></div>
                            <div className={`w-2 h-2 ${
                              theme === 'neubrutalism' ? 'bg-hot-pink' : 'bg-blue-400'
                            } animate-bounce`} style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <span className={`text-sm ${
                            theme === 'neubrutalism' ? 'text-pure-black' : themeClasses.text
                          } ${themeClasses.font} font-bold`}>
                            AI IS THINKING...
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className={`p-6 ${
                theme === 'neubrutalism' 
                  ? 'border-t-4 border-pure-black' 
                  : 'border-t border-gray-300/30'
              }`}>
                <textarea
                  value={studentResponse}
                  onChange={(e) => setStudentResponse(e.target.value)}
                  placeholder="TYPE YOUR ANSWER HERE... REMEMBER, EVERY RESPONSE HELPS YOU LEARN!"
                  className={`w-full p-4 focus:outline-none resize-none text-sm font-bold ${
                    theme === 'neubrutalism' 
                      ? 'border-4 border-pure-black bg-pure-white text-pure-black placeholder-gray-600 font-mono' 
                      : theme === 'pastel'
                      ? 'bg-white text-gray-900 placeholder-gray-500 border-2 border-purple-200 rounded-3xl font-sans'
                      : theme === 'corporate'
                      ? 'bg-white text-gray-900 placeholder-gray-500 border-2 border-slate-200 rounded-xl font-sans'
                      : 'bg-white text-gray-900 placeholder-gray-500 border-2 border-emerald-200 rounded-2xl font-sans'
                  }`}
                  rows={3}
                  disabled={isProcessing || showAIResponse}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmitResponse();
                    }
                  }}
                />
                <div className="flex justify-between items-center mt-4">
                  <div className={`flex items-center text-sm ${
                    theme === 'neubrutalism' ? 'text-pure-black' : themeClasses.text
                  } ${themeClasses.font} font-bold`}>
                    <Heart className={`w-4 h-4 mr-2 ${
                      theme === 'neubrutalism' ? 'text-hot-pink' : 'text-red-500'
                    }`} strokeWidth={3} />
                    <span>PRESS ENTER TO SEND, SHIFT+ENTER FOR NEW LINE</span>
                  </div>
                  <button
                    onClick={handleSubmitResponse}
                    onMouseEnter={onSoundEffect}
                    disabled={!studentResponse.trim() || isProcessing}
                    className={`flex items-center px-6 py-3 ${
                      theme === 'neubrutalism' 
                        ? 'bg-neon-green text-pure-black border-4 border-pure-black neubrutalism-button font-mono' 
                        : themeClasses.button
                    } font-black ${themeClasses.font} tracking-wide`}
                  >
                    <Send className="w-4 h-4 mr-2" strokeWidth={3} />
                    <span>{isProcessing ? 'PROCESSING...' : 'SEND'}</span>
                  </button>
                </div>
              </div>
            </div>

            {showAIResponse && (
              <div className="mt-6 text-center">
                <button
                  onClick={handleNextQuestion}
                  className={`px-8 py-4 ${
                    theme === 'neubrutalism' 
                      ? 'bg-hot-pink text-pure-white border-4 border-pure-black neubrutalism-button font-mono' 
                      : theme === 'gaming'
                      ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-lg shadow-lg'
                      : theme === 'minimal'
                      ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl shadow-lg'
                      : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-full shadow-lg'
                  } font-black text-lg ${themeClasses.font} tracking-wide transition-all duration-200`}
                >
                  {currentQuestionIndex < assessmentQuestions.length - 1 ? 'CONTINUE LEARNING' : 'VIEW RESULTS'}
                </button>
              </div>
            )}
          </div>

          {/* AI Reasoning Panel */}
          <div className="lg:col-span-2">
            <div className={`${themeClasses.card} p-6 sticky top-6 ${
              theme === 'neubrutalism' ? 'border-4 border-pure-black' : ''
            }`}>
              <div className="flex items-center mb-6">
                <Brain className={`w-7 h-7 ${themeClasses.accent} mr-3`} strokeWidth={3} />
                <h3 className={`text-xl font-black ${
                  theme === 'neubrutalism' ? 'text-pure-black' : themeClasses.text
                } ${themeClasses.font} tracking-wide`}>
                  AI DECISION PROCESS
                </h3>
              </div>

              {/* Scrollable Content Container */}
              <div 
                ref={reasoningContainerRef}
                className="max-h-[600px] overflow-y-auto scroll-smooth pr-2"
              >
                {!isProcessing && aiReasoning.length === 0 && (
                  <div className="text-center py-8">
                    <div className={`w-20 h-20 ${
                      theme === 'neubrutalism' 
                        ? 'bg-electric-blue border-4 border-pure-black' 
                        : theme === 'gaming'
                        ? 'bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl'
                        : theme === 'minimal'
                        ? 'bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl'
                        : 'bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl'
                    } flex items-center justify-center mx-auto mb-4`}>
                      <Brain className="w-10 h-10 text-white" strokeWidth={3} />
                    </div>
                    <p className={`${
                      theme === 'neubrutalism' ? 'text-pure-black' : themeClasses.text
                    } ${themeClasses.font} font-bold`}>
                      AI WILL ANALYZE YOUR RESPONSE AND SHOW THE TRANSPARENT DECISION-MAKING PROCESS HERE
                    </p>
                  </div>
                )}

                {/* Pre-Assessment Analysis */}
                <div className={`mb-6 p-5 ${
                  theme === 'neubrutalism' 
                    ? 'bg-electric-blue border-4 border-pure-black' 
                    : theme === 'pastel'
                    ? 'bg-gradient-to-br from-purple-400/80 to-pink-400/80 backdrop-blur-sm border border-purple-300/50 rounded-3xl'
                    : theme === 'corporate'
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl'
                    : 'bg-gradient-to-br from-emerald-500/80 to-teal-500/80 backdrop-blur-sm border border-emerald-300/50 rounded-2xl'
                }`}>
                  <h4 className={`font-black text-white mb-4 text-lg ${themeClasses.font} tracking-wide`}>
                    🤖 AI ANALYSIS FOR {student.name.toUpperCase()}:
                  </h4>
                  <div className={`space-y-2 text-sm ${themeClasses.font} font-bold`}>
                    <div className="flex items-center">
                      <div className={`w-2 h-2 ${
                        theme === 'neubrutalism' ? 'bg-hot-pink' : 'bg-red-400'
                      } mr-2`}></div>
                      <span className="text-white">CURRENT STRUGGLE: INERTIA (35% MASTERY) ⚠️</span>
                    </div>
                    <div className="flex items-center">
                      <div className={`w-2 h-2 ${
                        theme === 'neubrutalism' ? 'bg-neon-green' : 'bg-green-400'
                      } mr-2`}></div>
                      <span className="text-white">STRONG FOUNDATION: BASIC FORCES (75% MASTERY) ✅</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-yellow-400 mr-2"></div>
                      <span className="text-white">STRATEGY: BRIDGE FAMILIAR CONCEPTS TO INERTIA</span>
                    </div>
                    <div className="flex items-center">
                      <div className={`w-2 h-2 ${
                        theme === 'neubrutalism' ? 'bg-hot-pink' : 'bg-red-400'
                      } mr-2`}></div>
                      <span className="text-white">EMOTIONAL STATE: BUILDING CONFIDENCE NEEDED</span>
                    </div>
                  </div>
                </div>

                {/* Live Processing */}
                {aiReasoning.map((reasoning, index) => (
                  <div key={index} className={`mb-4 p-5 ${
                    theme === 'neubrutalism' 
                      ? 'bg-neon-green border-4 border-pure-black' 
                      : theme === 'pastel'
                      ? 'bg-gradient-to-br from-green-400/80 to-emerald-400/80 backdrop-blur-sm border border-green-300/50 rounded-3xl'
                      : theme === 'corporate'
                      ? 'bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl'
                      : 'bg-gradient-to-br from-green-500/80 to-teal-500/80 backdrop-blur-sm border border-green-300/50 rounded-2xl'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className={`font-black ${
                        theme === 'neubrutalism' ? 'text-pure-black' : 'text-white'
                      } ${themeClasses.font} tracking-wide`}>
                        {reasoning.step}
                      </h4>
                      <span className={`text-xs ${
                        theme === 'neubrutalism' 
                          ? 'bg-pure-black text-neon-green' 
                          : 'bg-black/30 text-white rounded-lg'
                      } px-3 py-1 font-black ${themeClasses.font}`}>
                        {reasoning.confidence}%
                      </span>
                    </div>
                    <p className={`text-sm ${
                      theme === 'neubrutalism' ? 'text-pure-black' : 'text-white'
                    } mb-2 ${themeClasses.font} font-bold`}>
                      {reasoning.analysis}
                    </p>
                    <p className={`text-xs ${
                      theme === 'neubrutalism' ? 'text-pure-black' : 'text-white'
                    } ${themeClasses.font} font-black`}>
                      NEXT: {reasoning.nextAction}
                    </p>
                  </div>
                ))}

                {isProcessing && (
                  <div className="text-center py-4">
                    <div className={`animate-spin w-10 h-10 border-4 ${
                      theme === 'neubrutalism' 
                        ? 'border-pure-black border-t-electric-blue' 
                        : theme === 'pastel'
                        ? 'border-purple-300 border-t-purple-600'
                        : theme === 'corporate'
                        ? 'border-slate-300 border-t-blue-600'
                        : 'border-emerald-300 border-t-emerald-600'
                    } mx-auto mb-3`}></div>
                    <p className={`text-sm ${
                      theme === 'neubrutalism' ? 'text-pure-black' : themeClasses.text
                    } ${themeClasses.font} font-bold`}>
                      AI IS ANALYZING YOUR RESPONSE...
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assessment;