import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import toast from 'react-hot-toast';

interface GamePlayer {
  id: string;
  username: string;
  eliminated: boolean;
  firstMove: boolean;
  color: string;
  cells: Array<{
    stage: number;
    isActive: boolean;
    bullets: number;
  }>;
  stats: {
    shotsFired: number;
    eliminations: number;
    timesTargeted: number;
  };
}

interface Player {
  id: string;
  username: string;
  ready: boolean;
  isLeader: boolean;
  color: string;
}

interface GameState {
  currentPlayer: number;
  players: GamePlayer[];
  lastRoll: number | null;
  gameLog: Array<{
    type: 'firstMove' | 'activate' | 'maxLevel' | 'reload' | 'shoot' | 'eliminate' | 'emote';
    player: string;
    message?: string;
    cell?: number;
    shooter?: string;
    target?: string;
    emote?: string;
  }>;
}

interface Room {
  id: string;
  leader: string;
  maxPlayers: number;
  players: Player[];
  started: boolean;
  gameState?: GameState;
  isQuickMatch?: boolean;
}

interface GameStore {
  socket: Socket | null;
  connected: boolean;
  currentRoom: Room | null;
  username: string;
  error: string | null;
  gameHistory: {
    winner: string;
    eliminations: Array<{ eliminator: string; eliminated: string }>;
    playerStats: Record<string, {
      shotsFired: number;
      eliminations: number;
      timesTargeted: number;
    }>;
  } | null;
  emotesMuted: boolean;
  
  connect: () => void;
  createRoom: (maxPlayers: number, password: string | null) => void;
  joinRoom: (roomId: string, password: string | null) => void;
  quickMatch: () => void;
  setUsername: (username: string) => void;
  toggleReady: () => void;
  startGame: () => void;
  clearError: () => void;
  performGameAction: (action: string, data: any) => void;
  sendEmote: (emote: string) => void;
  toggleEmotes: () => void;
  leaveRoom: () => void;
}

const PLAYER_COLORS = [
  '#3B82F6', // blue
  '#EF4444', // red
  '#10B981', // green
  '#F59E0B', // yellow
  '#8B5CF6', // purple
  '#EC4899', // pink
];

// Use environment variable for server URL
const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';
const socket = io(SERVER_URL, {
  transports: ['websocket'],
  autoConnect: false
});

export const useGameStore = create<GameStore>((set, get) => ({
  socket: null,
  connected: false,
  currentRoom: null,
  username: '',
  error: null,
  gameHistory: null,
  emotesMuted: false,

  connect: () => {
    socket.on('connect', () => {
      set({ connected: true, socket });
    });

    socket.on('disconnect', () => {
      set({ connected: false });
    });

    socket.on('error', ({ message }) => {
      set({ error: message });
      toast.error(message);
    });

    socket.on('roomCreated', ({ room }) => {
      set({ currentRoom: room });
      toast.success('Room created successfully!');
    });

    socket.on('playerJoined', ({ room }) => {
      set({ currentRoom: room });
      toast.success(`${room.players[room.players.length - 1].username} joined the game!`);
    });

    socket.on('roomUpdated', ({ room }) => {
      set({ currentRoom: room });
    });

    socket.on('playerLeft', ({ room, username }) => {
      set({ currentRoom: room });
      toast.error(`${username} left the game`);
    });

    socket.on('gameStarted', ({ gameState }) => {
      set(state => ({
        currentRoom: state.currentRoom ? {
          ...state.currentRoom,
          started: true,
          gameState
        } : null
      }));
      toast.success('Game started!');
    });

    socket.on('gameStateUpdated', ({ gameState }) => {
      set(state => ({
        currentRoom: state.currentRoom ? {
          ...state.currentRoom,
          gameState
        } : null
      }));
    });

    socket.on('gameEnded', ({ history }) => {
      set({ gameHistory: history });
      toast.success(`${history.winner} won the game!`);
    });

    socket.on('emote', ({ username, emote }) => {
      const { emotesMuted } = get();
      if (!emotesMuted) {
        toast(emote, {
          icon: '💬',
          duration: 3000,
        });
      }
    });

    socket.connect();
  },

  createRoom: (maxPlayers, password) => {
    const { username } = get();
    if (!username) {
      set({ error: 'Please set a username first' });
      return;
    }
    socket.emit('createRoom', { 
      maxPlayers, 
      password, 
      username,
      color: PLAYER_COLORS[0]
    });
  },

  joinRoom: (roomId, password) => {
    const { username } = get();
    if (!username) {
      set({ error: 'Please set a username first' });
      return;
    }
    socket.emit('joinRoom', { roomId, password, username });
  },

  quickMatch: () => {
    const { username } = get();
    if (!username) {
      set({ error: 'Please set a username first' });
      return;
    }
    socket.emit('quickMatch', { username });
  },

  setUsername: (username) => {
    set({ username });
  },

  toggleReady: () => {
    const { currentRoom } = get();
    if (currentRoom) {
      socket.emit('toggleReady', { roomId: currentRoom.id });
    }
  },

  startGame: () => {
    const { currentRoom } = get();
    if (currentRoom) {
      socket.emit('startGame', { roomId: currentRoom.id });
    }
  },

  performGameAction: (action, data) => {
    const { currentRoom } = get();
    if (currentRoom) {
      socket.emit('gameAction', {
        roomId: currentRoom.id,
        action,
        data
      });
    }
  },

  sendEmote: (emote) => {
    const { currentRoom } = get();
    if (currentRoom) {
      socket.emit('sendEmote', {
        roomId: currentRoom.id,
        emote
      });
    }
  },

  toggleEmotes: () => {
    set(state => ({ emotesMuted: !state.emotesMuted }));
  },

  leaveRoom: () => {
    socket.emit('leaveRoom');
    set({ 
      currentRoom: null,
      gameHistory: null
    });
  },

  clearError: () => {
    set({ error: null });
  }
}));