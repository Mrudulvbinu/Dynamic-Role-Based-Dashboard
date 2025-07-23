import { Card, Typography } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Normal", value: 75 },
  { name: "Abnormal", value: 15 },
  { name: "Critical", value: 10 },
];

const COLORS = ["#008573", "#FFBB28", "#FF8042"];

const LabResultsPie = ({ compact = false }) => {
  return (
    <Card sx={{ p: compact ? 0.5 : 1, height: "110%" }}>
      <Typography
        variant={compact ? "subtitle2" : "h6"}
        sx={{
          fontFamily: '"Poppins", sans-serif',
          fontWeight: "bold",
          color: "#008573",
        }}
      >
        Lab Results Distribution
      </Typography>
      <ResponsiveContainer width="100%" height={compact ? 180 : 220}>
        <PieChart margin={{ top: 0, right: 5, left: 5, bottom: 5 }}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={compact ? 60 : 75}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              fontSize: compact ? 12 : 14,
              padding: compact ? 5 : 8,
              borderRadius: 8,
            }}
          />
          <Legend
            iconSize={compact ? 10 : 12}
            wrapperStyle={{
              fontSize: compact ? 12 : 14,
              paddingTop: compact ? 5 : 10,
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default LabResultsPie;
