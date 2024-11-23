import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Play, ChevronRight, ChevronLeft, User } from 'lucide-react';
import { Player } from '@lottiefiles/react-lottie-player';
import { cn } from '../lib/utils';

interface StartScreenProps {
  onStart: (numPlayers: number, playerNames: string[]) => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const [step, setStep] = useState<'players' | 'names'>('players');
  const [playerCount, setPlayerCount] = useState(2);
  const [playerNames, setPlayerNames] = useState<string[]>([]);

  const handleNextStep = () => {
    if (step === 'players') {
      setPlayerNames(Array(playerCount).fill('').map((_, i) => `Player ${i + 1}`));
      setStep('names');
    } else {
      if (playerNames.every(name => name.trim())) {
        onStart(playerCount, playerNames);
      }
    }
  };

  const updatePlayerName = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-2xl max-w-md w-full"
      >
        <Player
          autoplay
          loop
          src="https://lottie.host/c8f45c38-9b45-4351-8d58-aa38935c0694/aqzAeUvxAi.json"
          style={{ height: '200px', width: '200px' }}
          className="mx-auto mb-4"
        />
        
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          Dice Battle Arena
        </h1>
        
        <AnimatePresence mode="wait">
          {step === 'players' ? (
            <motion.div
              key="players"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <label className="text-blue-200 block mb-4">Number of Players</label>
                <div className="flex items-center justify-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setPlayerCount(Math.max(2, playerCount - 1))}
                    className="text-white bg-blue-500/20 hover:bg-blue-600/30 p-2 rounded-lg"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </motion.button>
                  <div className="flex items-center gap-2">
                    <Users className="w-6 h-6 text-white" />
                    <span className="text-2xl font-bold text-white">{playerCount}</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setPlayerCount(Math.min(6, playerCount + 1))}
                    className="text-white bg-blue-500/20 hover:bg-blue-600/30 p-2 rounded-lg"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="names"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <h2 className="text-xl text-white text-center mb-6">Enter Player Names</h2>
              {Array.from({ length: playerCount }).map((_, index) => (
                <div key={index} className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
                  <input
                    type="text"
                    value={playerNames[index] || ''}
                    onChange={(e) => updatePlayerName(index, e.target.value)}
                    placeholder={`Player ${index + 1}`}
                    className={cn(
                      "w-full bg-white/10 border-2 border-transparent",
                      "focus:border-blue-400 rounded-lg py-2 pl-10 pr-4",
                      "text-white placeholder-blue-300/50 outline-none",
                      "transition-colors duration-200"
                    )}
                  />
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleNextStep}
          className={cn(
            "w-full mt-8 bg-gradient-to-r from-blue-500 to-blue-600",
            "hover:from-blue-600 hover:to-blue-700 text-white font-bold",
            "py-3 px-6 rounded-lg flex items-center justify-center gap-2",
            "transition-all duration-200 shadow-lg hover:shadow-xl",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
          disabled={step === 'names' && !playerNames.every(name => name.trim())}
        >
          {step === 'players' ? (
            <>
              <ChevronRight className="w-5 h-5" />
              Next
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Start Game
            </>
          )}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default StartScreen;