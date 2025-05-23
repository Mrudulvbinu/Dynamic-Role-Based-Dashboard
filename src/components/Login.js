import { useState } from 'react';
import { Button, Card, Typography, MenuItem, TextField, Box } from '@mui/material';

const roles = ["Admin", "Doctor", "Nurse", "Analyst"];

const Login = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState("");

  return (
    <Box sx={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: `url(${require('../assets/medik.jpg')})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'hidden', 
      p: 2
    }}>
        
      {/* Top-left logo */}
      <Box sx={{
        position: 'absolute',
        top: 5,
        left: 20
      }}>
        <img 
          src={require('../assets/icon.png')} 
          alt="Hospital Logo" 
          style={{ 
            height: '120px',
            width: 'auto'
          }} 
        />
      </Box>

      {/* Main content */}
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: 400,
        position: 'relative',
        zIndex: 1, 
      }}>
        <Typography
          variant="h3"
          sx={{
            mb: 2,
            color: 'black',
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 'bold',
            letterSpacing: '1px',
            textAlign: 'center',
            fontSize: { xs: '2rem', sm: '2.5rem' }
          }}
        >
          CABOT HOSPITAL
        </Typography>

        <Card sx={{
          p: 4,
          width: '100%',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          backgroundColor: 'rgba(255, 255, 255, 0.9)'
        }}>
          <Typography 
            variant="h5" 
            gutterBottom 
            align="center"
            sx={{
              fontFamily: '"Poppins", sans-serif',
              fontWeight: 'bold',
              mb: 2
            }}
          >
            Your Role
          </Typography>
          <TextField
            select
            label="Role"
            fullWidth
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            sx={{ mb: 3 }}
          >
            {roles.map((role) => (
              <MenuItem key={role} value={role.toLowerCase()}>
                {role}
              </MenuItem>
            ))}
          </TextField>
          <Button
            variant="contained"
            fullWidth
            onClick={() => onLogin(selectedRole)}
            disabled={!selectedRole}
            sx={{
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 'bold',
              borderRadius: '8px',
              fontFamily: '"Poppins", sans-serif'
            }}
          >
            LOGIN
          </Button>
        </Card>
      </Box>
    </Box>
  );
};

export default Login;