import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, Shield, X } from 'lucide-react';

interface GameHistoryProps {
  history: {
    winner: string;
    eliminations: Array<{ eliminator: string; eliminated: string }>;
    playerStats: Record<string, {
      shotsFired: number;
      eliminations: number;
      timesTargeted: number;
    }>;
  };
  onClose: () => void;
}

const GameHistory: React.FC<GameHistoryProps> = ({ history, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-background/90 rounded-xl p-6 max-w-2xl w-full"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-400" />
            Game Summary
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="text-center p-4 bg-white/10 rounded-lg">
            <h3 className="text-xl font-bold text-yellow-400 mb-2">Winner</h3>
            <p className="text-2xl">{history.winner}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {Object.entries(history.playerStats).map(([player, stats]) => (
              <div
                key={player}
                className="bg-white/10 rounded-lg p-4 space-y-2"
              >
                <h4 className="font-semibold mb-2">{player}</h4>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-red-400" />
                  <span>Shots Fired: {stats.shotsFired}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-400" />
                  <span>Times Targeted: {stats.timesTargeted}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  <span>Eliminations: {stats.eliminations}</span>
                </div>
              </div>
            ))}
          </div>

          {history.eliminations.length > 0 && (
            <div>
              <h3 className="text-xl font-bold mb-4">Elimination Log</h3>
              <div className="space-y-2">
                {history.eliminations.map((elim, index) => (
                  <div
                    key={index}
                    className="bg-white/10 rounded-lg p-3 flex items-center gap-2"
                  >
                    <span className="font-semibold">{elim.eliminator}</span>
                    <span>eliminated</span>
                    <span className="font-semibold">{elim.eliminated}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GameHistory;