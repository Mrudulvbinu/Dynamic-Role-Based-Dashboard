import { Card, Table, TableBody, TableCell, TableHead, 
  TableRow, Typography, Box, Stack } from '@mui/material';
import { History as HistoryIcon } from '@mui/icons-material';

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
      p: 3, 
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <HistoryIcon color="primary" sx={{ fontSize: 40 }} />
        <Typography 
          variant="h6" 
          sx={{
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 'bold',
            color: '#008573'
          }}
        >
          Recent Activities
        </Typography>
      </Stack>
      
      <Box sx={{ 
        overflow: 'auto', 
        flex: 1,
        '&::-webkit-scrollbar': {
          width: '0.4em'
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
          borderRadius: '10px'
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#888',
          borderRadius: '10px'
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: '#555'
        }
      }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ 
                fontWeight: 'bold',
                backgroundColor: '#f5f5f5',
                fontFamily: '"Poppins", sans-serif',
                fontSize: '0.875rem'
              }}>
                Time
              </TableCell>
              <TableCell sx={{ 
                fontWeight: 'bold',
                backgroundColor: '#f5f5f5',
                fontFamily: '"Poppins", sans-serif',
                fontSize: '0.875rem'
              }}>
                Action
              </TableCell>
              <TableCell sx={{ 
                fontWeight: 'bold',
                backgroundColor: '#f5f5f5',
                fontFamily: '"Poppins", sans-serif',
                fontSize: '0.875rem'
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
                <TableCell 
                  sx={{ 
                    color: 'text.secondary',
                    fontFamily: '"Roboto", sans-serif',
                    fontSize: '0.8125rem'
                  }}
                >
                  {activity.time}
                </TableCell>
                <TableCell
                  sx={{
                    fontFamily: '"Roboto", sans-serif',
                    fontSize: '0.8125rem'
                  }}
                >
                  {activity.action}
                </TableCell>
                <TableCell 
                  sx={{ 
                    fontWeight: 'medium',
                    fontFamily: '"Roboto", sans-serif',
                    fontSize: '0.8125rem'
                  }}
                >
                  {activity.staff}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Card>
  );
};

export default ActivityTable;