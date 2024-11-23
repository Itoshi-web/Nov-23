import React, { useEffect } from 'react';
import { useGameStore } from './store/gameStore';
import StartScreen from './components/lobby/StartScreen';
import WaitingRoom from './components/lobby/WaitingRoom';
import GameArena from './components/GameArena';
import { Toaster } from 'react-hot-toast';

function App() {
  const { connect, currentRoom } = useGameStore();

  useEffect(() => {
    connect();
  }, [connect]);

  return (
    <>
      <Toaster position="top-center" />
      {!currentRoom && <StartScreen />}
      {currentRoom && !currentRoom.started && <WaitingRoom />}
      {currentRoom && currentRoom.started && <GameArena />}
    </>
  );
}

export default App;