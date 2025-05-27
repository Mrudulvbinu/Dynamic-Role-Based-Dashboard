import { CalendarClock } from 'lucide-react';
import { Card, Typography, Box, Stack, List, ListItem, ListItemText, Avatar } from '@mui/material';

const UpcomingAppointments = ({ appointments = [] }) => {
  return (
    <Card sx={{ p: 3, height: '100%' }}>
      <Stack spacing={2}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Avatar sx={{ bgcolor: 'primary.light', width: 40, height: 40 }}>
            <CalendarClock size={20} color="#1976d2" />
          </Avatar>
          <Typography variant="h6">Upcoming Appointments</Typography>
        </Stack>
        
        <List sx={{ overflow: 'auto', maxHeight: 300 }}>
          {appointments.map((appt, index) => (
            <ListItem 
              key={index} 
              sx={{
                bgcolor: 'grey.100',
                borderRadius: 1,
                mb: 1,
                display: 'flex',
                justifyContent: 'space-between'
              }}
            >
              <ListItemText 
                primary={`${appt.date} at ${appt.time}`} 
                secondary={appt.description || 'Appointment'}
              />
              <Typography variant="body2" fontWeight="medium">
                {appt.doctor || appt.patient}
              </Typography>
            </ListItem>
          ))}
        </List>
      </Stack>
    </Card>
  );
};

export default UpcomingAppointments;