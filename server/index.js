import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cors from 'cors';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://lambent-nasturtium-dbb11c.netlify.app']
      : ["http://localhost:5173"],
    methods: ["GET", "POST"]
  }
});

const PLAYER_COLORS = [
  '#3B82F6', // blue
  '#EF4444', // red
  '#10B981', // green
  '#F59E0B', // yellow
  '#8B5CF6', // purple
  '#EC4899', // pink
];

const rooms = new Map();
const quickMatchQueue = [];

const generateRoomId = () => {
  let roomId;
  do {
    roomId = Math.floor(100000 + Math.random() * 900000).toString();
  } while (rooms.has(roomId));
  return roomId;
};

const initializeGameState = (players) => ({
  currentPlayer: 0,
  players: players.map((p, index) => ({
    id: p.id,
    username: p.username,
    color: PLAYER_COLORS[index % PLAYER_COLORS.length],
    eliminated: false,
    firstMove: true,
    cells: Array(players.length).fill({ stage: 0, isActive: false, bullets: 0 }),
    stats: {
      shotsFired: 0,
      eliminations: 0,
      timesTargeted: 0
    }
  })),
  lastRoll: null,
  gameLog: []
});

const findOrCreateQuickMatch = (socket, username) => {
  // Look for an available room
  for (const [roomId, room] of rooms.entries()) {
    if (room.isQuickMatch && !room.started && room.players.length < room.maxPlayers) {
      room.players.push({
        id: socket.id,
        username,
        ready: true,
        isLeader: false,
        color: PLAYER_COLORS[room.players.length % PLAYER_COLORS.length]
      });
      
      socket.join(roomId);
      io.to(roomId).emit('playerJoined', { room });

      // Start game if room is full
      if (room.players.length === room.maxPlayers) {
        room.started = true;
        room.gameState = initializeGameState(room.players);
        io.to(roomId).emit('gameStarted', { gameState: room.gameState });
      }

      return;
    }
  }

  // Create new room if none available
  const roomId = generateRoomId();
  const room = {
    id: roomId,
    leader: socket.id,
    maxPlayers: 4,
    isQuickMatch: true,
    players: [{
      id: socket.id,
      username,
      ready: true,
      isLeader: true,
      color: PLAYER_COLORS[0]
    }],
    gameState: null,
    started: false
  };

  rooms.set(roomId, room);
  socket.join(roomId);
  socket.emit('roomCreated', { room });
};

