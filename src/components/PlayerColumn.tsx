import React from 'react';
import { motion } from 'framer-motion';
import CharacterStages from './CharacterStages';

interface PlayerColumnProps {
  player: {
    id: string;
    username: string;
    eliminated: boolean;
    cells: Array<{
      stage: number;
      isActive: boolean;
      bullets: number;
    }>;
  };
  isCurrentPlayer: boolean;
  isMyTurn: boolean;
  numCells: number;
}

const PlayerColumn: React.FC<PlayerColumnProps> = ({
  player,
  isCurrentPlayer,
  isMyTurn,
  numCells
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-lg transition-all duration-300 relative ${
        player.eliminated
          ? 'bg-red-900/20 ring-2 ring-red-500/30'
          : isCurrentPlayer
          ? 'bg-blue-500/20 ring-2 ring-blue-400'
          : 'bg-gray-800/40'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">{player.username}</h2>
        {player.eliminated && (
          <span className="text-red-400 font-semibold">Eliminated</span>
        )}
      </div>

      <div className="grid gap-3">
        {player.cells.map((cell, index) => (
          <motion.div
            key={index}
            className={`relative p-3 rounded-lg transition-all duration-300 min-h-[120px] flex items-center justify-center 
              ${cell.isActive ? 'bg-blue-500/20' : 'bg-gray-700/20'}
            `}
          >
            <div className="absolute top-2 left-2 text-sm text-gray-400">
              Cell {index + 1}
            </div>
            {cell.isActive && (
              <>
                <CharacterStages
                  stage={cell.stage}
                  isActive={cell.isActive}
                  bullets={cell.bullets}
                />
                <div className="absolute bottom-2 right-2">
                  <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(cell.stage / 6) * 100}%` }}
                      className="h-full bg-blue-500 rounded-full"
                    />
                  </div>
                </div>
              </>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default PlayerColumn;