import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  LinearProgress,
  Button,
  Box,
  Checkbox,
  FormControlLabel,
  Skeleton,
  Chip,
  Avatar,
  useTheme,
  styled
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import ChatBot from '../ChatLLM/Querry';

/**
 * When the backend is not ready, we fall back to DEFAULT_COURSES.
 * Replace this with real fetch once the API is live.
 */
const DEFAULT_COURSES = [
  {
    _id: '1',
    name: 'Intro to Python',
    instructorName: 'Dr. Smith',
    thumbnailUrl: 'https://source.unsplash.com/random/600x400/?python',
    dueDate: '2025-07-15T00:00:00Z',
    progress: 40,
    isCompleted: false,
    category: 'Programming'
  },
  {
    _id: '2',
    name: 'Web Development Basics',
    instructorName: 'Prof. Johnson',
    thumbnailUrl: 'https://source.unsplash.com/random/600x400/?web,development',
    dueDate: '2025-08-01T00:00:00Z',
    progress: 75,
    isCompleted: false,
    category: 'Web'
  },
  {
    _id: '3',
    name: 'Data Structures',
    instructorName: 'Dr. Lee',
    thumbnailUrl: 'https://source.unsplash.com/random/600x400/?data,structure',
    dueDate: '2025-06-30T00:00:00Z',
    progress: 100,
    isCompleted: true,
    category: 'Computer Science'
  },
  {
    _id: '4',
    name: 'Machine Learning Fundamentals',
    instructorName: 'Prof. Chen',
    thumbnailUrl: 'https://source.unsplash.com/random/600x400/?machine,learning',
    dueDate: '2025-09-15T00:00:00Z',
    progress: 20,
    isCompleted: false,
    category: 'AI'
  }
];

const AnimatedCard = styled(motion.div)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column'
}));

const ProgressWithLabel = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(1)
}));

const StyledLinearProgress = styled(LinearProgress)(({ theme, value }) => ({
  flexGrow: 1,
  height: 10,
  borderRadius: 5,
  backgroundColor: theme.palette.grey[200],
  '& .MuiLinearProgress-bar': {
    borderRadius: 5,
    backgroundColor: value === 100 ? theme.palette.success.main : theme.palette.primary.main
  }
}));

const StudentDashboard = () => {
  const [courses, setCourses] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  // Fetch enrolled courses on mount (fallback to mock data)
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token, using mock data');

        const res = await fetch('http://localhost:5000/student/courses', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error('API not ready, using mock data');

        const data = await res.json();
        setCourses(data.courses || DEFAULT_COURSES);
      } catch (err) {
        console.warn(err.message);
        setCourses(DEFAULT_COURSES);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleComplete = async (courseId) => {
    setCourses((prev) =>
      prev.map((c) => (c._id === courseId ? { ...c, progress: 100, isCompleted: true } : c))
    );

    try {
      const token = localStorage.getItem('token');
      if (!token) return; // on mock mode, skip API call

      await fetch(`http://localhost:5000/student/courses/${courseId}/complete`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (e) {
      console.error('Failed to mark completed on server', e);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 6 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4" fontWeight="bold">
            My Learning Dashboard
          </Typography>
          <Skeleton variant="rectangular" width={150} height={40} />
        </Box>
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item}>
              <Skeleton variant="rectangular" height={350} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 6 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold" color="primary">
          My Learning Dashboard
        </Typography>
        <Chip
          label={`${courses.filter(c => c.isCompleted).length}/${courses.length} completed`}
          color="primary"
          variant="outlined"
          avatar={
            <Avatar sx={{ bgcolor: theme.palette.primary.light }}>
              <CheckCircleIcon fontSize="small" />
            </Avatar>
          }
        />
      </Box>

      {courses.length === 0 ? (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="300px"
          textAlign="center"
        >
          <StarIcon color="disabled" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h6" color="text.secondary" mb={1}>
            No courses enrolled yet
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            Discover our catalog and start learning today!
          </Typography>
          <Button variant="contained" size="large">
            Browse Courses
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {courses.map((course, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={course._id}>
              <AnimatedCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: theme.shadows[6]
                    },
                    border: course.isCompleted ? `2px solid ${theme.palette.success.light}` : 'none'
                  }}
                >
                  <CardMedia
                    component="img"
                    height="160"
                    image={course.thumbnailUrl || 'https://source.unsplash.com/random/400x160/?education'}
                    alt={course.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                      <Chip
                        label={course.category}
                        size="small"
                        color="secondary"
                        variant="outlined"
                      />
                      {course.isCompleted && (
                        <Chip
                          label="Completed"
                          size="small"
                          color="success"
                          variant="filled"
                          icon={<CheckCircleIcon fontSize="small" />}
                        />
                      )}
                    </Box>
                    
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {course.name}
                    </Typography>
                    
                    <Box display="flex" alignItems="center" mb={1} color="text.secondary">
                      <PersonIcon fontSize="small" sx={{ mr: 0.5 }} />
                      <Typography variant="body2">{course.instructorName}</Typography>
                    </Box>
                    
                    <Box display="flex" alignItems="center" mb={2} color="text.secondary">
                      <ScheduleIcon fontSize="small" sx={{ mr: 0.5 }} />
                      <Typography variant="body2">
                        Due: {new Date(course.dueDate).toLocaleDateString()}
                      </Typography>
                    </Box>

                    <ProgressWithLabel>
                      <StyledLinearProgress
                        variant="determinate"
                        value={course.progress}
                      />
                      <Typography variant="body2" fontWeight="medium">
                        {course.progress}%
                      </Typography>
                    </ProgressWithLabel>

                    {!course.isCompleted ? (
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={course.isCompleted}
                            onChange={() => handleComplete(course._id)}
                            color="primary"
                          />
                        }
                        label={
                          <Typography variant="body2">
                            Mark as completed
                          </Typography>
                        }
                        sx={{ mt: 1 }}
                      />
                    ) : (
                      <Button
                        fullWidth
                        variant="outlined"
                        color="success"
                        sx={{ mt: 2 }}
                        startIcon={<CheckCircleIcon />}
                        disabled
                      >
                        Course Completed
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </AnimatedCard>
            </Grid>
          ))}
        </Grid>
      )}
      <ChatBot/>
    </Container>
  );
};

export default StudentDashboard;