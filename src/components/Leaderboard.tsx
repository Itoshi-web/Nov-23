import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, Shield } from 'lucide-react';
import type { Player } from './GameArena';
import { cn } from '../lib/utils';

interface LeaderboardProps {
  players: Player[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ players }) => {
  const getPlayerStats = (player: Player) => {
    const gunsCount = player.cells.filter(cell => cell.stage >= 5).length;
    const totalBullets = player.cells.reduce((acc, cell) => acc + (cell.bullets || 0), 0);
    return { gunsCount, totalBullets };
  };

  const sortedPlayers = [...players].sort((a, b) => {
    const statsA = getPlayerStats(a);
    const statsB = getPlayerStats(b);
    if (statsA.gunsCount !== statsB.gunsCount) {
      return statsB.gunsCount - statsA.gunsCount;
    }
    return statsB.totalBullets - statsA.totalBullets;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-sm rounded-xl p-4 mb-8"
    >
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-6 h-6 text-yellow-400" />
        <h2 className="text-xl font-bold text-white">Leaderboard</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedPlayers.map((player, index) => {
          const { gunsCount, totalBullets } = getPlayerStats(player);
          return (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "p-4 rounded-lg backdrop-blur-sm transition-all duration-300",
                player.eliminated
                  ? "bg-red-900/20 ring-1 ring-red-500/30"
                  : "bg-blue-900/20 ring-1 ring-blue-500/30 hover:ring-blue-400/50"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-white">{player.name}</span>
                {player.eliminated ? (
                  <span className="text-red-400 text-sm">Eliminated</span>
                ) : (
                  <Shield className={cn(
                    "w-5 h-5",
                    index === 0 ? "text-yellow-400" :
                    index === 1 ? "text-gray-400" :
                    index === 2 ? "text-amber-700" : "text-blue-400"
                  )} />
                )}
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Target className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-200">{gunsCount} guns</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <span className="text-red-200">{totalBullets} bullets</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default Leaderboard;