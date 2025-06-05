import { Card, Typography, Box, LinearProgress, Stack, Avatar } from '@mui/material';
import {
  People,
  Favorite,
  LocalHospital,
  HealthAndSafety,
} from '@mui/icons-material';

const iconMap = {
  people: People,
  health: HealthAndSafety,
  hospital: LocalHospital,
  heart: Favorite,
};

const PatientStatsCard = ({ title = "Patients", value, progress, icon, color = "primary", description }) => {
  const Icon = iconMap[icon?.toLowerCase()] || People;

  return (
    <Card sx={{ p: 3, height: '100%' }}>
    <Stack spacing={2}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Avatar sx={{ 
          bgcolor: `${color}.light`, 
          width: 40, 
          height: 40,
          '& .MuiSvgIcon-root': {
            fontSize: 28,
            color: `${color}.main`
          }
        }}>
          <Icon />
        </Avatar> 
         <Typography variant="h6">{title}</Typography>
         </Stack>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            {value}
          </Typography>
          {description && (
            <Typography variant="h6" color="text.secondary">
              {description}
            </Typography>
          )}
        </Box>
      </Stack>
      {typeof progress === 'number' && (
        <Box sx={{ mt: 'auto', pt: 1 }}>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            color={color}
            sx={{ 
              height: 10, 
              borderRadius: 4,
              '& .MuiLinearProgress-bar': {
                borderRadius: 4
              }
            }} 
          />
          <Typography variant="caption" sx={{ mt: 0.5 }}>
            {progress}% {description ? '' : 'completed'}
          </Typography>
        </Box>
      )}
    </Card>
  );
};

export default PatientStatsCard;