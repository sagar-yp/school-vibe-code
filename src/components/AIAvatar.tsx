import React from 'react';
import { Zap, Activity, Cpu, Radio } from 'lucide-react';

interface AIAvatarProps {
  isThinking: boolean;
  expression: 'neutral' | 'encouraging' | 'celebrating' | 'concerned';
  size?: 'small' | 'medium' | 'large';
  showPulse?: boolean;
  name?: string;
}

const AIAvatar: React.FC<AIAvatarProps> = ({ 
  isThinking, 
  expression = 'neutral', 
  size = 'medium',
  showPulse = false,
  name = 'ARIA'
}) => {
  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-32 h-32'
  };

  const getExpressionState = () => {
    switch (expression) {
      case 'encouraging':
        return {
          bg: 'bg-neon-green',
          glow: 'shadow-[0_0_30px_#00FF88]',
          icon: Activity,
          scanColor: '#00FF88'
        };
      case 'celebrating':
        return {
          bg: 'bg-hot-pink',
          glow: 'shadow-[0_0_30px_#FF0080]',
          icon: Zap,
          scanColor: '#FF0080'
        };
      case 'concerned':
        return {
          bg: 'bg-electric-blue',
          glow: 'shadow-[0_0_30px_#0066FF]',
          icon: Radio,
          scanColor: '#0066FF'
        };
      default:
        return {
          bg: 'bg-electric-blue',
          glow: 'shadow-[0_0_30px_#0066FF]',
          icon: Cpu,
          scanColor: '#0066FF'
        };
    }
  };

  const state = getExpressionState();
  const IconComponent = state.icon;

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Main Avatar Container */}
      <div className="relative">
        {/* Outer Glow Ring */}
        {showPulse && (
          <div className={`absolute inset-0 ${sizeClasses[size]} ${state.bg} opacity-20 animate-ping`} 
               style={{ clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)' }}>
          </div>
        )}
        
        {/* Main Avatar Body */}
        <div className={`${sizeClasses[size]} ${state.bg} ${state.glow} relative z-10 transition-all duration-300 hover:scale-105 scan-lines`}
             style={{ clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)' }}>
          
          {/* Circuit Pattern Overlay */}
          <div className="absolute inset-0 opacity-30">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <defs>
                <pattern id="circuit" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M10,0 L10,10 L20,10" stroke="currentColor" strokeWidth="1" fill="none"/>
                  <circle cx="10" cy="10" r="2" fill="currentColor"/>
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#circuit)" className="text-pure-white"/>
            </svg>
          </div>
          
          {/* Main Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <IconComponent className="w-1/2 h-1/2 text-pure-black font-bold" strokeWidth={3} />
          </div>
          
          {/* Corner Accents */}
          <div className="absolute top-1 left-1 w-2 h-2 bg-pure-black"></div>
          <div className="absolute top-1 right-1 w-2 h-2 bg-pure-black"></div>
          <div className="absolute bottom-1 left-1 w-2 h-2 bg-pure-black"></div>
          <div className="absolute bottom-1 right-1 w-2 h-2 bg-pure-black"></div>
        </div>
        
        {/* Thinking Indicator */}
        {isThinking && (
          <div className="absolute -top-4 -right-4 z-20">
            <div className="bg-pure-white border-2 border-pure-black px-3 py-1 font-mono text-xs font-bold text-pure-black neubrutalism-card">
              <div className="flex items-center space-x-1">
                <div className="w-1 h-1 bg-electric-blue animate-pulse"></div>
                <div className="w-1 h-1 bg-neon-green animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-1 h-1 bg-hot-pink animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                <span>PROC</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* AI Name Label */}
      <div className="mt-3 bg-pure-white border-2 border-pure-black px-3 py-1 font-mono text-xs font-bold text-pure-black tracking-wider">
        {name}
      </div>
      
      {/* Celebration Effects */}
      {expression === 'celebrating' && (
        <div className="absolute inset-0 pointer-events-none z-30">
          <div className="absolute -top-2 -left-2 w-3 h-3 bg-hot-pink animate-ping"></div>
          <div className="absolute -top-2 -right-2 w-2 h-2 bg-neon-green animate-ping" style={{ animationDelay: '300ms' }}></div>
          <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-electric-blue animate-ping" style={{ animationDelay: '600ms' }}></div>
          <div className="absolute -bottom-2 -right-2 w-3 h-3 bg-hot-pink animate-ping" style={{ animationDelay: '900ms' }}></div>
        </div>
      )}
    </div>
  );
};

export default AIAvatar;