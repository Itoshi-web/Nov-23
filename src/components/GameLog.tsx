import React from 'react';
import { motion } from 'framer-motion';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '../lib/utils';

interface GameLogEntry {
  type: 'firstMove' | 'activate' | 'maxLevel' | 'reload' | 'shoot' | 'eliminate';
  player: string;
  message?: string;
  cell?: number;
  shooter?: string;
  target?: string;
}

interface GameLogProps {
  gameLog: GameLogEntry[];
}

const GameLog: React.FC<GameLogProps> = ({ gameLog }) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [gameLog]);

  const getLogMessage = (entry: GameLogEntry) => {
    switch (entry.type) {
      case 'firstMove':
        return entry.message;
      case 'activate':
        return `${entry.player} activated cell ${entry.cell}`;
      case 'maxLevel':
        return `${entry.player}'s cell ${entry.cell} reached maximum level!`;
      case 'reload':
        return `${entry.player} reloaded cell ${entry.cell}`;
      case 'shoot':
        return `${entry.shooter} shot ${entry.target}'s cell ${entry.cell}!`;
      case 'eliminate':
        return `${entry.player} was eliminated!`;
      default:
        return '';
    }
  };

  const getLogColor = (type: GameLogEntry['type']) => {
    switch (type) {
      case 'firstMove':
        return 'text-accent';
      case 'activate':
        return 'text-primary';
      case 'maxLevel':
        return 'text-green-400';
      case 'reload':
        return 'text-blue-400';
      case 'shoot':
        return 'text-destructive';
      case 'eliminate':
        return 'text-destructive font-bold';
      default:
        return 'text-foreground';
    }
  };

  return (
    <div className="bg-background/50 rounded-lg p-4 mb-8">
      <h3 className="text-lg font-semibold mb-4">Game Log</h3>
      <div ref={scrollRef} className="h-32 overflow-y-auto space-y-2">
        {gameLog.map((entry, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn(
              "text-sm py-1 px-2 rounded",
              getLogColor(entry.type)
            )}
          >
            {getLogMessage(entry)}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default GameLog;