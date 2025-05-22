import { 
  Card, 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow, 
  Typography,
  Box
} from '@mui/material';

// Default activities if none are provided
const defaultActivities = [
  { id: 1, action: 'Patient Check-in', time: '10:30 AM', staff: 'Dr. Smith' },
  { id: 2, action: 'Lab Results', time: '11:15 AM', staff: 'Nurse Jane' },
  { id: 3, action: 'Prescription', time: '1:45 PM', staff: 'Dr. Lee' },
  { id: 4, action: 'Surgery Completed', time: '3:20 PM', staff: 'Dr. Johnson' },
  { id: 5, action: 'Discharge Processed', time: '4:45 PM', staff: 'Nurse Mark' }
];

const ActivityTable = ({ activities = defaultActivities }) => {
  return (
    <Card sx={{ 
      p: 2, 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
    }}>
      <Typography 
        variant="h6" 
        gutterBottom
        sx={{
          fontFamily: '"Poppins", sans-serif',
          fontWeight: 'bold',
          color: '#008573'
        }}
      >
        Recent Activities
      </Typography>
      
      <Box sx={{ overflow: 'auto', flex: 1 }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ 
                fontWeight: 'bold',
                backgroundColor: '#f5f5f5'
              }}>
                Time
              </TableCell>
              <TableCell sx={{ 
                fontWeight: 'bold',
                backgroundColor: '#f5f5f5'
              }}>
                Action
              </TableCell>
              <TableCell sx={{ 
                fontWeight: 'bold',
                backgroundColor: '#f5f5f5'
              }}>
                Staff
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {activities.map((activity) => (
              <TableRow 
                key={activity.id}
                hover
                sx={{ 
                  '&:last-child td': { borderBottom: 0 },
                  '&:nth-of-type(odd)': { backgroundColor: '#fafafa' }
                }}
              >
                <TableCell sx={{ color: 'text.secondary' }}>{activity.time}</TableCell>
                <TableCell>{activity.action}</TableCell>
                <TableCell sx={{ fontWeight: 'medium' }}>{activity.staff}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Card>
  );
};

export default ActivityTable;