const processGameAction = (room, action, data) => {
  const { gameState } = room;
  const currentPlayer = gameState.players[gameState.currentPlayer];

  switch (action) {
    case 'roll': {
      const { value } = data;
      gameState.lastRoll = value;
      
      // First move rule
      if (currentPlayer.firstMove && value !== 1) {
        gameState.gameLog.push({
          type: 'firstMove',
          player: currentPlayer.username,
          message: `${currentPlayer.username} needs to roll a 1 to start!`
        });
        break;
      }

      if (currentPlayer.firstMove && value === 1) {
        currentPlayer.firstMove = false;
      }

      const cellIndex = value - 1;
      const cell = currentPlayer.cells[cellIndex];

      if (!cell.isActive) {
        currentPlayer.cells[cellIndex] = {
          stage: 1,
          isActive: true,
          bullets: 0
        };
        gameState.gameLog.push({
          type: 'activate',
          player: currentPlayer.username,
          cell: cellIndex + 1
        });
      } else if (cell.stage < 6) {
        cell.stage += 1;
        if (cell.stage === 6) {
          cell.bullets = 5;
          gameState.gameLog.push({
            type: 'maxLevel',
            player: currentPlayer.username,
            cell: cellIndex + 1
          });
        }
      } else if (cell.bullets === 0) {
        cell.bullets = 5;
        gameState.gameLog.push({
          type: 'reload',
          player: currentPlayer.username,
          cell: cellIndex + 1
        });
      }
      break;
    }

    case 'shoot': {
      const { targetPlayer, targetCell } = data;
      const target = gameState.players[targetPlayer];
      
      if (gameState.lastRoll === targetCell + 1) {
        const shooterCell = currentPlayer.cells[targetCell];
        
        if (shooterCell.bullets > 0) {
          target.cells[targetCell] = {
            stage: 0,
            isActive: false,
            bullets: 0
          };

          shooterCell.bullets -= 1;
          currentPlayer.stats.shotsFired += 1;
          target.stats.timesTargeted += 1;

          gameState.gameLog.push({
            type: 'shoot',
            shooter: currentPlayer.username,
            target: target.username,
            cell: targetCell + 1
          });

          target.eliminated = target.cells.every(cell => !cell.isActive);
          if (target.eliminated) {
            currentPlayer.stats.eliminations += 1;
            gameState.gameLog.push({
              type: 'eliminate',
              player: target.username
            });
          }
        }
      }
      break;
    }

    case 'emote': {
      const { emote } = data;
      gameState.gameLog.push({
        type: 'emote',
        player: currentPlayer.username,
        message: emote
      });
      break;
    }
  }

  // Check for game end
  const activePlayers = gameState.players.filter(p => !p.eliminated);
  if (activePlayers.length === 1) {
    const winner = activePlayers[0];
    const history = {
      winner: winner.username,
      eliminations: gameState.gameLog
        .filter(log => log.type === 'eliminate')
        .map(log => ({
          eliminator: log.shooter,
          eliminated: log.player
        })),
      playerStats: Object.fromEntries(
        gameState.players.map(p => [
          p.username,
          p.stats
        ])
      )
    };
    return { gameState, gameEnded: true, history };
  }

  // Move to next player
  do {
    gameState.currentPlayer = (gameState.currentPlayer + 1) % gameState.players.length;
  } while (
    gameState.players[gameState.currentPlayer].eliminated &&
    gameState.players.some(p => !p.eliminated)
  );

  return { gameState, gameEnded: false };
};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('quickMatch', ({ username }) => {
    findOrCreateQuickMatch(socket, username);
  });

  socket.on('createRoom', ({ maxPlayers, password, username }) => {
    const roomId = generateRoomId();
    const room = {
      id: roomId,
      leader: socket.id,
      password: password || null,
      maxPlayers,
      players: [{
        id: socket.id,
        username,
        ready: true,
        isLeader: true,
        color: PLAYER_COLORS[0]
      }],
      gameState: null,
      started: false
    };
    
    rooms.set(roomId, room);
    socket.join(roomId);
    
    socket.emit('roomCreated', {
      room: {
        ...room,
        password: undefined
      }
    });
  });

  socket.on('joinRoom', ({ roomId, password, username }) => {
    const room = rooms.get(roomId);
    
    if (!room) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    if (room.password && room.password !== password) {
      socket.emit('error', { message: 'Incorrect password' });
      return;
    }

    if (room.players.length >= room.maxPlayers) {
      socket.emit('error', { message: 'Room is full' });
      return;
    }

    if (room.started) {
      socket.emit('error', { message: 'Game already in progress' });
      return;
    }

    room.players.push({
      id: socket.id,
      username,
      ready: false,
      isLeader: false,
      color: PLAYER_COLORS[room.players.length % PLAYER_COLORS.length]
    });

    socket.join(roomId);
    
    io.to(roomId).emit('playerJoined', {
      room: {
        ...room,
        password: undefined
      }
    });
  });

  socket.on('toggleReady', ({ roomId }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    const player = room.players.find(p => p.id === socket.id);
    if (player) {
      player.ready = !player.ready;
      io.to(roomId).emit('roomUpdated', {
        room: {
          ...room,
          password: undefined
        }
      });
    }
  });

  socket.on('startGame', ({ roomId }) => {
    const room = rooms.get(roomId);
    if (!room || room.leader !== socket.id) return;

    if (room.players.every(p => p.ready)) {
      room.started = true;
      room.gameState = initializeGameState(room.players);
      io.to(roomId).emit('gameStarted', { gameState: room.gameState });
    }
  });

  socket.on('gameAction', ({ roomId, action, data }) => {
    const room = rooms.get(roomId);
    if (!room || !room.started) return;

    const currentPlayerId = room.gameState.players[room.gameState.currentPlayer].id;
    if (currentPlayerId !== socket.id) return;

    const result = processGameAction(room, action, data);
    room.gameState = result.gameState;
    
    if (result.gameEnded) {
      io.to(roomId).emit('gameEnded', { history: result.history });
    } else {
      io.to(roomId).emit('gameStateUpdated', { gameState: result.gameState });
    }
  });

  socket.on('sendEmote', ({ roomId, emote }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    const player = room.players.find(p => p.id === socket.id);
    if (player) {
      io.to(roomId).emit('emote', {
        username: player.username,
        emote
      });
    }
  });

  socket.on('leaveRoom', () => {
    for (const [roomId, room] of rooms.entries()) {
      const playerIndex = room.players.findIndex(p => p.id === socket.id);
      
      if (playerIndex !== -1) {
        const username = room.players[playerIndex].username;
        room.players.splice(playerIndex, 1);
        
        if (room.players.length === 0) {
          rooms.delete(roomId);
        } else if (room.leader === socket.id) {
          room.leader = room.players[0].id;
          room.players[0].isLeader = true;
        }

        socket.leave(roomId);
        io.to(roomId).emit('playerLeft', {
          room: {
            ...room,
            password: undefined
          },
          username
        });
      }
    }
  });

  socket.on('disconnect', () => {
    socket.emit('leaveRoom');
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});