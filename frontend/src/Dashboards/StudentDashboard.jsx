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
    styled,
      Alert,
  Collapse
} from '@mui/material';
import {
    CheckCircle as CheckCircleIcon,
    Schedule as ScheduleIcon,
    Person as PersonIcon,
  School as SchoolIcon,

    Star as StarIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import ChatBot from '../ChatLLM/Querry';
import { browseCourses, getStudentCourses, submitAssignment } from '../Utils/ApiUtils';

import { useNavigate } from 'react-router-dom';
import NotAllowed from './NotAllowed';
import { jwtDecode } from 'jwt-decode';


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

const StudentDashboard = ({ user, handleLogout }) => {
    const [courses, setCourses] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notAllowed, setNotAllowed] = useState(false);
    const navigate = useNavigate();
    const theme = useTheme();
    const [courseList, setCourseList] = useState([])
 const [welcomeAlert, setWelcomeAlert] = useState(true);
    // ... other state declarations

    useEffect(() => {
        if (user?.username) {
            const timer = setTimeout(() => {
                setWelcomeAlert(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [user]);
   useEffect(() => {
    const fetchCourses = async () => {
        const token = localStorage.getItem('jwt_token');
        
        // Check authentication first
        if (!token) {
            setNotAllowed(true);
            setLoading(false);
            return;
        }

        try {
            // Verify token expiration
            const decoded = jwtDecode(token);
            if (decoded.exp * 1000 < Date.now()) {
                localStorage.removeItem('jwt_token');
                setNotAllowed(true);
                setLoading(false);
                return;
            }

            // Check role
            if (decoded.role !== 'student') {
                setNotAllowed(true);
                setLoading(false);
                return;
            }

            setLoading(true);
            
            const res = await getStudentCourses(token);
            const data = await res;

            if (data) {
                setCourses(data.courses || []);
                setCourseList(data.courses?.map(course => course.name) || []);
            }
        } catch (err) {
            console.warn(err.message);
            setCourses([]);
            setCourseList([]);

            // If token is invalid, clear it and redirect
            if (err.response?.status === 401) {
                localStorage.removeItem('jwt_token');
                setNotAllowed(true);
            }
        } finally {
            setLoading(false);
        }
    };

    fetchCourses();
}, [user]);

const handleComplete = async (assignmentId) => {
    setCourses((prev) =>
        prev.map((course) => {
            if (Array.isArray(course.assignment_status)) {
                // Check if this course contains the assignment being submitted
                const updatedAssignments = course.assignment_status.map((assignment) =>
                    assignment.assignment_id === assignmentId
                        ? { ...assignment, submitted: true }
                        : assignment
                );
                // If the assignment was in this course, update submitted_assignments and progress
                const wasSubmitted = course.assignment_status.some(
                    (assignment) => assignment.assignment_id === assignmentId
                );
                if (wasSubmitted) {
                    const submitted_assignments = updatedAssignments.filter(a => a.submitted).length;
                    const total_assignments = course.total_assignments || updatedAssignments.length;
                    const progress = Math.round((submitted_assignments / total_assignments) * 100);
                    return {
                        ...course,
                        assignment_status: updatedAssignments,
                        submitted_assignments,
                        progress
                    };
                }
                return {
                    ...course,
                    assignment_status: updatedAssignments
                };
            }
            return course;
        })
    );

    try {
        const token = localStorage.getItem('jwt_token');
        if (!token) return; // on mock mode, skip API call
        console.log("Submitting assignment with ID:", assignmentId);
        const res = await submitAssignment(token, assignmentId)
        const data = await res;
        if (data.error) {
            console.error("Error submitting assignment:", data.error);
            return;
        }

    } catch (error) {
        console.error("Error in handleComplete:", error);
    }
};
if (notAllowed) {
    return <NotAllowed />;
}
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

const handleBrowseCourse = async () => {
    try {
        // Example: Replace with your actual API call to fetch all courses
        const token = localStorage.getItem('jwt_token');
        const res = await browseCourses(token);
        const data = await res;
        console.log("Fetched all courses:", data);
    } catch (error) {
        console.error("Error fetching all courses:", error);
    }
};

return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 6 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Typography variant="h4" fontWeight="bold" color="primary">
                My Learning Dashboard
            </Typography>
            <Box display="flex" alignItems="center" gap={1} ml="auto">
                <Chip
                    label={`Welcome, ${user?.username || 'Student'}`}
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

        {courses?.length === 0 ? (
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
                <Button variant="contained" size="large" onClick={handleBrowseCourse}>
                    Browse Courses
                </Button>
            </Box>
        ) : (
            <Grid container spacing={3}>
                {courses.map((course, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={course._id} sx={{ minWidth: 280 }}>
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
                                    minWidth: 260,
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
                                    image={course.thumbnail || 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/CMB_Timeline300_no_WMAP.jpg/960px-CMB_Timeline300_no_WMAP.jpg'}
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
                                        <Typography variant="body2">{course.instructor}</Typography>
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

                                    {/* Assignment Checkboxes */}
                                    {Array.isArray(course.assignment_status) && course.assignment_status.length > 0 && (
                                        <Box mt={2}>
                                            <Typography variant="subtitle2" gutterBottom>
                                                Assignments:
                                            </Typography>
                                            <Box display="flex" flexDirection="column" gap={1}>
                                                {course.assignment_status.map((assignment, idx) => (
                                                    <FormControlLabel
                                                        key={assignment.assignment_id || idx}
                                                        control={
                                                            <Checkbox
                                                                checked={!!assignment.submitted}
                                                                color="primary"
                                                                onClick={() => { handleComplete(assignment.assignment_id) }}
                                                                disabled={!!assignment.submitted}
                                                            />
                                                        }
                                                        label={
                                                            <Typography variant="body2">
                                                                {assignment.title || `Assignment ${idx + 1}`}
                                                            </Typography>
                                                        }
                                                        sx={{ ml: 1 }}
                                                    />
                                                ))}
                                            </Box>
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>
                        </AnimatedCard>
                    </Grid>
                ))}
            </Grid>
        )}
        {console.log("Course List:", courseList)}
        <ChatBot courses={courseList} />
    </Container>
);
};

export default StudentDashboard;