import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Box,
  Stack,
} from "@mui/material";

const defaultActivities = [
  { id: 1, action: "Patient Check-in", time: "10:30 AM", staff: "Dr. Smith" },
  { id: 2, action: "Lab Results", time: "11:15 AM", staff: "Nurse Jane" },
  { id: 3, action: "Prescription", time: "1:45 PM", staff: "Dr. Lee" },
  { id: 4, action: "Surgery Completed", time: "3:20 PM", staff: "Dr. Johnson" },
  {
    id: 5,
    action: "Discharge Processed",
    time: "4:45 PM",
    staff: "Nurse Mark",
  },
];

const ActivityTable = ({ activities = defaultActivities, compact = false }) => {
  return (
    <Card
      sx={{
        p: compact ? 1 : 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{ mb: compact ? 0.1 : 1 }}
      >
        <Typography
          variant={compact ? "subtitle2" : "h6"}
          sx={{
            fontFamily: '"Poppins", sans-serif',
            fontWeight: "bold",
            color: "#008573",
          }}
        >
          Recent Activities
        </Typography>
      </Stack>

      <Box
        sx={{
          overflow: "auto",
          flex: 1,
          "&::-webkit-scrollbar": {
            width: "0.2em",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#888",
          },
        }}
      >
        <Table size={compact ? "small" : "medium"} stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  backgroundColor: "#f5f5f5",
                  fontFamily: '"Poppins", sans-serif',
                  fontSize: compact ? "0.75rem" : "0.875rem",
                  py: compact ? 0.5 : 1,
                }}
              >
                Time
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  backgroundColor: "#f5f5f5",
                  fontFamily: '"Poppins", sans-serif',
                  fontSize: compact ? "0.75rem" : "0.875rem",
                  py: compact ? 0.5 : 1,
                }}
              >
                Action
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  backgroundColor: "#f5f5f5",
                  fontFamily: '"Poppins", sans-serif',
                  fontSize: compact ? "0.75rem" : "0.875rem",
                  py: compact ? 0.5 : 1,
                }}
              >
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
                  "&:last-child td": { borderBottom: 0 },
                  "&:nth-of-type(odd)": { backgroundColor: "#fafafa" },
                }}
              >
                <TableCell
                  sx={{
                    color: "text.secondary",
                    fontFamily: '"Roboto", sans-serif',
                    fontSize: compact ? "0.6875rem" : "0.8125rem",
                    py: compact ? 0.5 : 0.75,
                  }}
                >
                  {activity.time}
                </TableCell>
                <TableCell
                  sx={{
                    fontFamily: '"Roboto", sans-serif',
                    fontSize: compact ? "0.6875rem" : "0.8125rem",
                    py: compact ? 0.5 : 0.75,
                  }}
                >
                  {activity.action}
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "medium",
                    fontFamily: '"Roboto", sans-serif',
                    fontSize: compact ? "0.6875rem" : "0.8125rem",
                    py: compact ? 0.5 : 0.75,
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
