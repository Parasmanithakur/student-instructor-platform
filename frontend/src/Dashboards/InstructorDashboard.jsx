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
  Chip,
  Avatar,
  useTheme,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Badge,
  IconButton,
  Tooltip,
  Skeleton
} from '@mui/material';
import {
  People as PeopleIcon,
  School as SchoolIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  BarChart as AnalyticsIcon,
  Message as MessageIcon,
  Edit as EditIcon,
  MoreVert as MoreIcon,
   Star as StarIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import StudentProgressChart from './StudentProgressChart';
import { getInstructorCourses } from '../Utils/ApiUtils';
import NotAllowed from './NotAllowed';
import { useNavigate } from 'react-router-dom';



const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: 10,
    top: 10,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

const AnimatedCard = styled(motion.div)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column'
}));

const CompletionRate = styled(Box)(({ theme, rate }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginTop: theme.spacing(1),
  '& .MuiLinearProgress-root': {
    flexGrow: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.palette.grey[200],
  },
  '& .MuiLinearProgress-bar': {
    borderRadius: 4,
    backgroundColor: rate > 70 ? theme.palette.success.main :
      rate > 40 ? theme.palette.warning.main :
        theme.palette.error.main
  }
}));

const InstructorDashboard = ({ user, handleLogout }) => {
  const [courses, setCourses] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [notAllowed, setNotAllowed] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('jwt_token');
      if (!token || (user && user.role !== 'instructor')) {
        setNotAllowed(true);
        setLoading(false);
        return;
      }

      try {
        const res = await getStudentCourses(token);
        const data = await res;
        if (data) {
          console.log("Fetched courses:", data);
          setCourses(data.courses || []);
        }
      } catch (err) {
        console.warn(err.message);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [user]);
  / Fetch instructor courses on mount (fallback to mock data)/
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        if (!token) throw new Error('No token, using mock data');

        const res = await getInstructorCourses(token)
        if (!res) throw new Error('API not ready, using mock data');

        const data = await res;
        console.log("Fetched courses:", data)
        setCourses(data.courses || []);
      } catch (err) {
        console.warn(err.message);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleViewDetails = (course) => {
    setSelectedCourse(course);
  };

  const handleCloseDetails = () => {
    setSelectedCourse(null);
  };
  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 6 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4" fontWeight="bold">
            Instructor Dashboard
          </Typography>
          <Box display="flex" gap={2}>
            <Skeleton variant="rectangular" width={120} height={40} />
            <Skeleton variant="rectangular" width={120} height={40} />
          </Box>
        </Box>
        <Grid container spacing={3}>
          {[1, 2, 3].map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item}>
              <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }
  if (notAllowed) {
    return <NotAllowed role={"instructor"}/>;
  }
  

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 6 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold" color="primary">
          Instructor Dashboard
        </Typography>
        <Box display="flex" gap={2}>
          <Chip
            label={`Welcome, ${user?.username || 'instructor'}`}
            color="error"
            variant="outlined"
          />
          <Chip
            label="Leaderboard"
            color="primary"
            variant="outlined"
            clickable
            onClick={() => window.open('/student/leaderboard', '_blank')}
            avatar={
              <Avatar sx={{ bgcolor: theme.palette.primary.light }}>
                <StarIcon fontSize="small" />
              </Avatar>
            }
          />
          <Chip
            label={`${courses.length} Courses`}
            color="primary"
            variant="outlined"
            avatar={
              <Avatar sx={{ bgcolor: theme.palette.primary.light }}>
                <SchoolIcon fontSize="small" />
              </Avatar>
            }
          />
          <Chip
            label={`${courses.reduce((sum, c) => sum + c.totalStudents, 0)} Students`}
            color="secondary"
            variant="outlined"
            avatar={
              <Avatar sx={{ bgcolor: theme.palette.secondary.light }}>
                <PeopleIcon fontSize="small" />
              </Avatar>
            }
          />
          <Chip
            label="Logout"
            color="error"
            variant="outlined"
            clickable
            onClick={() => {
              localStorage.removeItem('jwt_token');
              window.location.reload();
              handleLogout();
            }}
            avatar={
              <Avatar sx={{ bgcolor: theme.palette.error.light }}>
                <CheckCircleIcon fontSize="small" />
              </Avatar>
            }
          />
        </Box>
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
          <SchoolIcon color="disabled" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h6" color="text.secondary" mb={1}>
            You haven't created any courses yet
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            Create your first course and start teaching!
          </Typography>
          <Button variant="contained" size="large">
            Create New Course
          </Button>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {courses.map((course, index) => (
              <Grid item xs={12} sm={6} md={4} key={course._id}>
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
                      }
                    }}
                  >
                    <StyledBadge
                      badgeContent={`${course.activeStudents}/${course.totalStudents}`}
                      color="primary"
                      overlap="rectangular"
                    >
                      <CardMedia
                        component="img"
                        height="180"
                        image={course.thumbnailUrl || 'https://source.unsplash.com/random/400x180/?education'}
                        alt={course.name}
                        sx={{ objectFit: 'cover' }}
                      />
                    </StyledBadge>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                        <Chip
                          label={course.category}
                          size="small"
                          color="secondary"
                          variant="outlined"
                        />
                        <Box>
                          <Tooltip title="Course options">
                            <IconButton size="small">
                              <MoreIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>

                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        {course.name}
                      </Typography>

                      <CompletionRate rate={course.completionRate}>
                        <Typography variant="body2" color="text.secondary">
                          Completion:
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={course.completionRate}
                        />
                        <Typography variant="body2" fontWeight="medium">
                          {course.completionRate}%
                        </Typography>
                      </CompletionRate>

                      <Box display="flex" alignItems="center" mt={2} mb={1} color="text.secondary">
                        <ScheduleIcon fontSize="small" sx={{ mr: 0.5 }} />
                        <Typography variant="body2">
                          Updated: {new Date(course.lastUpdated).toLocaleDateString()}
                        </Typography>
                      </Box>

                      {course.assignments?.length > 0 && (
                        <Box mt={2}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Upcoming Assignments:
                          </Typography>
                          <List dense sx={{ py: 0 }}>
                            {course.assignments.slice(0, 2).map((assignment, i) => (
                              <ListItem key={i} sx={{ px: 0, py: 0.5 }}>
                                <ListItemAvatar sx={{ minWidth: 30 }}>
                                  <AnalyticsIcon fontSize="small" color="action" />
                                </ListItemAvatar>
                                <ListItemText
                                  primary={assignment.name}
                                  secondary={`Due: ${new Date(assignment.dueDate).toLocaleDateString()}`}
                                  primaryTypographyProps={{ variant: 'body2' }}
                                  secondaryTypographyProps={{ variant: 'caption' }}
                                />
                              </ListItem>
                            ))}
                            {course.assignments.length > 2 && (
                              <Typography variant="caption" color="text.secondary">
                                +{course.assignments.length - 2} more
                              </Typography>
                            )}
                          </List>
                        </Box>
                      )}
                    </CardContent>
                    <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<PeopleIcon />}
                        fullWidth
                        onClick={() => handleViewDetails(course)}
                      >
                        View Students
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<EditIcon />}
                        fullWidth
                      >
                        Manage
                      </Button>
                    </Box>
                  </Card>
                </AnimatedCard>
              </Grid>
            ))}
          </Grid>

          {/* Course Details Modal */}
          {selectedCourse && (
            <Card sx={{ mt: 4, p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" fontWeight="bold">
                  {selectedCourse.name} - Student Progress
                </Typography>
                <Button onClick={handleCloseDetails}>Close</Button>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ height: 300 }}>
                    <StudentProgressChart
                      totalStudents={selectedCourse.totalStudents}
                      activeStudents={selectedCourse.activeStudents}
                      completionRate={selectedCourse.completionRate}
                    />
                  </Box>

                  <Box display="flex" justifyContent="space-around" mt={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="primary">
                        {selectedCourse.totalStudents}
                      </Typography>
                      <Typography variant="body2">Total Students</Typography>
                    </Box>
                    <Box textAlign="center">
                      <Typography variant="h4" color="success.main">
                        {selectedCourse.activeStudents}
                      </Typography>
                      <Typography variant="body2">Active Students</Typography>
                    </Box>
                    <Box textAlign="center">
                      <Typography variant="h4" sx={{
                        color: selectedCourse.completionRate > 70 ? 'success.main' :
                          selectedCourse.completionRate > 40 ? 'warning.main' : 'error.main'
                      }}>
                        {selectedCourse.completionRate}%
                      </Typography>
                      <Typography variant="body2">Completion Rate</Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h6" mb={2}>Recent Activity</Typography>
                  <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                    {/* Mock activity data - replace with real data */}
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>JD</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary="John Doe completed Variables Exercise"
                        secondary="2 hours ago"
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>AS</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary="Alice Smith submitted Functions Project"
                        secondary="1 day ago"
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>BJ</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary="Bob Johnson asked a question in discussion"
                        secondary="2 days ago"
                      />
                      <IconButton size="small">
                        <MessageIcon fontSize="small" />
                      </IconButton>
                    </ListItem>
                    <Divider variant="inset" component="li" />
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>EM</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary="Emma Miller started the course"
                        secondary="3 days ago"
                      />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
            </Card>
          )}
        </>
      )}
    </Container>
  );
};

export default InstructorDashboard;