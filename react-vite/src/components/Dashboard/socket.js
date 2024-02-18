import io from 'socket.io-client';

// const socketUrl = import.meta.env.VITE_REACT_APP_SOCKET_URL || 'http://localhost:8000'
const socket = io('http://localhost:8000');

export default socket;