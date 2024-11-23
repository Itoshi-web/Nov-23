import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Play, Key } from 'lucide-react';
import { Player } from '@lottiefiles/react-lottie-player';
import { useGameStore } from '../../store/gameStore';
import { cn } from '../../lib/utils';

const StartScreen: React.FC = () => {
  const [mode, setMode] = useState<'initial' | 'create' | 'join'>('initial');
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [roomId, setRoomId] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  
  const { createRoom, joinRoom, setUsername: setStoreUsername, error, clearError } = useGameStore();

  const handleCreateRoom = () => {
    if (!username.trim()) {
      clearError();
      return;
    }
    setStoreUsername(username);
    createRoom(maxPlayers, password || null);
  };

  const handleJoinRoom = () => {
    if (!username.trim() || !roomId.trim()) {
      clearError();
      return;
    }
    setStoreUsername(username);
    joinRoom(roomId, password || null);
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

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-4"
          >
            <p className="text-red-200 text-sm text-center">{error}</p>
          </motion.div>
        )}
        
        {mode === 'initial' && (
          <div className="space-y-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className={cn(
                "w-full bg-white/10 border-2 border-transparent",
                "focus:border-blue-400 rounded-lg py-2 px-4",
                "text-white placeholder-blue-300/50 outline-none",
                "transition-colors duration-200 mb-4"
              )}
            />
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setMode('create')}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 mb-3"
            >
              <Users className="w-5 h-5" />
              Create Room
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setMode('join')}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" />
              Join Room
            </motion.button>
          </div>
        )}

        {mode === 'create' && (
          <div className="space-y-4">
            <div>
              <label className="text-blue-200 block mb-2">Number of Players</label>
              <input
                type="number"
                min="2"
                max="10"
                value={maxPlayers}
                onChange={(e) => setMaxPlayers(parseInt(e.target.value))}
                className="w-full bg-white/10 border-2 border-transparent focus:border-blue-400 rounded-lg py-2 px-4 text-white outline-none"
              />
            </div>

            <div>
              <label className="text-blue-200 block mb-2">Room Password (Optional)</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter room password"
                className="w-full bg-white/10 border-2 border-transparent focus:border-blue-400 rounded-lg py-2 px-4 text-white placeholder-blue-300/50 outline-none"
              />
            </div>

            <div className="flex gap-3 mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setMode('initial')}
                className="flex-1 bg-gray-500/20 hover:bg-gray-500/30 text-white font-bold py-3 px-6 rounded-lg"
              >
                Back
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCreateRoom}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg"
              >
                Create
              </motion.button>
            </div>
          </div>
        )}

        {mode === 'join' && (
          <div className="space-y-4">
            <div>
              <label className="text-blue-200 block mb-2">Room ID</label>
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Enter 6-digit room ID"
                className="w-full bg-white/10 border-2 border-transparent focus:border-blue-400 rounded-lg py-2 px-4 text-white placeholder-blue-300/50 outline-none"
              />
            </div>

            <div>
              <label className="text-blue-200 block mb-2">Room Password (if required)</label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter room password"
                  className="w-full bg-white/10 border-2 border-transparent focus:border-blue-400 rounded-lg py-2 pl-10 pr-4 text-white placeholder-blue-300/50 outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setMode('initial')}
                className="flex-1 bg-gray-500/20 hover:bg-gray-500/30 text-white font-bold py-3 px-6 rounded-lg"
              >
                Back
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleJoinRoom}
                className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg"
              >
                Join
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default StartScreen;