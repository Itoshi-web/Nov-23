import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Users, Copy, Check, AlertCircle } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { cn } from '../../lib/utils';
import toast from 'react-hot-toast';

const WaitingRoom: React.FC = () => {
  const { currentRoom, username, toggleReady, startGame } = useGameStore();
  const [copied, setCopied] = React.useState(false);

  if (!currentRoom) return null;

  const isLeader = currentRoom.players.find(p => p.username === username)?.isLeader;
  const allPlayersReady = currentRoom.players.every(p => p.ready);
  const canStart = allPlayersReady && currentRoom.players.length >= 2;

  const copyRoomId = () => {
    navigator.clipboard.writeText(currentRoom.id);
    setCopied(true);
    toast.success('Room ID copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-2xl max-w-2xl w-full"
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Waiting Room</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-300" />
              <span className="text-blue-200">
                {currentRoom.players.length}/{currentRoom.maxPlayers}
              </span>
            </div>
            <button
              onClick={copyRoomId}
              className="flex items-center gap-2 bg-blue-500/20 hover:bg-blue-600/30 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              <span className="font-mono">{currentRoom.id}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {Array.from({ length: currentRoom.maxPlayers }).map((_, index) => {
            const player = currentRoom.players[index];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "p-4 rounded-lg",
                  player
                    ? "bg-blue-500/20 ring-1 ring-blue-500/30"
                    : "bg-gray-500/10 ring-1 ring-gray-500/20"
                )}
              >
                {player ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {player.isLeader && (
                        <Crown className="w-5 h-5 text-yellow-400" />
                      )}
                      <span className="text-white font-medium">
                        {player.username}
                      </span>
                    </div>
                    <span
                      className={cn(
                        "px-2 py-1 rounded text-sm",
                        player.ready
                          ? "bg-green-500/20 text-green-300"
                          : "bg-yellow-500/20 text-yellow-300"
                      )}
                    >
                      {player.ready ? "Ready" : "Not Ready"}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[36px] text-gray-400">
                    Waiting for player...
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        <div className="flex flex-col gap-4">
          {!allPlayersReady && (
            <div className="flex items-center gap-2 text-yellow-300 bg-yellow-500/10 p-3 rounded-lg">
              <AlertCircle className="w-5 h-5" />
              <span>Waiting for all players to be ready...</span>
            </div>
          )}

          <div className="flex gap-4">
            {!isLeader && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={toggleReady}
                className={cn(
                  "flex-1 font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2",
                  "bg-gradient-to-r",
                  currentRoom.players.find(p => p.username === username)?.ready
                    ? "from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700"
                    : "from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                )}
              >
                {currentRoom.players.find(p => p.username === username)?.ready
                  ? "Not Ready"
                  : "Ready"}
              </motion.button>
            )}

            {isLeader && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={startGame}
                disabled={!canStart}
                className={cn(
                  "flex-1 font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2",
                  canStart
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                    : "bg-gray-500/20 text-gray-400 cursor-not-allowed"
                )}
              >
                Start Game
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default WaitingRoom;