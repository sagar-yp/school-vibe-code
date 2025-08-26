import React from 'react';
import { Users, MapPin, BookOpen, User } from 'lucide-react';
import { StudentProfile } from '../types/student';

interface StudentSelectorProps {
  students: Record<string, StudentProfile>;
  selectedStudent: string;
  onSelectStudent: (studentId: string) => void;
  theme: string;
  onCardHover?: () => void;
}

const StudentSelector: React.FC<StudentSelectorProps> = ({ 
  students, 
  selectedStudent, 
  onSelectStudent,
  theme,
  onCardHover
}) => {
  const getThemeClasses = () => {
    switch (theme) {
      case 'pastel':
        return {
          bg: 'bg-white/80 backdrop-blur-sm shadow-xl border border-purple-200/50 rounded-3xl',
          text: 'text-gray-800',
          accent: 'text-purple-600',
          button: 'bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white rounded-2xl shadow-lg hover:shadow-purple-300/50 transform hover:scale-105 transition-all duration-200',
          card: 'bg-white/80 backdrop-blur-sm shadow-xl border border-purple-200/50 rounded-3xl',
          icon: 'bg-gradient-to-br from-purple-400 to-pink-400 rounded-3xl shadow-lg',
          font: 'font-display'
        };
      case 'corporate':
        return {
          bg: 'bg-white shadow-2xl border border-slate-200 rounded-xl',
          text: 'text-gray-900',
          accent: 'text-blue-600',
          button: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg shadow-lg hover:shadow-blue-300/50 transform hover:scale-105 transition-all duration-200',
          card: 'bg-white shadow-2xl border border-slate-200 rounded-xl',
          icon: 'bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg',
          font: 'font-corporate'
        };
      case 'nature':
        return {
          bg: 'bg-white/90 backdrop-blur-sm shadow-xl border border-emerald-200/50 rounded-2xl',
          text: 'text-gray-800',
          accent: 'text-emerald-600',
          button: 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl shadow-lg hover:shadow-emerald-300/50 transform hover:scale-105 transition-all duration-200',
          card: 'bg-white/90 backdrop-blur-sm shadow-xl border border-emerald-200/50 rounded-2xl',
          icon: 'bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl shadow-lg',
          font: 'font-nature'
        };
      default: // neubrutalism
        return {
          bg: 'bg-pure-white neubrutalism-card',
          text: 'text-pure-black',
          accent: 'text-electric-blue',
          button: 'bg-neon-green text-pure-black border-4 border-pure-black font-black font-mono tracking-wide neubrutalism-button',
          card: 'bg-pure-white neubrutalism-card',
          icon: 'bg-electric-blue border-4 border-pure-black',
          font: 'font-mono'
        };
    }
  };

  const themeClasses = getThemeClasses();

  return (
    <div className={`${themeClasses.bg} p-12 mb-16 mx-4`}>
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className={`w-16 h-16 ${themeClasses.icon} mr-6 flex items-center justify-center ${
            theme === 'neubrutalism' ? 'border-2 border-pure-black' : ''
          }`}>
            <Users className={`w-8 h-8 ${
              theme === 'neubrutalism' ? 'text-pure-white' : 'text-white'
            }`} strokeWidth={3} />
          </div>
          <h2 className={`text-5xl font-black ${themeClasses.text} ${themeClasses.font} tracking-tight`}>
            SELECT STUDENT PROFILE
          </h2>
        </div>
        <p className={`${themeClasses.text} text-xl ${themeClasses.font} tracking-wide`}>
          EXPERIENCE HOW AI ADAPTS TO DIFFERENT CULTURAL CONTEXTS
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {Object.entries(students).map(([studentId, student]) => (
          <div
            key={studentId}
            onClick={() => onSelectStudent(studentId)}
            onMouseEnter={() => onCardHover && onCardHover()}
            className={`group cursor-pointer transform transition-all duration-200 ${
              selectedStudent === studentId
                ? 'scale-105'
                : ''
            }`}
          >
            <div className={`${themeClasses.card} p-10 h-full ${
              selectedStudent === studentId 
                ? theme === 'neubrutalism' 
                  ? 'bg-neon-green' 
                  : theme === 'pastel'
                  ? 'ring-2 ring-purple-400 bg-purple-50/80'
                  : theme === 'corporate'
                  ? 'ring-2 ring-blue-400 bg-blue-50'
                  : 'ring-2 ring-emerald-400 bg-emerald-50/80'
                : ''
            }`}>
              <div className="flex items-center mb-8">
                <div className={`w-24 h-24 ${themeClasses.icon} mr-8 flex items-center justify-center overflow-hidden ${
                  theme === 'neubrutalism' ? 'border-4 border-pure-black' : ''
                }`}>
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className={`text-3xl font-black ${themeClasses.text} ${themeClasses.font} tracking-tight`}>
                    {student.name.toUpperCase()}
                  </h3>
                  <p className={`${themeClasses.accent} font-bold text-lg ${themeClasses.font}`}>
                    {student.grade.toUpperCase()}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className={`flex items-center ${themeClasses.text}`}>
                  <div className={`w-8 h-8 ${
                    theme === 'neubrutalism' 
                      ? 'bg-hot-pink border-2 border-pure-black' 
                      : theme === 'pastel'
                      ? 'bg-gradient-to-br from-pink-400 to-rose-400 rounded-lg'
                      : theme === 'corporate'
                      ? 'bg-gradient-to-br from-red-500 to-pink-500 rounded-lg'
                      : 'bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg'
                  } mr-4 flex items-center justify-center`}>
                    <MapPin className={`w-4 h-4 ${
                      theme === 'neubrutalism' ? 'text-pure-white' : 'text-white'
                    }`} strokeWidth={3} />
                  </div>
                  <span className={`font-bold ${themeClasses.font} tracking-wide`}>
                    {student.location.toUpperCase()}
                  </span>
                </div>
                
                <div className={`flex items-center ${themeClasses.text}`}>
                  <div className={`w-8 h-8 ${
                    theme === 'neubrutalism' 
                      ? 'bg-neon-green border-2 border-pure-black' 
                      : theme === 'pastel'
                      ? 'bg-gradient-to-br from-emerald-400 to-teal-400 rounded-lg'
                      : theme === 'corporate'
                      ? 'bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg'
                      : 'bg-gradient-to-br from-green-400 to-teal-400 rounded-lg'
                  } mr-4 flex items-center justify-center`}>
                    <BookOpen className={`w-4 h-4 ${
                      theme === 'neubrutalism' ? 'text-pure-black' : 'text-white'
                    }`} strokeWidth={3} />
                  </div>
                  <span className={`font-bold ${themeClasses.font} tracking-wide`}>
                    {student.curriculum.toUpperCase()}
                  </span>
                </div>

                <div className={`pt-6 ${
                  theme === 'neubrutalism' 
                    ? 'border-t-4 border-pure-black' 
                    : 'border-t-2 border-gray-300/30'
                }`}>
                  <p className={`text-sm ${themeClasses.text} mb-2 ${themeClasses.font} font-bold`}>
                    LEARNING STYLE:
                  </p>
                  <p className={`${themeClasses.accent} font-bold ${themeClasses.font}`}>
                    {student.learningStyle.toUpperCase()}
                  </p>
                </div>

                <div className="pt-4">
                  <p className={`text-sm ${themeClasses.text} mb-2 ${themeClasses.font} font-bold`}>
                    CURRENT CHALLENGE:
                  </p>
                  <p className={`${
                    theme === 'neubrutalism' 
                      ? 'text-hot-pink' 
                      : theme === 'gaming'
                      ? 'text-red-400'
                      : theme === 'minimal'
                      ? 'text-red-600'
                      : 'text-pink-400'
                  } font-bold ${themeClasses.font} text-lg`}>
                    {student.strugglingConcept.toUpperCase()}
                  </p>
                </div>

                <div className="pt-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-sm ${themeClasses.text} ${themeClasses.font} font-bold`}>
                      PHYSICS CONFIDENCE
                    </span>
                    <span className={`text-sm font-bold ${themeClasses.text} ${themeClasses.font}`}>
                      {student.previousAssessments.overallConfidence}%
                    </span>
                  </div>
                  <div className={`w-full h-6 ${
                    theme === 'neubrutalism' 
                      ? 'bg-pure-black border-2 border-pure-black' 
                      : theme === 'pastel'
                      ? 'bg-purple-200 rounded-lg overflow-hidden'
                      : theme === 'corporate'
                      ? 'bg-slate-200 rounded-lg overflow-hidden'
                      : 'bg-emerald-200 rounded-lg overflow-hidden'
                  }`}>
                    <div
                      className={`h-full transition-all duration-300 ${
                        theme === 'neubrutalism' 
                          ? 'bg-electric-blue' 
                          : theme === 'pastel'
                          ? 'bg-gradient-to-r from-purple-400 to-pink-400'
                          : theme === 'corporate'
                          ? 'bg-gradient-to-r from-blue-400 to-indigo-400'
                          : 'bg-gradient-to-r from-emerald-400 to-teal-400'
                      }`}
                      style={{ width: `${student.previousAssessments.overallConfidence}%` }}
                    />
                  </div>
                </div>
              </div>

              {selectedStudent === studentId && (
                <div className="mt-8 text-center">
                  <div className={`inline-flex items-center px-6 py-3 ${
                    theme === 'neubrutalism' 
                      ? 'bg-pure-black text-neon-green border-2 border-neon-green font-mono' 
                      : themeClasses.button
                  } font-bold text-lg ${themeClasses.font} tracking-wide`}>
                    PROFILE SELECTED
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentSelector;