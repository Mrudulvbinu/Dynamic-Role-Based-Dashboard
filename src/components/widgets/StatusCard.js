import { Card, Typography, Box, LinearProgress, Stack } from '@mui/material';
import { InsertChart, People, MonetizationOn } from '@mui/icons-material';

const StatusCard = ({ title, value, icon, progress }) => {
  const getIcon = () => {
    switch(icon) {
      case 'patients': return <People color="primary" sx={{ fontSize: 40 }} />;
      case 'revenue': return <MonetizationOn color="success" sx={{ fontSize: 40 }} />;
      default: return <InsertChart color="secondary" sx={{ fontSize: 40 }} />;
    }
  };

  return (
    <Card sx={{ p: 3, height: '100%' }}>
      <Stack direction="row" spacing={2} alignItems="center">
        {getIcon()}
        <Box>
          <Typography variant="h6" color="text.secondary">{title}</Typography>
          <Typography variant="h4">{value}</Typography>
        </Box>
      </Stack>
      {progress && (
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{ mt: 2, height: 10, borderRadius: 5 }} 
        />
      )}
    </Card>
  );
};

export default StatusCard;