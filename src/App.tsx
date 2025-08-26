import React, { useState } from 'react';
import { Cpu, Zap, Radio, Palette, Brain } from 'lucide-react';
import StudentSelector from './components/StudentSelector';
import Dashboard from './components/Dashboard';
import Assessment from './components/Assessment';
import KnowledgeGraph from './components/KnowledgeGraph';
import { studentProfiles, studentMasteryGraphs } from './data/studentData';

type AppState = 'selector' | 'dashboard' | 'assessment' | 'knowledge-graph';
type Theme = 'neubrutalism' | 'dreamy' | 'sleek' | 'fresh';

function App() {
  const [appState, setAppState] = useState<AppState>('selector');
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [currentTheme, setCurrentTheme] = useState<Theme>('neubrutalism');
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [isKnowledgeGraphFullscreen, setIsKnowledgeGraphFullscreen] = useState(false);

  const currentStudent = selectedStudent ? studentProfiles[selectedStudent] : null;
  const currentMasteryData = selectedStudent ? studentMasteryGraphs[selectedStudent] : null;

  const handleStudentSelect = (studentId: string) => {
    setSelectedStudent(studentId);
    setAppState('dashboard');
  };

  const handleStartAssessment = () => {
    setAppState('assessment');
  };

  const handleBackToDashboard = () => {
    setAppState('dashboard');
  };

  const handleAssessmentComplete = () => {
    setAppState('dashboard');
  };

  // Sound effects
  const playClickSound = () => {
    try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      // Silently fail if audio context is not available
    }
  };

  const playHoverSound = () => {
    try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.05);
    } catch (error) {
      // Silently fail if audio context is not available
    }
  };

  const getThemeClasses = () => {
    switch (currentTheme) {
      case 'dreamy':
        return {
          bg: 'bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50',
          text: 'text-gray-800',
          accent: 'text-purple-600',
          card: 'bg-white/80 backdrop-blur-sm shadow-xl border border-purple-200/50 rounded-3xl',
          button: 'bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white rounded-2xl shadow-lg hover:shadow-purple-300/50 transform hover:scale-105 transition-all duration-200',
          font: 'font-display'
        };
      case 'sleek':
        return {
          bg: 'bg-gradient-to-br from-slate-50 to-blue-50',
          text: 'text-gray-900',
          accent: 'text-blue-600',
          card: 'bg-white shadow-2xl border border-slate-200 rounded-xl',
          button: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg shadow-lg hover:shadow-blue-300/50 transform hover:scale-105 transition-all duration-200',
          font: 'font-corporate'
        };
      case 'fresh':
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

  const theme = getThemeClasses();

  const ThemeSidebar = () => (
    <>
      {/* Hover trigger area */}
      <div 
        className="fixed left-0 top-0 w-4 h-full z-40"
        onMouseEnter={() => setShowThemeSelector(true)}
      />
      
      {/* Sidebar */}
      <div 
        className={`fixed left-0 top-0 h-full w-80 bg-pure-black border-r-4 border-pure-white z-50 transform transition-transform duration-300 ${
          showThemeSelector ? 'translate-x-0' : '-translate-x-full'
        }`}
        onMouseLeave={() => setShowThemeSelector(false)}
      >
        <div className="p-8">
          <div className="flex items-center mb-8">
            <Palette className="w-8 h-8 text-neon-green mr-4" strokeWidth={3} />
            <h3 className="text-2xl font-black text-pure-white font-mono tracking-wide">THEME SELECTOR</h3>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={() => {
                setCurrentTheme('neubrutalism');
                playClickSound();
              }}
              onMouseEnter={playHoverSound}
              className={`w-full p-6 text-left transition-all duration-200 ${
                currentTheme === 'neubrutalism' 
                  ? 'bg-electric-blue border-4 border-pure-white neubrutalism-card' 
                  : 'bg-pure-white border-4 border-pure-white hover:bg-neon-green neubrutalism-card'
              }`}
            >
              <div className={`text-xl font-black font-mono tracking-wide ${
                currentTheme === 'neubrutalism' ? 'text-pure-white' : 'text-pure-black'
              }`}>
                🔥 BRUTAL
              </div>
              <div className={`text-sm font-bold font-mono ${
                currentTheme === 'neubrutalism' ? 'text-pure-white' : 'text-pure-black'
              }`}>
                HIGH-CONTRAST TECH AESTHETIC
              </div>
            </button>
            
            <button
              onClick={() => {
                setCurrentTheme('dreamy');
                playClickSound();
              }}
              onMouseEnter={playHoverSound}
              className={`w-full p-6 text-left transition-all duration-200 ${
                currentTheme === 'dreamy' 
                  ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-2xl shadow-lg' 
                  : 'bg-pure-white border-4 border-pure-white hover:bg-gradient-to-r hover:from-purple-200 hover:to-pink-200 neubrutalism-card'
              }`}
            >
              <div className={`text-xl font-black font-display tracking-tight ${
                currentTheme === 'dreamy' ? 'text-white' : 'text-pure-black'
              }`}>
                🌸 DREAMY
              </div>
              <div className={`text-sm font-bold font-display ${
                currentTheme === 'dreamy' ? 'text-white' : 'text-pure-black'
              }`}>
                SOFT INSTAGRAM AESTHETIC
              </div>
            </button>
            
            <button
              onClick={() => {
                setCurrentTheme('sleek');
                playClickSound();
              }}
              onMouseEnter={playHoverSound}
              className={`w-full p-6 text-left transition-all duration-200 ${
                currentTheme === 'sleek' 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg' 
                  : 'bg-pure-white border-4 border-pure-white hover:bg-gradient-to-r hover:from-blue-200 hover:to-indigo-200 neubrutalism-card'
              }`}
            >
              <div className={`text-xl font-black font-corporate ${
                currentTheme === 'sleek' ? 'text-white' : 'text-pure-black'
              }`}>
                💼 SLEEK
              </div>
              <div className={`text-sm font-bold font-corporate ${
                currentTheme === 'sleek' ? 'text-white' : 'text-pure-black'
              }`}>
                PROFESSIONAL MODERN
              </div>
            </button>
            
            <button
              onClick={() => {
                setCurrentTheme('fresh');
                playClickSound();
              }}
              onMouseEnter={playHoverSound}
              className={`w-full p-6 text-left transition-all duration-200 ${
                currentTheme === 'fresh' 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl shadow-lg' 
                  : 'bg-pure-white border-4 border-pure-white hover:bg-gradient-to-r hover:from-emerald-200 hover:to-teal-200 neubrutalism-card'
              }`}
            >
              <div className={`text-xl font-black font-nature ${
                currentTheme === 'fresh' ? 'text-white' : 'text-pure-black'
              }`}>
                🌿 FRESH
              </div>
              <div className={`text-sm font-bold font-nature ${
                currentTheme === 'fresh' ? 'text-white' : 'text-pure-black'
              }`}>
                ORGANIC ECO-FRIENDLY
              </div>
            </button>
          </div>
          
          <div className="mt-8 p-4 bg-neon-green border-2 border-pure-white">
            <p className="text-xs text-pure-black font-mono font-bold">
              HOVER LEFT EDGE TO ACCESS THEMES
            </p>
          </div>
        </div>
      </div>
    </>
  );
  
  const renderHeader = () => appState === 'selector' && (
    <div className={`text-center mb-16 ${theme.text}`}>
      <div className="flex items-center justify-center mb-8">
        <div className={`w-20 h-20 mr-6 flex items-center justify-center ${
          currentTheme === 'neubrutalism' 
            ? 'bg-electric-blue border-4 border-pure-white neubrutalism-card' 
            : currentTheme === 'pastel'
            ? 'bg-gradient-to-br from-purple-400 to-pink-400 rounded-3xl shadow-lg shadow-purple-300/50'
            : currentTheme === 'corporate'
            ? 'bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-xl'
            : 'bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl shadow-lg shadow-emerald-300/50'
        }`}>
          <Cpu className={`w-10 h-10 ${
            currentTheme === 'neubrutalism' ? 'text-pure-black' : 'text-white'
          }`} strokeWidth={3} />
        </div>
        <div>
          <h1 className={`text-6xl font-bold tracking-tight ${theme.text} ${theme.font} ${
            currentTheme === 'neubrutalism' ? 'glitch-text' : ''
          }`} data-text="ISCUELA.AI">
            iScuela AI
          </h1>
          <p className={`text-xl mt-3 tracking-wide ${theme.accent} ${theme.font}`}>
            INTELLIGENT // EMPATHETIC // PERSONALIZED
          </p>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <p className={`text-lg mb-8 leading-relaxed ${theme.text} ${theme.font}`}>
          EXPERIENCE THE FUTURE OF EDUCATION WITH AI THAT UNDERSTANDS YOUR CULTURAL CONTEXT,
          ADAPTS TO YOUR LEARNING STYLE, AND GUIDES YOU WITH GENUINE EMPATHY.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className={`${theme.card} p-8`}>
            <div className={`w-16 h-16 flex items-center justify-center mx-auto mb-6 ${
              currentTheme === 'neubrutalism' 
                ? 'bg-electric-blue border-2 border-pure-black' 
                : currentTheme === 'pastel'
                ? 'bg-gradient-to-br from-purple-400 to-pink-400 rounded-3xl shadow-lg'
                : currentTheme === 'corporate'
                ? 'bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg'
                : 'bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl shadow-lg'
            }`}>
              <Cpu className={`w-8 h-8 ${
                currentTheme === 'neubrutalism' ? 'text-pure-white' : 'text-white'
              }`} strokeWidth={3} />
            </div>
            <h3 className={`text-xl font-bold mb-4 tracking-wide ${
              currentTheme === 'neubrutalism' ? 'text-pure-black font-mono' : theme.text
            }`}>TRANSPARENT AI</h3>
            <p className={`text-sm leading-relaxed ${
              currentTheme === 'neubrutalism' ? 'text-pure-black font-mono' : theme.text
            }`}>SEE EXACTLY HOW AI MAKES DECISIONS AND PERSONALIZES YOUR LEARNING EXPERIENCE</p>
          </div>
          
          <div className={`${theme.card} p-8`}>
            <div className={`w-16 h-16 flex items-center justify-center mx-auto mb-6 ${
              currentTheme === 'neubrutalism' 
                ? 'bg-neon-green border-2 border-pure-black' 
                : currentTheme === 'pastel'
                ? 'bg-gradient-to-br from-green-400 to-emerald-400 rounded-3xl shadow-lg'
                : currentTheme === 'corporate'
                ? 'bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg'
                : 'bg-gradient-to-br from-green-400 to-teal-400 rounded-2xl shadow-lg'
            }`}>
              <Zap className={`w-8 h-8 ${
                currentTheme === 'neubrutalism' ? 'text-pure-black' : 'text-white'
              }`} strokeWidth={3} />
            </div>
            <h3 className={`text-xl font-bold mb-4 tracking-wide ${
              currentTheme === 'neubrutalism' ? 'text-pure-black font-mono' : theme.text
            }`}>CULTURAL INTEL</h3>
            <p className={`text-sm leading-relaxed ${
              currentTheme === 'neubrutalism' ? 'text-pure-black font-mono' : theme.text
            }`}>AI THAT ADAPTS EXAMPLES, LANGUAGE, AND TEACHING STYLE TO YOUR CULTURAL BACKGROUND</p>
          </div>
          
          <div className={`${theme.card} p-8`}>
            <div className={`w-16 h-16 flex items-center justify-center mx-auto mb-6 ${
              currentTheme === 'neubrutalism' 
                ? 'bg-hot-pink border-2 border-pure-black' 
                : currentTheme === 'pastel'
                ? 'bg-gradient-to-br from-pink-400 to-rose-400 rounded-3xl shadow-lg'
                : currentTheme === 'corporate'
                ? 'bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl shadow-lg'
                : 'bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl shadow-lg'
            }`}>
              <Radio className={`w-8 h-8 ${
                currentTheme === 'neubrutalism' ? 'text-pure-white' : 'text-white'
              }`} strokeWidth={3} />
            </div>
            <h3 className={`text-xl font-bold mb-4 tracking-wide ${
              currentTheme === 'neubrutalism' ? 'text-pure-black font-mono' : theme.text
            }`}>EMPATHETIC AI</h3>
            <p className={`text-sm leading-relaxed ${
              currentTheme === 'neubrutalism' ? 'text-pure-black font-mono' : theme.text
            }`}>ENCOURAGING, SUPPORTIVE AI THAT BUILDS CONFIDENCE WHILE YOU LEARN</p>
          </div>
        </div>
      </div>
    </div>
  );

  const KnowledgeGraphPage = () => (
    <>
      {!isKnowledgeGraphFullscreen && (
        <div className="min-h-screen bg-pure-black p-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-pure-white border-4 border-pure-black neubrutalism-card p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-electric-blue border-2 border-pure-black flex items-center justify-center mr-4">
                    <Brain className="w-6 h-6 text-pure-white" strokeWidth={3} />
                  </div>
                  <div>
                    <h1 className="text-3xl font-black text-pure-black font-mono tracking-tight">
                      {currentStudent?.name.toUpperCase()}'S KNOWLEDGE GRAPH
                    </h1>
                    <p className="text-pure-black font-mono font-bold">
                      VISUAL REPRESENTATION OF PHYSICS CONCEPT MASTERY
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setAppState('dashboard')}
                  className="bg-hot-pink text-pure-white border-4 border-pure-black font-black font-mono tracking-wide neubrutalism-button px-6 py-3"
                >
                  BACK TO DASHBOARD
                </button>
              </div>
            </div>
            
            {currentStudent && currentMasteryData && (
              <KnowledgeGraph 
                studentData={currentMasteryData}
                onClose={() => {
                  setIsKnowledgeGraphFullscreen(false);
                  setAppState('dashboard');
                }}
                isFullscreen={isKnowledgeGraphFullscreen}
                onToggleFullscreen={() => setIsKnowledgeGraphFullscreen(!isKnowledgeGraphFullscreen)}
              />
            )}
          </div>
        </div>
      )}
      
      {isKnowledgeGraphFullscreen && currentStudent && currentMasteryData && (
        <KnowledgeGraph 
          studentData={currentMasteryData}
          onClose={() => {
            setIsKnowledgeGraphFullscreen(false);
            setAppState('dashboard');
          }}
          isFullscreen={isKnowledgeGraphFullscreen}
          onToggleFullscreen={() => setIsKnowledgeGraphFullscreen(!isKnowledgeGraphFullscreen)}
        />
      )}
    </>
  );

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.font}`}>
      <ThemeSidebar />
      {renderHeader()}

      {appState === 'selector' && (
        <div>
          <StudentSelector 
            students={studentProfiles}
            selectedStudent={selectedStudent}
            onSelectStudent={(studentId) => {
              handleStudentSelect(studentId);
              playClickSound();
            }}
            theme={currentTheme}
            onCardHover={playHoverSound}
          />
        </div>
      )}

      {appState === 'dashboard' && currentStudent && currentMasteryData && (
        <Dashboard 
          student={currentStudent}
          masteryData={currentMasteryData}
          onStartAssessment={() => {
            handleStartAssessment();
            playClickSound();
          }}
          onViewKnowledgeGraph={() => setAppState('knowledge-graph')}
          theme={currentTheme}
          onCardClick={playClickSound}
          onCardHover={playHoverSound}
        />
      )}

      {appState === 'assessment' && currentStudent && (
        <Assessment 
          student={currentStudent}
          onBack={handleBackToDashboard}
          onComplete={handleAssessmentComplete}
          theme={currentTheme}
          onSoundEffect={playClickSound}
        />
      )}

      {appState === 'knowledge-graph' && (
        <KnowledgeGraphPage />
      )}
    </div>
  );
}

export default App;