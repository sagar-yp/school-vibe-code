import React, { useState } from 'react';
import { BookOpen, Target, CheckCircle, MessageSquare, Brain, TrendingUp, Clock, Award } from 'lucide-react';
import { StudentProfile, StudentMasteryGraph } from '../types/student';
import KnowledgeGraph from './KnowledgeGraph';

interface DashboardProps {
  student: StudentProfile;
  masteryData: StudentMasteryGraph;
  onStartAssessment: () => void;
  onViewKnowledgeGraph: () => void;
  theme: string;
  onCardClick?: () => void;
  onCardHover?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ student, masteryData, onStartAssessment, onViewKnowledgeGraph, theme, onCardClick, onCardHover }) => {
  const [showKnowledgeGraph, setShowKnowledgeGraph] = useState(false);

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

  const masteryArray = Object.entries(masteryData);
  const averageMastery = Math.round(
    masteryArray.reduce((sum, [_, concept]) => sum + concept.masteryLevel, 0) / masteryArray.length
  );

  const strongConcepts = masteryArray.filter(([_, concept]) => concept.visualStatus === 'green').length;
  const developingConcepts = masteryArray.filter(([_, concept]) => concept.visualStatus === 'yellow').length;
  const strugglingConcepts = masteryArray.filter(([_, concept]) => concept.visualStatus === 'red').length;

  const getColorScheme = () => {
    if (student.location.includes('India')) {
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

  return (
    <div className={`min-h-screen ${themeClasses.bg} p-6`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className={`${themeClasses.card} p-8 mb-8`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img
                src={student.avatar}
                alt={student.name}
                className={`w-20 h-20 object-cover mr-6 ${
                  theme === 'neubrutalism' 
                    ? 'border-4 border-pure-black' 
                    : theme === 'pastel'
                    ? 'rounded-3xl border-2 border-purple-300/50'
                    : theme === 'corporate'
                    ? 'rounded-xl border-2 border-slate-200'
                    : 'rounded-2xl border-2 border-emerald-300/50'
                }`}
              />
              <div>
                <h1 className={`text-4xl font-black ${
                  theme === 'neubrutalism' ? 'text-pure-black' : themeClasses.text
                } mb-2 ${themeClasses.font} tracking-tight`}>
                  WELCOME BACK, {student.name.toUpperCase()}!
                </h1>
                <p className={`text-xl ${themeClasses.accent} mb-1 ${themeClasses.font} font-bold`}>
                  {student.grade.toUpperCase()} • {student.curriculum.toUpperCase()}
                </p>
                <p className={`${
                  theme === 'neubrutalism' ? 'text-pure-black' : themeClasses.text
                } flex items-center ${themeClasses.font} font-bold`}>
                  <Brain className="w-4 h-4 mr-2" />
                  {student.learningStyle.toUpperCase()} LEARNER
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className={`inline-flex items-center px-6 py-3 ${
                theme === 'neubrutalism' 
                  ? 'bg-neon-green text-pure-black border-4 border-pure-black neubrutalism-button font-mono' 
                  : themeClasses.button
              } font-black text-lg ${themeClasses.font} tracking-wide`}>
                <Award className="w-5 h-5 mr-2" />
                PHYSICS CONFIDENCE: {student.previousAssessments.overallConfidence}%
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Learning Progress */}
            <div className={`${themeClasses.card} p-8`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-3xl font-black ${
                  theme === 'neubrutalism' ? 'text-pure-black' : themeClasses.text
                } ${themeClasses.font} tracking-tight`}>
                  YOUR PHYSICS JOURNEY
                </h2>
                <button
                  onClick={onViewKnowledgeGraph}
                  onMouseEnter={onCardHover}
                  className={`flex items-center px-6 py-3 ${
                    theme === 'neubrutalism' 
                      ? 'bg-electric-blue text-pure-white border-4 border-pure-black neubrutalism-button font-mono' 
                      : themeClasses.button
                  } font-black ${themeClasses.font} tracking-wide`}
                >
                  <Brain className="w-4 h-4 mr-2" />
                  VIEW KNOWLEDGE GRAPH
                </button>
              </div>

              <div className="grid sm:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className={`w-20 h-20 ${
                    theme === 'neubrutalism' 
                      ? 'bg-neon-green border-4 border-pure-black' 
                      : theme === 'pastel'
                      ? 'bg-gradient-to-br from-green-400 to-emerald-400 rounded-3xl shadow-lg'
                      : theme === 'corporate'
                      ? 'bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg'
                      : 'bg-gradient-to-br from-green-400 to-teal-400 rounded-2xl shadow-lg'
                  } flex items-center justify-center mx-auto mb-4`}>
                    <CheckCircle className={`w-10 h-10 ${
                      theme === 'neubrutalism' ? 'text-pure-black' : 'text-white'
                    }`} strokeWidth={3} />
                  </div>
                  <div className={`text-3xl font-black ${
                    theme === 'neubrutalism' ? 'text-neon-green' : 'text-green-500'
                  } ${themeClasses.font}`}>
                    {strongConcepts}
                  </div>
                  <div className={`text-base font-bold ${
                    theme === 'neubrutalism' ? 'text-pure-black' : themeClasses.text
                  } ${themeClasses.font}`}>
                    STRONG CONCEPTS
                  </div>
                </div>
                <div className="text-center">
                  <div className={`w-20 h-20 ${
                    theme === 'neubrutalism' 
                      ? 'bg-yellow-400 border-4 border-pure-black' 
                      : theme === 'pastel'
                      ? 'bg-gradient-to-br from-yellow-400 to-orange-400 rounded-3xl shadow-lg'
                      : theme === 'corporate'
                      ? 'bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl shadow-lg'
                      : 'bg-gradient-to-br from-yellow-400 to-orange-400 rounded-2xl shadow-lg'
                  } flex items-center justify-center mx-auto mb-4`}>
                    <Clock className={`w-10 h-10 ${
                      theme === 'neubrutalism' ? 'text-pure-black' : 'text-white'
                    }`} strokeWidth={3} />
                  </div>
                  <div className={`text-3xl font-black text-yellow-600 ${themeClasses.font}`}>
                    {developingConcepts}
                  </div>
                  <div className={`text-base font-bold ${
                    theme === 'neubrutalism' ? 'text-pure-black' : themeClasses.text
                  } ${themeClasses.font}`}>
                    DEVELOPING
                  </div>
                </div>
                <div className="text-center">
                  <div className={`w-20 h-20 ${
                    theme === 'neubrutalism' 
                      ? 'bg-hot-pink border-4 border-pure-black' 
                      : theme === 'pastel'
                      ? 'bg-gradient-to-br from-pink-400 to-rose-400 rounded-3xl shadow-lg'
                      : theme === 'corporate'
                      ? 'bg-gradient-to-br from-red-500 to-pink-500 rounded-xl shadow-lg'
                      : 'bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl shadow-lg'
                  } flex items-center justify-center mx-auto mb-4`}>
                    <TrendingUp className="w-10 h-10 text-white" strokeWidth={3} />
                  </div>
                  <div className={`text-3xl font-black ${
                    theme === 'neubrutalism' ? 'text-hot-pink' : 'text-red-500'
                  } ${themeClasses.font}`}>
                    {strugglingConcepts}
                  </div>
                  <div className={`text-base font-bold ${
                    theme === 'neubrutalism' ? 'text-pure-black' : themeClasses.text
                  } ${themeClasses.font}`}>
                    GROWTH AREAS
                  </div>
                </div>
              </div>

              {/* Current Focus */}
              <div className={`${
                theme === 'neubrutalism' 
                  ? 'bg-hot-pink border-4 border-pure-black neubrutalism-card' 
                  : theme === 'pastel'
                  ? 'bg-gradient-to-r from-pink-100/80 to-rose-100/80 border border-pink-300/50 rounded-3xl backdrop-blur-sm'
                  : theme === 'corporate'
                  ? 'bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl'
                  : 'bg-gradient-to-r from-pink-100/80 to-rose-100/80 border border-pink-300/50 rounded-2xl backdrop-blur-sm'
              } p-6`}>
                <div className="flex items-center mb-4">
                  <Target className={`w-6 h-6 ${
                    theme === 'neubrutalism' ? 'text-pure-white' : 'text-red-500'
                  } mr-3`} strokeWidth={3} />
                  <h3 className={`text-lg font-black ${
                    theme === 'neubrutalism' ? 'text-pure-white' : themeClasses.text
                  } ${themeClasses.font} tracking-wide`}>
                    CURRENT FOCUS AREA
                  </h3>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-2xl font-black ${
                      theme === 'neubrutalism' ? 'text-pure-white' : themeClasses.text
                    } ${themeClasses.font} tracking-wide mb-1`}>
                      {student.strugglingConcept.toUpperCase()}
                    </p>
                    <p className={`${
                      theme === 'neubrutalism' ? 'text-pure-white' : themeClasses.text
                    } ${themeClasses.font} font-bold`}>
                      MASTERY: {masteryData[student.strugglingConcept.replace(' ', '_')]?.masteryLevel || 35}% 
                      • CONFIDENCE: {masteryData[student.strugglingConcept.replace(' ', '_')]?.confidence || 25}%
                    </p>
                  </div>
                  <div className="text-right">
                    <button
                      onClick={onStartAssessment}
                      onMouseEnter={onCardHover}
                      className={`px-8 py-4 ${
                        theme === 'neubrutalism' 
                          ? 'bg-pure-white text-pure-black border-4 border-pure-black neubrutalism-button font-mono' 
                          : themeClasses.button
                      } font-black text-lg ${themeClasses.font} tracking-wide flex items-center transition-all duration-200`}
                    >
                      <Target className="w-5 h-5 mr-2" />
                      PRACTICE NOW
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Learning Options */}
            <div className={`${themeClasses.card} p-8`}>
              <h2 className={`text-3xl font-black ${
                theme === 'neubrutalism' ? 'text-pure-black' : themeClasses.text
              } ${themeClasses.font} tracking-tight mb-8`}>
                WHAT WOULD YOU LIKE TO DO?
              </h2>
              
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="group cursor-pointer">
                  <div className={`${
                    theme === 'neubrutalism' 
                      ? 'bg-electric-blue border-4 border-pure-black neubrutalism-card' 
                      : theme === 'pastel'
                      ? 'bg-gradient-to-br from-blue-400/80 to-indigo-400/80 backdrop-blur-sm border border-blue-300/50 rounded-3xl shadow-lg hover:shadow-blue-300/50'
                      : theme === 'corporate'
                      ? 'bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-xl hover:shadow-2xl'
                      : 'bg-gradient-to-br from-emerald-500/80 to-teal-500/80 backdrop-blur-sm border border-emerald-300/50 rounded-2xl shadow-lg hover:shadow-emerald-300/50'
                  } p-8 h-full transition-all duration-200 hover:scale-105`}
                  onMouseEnter={onCardHover}
                  onClick={onCardClick}
                >
                    <div className="flex items-center mb-4">
                      <div className={`w-16 h-16 ${
                        theme === 'neubrutalism' 
                          ? 'bg-pure-white border-4 border-pure-black' 
                          : theme === 'pastel'
                          ? 'bg-white/60 backdrop-blur-sm rounded-3xl'
                          : theme === 'corporate'
                          ? 'bg-white/90 rounded-xl shadow-lg'
                          : 'bg-white/60 backdrop-blur-sm rounded-2xl'
                      } flex items-center justify-center mr-6`}>
                        <BookOpen className={`w-8 h-8 ${
                          theme === 'neubrutalism' ? 'text-pure-black' : 'text-white'
                        }`} strokeWidth={3} />
                      </div>
                      <div>
                        <h3 className={`text-2xl font-black text-white ${themeClasses.font} tracking-tight`}>
                          UNDERSTAND A TOPIC
                        </h3>
                        <p className={`text-white ${themeClasses.font} font-bold`}>AVAILABLE</p>
                      </div>
                    </div>
                    <p className={`text-white ${themeClasses.font} font-bold`}>
                      GET PERSONALIZED EXPLANATIONS WITH CULTURAL EXAMPLES THAT MAKE SENSE TO YOU.
                    </p>
                  </div>
                </div>

                <div 
                  onClick={onStartAssessment}
                  onMouseEnter={onCardHover}
                  className="group cursor-pointer"
                >
                  <div className={`${
                    theme === 'neubrutalism' 
                      ? 'bg-neon-green border-4 border-pure-black neubrutalism-card' 
                      : theme === 'pastel'
                      ? 'bg-gradient-to-br from-emerald-400/80 to-teal-400/80 backdrop-blur-sm border border-emerald-300/50 rounded-3xl shadow-lg hover:shadow-emerald-300/50'
                      : theme === 'corporate'
                      ? 'bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl shadow-xl hover:shadow-2xl'
                      : 'bg-gradient-to-br from-emerald-500/80 to-teal-500/80 backdrop-blur-sm border border-emerald-300/50 rounded-2xl shadow-lg hover:shadow-emerald-300/50'
                  } p-8 h-full transition-all duration-200 hover:scale-105`}>
                    <div className="flex items-center mb-4">
                      <div className={`w-16 h-16 ${
                        theme === 'neubrutalism' 
                          ? 'bg-pure-black border-4 border-pure-black' 
                          : theme === 'pastel'
                          ? 'bg-white/60 backdrop-blur-sm rounded-3xl'
                          : theme === 'corporate'
                          ? 'bg-white/90 rounded-xl shadow-lg'
                          : 'bg-white/60 backdrop-blur-sm rounded-2xl'
                      } flex items-center justify-center mr-6`}>
                        <Target className={`w-8 h-8 ${
                          theme === 'neubrutalism' ? 'text-neon-green' : 'text-white'
                        }`} strokeWidth={3} />
                      </div>
                      <div>
                        <h3 className={`text-2xl font-black ${
                          theme === 'neubrutalism' ? 'text-pure-black' : 'text-white'
                        } ${themeClasses.font} tracking-tight`}>
                          TAKE A PRACTICE TEST
                        </h3>
                        <p className={`${
                          theme === 'neubrutalism' ? 'text-pure-black' : 'text-white'
                        } ${themeClasses.font} font-bold text-lg`}>
                          ✨ RECOMMENDED
                        </p>
                      </div>
                    </div>
                    <p className={`${
                      theme === 'neubrutalism' ? 'text-pure-black' : 'text-white'
                    } ${themeClasses.font} font-bold`}>
                      AI-POWERED ADAPTIVE ASSESSMENT THAT GROWS WITH YOUR UNDERSTANDING.
                    </p>
                  </div>
                </div>

                <div className="group cursor-not-allowed opacity-60">
                  <div className={`${
                    theme === 'neubrutalism' 
                      ? 'bg-gray-400 border-4 border-pure-black' 
                      : theme === 'pastel'
                      ? 'bg-gray-300/50 border border-gray-400/30 rounded-3xl'
                      : theme === 'corporate'
                      ? 'bg-gray-300 rounded-xl'
                      : 'bg-gray-300/50 border border-gray-400/30 rounded-2xl'
                  } p-8 h-full`}>
                    <div className="flex items-center mb-4">
                      <div className={`w-16 h-16 ${
                        theme === 'neubrutalism' 
                          ? 'bg-pure-white border-4 border-pure-black' 
                          : theme === 'pastel'
                          ? 'bg-white/60 backdrop-blur-sm rounded-3xl'
                          : theme === 'corporate'
                          ? 'bg-white/90 rounded-xl shadow-lg'
                          : 'bg-white/60 backdrop-blur-sm rounded-2xl'
                      } flex items-center justify-center mr-6`}>
                        <CheckCircle className="w-8 h-8 text-gray-400" strokeWidth={3} />
                      </div>
                      <div>
                        <h3 className={`text-2xl font-black ${
                          theme === 'neubrutalism' ? 'text-pure-black' : themeClasses.text
                        } ${themeClasses.font} tracking-tight`}>
                          REVISE FOR EXAM
                        </h3>
                        <p className={`${
                          theme === 'neubrutalism' ? 'text-pure-black' : themeClasses.text
                        } ${themeClasses.font} font-bold`}>
                          🔒 COMING SOON
                        </p>
                      </div>
                    </div>
                    <p className={`${
                      theme === 'neubrutalism' ? 'text-pure-black' : themeClasses.text
                    } ${themeClasses.font} font-bold`}>
                      SMART REVISION PLANS BASED ON YOUR EXAM SCHEDULE AND WEAK AREAS.
                    </p>
                  </div>
                </div>

                <div className="group cursor-not-allowed opacity-60">
                  <div className={`${
                    theme === 'neubrutalism' 
                      ? 'bg-gray-400 border-4 border-pure-black' 
                      : theme === 'pastel'
                      ? 'bg-gray-300/50 border border-gray-400/30 rounded-3xl'
                      : theme === 'corporate'
                      ? 'bg-gray-300 rounded-xl'
                      : 'bg-gray-300/50 border border-gray-400/30 rounded-2xl'
                  } p-8 h-full`}>
                    <div className="flex items-center mb-4">
                      <div className={`w-16 h-16 ${
                        theme === 'neubrutalism' 
                          ? 'bg-pure-white border-4 border-pure-black' 
                          : theme === 'pastel'
                          ? 'bg-white/60 backdrop-blur-sm rounded-3xl'
                          : theme === 'corporate'
                          ? 'bg-white/90 rounded-xl shadow-lg'
                          : 'bg-white/60 backdrop-blur-sm rounded-2xl'
                      } flex items-center justify-center mr-6`}>
                        <MessageSquare className="w-8 h-8 text-gray-400" strokeWidth={3} />
                      </div>
                      <div>
                        <h3 className={`text-2xl font-black ${
                          theme === 'neubrutalism' ? 'text-pure-black' : themeClasses.text
                        } ${themeClasses.font} tracking-tight`}>
                          I HAVE A DOUBT
                        </h3>
                        <p className={`${
                          theme === 'neubrutalism' ? 'text-pure-black' : themeClasses.text
                        } ${themeClasses.font} font-bold`}>
                          🔒 COMING SOON
                        </p>
                      </div>
                    </div>
                    <p className={`${
                      theme === 'neubrutalism' ? 'text-pure-black' : themeClasses.text
                    } ${themeClasses.font} font-bold`}>
                      ASK QUESTIONS IN NATURAL LANGUAGE AND GET CULTURALLY RELEVANT EXPLANATIONS.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Recent Activity */}
            <div className={`${themeClasses.card} p-6`}>
              <h3 className={`text-xl font-black ${
                theme === 'neubrutalism' ? 'text-pure-black' : themeClasses.text
              } mb-6 ${themeClasses.font} tracking-wide`}>
                RECENT PROGRESS
              </h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className={`w-4 h-4 ${
                    theme === 'neubrutalism' 
                      ? 'bg-neon-green border-2 border-pure-black' 
                      : theme === 'pastel'
                      ? 'bg-emerald-400 rounded-sm'
                      : theme === 'corporate'
                      ? 'bg-green-500 rounded-sm'
                      : 'bg-emerald-400 rounded-sm'
                  } mr-4`}></div>
                  <div className="flex-1">
                    <p className={`text-base font-black ${
                      theme === 'neubrutalism' ? 'text-pure-black' : themeClasses.text
                    } ${themeClasses.font}`}>
                      BASIC FORCES
                    </p>
                    <p className={`text-sm ${
                      theme === 'neubrutalism' ? 'text-pure-black' : themeClasses.text
                    } ${themeClasses.font} font-bold`}>
                      IMPROVED BY 8%
                    </p>
                  </div>
                  <span className={`${
                    theme === 'neubrutalism' ? 'text-neon-green' : 'text-green-500'
                  } text-lg font-black ${themeClasses.font}`}>
                    75%
                  </span>
                </div>
                <div className="flex items-center">
                  <div className={`w-4 h-4 ${
                    theme === 'neubrutalism' 
                      ? 'bg-yellow-400 border-2 border-pure-black' 
                      : theme === 'pastel'
                      ? 'bg-yellow-400 rounded-sm'
                      : theme === 'corporate'
                      ? 'bg-yellow-500 rounded-sm'
                      : 'bg-yellow-400 rounded-sm'
                  } mr-4`}></div>
                  <div className="flex-1">
                    <p className={`text-base font-black ${
                      theme === 'neubrutalism' ? 'text-pure-black' : themeClasses.text
                    } ${themeClasses.font}`}>
                      BALANCED FORCES
                    </p>
                    <p className={`text-sm ${
                      theme === 'neubrutalism' ? 'text-pure-black' : themeClasses.text
                    } ${themeClasses.font} font-bold`}>
                      STEADY PROGRESS
                    </p>
                  </div>
                  <span className={`text-yellow-600 text-lg font-black ${themeClasses.font}`}>68%</span>
                </div>
                <div className="flex items-center">
                  <div className={`w-4 h-4 ${
                    theme === 'neubrutalism' 
                      ? 'bg-hot-pink border-2 border-pure-black' 
                      : theme === 'pastel'
                      ? 'bg-pink-400 rounded-sm'
                      : theme === 'corporate'
                      ? 'bg-red-500 rounded-sm'
                      : 'bg-pink-400 rounded-sm'
                  } mr-4`}></div>
                  <div className="flex-1">
                    <p className={`text-base font-black ${
                      theme === 'neubrutalism' ? 'text-pure-black' : themeClasses.text
                    } ${themeClasses.font}`}>
                      INERTIA CONCEPT
                    </p>
                    <p className={`text-sm ${
                      theme === 'neubrutalism' ? 'text-pure-black' : themeClasses.text
                    } ${themeClasses.font} font-bold`}>
                      NEEDS ATTENTION
                    </p>
                  </div>
                  <span className={`${
                    theme === 'neubrutalism' ? 'text-hot-pink' : 'text-red-500'
                  } text-lg font-black ${themeClasses.font}`}>
                    35%
                  </span>
                </div>
              </div>
            </div>

            {/* Motivational Quote */}
            <div className={`${
              theme === 'neubrutalism' 
                ? 'bg-electric-blue border-4 border-pure-black text-pure-white neubrutalism-card' 
                : theme === 'pastel'
                ? 'bg-gradient-to-br from-purple-400/80 to-pink-400/80 backdrop-blur-sm border border-purple-300/50 rounded-3xl text-white shadow-lg'
                : theme === 'corporate'
                ? 'bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl text-white shadow-xl'
                : 'bg-gradient-to-br from-emerald-500/80 to-teal-500/80 backdrop-blur-sm border border-emerald-300/50 rounded-2xl text-white shadow-lg'
            } p-6`}>
              <h3 className={`text-xl font-black mb-4 ${themeClasses.font} tracking-wide`}>
                DAILY MOTIVATION
              </h3>
              <blockquote className={`text-base font-bold ${themeClasses.font}`}>
                {student.location.includes('India') 
                  ? "\"EVERY EXPERT WAS ONCE A BEGINNER. KEEP LEARNING, KEEP GROWING!\" 🌟"
                  : "\"SUCCESS IS THE SUM OF SMALL EFFORTS REPEATED DAY IN AND DAY OUT.\" 🚀"
                }
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;