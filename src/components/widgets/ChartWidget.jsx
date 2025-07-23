import { Card, Typography } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 600 },
  { name: "Apr", value: 800 },
  { name: "May", value: 500 },
];

const ChartWidget = ({ compact = false }) => {
  return (
    <Card sx={{ p: compact ? 1 : 1.5, height: "100%" }}>
      <Typography
        variant={compact ? "subtitle2" : "h6"}
        sx={{
          fontFamily: '"Poppins", sans-serif',
          fontWeight: "bold",
          color: "#008573",
        }}
      >
        Monthly Statistics
      </Typography>
      <ResponsiveContainer width="100%" height={compact ? 180 : 220}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
        >
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
          <Line
            type="monotone"
            dataKey="value"
            stroke="#008573"
            strokeWidth={compact ? 1.5 : 2}
            dot={{ r: compact ? 3 : 4 }}
            activeDot={{ r: compact ? 4 : 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default ChartWidget;
