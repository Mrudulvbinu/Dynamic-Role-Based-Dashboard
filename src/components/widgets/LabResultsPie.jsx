import { Card, Typography } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Normal', value: 75 },
  { name: 'Abnormal', value: 15 },
  { name: 'Critical', value: 10 }
];

const COLORS = ['#008573', '#FFBB28', '#FF8042'];

const LabResultsPie = () => {
  return (
    <Card sx={{ p: 2, height: '100%'}}>
      <Typography variant="h6" gutterBottom>Lab Results Distribution</Typography>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default LabResultsPie;