import { Card, Typography } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", tests: 400, abnormal: 40 },
  { name: "Feb", tests: 300, abnormal: 30 },
  { name: "Mar", tests: 600, abnormal: 60 },
  { name: "Apr", tests: 800, abnormal: 80 },
  { name: "May", tests: 500, abnormal: 50 },
];

const LabTrendsBar = ({ compact = false }) => {
  return (
    <Card sx={{ p: compact ? 1 : 1.5, height: "100%" }}>
      <Typography
        variant={compact ? "subtitle2" : "h5"}
        sx={{
          fontFamily: '"Poppins", sans-serif',
          fontWeight: "bold",
          color: "#008573",
        }}
      >
        Monthly Test Trends
      </Typography>
      <ResponsiveContainer width="100%" height={compact ? 180 : 220}>
        <BarChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: compact ? 10 : 12 }}
            tickMargin={compact ? 5 : 8}
          />
          <YAxis
            tick={{ fontSize: compact ? 10 : 12 }}
            tickMargin={compact ? 5 : 8}
          />
          <Tooltip
            contentStyle={{
              fontSize: compact ? 12 : 14,
              padding: compact ? 5 : 8,
              borderRadius: 8,
            }}
          />
          <Bar
            dataKey="tests"
            fill="#008573"
            name="Total Tests"
            radius={[4, 4, 0, 0]}
            barSize={compact ? 20 : 28}
          />
          <Bar
            dataKey="abnormal"
            fill="#FF8042"
            name="Abnormal Results"
            radius={[4, 4, 0, 0]}
            barSize={compact ? 20 : 28}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default LabTrendsBar;
