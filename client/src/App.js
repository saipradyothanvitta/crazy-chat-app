import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './App.css';

// Connect to the backend server
const socket = io.connect(process.env.REACT_APP_BACKEND_URL || "http://localhost:3001");

function App() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageList, setMessageList] = useState([]);
  const [typingStatus, setTypingStatus] = useState('');
  const [onlineUsers, setOnlineUsers] = useState(0);
  const chatBodyRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const joinRoom = () => {
    if (username.trim() !== "" && room.trim() !== "") {
      socket.emit('join_room', { username, room });
      setShowChat(true);
    }
  };

  const sendMessage = async () => {
    if (currentMessage.trim() !== "") {
      const messageData = {
        id: Date.now() + '-' + socket.id,
        type: 'message',
        room: room,
        author: username,
        message: currentMessage,
        time: new Date(Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'sent',
      };
      await socket.emit('send_message', messageData);
      setMessageList((list) => [...list, messageData]);
      socket.emit('stop_typing', { room });
      setCurrentMessage("");
    }
  };

  // Effect for handling all socket events
  useEffect(() => {
    const handleReceiveMessage = (data) => {
      if (data.type === 'message' && data.senderId !== socket.id) {
        socket.emit('message_delivered', { messageId: data.id, senderId: data.senderId });
      }
      setMessageList((list) => [...list, data]);
    };

    const handleUpdateStatus = (data) => {
      setMessageList((list) =>
        list.map((msg) =>
          msg.id === data.messageId && msg.status !== 'read'
            ? { ...msg, status: data.status }
            : msg
        )
      );
    };

    const handleReadStatus = (data) => {
      setMessageList((list) =>
        list.map((msg) =>
          msg.author !== username && msg.senderId === data.readerId
            ? { ...msg, status: 'read' }
            : msg
        )
      );
    };

    const typingListener = (data) => setTypingStatus(data);
    const roomDataListener = (data) => setOnlineUsers(data.userCount);

    socket.on('receive_message', handleReceiveMessage);
    socket.on('update_message_status', handleUpdateStatus);
    socket.on('update_read_status', handleReadStatus);
    socket.on('typing_status', typingListener);
    socket.on('room_data', roomDataListener);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
      socket.off('update_message_status', handleUpdateStatus);
      socket.off('update_read_status', handleReadStatus);
      socket.off('typing_status', typingListener);
      socket.off('room_data', roomDataListener);
    };
  }, [username]);

  // Effect for auto-scrolling
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messageList]);

  // Effect for handling user typing
  const handleTyping = (e) => {
    setCurrentMessage(e.target.value);
    socket.emit('typing', { room, username });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stop_typing', { room });
    }, 2000);
  };

  // Effect for marking messages as read when window is focused
  useEffect(() => {
    const handleFocus = () => {
      socket.emit('messages_read', { room });
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [room]);

  const renderTicks = (status) => {
    if (status === 'read') return <span className="tick read">✓✓</span>;
    if (status === 'delivered') return <span className="tick delivered">✓✓</span>;
    if (status === 'sent') return <span className="tick sent">✓</span>;
    return null;
  };

  return (
    <div className="App">
      {!showChat ? (
        <div className="joinChatContainer">
          <h1 className="welcome-text">Welcome to Crazy Chat</h1>
          <h3>Join A Chat</h3>
          <input
            type="text"
            placeholder="Your Name..."
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={(e) => { e.key === "Enter" && joinRoom(); }}
          />
          <input
            type="text"
            placeholder="Room ID..."
            onChange={(e) => setRoom(e.target.value)}
            onKeyPress={(e) => { e.key === "Enter" && joinRoom(); }}
          />
          <button onClick={joinRoom}>Join Room</button>
        </div>
      ) : (
        <div className="chat-window-container">
          <div className="chat-window">
            <div className="chat-header">
              <p>Live Chat | Room: {room}</p>
              <span className="online-count">{onlineUsers} Online</span>
            </div>
            <div className="chat-body" ref={chatBodyRef}>
              {messageList.map((msg) => {
                if (msg.type === 'notification') {
                  return <div key={msg.id || Math.random()} className="message notification"><p>{msg.message}</p></div>;
                }
                return (
                  <div key={msg.id} className="message" id={username === msg.author ? "you" : "other"}>
                    <div className="message-content">
                       {username !== msg.author && <p className="message-author">{msg.author}</p>}
                      <p>{msg.message}</p>
                    </div>
                    <div className="message-meta">
                      <span>{msg.time}</span>
                      {username === msg.author && renderTicks(msg.status)}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="typing-indicator"><p>{typingStatus}</p></div>
            <div className="chat-footer">
              <input
                type="text"
                value={currentMessage}
                placeholder="Type a message..."
                onChange={handleTyping}
                onKeyPress={(e) => { e.key === "Enter" && sendMessage(); }}
              />
              <button onClick={sendMessage}>&#9658;</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
