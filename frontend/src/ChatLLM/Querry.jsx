import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Avatar, 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  Divider, 
  CircularProgress,
  IconButton,
  Tooltip,
  Chip,
  Checkbox,
  ListItemIcon,
  ListItemButton
} from '@mui/material';
import { 
  Send as SendIcon, 
  Person as PersonIcon, 
  SmartToy as BotIcon,
  Refresh as RefreshIcon,
  Book as BookIcon
} from '@mui/icons-material';
import { sendChatMessage } from '../Utils/ApiUtils';
import { styled } from '@mui/material/styles';

const ChatContainer = styled(Paper)(({ theme }) => ({
  width: '100%',
  maxWidth: 600,
  height: '70vh',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  overflow: 'hidden',
}));

const MessageList = styled(List)({
  flex: 1,
  overflowY: 'auto',
  padding: 0,
});

const UserMessage = styled(ListItem)(({ theme }) => ({
  flexDirection: 'row-reverse',
  textAlign: 'right',
  '& .MuiListItemText-root': {
    marginLeft: theme.spacing(2),
  },
}));

const BotMessage = styled(ListItem)(({ theme }) => ({
  textAlign: 'left',
  '& .MuiListItemText-root': {
    marginRight: theme.spacing(2),
  },
}));

const MessageBubble = styled(Paper)(({ theme, role }) => ({
  display: 'inline-block',
  padding: theme.spacing(1.5, 2),
  borderRadius: role === 'user' 
    ? '18px 18px 0 18px' 
    : '18px 18px 18px 0',
  backgroundColor: role === 'user' 
    ? theme.palette.primary.light 
    : theme.palette.grey[200],
  color: role === 'user' 
    ? theme.palette.primary.contrastText 
    : theme.palette.text.primary,
  maxWidth: '70%',
  wordBreak: 'break-word',
}));

const InputArea = styled(Box)(({ theme }) => ({
  display: 'flex',
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.default,
}));

const CourseSelector = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.grey[100],
}));

const ChatBot = ({ courses }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [showCourseSelector, setShowCourseSelector] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleCourseSelector = () => {
    setShowCourseSelector(!showCourseSelector);
  };

  const handleCourseToggle = (courseId) => {
    setSelectedCourses(prev =>
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const getSelectedCourseNames = () => {
    return courses
      .filter(course => selectedCourses.includes(course))
      .map(course => course);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = { 
      role: 'user', 
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, userMessage]);
    setLoading(true);
    setInput('');

    try {
    const context = getSelectedCourseNames().join(', ');
      
      const res = await sendChatMessage(input, context);
      const data = await res;
      
      const botMessage = { 
        role: 'assistant', 
        content: data.response || 'Error from server.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (e) {
      const errorMessage = { 
        role: 'assistant', 
        content: 'Failed to connect to chatbot.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setSelectedCourses([]);
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      p: 2,
      height: '100%'
    }}>
      <Typography variant="h5" gutterBottom sx={{ 
        fontWeight: 'bold',
        color: 'primary.main',
        mb: 2
      }}>
        Course Assistant
        <Tooltip title="Clear chat">
          <IconButton 
            onClick={clearChat} 
            size="small" 
            sx={{ ml: 1 }}
          >
            <RefreshIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Typography>
      
      <ChatContainer>
        {showCourseSelector && (
          <CourseSelector>
            <Typography variant="subtitle2" gutterBottom>
              Select courses for context:
            </Typography>
            <List dense sx={{ maxHeight: 150, overflow: 'auto' }}>
              {courses.map((course) => (
                <ListItem key={course} disablePadding>
                  <ListItemButton onClick={() => handleCourseToggle(course)}>
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={selectedCourses.includes(course)}
                        tabIndex={-1}
                        disableRipple
                      />
                    </ListItemIcon>
                    <ListItemText primary={course} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            {selectedCourses.length > 0 && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Selected: {getSelectedCourseNames().join(', ')}
                </Typography>
              </Box>
            )}
          </CourseSelector>
        )}
        
        <MessageList>
          {messages.length === 0 && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '100%',
              color: 'text.secondary',
              flexDirection: 'column',
              textAlign: 'center',
              p: 2
            }}>
              <BotIcon fontSize="large" sx={{ mb: 1, color: 'action.active' }} />
              <Typography>Ask me anything about your courses!</Typography>
              {courses?.length > 0 && (
                <Button 
                  variant="outlined" 
                  size="small" 
                  startIcon={<BookIcon />}
                  onClick={toggleCourseSelector}
                  sx={{ mt: 2 }}
                >
                  {showCourseSelector ? 'Hide course selection' : 'Select courses for context'}
                </Button>
              )}
            </Box>
          )}
          
          {messages.map((msg, idx) => (
            <React.Fragment key={idx}>
              {msg.role === 'user' ? (
                <UserMessage>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <MessageBubble role={msg.role}>
                        {msg.content}
                      </MessageBubble>
                    }
                    secondary={msg.timestamp}
                    secondaryTypographyProps={{
                      color: 'text.secondary',
                      variant: 'caption'
                    }}
                  />
                </UserMessage>
              ) : (
                <BotMessage>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'secondary.main' }}>
                      <BotIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <MessageBubble role={msg.role}>
                        {msg.content}
                      </MessageBubble>
                    }
                    secondary={msg.timestamp}
                    secondaryTypographyProps={{
                      color: 'text.secondary',
                      variant: 'caption'
                    }}
                  />
                </BotMessage>
              )}
              {idx < messages.length - 1 && <Divider variant="inset" component="li" />}
            </React.Fragment>
          ))}
          {loading && (
            <BotMessage>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                  <BotIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    <Typography>Thinking...</Typography>
                  </Box>
                }
              />
            </BotMessage>
          )}
          <div ref={messagesEndRef} />
        </MessageList>
        
        <InputArea>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your question..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && sendMessage()}
            disabled={loading}
            sx={{ mr: 1 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            endIcon={<SendIcon />}
          >
            Send
          </Button>
        </InputArea>
      </ChatContainer>
      
      {selectedCourses.length > 0 && !showCourseSelector && (
        <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {getSelectedCourseNames().map(name => (
            <Chip 
              key={name}
              label={name}
              size="small"
              onDelete={() => handleCourseToggle(
                courses.find(c => c.name === name)
              )}
            />
          ))}
          <Button 
            size="small" 
            onClick={toggleCourseSelector}
            sx={{ ml: 1 }}
          >
            Edit
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ChatBot;