import { Pill } from 'lucide-react';
import { Card, Typography, Box, Stack, List, ListItem, Avatar } from '@mui/material';

const Prescriptions = ({ prescriptions = [] }) => {
  return (
    <Card sx={{ p: 3, height: '100%' }}>
      <Stack spacing={2}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Avatar sx={{ bgcolor: 'success.light', width: 40, height: 40 }}>
            <Pill size={20} color="#2e7d32" />
          </Avatar>
          <Typography variant="h6">Prescriptions</Typography>
        </Stack>
        
        <List sx={{ overflow: 'auto', maxHeight: 300 }}>
          {prescriptions.map((pres, index) => (
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
              <Box>
                <Typography variant="body1" fontWeight="medium">
                  {pres.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {pres.patient || `${pres.dosage}, ${pres.schedule}`}
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">
                {pres.date}
              </Typography>
            </ListItem>
          ))}
        </List>
      </Stack>
    </Card>
  );
};

export default Prescriptions;