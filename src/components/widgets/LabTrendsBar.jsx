import { Card, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', tests: 400, abnormal: 40 },
  { name: 'Feb', tests: 300, abnormal: 30 },
  { name: 'Mar', tests: 600, abnormal: 60 },
  { name: 'Apr', tests: 800, abnormal: 80 },
  { name: 'May', tests: 500, abnormal: 50 },
];

const LabTrendsBar = () => {
  return (
    <Card sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>Monthly Test Trends</Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="tests" fill="#008573" name="Total Tests" />
          <Bar dataKey="abnormal" fill="#FF8042" name="Abnormal Results" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default LabTrendsBar;