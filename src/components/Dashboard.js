import React, { useState, useEffect } from "react";
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
  const [selectedWidgets, setSelectedWidgets] = useState([]);
  const [layouts, setLayouts] = useState({ lg: [] });

  useEffect(() => {
    const savedWidgets = localStorage.getItem(`selectedWidgets-${role}`);
    const savedLayouts = localStorage.getItem(`dashboardLayout-${role}`);
    
    const initialWidgets = savedWidgets 
      ? JSON.parse(savedWidgets) 
      : allWidgets.map(w => w.id);
      
    const initialLayouts = savedLayouts 
      ? JSON.parse(savedLayouts)
      : {
          lg: allWidgets.map((widget, index) => ({
            i: widget.id.toString(),
            x: (index % 2) * 2, 
            y: Math.floor(index / 2) * 2,
            w: 4,
            h: 2,
            minW: 2,
            minH: 2,
            isResizable: true,
            isDraggable: true
          }))
        };

    setSelectedWidgets(initialWidgets);
    setLayouts(initialLayouts);
  }, [role, allWidgets]);

  const handleToggleWidget = (widgetId) => {
    const newSelection = selectedWidgets.includes(widgetId)
      ? selectedWidgets.filter(id => id !== widgetId)
      : [...selectedWidgets, widgetId];
    setSelectedWidgets(newSelection);
    localStorage.setItem(`selectedWidgets-${role}`, JSON.stringify(newSelection));
  };

  const handleLayoutChange = (currentLayout, allLayouts) => {
    setLayouts(allLayouts);
    localStorage.setItem(`dashboardLayout-${role}`, JSON.stringify(allLayouts));
  };

  const visibleWidgets = allWidgets.filter(w => selectedWidgets.includes(w.id));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" color="transparent" elevation={0} sx={{ bgcolor: '#000080' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h4" sx={{ 
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 'bold',
            color: '#ffffff'
          }}>
            {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard
          </Typography>
          <Button
  variant="outlined"
  color="inherit" // This makes it adapt to dark backgrounds
  startIcon={<ExitToApp />}
  onClick={onLogout}
  sx={{
    borderRadius: '20px',
    textTransform: 'none',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    transform: 'scale(1)',
    borderWidth: '2px',
    borderColor: 'white', // White outline
    color: 'white', // White text
    '&:hover': {
      backgroundColor: 'white',
      color: 'black',
      transform: 'scale(1.05)',
      borderWidth: '2px',
      borderColor: 'white', // White outline on hover too
      boxShadow: '0 4px 8px rgba(255, 255, 255, 0.3)' // White shadow
    }
  }}
>
  <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' }}}>
    Logout
  </Box>
</Button>
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
          isDraggable={true}
          isResizable={true}
          draggableCancel=".non-draggable" 
          margin={[20, 20]}
          containerPadding={[0, 20]}
          compactType={null} 
          preventCollision={true} 
        >
          {visibleWidgets.map((widget) => (
            <div 
              key={widget.id}
              data-grid={{
                ...layouts.lg.find(l => l.i === widget.id.toString()) || { 
                  x: 0, 
                  y: 0, 
                  w: 4, 
                  h: 3,
                  minW: 2,
                  minH: 2
                }
              }}
            >
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