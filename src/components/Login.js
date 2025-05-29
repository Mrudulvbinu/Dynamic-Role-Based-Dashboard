import { useState } from "react";
import {
  Button,
  Card,
  Typography,
  TextField,
  Box,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff, Person, Lock } from "@mui/icons-material";
import medikImage from "../assets/medik.jpg";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = () => {
    const user = mockUsers.find(
      (u) =>
        u.username.toLowerCase() === username.toLowerCase() &&
        u.password === password
    );

    if (user) {
      setError("");
      localStorage.setItem("userRole", user.role);
      onLogin(user.role);
    } else {
      setError("Invalid username or password");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: `url(${medikImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "hidden",
        p: 2,
      }}
    >
      {/* Top-left logo */}
      <Box
        sx={{
          position: "absolute",
          top: 5,
          left: 20,
        }}
      >
        <img
          src={require("../assets/icon.png")}
          alt="Hospital Logo"
          style={{
            height: "120px",
            width: "auto",
          }}
        />
      </Box>

      {/* Main content */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          maxWidth: 400,
          position: "relative",
          zIndex: 1,
        }}
      >
        <Typography
          variant="h3"
          sx={{
            mb: 2,
            color: "black",
            fontFamily: '"Poppins", sans-serif',
            fontWeight: "bold",
            letterSpacing: "1px",
            textAlign: "center",
            fontSize: { xs: "2rem", sm: "2.5rem" },
          }}
        >
          CABOT HOSPITAL
        </Typography>

        <Card
          sx={{
            p: 4,
            width: "100%",
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            align="center"
            sx={{
              fontFamily: '"Poppins", sans-serif',
              fontWeight: "bold",
              mb: 2,
            }}
          >
            Login
          </Typography>

          {error && (
            <Typography color="error" align="center" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          <TextField
            label="Username"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person />
                </InputAdornment>
              ),
            }}
            onKeyUp={handleKeyPress}
          />

          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 3 }}
            slotProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            onKeyUp={handleKeyPress}
          />

          <Button
            variant="contained"
            fullWidth
            onClick={handleLogin}
            disabled={!username || !password}
            sx={{
              py: 1.5,
              fontSize: "1rem",
              fontWeight: "bold",
              borderRadius: "8px",
              fontFamily: '"Poppins", sans-serif',
              background: "linear-gradient(45deg, #1976d2 30%, #2196f3 90%)",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              },
              transition: "all 0.3s ease",
            }}
          >
            LOGIN
          </Button>
        </Card>
      </Box>
    </Box>
  );
};

// Mock user database
const mockUsers = [
  {
    username: "admin",
    password: "admin123",
    role: "admin",
  },
  {
    username: "doctor",
    password: "doctor123",
    role: "doctor",
  },
  {
    username: "nurse",
    password: "nurse123",
    role: "nurse",
  },
  {
    username: "analyst",
    password: "analyst123",
    role: "analyst",
  },
  {
    username: "patient",
    password: "patient123",
    role: "patient",
  },
];

export default Login;
