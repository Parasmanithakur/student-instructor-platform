import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Chip,
  Avatar,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { getLeaderboardData } from "../Utils/ApiUtils";

const Leaderboard = ({ user }) => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await getLeaderboardData();
        // Process data to aggregate by student
        const studentMap = {};
        
        data.forEach(item => {
          if (!studentMap[item.username]) {
            studentMap[item.username] = {
              username: item.username,
              totalScore: 0,
              totalSubmissions: 0,
              courses: []
            };
          }
          studentMap[item.username].totalScore += item.score;
          studentMap[item.username].totalSubmissions += item.submissions;
          studentMap[item.username].courses.push(item.course);
        });

        // Convert to array and sort by total score
        const rankedStudents = Object.values(studentMap)
          .sort((a, b) => b.totalScore - a.totalScore)
          .map((student, index) => ({
            ...student,
            rank: index + 1,
            coursesCount: student.courses.length
          }));

        setLeaders(rankedStudents);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
        setLeaders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getMedalColor = (rank) => {
    switch(rank) {
      case 1: return "gold";
      case 2: return "silver";
      case 3: return "#cd7f32"; // bronze
      default: return "inherit";
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Paper elevation={4} sx={{ 
        padding: 4, 
        borderRadius: 4, 
        background: "linear-gradient(135deg, #ffffff, #f0f0f0)" 
      }}>
        <Typography variant="h4" align="center" gutterBottom color="primary">
          <EmojiEventsIcon sx={{ verticalAlign: "middle", mr: 1 }} /> Student Leaderboard
        </Typography>

        <Box display="flex" justifyContent="flex-end" mb={2}>
          <a
            href={
              user?.role === "instructor"
                ? "/instructor/dashboard"
                : "/student/dashboard"
            }
            style={{ textDecoration: "none" }}
          >
            <Box
              component="button"
              sx={{
                px: 2,
                py: 1,
                background: "#1976d2",
                color: "#fff",
                border: "none",
                borderRadius: 2,
                cursor: "pointer",
                fontWeight: "bold",
                "&:hover": { background: "#1565c0" },
              }}
            >
              Back to Dashboard
            </Box>
          </a>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Rank</strong></TableCell>
                  <TableCell><strong>Student</strong></TableCell>
                  <TableCell><strong>Courses Enrolled</strong></TableCell>
                  <TableCell><strong>Total Submissions</strong></TableCell>
                  <TableCell><strong>Total Score</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leaders.map((student) => (
                  <TableRow 
                    key={student.username}
                    sx={{ 
                      backgroundColor: student.username === user?.username ? 'rgba(25, 118, 210, 0.08)' : 'inherit',
                      '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
                    }}
                  >
                    <TableCell>
                      {student.rank <= 3 ? (
                        <Chip
                          avatar={
                            <Avatar sx={{ 
                              bgcolor: getMedalColor(student.rank),
                              color: student.rank <= 3 ? "white" : "inherit"
                            }}>
                              {student.rank}
                            </Avatar>
                          }
                          label={student.rank === 1 ? "🥇" : student.rank === 2 ? "🥈" : "🥉"}
                          sx={{ 
                            bgcolor: getMedalColor(student.rank),
                            color: "white",
                            fontWeight: "bold"
                          }}
                        />
                      ) : (
                        student.rank
                      )}
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar sx={{ 
                          bgcolor: student.username === user?.username ? 'primary.main' : 'grey.500',
                          mr: 2,
                          width: 32,
                          height: 32
                        }}>
                          {student.username.charAt(0).toUpperCase()}
                        </Avatar>
                        {student.username}
                        {student.username === user?.username && (
                          <Chip 
                            label="You" 
                            size="small" 
                            color="primary" 
                            sx={{ ml: 1 }}
                          />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>{student.coursesCount}</TableCell>
                    <TableCell>{student.totalSubmissions}</TableCell>
                    <TableCell>
                      <strong>{student.totalScore}</strong>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
};

export default Leaderboard;