import React, { useState } from 'react';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from 'lucide-react';

interface DiceRollerProps {
  onRoll: (value: number) => void;
  disabled: boolean;
  currentPlayer: number;
}

const diceIcons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];

const DiceRoller: React.FC<DiceRollerProps> = ({
  onRoll,
  disabled,
  currentPlayer,
}) => {
  const [rolling, setRolling] = useState(false);
  const [currentDice, setCurrentDice] = useState(0);

  const rollDice = () => {
    if (rolling || disabled) return;

    setRolling(true);
    let rollCount = 0;
    const maxRolls = 10;
    const rollInterval = setInterval(() => {
      setCurrentDice(Math.floor(Math.random() * 6));
      rollCount++;

      if (rollCount >= maxRolls) {
        clearInterval(rollInterval);
        const finalValue = Math.floor(Math.random() * 6) + 1;
        setCurrentDice(finalValue - 1);
        setRolling(false);
        onRoll(finalValue);
      }
    }, 100);
  };

  const DiceIcon = diceIcons[currentDice];

  return (
    <button
      onClick={rollDice}
      disabled={rolling || disabled}
      className={`p-6 rounded-xl transition-all duration-300 ${
        rolling
          ? 'bg-blue-600/30 animate-pulse'
          : 'bg-blue-500/20 hover:bg-blue-600/30'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <DiceIcon className="w-12 h-12 text-white" />
    </button>
  );
};

export default DiceRoller;