import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Volume2, VolumeX } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

const EMOTES = [
  "Nice Shot! 🎯",
  "Well Played! 👏",
  "Out of Bullets! 😅",
  "Good Luck! 🍀",
  "Ouch! 😫",
  "GG! 🎮"
];

const EmotePanel: React.FC = () => {
  const { sendEmote, emotesMuted, toggleEmotes } = useGameStore();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="fixed bottom-4 right-4">
      <motion.div
        initial={false}
        animate={isOpen ? "open" : "closed"}
        className="relative"
      >
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-16 right-0 bg-white/10 backdrop-blur-lg rounded-lg p-4 w-48 space-y-2"
          >
            {EMOTES.map((emote, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  sendEmote(emote);
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                {emote}
              </motion.button>
            ))}
          </motion.div>
        )}

        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleEmotes}
            className="p-3 rounded-full bg-white/10 backdrop-blur-lg hover:bg-white/20 transition-colors"
          >
            {emotesMuted ? (
              <VolumeX className="w-6 h-6" />
            ) : (
              <Volume2 className="w-6 h-6" />
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className="p-3 rounded-full bg-white/10 backdrop-blur-lg hover:bg-white/20 transition-colors"
          >
            <MessageCircle className="w-6 h-6" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default EmotePanel;