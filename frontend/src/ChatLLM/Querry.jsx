import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Paper } from '@mui/material';

const ChatBot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setLoading(true);
    setInput('');

    try {
      const res = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();
      if (data.response) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Error from server.' }]);
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Failed to connect to chatbot.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={3} maxWidth={600} mx="auto">
      <Typography variant="h5" mb={2}>Ask the Course Assistant</Typography>
      {messages.length >0  && <Paper sx={{ p: 2, minHeight: 200, mb: 2 }}>
        {messages.map((msg, idx) => (
          <Typography key={idx} variant="body1" color={msg.role === 'user' ? 'primary' : 'secondary'}>
            <strong>{msg.role === 'user' ? 'You' : 'Bot'}:</strong> {msg.content}
          </Typography>
        ))}
      </Paper>}
      <TextField
        fullWidth
        label="Your question"
        variant="outlined"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyPress={e => e.key === 'Enter' && sendMessage()}
      />
      <Button onClick={sendMessage} variant="contained" disabled={loading} sx={{ mt: 2 }}>
        {loading ? 'Thinking...' : 'Send'}
      </Button>
    </Box>
  );
};

export default ChatBot;
