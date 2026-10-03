import React from 'react';

interface BrandLogoProps {
  className?: string;
  variant?: 'full' | 'horizontal' | 'iconOnly' | 'compact';
  theme?: 'dark' | 'light' | 'saffron';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  variant = 'full',
  theme = 'dark',
  size = 'md',
}) => {
  const primaryColor = theme === 'light' ? '#8C281C' : '#D9B47A';
  const accentColor = '#C98224';
  const deepKumkum = '#8C281C';

  // Sizing definitions
  const dimensions = {
    sm: { iconWidth: 36, iconHeight: 44, textSize: 'text-xs', titleSize: 'text-sm' },
    md: { iconWidth: 48, iconHeight: 58, textSize: 'text-xs', titleSize: 'text-lg' },
    lg: { iconWidth: 72, iconHeight: 88, textSize: 'text-sm', titleSize: 'text-2xl' },
    xl: { iconWidth: 100, iconHeight: 120, textSize: 'text-base', titleSize: 'text-3xl' },
  }[size];

  const SacredEmblem = (
    <svg
      width={dimensions.iconWidth}
      height={dimensions.iconHeight}
      viewBox="0 0 100 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-500 hover:scale-105"
      aria-label="Travel With Guru Sacred Emblem"
    >
      <defs>
        <linearGradient id="twgArchGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C98224" />
          <stop offset="50%" stopColor="#8C281C" />
          <stop offset="100%" stopColor="#4A2819" />
        </linearGradient>
        <linearGradient id="twgTrishulGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F6EBD4" />
          <stop offset="40%" stopColor="#D9B47A" />
          <stop offset="100%" stopColor="#8C281C" />
        </linearGradient>
      </defs>

      {/* Decorative Traditional Kerala Temple Arch */}
      <path
        d="M 50 4 
           C 54 10, 64 12, 70 20
           C 76 27, 72 32, 78 40
           C 82 46, 84 54, 84 64
           L 84 112
           L 16 112
           L 16 64
           C 16 54, 18 46, 22 40
           C 28 32, 24 27, 30 20
           C 36 12, 46 10, 50 4 Z"
        stroke="url(#twgArchGradient)"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="rgba(140, 40, 28, 0.08)"
      />

      {/* Inner Decorative Arch Line */}
      <path
        d="M 50 12 
           C 53 16, 60 18, 65 24
           C 70 30, 67 34, 72 41
           C 75 46, 76 53, 76 62
           L 76 108
           L 24 108
           L 24 62
           C 24 53, 25 46, 28 41
           C 33 34, 30 30, 35 24
           C 40 18, 47 16, 50 12 Z"
        stroke="#C98224"
        strokeWidth="1.2"
        strokeDasharray="2 3"
        fill="none"
        opacity="0.85"
      />

      {/* Holy Trishula (Center Top) */}
      <g id="trishula" transform="translate(0, 0)">
        {/* Central trident shaft */}
        <line x1="50" y1="20" x2="50" y2="58" stroke="url(#twgTrishulGradient)" strokeWidth="3" strokeLinecap="round" />
        {/* Central lance point */}
        <polygon points="50,15 47,24 53,24" fill="#F6EBD4" />
        {/* Left Prong */}
        <path
          d="M 50 46 C 42 46, 38 38, 38 28 C 38 24, 40 22, 40 22 C 40 22, 43 27, 43 32 C 43 39, 47 42, 50 43"
          fill="url(#twgTrishulGradient)"
        />
        <polygon points="39,22 36,28 42,28" fill="#D9B47A" />
        {/* Right Prong */}
        <path
          d="M 50 46 C 58 46, 62 38, 62 28 C 62 24, 60 22, 60 22 C 60 22, 57 27, 57 32 C 57 39, 53 42, 50 43"
          fill="url(#twgTrishulGradient)"
        />
        <polygon points="61,22 58,28 64,28" fill="#D9B47A" />
        {/* Trishul base ring & lotus base */}
        <circle cx="50" cy="50" r="3.5" fill="#8C281C" stroke="#D9B47A" strokeWidth="1.5" />
      </g>

      {/* Sacred Charan Paduka (Holy Guru Feet) */}
      <g id="paduka" transform="translate(0, 10)">
        {/* Left Foot */}
        <g id="left-foot">
          {/* Sole */}
          <path
            d="M 40 54 
               C 35 55, 32 60, 32 68 
               C 32 75, 34 81, 35 88 
               C 36 93, 38 97, 40 98 
               C 42 97, 43 93, 44 87 
               C 45 80, 46 72, 46 64 
               C 46 58, 44 54, 40 54 Z"
            fill="url(#twgArchGradient)"
          />
          {/* Toes (5 sacred toes) */}
          <circle cx="34" cy="53" r="2.2" fill="#D9B47A" />
          <circle cx="37" cy="50" r="2.4" fill="#D9B47A" />
          <circle cx="40.5" cy="48.5" r="2.6" fill="#D9B47A" />
          <circle cx="44.5" cy="48" r="2.8" fill="#D9B47A" />
          <circle cx="48.5" cy="48.5" r="3.2" fill="#D9B47A" />
        </g>

        {/* Right Foot */}
        <g id="right-foot">
          {/* Sole */}
          <path
            d="M 60 54 
               C 65 55, 68 60, 68 68 
               C 68 75, 66 81, 65 88 
               C 64 93, 62 97, 60 98 
               C 58 97, 57 93, 56 87 
               C 55 80, 54 72, 54 64 
               C 54 58, 56 54, 60 54 Z"
            fill="url(#twgArchGradient)"
          />
          {/* Toes (5 sacred toes) */}
          <circle cx="66" cy="53" r="2.2" fill="#D9B47A" />
          <circle cx="63" cy="50" r="2.4" fill="#D9B47A" />
          <circle cx="59.5" cy="48.5" r="2.6" fill="#D9B47A" />
          <circle cx="55.5" cy="48" r="2.8" fill="#D9B47A" />
          <circle cx="51.5" cy="48.5" r="3.2" fill="#D9B47A" />
        </g>
      </g>
    </svg>
  );

  if (variant === 'iconOnly') {
    return <div className={`inline-flex items-center justify-center ${className}`}>{SacredEmblem}</div>;
  }

  if (variant === 'horizontal') {
    return (
      <div className={`inline-flex items-center gap-3.5 ${className}`}>
        {SacredEmblem}
        <div className="flex flex-col text-left">
          <div className="font-cinzel tracking-[0.22em] font-bold text-base md:text-lg leading-tight text-[#F6EBD4]">
            TRAVEL <span className="text-[#D9B47A]">WITH GURU</span>
          </div>
          <div className="font-serif-cormorant italic tracking-wide text-xs text-[#C98224] font-medium">
            Walk the Path of Wisdom
          </div>
          <div className="text-[9px] tracking-[0.28em] uppercase text-[#D9B47A]/70 font-medium mt-0.5">
            India • Nepal • Malaysia
          </div>
        </div>
      </div>
    );
  }

  // Full stacked lockup matching official brand image
  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      {SacredEmblem}
      <div className="mt-3">
        <h1 className="font-cinzel font-bold tracking-[0.25em] text-[#8C281C] dark:text-[#F6EBD4] text-xl md:text-2xl uppercase leading-none">
          TRAVEL
        </h1>
        <h2 className="font-cinzel font-bold tracking-[0.28em] text-[#8C281C] dark:text-[#D9B47A] text-2xl md:text-3xl uppercase leading-tight mt-0.5">
          WITH GURU
        </h2>
        <div className="font-serif-cormorant italic tracking-wider text-[#C98224] text-base md:text-lg font-medium mt-1">
          Walk the Path of Wisdom
        </div>
        <div className="text-[10px] md:text-xs font-semibold tracking-[0.35em] text-[#D9B47A] uppercase mt-1 border-t border-[#D9B47A]/30 pt-1">
          INDIA | NEPAL | MALAYSIA
        </div>
      </div>
    </div>
  );
};
