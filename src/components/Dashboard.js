import React, { useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import useRolePermissions from "../hooks/useRolePermissions";
import { Box, Card, Typography, Button, AppBar, Toolbar } from "@mui/material";
import { ExitToApp } from "@mui/icons-material";
import StatusCard from "./widgets/StatusCard";
import ChartWidget from "./widgets/ChartWidget";
import ActivityTable from "./widgets/ActivityTable";
import LabResultsPie from "./widgets/LabResultsPie";
import LabTrendsBar from "./widgets/LabTrendsBar";
import WidgetSelector from "./WidgetSelector";

const ResponsiveGridLayout = WidthProvider(Responsive);

const Dashboard = ({ role, onLogout }) => {
  const allWidgets = useRolePermissions(role);
  const [selectedWidgets, setSelectedWidgets] = useState(() => {
    const saved = localStorage.getItem(`selectedWidgets-${role}`);
    return saved ? JSON.parse(saved) : allWidgets.map(w => w.id);
  });
  const [layouts, setLayouts] = useState(() => {
    const saved = localStorage.getItem(`dashboardLayout-${role}`);
    return saved ? JSON.parse(saved) : {
      lg: allWidgets.map((widget, index) => ({
        i: widget.id.toString(),
        x: (index % 4) * 3,
        y: Math.floor(index / 4) * 2,
        w: 3,
        h: 2,
      })),
    };
  });

  const handleToggleWidget = (widgetId) => {
    const newSelection = selectedWidgets.includes(widgetId)
      ? selectedWidgets.filter(id => id !== widgetId)
      : [...selectedWidgets, widgetId];
    setSelectedWidgets(newSelection);
    localStorage.setItem(`selectedWidgets-${role}`, JSON.stringify(newSelection));
  };

  const handleLayoutChange = (_, allLayouts) => {
    setLayouts(allLayouts);
    localStorage.setItem(`dashboardLayout-${role}`, JSON.stringify(allLayouts));
  };

  const visibleWidgets = allWidgets.filter(w => selectedWidgets.includes(w.id));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" color="transparent" elevation={0} sx={{ bgcolor: '#f5f8e5' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h4" sx={{ 
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 'bold',
            color: '#008573'
          }}>
            {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard
          </Typography>
          <Box>
            <Button
              variant="outlined"
              color="error"
              startIcon={<ExitToApp />}
              onClick={onLogout}
              sx={{
                borderRadius: '20px',
                textTransform: 'none',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: 'rgba(244, 67, 54, 0.08)'
                }
              }}
            >
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' }}}>
                Logout
              </Box>
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3, flex: 1 }}>
        <ResponsiveGridLayout
          className="layout"
          layouts={layouts}
          onLayoutChange={handleLayoutChange}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={100}
        >
        {visibleWidgets.map((widget) => (
  <div key={widget.id} data-grid={{ x: 0, y: 0, w: 3, h: 2 }}>
    {widget.type === "status" ? (
      <StatusCard {...widget.config} />
    ) : widget.type === "chart" ? (
      <ChartWidget />
    ) : widget.type === "activity" ? (
      <ActivityTable />
    ) : widget.type === "labPie" ? (
      <LabResultsPie />
    ) : widget.type === "labBar" ? (
      <LabTrendsBar />
    ) : (
      <Card sx={{ p: 2, height: '100%' }}>
        <Typography>{widget.name}</Typography>
      </Card>
    )}
  </div>
))}
        </ResponsiveGridLayout>

        <WidgetSelector
          widgets={allWidgets}
          selectedWidgets={selectedWidgets}
          onToggleWidget={handleToggleWidget}
        />
      </Box>
    </Box>
  );
};

export default Dashboard;