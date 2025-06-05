import { Card, Typography } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
];

const ChartWidget = () => {
  return (
    <Card sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>Monthly Statistics</Typography>
      <div style={{ height: 250 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#008573" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default ChartWidget;