import React, { useState, useEffect } from 'react';
import { Container, VStack, Input, Button, Text, HStack, Box, Badge } from "@chakra-ui/react";
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

const Index = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on('updateUsers', (users) => {
      setUsers(users);
    });

    socket.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('updateUsers');
      socket.off('receiveMessage');
    };
  }, []);

  const handleLogin = () => {
    if (password === 'password') {
      socket.emit('login', username);
      setLoggedIn(true);
    } else {
      alert('Incorrect password');
    }
  };

  const handleSendMessage = () => {
    const newMessage = { username, text: message };
    socket.emit('sendMessage', newMessage);
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setMessage('');
  };

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      {!loggedIn ? (
        <VStack spacing={4}>
          <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button onClick={handleLogin}>Login</Button>
        </VStack>
      ) : (
        <VStack spacing={4} width="100%">
          <HStack spacing={4} width="100%" justifyContent="space-between">
            <Text fontSize="2xl">Chat Application</Text>
            <Button onClick={() => setLoggedIn(false)}>Logout</Button>
          </HStack>
          <Box width="100%" borderWidth="1px" borderRadius="lg" overflow="hidden" p={4}>
            <VStack spacing={4} align="start">
              {users.map((user) => (
                <HStack key={user.username} spacing={2}>
                  <Badge colorScheme={user.online ? 'green' : 'red'}>{user.online ? 'Online' : 'Offline'}</Badge>
                  <Text>{user.username}</Text>
                </HStack>
              ))}
            </VStack>
          </Box>
          <Box width="100%" borderWidth="1px" borderRadius="lg" overflow="hidden" p={4} height="300px" overflowY="scroll">
            <VStack spacing={4} align="start">
              {messages.map((msg, index) => (
                <Box key={index} p={2} bg="gray.100" borderRadius="md">
                  <Text><strong>{msg.username}:</strong> {msg.text}</Text>
                </Box>
              ))}
            </VStack>
          </Box>
          <HStack spacing={4} width="100%">
            <Input placeholder="Type a message" value={message} onChange={(e) => setMessage(e.target.value)} />
            <Button onClick={handleSendMessage}>Send</Button>
          </HStack>
        </VStack>
      )}
    </Container>
  );
};

export default Index;