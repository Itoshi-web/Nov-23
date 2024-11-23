import React from 'react';
import { Target } from 'lucide-react';
import { motion } from 'framer-motion';

interface CharacterStagesProps {
  stage: number;
  isActive: boolean;
  bullets?: number;
}

const CharacterStages: React.FC<CharacterStagesProps> = ({ stage, isActive, bullets }) => {
  if (!isActive) return null;

  const bounce = {
    y: [0, -5, 0],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const float = {
    y: [0, -3, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const wave = {
    rotate: [-5, 5, -5],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <motion.div 
      className="relative w-24 h-32"
      animate={float}
    >
      {/* Head */}
      {stage >= 1 && (
        <motion.svg 
          className="absolute top-0 left-1/2 -translate-x-1/2"
          width="24" 
          height="24"
          animate={bounce}
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            fill="#60A5FA"
            className="animate-fadeIn"
          />
          <circle cx="8" cy="10" r="2" fill="#1E3A8A" />
          <circle cx="16" cy="10" r="2" fill="#1E3A8A" />
          <motion.path
            d={stage === 1 ? "M8 16 H16" : "M8 16 Q12 19 16 16"}
            stroke="#1E3A8A"
            strokeWidth="2"
            strokeLinecap="round"
            animate={stage > 1 ? { d: ["M8 16 H16", "M8 16 Q12 19 16 16"] } : {}}
            transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
          />
        </motion.svg>
      )}

      {/* Body */}
      {stage >= 2 && (
        <motion.svg 
          className="absolute top-3.5 left-11 -translate-x-1/2 animate-fadeIn"
          width="32" 
          height="40"
          animate={float}
        >
          <rect x="0" y="10" width="8" height="30" fill="#60A5FA" rx="4" />
        </motion.svg>
      )}

      {/* Legs */}
      {stage >= 3 && (
        <motion.svg 
          className="absolute top-12 left-8 -translate-x-1/2 animate-fadeIn"
          width="32" 
          height="30"
          animate={wave}
        >
          <path
            d="M12 0 L8 30 M20 0 L24 30"
            stroke="#60A5FA"
            strokeWidth="8"
            strokeLinecap="round"
          />
        </motion.svg>
      )}

      {/* Hands */}
      {stage >= 4 && (
        <motion.svg 
          className="absolute top-6 left-6 -translate-x-1/2 animate-fadeIn"
          width="48" 
          height="20"
          animate={wave}
        >
          <path
            d="M0 10 L20 10 M28 10 L48 10"
            stroke="#60A5FA"
            strokeWidth="8"
            strokeLinecap="round"
          />
        </motion.svg>
      )}

      {/* Gun */}
      {stage >= 5 && (
        <motion.svg 
          className="absolute top-6 -right-4 animate-fadeIn"
          width="24" 
          height="16"
          animate={float}
        >
          <rect x="0" y="4" width="20" height="8" fill="#374151" rx="2" />
          <rect x="16" y="6" width="8" height="4" fill="#374151" />
        </motion.svg>
      )}

      {/* Bullets */}
      {stage >= 6 && bullets && bullets > 0 && (
        <motion.div 
          className="absolute -right-6 top-0 flex flex-col gap-1 animate-fadeIn"
          animate={float}
        >
          {Array.from({ length: bullets }).map((_, i) => (
            <motion.div
              key={i}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
            >
              <Target className="w-4 h-4 text-red-400" />
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default CharacterStages;