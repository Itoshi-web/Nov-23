import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dices } from 'lucide-react';
import { cn } from '../lib/utils';

interface NumberPickerProps {
  maxNumber: number;
  onPick: (value: number) => void;
  disabled: boolean;
  firstMove: boolean;
}

const NumberPicker: React.FC<NumberPickerProps> = ({
  maxNumber,
  onPick,
  disabled,
  firstMove
}) => {
  const [rolling, setRolling] = useState(false);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);

  const roll = () => {
    if (rolling || disabled) return;

    setRolling(true);
    let rollCount = 0;
    const maxRolls = 10;
    const rollInterval = setInterval(() => {
      setCurrentNumber(Math.floor(Math.random() * maxNumber) + 1);
      rollCount++;

      if (rollCount >= maxRolls) {
        clearInterval(rollInterval);
        const finalValue = Math.floor(Math.random() * maxNumber) + 1;
        setCurrentNumber(finalValue);
        setRolling(false);
        onPick(finalValue);
        
        // Clear the number after a delay
        setTimeout(() => setCurrentNumber(null), 2000);
      }
    }, 100);
  };

  return (
    <motion.div className="relative">
      <motion.button
        onClick={roll}
        disabled={rolling || disabled}
        className={cn(
          "p-8 rounded-xl transition-all duration-300",
          rolling
            ? 'bg-primary/30 animate-pulse'
            : 'bg-primary/20 hover:bg-primary/30',
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        )}
      >
        <Dices className="w-16 h-16" />
      </motion.button>

      <AnimatePresence>
        {currentNumber !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <span className="text-4xl font-bold">{currentNumber}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {firstMove && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
        >
          <span className="text-sm text-accent">Roll a 1 to start!</span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default NumberPicker;