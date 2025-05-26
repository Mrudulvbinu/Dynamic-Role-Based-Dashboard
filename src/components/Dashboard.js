import React, { useState, useEffect } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import useRolePermissions from "../hooks/useRolePermissions";
import { Box, Card, Typography, Button, AppBar, Toolbar, Drawer, IconButton, List, ListItem, ListItemIcon, 
  ListItemText, useMediaQuery, Menu, MenuItem, Checkbox, FormControlLabel } from "@mui/material";
import { ExitToApp, Dashboard as DashboardIcon, Menu as MenuIcon, Settings, Widgets } from "@mui/icons-material";
import StatusCard from "./widgets/StatusCard";
import ChartWidget from "./widgets/ChartWidget";
import ActivityTable from "./widgets/ActivityTable";
import LabResultsPie from "./widgets/LabResultsPie";
import LabTrendsBar from "./widgets/LabTrendsBar";

const ResponsiveGridLayout = WidthProvider(Responsive);

const WIDGET_WIDTH = 4; 
const WIDGET_HEIGHT = 3;
const GRID_COLUMNS = 12;
const ROW_HEIGHT = 120; 
const CONTAINER_PADDING = [20, 30];
const GRID_MARGIN = [20, 20]; 

const Dashboard = ({ role, onLogout }) => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const allWidgets = useRolePermissions(role);
  const [selectedWidgets, setSelectedWidgets] = useState([]);
  const [layouts, setLayouts] = useState({ lg: [] });
  const [widgetMenuAnchor, setWidgetMenuAnchor] = useState(null);

  useEffect(() => {
    const savedWidgets = localStorage.getItem(`selectedWidgets-${role}`);
    const savedLayouts = localStorage.getItem(`dashboardLayout-${role}`);
    
    const initialWidgets = savedWidgets 
      ? JSON.parse(savedWidgets) 
      : allWidgets.map(w => w.id);
      
    const calculateInitialLayout = (widgets) => {
      return widgets.map((widget, index) => ({
        i: widget.id.toString(),
        x: (index % 3) * WIDGET_WIDTH, 
        y: Math.floor(index / 3) * WIDGET_HEIGHT,
        w: WIDGET_WIDTH,
        h: WIDGET_HEIGHT,
        minW: WIDGET_WIDTH,
        maxW: WIDGET_WIDTH,
        minH: WIDGET_HEIGHT,
        maxH: WIDGET_HEIGHT,
        isResizable: false
      }));
    };

    const initialLayouts = savedLayouts 
      ? JSON.parse(savedLayouts)
      : { lg: calculateInitialLayout(allWidgets.filter(w => initialWidgets.includes(w.id))) };

    setSelectedWidgets(initialWidgets);
    setLayouts(initialLayouts);
  }, [role, allWidgets]);

  const handleToggleWidget = (widgetId) => {
    const newSelection = selectedWidgets.includes(widgetId)
      ? selectedWidgets.filter(id => id !== widgetId)
      : [...selectedWidgets, widgetId];
    
    setSelectedWidgets(newSelection);
    
    const visibleWidgets = allWidgets.filter(w => newSelection.includes(w.id));
    const newLayout = visibleWidgets.map((widget, index) => {
      const existingPos = layouts.lg.find(l => l.i === widget.id.toString());
      if (existingPos) return existingPos;
      
      const maxY = layouts.lg.reduce((max, item) => Math.max(max, item.y), -1);
      return {
        i: widget.id.toString(),
        x: (index % 3) * WIDGET_WIDTH,
        y: maxY + WIDGET_HEIGHT,
        w: WIDGET_WIDTH,
        h: WIDGET_HEIGHT,
        isResizable: false
      };
    });
    
    setLayouts({ lg: newLayout });
    localStorage.setItem(`selectedWidgets-${role}`, JSON.stringify(newSelection));
    localStorage.setItem(`dashboardLayout-${role}`, JSON.stringify({ lg: newLayout }));
  };

  const handleLayoutChange = (currentLayout, allLayouts) => {
    const lgLayout = allLayouts.lg.map(item => {
      const snappedX = Math.round(item.x / WIDGET_WIDTH) * WIDGET_WIDTH;
      
      const boundedX = Math.min(Math.max(snappedX, 0), GRID_COLUMNS - WIDGET_WIDTH);
      
      return {
        ...item,
        x: boundedX,
        y: item.y, 
        w: WIDGET_WIDTH,
        h: WIDGET_HEIGHT
      };
    });
    
    setLayouts({ lg: lgLayout });
    localStorage.setItem(`dashboardLayout-${role}`, JSON.stringify({ lg: lgLayout }));
  };

  const handleDragStop = (layout, oldItem, newItem) => {
    const targetWidget = layout.find(item => 
      item.i !== newItem.i && 
      item.x === newItem.x && 
      item.y === newItem.y
    );

    if (targetWidget) {
      const updatedLayout = layout.map(item => {
        if (item.i === newItem.i) {
          return { ...item, x: targetWidget.x, y: targetWidget.y };
        }
        if (item.i === targetWidget.i) {
          return { ...item, x: newItem.x, y: newItem.y };
        }
        return item;
      });

      setLayouts({ lg: updatedLayout });
      localStorage.setItem(`dashboardLayout-${role}`, JSON.stringify({ lg: updatedLayout }));
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleWidgetMenuOpen = (event) => {
    setWidgetMenuAnchor(event.currentTarget);
  };

  const handleWidgetMenuClose = () => {
    setWidgetMenuAnchor(null);
  };

  const visibleWidgets = allWidgets.filter(w => selectedWidgets.includes(w.id));

  const drawerWidth = 220;

  const drawer = (
    <Box
      sx={{
        height: '100%',
        backdropFilter: 'blur(6px)',
        backgroundColor: 'rgba(255, 255, 255, 0.86)',
        boxShadow: '0 8px 32px rgba(14, 17, 71, 0.37)',
        borderRight: '4px solid rgba(255, 255, 255, 0.78)',
        background: 'linear-gradient(120deg, rgba(255, 255, 255, 0.88) 0%, rgba(255, 255, 255, 0.89) 100%)',
      }}
    >
      <List sx={{ pt: 0 }}>
        <ListItem 
          button 
          selected={activeTab === 'dashboard'}
          onClick={() => setActiveTab('dashboard')}
          sx={{
            mt: '64px',
            '&.Mui-selected': {
              backgroundColor: 'rgba(255, 255, 255, 0.94)',
              borderLeft: '3px solid gray'
            },
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              transform: 'scale(1.01)',
              boxShadow: '0 2px 4px rgba(91, 85, 85, 0.3)'
            },
            transition: 'all 0.3s ease',
          }}
        >
          <ListItemIcon sx={{ color: 'black', minWidth: '40px' }}>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Dashboard" 
            primaryTypographyProps={{ 
              color: 'black',
              fontWeight: 'bold',
              fontFamily: '"Poppins", sans-serif'
            }} 
          />
        </ListItem>
        <ListItem 
          button 
          selected={activeTab === 'settings'}
          onClick={() => setActiveTab('settings')}
          sx={{
            '&.Mui-selected': {
              backgroundColor: 'rgba(255, 255, 255, 0.94)',
              borderLeft: '3px solid gray'
            },
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              transform: 'scale(1.01)',
              boxShadow: '0 2px 4px rgba(91, 85, 85, 0.3)'
            },
            transition: 'all 0.3s ease',
          }}
        >
          <ListItemIcon sx={{ color: 'black', minWidth: '40px' }}>
            <Settings />
          </ListItemIcon>
          <ListItemText 
            primary="Settings" 
            primaryTypographyProps={{ 
              color: 'black',
              fontWeight: 'bold',
              fontFamily: '"Poppins", sans-serif'
            }} 
          />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          bgcolor: '#0059b3',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          height: '70px',
          boxShadow: 'none',
        }}
      >
        <Toolbar sx={{ height: '64px', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 3 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h4" sx={{ 
              fontFamily: '"Poppins", sans-serif',
              fontWeight: 'bold',
              color: '#ffffff'
            }}>
              {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<Widgets />}
              onClick={handleWidgetMenuOpen}
              sx={{
                borderRadius: '20px',
                textTransform: 'none',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                borderWidth: '2px',
                borderColor: 'white',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'white',
                  color: 'black',
                  borderWidth: '2px',
                  borderColor: 'white',
                }
              }}
            >
              Widgets
            </Button>
            <Menu
              anchorEl={widgetMenuAnchor}
              open={Boolean(widgetMenuAnchor)}
              onClose={handleWidgetMenuClose}
              PaperProps={{
                style: {
                  maxHeight: '70vh',
                  width: '250px',
                },
              }}
            >
              <MenuItem disabled>
                <Typography variant="subtitle1" fontWeight="bold">Select Widgets</Typography>
              </MenuItem>
              {allWidgets.map((widget) => (
                <MenuItem key={widget.id} onClick={(e) => e.stopPropagation()}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedWidgets.includes(widget.id)}
                        onChange={() => handleToggleWidget(widget.id)}
                        color="primary"
                      />
                    }
                    label={widget.name}
                    sx={{ width: '100%' }}
                  />
                </MenuItem>
              ))}
            </Menu>
            <Button
              variant="outlined"
              color="inherit" 
              startIcon={<ExitToApp />}
              onClick={onLogout}
              sx={{
                borderRadius: '20px',
                textTransform: 'none',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                borderWidth: '2px',
                borderColor: 'white',
                color: 'white', 
                '&:hover': {
                  backgroundColor: 'white',
                  color: 'black',
                  borderWidth: '2px',
                  borderColor: 'white', 
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

      <Box sx={{ display: 'flex', flexGrow: 1, pt: '65px' }}>
        {!isMobile && (
          <Box
            sx={{
              width: drawerWidth,
              flexShrink: 80,
            }}
          >
            <Drawer
              variant="permanent"
              open
              sx={{
                '& .MuiDrawer-paper': {
                  width: drawerWidth,
                  top: '64px',
                  height: 'calc(100vh - 64px)',
                  overflow: 'hidden',
                  borderRight: 'none',
                  background: 'transparent',
                },
              }}
            >
              {drawer}
            </Drawer>
          </Box>
        )}

        {isMobile && (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              '& .MuiDrawer-paper': {
                width: drawerWidth,
                top: '64px',
                height: 'calc(100vh - 64px)',
                overflow: 'hidden',
                borderRight: 'none',
                background: 'transparent',
              },
            }}
          >
            {drawer}
          </Drawer>
        )}

        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1,
            p: 4,
            width: isMobile ? '100%' : `calc(100% - ${drawerWidth}px)`,
            ml: isMobile ? 0 : `${drawerWidth}px`,
            transition: 'margin 225ms cubic-bezier(0, 0, 0.2, 1) 0ms',
            paddingTop: '20px', 
            paddingBottom: '40px'
          }}
        >
          {activeTab === 'dashboard' ? (
            <div className="p-4" style={{ 
  paddingTop: '10px',
  paddingBottom: '30px',
  height: '100%',
  overflow: 'hidden'
}}>
  <ResponsiveGridLayout
    className="layout"
    layouts={layouts}
    onLayoutChange={handleLayoutChange}
    onDragStop={handleDragStop}
    breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
    cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
    rowHeight={ROW_HEIGHT}  
    isDraggable={true}
    isResizable={false}
    margin={GRID_MARGIN}
    containerPadding={CONTAINER_PADDING}
    draggableCancel=".MuiButton-root, .MuiIconButton-root"
    compactType="vertical"
    preventCollision={false} 
    style={{
      minHeight: 'calc(100vh - 200px)',
      backgroundColor: 'transparent'
    }}
  >
    {visibleWidgets.map((widget) => {
      const defaultLayout = {
        x: (visibleWidgets.indexOf(widget) % 3) * WIDGET_WIDTH,
        y: Math.floor(visibleWidgets.indexOf(widget) / 3) * WIDGET_HEIGHT,
        w: WIDGET_WIDTH,
        h: WIDGET_HEIGHT,
        minH: WIDGET_HEIGHT,
        maxH: WIDGET_HEIGHT
      };
      
      const existingLayout = layouts.lg.find(l => l.i === widget.id.toString());
      
      return (
        <div 
          key={widget.id}
          data-grid={existingLayout || defaultLayout}
          style={{
            overflow: 'hidden',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            transition: 'box-shadow 0.3s ease'
          }}
        >
          {/* widget components */}
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
            <Card sx={{ p: 4, height: '100%' }}>
              <Typography>{widget.name}</Typography>
            </Card>
          )}
        </div>
      );
    })}
  </ResponsiveGridLayout>
</div>
          ) : (
            <Card sx={{ p: 4, height: '80%' }}>
              <Typography variant="h4" gutterBottom>
                Settings
              </Typography>
              <Typography>
                Application settings will appear here
              </Typography>
            </Card>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;